# accounts/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Avg
from .models import CustomUser, UserRating
from .forms import CustomUserCreationForm, UserProfileForm

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You can now log in.')
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

@login_required
def profile(request):
    user = request.user
    user_listings = user.listing_set.all()[:6]
    user_favorites = user.favorite_set.all()[:6]
    total_views = sum(listing.views_count for listing in user.listing_set.all())
    
    context = {
        'user': user,
        'user_listings': user_listings,
        'user_favorites': user_favorites,
        'total_views': total_views,
    }
    return render(request, 'accounts/profile.html', context)

@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated!')
            return redirect('profile')
    else:
        form = UserProfileForm(instance=request.user)
    return render(request, 'accounts/edit_profile.html', {'form': form})

def user_detail(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    user_listings = user.listing_set.filter(status='active')[:6]
    ratings = user.ratings_received.all()
    avg_rating = ratings.aggregate(Avg('rating'))['rating__avg']
    
    context = {
        'profile_user': user,
        'user_listings': user_listings,
        'ratings': ratings,
        'avg_rating': avg_rating,
    }
    return render(request, 'accounts/user_detail.html', context)