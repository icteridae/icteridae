from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet


MAX_ELEMENTS = 20


def title_similarity(root: Paper, query_set: QuerySet):
    search_result = Paper.objects.annotate(
        similarity=TrigramSimilarity('title', root.title)
    ).filter(similarity__gt=0.4).order_by('-similarity')
    return search_result[:MAX_ELEMENTS]
    

USING_RELEVANCE = title_similarity