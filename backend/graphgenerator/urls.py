from django.urls import path

from . import views

urlpatterns = [
    path('search/', views.search),
    path('generate_graph/', views.generate_graph),
    path('paper/', views.get_paper),
    path('paper_bulk/', views.get_paper_bulk)
]