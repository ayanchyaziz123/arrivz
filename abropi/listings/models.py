# listings/models.py - Complete version with ALL model definitions + Helpful System

from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

# Location models
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=2, unique=True)
    code3 = models.CharField(max_length=3, unique=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class StateProvince(models.Model):
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=10, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('name', 'country')
        ordering = ['country__name', 'name']
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"

class City(models.Model):
    name = models.CharField(max_length=100)
    state_province = models.ForeignKey(StateProvince, on_delete=models.CASCADE, related_name='cities')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Cities"
        unique_together = ('name', 'state_province')
        ordering = ['state_province__country__name', 'state_province__name', 'name']
    
    def __str__(self):
        return f"{self.name}, {self.state_province.name}, {self.state_province.country.name}"

class Category(models.Model):
    CATEGORY_TYPES = [
        ('jobs', 'Jobs'),
        ('housing', 'Housing'),
        ('roommates', 'Roommates'),
        ('legal', 'Legal Services'),
        ('marketplace', 'Marketplace'),
        ('services', 'Services'),
        ('community', 'Community Events'),
        ('education', 'Education & Training'),
        ('transportation', 'Transportation'),
        ('business', 'Business Network'),
        ('mentorship', 'Mentorship'),
        ('volunteer', 'Volunteer Opportunities'),
        ('social', 'Social Groups'),
    ]
    
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    # Priority field to control display order
    priority_score = models.IntegerField(
        default=0,
        help_text="Higher numbers show first. Use 100+ for top priority categories."
    )
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['-priority_score', 'name']  # Order by priority, then name
    
    def __str__(self):
        return self.name

# Base Listing model
class Listing(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),                    # User saved but hasn't published yet
        ('pending', 'Pending Review'),         # Submitted for admin approval
        ('active', 'Active/Public'),           # Live and visible to everyone
        ('featured', 'Featured'),              # Highlighted/promoted listings
        ('paused', 'Paused'),                  # Temporarily hidden by user
        ('closed', 'Closed'),                  # No longer accepting responses
        ('expired', 'Expired'),                # Past expiration date
        ('rejected', 'Rejected'),              # Admin rejected the listing
        ('flagged', 'Flagged'),                # Reported by users, under review
        ('suspended', 'Suspended'),            # Admin suspended the listing
        ('archived', 'Archived'),              # Old listing kept for records
        ('cancelled', 'Cancelled'),            # User cancelled before approval
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('community', 'Only Your Community People'),
        ('same_origin', 'Only Your Origin Country'),
        ('verified_only', 'Verified Users Only'),
    ]
    
    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default='public',
        help_text='Who can see this listing'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Enhanced status and visibility fields
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    is_public = models.BooleanField(default=False, help_text="Whether listing is visible to public")
    requires_approval = models.BooleanField(default=True, help_text="Whether listing needs admin approval")
    
    # Approval workflow fields
    submitted_at = models.DateTimeField(null=True, blank=True, help_text="When submitted for review")
    approved_at = models.DateTimeField(null=True, blank=True, help_text="When approved by admin")
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='approved_listings', help_text="Admin who approved")
    rejection_reason = models.TextField(blank=True, help_text="Reason for rejection")
    admin_notes = models.TextField(blank=True, help_text="Internal admin notes")
    
    # Auto-publication settings
    auto_publish = models.BooleanField(default=False, help_text="Auto-publish after approval")
    publish_at = models.DateTimeField(null=True, blank=True, help_text="Schedule publication time")
    
    # Location fields
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state_province = models.ForeignKey(StateProvince, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    neighborhood = models.CharField(max_length=100, blank=True)
    address_line_1 = models.CharField(max_length=200, blank=True)
    address_line_2 = models.CharField(max_length=200, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Contact and status
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    website_url = models.URLField(blank=True)
    
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    
    # Enhanced expiration and timing
    expires_at = models.DateTimeField(null=True, blank=True, help_text="When listing expires")
    auto_renew = models.BooleanField(default=False, help_text="Auto-renew when expired")
    renewal_period_days = models.PositiveIntegerField(default=30, help_text="Days to extend when renewing")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_bumped_at = models.DateTimeField(null=True, blank=True, help_text="When listing was last bumped up")
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['country', 'state_province']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['status', 'is_public']),
            models.Index(fields=['created_at']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['approved_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('listing_detail', kwargs={'pk': self.pk})
    
    # HELPFUL SYSTEM METHODS - ADD THESE TO YOUR EXISTING LISTING MODEL
    @property
    def helpful_count(self):
        """Get number of helpful votes for this listing"""
        return self.helpful_votes.count()

    def is_helpful_by_user(self, user):
        """Check if a specific user marked this as helpful"""
        if not user.is_authenticated:
            return False
        return self.helpful_votes.filter(user=user).exists()

    def toggle_helpful(self, user):
        """Toggle helpful status for a user"""
        if not user.is_authenticated:
            return False
        
        # Import here to avoid circular imports
        from .models import ListingHelpful
        
        helpful_vote, created = ListingHelpful.objects.get_or_create(
            listing=self,
            user=user
        )
        
        if not created:
            # If it existed, remove it (unlike)
            helpful_vote.delete()
            return False
        else:
            # If it's new, keep it (like)
            return True
    
    # Visibility methods
    def can_user_view(self, user):
        """Check if a user can view this listing based on visibility settings"""
        if self.visibility == 'public':
            # Everyone can see public listings
            return True
            
        elif self.visibility == 'community':
            # "Only Your Community People" - based on profile community settings
            return (user.is_authenticated and 
                   hasattr(user, 'country_of_origin') and
                   hasattr(self.user, 'country_of_origin') and
                   user.country_of_origin == self.user.country_of_origin and
                   user.country_of_origin)  # Both must have a country set
            
        elif self.visibility == 'same_origin':
            # "Only Your Origin Country" - strictly country of origin
            return (user.is_authenticated and 
                   hasattr(user, 'country_of_origin') and
                   hasattr(self.user, 'country_of_origin') and
                   user.country_of_origin == self.user.country_of_origin and
                   user.country_of_origin)  # Both must have a country set
            
        elif self.visibility == 'verified_only':
            # "Verified Users Only" - highest trust level
            return user.is_authenticated and getattr(user, 'is_verified', False)
            
        return False
    
    def get_visibility_icon(self):
        """Get icon for visibility level"""
        icons = {
            'public': 'fas fa-globe',
            'community': 'fas fa-users', 
            'same_origin': 'fas fa-flag',
            'verified_only': 'fas fa-user-check'
        }
        return icons.get(self.visibility, 'fas fa-question')
    
    def get_visibility_description(self):
        """Get human-readable description of who can see this listing"""
        if self.visibility == 'public':
            return "Everyone"
        elif self.visibility == 'community':
            # Based on profile community - could be country or broader community
            if hasattr(self.user, 'country_of_origin'):
                origin = getattr(self.user, 'get_country_of_origin_display', lambda: str(self.user.country_of_origin))()
                return f"Your community ({origin})"
            return "Your community"
        elif self.visibility == 'same_origin':
            if hasattr(self.user, 'country_of_origin'):
                origin = getattr(self.user, 'get_country_of_origin_display', lambda: str(self.user.country_of_origin))()
                return f"People from {origin}"
            return "People from your origin country"
        elif self.visibility == 'verified_only':
            return "Verified users only"
        return "Unknown"
    
    def get_estimated_audience_size(self):
        """Estimate potential viewers for this listing"""
        try:
            # Try to import CustomUser, fallback to User if not available
            try:
                from accounts.models import CustomUser
                UserModel = CustomUser
            except ImportError:
                UserModel = User
            
            if self.visibility == 'public':
                return "Unlimited"
            elif self.visibility in ['community', 'same_origin']:
                if hasattr(self.user, 'country_of_origin'):
                    count = UserModel.objects.filter(
                        country_of_origin=self.user.country_of_origin,
                        is_active=True
                    ).count()
                    return f"~{count} people"
                return "Your community"
            elif self.visibility == 'verified_only':
                count = UserModel.objects.filter(
                    is_active=True
                ).filter(
                    models.Q(is_verified=True) if hasattr(UserModel, 'is_verified') else models.Q()
                ).count()
                return f"~{count} verified users"
            return "0"
        except Exception:
            return "Unknown"
    
    # Status management methods
    def can_be_published(self):
        """Check if listing can be published"""
        return self.status in ['draft', 'pending', 'approved'] and self.is_complete()
    
    def is_complete(self):
        """Check if listing has all required fields"""
        required_fields = [self.title, self.description, self.contact_email]
        return all(field for field in required_fields)
    
    def is_visible_to_public(self):
        """Check if listing is visible to public users"""
        return self.is_public and self.status in ['active', 'featured']
    
    def is_editable_by_user(self):
        """Check if user can edit this listing"""
        return self.status in ['draft', 'pending', 'rejected', 'active', 'paused']
    
    def submit_for_review(self):
        """Submit listing for admin review"""
        if self.status == 'draft' and self.is_complete():
            self.status = 'pending'
            self.submitted_at = timezone.now()
            self.save(update_fields=['status', 'submitted_at'])
            return True
        return False
    
    def approve(self, admin_user, auto_publish=True):
        """Approve listing (admin action)"""
        self.status = 'active' if auto_publish else 'approved'
        self.approved_at = timezone.now()
        self.approved_by = admin_user
        self.is_public = auto_publish
        if auto_publish and not self.publish_at:
            self.publish_at = timezone.now()
        self.save(update_fields=['status', 'approved_at', 'approved_by', 'is_public', 'publish_at'])
    
    def reject(self, admin_user, reason=""):
        """Reject listing (admin action)"""
        self.status = 'rejected'
        self.rejection_reason = reason
        self.approved_by = admin_user
        self.is_public = False
        self.save(update_fields=['status', 'rejection_reason', 'approved_by', 'is_public'])
    
    def publish(self):
        """Publish an approved listing"""
        if self.status in ['approved', 'paused']:
            self.status = 'active'
            self.is_public = True
            if not self.publish_at:
                self.publish_at = timezone.now()
            self.save(update_fields=['status', 'is_public', 'publish_at'])
    
    def pause(self):
        """Pause/hide listing temporarily"""
        if self.status == 'active':
            self.status = 'paused'
            self.is_public = False
            self.save(update_fields=['status', 'is_public'])
    
    def close(self):
        """Close listing (no longer accepting responses)"""
        self.status = 'closed'
        self.is_public = False
        self.save(update_fields=['status', 'is_public'])
    
    def flag_for_review(self, reason=""):
        """Flag listing for admin review"""
        if self.status not in ['flagged', 'suspended']:
            self.status = 'flagged'
            self.admin_notes = f"Flagged: {reason}"
            self.is_public = False
            self.save(update_fields=['status', 'admin_notes', 'is_public'])
    
    def suspend(self, admin_user, reason=""):
        """Suspend listing (admin action)"""
        self.status = 'suspended'
        self.rejection_reason = reason
        self.approved_by = admin_user
        self.is_public = False
        self.save(update_fields=['status', 'rejection_reason', 'approved_by', 'is_public'])
    
    def archive(self):
        """Archive old listing"""
        self.status = 'archived'
        self.is_public = False
        self.save(update_fields=['status', 'is_public'])
    
    def bump(self):
        """Bump listing to top (refresh created_at or use last_bumped_at)"""
        self.last_bumped_at = timezone.now()
        self.save(update_fields=['last_bumped_at'])
    
    def renew(self, days=None):
        """Renew expired listing"""
        if not days:
            days = self.renewal_period_days
        
        if self.status == 'expired':
            self.status = 'active'
            self.expires_at = timezone.now() + timezone.timedelta(days=days)
            self.is_public = True
            self.save(update_fields=['status', 'expires_at', 'is_public'])
    
    # Status display properties
    @property
    def status_display(self):
        """Get user-friendly status display"""
        status_map = {
            'draft': '📝 Draft',
            'pending': '⏳ Under Review',
            'active': '✅ Live',
            'featured': '⭐ Featured',
            'paused': '⏸️ Paused',
            'closed': '🔒 Closed',
            'expired': '⏰ Expired',
            'rejected': '❌ Rejected',
            'flagged': '🚩 Flagged',
            'suspended': '🚫 Suspended',
            'archived': '📁 Archived',
            'cancelled': '🗑️ Cancelled',
        }
        return status_map.get(self.status, self.status.title())
    
    @property
    def status_color_class(self):
        """Get CSS class for status color"""
        color_map = {
            'draft': 'text-gray-600',
            'pending': 'text-yellow-600',
            'active': 'text-green-600',
            'featured': 'text-purple-600',
            'paused': 'text-blue-600',
            'closed': 'text-gray-500',
            'expired': 'text-orange-600',
            'rejected': 'text-red-600',
            'flagged': 'text-red-500',
            'suspended': 'text-red-700',
            'archived': 'text-gray-400',
            'cancelled': 'text-gray-500',
        }
        return color_map.get(self.status, 'text-gray-600')
    
    @property
    def can_be_edited(self):
        """Check if listing can be edited"""
        return self.status in ['draft', 'rejected', 'paused', 'active']
    
    @property
    def can_be_deleted(self):
        """Check if listing can be deleted"""
        return self.status in ['draft', 'rejected', 'cancelled', 'archived']
    
    @property
    def days_until_expiry(self):
        """Get days until listing expires"""
        if self.expires_at:
            delta = self.expires_at - timezone.now()
            return delta.days if delta.days > 0 else 0
        return None
    
    @property
    def listing_type(self):
        """Get the specific listing type"""
        type_mapping = {
            'joblisting': 'job',
            'housinglisting': 'housing',
            'roommate': 'roommate',
            'lawyerlisting': 'lawyer',
            'marketplacelisting': 'marketplace',
            'servicelisting': 'service',
            'communityevent': 'community',
            'educationlisting': 'education',
            'transportationlisting': 'transportation',
            'businesslisting': 'business',
            'mentorshiplisting': 'mentorship',
            'volunteerlisting': 'volunteer',
            'socialgrouping': 'social',
        }
        
        for attr, type_name in type_mapping.items():
            if hasattr(self, attr):
                return type_name
        return 'general'
    
    @property
    def price_info(self):
        """Get price information from the specific listing type"""
        try:
            if hasattr(self, 'joblisting'):
                return self.joblisting.salary_display
            elif hasattr(self, 'housinglisting'):
                return self.housinglisting.price_display
            elif hasattr(self, 'roommate'):
                return self.roommate.price_display
            elif hasattr(self, 'lawyerlisting'):
                return self.lawyerlisting.pricing_display
            elif hasattr(self, 'marketplacelisting'):
                return self.marketplacelisting.price_display
            elif hasattr(self, 'servicelisting'):
                return self.servicelisting.price_display
            elif hasattr(self, 'educationlisting'):
                return self.educationlisting.price_display
            elif hasattr(self, 'transportationlisting'):
                return self.transportationlisting.price_display
            else:
                return "Free"
        except:
            return "Contact for details"

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.listing.title}"

# Helpful system model - MUST BE DEFINED BEFORE THE SIGNALS
class ListingHelpful(models.Model):
    """Track when users mark listings as helpful"""
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='helpful_votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='helpful_listings')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('listing', 'user')  # Prevent duplicate votes
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} found {self.listing.title} helpful"

# Status tracking model
class ListingStatusHistory(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=15, blank=True)
    new_status = models.CharField(max_length=15)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_reason = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-changed_at']
        verbose_name_plural = "Listing Status Histories"
    
    def __str__(self):
        return f"{self.listing.title}: {self.old_status} → {self.new_status}"

# Add signal to track status changes
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

@receiver(pre_save, sender=Listing)
def track_status_change(sender, instance, **kwargs):
    """Track status changes in ListingStatusHistory"""
    if instance.pk:  # Only for existing listings
        try:
            old_instance = Listing.objects.get(pk=instance.pk)
            if old_instance.status != instance.status:
                # We'll create the history record in post_save
                instance._status_changed = True
                instance._old_status = old_instance.status
        except Listing.DoesNotExist:
            pass

@receiver(post_save, sender=Listing)
def create_status_history(sender, instance, created, **kwargs):
    """Create status history record after status change"""
    if hasattr(instance, '_status_changed') and instance._status_changed:
        ListingStatusHistory.objects.create(
            listing=instance,
            old_status=instance._old_status,
            new_status=instance.status,
            changed_by=getattr(instance, '_changed_by', None),
            change_reason=getattr(instance, '_change_reason', ''),
        )
        # Clean up temporary attributes
        delattr(instance, '_status_changed')
        delattr(instance, '_old_status')

# ALL YOUR EXISTING MODELS CONTINUE BELOW...

# JOB LISTING MODEL
class JobListing(models.Model):
    JOB_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    company_name = models.CharField(max_length=200)
    
    # Salary information
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_period = models.CharField(max_length=20, choices=[
        ('hourly', 'Hourly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ], default='yearly')
    salary_currency = models.CharField(max_length=3, default='USD')
    salary_negotiable = models.BooleanField(default=False)
    
    # Additional compensation
    bonus_info = models.TextField(blank=True, help_text="Bonus, commission, stock options, etc.")
    benefits = models.TextField(blank=True)
    
    # Job details
    requirements = models.TextField()
    visa_sponsorship = models.BooleanField(default=False)
    remote_work = models.BooleanField(default=False)
    
    @property
    def salary_display(self):
        """Return formatted salary information"""
        if self.salary_negotiable:
            return "Salary negotiable"
        
        if not self.salary_min and not self.salary_max:
            return "Salary not specified"
        
        currency = self.salary_currency
        period_map = {'hourly': '/hour', 'monthly': '/month', 'yearly': '/year'}
        period_suffix = period_map.get(self.salary_period, '')
        
        if self.salary_min and self.salary_max:
            return f"{currency} {self.salary_min:,.0f} - {self.salary_max:,.0f}{period_suffix}"
        elif self.salary_min:
            return f"{currency} {self.salary_min:,.0f}+{period_suffix}"
        else:
            return f"Up to {currency} {self.salary_max:,.0f}{period_suffix}"
    
    def __str__(self):
        return f"Job: {self.listing.title}"

# HOUSING LISTING MODEL
class HousingListing(models.Model):
    HOUSING_TYPES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('room', 'Room'),
        ('studio', 'Studio'),
        ('condo', 'Condo'),
        ('shared', 'Shared Housing'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE)
    housing_type = models.CharField(max_length=20, choices=HOUSING_TYPES)
    
    # Property details
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    square_feet = models.PositiveIntegerField(null=True, blank=True)
    
    # Pricing
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    rent_period = models.CharField(max_length=20, choices=[
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('daily', 'Daily'),
    ], default='monthly')
    rent_currency = models.CharField(max_length=3, default='USD')
    rent_negotiable = models.BooleanField(default=False)
    
    # Additional costs
    deposit_required = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    utilities_cost = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    utilities_included = models.BooleanField(default=False)
    
    # Property features
    furnished = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    parking_available = models.BooleanField(default=False)
    laundry_available = models.BooleanField(default=False)
    
    # Lease details
    lease_term_min = models.PositiveIntegerField(help_text="Minimum lease term in months", default=1)
    available_date = models.DateField(null=True, blank=True)
    
    @property
    def price_display(self):
        """Return formatted rent information"""
        if self.rent_negotiable:
            return "Rent negotiable"
        
        period_suffix = f"/{self.rent_period.replace('ly', '')}"
        return f"{self.rent_currency} {self.rent_amount:,.0f}{period_suffix}"
    
    @property
    def total_monthly_cost(self):
        """Calculate total monthly cost including utilities"""
        monthly_rent = self.rent_amount
        
        # Convert to monthly if needed
        if self.rent_period == 'weekly':
            monthly_rent = self.rent_amount * 4.33
        elif self.rent_period == 'daily':
            monthly_rent = self.rent_amount * 30
        
        if not self.utilities_included and self.utilities_cost:
            monthly_rent += self.utilities_cost
        
        return monthly_rent
    
    def __str__(self):
        return f"Housing: {self.listing.title}"

# ROOMMATE LISTING MODEL
class RoommateListing(models.Model):
    ROOM_TYPES = [
        ('private_room', 'Private Room'),
        ('shared_room', 'Shared Room'),
        ('master_bedroom', 'Master Bedroom'),
        ('studio_share', 'Studio Share'),
    ]
    
    GENDER_PREFERENCES = [
        ('any', 'Any Gender'),
        ('male', 'Male Only'),
        ('female', 'Female Only'),
        ('non_binary', 'Non-Binary'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='roommate')
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    
    # Pricing
    monthly_rent = models.DecimalField(max_digits=8, decimal_places=2)
    rent_currency = models.CharField(max_length=3, default='USD')
    deposit_required = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    utilities_cost = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    utilities_included = models.BooleanField(default=False)
    
    # Room details
    private_bathroom = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)
    has_closet = models.BooleanField(default=True)
    window_available = models.BooleanField(default=True)
    
    # Shared spaces
    shared_kitchen = models.BooleanField(default=True)
    shared_living_room = models.BooleanField(default=True)
    parking_available = models.BooleanField(default=False)
    laundry_available = models.BooleanField(default=False)
    
    # Roommate preferences
    gender_preference = models.CharField(max_length=20, choices=GENDER_PREFERENCES, default='any')
    age_min = models.PositiveIntegerField(null=True, blank=True, help_text="Minimum age preference")
    age_max = models.PositiveIntegerField(null=True, blank=True, help_text="Maximum age preference")
    students_welcome = models.BooleanField(default=True)
    working_professionals = models.BooleanField(default=True)
    pets_allowed = models.BooleanField(default=False)
    smoking_allowed = models.BooleanField(default=False)
    
    # Lease details
    lease_term_months = models.PositiveIntegerField(default=12, help_text="Lease term in months")
    move_in_date = models.DateField(null=True, blank=True)
    flexible_dates = models.BooleanField(default=False)
    
    # Current roommate info
    current_roommates_count = models.PositiveIntegerField(default=0)
    total_bedrooms = models.PositiveIntegerField()
    total_bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    
    @property
    def price_display(self):
        """Return formatted rent information"""
        base_rent = f"{self.rent_currency} {self.monthly_rent:,.0f}/month"
        
        if self.utilities_included:
            return f"{base_rent} (utilities included)"
        elif self.utilities_cost:
            total = self.monthly_rent + self.utilities_cost
            return f"{base_rent} + {self.rent_currency} {self.utilities_cost}/month utilities"
        else:
            return f"{base_rent} + utilities"
    
    def __str__(self):
        return f"Roommate: {self.listing.title}"

# MARKETPLACE LISTING MODEL
class MarketplaceListing(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
        ('for_parts', 'For Parts/Not Working'),
    ]
    
    ITEM_CATEGORIES = [
        ('electronics', 'Electronics'),
        ('furniture', 'Furniture'),
        ('clothing', 'Clothing & Accessories'),
        ('books', 'Books & Media'),
        ('home_garden', 'Home & Garden'),
        ('sports', 'Sports & Recreation'),
        ('vehicles', 'Vehicles'),
        ('appliances', 'Appliances'),
        ('tools', 'Tools'),
        ('toys', 'Toys & Games'),
        ('musical_instruments', 'Musical Instruments'),
        ('art_crafts', 'Arts & Crafts'),
        ('other', 'Other'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='marketplacelisting')
    
    # Item details
    item_category = models.CharField(max_length=30, choices=ITEM_CATEGORIES)
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    year_purchased = models.PositiveIntegerField(null=True, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    price_negotiable = models.BooleanField(default=False)
    accepting_trades = models.BooleanField(default=False)
    trade_preferences = models.TextField(blank=True, help_text="What items you'd accept in trade")
    
    # Item specifics
    dimensions = models.CharField(max_length=100, blank=True, help_text="L x W x H")
    weight = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50, blank=True)
    material = models.CharField(max_length=100, blank=True)
    
    # Availability
    quantity_available = models.PositiveIntegerField(default=1)
    pickup_available = models.BooleanField(default=True)
    delivery_available = models.BooleanField(default=False)
    delivery_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    shipping_available = models.BooleanField(default=False)
    
    # Purchase details
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    purchase_receipt = models.BooleanField(default=False, help_text="Do you have the original receipt?")
    warranty_remaining = models.BooleanField(default=False)
    warranty_details = models.TextField(blank=True)
    
    @property
    def price_display(self):
        """Return formatted price information"""
        price_str = f"{self.currency} {self.price:,.2f}"
        
        if self.price_negotiable:
            price_str += " (negotiable)"
        
        if self.accepting_trades:
            price_str += " or trade"
        
        return price_str
    
    def __str__(self):
        return f"Marketplace: {self.listing.title}"

# LAWYER LISTING MODEL
class LawyerListing(models.Model):
    SPECIALIZATIONS = [
        ('immigration', 'Immigration Law'),
        ('employment', 'Employment Law'),
        ('family', 'Family Law'),
        ('business', 'Business Law'),
        ('criminal', 'Criminal Law'),
        ('civil_rights', 'Civil Rights'),
        ('housing', 'Housing Law'),
        ('personal_injury', 'Personal Injury'),
        ('bankruptcy', 'Bankruptcy'),
        ('estate_planning', 'Estate Planning'),
        ('other', 'Other'),
    ]
    
    PRICING_MODELS = [
        ('hourly', 'Hourly Rate'),
        ('flat_fee', 'Flat Fee'),
        ('contingency', 'Contingency Fee'),
        ('retainer', 'Retainer'),
        ('consultation_only', 'Consultation Only'),
        ('pro_bono', 'Pro Bono'),
        ('varies', 'Varies by Case'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE)
    law_firm = models.CharField(max_length=200, blank=True)
    specializations = models.CharField(max_length=200)  # Comma-separated
    years_experience = models.PositiveIntegerField()
    bar_admissions = models.CharField(max_length=200)  # States/countries where admitted
    languages = models.CharField(max_length=200, blank=True)
    license_number = models.CharField(max_length=100, blank=True)
    
    # Pricing (optional - lawyers may not want to display rates)
    pricing_model = models.CharField(max_length=20, choices=PRICING_MODELS, default='varies')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    
    # Service details
    accepts_pro_bono = models.BooleanField(default=False)
    free_consultation = models.BooleanField(default=False)
    offers_payment_plans = models.BooleanField(default=False)
    virtual_consultations = models.BooleanField(default=True)
    
    @property
    def pricing_display(self):
        """Return formatted pricing information"""
        if self.pricing_model == 'pro_bono':
            return "Pro Bono (Free)"
        elif self.pricing_model == 'hourly' and self.hourly_rate:
            return f"{self.currency} {self.hourly_rate}/hour"
        elif self.pricing_model == 'consultation_only' and self.consultation_fee:
            fee_text = f"{self.currency} {self.consultation_fee} consultation"
            if self.free_consultation:
                fee_text += " (first consultation free)"
            return fee_text
        elif self.free_consultation:
            return "Free consultation available"
        else:
            return "Contact for pricing"
    
    def __str__(self):
        return f"Lawyer: {self.listing.title}"

# SERVICE LISTING MODEL
class ServiceListing(models.Model):
    SERVICE_CATEGORIES = [
        ('home_services', 'Home Services'),
        ('tutoring', 'Tutoring & Education'),
        ('tech_support', 'Tech Support'),
        ('translation', 'Translation Services'),
        ('photography', 'Photography'),
        ('event_planning', 'Event Planning'),
        ('consulting', 'Consulting'),
        ('fitness', 'Fitness & Health'),
        ('childcare', 'Childcare'),
        ('pet_services', 'Pet Services'),
        ('automotive', 'Automotive Services'),
        ('other', 'Other Services'),
    ]
    
    PRICING_TYPES = [
        ('hourly', 'Hourly Rate'),
        ('fixed', 'Fixed Price'),
        ('per_session', 'Per Session'),
        ('per_project', 'Per Project'),
        ('consultation', 'Consultation Fee'),
        ('free', 'Free'),
        ('varies', 'Varies'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='servicelisting')
    service_category = models.CharField(max_length=30, choices=SERVICE_CATEGORIES)
    
    # Pricing
    pricing_type = models.CharField(max_length=20, choices=PRICING_TYPES, default='hourly')
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    price_negotiable = models.BooleanField(default=False)
    
    # Service details
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    languages_offered = models.CharField(max_length=200, blank=True)
    certifications = models.TextField(blank=True)
    
    # Availability
    available_weekdays = models.BooleanField(default=True)
    available_weekends = models.BooleanField(default=False)
    available_evenings = models.BooleanField(default=False)
    remote_service = models.BooleanField(default=False)
    travel_radius_miles = models.PositiveIntegerField(null=True, blank=True)
    
    @property
    def price_display(self):
        if self.pricing_type == 'free':
            return "Free"
        elif not self.price:
            return "Contact for pricing"
        
        price_str = f"{self.currency} {self.price:,.2f}"
        type_suffixes = {
            'hourly': '/hour',
            'per_session': '/session',
            'per_project': '/project',
            'consultation': ' consultation'
        }
        
        suffix = type_suffixes.get(self.pricing_type, '')
        if self.price_negotiable:
            suffix += ' (negotiable)'
        
        return price_str + suffix
    
    def __str__(self):
        return f"Service: {self.listing.title}"

# Favorites and Messages
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'listing')

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username}"