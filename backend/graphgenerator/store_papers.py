"""module encapsulates code for reading files and storing in postgresql database
"""

from django.db import connection, transaction
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
import json
import time
from .models import Paper, Author, FieldOfStudy

# responsible for loading data into database

# each line of data should correspond to a single paper json object
# data can be split into multiple files. specify paths to files in PATHS attribute

# file is optimized to work with a Postgresql database 
# if using another type, querys may have to be modified

PAPER_BATCH = 1000  # batch size of bulk inserts. increase for better performance, decrease for less RAM usage
VERBOSE_COUNT = 71317  # Frequency of status output
BREAK_POINT = None  # Use reduced files for debugging. Otherwise set to None
PATHS = ['result0.json', 'result4.json']

#paper_ids = set()  # do not edit. used for more efficient citation validation


# with large data, this may need a lot of random access memory

@transaction.atomic
def load_papers():
    """
    loads all papers and fields of study into database
    """

    #paper_ids.clear()  # IDs are saved for citation validation

    print('Deleting stored papers...')
    cursor = connection.cursor()

    cursor.execute('TRUNCATE graphgenerator_fieldofstudy CASCADE;')
    cursor.execute('TRUNCATE graphgenerator_paper CASCADE;')
    cursor.execute("""
    DROP INDEX IF EXISTS public.graph_paper_ln_gin_idx;
    DROP INDEX IF EXISTS public.graphgenera_search__7a75a9_gin;
    DROP INDEX IF EXISTS public.graphgenerator_paper_id_97052503_like;
    ALTER TABLE graphgenerator_paper DISABLE TRIGGER ALL;""")

    fields = set()

    print('Reading papers...')

    for pathid, path in enumerate(PATHS):  # data can be split into multiple files
        with open(path, 'r') as file:
            papers = []
            for idx, line in enumerate(file):

                if idx % VERBOSE_COUNT == 0: print(f'...(~{100 * idx / 2500000}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)
                papers.append(Paper(
                    id=data['id'],
                    title=data['title'],
                    paperAbstract=data['paperAbstract'],
                    year=data['year'],
                    s2Url=data['s2Url'],
                    doiUrl=data['doiUrl'],
                    # add any new attributes here

                    citations=len(data['inCitations']),
                    references=len(data['outCitations'])
                )
                )  # create paper objects.
                #paper_ids.add(data['id'])

                for field in data['fieldsOfStudy']:
                    fields.add(field)

                if idx == BREAK_POINT: break  # only read first BREAK_POINT lines. Use for debugging

                if idx % PAPER_BATCH == 0:
                    Paper.objects.bulk_create(papers)
                    papers = []

            Paper.objects.bulk_create(papers)

    FieldOfStudy.objects.bulk_create([FieldOfStudy(field=field) for field in fields])

    print('Rebuilding indexes...')

    cursor.execute("""  CREATE INDEX graph_paper_ln_gin_idx
                            ON public.graphgenerator_paper USING gin
                            (title COLLATE pg_catalog."default" gin_trgm_ops)
                            TABLESPACE pg_default;
                        CREATE INDEX graphgenera_search__7a75a9_gin
                            ON public.graphgenerator_paper USING gin
                            (search_vector)
                            TABLESPACE pg_default;516d77825c544fba6760c3
                        CREATE INDEX graphgenerator_paper_id_97052503_like
                            ON public.graphgenerator_paper USING btree
                            (id COLLATE pg_catalog."default" varchar_pattern_ops ASC NULLS LAST)
                            TABLESPACE pg_default;
                            
                        ALTER TABLE graphgenerator_paper ENABLE TRIGGER ALL;""")


# time for 2000000 entries:     
# start: 19:17:00 ################################
# end: 

def load_authors():
    """
    loads all authors into database
    """

    print('Deleting stored authors...')
    cursor = connection.cursor()
    cursor.execute('TRUNCATE graphgenerator_author;')
    cursor.execute("""
        ALTER TABLE graphgenerator_author DISABLE TRIGGER ALL;
    """)
    print('Reading authors (saving)...')

    for pathid, path in enumerate(PATHS):
        with open(path) as file:
            authors = []
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100 * idx / 2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)

                authors.extend([Author(
                    name=author['name'],
                    id=author['ids'][0] if len(author['ids']) > 0 else data['id']
                ) for author in data['authors']])

                if idx == BREAK_POINT: break

                if idx % PAPER_BATCH == 0:
                    Author.objects.bulk_create(authors, ignore_conflicts=True)
                    authors = []


            Author.objects.bulk_create(authors, ignore_conflicts=True)

    cursor.execute("""
        ALTER TABLE graphgenerator_author ENABLE TRIGGER ALL;
    """)



def connect_authors():
    """
    connects all authors to respective paper
    """
    print('Reading authors (connecting)...')

    ThroughModel = Paper.authors.through

    cursor = connection.cursor()
    cursor.execute("""
    DROP INDEX IF EXISTS public.graphgenerator_paper_authors_author_id_736e7be2;
    DROP INDEX IF EXISTS public.graphgenerator_paper_authors_paper_id_591aff60;
    DROP INDEX IF EXISTS public.graphgenerator_paper_authors_paper_id_591aff60_like;
    ALTER TABLE graphgenerator_author DISABLE TRIGGER ALL;
    """)


    for pathid, path in enumerate(PATHS):
        with open(path) as file:
            models = []
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100 * idx / 2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)

                models.extend([
                    ThroughModel(paper_id=data['id'],
                                 author_id=author['ids'][0] if len(author['ids']) > 0 else data['id'])
                    for author in data['authors']
                ])

                if idx == BREAK_POINT: break

                if idx % PAPER_BATCH == 0 and idx > 0:
                    ThroughModel.objects.bulk_create(models, ignore_conflicts=True)
                    models = []

            ThroughModel.objects.bulk_create(models, ignore_conflicts=True)

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

def connect_citations():
    """
    add citation relation to all papers in the dataset
    citations of papers not in the source data will not be included
    """

    print('Reading citations...')
    cursor = connection.cursor()
    cursor.execute("""
        ALTER TABLE "graphgenerator_paper_inCitations" DISABLE TRIGGER ALL;
    """)

    Paper.inCitations.through.objects.all().delete()  # delete previous data
    ThroughModel = Paper.inCitations.through  # through model allows for better performance

    for pathid, path in enumerate(PATHS):
        with open(path) as file:
            models = []
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100 * idx / 2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)

                models.extend([
                    ThroughModel(from_paper_id=data['id'],
                                 to_paper_id=inCitation)
                    for inCitation in data['inCitations'] #if inCitation in paper_ids
                ])
                #models.extend([
                #    ThroughModel(from_paper_id=outCitation,
                #                 to_paper_id=data['id'])
                #    for outCitation in data['outCitations'] if outCitation in paper_ids
                #])  # include citations in both directions

                if idx == BREAK_POINT: break

                if idx % PAPER_BATCH == 0 and idx > 0:
                    ThroughModel.objects.bulk_create(models, ignore_conflicts=True)
                    models = []

            ThroughModel.objects.bulk_create(models, ignore_conflicts=True)

    cursor.execute("""
        ALTER TABLE "graphgenerator_paper_inCitations" ENABLE TRIGGER ALL;
    """)


def create_search_index():
    print('Creating vectors for search index...')
    Paper.objects.update(
        search_vector=SearchVector('title', 'year')) #+ SearchVector('paperAbstract', weight='B'))


def load():
    start = time.time() 
    load_papers()
    print('Loaded papers (s):', (time.time() - start))
    alt = time.time() 
    connect_citations()
    print('Connected citations (s):', (time.time() - alt))
    alt = time.time() 
    load_authors()
    print('Loaded authors (s):', (time.time() - alt))
    alt = time.time() 
    connect_authors()
    print('Connected authors (s):', (time.time() - alt))
    alt = time.time() 
    create_search_index()
    print('Created search index (s):', (time.time() - alt))
    print('Done (s):', (time.time() - start))
