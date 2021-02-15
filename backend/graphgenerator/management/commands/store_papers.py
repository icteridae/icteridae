"""module encapsulates code for reading files and storing in postgresql database
"""

from django.db import connection, transaction
from django import db
import json
import time
from ...models import Paper, Author

import os

from tqdm import tqdm
import itertools

# responsible for loading data into database

# each line of data should correspond to a single paper json object
# data can be split into multiple files. specify paths to files in PATHS attribute

# file is optimized to work with a Postgresql database 
# if using another type, querys may have to be modified

VERBOSE_COUNT = 71317  # Frequency of status output

#paper_ids = set()  # do not edit. used for more efficient citation validation

# with large data, this may need a lot of random access memory

def batchify(iterable, n):
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args)

#@profile
def load_papers(files, limit, batch, verbosity=1):
    """
    loads all papers and fields of study into database
    """
    #tr = tracker.SummaryTracker()

    if verbosity > 1: print('Deleting stored papers...')
    
    cursor = connection.cursor()
    cursor.execute("""
        TRUNCATE graphgenerator_fieldofstudy CASCADE;
        TRUNCATE graphgenerator_paper CASCADE;
        DROP INDEX IF EXISTS public.graph_paper_ln_gin_idx;
        DROP INDEX IF EXISTS public.graphgenera_search__7a75a9_gin;
        DROP INDEX IF EXISTS public.graphgenerator_paper_id_97052503_like;
        ALTER TABLE graphgenerator_paper DISABLE TRIGGER ALL;
        """)

    if verbosity > 1: print('Reading papers...')

    for path in files:  # data can be split into multiple files
        with open(path, 'r') as file:
            object_gen = itertools.islice((json.loads(line) for line in file), limit)
            paper_gen = tqdm((Paper(
                    id=data['id'],
                    title=data['title'],
                    paperAbstract=data['paperAbstract'],
                    year=data['year'],
                    s2Url=data['s2Url'],
                    doiUrl=data['doiUrl'],
                    venue=data['venue'],
                    journalName=data['journalName'],
                    journalVolume=data['journalVolume'],
                    journalPages=data['journalPages'].strip(), 
                    doi=data['doi'],
                    magId=data['magId'],
                    fieldsOfStudy=data['fieldsOfStudy'],
                    pdfUrls=data['pdfUrls'],

                    citations=len(data['inCitations']),
                    references=len(data['outCitations'])
                ) for data in object_gen), total=limit)

            for papers in batchify(paper_gen, batch):
                nxt = list(filter(lambda x:x!=None, papers))
                Paper.objects.bulk_create(nxt)
                db.reset_queries()

        del file, object_gen, paper_gen, papers, nxt
        

    if verbosity > 1: print('Rebuilding indexes...')

    cursor.execute("""  CREATE INDEX graph_paper_ln_gin_idx
                            ON public.graphgenerator_paper USING gin
                            (title COLLATE pg_catalog."default" gin_trgm_ops)
                            TABLESPACE pg_default;
                        CREATE INDEX graphgenera_search__7a75a9_gin
                            ON public.graphgenerator_paper USING gin
                            (search_vector)
                            TABLESPACE pg_default;
                        CREATE INDEX graphgenerator_paper_id_97052503_like
                            ON public.graphgenerator_paper USING btree
                            (id COLLATE pg_catalog."default" varchar_pattern_ops ASC NULLS LAST)
                            TABLESPACE pg_default;
                            
                        ALTER TABLE graphgenerator_paper ENABLE TRIGGER ALL;""")

    #tr.print_diff()


def load_authors(files, limit, batch, verbosity=1):
    """
    loads all authors into database
    """

    if verbosity > 1: print('Deleting stored authors...')

    cursor = connection.cursor()
    cursor.execute("""
        TRUNCATE graphgenerator_author;
        ALTER TABLE graphgenerator_author DISABLE TRIGGER ALL;
    """)
    if verbosity > 1: print('Reading authors (saving)...')

    for path in files:
        with open(path) as file:

            object_gen = itertools.islice((json.loads(line) for line in file), limit)
            author_gen = tqdm((Author(
                    name=author['name'],
                    id=author['ids'][0] if len(author['ids']) > 0 else data['id']
                ) for data in object_gen for author in data['authors']))


            for authors in batchify(author_gen, batch):
                Author.objects.bulk_create(filter(lambda x:x!=None, authors), ignore_conflicts=True)
                db.reset_queries()

    cursor.execute("""
        ALTER TABLE graphgenerator_author ENABLE TRIGGER ALL;
    """)

def connect_authors(files, limit, batch, verbosity=1):
    """
    connects all authors to respective paper
    """
    if verbosity > 1: print('Reading authors (connecting)...')

    ThroughModel = Paper.authors.through

    cursor = connection.cursor()
    cursor.execute("""
        DROP INDEX IF EXISTS public.graphgenerator_paper_authors_author_id_736e7be2;
        DROP INDEX IF EXISTS public.graphgenerator_paper_authors_paper_id_591aff60;
        DROP INDEX IF EXISTS public.graphgenerator_paper_authors_paper_id_591aff60_like;
        ALTER TABLE graphgenerator_author DISABLE TRIGGER ALL;
        """)


    for path in files:
        with open(path) as file:
            
            object_gen = itertools.islice((json.loads(line) for line in file), limit)
            author_through_gen = tqdm((ThroughModel(paper_id=data['id'],
                    author_id=author['ids'][0] if len(author['ids']) > 0 else data['id']
                ) for data in object_gen for author in data['authors']))

            for through in batchify(author_through_gen, batch):
                ThroughModel.objects.bulk_create(filter(lambda x:x!=None, through), ignore_conflicts=True)
                db.reset_queries()

    cursor.execute("""  CREATE INDEX graphgenerator_paper_authors_author_id_736e7be2
                            ON public.graphgenerator_paper_authors USING btree
                            (author_id COLLATE pg_catalog."default" ASC NULLS LAST)
                            TABLESPACE pg_default;

                        CREATE INDEX graphgenerator_paper_authors_paper_id_591aff60
                            ON public.graphgenerator_paper_authors USING btree
                            (paper_id COLLATE pg_catalog."default" ASC NULLS LAST)
                            TABLESPACE pg_default;
                        
                        CREATE INDEX graphgenerator_paper_authors_paper_id_591aff60_like
                            ON public.graphgenerator_paper_authors USING btree
                            (paper_id COLLATE pg_catalog."default" varchar_pattern_ops ASC NULLS LAST)
                            TABLESPACE pg_default;
                            
                        ALTER TABLE graphgenerator_author ENABLE TRIGGER ALL;""")

def connect_citations(files, limit, batch, verbosity=1):
    """
    add citation relation to all papers in the dataset
    citations of papers not in the source data will not be included
    """

    if verbosity > 1: print('Reading citations...')
    cursor = connection.cursor()
    cursor.execute("""
        ALTER TABLE "graphgenerator_paper_inCitations" DISABLE TRIGGER ALL;
    """)

    Paper.inCitations.through.objects.all().delete()  # delete previous data
    ThroughModel = Paper.inCitations.through  # through model allows for better performance

    for path in files:
        with open(path) as file:
            
            object_gen = itertools.islice((json.loads(line) for line in file), limit)
            citation_gen = tqdm((ThroughModel(
                from_paper_id=data['id'],
                to_paper_id=inCitation
                ) for data in object_gen for inCitation in data['inCitations']))

            for through in batchify(citation_gen, batch):
                ThroughModel.objects.bulk_create(filter(lambda x:x!=None, through), ignore_conflicts=True)
                db.reset_queries()

    cursor.execute("""
        ALTER TABLE "graphgenerator_paper_inCitations" ENABLE TRIGGER ALL;
    """)

def create_search_index(files, limit, batch, verbosity=1):
    if verbosity > 1: print('Creating vectors for search index...')
    Paper.objects.update(
        search_vector=SearchVector('title', 'year')) #+ SearchVector('paperAbstract', weight='B'))


def load(limit, batch, verbosity, files):
    if files == None: files = []
    file_path = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.join(file_path, '..', '..', '..', 'data')
    paths = [os.path.join(base_path, file) for file in os.listdir(base_path) if file!='.gitignore' and (file in files or not files)]

    start = time.time() 

    for step in [load_papers, connect_citations, load_authors, connect_authors]:
        if verbosity > 0: print('Performing step:', step.__name__)
        step(paths, limit, batch, verbosity)
        if verbosity > 0: print('Finished', step.__name__, 'in', time.time() - start, '(s)')
        start = time.time()

