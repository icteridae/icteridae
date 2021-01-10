from rest_framework import serializers
from .models import Paper

class PaperSerializer(serializers.ModelSerializer):
    outCitations = serializers.SerializerMethodField('getOutCitations')

    def getOutCitations(self, paper):
        return [paper.id for paper in paper.outCitations.all()]

    class Meta:
        model = Paper
        exclude = ['search_vector']