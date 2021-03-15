from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet
from django.db import connection

import math

"""
Developer Interface for introducing new similarity metrics. 

Example similarity metrics are defined below.

What is a relevance metric?
- similarity metrics are used to determine how similar two papers are and how close they are in the resulting graph.

How is a similarity metric defined?
- similarity metrics are defined as functions of two papers. They should return a number where higher values signify larger similarity. 

How is a similarity metric implemented?
- there are two base classes available for implementing new similarities. both contain the variables 'name' and 'description' where you can explain your similarity metric.
- PairwiseSimilarity defines a function called similarity where two papers are given and a number is returned.
- TotalSimilarity defined a function called similarity where a QuerySet of papers is given and a full similarity matrix is returned.

Which similarity metrics are used?
- used similarity metric are defined in the USING_SIMILARITIES variable at the bottom of this file. Set the variable to a list of references to your similarities.

What should I consider in a similarity function?
- input size is chosen in the used relevance function. With inefficient similarity functions it may be usefull to use the TotalSimilarity baseclass instead of PairwiseSimilarity. The former allows a full similarity matrix to be returned.


"""

class PairwiseSimilarity:
    """
    This is not a similarity, but a base class for implementing similarity functions.
    Pairwise similarities are functions of two papers returning a single number.
    """

    name = None
    description = None

    def similarity(self, p1: Paper, p2: Paper):
        raise NotImplementedError()


class TotalSimilarity:
    """
    This is not a similarity, but a base class for implementing similarity functions.
    Total similarities return a matrix. It should be symmetric and rows/columns should match the order present in the QuerySet.
    """

    name = None
    description = None

    def similarity(self, papers: QuerySet):
        raise NotImplementedError()


class STitleSimilarity(PairwiseSimilarity):

    name = 'S-Title Similarity'
    description = 'Similarity is |x-y|-1 where x,y are the occurrences of the letter s in the respective titles'

    def similarity(self, p1: Paper, p2: Paper):
        return 10 - abs(p1.title.count('s') - p2.title.count('s'))


class OTitleSimilarity(PairwiseSimilarity):

    name = 'O-Title Similarity'
    description = 'Similarity is |x-y|-1 where x,y are the occurrences of the letter o in the respective titles'

    def similarity(self, p1: Paper, p2: Paper):
        return 10 - abs(p1.title.count('o') - p2.title.count('o'))


class YearSimilarity(PairwiseSimilarity):

    name = 'Year Similarity'
    description = 'Similarity is larger as papers are released closer to each other'

    def similarity(self, p1: Paper, p2: Paper):
        return -abs(p1.year - p2.year)


class CocitationSimilarity(PairwiseSimilarity):
    
    name = 'Co-citation Similarity'
    description = 'See https://en.wikipedia.org/wiki/Co-citation'

    def similarity(self, p1: Paper, p2: Paper):

        cursor = connection.cursor()
        cursor.execute("""  SELECT COUNT(*) FROM 
                                (SELECT to_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE from_paper_id = %s) as l1
                                NATURAL JOIN (SELECT to_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE from_paper_id = %s) as l2;
        """, [p1.id, p2.id])

        res = cursor.fetchone()[0]
        return res


class RelativeCocitationSimilarity(PairwiseSimilarity):
    
    name = 'Relative Co-citation Similarity'
    description = 'See https://en.wikipedia.org/wiki/Co-citation. Normalized using paper citation product'

    def similarity(self, p1: Paper, p2: Paper):

        cursor = connection.cursor()
        cursor.execute("""  SELECT COUNT(*) FROM 
                                (SELECT to_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE from_paper_id = %s) as l1
                                NATURAL JOIN (SELECT to_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE from_paper_id = %s) as l2;
        """, [p1.id, p2.id])

        res = cursor.fetchone()[0] / math.sqrt(p2.citations * p1.citations)
        return res


class BibliographicCouplingSimilarity(PairwiseSimilarity):
    
    name = 'Bibliographic Coupling'
    description = 'See https://en.wikipedia.org/wiki/Bibliographic_coupling'

    def similarity(self, p1: Paper, p2: Paper):

        cursor = connection.cursor()
        cursor.execute("""  SELECT COUNT(*) FROM 
                                (SELECT from_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE to_paper_id = %s) as l1
                                NATURAL JOIN (SELECT from_paper_id 
                                    FROM "graphgenerator_paper_inCitations" 
                                    WHERE to_paper_id = %s) as l2;
        """, [p1.id, p2.id])

        res = math.log(cursor.fetchone()[0]+1)
        return res

USING_SIMILARITIES = [BibliographicCouplingSimilarity, CocitationSimilarity, RelativeCocitationSimilarity]