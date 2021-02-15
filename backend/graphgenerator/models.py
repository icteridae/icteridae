"""backend models

- Paper
- Author
- FieldOfStudy
- PdfUrl
"""

from django.db import models

from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.fields import ArrayField, JSONField


# Create your models here.

class Paper(models.Model):  # Independent
    """
    Model for a single paper
    """

    id = models.CharField(max_length=40, primary_key=True)

    title = models.TextField(blank=True) 
    paperAbstract = models.TextField(blank=True)

    authors = models.ManyToManyField('Author')
    inCitations = models.ManyToManyField('self', symmetrical=False, related_name='outCitations')
    # outCitations not needed as they are implied by inCitations
    year = models.IntegerField(null=True)
    s2Url = models.URLField()
    venue = models.TextField(blank=True)
    journalName = models.TextField(blank=True)
    journalVolume = models.TextField(blank=True)
    journalPages = models.TextField(blank=True)
    doi = models.TextField(blank=True)
    pdfUrls = ArrayField(base_field=models.URLField(), default=list)
    doiUrl = models.URLField(null=True)
    # pmid # there is no documentation on what pmid is so well save that for when it is needed
    # fieldsOfStudy = models.ManyToManyField('FieldOfStudy')
    fieldsOfStudy = ArrayField(base_field=models.CharField(max_length=100), default=list)
    magId = models.TextField(blank=True)
    # s2PdUrl # deprecated since 2019 (see semanticscholar)
    # entities # ndeprecated since 2019 (see semanticscholar)

    # Fields not directly given in the SemanticScholar Open Research Corpus
    citations = models.IntegerField()
    references = models.IntegerField()
    search_vector = SearchVectorField(null=True, blank=True)  # Used for increased search performance. Do not edit

    def get_citations(self):
        """Function for citation rank_feature in elasticsearch backend. Used to boost search results with high citation counts
        """
        return self.citations + 1 # +1 needed as rank_features have to be strictly positive (>0)

    class Meta(object):
        indexes = [GinIndex(fields=['search_vector']),
                   GinIndex(name='graph_paper_ln_gin_idx', fields=['title'], opclasses=['gin_trgm_ops'])]


class Author(models.Model):  # Independent
    name = models.CharField(max_length=200)
    id = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name


class FieldOfStudy(models.Model):  # Independent
    field = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.field
