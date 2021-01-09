import json

from .models import Paper, Author, FieldOfStudy, PdfUrl
from django.db import transaction

PAPER_BATCH = 100000 # batch size of bulk inserts. increase for better performance, decrease for less RAM usage
VERBOSE_COUNT = 17317 # Frequency of status output
BREAK_POINT = 1000000 # Use reduced files for debugging. Otherwise set to None
PATHS = [f'result{i}.json'for i in range(2)] 

paper_ids = set() # do not edit. used for citation validation

def load_papers():
    """
    Loads all papers and fields of study into database
    """
    paper_ids.clear() # IDs are saved for citation validation

    print('Deleting stored papers...')
    Paper.objects.all().delete()
    FieldOfStudy.objects.all().delete()
    
    fields = set()
    
    print('Reading papers...')

    for pathid, path in enumerate(PATHS): # data can be split into multiple files
        papers = []
        with open(path, 'r') as file:
            for idx, line in enumerate(file):
                
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100*idx/2500000}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)
                papers.append(Paper(
                    id = data['id'],
                    title = data['title'],
                    paperAbstract = data['paperAbstract'],
                    year = data['year'],
                    s2Url = data['s2Url'],
                    doiUrl = data['doiUrl']
                    # add any new attributes here
                    )
                ) # create paper objects. 
                paper_ids.add(data['id'])

                for field in data['fieldsOfStudy']:
                    fields.add(field)

                if idx % PAPER_BATCH == 0:
                    print('Pushing to database...')
                    Paper.objects.bulk_create(papers)
                    papers = []

                if idx == BREAK_POINT: break # only read first BREAK_POINT lines. Use for debugging
            
            print('Pushing to database...')
            Paper.objects.bulk_create(papers)

    FieldOfStudy.objects.bulk_create([FieldOfStudy(field=field) for field in fields])
            

def load_authors():
    """
    Loads all authors into database
    """

    print('Deleting stored authors...')
    Author.objects.all().delete()
    print('Reading authors (saving)...')

    for pathid, path in enumerate(PATHS):
        authors = []
        with open(path) as file:
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100*idx/2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)
                
                authors.extend([Author(
                    name = author['name'],
                    id = author['ids'][0] if len(author['ids']) > 0 else data['id']
                ) for author in data['authors']])

                if idx % PAPER_BATCH == 0:
                    print('Pushing to database...')
                    Author.objects.bulk_create(authors, ignore_conflicts=True)
                    authors = []

                if idx == BREAK_POINT: break

            print('Pushing to database...')
            Author.objects.bulk_create(authors, ignore_conflicts=True)


def connect_authors():
    """
    Connects all authors to respective paper
    """
    print('Reading authors (connecting)...')
    models = []
    
    ThroughModel = Paper.authors.through
    for pathid, path in enumerate(PATHS):
        authors = []
        with open(path) as file:
    
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100*idx/2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)
                
                models.extend([
                    ThroughModel(paper_id=data['id'],
                                author_id=author['ids'][0] if len(author['ids']) > 0 else data['id'])
                    for author in data['authors']
                ])

                if idx % PAPER_BATCH == 0 and idx > 0:
                    print('Pushing to database...')
                    ThroughModel.objects.bulk_create(models, ignore_conflicts=True)
                    models = []

                if idx == BREAK_POINT: break

        ThroughModel.objects.bulk_create(models, ignore_conflicts=True)


def connect_citations():
    """
    Add citation relation to all papers in the dataset
    Citations of papers not in the source data will not be included
    """

    print('Reading citations...')
    models = []

    Paper.inCitations.through.objects.all().delete() # delete previous data
    ThroughModel = Paper.inCitations.through # through model allows for better performance

    for pathid, path in enumerate(PATHS):
        authors = []
        with open(path) as file:
    
            for idx, line in enumerate(file):
                if idx % VERBOSE_COUNT == 0: print(f'...(~{100*idx/2311301}%)', f'({pathid + 1}/{len(PATHS)})')

                data = json.loads(line)
                
                models.extend([
                    ThroughModel(from_paper_id=data['id'],
                                to_paper_id=inCitation)
                    for inCitation in data['inCitations'] if inCitation in paper_ids
                ])
                models.extend([
                    ThroughModel(from_paper_id=outCitation,
                                to_paper_id=data['id'])
                    for outCitation in data['outCitations'] if outCitation in paper_ids
                ]) # include citations in both directions

                if idx % PAPER_BATCH == 0 and idx > 0:
                    print('Pushing to database...')
                    ThroughModel.objects.bulk_create(models, ignore_conflicts=True)
                    models = []

                if idx == BREAK_POINT: break

        ThroughModel.objects.bulk_create(models, ignore_conflicts=True)
                


def load():
    load_papers()
    connect_citations()
    load_authors()
    connect_authors()
    return

    