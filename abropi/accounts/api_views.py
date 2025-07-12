# accounts/api_views.py
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import models
import logging

from .models import CustomUser
from .serializers import (
    LoginSerializer, RegisterSerializer, UserSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer,
    ChangePasswordSerializer, UserProfileUpdateSerializer,
    CustomTokenObtainPairSerializer
)

logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token obtain view"""
    serializer_class = CustomTokenObtainPairSerializer


class LoginAPIView(APIView):
    """Login API view"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            remember_me = serializer.validated_data.get('remember_me', False)
            
            # Create JWT tokens
            tokens = serializer.create_tokens(user)
            
            # Update last login
            user.save(update_fields=['last_login'])
            
            # Serialize user data
            user_serializer = UserSerializer(user)
            user_data = user_serializer.data
            user_data['isAuthenticated'] = True
            
            # Set token expiration based on remember_me
            expires_in = 60 * 60 * 24 * 7 if remember_me else 60 * 60 * 24  # 7 days or 1 day
            
            response_data = {
                'user': user_data,
                'token': tokens['access'],
                'refreshToken': tokens['refresh'],
                'expiresIn': expires_in,
                'message': 'Login successful'
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        # Handle validation errors
        errors = serializer.errors
        
        # Format error response for frontend
        if 'non_field_errors' in errors:
            error_detail = errors['non_field_errors'][0]
            if isinstance(error_detail, dict):
                message = error_detail.get('message', 'Login failed')
                code = error_detail.get('code', 'INVALID_CREDENTIALS')
            else:
                message = str(error_detail)
                code = 'INVALID_CREDENTIALS'
        else:
            message = 'Invalid input data'
            code = 'VALIDATION_ERROR'
        
        return Response({
            'message': message,
            'code': code,
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)


class RegisterAPIView(APIView):
    """Registration API view with enhanced error reporting"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Log the incoming request data for debugging
        print("🔍 Registration request received:")
        print("Request data:", request.data)
        print("Request headers:", dict(request.headers))
        
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            print("✅ Serializer validation passed")
            try:
                user = serializer.save()
                print(f"✅ User created successfully: {user.username} ({user.email})")
                
                # Create JWT tokens
                refresh = RefreshToken.for_user(user)
                
                # Serialize user data
                user_serializer = UserSerializer(user)
                user_data = user_serializer.data
                user_data['isAuthenticated'] = True
                
                response_data = {
                    'user': user_data,
                    'token': str(refresh.access_token),
                    'refreshToken': str(refresh),
                    'expiresIn': 60 * 60 * 24,  # 1 day
                    'message': 'Registration successful'
                }
                
                # Send welcome email (optional)
                try:
                    send_mail(
                        'Welcome to Arrivz!',
                        f'Welcome {user.first_name or user.username}! Your account has been created successfully.',
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                        fail_silently=True,
                    )
                    print(f"📧 Welcome email sent to {user.email}")
                except Exception as e:
                    print(f"📧 Failed to send welcome email: {e}")
                    logger.error(f"Failed to send welcome email: {e}")
                
                print("✅ Registration response data:", {**response_data, 'token': '[REDACTED]', 'refreshToken': '[REDACTED]'})
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(f"💥 Error during user creation: {str(e)}")
                print(f"💥 Error type: {type(e).__name__}")
                import traceback
                print(f"💥 Full traceback: {traceback.format_exc()}")
                
                return Response({
                    'message': f'User creation failed: {str(e)}',
                    'code': 'USER_CREATION_ERROR',
                    'error_type': type(e).__name__
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Enhanced error handling for validation failures
        print("❌ Serializer validation failed")
        print("❌ Serializer errors:", serializer.errors)
        
        # Parse and format errors for better frontend handling
        formatted_errors = {}
        error_messages = []
        
        for field, field_errors in serializer.errors.items():
            print(f"❌ Field '{field}' errors: {field_errors}")
            
            formatted_errors[field] = []
            
            if isinstance(field_errors, list):
                for error in field_errors:
                    if isinstance(error, dict):
                        error_msg = error.get('message', str(error))
                        error_code = error.get('code', 'VALIDATION_ERROR')
                    else:
                        error_msg = str(error)
                        error_code = 'VALIDATION_ERROR'
                    
                    formatted_errors[field].append({
                        'message': error_msg,
                        'code': error_code
                    })
                    error_messages.append(f"{field}: {error_msg}")
            else:
                error_msg = str(field_errors)
                formatted_errors[field].append({
                    'message': error_msg,
                    'code': 'VALIDATION_ERROR'
                })
                error_messages.append(f"{field}: {error_msg}")
        
        # Create a user-friendly error message
        if 'email' in serializer.errors:
            main_message = "Email validation failed"
        elif 'username' in serializer.errors:
            main_message = "Username validation failed"
        elif 'password' in serializer.errors:
            main_message = "Password validation failed"
        elif 'confirm_password' in serializer.errors:
            main_message = "Password confirmation failed"
        elif 'non_field_errors' in serializer.errors:
            main_message = str(serializer.errors['non_field_errors'][0])
        else:
            main_message = "Registration validation failed"
        
        # Log the final error response
        error_response = {
            'message': main_message,
            'code': 'VALIDATION_ERROR',
            'errors': serializer.errors,
            'formatted_errors': formatted_errors,
            'error_summary': error_messages,
            'detail': '; '.join(error_messages) if error_messages else main_message
        }
        
        print("❌ Final error response:", error_response)
        
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    """Logout API view"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'message': 'Logout failed',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    """User profile API view"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileUpdateSerializer
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserProfileUpdateSerializer
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            response.data['message'] = 'Profile updated successfully'
        return response


class ChangePasswordAPIView(APIView):
    """Change password API view"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            
            user.set_password(new_password)
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Password change failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordAPIView(APIView):
    """Forgot password API view"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = CustomUser.objects.get(email__iexact=email)
                
                # Generate reset token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Create reset URL
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
                
                # Send reset email
                send_mail(
                    'Reset Your Arrivz Password',
                    f'''
                    Hi {user.first_name or user.username},
                    
                    You requested a password reset for your Arrivz account.
                    Click the link below to reset your password:
                    
                    {reset_url}
                    
                    If you didn't request this, please ignore this email.
                    
                    Best regards,
                    The Arrivz Team
                    ''',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                
            except CustomUser.DoesNotExist:
                # Don't reveal if email exists for security
                pass
            except Exception as e:
                logger.error(f"Failed to send password reset email: {e}")
                return Response({
                    'message': 'Failed to send reset email',
                    'code': 'EMAIL_ERROR'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'message': 'If an account with that email exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Invalid email address',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordAPIView(APIView):
    """Reset password API view"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            # Extract UID and token from the token parameter
            try:
                # Assuming token format is "uid-token"
                uid, token_part = token.split('-', 1)
                user_id = force_str(urlsafe_base64_decode(uid))
                user = CustomUser.objects.get(pk=user_id)
                
                if default_token_generator.check_token(user, token_part):
                    user.set_password(password)
                    user.save()
                    
                    return Response({
                        'message': 'Password reset successful'
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'message': 'Invalid or expired reset token',
                        'code': 'INVALID_TOKEN'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except (ValueError, CustomUser.DoesNotExist):
                return Response({
                    'message': 'Invalid reset token',
                    'code': 'INVALID_TOKEN'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Invalid input data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenAPIView(TokenRefreshView):
    """Custom refresh token view"""
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == status.HTTP_200_OK:
                # Get user from refresh token
                refresh_token = request.data.get('refresh')
                if refresh_token:
                    try:
                        refresh = RefreshToken(refresh_token)
                        user = CustomUser.objects.get(pk=refresh['user_id'])
                        user_serializer = UserSerializer(user)
                        user_data = user_serializer.data
                        user_data['isAuthenticated'] = True
                        
                        response.data['user'] = user_data
                        response.data['expiresIn'] = 60 * 60 * 24  # 1 day
                        
                    except (TokenError, InvalidToken, CustomUser.DoesNotExist):
                        pass
            
            return response
            
        except Exception as e:
            return Response({
                'message': 'Token refresh failed',
                'code': 'TOKEN_ERROR'
            }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_detail(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    user_data = serializer.data
    user_data['isAuthenticated'] = True
    
    return Response({
        'user': user_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_token(request):
    """Verify if token is valid"""
    return Response({
        'valid': True,
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)