// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/authHook';
import ClientOnly from '@/components/ClientOnly';
import type { LoginCredentials } from '@/types/authType';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    login, 
    isLoading, 
    error, 
    isAuthenticated, 
    isHydrated, 
    clearError,
    loginAttempts,
    lockoutUntil 
  } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get redirect URL from search params
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isHydrated, router, redirectTo]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutUntil && lockoutUntil > Date.now()) {
      const timer = setTimeout(() => {
        window.location.reload(); // Refresh to clear lockout
      }, lockoutUntil - Date.now());

      return () => clearTimeout(timer);
    }
  }, [lockoutUntil]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    if (fieldError) {
      setFormErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setFormErrors(errors);
    setTouched({ email: true, password: true });
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if account is locked
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setFormErrors({
        general: `Account temporarily locked. Please try again in ${remainingTime} minute(s).`
      });
      return;
    }

    try {
      const result = await login(formData);

    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const getRemainingLockoutTime = (): string => {
    if (!lockoutUntil || Date.now() >= lockoutUntil) return '';
    
    const remainingMs = lockoutUntil - Date.now();
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return `${remainingMinutes} minute(s)`;
  };

  // Show loading during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-gray-50" />}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-2xl" />
                <span className="text-white font-black text-2xl relative z-10 tracking-tight">Az</span>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your Arrivz account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* General Error */}
              {(error || formErrors.general) && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">
                      {formErrors.general || error}
                      {lockoutUntil && Date.now() < lockoutUntil && (
                        <div className="mt-1 text-xs">
                          Time remaining: {getRemainingLockoutTime()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Login Attempts Warning */}
              {loginAttempts > 0 && loginAttempts < 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      {5 - loginAttempts} attempt(s) remaining before account lockout.
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-10 pr-10 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Arrivz?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Create your account
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <div className="text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}