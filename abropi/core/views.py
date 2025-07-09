# core/views.py - Complete version with Helpful System

from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.utils import timezone
from datetime import timedelta
from listings.models import Listing, Category, ListingHelpful

def home(request):
    # Handle location clearing FIRST - before any other location logic
    if request.GET.get('clear_location'):
        # Clear location from session completely
        if 'user_location' in request.session:
            del request.session['user_location']
        request.session.modified = True
        # Redirect to home without any location parameters
        return redirect('home')
    
    # Get location from URL parameter ONLY (don't use session yet)
    url_location = request.GET.get('location')
    
    # Determine current location priority:
    # 1. URL parameter (highest priority)
    # 2. Session stored location (only if no URL parameter)
    if url_location:
        current_location = url_location
        # Store in session for persistence
        request.session['user_location'] = current_location
        request.session.modified = True
    else:
        # Only use session location if no URL location provided
        current_location = request.session.get('user_location')
    
    # Base query for featured listings
    featured_query = Listing.objects.filter(is_featured=True, status='active')
    
    # Apply location filter if specified
    if current_location:
        featured_query = featured_query.filter(
            Q(city__name__icontains=current_location) |
            Q(state_province__name__icontains=current_location) |
            Q(state_province__short_name__icontains=current_location) |
            Q(country__name__icontains=current_location) |
            Q(neighborhood__icontains=current_location) |
            Q(address_line_1__icontains=current_location)
        )
    
    # Enhanced featured listings query with helpful votes
    featured_listings = featured_query.select_related(
        'category', 'user'
    ).prefetch_related(
        'images', 'helpful_votes'
    )[:6]
    
    # UPDATED: Get all active categories ordered by priority_score (highest first)
    active_categories = Category.objects.filter(
        listing__status='active'
    ).distinct().order_by('-priority_score', 'name')  # Use priority_score for ordering
    
    # Group listings by category
    listings_by_category = []
    
    for category in active_categories:
        # Base query for this category
        category_query = Listing.objects.filter(
            category=category,
            status='active'
        )
        
        # Apply location filter if specified
        if current_location:
            category_query = category_query.filter(
                Q(city__name__icontains=current_location) |
                Q(state_province__name__icontains=current_location) |
                Q(state_province__short_name__icontains=current_location) |
                Q(country__name__icontains=current_location) |
                Q(neighborhood__icontains=current_location) |
                Q(address_line_1__icontains=current_location)
            )
        
        # Enhanced category listings query with helpful votes
        category_listings = category_query.select_related(
            'category', 'user', 'city', 'state_province', 'country'
        ).prefetch_related(
            'images', 'helpful_votes'
        ).order_by('-created_at')[:6]
        
        # Only include categories that have listings
        if category_listings.exists():
            listings_by_category.append({
                'category': category,
                'listings': category_listings,
                'count': category_query.count(),
                'priority_score': category.priority_score,  # Include priority for debugging
            })
    
    # Stats with location awareness
    stats_query = Listing.objects.filter(status='active')
    if current_location:
        stats_query = stats_query.filter(
            Q(city__name__icontains=current_location) |
            Q(state_province__name__icontains=current_location) |
            Q(state_province__short_name__icontains=current_location) |
            Q(country__name__icontains=current_location) |
            Q(neighborhood__icontains=current_location) |
            Q(address_line_1__icontains=current_location)
        )
    
    # Enhanced stats with helpful votes
    stats = {
        'users': stats_query.values('user').distinct().count(),
        'jobs': stats_query.filter(category__category_type='jobs').count(),
        'housing': stats_query.filter(category__category_type='housing').count(),
        'lawyers': stats_query.filter(category__category_type='legal').count(),
        'total_helpful_votes': ListingHelpful.objects.filter(listing__in=stats_query).count(),
    }
    
    # Get popular locations (top cities by listing count)
    try:
        popular_locations = (
            Listing.objects.filter(status='active')
            .exclude(city__name='')
            .exclude(city__name__isnull=True)
            .values('city__name')
            .annotate(count=Count('id'))
            .order_by('-count')[:8]
        )
    except:
        popular_locations = []
    
    # Major cities with listing counts
    major_cities_data = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 
        'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
        'Dallas', 'San Jose', 'Austin', 'Jacksonville',
        'Miami', 'Seattle', 'Boston', 'Denver'
    ]
    
    major_cities = []
    for city_name in major_cities_data[:8]:
        try:
            count = Listing.objects.filter(
                status='active'
            ).filter(
                Q(city__name__icontains=city_name) | 
                Q(neighborhood__icontains=city_name) |
                Q(address_line_1__icontains=city_name)
            ).count()
            
            state_map = {
                'New York': 'NY', 'Los Angeles': 'CA', 'Chicago': 'IL', 'Houston': 'TX',
                'Phoenix': 'AZ', 'Philadelphia': 'PA', 'San Antonio': 'TX', 'San Diego': 'CA',
                'Dallas': 'TX', 'San Jose': 'CA', 'Austin': 'TX', 'Jacksonville': 'FL',
                'Miami': 'FL', 'Seattle': 'WA', 'Boston': 'MA', 'Denver': 'CO'
            }
            
            major_cities.append({
                'name': city_name,
                'state': state_map.get(city_name, ''),
                'listing_count': count
            })
        except:
            continue
    
    # Calculate category-specific counts
    job_count = stats['jobs']
    housing_count = stats['housing']
    lawyer_count = stats['lawyers']
    
    try:
        roommate_count = stats_query.filter(category__category_type='roommates').count()
        marketplace_count = stats_query.filter(category__category_type='marketplace').count()
        business_count = stats_query.filter(category__category_type='business').count()
        education_count = stats_query.filter(category__category_type='education').count()
        services_count = stats_query.filter(category__category_type='services').count()
    except:
        roommate_count = 0
        marketplace_count = 0
        business_count = 0
        education_count = 0
        services_count = 0
    
    context = {
        'featured_listings': featured_listings,
        'listings_by_category': listings_by_category,
        'stats': stats,
        'current_location': current_location,
        'user_location': current_location,
        'popular_locations': popular_locations,
        'major_cities': major_cities,
        'job_count': job_count,
        'housing_count': housing_count,
        'lawyer_count': lawyer_count,
        'roommate_count': roommate_count,
        'marketplace_count': marketplace_count,
        'business_count': business_count,
        'education_count': education_count,
        'services_count': services_count,
    }
    
    return render(request, 'core/home.html', context)

def clear_location(request):
    """Clear location from session and redirect to home WITHOUT location"""
    # Remove location from session completely
    if 'user_location' in request.session:
        del request.session['user_location']
    
    # Force session to save immediately
    request.session.modified = True
    request.session.save()
    
    # Redirect to home page WITHOUT any location parameters
    return redirect('home')

def about(request):
    return render(request, 'core/about.html')

def contact(request):
    if request.method == 'POST':
        # Handle contact form submission
        # You can add email sending logic here
        messages.success(request, 'Thank you for your message! We\'ll get back to you soon.')
        return redirect('contact')
    return render(request, 'core/contact.html')

def search(request):
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    location = request.GET.get('location', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    
    # Store location in session if provided
    if location:
        request.session['user_location'] = location
    
    # Enhanced listings query with helpful votes
    listings = Listing.objects.filter(status='active').select_related(
        'category', 'user'
    ).prefetch_related(
        'images', 'helpful_votes'
    )
    
    if query:
        listings = listings.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query)
        )
    
    if category:
        listings = listings.filter(category__category_type=category)
    
    # Location filtering for search
    if location:
        listings = listings.filter(
            Q(city__name__icontains=location) |
            Q(state_province__name__icontains=location) |
            Q(state_province__short_name__icontains=location) |
            Q(country__name__icontains=location) |
            Q(neighborhood__icontains=location) |
            Q(address_line_1__icontains=location)
        )
    
    # Price filtering - handle different listing types
    if min_price:
        try:
            min_price_val = float(min_price)
            price_filters = Q()
            
            # Add price filters for different listing types
            try:
                from listings.models import JobListing, HousingListing, MarketplaceListing
                price_filters |= Q(joblisting__salary_min__gte=min_price_val)
                price_filters |= Q(housinglisting__rent_amount__gte=min_price_val)
                price_filters |= Q(marketplacelisting__price__gte=min_price_val)
            except:
                pass
            
            if price_filters:
                listings = listings.filter(price_filters)
        except (ValueError, TypeError):
            pass
    
    if max_price:
        try:
            max_price_val = float(max_price)
            price_filters = Q()
            
            # Add price filters for different listing types
            try:
                from listings.models import JobListing, HousingListing, MarketplaceListing
                price_filters |= Q(joblisting__salary_max__lte=max_price_val)
                price_filters |= Q(housinglisting__rent_amount__lte=max_price_val)
                price_filters |= Q(marketplacelisting__price__lte=max_price_val)
            except:
                pass
            
            if price_filters:
                listings = listings.filter(price_filters)
        except (ValueError, TypeError):
            pass
    
    # Add pagination
    paginator = Paginator(listings, 20)  # Show 20 listings per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get search suggestions if no results
    suggestions = []
    if not listings.exists() and (query or location):
        # Suggest similar locations
        if location:
            try:
                similar_locations = (
                    Listing.objects.filter(status='active')
                    .exclude(city__name='')
                    .exclude(city__name__isnull=True)
                    .filter(city__name__icontains=location[:3])  # Partial match
                    .values('city__name')
                    .annotate(count=Count('id'))
                    .order_by('-count')[:5]
                )
                suggestions.extend([loc['city__name'] for loc in similar_locations])
            except:
                pass
        
        # Suggest similar categories
        if query:
            try:
                similar_categories = (
                    Category.objects.filter(name__icontains=query)
                    .values('name', 'category_type')[:3]
                )
                suggestions.extend([cat['name'] for cat in similar_categories])
            except:
                pass
    
    context = {
        'listings': page_obj,
        'query': query,
        'category': category,
        'location': location,
        'min_price': min_price,
        'max_price': max_price,
        'total_results': paginator.count,
        'suggestions': suggestions,
        'is_paginated': paginator.num_pages > 1,
        'page_obj': page_obj,
    }
    return render(request, 'core/search.html', context)

# ============================================
# HELPFUL SYSTEM VIEWS
# ============================================

@login_required
@require_POST
def toggle_helpful(request, pk):
    """Toggle helpful status for a listing"""
    listing = get_object_or_404(Listing, pk=pk)
    
    # Check if listing is active and visible
    if listing.status != 'active':
        return JsonResponse({'error': 'Listing not available'}, status=404)
    
    # Check if user can view this listing (using your existing visibility system)
    if hasattr(listing, 'can_user_view'):
        if not listing.can_user_view(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    # Prevent users from marking their own listings as helpful
    if listing.user == request.user:
        return JsonResponse({'error': 'Cannot mark your own listing as helpful'}, status=400)
    
    try:
        is_helpful = listing.toggle_helpful(request.user)
        helpful_count = listing.helpful_count
        
        return JsonResponse({
            'success': True,
            'is_helpful': is_helpful,
            'helpful_count': helpful_count,
            'message': 'Marked as helpful!' if is_helpful else 'Removed from helpful'
        })
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong'}, status=500)

def get_helpful_count(request, pk):
    """Get current helpful count for a listing (public endpoint)"""
    listing = get_object_or_404(Listing, pk=pk)
    
    # Check if listing is active
    if listing.status != 'active':
        return JsonResponse({'error': 'Listing not available'}, status=404)
    
    # Check visibility if user is authenticated
    if hasattr(listing, 'can_user_view') and request.user.is_authenticated:
        if not listing.can_user_view(request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    try:
        return JsonResponse({
            'helpful_count': listing.helpful_count,
            'is_helpful': listing.is_helpful_by_user(request.user) if request.user.is_authenticated else False,
            'can_vote': request.user.is_authenticated and request.user != listing.user
        })
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong'}, status=500)

@login_required
def my_helpful_listings(request):
    """Show listings the user marked as helpful"""
    helpful_listings = Listing.objects.filter(
        helpful_votes__user=request.user,
        status='active'
    ).select_related(
        'category', 'user'
    ).prefetch_related(
        'images', 'helpful_votes'
    ).order_by('-helpful_votes__created_at')
    
    paginator = Paginator(helpful_listings, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'listings': page_obj,
        'page_title': 'Listings I Found Helpful',
        'total_count': paginator.count,
    }
    return render(request, 'listings/my_helpful_listings.html', context)

@login_required
def listing_analytics(request, pk):
    """Show analytics for a listing (only for listing owner)"""
    listing = get_object_or_404(Listing, pk=pk, user=request.user)
    
    # Get helpful votes with user info (last 10)
    recent_helpful_votes = listing.helpful_votes.select_related('user').order_by('-created_at')[:10]
    
    # Get daily helpful count for last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    daily_helpful = {}
    
    helpful_votes_30d = listing.helpful_votes.filter(created_at__gte=thirty_days_ago)
    for vote in helpful_votes_30d:
        date_key = vote.created_at.date().strftime('%Y-%m-%d')
        daily_helpful[date_key] = daily_helpful.get(date_key, 0) + 1
    
    context = {
        'listing': listing,
        'total_helpful': listing.helpful_count,
        'recent_helpful_votes': recent_helpful_votes,
        'daily_helpful': daily_helpful,
        'helpful_votes_30d': helpful_votes_30d.count(),
    }
    return render(request, 'listings/listing_analytics.html', context)

# ============================================
# HELPFUL SYSTEM ANALYTICS & STATS
# ============================================

def helpful_stats_api(request):
    """API endpoint for helpful statistics"""
    try:
        # Overall helpful stats
        total_helpful_votes = ListingHelpful.objects.count()
        
        # Most helpful listings this month
        thirty_days_ago = timezone.now() - timedelta(days=30)
        most_helpful_this_month = (
            Listing.objects.filter(status='active')
            .annotate(helpful_count_month=Count('helpful_votes', filter=Q(helpful_votes__created_at__gte=thirty_days_ago)))
            .filter(helpful_count_month__gt=0)
            .order_by('-helpful_count_month')[:10]
            .values('id', 'title', 'helpful_count_month')
        )
        
        # Helpful activity by day (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        daily_activity = {}
        
        recent_votes = ListingHelpful.objects.filter(created_at__gte=seven_days_ago)
        for vote in recent_votes:
            date_key = vote.created_at.date().strftime('%Y-%m-%d')
            daily_activity[date_key] = daily_activity.get(date_key, 0) + 1
        
        # Categories with most helpful listings
        helpful_by_category = (
            Category.objects.annotate(
                helpful_listings_count=Count('listing__helpful_votes')
            )
            .filter(helpful_listings_count__gt=0)
            .order_by('-helpful_listings_count')[:5]
            .values('name', 'category_type', 'helpful_listings_count')
        )
        
        return JsonResponse({
            'total_helpful_votes': total_helpful_votes,
            'most_helpful_this_month': list(most_helpful_this_month),
            'daily_activity': daily_activity,
            'helpful_by_category': list(helpful_by_category),
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def trending_helpful(request):
    """Show trending helpful listings"""
    # Get listings with most helpful votes in last 7 days
    seven_days_ago = timezone.now() - timedelta(days=7)
    
    trending_listings = (
        Listing.objects.filter(status='active')
        .annotate(
            recent_helpful_count=Count(
                'helpful_votes', 
                filter=Q(helpful_votes__created_at__gte=seven_days_ago)
            )
        )
        .filter(recent_helpful_count__gt=0)
        .order_by('-recent_helpful_count', '-created_at')
        .select_related('category', 'user')
        .prefetch_related('images', 'helpful_votes')[:20]
    )
    
    context = {
        'listings': trending_listings,
        'page_title': 'Trending Helpful Listings',
        'subtitle': 'Most helpful listings from the past week',
    }
    return render(request, 'listings/trending_helpful.html', context)

def most_helpful(request):
    """Show most helpful listings of all time"""
    most_helpful_listings = (
        Listing.objects.filter(status='active')
        .annotate(total_helpful_count=Count('helpful_votes'))
        .filter(total_helpful_count__gt=0)
        .order_by('-total_helpful_count', '-created_at')
        .select_related('category', 'user')
        .prefetch_related('images', 'helpful_votes')
    )
    
    paginator = Paginator(most_helpful_listings, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'listings': page_obj,
        'page_title': 'Most Helpful Listings',
        'subtitle': 'Listings that the community finds most valuable',
    }
    return render(request, 'listings/most_helpful.html', context)

# ============================================
# LOCATION UTILITIES
# ============================================

def location_suggestions(request):
    """
    AJAX endpoint for location autocomplete suggestions
    Usage: /location-suggestions/?q=new
    """
    query = request.GET.get('q', '').strip()
    if len(query) < 2:
        return JsonResponse({'suggestions': []})
    
    try:
        # Get unique cities that match the query
        cities = (
            Listing.objects.filter(status='active')
            .exclude(city__name='')
            .exclude(city__name__isnull=True)
            .filter(city__name__icontains=query)
            .values('city__name', 'state_province__name', 'state_province__short_name')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )
        
        suggestions = []
        for city in cities:
            city_name = city['city__name']
            state_name = city['state_province__name'] or ''
            state_short = city['state_province__short_name'] or ''
            count = city['count']
            
            # Format: "City, ST (count)"
            display_name = f"{city_name}"
            if state_short:
                display_name += f", {state_short}"
            elif state_name:
                display_name += f", {state_name}"
            display_name += f" ({count})"
            
            suggestions.append({
                'value': city_name,
                'display': display_name,
                'count': count
            })
        
        return JsonResponse({'suggestions': suggestions})
    
    except Exception as e:
        return JsonResponse({'suggestions': [], 'error': str(e)})

# ============================================
# HELPFUL SYSTEM BULK OPERATIONS (ADMIN)
# ============================================

@login_required
def bulk_helpful_operations(request):
    """Admin view for bulk helpful operations"""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    if request.method == 'POST':
        operation = request.POST.get('operation')
        
        if operation == 'cleanup_old_votes':
            # Remove helpful votes older than 1 year
            one_year_ago = timezone.now() - timedelta(days=365)
            deleted_count = ListingHelpful.objects.filter(created_at__lt=one_year_ago).count()
            ListingHelpful.objects.filter(created_at__lt=one_year_ago).delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Removed {deleted_count} old helpful votes'
            })
        
        elif operation == 'remove_spam_votes':
            # Remove votes from users who voted on too many listings in a short time
            # (potential spam/bot behavior)
            spam_threshold = 50  # More than 50 votes in a day
            one_day_ago = timezone.now() - timedelta(days=1)
            
            spam_users = (
                ListingHelpful.objects.filter(created_at__gte=one_day_ago)
                .values('user')
                .annotate(vote_count=Count('id'))
                .filter(vote_count__gt=spam_threshold)
                .values_list('user', flat=True)
            )
            
            deleted_count = ListingHelpful.objects.filter(
                user__in=spam_users,
                created_at__gte=one_day_ago
            ).count()
            
            ListingHelpful.objects.filter(
                user__in=spam_users,
                created_at__gte=one_day_ago
            ).delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Removed {deleted_count} potential spam votes'
            })
    
    # GET request - show admin dashboard
    context = {
        'total_votes': ListingHelpful.objects.count(),
        'votes_today': ListingHelpful.objects.filter(
            created_at__gte=timezone.now().replace(hour=0, minute=0, second=0)
        ).count(),
        'votes_this_week': ListingHelpful.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count(),
    }
    return render(request, 'admin/helpful_operations.html', context)