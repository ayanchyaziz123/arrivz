# accounts/serializers.py - Updated to match your CustomUser model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import models
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data without sensitive information"""
    
    # Add display fields for choice fields
    country_of_origin_display = serializers.CharField(source='get_country_of_origin_display', read_only=True)
    current_country_display = serializers.CharField(source='get_current_country_display', read_only=True)
    immigration_status_display = serializers.CharField(source='get_immigration_status_display', read_only=True)
    community_display = serializers.CharField(source='get_community_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [  
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'country_of_origin', 'country_of_origin_display',
            'current_country', 'current_country_display',
            'immigration_status', 'immigration_status_display',
            'languages_spoken', 'profile_picture', 'bio', 
            'is_verified', 'community', 'community_display',
            'date_joined', 'last_login', 'created_at'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'created_at', 'is_verified']
    
    def to_representation(self, instance):
        """Add isAuthenticated field to response"""
        data = super().to_representation(instance)
        data['isAuthenticated'] = True
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to response
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        data['expiresIn'] = 60 * 60 * 24  # 24 hours in seconds
        
        return data


class LoginSerializer(serializers.Serializer):
    """Login serializer for email/username and password authentication"""
    
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    remember_me = serializers.BooleanField(default=False)
    
    def validate(self, attrs):
        email_or_username = attrs.get('email')
        password = attrs.get('password')
        
        if not email_or_username or not password:
            raise serializers.ValidationError({
                'non_field_errors': ['Email/username and password are required.'],
                'code': 'MISSING_CREDENTIALS'
            })
        
        # Try to authenticate with email first, then username
        user = None
        if '@' in email_or_username:
            # It's an email
            try:
                user_obj = CustomUser.objects.get(email=email_or_username)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                pass
        else:
            # It's a username
            user = authenticate(username=email_or_username, password=password)
        
        if not user:
            raise serializers.ValidationError({
                'non_field_errors': ['Invalid email/username or password.'],
                'code': 'INVALID_CREDENTIALS'
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                'non_field_errors': ['Account is disabled.'],
                'code': 'ACCOUNT_DISABLED'
            })
        
        attrs['user'] = user
        return attrs
    
    def create_tokens(self, user):
        """Create JWT tokens for the user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class RegisterSerializer(serializers.ModelSerializer):
    """Registration serializer"""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    agree_to_terms = serializers.BooleanField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'phone', 'country_of_origin', 'current_country',
            'immigration_status', 'languages_spoken', 'bio',
            'community', 'password', 'confirm_password', 'agree_to_terms'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()
    
    def validate_username(self, value):
        """Validate username uniqueness and format"""
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        
        return value.lower()
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if value and len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value
    
    def validate(self, attrs):
        """Validate password confirmation and terms agreement"""
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        agree_to_terms = attrs.get('agree_to_terms')
        
        if password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': ['Passwords do not match.']
            })
        
        if not agree_to_terms:
            raise serializers.ValidationError({
                'agree_to_terms': ['You must agree to the terms and conditions.']
            })
        
        return attrs
    
    def create(self, validated_data):
        """Create new user"""
        # Remove fields that aren't part of the user model
        validated_data.pop('confirm_password', None)
        validated_data.pop('agree_to_terms', None)
        
        # Create user
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    """Forgot password serializer"""
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Check if email exists"""
        try:
            user = CustomUser.objects.get(email__iexact=value)
            self.user = user
        except CustomUser.DoesNotExist:
            # Don't reveal if email exists for security
            pass
        return value.lower()


class ResetPasswordSerializer(serializers.Serializer):
    """Reset password serializer"""
    
    token = serializers.CharField()
    password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()
    
    def validate(self, attrs):
        """Validate passwords match"""
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        
        if password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': ['Passwords do not match.']
            })
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer for authenticated users"""
    
    current_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()
    
    def validate_current_password(self, value):
        """Validate current password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
    
    def validate(self, attrs):
        """Validate new passwords match"""
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': ['Passwords do not match.']
            })
        
        return attrs


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'phone', 'country_of_origin', 
            'current_country', 'immigration_status', 'languages_spoken', 
            'profile_picture', 'bio', 'community'
        ]
    
    def validate_profile_picture(self, value):
        """Validate profile picture file"""
        if value:
            # Check file size (5MB limit)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Profile picture file size cannot exceed 5MB.")
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, PNG, GIF, and WebP images are allowed.")
        
        return value
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if value and len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value