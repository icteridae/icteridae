from .models import Paper
from django.contrib.postgres.search import SearchQuery, TrigramSimilarity
from django.db.models.query import QuerySet


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
        return (50 - abs(p1.year - p2.year)) / 5


USING_SIMILARITIES = [STitleSimilarity, OTitleSimilarity, YearSimilarity]