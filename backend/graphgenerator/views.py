import json

from django import http
from rest_framework.decorators import api_view
from django.views.decorators.cache import cache_page

from elasticsearch_dsl import query as dsl_query

from .models import Paper
from .serializers import PaperSerializer

from .similarity import PairwiseSimilarity, USING_SIMILARITIES as SIMILARITY_FUNCTION_LIST
from .relevance import USING_RELEVANCE

from .documents import PaperDocument

SATURATION_PIVOT = 100
BOOST_MAGNITUDE = 2.5
# search cap should be <10.000 with current elasticsearch configuration
SEARCH_CAP = 5000


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

    title_query = dsl_query.Match(title={'query': query})
    # author_query = dsl_query.Match(authors__name={'query': query})

    match_query = title_query  # | author_query #dsl_query.MultiMatch(query=query, fields=['title', 'authors.name'])
    citation_query = dsl_query.RankFeature(field='citations', saturation={'pivot': SATURATION_PIVOT},
                                           boost=BOOST_MAGNITUDE)  # Create query to boost results with high citations

    full_query = match_query & citation_query  # Combine two queries above

    result = PaperDocument.search().query(full_query)

    count = result.count()

    if count <= 0:
        return http.JsonResponse(
            {
                'data': PaperSerializer([], many=True).data,
                'max_pages': 0,
                'count': 0
            },
            safe=False)

    max_pages = min((count - 1) // pagesize + 1, (SEARCH_CAP - 1) // pagesize + 1)
    count = min(count, SEARCH_CAP)

    page = request.query_params.get('page', '1')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': PaperSerializer(result[pagesize * (page - 1): pagesize * page].to_queryset(),
                                    many=True).data,
            'max_pages': max_pages,
            'count': count
        },
        safe=False)


@api_view(['GET'])
@cache_page(60 * 60 * 12)
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

    similarities = [{'name': Sim().name, 'description': Sim().description} for Sim in SIMILARITY_FUNCTION_LIST]
    tensor = [[[Sim().similarity(p1, p2) for p2 in relevant] for p1 in relevant]
              if issubclass(Sim, PairwiseSimilarity) or True else
              Sim().similarity(relevant)
              for Sim in SIMILARITY_FUNCTION_LIST]
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
        return http.JsonResponse(
            PaperSerializer([papers[paper_id] for paper_id in paper_ids if paper_id in papers], many=True).data,
            safe=False)
    except:
        return http.HttpResponseBadRequest('Paper not found')
