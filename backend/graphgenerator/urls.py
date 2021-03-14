from django.urls import path

from . import views

urlpatterns = [
    # Search papers using a query
    path('search/', views.search),  

    # Generate a graph from a source node
    path('generate_graph/', views.generate_graph),  

    # Find paper information given a paper id
    path('paper/', views.get_paper),  

    # Find paper information given a bulk of paper ids
    path('paper_bulk/', views.get_paper_bulk), 

    # Search authors using a query
    path('author/search/', views.search_author),  

    # Get author information using author id
    path('author/name/', views.get_author),  

    # Get papers written by a specific author
    path('author/papers/', views.get_authorpapers),

    # Get related authors from an author
    path('author/related/', views.get_author_details)
]