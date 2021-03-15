from django.urls import include, path

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

    # All author related queries
    path('author/', include('graphgenerator.authors.urls')),

]

