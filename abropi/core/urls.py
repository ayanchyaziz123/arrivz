# core/urls.py (ADD these new URLs)
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('search/', views.search, name='search'),
    
    # New location-related URLs
    path('location-suggestions/', views.location_suggestions, name='location_suggestions'),
    path('clear-location/', views.clear_location, name='clear_location'),
]