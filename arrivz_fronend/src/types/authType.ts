// store/types/authType.ts - Updated with missing fields

import { UserData } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  agreeToTerms: boolean;
  // Add these missing fields that your form collects:
  countryOfOrigin: string;
  currentCountry: string;
  community?: string; // Optional field
}

export interface AuthResponse {
  user: UserData;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  loginAttempts: number;
  lockoutUntil: number | null;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthApiError {
  message: string;
  code: string;
  field?: string;
}