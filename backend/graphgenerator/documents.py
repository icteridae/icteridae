from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl import fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import field
from .models import Paper

class FuckThis(fields.DEDField, field.RankFeature):
    """Implements a RankFeature for django-elasticsearch-dsl as the current version does not support the given Class
    """
    pass

@registry.register_document
class PaperDocument(Document):
    """Class for indexing Paper Elements in elasticsearch
    """

    citations = FuckThis(attr = 'get_citations') # RankFeature for citation field

    class Index:

        name = 'papers'

        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:

        model = Paper

        fields = [
            'title',
            'year',
        ]

        
