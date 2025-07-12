# listings/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, Country, StateProvince, City, Listing, ListingImage, 
    JobListing, HousingListing, RoommateListing, LawyerListing, 
    MarketplaceListing, ServiceListing, ListingHelpful, Favorite
)

User = get_user_model()

# Location serializers
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'code3']

class StateProvinceSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = StateProvince
        fields = ['id', 'name', 'short_name', 'country']

class CitySerializer(serializers.ModelSerializer):
    state_province = StateProvinceSerializer(read_only=True)
    
    class Meta:
        model = City
        fields = ['id', 'name', 'state_province', 'latitude', 'longitude']

# Category serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_type', 'description', 'icon', 'priority_score']

# User serializer for listings
class ListingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture', 'is_verified']

# Image serializer
class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'caption', 'is_primary']

# Category-specific serializers
class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = [
            'job_type', 'company_name', 'salary_min', 'salary_max', 'salary_period',
            'salary_currency', 'salary_negotiable', 'requirements', 'benefits',
            'visa_sponsorship', 'remote_work', 'salary_display'
        ]

class HousingListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousingListing
        fields = [
            'housing_type', 'bedrooms', 'bathrooms', 'square_feet', 'rent_amount',
            'rent_period', 'rent_currency', 'rent_negotiable', 'deposit_required',
            'utilities_cost', 'utilities_included', 'furnished', 'pets_allowed',
            'parking_available', 'laundry_available', 'lease_term_min', 'available_date',
            'price_display', 'total_monthly_cost'
        ]

class RoommateListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoommateListing
        fields = [
            'room_type', 'monthly_rent', 'rent_currency', 'deposit_required',
            'utilities_cost', 'utilities_included', 'private_bathroom', 'furnished',
            'has_closet', 'window_available', 'shared_kitchen', 'shared_living_room',
            'parking_available', 'laundry_available', 'gender_preference', 'age_min',
            'age_max', 'students_welcome', 'working_professionals', 'pets_allowed',
            'smoking_allowed', 'lease_term_months', 'move_in_date', 'flexible_dates',
            'current_roommates_count', 'total_bedrooms', 'total_bathrooms', 'price_display'
        ]

class LawyerListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawyerListing
        fields = [
            'law_firm', 'specializations', 'years_experience', 'bar_admissions',
            'languages', 'license_number', 'pricing_model', 'hourly_rate',
            'consultation_fee', 'currency', 'accepts_pro_bono', 'free_consultation',
            'offers_payment_plans', 'virtual_consultations', 'pricing_display'
        ]

class MarketplaceListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceListing
        fields = [
            'item_category', 'brand', 'model', 'condition', 'year_purchased',
            'price', 'currency', 'price_negotiable', 'accepting_trades',
            'trade_preferences', 'dimensions', 'weight', 'color', 'material',
            'quantity_available', 'pickup_available', 'delivery_available',
            'delivery_fee', 'shipping_available', 'original_price',
            'purchase_receipt', 'warranty_remaining', 'warranty_details', 'price_display'
        ]

class ServiceListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceListing
        fields = [
            'service_category', 'pricing_type', 'price', 'currency', 'price_negotiable',
            'experience_years', 'languages_offered', 'certifications',
            'available_weekdays', 'available_weekends', 'available_evenings',
            'remote_service', 'travel_radius_miles', 'price_display'
        ]

# Main listing serializer for read operations
class ListingDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = ListingUserSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    state_province = StateProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    
    # Category-specific data
    job_data = serializers.SerializerMethodField()
    housing_data = serializers.SerializerMethodField()
    roommate_data = serializers.SerializerMethodField()
    lawyer_data = serializers.SerializerMethodField()
    marketplace_data = serializers.SerializerMethodField()
    service_data = serializers.SerializerMethodField()
    
    # User interaction fields
    is_helpful_by_user = serializers.SerializerMethodField()
    is_favorited_by_user = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'category', 'user', 'status', 'status_display',
            'is_public', 'visibility', 'priority', 'is_featured', 'views_count',
            'helpful_count', 'country', 'state_province', 'city', 'neighborhood',
            'address_line_1', 'address_line_2', 'zip_code', 'latitude', 'longitude',
            'contact_email', 'contact_phone', 'website_url', 'created_at', 'updated_at',
            'expires_at', 'images', 'job_data', 'housing_data', 'roommate_data',
            'lawyer_data', 'marketplace_data', 'service_data', 'is_helpful_by_user',
            'is_favorited_by_user', 'can_edit'
        ]
    
    def get_job_data(self, obj):
        if hasattr(obj, 'joblisting'):
            return JobListingSerializer(obj.joblisting).data
        return None
    
    def get_housing_data(self, obj):
        if hasattr(obj, 'housinglisting'):
            return HousingListingSerializer(obj.housinglisting).data
        return None
    
    def get_roommate_data(self, obj):
        if hasattr(obj, 'roommate'):
            return RoommateListingSerializer(obj.roommate).data
        return None
    
    def get_lawyer_data(self, obj):
        if hasattr(obj, 'lawyerlisting'):
            return LawyerListingSerializer(obj.lawyerlisting).data
        return None
    
    def get_marketplace_data(self, obj):
        if hasattr(obj, 'marketplacelisting'):
            return MarketplaceListingSerializer(obj.marketplacelisting).data
        return None
    
    def get_service_data(self, obj):
        if hasattr(obj, 'servicelisting'):
            return ServiceListingSerializer(obj.servicelisting).data
        return None
    
    def get_is_helpful_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_helpful_by_user(request.user)
        return False
    
    def get_is_favorited_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, listing=obj).exists()
        return False
    
    def get_can_edit(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user == request.user and obj.can_be_edited
        return False

# Simplified listing serializer for list views
class ListingListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = ListingUserSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    state_province = StateProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    price_info = serializers.CharField(read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'category', 'user', 'status_display', 'priority',
            'is_featured', 'views_count', 'helpful_count', 'country',
            'state_province', 'city', 'neighborhood', 'created_at', 'expires_at',
            'primary_image', 'price_info'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ListingImageSerializer(primary_image).data
        first_image = obj.images.first()
        if first_image:
            return ListingImageSerializer(first_image).data
        return None

# Create/Update serializers
class ListingCreateSerializer(serializers.ModelSerializer):
    # Category-specific fields - these will be dynamically handled
    job_type = serializers.CharField(required=False, allow_blank=True)
    company_name = serializers.CharField(required=False, allow_blank=True)
    salary_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    salary_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    salary_period = serializers.CharField(required=False, allow_blank=True)
    requirements = serializers.CharField(required=False, allow_blank=True)
    benefits = serializers.CharField(required=False, allow_blank=True)
    visa_sponsorship = serializers.BooleanField(required=False)
    remote_work = serializers.BooleanField(required=False)
    
    # Housing fields
    housing_type = serializers.CharField(required=False, allow_blank=True)
    bedrooms = serializers.IntegerField(required=False, allow_null=True)
    bathrooms = serializers.DecimalField(max_digits=3, decimal_places=1, required=False, allow_null=True)
    rent_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    utilities_included = serializers.BooleanField(required=False)
    furnished = serializers.BooleanField(required=False)
    pets_allowed = serializers.BooleanField(required=False)
    
    # Roommate fields
    room_type = serializers.CharField(required=False, allow_blank=True)
    monthly_rent = serializers.DecimalField(max_digits=8, decimal_places=2, required=False, allow_null=True)
    private_bathroom = serializers.BooleanField(required=False)
    gender_preference = serializers.CharField(required=False, allow_blank=True)
    total_bedrooms = serializers.IntegerField(required=False, allow_null=True)
    total_bathrooms = serializers.DecimalField(max_digits=3, decimal_places=1, required=False, allow_null=True)
    
    # Lawyer fields
    law_firm = serializers.CharField(required=False, allow_blank=True)
    specializations = serializers.CharField(required=False, allow_blank=True)
    years_experience = serializers.IntegerField(required=False, allow_null=True)
    bar_admissions = serializers.CharField(required=False, allow_blank=True)
    hourly_rate = serializers.DecimalField(max_digits=8, decimal_places=2, required=False, allow_null=True)
    free_consultation = serializers.BooleanField(required=False)
    virtual_consultations = serializers.BooleanField(required=False)
    
    # Marketplace fields
    item_category = serializers.CharField(required=False, allow_blank=True)
    condition = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    brand = serializers.CharField(required=False, allow_blank=True)
    model = serializers.CharField(required=False, allow_blank=True)
    accepting_trades = serializers.BooleanField(required=False)
    pickup_available = serializers.BooleanField(required=False)
    delivery_available = serializers.BooleanField(required=False)
    
    # Service fields
    service_category = serializers.CharField(required=False, allow_blank=True)
    pricing_type = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(required=False, allow_null=True)
    remote_service = serializers.BooleanField(required=False)
    
    class Meta:
        model = Listing
        fields = [
            # Basic listing fields
            'title', 'description', 'category', 'contact_email', 'contact_phone',
            'website_url', 'country', 'state_province', 'city', 'neighborhood',
            'address_line_1', 'address_line_2', 'zip_code', 'visibility', 'priority',
            
            # Job fields
            'job_type', 'company_name', 'salary_min', 'salary_max', 'salary_period',
            'requirements', 'benefits', 'visa_sponsorship', 'remote_work',
            
            # Housing fields
            'housing_type', 'bedrooms', 'bathrooms', 'rent_amount', 'utilities_included',
            'furnished', 'pets_allowed',
            
            # Roommate fields
            'room_type', 'monthly_rent', 'private_bathroom', 'gender_preference',
            'total_bedrooms', 'total_bathrooms',
            
            # Lawyer fields
            'law_firm', 'specializations', 'years_experience', 'bar_admissions',
            'hourly_rate', 'free_consultation', 'virtual_consultations',
            
            # Marketplace fields
            'item_category', 'condition', 'price', 'brand', 'model', 'accepting_trades',
            'pickup_available', 'delivery_available',
            
            # Service fields
            'service_category', 'pricing_type', 'experience_years', 'remote_service',
        ]
    
    def create(self, validated_data):
        # Extract category-specific data
        category_data = {}
        category_fields = {
            'jobs': ['job_type', 'company_name', 'salary_min', 'salary_max', 'salary_period', 
                    'requirements', 'benefits', 'visa_sponsorship', 'remote_work'],
            'housing': ['housing_type', 'bedrooms', 'bathrooms', 'rent_amount', 'utilities_included', 
                       'furnished', 'pets_allowed'],
            'roommates': ['room_type', 'monthly_rent', 'private_bathroom', 'gender_preference', 
                         'total_bedrooms', 'total_bathrooms'],
            'legal': ['law_firm', 'specializations', 'years_experience', 'bar_admissions', 
                     'hourly_rate', 'free_consultation', 'virtual_consultations'],
            'marketplace': ['item_category', 'condition', 'price', 'brand', 'model', 
                           'accepting_trades', 'pickup_available', 'delivery_available'],
            'services': ['service_category', 'pricing_type', 'experience_years', 'remote_service'],
        }
        
        # Get category type
        category = validated_data.get('category')
        if category:
            category_type = category.category_type
            
            # Extract relevant fields for this category
            for field in category_fields.get(category_type, []):
                if field in validated_data:
                    category_data[field] = validated_data.pop(field)
        
        # Remove any remaining category fields that weren't used
        all_category_fields = []
        for fields in category_fields.values():
            all_category_fields.extend(fields)
        
        for field in all_category_fields:
            validated_data.pop(field, None)
        
        # Create the main listing
        listing = Listing.objects.create(**validated_data)
        
        # Create category-specific model instance
        if category and category_data:
            category_type = category.category_type
            
            if category_type == 'jobs' and any(category_data.values()):
                JobListing.objects.create(listing=listing, **category_data)
            elif category_type == 'housing' and any(category_data.values()):
                HousingListing.objects.create(listing=listing, **category_data)
            elif category_type == 'roommates' and any(category_data.values()):
                RoommateListing.objects.create(listing=listing, **category_data)
            elif category_type == 'legal' and any(category_data.values()):
                LawyerListing.objects.create(listing=listing, **category_data)
            elif category_type == 'marketplace' and any(category_data.values()):
                MarketplaceListing.objects.create(listing=listing, **category_data)
            elif category_type == 'services' and any(category_data.values()):
                ServiceListing.objects.create(listing=listing, **category_data)
        
        return listing

# Image upload serializer
class ListingImageUploadSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        max_length=10,
        allow_empty=False
    )
    captions = serializers.ListField(
        child=serializers.CharField(max_length=200, allow_blank=True),
        required=False
    )