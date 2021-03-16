import json

from django import http
from rest_framework.decorators import api_view

from elasticsearch_dsl import query as dsl_query

from ..models import Paper, Author
from ..serializers import PaperSerializer, AuthorSerializer

from ..documents import PaperDocument, AuthorDocument

RELATED_AUTHORS_COUNT = 20
# search cap should be <10.000 with current elasticsearch configuration
SEARCH_CAP = 5000


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

    search_result = Author.objects.filter(name__icontains=query)

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

    max_pages = min((count - 1) // pagesize + 1,
                    (SEARCH_CAP - 1) // pagesize + 1)
    count = min(count, SEARCH_CAP)
    # Limit as elasticsearch has a limit on slices. This can be extended in the future
    # Example for error:
    # - Remove max(...,SEARCH_CAP) in expression above
    # - Search for Gao in Authors
    # - All Results above result 10.0000 should fail to load

    page = request.query_params.get('page', '1')
    if not page.isnumeric() or int(page) > max_pages:
        return http.HttpResponseBadRequest('invalid page number.')
    page = int(page)

    return http.JsonResponse(
        {
            'data': AuthorSerializer(result[pagesize * (page - 1): pagesize * page].to_queryset(),
                                     many=True).data,
            'max_pages': max_pages,
            'count': count,
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
        return http.HttpResponseBadRequest('no id supplied.')

    try:
        author = Author.objects.get(id=author_id)
        return http.JsonResponse(AuthorSerializer(author).data)

    except:
        return http.HttpResponseBadRequest('Author not found')


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

    search_result = Paper.objects.prefetch_related('authors').filter(authors__id=author_id)

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
