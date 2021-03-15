from django.urls import include, path
    
from . import views


urlpatterns = [
    # Search authors using a query
    path('search/', views.search_author),  

    # Get author information using author id
    path('name/', views.get_author),  

    # Get papers written by a specific author
    path('papers/', views.get_authorpapers),

    # Get related authors from an author
    path('related/', views.get_author_details)
]
