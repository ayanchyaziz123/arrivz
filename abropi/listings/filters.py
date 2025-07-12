# listings/filters.py
import django_filters
from django.db.models import Q
from .models import Listing, Category, Country, StateProvince, City

class ListingFilter(django_filters.FilterSet):
    # Basic filters
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        field_name='category'
    )
    category_type = django_filters.CharFilter(
        field_name='category__category_type',
        lookup_expr='exact'
    )
    country = django_filters.ModelChoiceFilter(
        queryset=Country.objects.all(),
        field_name='country'
    )
    state = django_filters.ModelChoiceFilter(
        queryset=StateProvince.objects.all(),
        field_name='state_province'
    )
    city = django_filters.ModelChoiceFilter(
        queryset=City.objects.all(),
        field_name='city'
    )
    
    # Status and visibility filters
    status = django_filters.CharFilter(field_name='status')
    visibility = django_filters.CharFilter(field_name='visibility')
    priority = django_filters.CharFilter(field_name='priority')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    
    # Date filters
    created_after = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte'
    )
    created_before = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='lte'
    )
    expires_after = django_filters.DateFilter(
        field_name='expires_at',
        lookup_expr='gte'
    )
    expires_before = django_filters.DateFilter(
        field_name='expires_at',
        lookup_expr='lte'
    )
    
    # Price range filters (generic - works across different listing types)
    price_min = django_filters.NumberFilter(method='filter_price_min')
    price_max = django_filters.NumberFilter(method='filter_price_max')
    
    # Job-specific filters
    job_type = django_filters.CharFilter(
        field_name='joblisting__job_type',
        lookup_expr='exact'
    )
    salary_min = django_filters.NumberFilter(
        field_name='joblisting__salary_min',
        lookup_expr='gte'
    )
    salary_max = django_filters.NumberFilter(
        field_name='joblisting__salary_max',
        lookup_expr='lte'
    )
    visa_sponsorship = django_filters.BooleanFilter(
        field_name='joblisting__visa_sponsorship'
    )
    remote_work = django_filters.BooleanFilter(
        field_name='joblisting__remote_work'
    )
    
    # Housing-specific filters
    housing_type = django_filters.CharFilter(
        field_name='housinglisting__housing_type',
        lookup_expr='exact'
    )
    bedrooms = django_filters.NumberFilter(
        field_name='housinglisting__bedrooms',
        lookup_expr='exact'
    )
    bedrooms_min = django_filters.NumberFilter(
        field_name='housinglisting__bedrooms',
        lookup_expr='gte'
    )
    bedrooms_max = django_filters.NumberFilter(
        field_name='housinglisting__bedrooms',
        lookup_expr='lte'
    )
    bathrooms_min = django_filters.NumberFilter(
        field_name='housinglisting__bathrooms',
        lookup_expr='gte'
    )
    rent_min = django_filters.NumberFilter(
        field_name='housinglisting__rent_amount',
        lookup_expr='gte'
    )
    rent_max = django_filters.NumberFilter(
        field_name='housinglisting__rent_amount',
        lookup_expr='lte'
    )
    furnished = django_filters.BooleanFilter(
        field_name='housinglisting__furnished'
    )
    pets_allowed = django_filters.BooleanFilter(
        field_name='housinglisting__pets_allowed'
    )
    
    # Roommate-specific filters
    room_type = django_filters.CharFilter(
        field_name='roommate__room_type',
        lookup_expr='exact'
    )
    gender_preference = django_filters.CharFilter(
        field_name='roommate__gender_preference',
        lookup_expr='exact'
    )
    rent_roommate_min = django_filters.NumberFilter(
        field_name='roommate__monthly_rent',
        lookup_expr='gte'
    )
    rent_roommate_max = django_filters.NumberFilter(
        field_name='roommate__monthly_rent',
        lookup_expr='lte'
    )
    private_bathroom = django_filters.BooleanFilter(
        field_name='roommate__private_bathroom'
    )
    
    # Marketplace-specific filters
    item_category = django_filters.CharFilter(
        field_name='marketplacelisting__item_category',
        lookup_expr='exact'
    )
    condition = django_filters.CharFilter(
        field_name='marketplacelisting__condition',
        lookup_expr='exact'
    )
    accepting_trades = django_filters.BooleanFilter(
        field_name='marketplacelisting__accepting_trades'
    )
    
    # Service-specific filters
    service_category = django_filters.CharFilter(
        field_name='servicelisting__service_category',
        lookup_expr='exact'
    )
    pricing_type = django_filters.CharFilter(
        field_name='servicelisting__pricing_type',
        lookup_expr='exact'
    )
    remote_service = django_filters.BooleanFilter(
        field_name='servicelisting__remote_service'
    )
    
    # Legal-specific filters
    specializations = django_filters.CharFilter(
        field_name='lawyerlisting__specializations',
        lookup_expr='icontains'
    )
    years_experience_min = django_filters.NumberFilter(
        field_name='lawyerlisting__years_experience',
        lookup_expr='gte'
    )
    free_consultation = django_filters.BooleanFilter(
        field_name='lawyerlisting__free_consultation'
    )
    virtual_consultations = django_filters.BooleanFilter(
        field_name='lawyerlisting__virtual_consultations'
    )
    
    class Meta:
        model = Listing
        fields = []  # We define custom fields above
    
    def filter_price_min(self, queryset, name, value):
        """Filter by minimum price across all listing types"""
        if not value:
            return queryset
        
        return queryset.filter(
            Q(joblisting__salary_min__gte=value) |
            Q(housinglisting__rent_amount__gte=value) |
            Q(roommate__monthly_rent__gte=value) |
            Q(marketplacelisting__price__gte=value) |
            Q(servicelisting__price__gte=value) |
            Q(lawyerlisting__hourly_rate__gte=value)
        )
    
    def filter_price_max(self, queryset, name, value):
        """Filter by maximum price across all listing types"""
        if not value:
            return queryset
        
        return queryset.filter(
            Q(joblisting__salary_max__lte=value, joblisting__salary_max__isnull=False) |
            Q(joblisting__salary_min__lte=value) |
            Q(housinglisting__rent_amount__lte=value) |
            Q(roommate__monthly_rent__lte=value) |
            Q(marketplacelisting__price__lte=value) |
            Q(servicelisting__price__lte=value) |
            Q(lawyerlisting__hourly_rate__lte=value)
        )