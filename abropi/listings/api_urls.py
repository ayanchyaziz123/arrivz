# listings/api_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'listings', api_views.ListingViewSet, basename='listing')

urlpatterns = [
    # Router URLs (includes CRUD operations for listings)
    path('', include(router.urls)),
    
    # Category endpoints
    path('categories/', api_views.CategoryListAPIView.as_view(), name='category-list'),
    path('categories/<str:category_type>/fields/', api_views.CategoryFieldsAPIView.as_view(), name='category-fields'),
    
    # Location endpoints
    path('countries/', api_views.CountryListAPIView.as_view(), name='country-list'),
    path('countries/<str:country_id>/states/', api_views.StateListAPIView.as_view(), name='state-list'),
    path('states/<str:state_id>/cities/', api_views.CityListAPIView.as_view(), name='city-list'),
    
    # Listing action endpoints
    path('listings/<str:listing_id>/publish/', api_views.PublishListingAPIView.as_view(), name='publish-listing'),
    path('listings/<str:listing_id>/pause/', api_views.PauseListingAPIView.as_view(), name='pause-listing'),
    path('listings/<str:listing_id>/helpful/', api_views.ToggleHelpfulAPIView.as_view(), name='toggle-helpful'),
    path('listings/<str:listing_id>/favorite/', api_views.ToggleFavoriteAPIView.as_view(), name='toggle-favorite'),
    path('listings/<str:listing_id>/images/', api_views.ListingImagesAPIView.as_view(), name='listing-images'),
    
    # User-specific endpoints
    path('my-listings/', api_views.UserListingsAPIView.as_view(), name='user-listings'),
    path('my-favorites/', api_views.UserFavoritesAPIView.as_view(), name='user-favorites'),
    
    # Search and filter endpoints
    path('search/', api_views.SearchListingsAPIView.as_view(), name='search-listings'),
    path('featured/', api_views.FeaturedListingsAPIView.as_view(), name='featured-listings'),
]