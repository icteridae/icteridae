from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet
from django.db.models import Count, F, Value
from django.db.models import Q
from django.db import connection

MAX_ELEMENTS = 20


def title_similarity(root: Paper, query_set: QuerySet):
    search_result = Paper.objects.annotate(
        similarity=TrigramSimilarity('title', root.title)
    ).filter(similarity__gt=0.4).order_by('-similarity')
    return search_result[:MAX_ELEMENTS]


def citation_relevance(root: Paper, query_set: QuerySet):

    print('get relevant')
    result = [root] + list((root.inCitations.all() | root.outCitations.all()).all()[:MAX_ELEMENTS - 1])
    print('done relevant')
    return result


def bibliographic_coupling_relevance(root: Paper, query_set: QuerySet):

    return Paper.objects.raw(f"""   SELECT * FROM 
                                    "graphgenerator_paper" as papers 
                                    WHERE id in
                                    (SELECT cit.to_paper_id FROM 
                                        (SELECT from_paper_id 
                                            FROM "graphgenerator_paper_inCitations" 
                                            WHERE to_paper_id = '{root.id}') as layer
                                        JOIN "graphgenerator_paper_inCitations" as cit ON layer.from_paper_id = cit.from_paper_id
                                        GROUP BY cit.to_paper_id
                                        ORDER BY COUNT(*) DESC
                                        LIMIT {MAX_ELEMENTS});     """)



def cocitation_relevance(root: Paper, query_set: QuerySet):

    return Paper.objects.raw(f"""   SELECT * FROM 
                                    "graphgenerator_paper" as papers 
                                    WHERE id in
                                    (SELECT cit.from_paper_id FROM 
                                        (SELECT to_paper_id 
                                            FROM "graphgenerator_paper_inCitations" 
                                            WHERE from_paper_id = %s) as layer
                                        JOIN "graphgenerator_paper_inCitations" as cit ON layer.to_paper_id = cit.to_paper_id
                                        GROUP BY cit.from_paper_id
                                        ORDER BY COUNT(*) DESC
                                        LIMIT {MAX_ELEMENTS});     """, [root.id])                                        


USING_RELEVANCE = cocitation_relevance