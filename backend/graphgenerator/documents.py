from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import Paper


@registry.register_document
class PaperDocument(Document):
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

        
