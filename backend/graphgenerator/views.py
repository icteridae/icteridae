import json

from django import http
from django.contrib.postgres.search import SearchQuery, SearchRank  # , SearchVector,TrigramSimilarity
from rest_framework.decorators import api_view

from elasticsearch_dsl import query as dsl_query

from .models import Paper
from .serializers import PaperSerializer

#from backend.relevance import USING_RELEVANCE as relevance_function
from .similarity import USING_SIMILARITIES as similarity_function_list
from .similarity import PairwiseSimilarity
from .relevance import USING_RELEVANCE

from .documents import PaperDocument

SATURATION_PIVOT = 100
BOOST_MAGNITUDE = 2.5

# Create your views here.
@api_view(['GET'])
def search(request):
    """
    returns a list of papers depending on the search query

    request needs to have 'query':str field
    """

    query = request.query_params.get('query', None)
    if query is None:
        return http.HttpResponseBadRequest('no query supplied.')

    pagesize = request.query_params.get('pagesize', '20')
    if not pagesize.isnumeric() or int(pagesize) < 1:
        return http.HttpResponseBadRequest('invalid page size.')
    pagesize = int(pagesize)

    match_query = dsl_query.Match(title={'query': query})
    citation_query = dsl_query.RankFeature(field='citations', saturation={'pivot': SATURATION_PIVOT}, boost=BOOST_MAGNITUDE) # Create query to boost results with high citations

    full_query = match_query & citation_query # Combine two queries above

    result = PaperDocument.search().query(full_query)

    max_pages = (result.count() - 1) // pagesize + 1

    page = request.query_params.get('page', '1')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': PaperSerializer(result[pagesize * (page - 1): pagesize * page].to_queryset(),
                                    many=True).data,
            'max_pages': max_pages
        },
        safe=False)

@api_view(['GET'])
def generate_graph(request):
    """
    finds relevant papers
    generates a tensor with paper similarities of relevant papers

    request needs to have 'paper_id':any field
    """
    paper_id = request.query_params.get('paper_id', None)
    try:
        paper = Paper.objects.get(id=paper_id)
    except:
        return http.HttpResponseBadRequest('Paper not found')
    relevant = USING_RELEVANCE(paper, Paper.objects.all())
    
    similarities = [{'name': Sim().name, 'description': Sim().description} for Sim in similarity_function_list]
    tensor = [[[Sim().similarity(p1, p2) for p2 in relevant] for p1 in relevant]
                 if issubclass(Sim, PairwiseSimilarity) or True else 
                 Sim().similarity(relevant) 
                 for Sim in similarity_function_list]
    return http.JsonResponse({'tensor': tensor,
                              'paper': PaperSerializer(relevant, many=True).data,
                              'similarities': similarities})


@api_view(['GET'])
def get_paper(request):
    """
    returns paper metadata based on (some tbd) id

    request needs to have 'paper_id':any field
    """

    print(request.query_params)
    paper_id = request.query_params.get('paper_id', None)

    if paper_id is None:
        return http.HttpResponseBadRequest('Missing attribute: paper_id')

    try:
        paper = Paper.objects.get(id=paper_id)
        return http.JsonResponse(PaperSerializer(paper).data)
    except:
        return http.HttpResponseBadRequest('Paper not found')



@api_view(['POST'])
def get_paper_bulk(request):
    """
    returns paper metadata based on list of ids

    request needs to have 'paper_ids':list<str> field in body
    """
    
    data = json.loads(request.body)
    paper_ids = data.get('paper_ids', None)

    if paper_ids is None:
        return http.HttpResponseBadRequest('Missing attribute: paper_ids')

    try:
        papers = Paper.objects.in_bulk(id_list=paper_ids, field_name='id')
        return http.JsonResponse(PaperSerializer([papers[id] for id in paper_ids], many=True).data, safe=False)
    except:
        return http.HttpResponseBadRequest('Paper not found')
