# listings/views.py - Fixed version with correct field handling

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q, F, Count
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.utils import timezone
from decimal import Decimal, InvalidOperation

# Updated imports - match your actual models
from .models import (
    Listing, Category, Favorite, Message, ListingImage,
    Country, StateProvince, City,
    JobListing, 
    HousingListing, 
    LawyerListing,
    RoommateListing,
    MarketplaceListing,
    ServiceListing,
)

def home(request):
    """Home page view - redirects to core.views.home"""
    # This should be handled by core.views.home
    # But keeping it here for URL completeness
    from core.views import home as core_home
    return core_home(request)

def listing_list(request):
    """List all listings with filtering"""
    listings = Listing.objects.filter(status='active').select_related(
        'category', 'user', 'country', 'state_province', 'city'
    ).prefetch_related('images').order_by('-created_at')
    
    # Apply filters
    category = request.GET.get('category')
    country_code = request.GET.get('country')
    state_id = request.GET.get('state')
    city_id = request.GET.get('city')
    search_query = request.GET.get('search')
    sort_by = request.GET.get('sort', '-created_at')
    location = request.GET.get('location')
    
    if category:
        listings = listings.filter(category__category_type=category)
    
    if country_code:
        listings = listings.filter(country__code=country_code)
    
    if state_id:
        listings = listings.filter(state_province__id=state_id)
    
    if city_id:
        listings = listings.filter(city__id=city_id)
    
    if location:
        listings = listings.filter(
            Q(city__name__icontains=location) |
            Q(state_province__name__icontains=location) |
            Q(state_province__short_name__icontains=location) |
            Q(country__name__icontains=location) |
            Q(neighborhood__icontains=location)
        )
    
    if search_query:
        listings = listings.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Special filters for different listing types
    if request.GET.get('visa_sponsorship'):
        listings = listings.filter(joblisting__visa_sponsorship=True)
    
    if request.GET.get('remote_work'):
        listings = listings.filter(joblisting__remote_work=True)
    
    if request.GET.get('furnished'):
        listings = listings.filter(housinglisting__furnished=True)
    
    if request.GET.get('pets_allowed'):
        listings = listings.filter(
            Q(housinglisting__pets_allowed=True) | 
            Q(roommate_listing__pets_allowed=True)
        )
    
    if request.GET.get('featured'):
        listings = listings.filter(is_featured=True)
    
    # Sorting
    valid_sort_options = ['-created_at', 'created_at', 'title', '-title', '-views_count']
    if sort_by in valid_sort_options:
        listings = listings.order_by(sort_by)
    else:
        listings = listings.order_by('-created_at')
    
    # Pagination
    paginator = Paginator(listings, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'listings': page_obj,
        'is_paginated': paginator.num_pages > 1,
        'page_obj': page_obj,
        'categories': Category.objects.all(),
        'countries': Country.objects.filter(is_active=True),
        'current_filters': {
            'category': category,
            'location': location,
            'search': search_query,
            'sort': sort_by,
        }
    }
    return render(request, 'listings/listing_list.html', context)

def listing_detail(request, pk):
    """Display individual listing details"""
    listing = get_object_or_404(
        Listing.objects.select_related(
            'category', 'user', 'country', 'state_province', 'city'
        ).prefetch_related('images'), 
        pk=pk
    )
    
    # Only show if listing is active or user is the owner/admin
    if listing.status != 'active':
        if not request.user.is_authenticated or (
            listing.user != request.user and not request.user.is_staff
        ):
            messages.error(request, 'This listing is not available.')
            return redirect('listing_list')
    
    # Increment view count
    Listing.objects.filter(pk=pk).update(views_count=F('views_count') + 1)
    
    # Check if user has favorited this listing
    is_favorited = False
    if request.user.is_authenticated:
        is_favorited = Favorite.objects.filter(
            user=request.user, 
            listing=listing
        ).exists()
    
    # Get specific listing type data
    listing_type_data = None
    category_type = listing.category.category_type if listing.category else None
    
    try:
        if category_type == 'jobs' and hasattr(listing, 'joblisting'):
            listing_type_data = listing.joblisting
        elif category_type == 'housing' and hasattr(listing, 'housinglisting'):
            listing_type_data = listing.housinglisting
        elif category_type == 'legal' and hasattr(listing, 'lawyerlisting'):
            listing_type_data = listing.lawyerlisting
        elif category_type == 'roommates' and hasattr(listing, 'roommate_listing'):
            listing_type_data = listing.roommate_listing
        elif category_type == 'marketplace' and hasattr(listing, 'marketplace_listing'):
            listing_type_data = listing.marketplace_listing
        elif category_type == 'services' and hasattr(listing, 'service_listing'):
            listing_type_data = listing.service_listing
    except:
        pass
    
    # Get related listings (same category, different listing)
    related_listings = Listing.objects.filter(
        category=listing.category,
        status='active'
    ).exclude(pk=listing.pk).prefetch_related('images')[:4]
    
    context = {
        'listing': listing,
        'is_favorited': is_favorited,
        'listing_type_data': listing_type_data,
        'related_listings': related_listings,
        'category_type': category_type,
    }
    return render(request, 'listings/listing_detail.html', context)


def select_category_to_create_listing(request):
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
    categories = [{"slug": key, "label": label} for key, label in CATEGORY_TYPES]
    return render(request, "listings/create/select_category_to_create_listing.html", {"categories": categories})


@login_required
def create_listing(request):
    """Create a new listing"""
    if request.method == 'POST':
        try:
            # Basic listing data
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            category_id = request.POST.get('category')
            
            # Location data
            country_id = request.POST.get('country')
            state_province_name = request.POST.get('state_province', '').strip()
            city_name = request.POST.get('city', '').strip()
            neighborhood = request.POST.get('neighborhood', '').strip()
            address_line_1 = request.POST.get('address_line_1', '').strip()
            address_line_2 = request.POST.get('address_line_2', '').strip()
            zip_code = request.POST.get('zip_code', '').strip()
            
            # Contact data
            contact_email = request.POST.get('contact_email', '').strip()
            contact_phone = request.POST.get('contact_phone', '').strip()
            website_url = request.POST.get('website_url', '').strip()
            
            # Listing settings
            status = request.POST.get('status', 'draft')
            priority = request.POST.get('priority', 'normal')
            visibility = request.POST.get('visibility', 'public')  # New visibility setting
            is_featured = bool(request.POST.get('is_featured'))
            
            # Map visibility to is_public for backward compatibility
            is_public = visibility == 'public'
            
            # FORCE admin approval for ALL listings
            requires_approval = True  # Always require approval regardless of form input
            
            # Override status if user tries to set as 'active' - force to 'pending'
            if status == 'active':
                status = 'pending'
                messages.info(request, 'All listings require admin approval. Your listing has been submitted for review.')
            
            auto_renew = request.POST.get('auto_renew') == 'true'
            
            # Validation
            if not all([title, description, category_id, country_id, state_province_name, city_name, contact_email]):
                messages.error(request, 'Please fill in all required fields.')
                return render(request, 'listings/create_listing.html', get_form_context())
            
            # Get or create location objects
            try:
                category = Category.objects.get(id=category_id)
                country = Country.objects.get(id=country_id)
                
                # Get or create state/province
                state_province, created = StateProvince.objects.get_or_create(
                    name=state_province_name,
                    country=country,
                    defaults={'short_name': state_province_name[:10]}
                )
                
                # Get or create city
                city, created = City.objects.get_or_create(
                    name=city_name,
                    state_province=state_province,
                    defaults={'is_active': True}
                )
                
            except (Category.DoesNotExist, Country.DoesNotExist) as e:
                messages.error(request, f'Invalid selection: {str(e)}')
                return render(request, 'listings/create_listing.html', get_form_context())
            
            # Handle dates
            expires_at = request.POST.get('expires_at') or None
            publish_at = request.POST.get('publish_at') or None
            renewal_period_days = request.POST.get('renewal_period_days') or 30
            
            if expires_at:
                expires_at = timezone.datetime.fromisoformat(expires_at)
            if publish_at:
                publish_at = timezone.datetime.fromisoformat(publish_at)
            
            # Create the listing
            listing = Listing.objects.create(
                title=title,
                description=description,
                category=category,
                user=request.user,
                country=country,
                state_province=state_province,
                city=city,
                neighborhood=neighborhood,
                address_line_1=address_line_1,
                address_line_2=address_line_2,
                zip_code=zip_code,
                contact_email=contact_email,
                contact_phone=contact_phone,
                website_url=website_url,
                status=status,
                priority=priority,
                is_public=is_public,
                visibility=visibility,  # Store the specific visibility level
                is_featured=is_featured,
                requires_approval=requires_approval,
                expires_at=expires_at,
                publish_at=publish_at,
                auto_renew=auto_renew,
                renewal_period_days=int(renewal_period_days),
            )
            
            # Handle images
            images = request.FILES.getlist('images')
            for i, image_file in enumerate(images[:10]):  # Limit to 10 images
                ListingImage.objects.create(
                    listing=listing,
                    image=image_file,
                    is_primary=(i == 0),  # First image is primary
                    caption=f'Image {i+1}'
                )
            
            # Handle category-specific data
            category_type = category.category_type
            
            if category_type == 'jobs':
                create_job_listing(request, listing)
            elif category_type == 'housing':
                create_housing_listing(request, listing)
            elif category_type == 'roommates':
                create_roommate_listing(request, listing)
            elif category_type == 'marketplace':
                create_marketplace_listing(request, listing)
            elif category_type == 'legal':
                create_legal_listing(request, listing)
            elif category_type == 'services':
                create_service_listing(request, listing)
            
            # Set appropriate message based on status
            if status == 'active':
                messages.success(request, 'Your listing has been published successfully!')
            elif status == 'pending':
                messages.success(request, 'Your listing has been submitted for review!')
            else:
                messages.success(request, 'Your listing has been saved as a draft!')
            
            return redirect('listing_detail', pk=listing.pk)
            
        except Exception as e:
            messages.error(request, f'Error creating listing: {str(e)}')
            return render(request, 'listings/create_listing.html', get_form_context())
    
    return render(request, 'listings/create_listing.html', get_form_context())

def get_form_context():
    """Get context data for the create/edit listing forms"""
    return {
        'categories': Category.objects.all().order_by('name'),
        'countries': Country.objects.filter(is_active=True).order_by('name'),
    }

def create_job_listing(request, listing):
    """Create job-specific data"""
    try:
        salary_min = request.POST.get('salary_min')
        salary_max = request.POST.get('salary_max')
        
        # Convert salary values
        if salary_min:
            salary_min = Decimal(salary_min)
        if salary_max:
            salary_max = Decimal(salary_max)
        
        JobListing.objects.create(
            listing=listing,
            job_type=request.POST.get('job_type', 'full_time'),
            company_name=request.POST.get('company_name', ''),
            salary_min=salary_min,
            salary_max=salary_max,
            salary_period=request.POST.get('salary_period', 'yearly'),
            visa_sponsorship=bool(request.POST.get('visa_sponsorship')),
            remote_work=bool(request.POST.get('remote_work')),
            requirements=request.POST.get('requirements', ''),
            benefits=request.POST.get('benefits', ''),
        )
    except (ValueError, InvalidOperation) as e:
        # Handle invalid decimal conversion
        JobListing.objects.create(
            listing=listing,
            job_type=request.POST.get('job_type', 'full_time'),
            company_name=request.POST.get('company_name', ''),
            visa_sponsorship=bool(request.POST.get('visa_sponsorship')),
            remote_work=bool(request.POST.get('remote_work')),
            requirements=request.POST.get('requirements', ''),
            benefits=request.POST.get('benefits', ''),
        )

def create_housing_listing(request, listing):
    """Create housing-specific data"""
    try:
        rent = request.POST.get('rent')
        security_deposit = request.POST.get('security_deposit')
        bedrooms = request.POST.get('bedrooms')
        bathrooms = request.POST.get('bathrooms')
        square_footage = request.POST.get('square_footage')
        lease_duration = request.POST.get('lease_duration')
        
        HousingListing.objects.create(
            listing=listing,
            housing_type=request.POST.get('housing_type', 'apartment'),
            bedrooms=int(bedrooms) if bedrooms else 1,
            bathrooms=float(bathrooms) if bathrooms else 1.0,
            rent=Decimal(rent) if rent else None,
            security_deposit=Decimal(security_deposit) if security_deposit else None,
            square_footage=int(square_footage) if square_footage else None,
            lease_duration_months=int(lease_duration) if lease_duration else None,
            available_date=request.POST.get('available_date') or None,
            utilities_included=bool(request.POST.get('utilities_included')),
            furnished=bool(request.POST.get('furnished')),
            pets_allowed=bool(request.POST.get('pets_allowed')),
            parking_available=bool(request.POST.get('parking_available')),
            amenities=request.POST.get('amenities', ''),
        )
    except (ValueError, InvalidOperation):
        # Create with minimal data if conversion fails
        HousingListing.objects.create(
            listing=listing,
            housing_type=request.POST.get('housing_type', 'apartment'),
            utilities_included=bool(request.POST.get('utilities_included')),
            furnished=bool(request.POST.get('furnished')),
            pets_allowed=bool(request.POST.get('pets_allowed')),
            parking_available=bool(request.POST.get('parking_available')),
        )

def create_roommate_listing(request, listing):
    """Create roommate-specific data"""
    try:
        rent = request.POST.get('roommate_rent')
        
        RoommateListing.objects.create(
            listing=listing,
            room_type=request.POST.get('room_type', 'private'),
            rent=Decimal(rent) if rent else None,
            gender_preference=request.POST.get('gender_preference', 'any'),
            move_in_date=request.POST.get('move_in_date') or None,
            roommate_preferences=request.POST.get('roommate_preferences', ''),
            smoking_allowed=bool(request.POST.get('smoking_allowed')),
            pets_allowed=bool(request.POST.get('pets_allowed_roommate')),
        )
    except (ValueError, InvalidOperation):
        RoommateListing.objects.create(
            listing=listing,
            room_type=request.POST.get('room_type', 'private'),
            gender_preference=request.POST.get('gender_preference', 'any'),
            smoking_allowed=bool(request.POST.get('smoking_allowed')),
            pets_allowed=bool(request.POST.get('pets_allowed_roommate')),
        )

def create_marketplace_listing(request, listing):
    """Create marketplace-specific data"""
    try:
        price = request.POST.get('price')
        original_price = request.POST.get('original_price')
        
        MarketplaceListing.objects.create(
            listing=listing,
            item_category=request.POST.get('item_category', 'other'),
            condition=request.POST.get('condition', 'good'),
            brand=request.POST.get('brand', ''),
            model=request.POST.get('model', ''),
            price=Decimal(price) if price else None,
            original_price=Decimal(original_price) if original_price else None,
            reason_for_selling=request.POST.get('reason_for_selling', ''),
            accepting_trades=bool(request.POST.get('accepting_trades')),
            negotiable=bool(request.POST.get('negotiable_price')),
        )
    except (ValueError, InvalidOperation):
        MarketplaceListing.objects.create(
            listing=listing,
            item_category=request.POST.get('item_category', 'other'),
            condition=request.POST.get('condition', 'good'),
            brand=request.POST.get('brand', ''),
            model=request.POST.get('model', ''),
            accepting_trades=bool(request.POST.get('accepting_trades')),
            negotiable=bool(request.POST.get('negotiable_price')),
        )

def create_legal_listing(request, listing):
    """Create legal service-specific data"""
    try:
        years_experience = request.POST.get('years_experience')
        hourly_rate = request.POST.get('hourly_rate')
        consultation_fee = request.POST.get('consultation_fee')
        
        LawyerListing.objects.create(
            listing=listing,
            law_firm=request.POST.get('law_firm', ''),
            specializations=request.POST.get('specializations', ''),
            years_experience=int(years_experience) if years_experience else 0,
            bar_admissions=request.POST.get('bar_admissions', ''),
            languages=request.POST.get('languages', ''),  # FIXED: was 'languages_spoken'
            license_number=request.POST.get('license_number', ''),
            pricing_model=request.POST.get('pricing_model', 'varies'),
            hourly_rate=Decimal(hourly_rate) if hourly_rate else None,
            consultation_fee=Decimal(consultation_fee) if consultation_fee else None,
            currency=request.POST.get('currency', 'USD'),
            accepts_pro_bono=bool(request.POST.get('accepts_pro_bono')),
            free_consultation=bool(request.POST.get('free_consultation')),
            offers_payment_plans=bool(request.POST.get('offers_payment_plans')),
            virtual_consultations=bool(request.POST.get('virtual_consultations', True)),
        )
    except (ValueError, InvalidOperation):
        # Create with minimal data if conversion fails
        LawyerListing.objects.create(
            listing=listing,
            law_firm=request.POST.get('law_firm', ''),
            specializations=request.POST.get('specializations', ''),
            years_experience=0,
            bar_admissions=request.POST.get('bar_admissions', ''),
            languages=request.POST.get('languages', ''),  # FIXED: was 'languages_spoken'
            license_number=request.POST.get('license_number', ''),
            pricing_model=request.POST.get('pricing_model', 'varies'),
            accepts_pro_bono=bool(request.POST.get('accepts_pro_bono')),
            free_consultation=bool(request.POST.get('free_consultation')),
            offers_payment_plans=bool(request.POST.get('offers_payment_plans')),
            virtual_consultations=bool(request.POST.get('virtual_consultations', True)),
        )

def create_service_listing(request, listing):
    """Create service-specific data"""
    try:
        price = request.POST.get('service_price')
        experience_years = request.POST.get('experience_years')
        
        ServiceListing.objects.create(
            listing=listing,
            service_category=request.POST.get('service_category', 'other'),
            pricing_type=request.POST.get('pricing_type', 'hourly'),
            price=Decimal(price) if price else None,
            experience_years=int(experience_years) if experience_years else 0,
            qualifications=request.POST.get('qualifications', ''),
            remote_service=bool(request.POST.get('remote_service')),
            emergency_available=bool(request.POST.get('emergency_available')),
        )
    except (ValueError, InvalidOperation):
        ServiceListing.objects.create(
            listing=listing,
            service_category=request.POST.get('service_category', 'other'),
            pricing_type=request.POST.get('pricing_type', 'hourly'),
            remote_service=bool(request.POST.get('remote_service')),
            emergency_available=bool(request.POST.get('emergency_available')),
        )

@login_required
def edit_listing(request, pk):
    """Edit an existing listing"""
    listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    if request.method == 'POST':
        # Update basic listing fields
        listing.title = request.POST.get('title', listing.title)
        listing.description = request.POST.get('description', listing.description)
        listing.contact_email = request.POST.get('contact_email', listing.contact_email)
        listing.contact_phone = request.POST.get('contact_phone', listing.contact_phone)
        listing.website_url = request.POST.get('website_url', listing.website_url)
        listing.neighborhood = request.POST.get('neighborhood', listing.neighborhood)
        listing.address_line_1 = request.POST.get('address_line_1', listing.address_line_1)
        listing.address_line_2 = request.POST.get('address_line_2', listing.address_line_2)
        listing.zip_code = request.POST.get('zip_code', listing.zip_code)
        listing.save()
        
        messages.success(request, 'Your listing has been updated!')
        return redirect('listing_detail', pk=listing.pk)
    
    context = {
        'listing': listing,
        **get_form_context()
    }
    return render(request, 'listings/edit_listing.html', context)

@login_required
def delete_listing(request, pk):
    """Delete a listing"""
    listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    if request.method == 'POST':
        listing.delete()
        messages.success(request, 'Your listing has been deleted.')
        return redirect('my_listings')
    
    return render(request, 'listings/delete_listing.html', {'listing': listing})

def listings_by_category(request, category):
    """Show listings by category"""
    listings = Listing.objects.filter(
        category__category_type=category,
        status='active'
    ).select_related('category', 'user', 'country', 'state_province', 'city').prefetch_related('images').order_by('-created_at')
    
    # Apply additional filters
    location = request.GET.get('location')
    if location:
        listings = listings.filter(
            Q(city__name__icontains=location) |
            Q(state_province__name__icontains=location) |
            Q(neighborhood__icontains=location)
        )
    
    # Pagination
    paginator = Paginator(listings, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'listings': page_obj,
        'category': category,
        'category_display': category.replace('_', ' ').title(),
        'is_paginated': paginator.num_pages > 1,
        'page_obj': page_obj,
    }
    return render(request, 'listings/category_listings.html', context)

@login_required
def my_listings(request):
    """Show user's own listings"""
    listings = request.user.listing_set.all().select_related('category').prefetch_related('images').order_by('-created_at')
    
    context = {
        'listings': listings,
    }
    return render(request, 'listings/my_listings.html', context)

@login_required
def favorites(request):
    """Show user's favorite listings"""
    favorites = request.user.favorite_set.all().select_related(
        'listing', 'listing__user', 'listing__category'
    ).prefetch_related('listing__images').order_by('-created_at')
    
    context = {
        'favorites': favorites,
    }
    return render(request, 'listings/favorites.html', context)

@login_required
def toggle_favorite(request, pk):
    """Add/remove listing from favorites"""
    listing = get_object_or_404(Listing, pk=pk)
    favorite, created = Favorite.objects.get_or_create(
        user=request.user,
        listing=listing
    )
    
    if not created:
        favorite.delete()
        favorited = False
        message = 'Removed from favorites'
    else:
        favorited = True
        message = 'Added to favorites'
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'favorited': favorited, 'message': message})
    
    messages.success(request, message)
    return redirect('listing_detail', pk=pk)

@login_required
def message_list(request):
    """Show user's messages"""
    messages_received = request.user.received_messages.all().select_related('sender', 'listing').order_by('-created_at')
    messages_sent = request.user.sent_messages.all().select_related('recipient', 'listing').order_by('-created_at')
    
    context = {
        'messages_received': messages_received,
        'messages_sent': messages_sent,
    }
    return render(request, 'listings/message_list.html', context)

@login_required
def message_detail(request, pk):
    """Show individual message"""
    message = get_object_or_404(
        Message.objects.select_related('sender', 'recipient', 'listing'), 
        pk=pk
    )
    
    # Only allow sender or recipient to view the message
    if message.sender != request.user and message.recipient != request.user:
        messages.error(request, 'You do not have permission to view this message.')
        return redirect('message_list')
    
    # Mark as read if user is recipient
    if message.recipient == request.user and not message.is_read:
        message.is_read = True
        message.save()
    
    context = {
        'message': message,
    }
    return render(request, 'listings/message_detail.html', context)

@login_required
def send_message(request, listing_id):
    """Send a message about a listing"""
    listing = get_object_or_404(Listing, pk=listing_id)
    
    # Don't allow users to message themselves
    if listing.user == request.user:
        messages.error(request, 'You cannot send a message to yourself.')
        return redirect('listing_detail', pk=listing_id)
    
    if request.method == 'POST':
        subject = request.POST.get('subject')
        message_text = request.POST.get('message')
        
        if subject and message_text:
            Message.objects.create(
                sender=request.user,
                recipient=listing.user,
                listing=listing,
                subject=subject,
                message=message_text,
            )
            
            messages.success(request, 'Your message has been sent!')
            return redirect('listing_detail', pk=listing_id)
        else:
            messages.error(request, 'Please fill in all fields.')
    
    context = {
        'listing': listing,
        'default_subject': f'Regarding: {listing.title}',
    }
    return render(request, 'listings/send_message.html', context)

# AJAX views for dynamic location loading
@require_http_methods(["GET"])
def get_states_for_country(request):
    """AJAX view to get states/provinces for a country"""
    country_id = request.GET.get('country_id')
    
    if not country_id:
        return JsonResponse({'error': 'Country ID required'}, status=400)
    
    try:
        country = Country.objects.get(id=country_id)
        states = StateProvince.objects.filter(
            country=country, 
            is_active=True
        ).order_by('name').values('id', 'name', 'short_name')
        
        return JsonResponse({
            'states': list(states)
        })
    except Country.DoesNotExist:
        return JsonResponse({'error': 'Country not found'}, status=404)

@require_http_methods(["GET"])
def get_cities_for_state(request):
    """AJAX view to get cities for a state/province"""
    state_id = request.GET.get('state_id')
    
    if not state_id:
        return JsonResponse({'error': 'State ID required'}, status=400)
    
    try:
        state = StateProvince.objects.get(id=state_id)
        cities = City.objects.filter(
            state_province=state,
            is_active=True
        ).order_by('name').values('id', 'name')
        
        return JsonResponse({
            'cities': list(cities)
        })
    except StateProvince.DoesNotExist:
        return JsonResponse({'error': 'State not found'}, status=404)

@require_http_methods(["GET"])
def search_locations(request):
    """AJAX view to search locations"""
    query = request.GET.get('q', '').strip()
    country_code = request.GET.get('country')
    limit = min(int(request.GET.get('limit', 10)), 50)  # Max 50 results
    
    if not query or len(query) < 2:
        return JsonResponse({'results': []})
    
    results = []
    
    # Search cities
    city_qs = City.objects.select_related('state_province__country').filter(
        name__icontains=query,
        is_active=True
    )
    
    if country_code:
        city_qs = city_qs.filter(state_province__country__code=country_code)
    
    for city in city_qs[:limit]:
        results.append({
            'type': 'city',
            'id': city.id,
            'name': city.name,
            'display_name': str(city),
            'state_province': city.state_province.name,
            'country': city.state_province.country.name,
            'country_code': city.state_province.country.code,
        })
    
    # Search states/provinces
    state_qs = StateProvince.objects.select_related('country').filter(
        Q(name__icontains=query) | Q(short_name__icontains=query),
        is_active=True
    )
    
    if country_code:
        state_qs = state_qs.filter(country__code=country_code)
    
    for state in state_qs[:limit]:
        results.append({
            'type': 'state',
            'id': state.id,
            'name': state.name,
            'display_name': str(state),
            'short_name': state.short_name,
            'country': state.country.name,
            'country_code': state.country.code,
        })
    
    return JsonResponse({
        'results': results[:limit],
        'query': query
    })

# Additional utility views
@require_http_methods(["GET"])
def listing_stats_api(request):
    """API endpoint for listing statistics"""
    location = request.GET.get('location')
    category = request.GET.get('category')
    
    # Base query
    listings = Listing.objects.filter(status='active')
    
    # Apply filters
    if location:
        listings = listings.filter(
            Q(city__name__icontains=location) |
            Q(state_province__name__icontains=location) |
            Q(neighborhood__icontains=location)
        )
    
    if category:
        listings = listings.filter(category__category_type=category)
    
    # Calculate stats
    stats = {
        'total_listings': listings.count(),
        'categories': {},
        'locations': {},
    }
    
    # Category breakdown
    category_counts = listings.values('category__category_type').annotate(
        count=models.Count('id')
    ).order_by('-count')
    
    for item in category_counts:
        category_type = item['category__category_type']
        if category_type:
            stats['categories'][category_type] = item['count']
    
    # Location breakdown
    location_counts = listings.filter(
        city__isnull=False
    ).values('city__name', 'state_province__short_name').annotate(
        count=models.Count('id')
    ).order_by('-count')[:10]
    
    for item in location_counts:
        city_name = item['city__name']
        state_short = item['state_province__short_name']
        location_key = f"{city_name}, {state_short}" if state_short else city_name
        stats['locations'][location_key] = item['count']
    
    return JsonResponse(stats)

@login_required
def mark_listing_sold(request, pk):
    """Mark a marketplace listing as sold"""
    listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    if request.method == 'POST':
        # Update status to sold/inactive
        listing.status = 'sold' if hasattr(listing, 'marketplace_listing') else 'inactive'
        listing.save()
        
        messages.success(request, 'Listing marked as sold/closed!')
        return JsonResponse({'success': True, 'message': 'Listing updated'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

@login_required
def renew_listing(request, pk):
    """Renew an expired listing"""
    listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    if request.method == 'POST':
        # Extend expiration date
        if listing.expires_at and listing.expires_at < timezone.now():
            new_expiry = timezone.now() + timezone.timedelta(days=listing.renewal_period_days)
            listing.expires_at = new_expiry
            listing.status = 'active'
            listing.save()
            
            messages.success(request, f'Listing renewed until {new_expiry.strftime("%B %d, %Y")}!')
            return JsonResponse({'success': True, 'message': 'Listing renewed'})
        else:
            return JsonResponse({'success': False, 'message': 'Listing is not expired'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})

@login_required
def duplicate_listing(request, pk):
    """Create a duplicate of an existing listing"""
    original_listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    # Create a copy
    new_listing = Listing.objects.get(pk=original_listing.pk)
    new_listing.pk = None  # This will create a new instance
    new_listing.title = f"{original_listing.title} (Copy)"
    new_listing.status = 'draft'
    new_listing.created_at = timezone.now()
    new_listing.updated_at = timezone.now()
    new_listing.views_count = 0
    new_listing.save()
    
    # Copy category-specific data
    category_type = original_listing.category.category_type
    
    try:
        if category_type == 'jobs' and hasattr(original_listing, 'joblisting'):
            job_data = original_listing.joblisting
            job_data.pk = None
            job_data.listing = new_listing
            job_data.save()
        elif category_type == 'housing' and hasattr(original_listing, 'housinglisting'):
            housing_data = original_listing.housinglisting
            housing_data.pk = None
            housing_data.listing = new_listing
            housing_data.save()
        # Add other category types as needed
    except:
        pass
    
    messages.success(request, 'Listing duplicated successfully! You can now edit the copy.')
    return redirect('edit_listing', pk=new_listing.pk)

# Custom error handlers for listings app
def listing_not_found(request, exception=None):
    """Custom 404 handler for listings"""
    return render(request, 'listings/404.html', status=404)

def listing_access_denied(request, exception=None):
    """Custom 403 handler for listings"""
    return render(request, 'listings/403.html', status=403)