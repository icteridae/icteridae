import json

from django import http
from django.contrib.postgres.search import SearchQuery, SearchRank  # , SearchVector,TrigramSimilarity
from rest_framework.decorators import api_view

from .models import Paper
from .serializers import PaperSerializer

#from backend.relevance import USING_RELEVANCE as relevance_function
from .similarity import USING_SIMILARITIES as similarity_function_list
from .similarity import PairwiseSimilarity
from .relevance import USING_RELEVANCE


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

    search_query = SearchQuery(query)

    search_result = Paper.objects.filter(search_vector=search_query).annotate(
        rank=SearchRank(
            'search_vector',
            search_query
        )
    ).order_by('-rank')

    max_pages = (search_result.count() - 1) // pagesize

    page = request.query_params.get('page', '0')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    # search_result = Paper.objects.annotate(
    #    similarity=TrigramSimilarity('search_vector', query)
    # ).filter(similarity__gt=0.3).order_by('-similarity')[pagesize * page: pagesize * (page+1)]

    # search_result = Paper.objects.filter(search_vector = search_query)
    # [pagesize * page: pagesize * (page+1)]

    return http.JsonResponse(
        {
            'data': PaperSerializer(search_result[pagesize * page: pagesize * (page + 1)],
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
