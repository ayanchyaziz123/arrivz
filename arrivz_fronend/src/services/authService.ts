// services/auth.service.ts - Updated for Django backend
import {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    ForgotPasswordData,
    ResetPasswordData,
    AuthApiError
} from '../types/authType';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class AuthService {
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        // Get token from localStorage for authenticated requests
        const token = typeof window !== 'undefined' ? localStorage.getItem('arrivz_token') : null;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            credentials: 'include', // Include cookies for CSRF
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle different content types
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // Handle Django REST framework error format
                const error: AuthApiError = {
                    message: data.message || data.detail || `HTTP ${response.status}`,
                    code: data.code || 'UNKNOWN_ERROR',
                    field: data.field,
                };

                // Handle specific error codes
                if (response.status === 401) {
                    error.code = 'UNAUTHORIZED';
                    // Clear invalid token
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('arrivz_token');
                        localStorage.removeItem('arrivz_refresh_token');
                    }
                } else if (response.status === 403) {
                    error.code = 'FORBIDDEN';
                } else if (response.status === 429) {
                    error.code = 'RATE_LIMITED';
                }

                throw error;
            }

            return data;
        } catch (error) {
            if (error instanceof TypeError) {
                throw {
                    message: 'Network error - please check your connection',
                    code: 'NETWORK_ERROR',
                } as AuthApiError;
            }
            throw error;
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.makeRequest<AuthResponse>('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({
                email: credentials.email, // Django backend expects 'email' field for email/username
                password: credentials.password,
                remember_me: credentials.rememberMe,
            }),
        });

        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('arrivz_token', response.token);
            localStorage.setItem('arrivz_refresh_token', response.refreshToken);
        }

        return response;
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        console.log('🚀 Registration attempt with data:', {
            ...userData,
            password: '[REDACTED]',
            confirmPassword: '[REDACTED]'
        });
    
        const response = await this.makeRequest<AuthResponse>('/auth/register/', {
            method: 'POST',
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                first_name: userData.firstName,     
                last_name: userData.lastName,
                password: userData.password,
                confirm_password: userData.confirmPassword,
                agree_to_terms: userData.agreeToTerms,
                // ADD THESE MISSING FIELDS:
                country_of_origin: userData.countryOfOrigin,
                current_country: userData.currentCountry,
                community: userData.community || '', // Handle optional field
            }),
        });

        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('arrivz_token', response.token);
            localStorage.setItem('arrivz_refresh_token', response.refreshToken);
        }

        return response;
    }

    async logout(): Promise<void> {
        const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('arrivz_refresh_token')
            : null;

        try {
            await this.makeRequest<void>('/auth/logout/', {
                method: 'POST',
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
            });
        } finally {
            // Clear tokens regardless of API response
            if (typeof window !== 'undefined') {
                localStorage.removeItem('arrivz_token');
                localStorage.removeItem('arrivz_refresh_token');
            }
        }
    }

    async refreshToken(token: string): Promise<AuthResponse> {
        const response = await this.makeRequest<AuthResponse>('/auth/refresh/', {
            method: 'POST',
            body: JSON.stringify({
                refresh: token
            }),
        });

        // Update stored tokens
        if (typeof window !== 'undefined') {
            localStorage.setItem('arrivz_token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('arrivz_refresh_token', response.refreshToken);
            }
        }

        return response;
    }

    async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>('/auth/forgot-password/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>('/auth/reset-password/', {
            method: 'POST',
            body: JSON.stringify({
                token: data.token,
                password: data.password,
                confirm_password: data.confirmPassword,
            }),
        });
    }

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>('/auth/change-password/', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }),
        });
    }

    async getUserProfile(): Promise<{ user: any }> {
        return this.makeRequest<{ user: any }>('/auth/profile/detail/', {
            method: 'GET',
        });
    }

    async updateUserProfile(profileData: any): Promise<{ message: string; user: any }> {
        const formData = new FormData();

        // Handle file uploads (avatar)
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== null && profileData[key] !== undefined) {
                if (key === 'avatar' && profileData[key] instanceof File) {
                    formData.append(key, profileData[key]);
                } else {
                    formData.append(key, profileData[key]);
                }
            }
        });

        return this.makeRequest<{ message: string; user: any }>('/auth/profile/', {
            method: 'PATCH',
            headers: {}, // Don't set Content-Type for FormData
            body: formData,
        });
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>(`/auth/verify-email/${token}/`, {
            method: 'GET',
        });
    }

    async resendVerificationEmail(email: string): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>('/auth/resend-verification/', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyToken(): Promise<{ valid: boolean; user: any }> {
        return this.makeRequest<{ valid: boolean; user: any }>('/auth/token/verify/', {
            method: 'POST',
        });
    }

    // Helper method to check if user is authenticated
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;

        const token = localStorage.getItem('arrivz_token');
        return !!token;
    }

    // Helper method to get stored token
    getToken(): string | null {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem('arrivz_token');
    }

    // Helper method to get stored refresh token
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem('arrivz_refresh_token');
    }
}

export const authService = new AuthService();