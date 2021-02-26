from rest_framework import serializers
from .models import Paper, Author

class AuthorSerializer(serializers.ModelSerializer):
    """
    Serializer for authors
    """
    class Meta:
        model = Author
        fields = '__all__'

class PaperSerializer(serializers.ModelSerializer):
    """
    Serializer for papers. Includes nested authors and outCitations as they are not included by default
    """
    outCitations = serializers.SerializerMethodField('getOutCitations')
    authors = AuthorSerializer(many=True, read_only=True)
    
    def getOutCitations(self, paper):
        return [paper.id for paper in paper.outCitations.all()]

    class Meta:
        model = Paper
        exclude = ['search_vector']

