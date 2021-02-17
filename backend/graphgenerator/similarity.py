from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet
from django.db import connection

import math

class PairwiseSimilarity:

    name = None
    description = None

    def similarity(self, p1: Paper, p2: Paper):
        raise NotImplementedError()


class TotalSimilarity:

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

        #res = cursor.fetchone()[0]**(0.1)
        #res = math.log(cursor.fetchone()[0]+1)
        res = cursor.fetchone()[0]
        #print('result', res)
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

        #res = cursor.fetchone()[0]**(0.1)
        res = math.log(cursor.fetchone()[0]+1)
        #res = cursor.fetchone()[0]
        #print('result', res)
        return res

USING_SIMILARITIES = [BibliographicCouplingSimilarity, CocitationSimilarity]