"""backend models

- Paper
- Author
- FieldOfStudy
- PdfUrl
"""

from django.db import models

from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.fields import ArrayField


# Create your models here.

class Paper(models.Model):  # Independent
    """
    Model for a single paper
    """

    id = models.CharField(max_length=40, primary_key=True)

    title = models.CharField(max_length=400)  # TODO check max title length
    paperAbstract = models.TextField(blank=True)

    authors = models.ManyToManyField('Author')
    inCitations = models.ManyToManyField('self', symmetrical=False, related_name='outCitations')
    # outCitations probably not needed?
    year = models.IntegerField(null=True)
    s2Url = models.URLField()
    # sources # TODO
    # venue # TODO
    # journalName # TODO
    # journalVolume # TODO
    # journalPages # TODO
    # doi # TODO
    pdfUrl = ArrayField(base_field=models.URLField(), default=list)
    doiUrl = models.URLField(null=True)
    # pmid # TODO
    fieldsOfStudy = models.ManyToManyField('FieldOfStudy')
    # magid # TODO
    # s2PdUrl # TODO
    # entities # TODO

    citations = models.IntegerField()  # Used for boosting in search results
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
