# accounts/api_urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from . import api_views

app_name = 'accounts_api'

urlpatterns = [
    # Authentication endpoints
    path('login/', api_views.LoginAPIView.as_view(), name='login'),
    path('register/', api_views.RegisterAPIView.as_view(), name='register'),
    path('logout/', api_views.LogoutAPIView.as_view(), name='logout'),
    path('refresh/', api_views.RefreshTokenAPIView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Password management
    path('forgot-password/', api_views.ForgotPasswordAPIView.as_view(), name='forgot_password'),
    path('reset-password/', api_views.ResetPasswordAPIView.as_view(), name='reset_password'),
    path('change-password/', api_views.ChangePasswordAPIView.as_view(), name='change_password'),
    
    # User profile
    path('profile/', api_views.UserProfileAPIView.as_view(), name='user_profile'),
    path('profile/detail/', api_views.user_profile_detail, name='user_profile_detail'),
    
    # JWT Token endpoints (alternative)
    path('token/', api_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', api_views.RefreshTokenAPIView.as_view(), name='token_refresh_alt'),
    path('token/verify/', api_views.verify_token, name='verify_token'),
]
