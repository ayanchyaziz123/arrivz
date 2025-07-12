"""
URL configuration for abropi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# abropi/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('accounts/', include('allauth.urls')),  # Replace custom accounts
    path('user/', include('accounts.urls')),     # Custom user views
    path('listings/', include('listings.urls')),
    
    # API endpoints
    path('api/auth/', include('accounts.api_urls')),    # Auth API endpoints
    path('api/listings/', include('listings.api_urls')), # Listings API endpoints
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Optional: Add API documentation if you want to use DRF browsable API
# You can also add swagger/openapi documentation here if needed

# Example of how to add API versioning (optional):
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('core.urls')),
#     path('accounts/', include('allauth.urls')),
#     path('user/', include('accounts.urls')),
#     path('listings/', include('listings.urls')),
#     
#     # API v1 endpoints
#     path('api/v1/auth/', include('accounts.api_urls')),
#     path('api/v1/listings/', include('listings.api_urls')),
# ]

# If you want to add API root view for better API discoverability:
# from rest_framework.routers import DefaultRouter
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# 
# @api_view(['GET'])
# def api_root(request, format=None):
#     return Response({
#         'auth': request.build_absolute_uri('/api/auth/'),
#         'listings': request.build_absolute_uri('/api/listings/'),
#     })
# 
# Then add to urlpatterns:
# path('api/', api_root, name='api-root'