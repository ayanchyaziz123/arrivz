# listings/api_views.py
from rest_framework import status, generics, permissions, filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q, F
from django.utils import timezone
import logging

from .models import (
    Category, Country, StateProvince, City, Listing, ListingImage,
    ListingHelpful, Favorite, JobListing, HousingListing, RoommateListing,
    LawyerListing, MarketplaceListing, ServiceListing
)
from .serializers import (
    CategorySerializer, CountrySerializer, StateProvinceSerializer, CitySerializer,
    ListingDetailSerializer, ListingListSerializer, ListingCreateSerializer,
    ListingImageSerializer, ListingImageUploadSerializer
)

logger = logging.getLogger(__name__)

# Category Views
class CategoryListAPIView(generics.ListAPIView):
    """Get all categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class CategoryFieldsAPIView(APIView):
    """Get field configuration for a specific category type"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, category_type):
        # Define field configurations for each category type
        CATEGORY_FIELD_CONFIGS = {
            'jobs': {
                'required': ['job_type', 'company_name', 'salary_min', 'requirements'],
                'optional': ['salary_max', 'salary_period', 'benefits', 'visa_sponsorship', 'remote_work'],
                'fields': {
                    'job_type': {
                        'type': 'select',
                        'label': 'Job Type',
                        'options': [
                            {'value': 'full_time', 'label': 'Full Time'},
                            {'value': 'part_time', 'label': 'Part Time'},
                            {'value': 'contract', 'label': 'Contract'},
                            {'value': 'temporary', 'label': 'Temporary'},
                            {'value': 'internship', 'label': 'Internship'},
                            {'value': 'freelance', 'label': 'Freelance'}
                        ]
                    },
                    'company_name': {'type': 'text', 'label': 'Company Name'},
                    'salary_min': {'type': 'number', 'label': 'Minimum Salary', 'prefix': '$'},
                    'salary_max': {'type': 'number', 'label': 'Maximum Salary', 'prefix': '$'},
                    'salary_period': {
                        'type': 'select',
                        'label': 'Salary Period',
                        'options': [
                            {'value': 'hourly', 'label': 'Hourly'},
                            {'value': 'monthly', 'label': 'Monthly'},
                            {'value': 'yearly', 'label': 'Yearly'}
                        ]
                    },
                    'requirements': {'type': 'textarea', 'label': 'Requirements & Qualifications'},
                    'benefits': {'type': 'textarea', 'label': 'Benefits & Perks'},
                    'visa_sponsorship': {'type': 'checkbox', 'label': 'Visa sponsorship available'},
                    'remote_work': {'type': 'checkbox', 'label': 'Remote work allowed'}
                }
            },
            'housing': {
                'required': ['housing_type', 'bedrooms', 'bathrooms', 'rent_amount'],
                'optional': ['square_feet', 'deposit_required', 'utilities_included', 'furnished', 'pets_allowed'],
                'fields': {
                    'housing_type': {
                        'type': 'select',
                        'label': 'Housing Type',
                        'options': [
                            {'value': 'apartment', 'label': 'Apartment'},
                            {'value': 'house', 'label': 'House'},
                            {'value': 'room', 'label': 'Room'},
                            {'value': 'studio', 'label': 'Studio'},
                            {'value': 'condo', 'label': 'Condo'},
                            {'value': 'shared', 'label': 'Shared Housing'}
                        ]
                    },
                    'bedrooms': {'type': 'number', 'label': 'Bedrooms', 'min': 0},
                    'bathrooms': {'type': 'number', 'label': 'Bathrooms', 'step': 0.5, 'min': 0},
                    'rent_amount': {'type': 'number', 'label': 'Monthly Rent', 'prefix': '$'},
                    'utilities_included': {'type': 'checkbox', 'label': 'Utilities included'},
                    'furnished': {'type': 'checkbox', 'label': 'Furnished'},
                    'pets_allowed': {'type': 'checkbox', 'label': 'Pets allowed'}
                }
            },
            'roommates': {
                'required': ['room_type', 'monthly_rent', 'total_bedrooms'],
                'optional': ['private_bathroom', 'furnished', 'gender_preference'],
                'fields': {
                    'room_type': {
                        'type': 'select',
                        'label': 'Room Type',
                        'options': [
                            {'value': 'private_room', 'label': 'Private Room'},
                            {'value': 'shared_room', 'label': 'Shared Room'},
                            {'value': 'master_bedroom', 'label': 'Master Bedroom'},
                            {'value': 'studio_share', 'label': 'Studio Share'}
                        ]
                    },
                    'monthly_rent': {'type': 'number', 'label': 'Monthly Rent', 'prefix': '$'},
                    'total_bedrooms': {'type': 'number', 'label': 'Total Bedrooms', 'min': 1},
                    'total_bathrooms': {'type': 'number', 'label': 'Total Bathrooms', 'step': 0.5, 'min': 0.5},
                    'private_bathroom': {'type': 'checkbox', 'label': 'Private bathroom'},
                    'furnished': {'type': 'checkbox', 'label': 'Furnished room'},
                    'gender_preference': {
                        'type': 'select',
                        'label': 'Gender Preference',
                        'options': [
                            {'value': 'any', 'label': 'Any Gender'},
                            {'value': 'male', 'label': 'Male Only'},
                            {'value': 'female', 'label': 'Female Only'},
                            {'value': 'non_binary', 'label': 'Non-Binary'}
                        ]
                    }
                }
            },
            'legal': {
                'required': ['specializations', 'years_experience', 'bar_admissions'],
                'optional': ['law_firm', 'hourly_rate', 'free_consultation', 'virtual_consultations'],
                'fields': {
                    'law_firm': {'type': 'text', 'label': 'Law Firm Name'},
                    'specializations': {'type': 'text', 'label': 'Legal Specializations'},
                    'years_experience': {'type': 'number', 'label': 'Years of Experience', 'min': 0},
                    'bar_admissions': {'type': 'text', 'label': 'Bar Admissions'},
                    'hourly_rate': {'type': 'number', 'label': 'Hourly Rate', 'prefix': '$'},
                    'free_consultation': {'type': 'checkbox', 'label': 'Free consultation available'},
                    'virtual_consultations': {'type': 'checkbox', 'label': 'Virtual consultations offered'}
                }
            },
            'marketplace': {
                'required': ['item_category', 'condition', 'price'],
                'optional': ['brand', 'model', 'accepting_trades'],
                'fields': {
                    'item_category': {
                        'type': 'select',
                        'label': 'Item Category',
                        'options': [
                            {'value': 'electronics', 'label': 'Electronics'},
                            {'value': 'furniture', 'label': 'Furniture'},
                            {'value': 'clothing', 'label': 'Clothing & Accessories'},
                            {'value': 'books', 'label': 'Books & Media'},
                            {'value': 'home_garden', 'label': 'Home & Garden'},
                            {'value': 'sports', 'label': 'Sports & Recreation'},
                            {'value': 'vehicles', 'label': 'Vehicles'},
                            {'value': 'appliances', 'label': 'Appliances'},
                            {'value': 'other', 'label': 'Other'}
                        ]
                    },
                    'condition': {
                        'type': 'select',
                        'label': 'Condition',
                        'options': [
                            {'value': 'new', 'label': 'New'},
                            {'value': 'like_new', 'label': 'Like New'},
                            {'value': 'excellent', 'label': 'Excellent'},
                            {'value': 'good', 'label': 'Good'},
                            {'value': 'fair', 'label': 'Fair'},
                            {'value': 'poor', 'label': 'Poor'}
                        ]
                    },
                    'price': {'type': 'number', 'label': 'Price', 'prefix': '$'},
                    'brand': {'type': 'text', 'label': 'Brand'},
                    'model': {'type': 'text', 'label': 'Model'},
                    'accepting_trades': {'type': 'checkbox', 'label': 'Accept trades'}
                }
            },
            'services': {
                'required': ['service_category', 'pricing_type'],
                'optional': ['price', 'experience_years', 'remote_service'],
                'fields': {
                    'service_category': {
                        'type': 'select',
                        'label': 'Service Category',
                        'options': [
                            {'value': 'home_services', 'label': 'Home Services'},
                            {'value': 'tutoring', 'label': 'Tutoring & Education'},
                            {'value': 'tech_support', 'label': 'Tech Support'},
                            {'value': 'translation', 'label': 'Translation Services'},
                            {'value': 'photography', 'label': 'Photography'},
                            {'value': 'consulting', 'label': 'Consulting'},
                            {'value': 'fitness', 'label': 'Fitness & Health'},
                            {'value': 'childcare', 'label': 'Childcare'}
                        ]
                    },
                    'pricing_type': {
                        'type': 'select',
                        'label': 'Pricing Type',
                        'options': [
                            {'value': 'hourly', 'label': 'Hourly Rate'},
                            {'value': 'fixed', 'label': 'Fixed Price'},
                            {'value': 'per_session', 'label': 'Per Session'},
                            {'value': 'free', 'label': 'Free'}
                        ]
                    },
                    'price': {'type': 'number', 'label': 'Price', 'prefix': '$'},
                    'experience_years': {'type': 'number', 'label': 'Years of Experience', 'min': 0},
                    'remote_service': {'type': 'checkbox', 'label': 'Remote service available'}
                }
            }
        }
        
        config = CATEGORY_FIELD_CONFIGS.get(category_type)
        if not config:
            return Response(
                {'error': f'Unknown category type: {category_type}'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(config)

# Location Views
class CountryListAPIView(generics.ListAPIView):
    """Get all countries"""
    queryset = Country.objects.filter(is_active=True)
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]

class StateListAPIView(generics.ListAPIView):
    """Get states for a specific country"""
    serializer_class = StateProvinceSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        country_id = self.kwargs['country_id']
        return StateProvince.objects.filter(country_id=country_id, is_active=True)

class CityListAPIView(generics.ListAPIView):
    """Get cities for a specific state"""
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        state_id = self.kwargs['state_id']
        return City.objects.filter(state_province_id=state_id, is_active=True)

# Main Listing ViewSet
class ListingViewSet(viewsets.ModelViewSet):
    """Main listing CRUD operations"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['created_at', 'updated_at', 'views_count', 'helpful_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Listing.objects.select_related(
            'category', 'user', 'country', 'state_province', 'city'
        ).prefetch_related('images')
        
        # Only show public listings to unauthenticated users
        if not self.request.user.is_authenticated:
            return queryset.filter(is_public=True, status='active')
        
        # For authenticated users, apply visibility rules
        user = self.request.user
        
        # Base query for public listings
        public_listings = Q(visibility='public', is_public=True, status='active')
        
        # User's own listings (regardless of visibility)
        own_listings = Q(user=user)
        
        # Combine visibility conditions
        visibility_filter = public_listings | own_listings
        
        return queryset.filter(visibility_filter).distinct()
    
    def get_serializer_class(self):
        if self.action in ['list']:
            return ListingListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ListingCreateSerializer
        return ListingDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        Listing.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        
        # Refresh instance to get updated view count
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Listing Action Views
class PublishListingAPIView(APIView):
    """Publish a listing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id, user=request.user)
        
        if not listing.can_be_published():
            return Response(
                {'error': 'Listing cannot be published in its current state'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        listing.publish()
        
        return Response({
            'message': 'Listing published successfully',
            'status': listing.status
        })

class PauseListingAPIView(APIView):
    """Pause a listing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id, user=request.user)
        
        if listing.status != 'active':
            return Response(
                {'error': 'Only active listings can be paused'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        listing.pause()
        
        return Response({
            'message': 'Listing paused successfully',
            'status': listing.status
        })

class ToggleHelpfulAPIView(APIView):
    """Toggle helpful status for a listing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        user = request.user
        
        # Don't allow users to mark their own listings as helpful
        if listing.user == user:
            return Response(
                {'error': 'You cannot mark your own listing as helpful'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_helpful = listing.toggle_helpful(user)
        
        return Response({
            'message': 'Marked as helpful' if is_helpful else 'Removed from helpful',
            'is_helpful': is_helpful,
            'helpful_count': listing.helpful_count
        })

class ToggleFavoriteAPIView(APIView):
    """Toggle favorite status for a listing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        user = request.user
        
        favorite, created = Favorite.objects.get_or_create(
            user=user, 
            listing=listing
        )
        
        if not created:
            favorite.delete()
            is_favorited = False
            message = 'Removed from favorites'
        else:
            is_favorited = True
            message = 'Added to favorites'
        
        return Response({
            'message': message,
            'is_favorited': is_favorited
        })

class ListingImagesAPIView(APIView):
    """Upload images for a listing"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id, user=request.user)
        
        # Handle multiple file upload
        images = []
        for i in range(10):  # Max 10 images
            image_key = f'image_{i}'
            if image_key in request.FILES:
                images.append(request.FILES[image_key])
        
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate and create image instances
        created_images = []
        for index, image in enumerate(images):
            # Set first image as primary if no primary exists
            is_primary = (index == 0 and not listing.images.filter(is_primary=True).exists())
            
            listing_image = ListingImage.objects.create(
                listing=listing,
                image=image,
                is_primary=is_primary
            )
            created_images.append(listing_image)
        
        serializer = ListingImageSerializer(created_images, many=True)
        
        return Response({
            'message': f'{len(created_images)} images uploaded successfully',
            'images': serializer.data
        })

# User-specific Views
class UserListingsAPIView(generics.ListAPIView):
    """Get current user's listings"""
    serializer_class = ListingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user).select_related(
            'category', 'country', 'state_province', 'city'
        ).prefetch_related('images')

class UserFavoritesAPIView(generics.ListAPIView):
    """Get current user's favorite listings"""
    serializer_class = ListingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        favorite_listing_ids = Favorite.objects.filter(
            user=self.request.user
        ).values_list('listing_id', flat=True)
        
        return Listing.objects.filter(
            id__in=favorite_listing_ids,
            is_public=True,
            status='active'
        ).select_related(
            'category', 'user', 'country', 'state_province', 'city'
        ).prefetch_related('images')

# Search and Filter Views
class SearchListingsAPIView(generics.ListAPIView):
    """Advanced search for listings"""
    serializer_class = ListingListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']
    
    def get_queryset(self):
        queryset = Listing.objects.filter(
            is_public=True, 
            status='active'
        ).select_related(
            'category', 'user', 'country', 'state_province', 'city'
        ).prefetch_related('images')
        
        # Apply filters from query parameters
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__category_type=category)
        
        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country_id=country)
        
        state = self.request.query_params.get('state')
        if state:
            queryset = queryset.filter(state_province_id=state)
        
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city_id=city)
        
        return queryset

class FeaturedListingsAPIView(generics.ListAPIView):
    """Get featured listings"""
    serializer_class = ListingListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Listing.objects.filter(
            is_public=True,
            status__in=['active', 'featured'],
            is_featured=True
        ).select_related(
            'category', 'user', 'country', 'state_province', 'city'
        ).prefetch_related('images')[:20]  # Limit to 20 featured listings