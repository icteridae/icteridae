from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl import fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import field
from .models import Paper, Author

class CitaionsRankField(fields.DEDField, field.RankFeature):
    """
    Implements a RankFeature for django-elasticsearch-dsl as the current version does not support RankFeatures
    This class just needs to extend DEDField and RankFeature
    """
    pass

@registry.register_document
class PaperDocument(Document):
    """
    Class for indexing Paper elements in elasticsearch
    """

    # Citation field for boosting popular papers
    citations = CitaionsRankField(attr = 'get_citations') # RankFeature for citation field

    # # Nested authors field to allow search for authors complementing title search 
    # authors = fields.ObjectField(
    #     properties={
    #         'name': fields.TextField(),
    #      }
    #  )

    class Index:

        name = 'papers'

        # Elasticsearch settings
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:

        model = Paper

        # Fields to index additionally to citations and authors defined above
        fields = [
            'title',
            'year',
        ]

@registry.register_document
class AuthorDocument(Document):

    class Index:

        name = 'authors'

        # Elasticsearch settings
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:

        model = Author

        fields = [
            'name',
        ]

        
