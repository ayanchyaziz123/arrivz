
# accounts/admin.py (SIMPLIFIED - WORKING VERSION)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserRating

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'country_of_origin', 'immigration_status', 'is_verified', 'date_joined']
    list_filter = ['country_of_origin', 'current_country', 'immigration_status', 'is_verified', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Immigration Info', {
            'fields': ('phone', 'country_of_origin', 'current_country', 'immigration_status', 'languages_spoken')
        }),
        ('Profile', {
            'fields': ('profile_picture', 'bio', 'is_verified')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Immigration Info', {
            'fields': ('email', 'phone', 'country_of_origin', 'current_country', 'immigration_status')
        }),
    )

@admin.register(UserRating)
class UserRatingAdmin(admin.ModelAdmin):
    list_display = ['rated_user', 'rating_user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['rated_user__username', 'rating_user__username']