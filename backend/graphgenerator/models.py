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
    Model for a single paper.
    Fields are as defined in the SemanticScholar Open Research Corpus (http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/corpus/).
    """

    id = models.CharField(max_length=40, primary_key=True)

    title = models.TextField(blank=True) 
    paperAbstract = models.TextField(blank=True)
    authors = models.ManyToManyField('Author', through='AuthorPaper', related_name='papers')

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
        # indexes for faster search and similarity metrics
        indexes = [GinIndex(fields=['search_vector']),
                   GinIndex(name='graph_paper_ln_gin_idx', fields=['title'], opclasses=['gin_trgm_ops'])]

class Author(models.Model):  # Independent
    name = models.CharField(max_length=200)
    id = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name

class AuthorPaper(models.Model):
    """
    Custom Through table for Author-Paper many-to-many relation with order attribute.
    This table is needed as author order is not given in usual many-to-many relationships.
    """
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)
    order = models.IntegerField()

    class Meta:
        ordering = ['order',]

class FieldOfStudy(models.Model):  # Independent
    # This class is probably not needed anymore
    field = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.field
