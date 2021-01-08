from django.shortcuts import render
from django import http

from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def search(request):
    """
    returns a list of papers depending on the search query

    request needs to have 'query':str field
    """
    return http.HttpResponse('Search Endpoint')


@api_view(['GET'])
def generate_graph(request):
    """
    finds relevant papers
    generates a tensor with paper similarities of relevant papers

    request needs to have 'papier_id':any field
    """
    return http.HttpResponse('Generate Graph Endpoint')

@api_view(['GET'])
def get_paper(request):
    """
    returns paper metadata based on (some tbd) id

    request needs to have 'paper_id':any field
    """
    return http.HttpResponse('Paper Endpoint')

