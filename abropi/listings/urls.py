# listings/urls.py - Complete URL configuration

from django.urls import path
from . import views



urlpatterns = [
    # Main listing views
    path('', views.listing_list, name='listing_list'),
    path('<int:pk>/', views.listing_detail, name='listing_detail'),
    path('select_category_to_create_listing/', views.select_category_to_create_listing, name='select_category_to_create_listing'),
    path('create/', views.create_listing, name='create_listing'),
    path('<int:pk>/edit/', views.edit_listing, name='edit_listing'),
    path('<int:pk>/delete/', views.delete_listing, name='delete_listing'),
    
    # Category and filtering
    path('category/<str:category>/', views.listings_by_category, name='listings_by_category'),
    
    # User-specific views
    path('my-listings/', views.my_listings, name='my_listings'),
    path('favorites/', views.favorites, name='favorites'),
    path('<int:pk>/favorite/', views.toggle_favorite, name='toggle_favorite'),
    
    # Listing management actions
    path('<int:pk>/mark-sold/', views.mark_listing_sold, name='mark_listing_sold'),
    path('<int:pk>/renew/', views.renew_listing, name='renew_listing'),
    path('<int:pk>/duplicate/', views.duplicate_listing, name='duplicate_listing'),
    
    # Messaging system
    path('messages/', views.message_list, name='message_list'),
    path('messages/<int:pk>/', views.message_detail, name='message_detail'),
    path('messages/send/<int:listing_id>/', views.send_message, name='send_message'),
    
    # AJAX endpoints for dynamic content
    path('ajax/states-for-country/', views.get_states_for_country, name='ajax_states_for_country'),
    path('ajax/cities-for-state/', views.get_cities_for_state, name='ajax_cities_for_state'),
    path('ajax/search-locations/', views.search_locations, name='ajax_search_locations'),
    path('ajax/listing-stats/', views.listing_stats_api, name='ajax_listing_stats'),

    # path('<int:pk>/helpful/', views.toggle_helpful, name='toggle_helpful'),
    # path('ajax/helpful-count/<int:pk>/', views.get_helpful_count, name='ajax_helpful_count'),
]