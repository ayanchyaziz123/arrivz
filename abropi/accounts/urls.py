# accounts/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views



urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),
]