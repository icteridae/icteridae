import json

from django import http
from django.contrib.postgres.search import SearchQuery, SearchRank  # , SearchVector,TrigramSimilarity
from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from elasticsearch_dsl import query as dsl_query

from .models import Paper
from .models import Author
from .serializers import PaperSerializer
from .serializers import AuthorSerializer

#from backend.relevance import USING_RELEVANCE as relevance_function
from .similarity import USING_SIMILARITIES as similarity_function_list
from .similarity import PairwiseSimilarity
from .relevance import USING_RELEVANCE

from .documents import PaperDocument, AuthorDocument

SATURATION_PIVOT = 100
BOOST_MAGNITUDE = 2.5
RELATED_AUTHORS_COUNT = 20

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

    match_query = title_query # | author_query #dsl_query.MultiMatch(query=query, fields=['title', 'authors.name'])
    citation_query = dsl_query.RankFeature(field='citations', saturation={'pivot': SATURATION_PIVOT}, boost=BOOST_MAGNITUDE) # Create query to boost results with high citations

    full_query = match_query & citation_query # Combine two queries above

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

    max_pages = min((count - 1) // pagesize + 1, 5000/pagesize)

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
@cache_page(60*60*12)
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
        return http.JsonResponse(PaperSerializer([papers[id] for id in paper_ids if id in papers], many=True).data, safe=False)
    except:
        return http.HttpResponseBadRequest('Paper not found')

@api_view(['GET'])
def search_author(request):
    """
    returns a list of authors depending on the search query

    request needs to have 'query':str field
    """

    query = request.query_params.get('query', None)
    if query is None:
        return http.HttpResponseBadRequest('no query supplied.')

    pagesize = request.query_params.get('pagesize', '40')
    if not pagesize.isnumeric() or int(pagesize) < 1:
        return http.HttpResponseBadRequest('invalid page size.')
    pagesize = int(pagesize)


    name_query = dsl_query.Match(name={'query': query})
    result = AuthorDocument.search().query(name_query)

    search_result = Author.objects.filter(name__icontains = query)

    count = result.count()

    if count <= 0:
        return http.JsonResponse(
        {
            'data': PaperSerializer([],
                                    many=True).data,
            'max_pages': 0,
            'count': 0
        },
        safe=False)

    max_pages = min((count - 1) // pagesize + 1, 5000/pagesize) # Limit to 200 as elasticsearch has a limit on slices. This can be extended in the future
    # Example for error:
    # - Remove max(...,200) in expression above
    # - Search for Gao in Authors
    # - All Results above Page 250 should fail to load

    page = request.query_params.get('page', '1')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': AuthorSerializer(result[pagesize * (page - 1): pagesize * page].to_queryset(),
                                    many=True).data,
            'max_pages': max_pages
        },
        safe=False)

@api_view(['GET'])
def get_author(request):
    """
    returns author metadata based on id

    request needs to have 'author_id':any field
    """

    author_id = request.query_params.get('author_id', None)
    if author_id is None:
        return http.HttpResponseBadRequest('no query supplied.')

    pagesize = request.query_params.get('pagesize', '20')
    if not pagesize.isnumeric() or int(pagesize) < 1:
        return http.HttpResponseBadRequest('invalid page size.')
    pagesize = int(pagesize)

    search_result = Author.objects.filter(id = author_id)

    max_pages = (search_result.count() - 1) // pagesize

    page = request.query_params.get('page', '0')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': AuthorSerializer(search_result[pagesize * page: pagesize * (page + 1)],
                                    many=True).data,
            'max_pages': max_pages
        },
        safe=False)

@api_view(['GET'])
def get_authorpapers(request):
    """
    returns papers written by author based on id

    request needs to have 'author_id':any field
    """

    author_id = request.query_params.get('author_id', None)
    if author_id is None:
        return http.HttpResponseBadRequest('no query supplied.')

    pagesize = request.query_params.get('pagesize', '20')
    if not pagesize.isnumeric() or int(pagesize) < 1:
        return http.HttpResponseBadRequest('invalid page size.')
    pagesize = int(pagesize)

    search_result = Paper.objects.prefetch_related('authors').filter(authors__id = author_id)

    count = search_result.count()
    max_pages = (count - 1) // pagesize + 1

    page = request.query_params.get('page', '1')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': PaperSerializer(search_result[pagesize * (page - 1): pagesize * page],
                                    many=True).data,
            'max_pages': max_pages,
            'count': count
        },
        safe=False)

@api_view(['GET'])
def get_author_details(request):
    """
    returns papers written by author based on id

    request needs to have 'author_id':any field
    """

    author_id = request.query_params.get('author_id', None)
    if author_id is None:
        return http.HttpResponseBadRequest('no query supplied.')

    results = Author.objects.raw(f"""SELECT a2.id, a2.name FROM 
	graphgenerator_author as a1 
	JOIN graphgenerator_authorpaper as ap1 
	ON a1.id = ap1.author_id 
	
	JOIN graphgenerator_authorpaper as ap2
	ON ap1.paper_id = ap2.paper_id AND NOT ap2.author_id = a1.id
	
	JOIN graphgenerator_author as a2
	ON ap2.author_id = a2.id
		WHERE a1.id = '{author_id}'
		GROUP BY a2.id
		ORDER BY COUNT(*) DESC
		LIMIT {RELATED_AUTHORS_COUNT};""")

    return http.JsonResponse(
        {
            'data': AuthorSerializer(results,
                                    many=True).data,
        },
        safe=False)