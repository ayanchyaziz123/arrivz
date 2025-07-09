# listings/admin.py (COMPLETE VERSION with Helpful System)
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Country, StateProvince, City, Category, Listing, ListingImage, 
    JobListing, HousingListing, RoommateListing, MarketplaceListing, 
    LawyerListing, ServiceListing, Favorite, Message, ListingStatusHistory,
    ListingHelpful  # Add ListingHelpful import
)

# Location models
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'code3', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'code']

@admin.register(StateProvince)
class StateProvinceAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'country', 'is_active']
    list_filter = ['country', 'is_active']
    search_fields = ['name', 'short_name']

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'state_province', 'is_active']
    list_filter = ['state_province__country', 'is_active']
    search_fields = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'priority_score', 'description']
    list_filter = ['category_type']
    search_fields = ['name']
    list_editable = ['priority_score']  # Allow inline editing of priority

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'user', 'get_price_info', 'status', 
        'helpful_count', 'views_count', 'created_at'
    ]
    list_filter = [
        'status', 'category', 'is_featured', 'is_public', 'created_at',
        'priority'
    ]
    search_fields = ['title', 'description', 'user__username']
    readonly_fields = [
        'views_count', 'created_at', 'updated_at', 'submitted_at', 
        'approved_at', 'helpful_count', 'helpful_votes_list'
    ]
    
    def get_price_info(self, obj):
        """Get price information from the listing"""
        return obj.price_info
    get_price_info.short_description = 'Price'
    
    def helpful_count(self, obj):
        """Display helpful count with icon"""
        count = obj.helpful_count
        if count > 0:
            return format_html(
                '<span style="color: #059669; font-weight: bold;">👍 {}</span>',
                count
            )
        return '—'
    helpful_count.short_description = 'Helpful Votes'
    helpful_count.admin_order_field = 'helpful_votes__count'
    
    def helpful_votes_list(self, obj):
        """Show recent helpful votes"""
        if obj.pk:
            recent_votes = obj.helpful_votes.select_related('user').order_by('-created_at')[:5]
            if recent_votes:
                votes_html = []
                for vote in recent_votes:
                    votes_html.append(
                        f'<div style="margin-bottom: 5px;">'
                        f'<strong>{vote.user.username}</strong> - '
                        f'{vote.created_at.strftime("%m/%d/%Y %H:%M")}'
                        f'</div>'
                    )
                return mark_safe(''.join(votes_html))
            return 'No helpful votes yet'
        return 'Save listing first'
    helpful_votes_list.short_description = 'Recent Helpful Votes'
    
    def get_queryset(self, request):
        """Optimize queryset with helpful vote counts"""
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            helpful_votes_count=Count('helpful_votes')
        ).select_related('category', 'user').prefetch_related('helpful_votes__user')
        return queryset
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'user')
        }),
        ('Location', {
            'fields': ('country', 'state_province', 'city', 'neighborhood', 
                      'address_line_1', 'address_line_2', 'zip_code')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'website_url')
        }),
        ('Status & Visibility', {
            'fields': ('status', 'is_public', 'requires_approval', 'priority', 'is_featured')
        }),
        ('Timing', {
            'fields': ('expires_at', 'auto_renew', 'renewal_period_days', 'publish_at')
        }),
        ('Approval Workflow', {
            'fields': ('submitted_at', 'approved_at', 'approved_by', 'rejection_reason', 'admin_notes'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views_count', 'helpful_count', 'helpful_votes_list', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_featured', 'mark_not_featured', 'approve_listings', 'reject_listings']
    
    def mark_featured(self, request, queryset):
        """Mark selected listings as featured"""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} listings marked as featured.')
    mark_featured.short_description = 'Mark selected listings as featured'
    
    def mark_not_featured(self, request, queryset):
        """Remove featured status from selected listings"""
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} listings removed from featured.')
    mark_not_featured.short_description = 'Remove featured status'
    
    def approve_listings(self, request, queryset):
        """Approve selected listings"""
        updated = 0
        for listing in queryset.filter(status='pending'):
            listing.approve(request.user, auto_publish=True)
            updated += 1
        self.message_user(request, f'{updated} listings approved and published.')
    approve_listings.short_description = 'Approve and publish selected listings'
    
    def reject_listings(self, request, queryset):
        """Reject selected listings"""
        updated = 0
        for listing in queryset.filter(status='pending'):
            listing.reject(request.user, reason="Rejected by admin")
            updated += 1
        self.message_user(request, f'{updated} listings rejected.')
    reject_listings.short_description = 'Reject selected listings'

# HELPFUL SYSTEM ADMIN
@admin.register(ListingHelpful)
class ListingHelpfulAdmin(admin.ModelAdmin):
    list_display = ['listing_title', 'user', 'created_at', 'listing_category']
    list_filter = ['created_at', 'listing__category', 'listing__status']
    search_fields = ['listing__title', 'user__username', 'user__email']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def listing_title(self, obj):
        """Show listing title with link"""
        url = reverse('admin:listings_listing_change', args=[obj.listing.pk])
        return format_html('<a href="{}">{}</a>', url, obj.listing.title)
    listing_title.short_description = 'Listing'
    listing_title.admin_order_field = 'listing__title'
    
    def listing_category(self, obj):
        """Show listing category"""
        return obj.listing.category.name
    listing_category.short_description = 'Category'
    listing_category.admin_order_field = 'listing__category__name'
    
    def get_queryset(self, request):
        """Optimize queryset"""
        queryset = super().get_queryset(request)
        return queryset.select_related('listing', 'user', 'listing__category')
    
    actions = ['delete_selected_votes']
    
    def delete_selected_votes(self, request, queryset):
        """Delete selected helpful votes"""
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} helpful votes deleted.')
    delete_selected_votes.short_description = 'Delete selected helpful votes'

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'company_name', 'job_type', 'get_salary_display', 'visa_sponsorship', 'remote_work']
    list_filter = ['job_type', 'visa_sponsorship', 'remote_work', 'salary_period']
    search_fields = ['listing__title', 'company_name', 'requirements']
    
    def get_salary_display(self, obj):
        return obj.salary_display
    get_salary_display.short_description = 'Salary'

@admin.register(HousingListing)
class HousingListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'housing_type', 'bedrooms', 'bathrooms', 'get_price_display', 'furnished', 'pets_allowed']
    list_filter = ['housing_type', 'furnished', 'pets_allowed', 'parking_available', 'utilities_included']
    search_fields = ['listing__title']
    
    def get_price_display(self, obj):
        return obj.price_display
    get_price_display.short_description = 'Rent'

@admin.register(RoommateListing)
class RoommateListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'room_type', 'gender_preference', 'get_price_display', 'pets_allowed']
    list_filter = ['room_type', 'gender_preference', 'pets_allowed', 'smoking_allowed', 'furnished']
    search_fields = ['listing__title']
    
    def get_price_display(self, obj):
        return obj.price_display
    get_price_display.short_description = 'Rent'

@admin.register(MarketplaceListing)
class MarketplaceListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'item_category', 'brand', 'condition', 'get_price_display', 'accepting_trades']
    list_filter = ['item_category', 'condition', 'accepting_trades', 'pickup_available', 'delivery_available']
    search_fields = ['listing__title', 'brand', 'model']
    
    def get_price_display(self, obj):
        return obj.price_display
    get_price_display.short_description = 'Price'

@admin.register(LawyerListing)
class LawyerListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'law_firm', 'years_experience', 'get_pricing_display', 'accepts_pro_bono']
    list_filter = ['pricing_model', 'accepts_pro_bono', 'free_consultation', 'virtual_consultations']
    search_fields = ['listing__title', 'law_firm', 'specializations', 'bar_admissions']
    
    def get_pricing_display(self, obj):
        return obj.pricing_display
    get_pricing_display.short_description = 'Pricing'

@admin.register(ServiceListing)
class ServiceListingAdmin(admin.ModelAdmin):
    list_display = ['listing', 'service_category', 'pricing_type', 'get_price_display', 'remote_service']
    list_filter = ['service_category', 'pricing_type', 'remote_service', 'available_weekends']
    search_fields = ['listing__title', 'languages_offered']
    
    def get_price_display(self, obj):
        return obj.price_display
    get_price_display.short_description = 'Price'

@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ['listing', 'caption', 'is_primary', 'image_preview']
    list_filter = ['is_primary']
    search_fields = ['listing__title', 'caption']
    
    def image_preview(self, obj):
        """Show image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return 'No image'
    image_preview.short_description = 'Preview'

@admin.register(ListingStatusHistory)
class ListingStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['listing', 'old_status', 'new_status', 'changed_by', 'changed_at']
    list_filter = ['old_status', 'new_status', 'changed_at']
    search_fields = ['listing__title', 'change_reason']
    readonly_fields = ['changed_at']
    date_hierarchy = 'changed_at'

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'listing', 'created_at']
    list_filter = ['created_at', 'listing__category']
    search_fields = ['user__username', 'listing__title']
    date_hierarchy = 'created_at'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'subject', 'is_read', 'created_at', 'about_listing']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'recipient__username', 'subject']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def about_listing(self, obj):
        """Show related listing if any"""
        if obj.listing:
            url = reverse('admin:listings_listing_change', args=[obj.listing.pk])
            return format_html('<a href="{}">{}</a>', url, obj.listing.title)
        return '—'
    about_listing.short_description = 'Related Listing'

# CUSTOM ADMIN ACTIONS AND UTILITIES
class HelpfulStatsAdmin:
    """Mixin for adding helpful stats to admin pages"""
    
    def get_helpful_stats(self, request):
        """Get helpful system statistics"""
        from django.db.models import Count, Q
        from django.utils import timezone
        from datetime import timedelta
        
        # Total helpful votes
        total_votes = ListingHelpful.objects.count()
        
        # Votes this week
        week_ago = timezone.now() - timedelta(days=7)
        votes_this_week = ListingHelpful.objects.filter(created_at__gte=week_ago).count()
        
        # Most helpful listings
        most_helpful = Listing.objects.annotate(
            helpful_count=Count('helpful_votes')
        ).filter(helpful_count__gt=0).order_by('-helpful_count')[:5]
        
        # Active users (users who voted in last 30 days)
        month_ago = timezone.now() - timedelta(days=30)
        active_voters = ListingHelpful.objects.filter(
            created_at__gte=month_ago
        ).values('user').distinct().count()
        
        return {
            'total_votes': total_votes,
            'votes_this_week': votes_this_week,
            'most_helpful': most_helpful,
            'active_voters': active_voters,
        }

# Custom admin site configuration
admin.site.site_header = 'Abropi Administration'
admin.site.site_title = 'Abropi Admin'
admin.site.index_title = 'Welcome to Abropi Administration'

# Add custom CSS for admin
admin.site.enable_nav_sidebar = True