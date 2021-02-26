from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet
from django.db.models import Count, F, Value
from django.db.models import Q
from django.db import connection

"""
Developer Interface for introducing new relevance metrics. 

Example relevance metrics are defined below.

What is a relevance metric?
- relevance metrics are used to determine which papers to include in the graph.

How is a relevance metric defined?
- relevance metrics are defined as functions of the root node and a queryset or all nodes. They should return an iterable of relevant papers. 

Which relevance metric is used?
- the relevance metric is defined in the USING_RELEVANCE variable at the bottom of this file. Set the variable to a reference of the chosen function.

What should I consider in a relevance function?
- the given queryset is very large. strongly consider runtime when designing a relevance metric.

How can I use multiple relevance metrics?
- Combining multiple metrics can be done in many ways. Define a new relevance metric that combines the previous metrics.

What do I return when there are now relevant papers?
- The value "None" can be returned to signal that there are no relevant papers.

"""

# This variable sets the number of returned elements for predefined relevance metrics. You may use this variable in new metrics.
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