// app/register/page.tsx - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Users,
  AlertCircle, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/authHook';
import { registerUser } from '@/store/slices/authSlice'; // Import the action creator
import ClientOnly from '@/components/ClientOnly';
import type { RegisterData } from '@/types/authType';

// Choice options matching your Django model
const COUNTRY_CHOICES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'au', label: 'Australia' },
  { value: 'mx', label: 'Mexico' },
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India' },
  { value: 'cn', label: 'China' },
  { value: 'jp', label: 'Japan' },
  { value: 'other', label: 'Other' },
];

const COMMUNITY_CHOICES = [
  { value: 'latin_american', label: 'Latin American' },
  { value: 'east_asian', label: 'East Asian' },
  { value: 'south_asian', label: 'South Asian' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'european', label: 'European' },
  { value: 'african', label: 'African' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'general', label: 'General' },
];

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    register, // This is the wrapped dispatch function
    isLoading, 
    error, 
    isAuthenticated, 
    isHydrated, 
    clearError 
  } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryOfOrigin: '',
    currentCountry: '',
    community: '',
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get redirect URL from search params
  const redirectTo = searchParams.get('redirect') || '/dashboard';

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

  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'firstName':
        if (!value || typeof value !== 'string') return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value || typeof value !== 'string') return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value || typeof value !== 'string') return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value || typeof value !== 'string') return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value || typeof value !== 'string') return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'countryOfOrigin':
        if (!value || typeof value !== 'string') return 'Please select where you\'re from';
        return '';
      case 'currentCountry':
        if (!value || typeof value !== 'string') return 'Please select your current country';
        return '';
      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
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
    
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      const error = validateField(key, value);
      if (error) errors[key] = error;
    });

    setFormErrors(errors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(errors).length === 0;
  };

  // FIXED: Updated handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const registerData: RegisterData = {
        username: formData.email,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        countryOfOrigin: formData.countryOfOrigin,
        currentCountry: formData.currentCountry,
        community: formData.community,
        agreeToTerms: formData.agreeToTerms,
      };

      console.log('📝 Submitting registration data:', {
        ...registerData,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      });

      // Call the register function from useAuth hook
      const result = await register(registerData);
      
      // FIXED: Use the imported action creator for the match check
      if (registerUser.fulfilled.match(result)) {
        console.log('✅ Registration successful, redirecting...');
        router.replace(redirectTo);
      } else if (registerUser.rejected.match(result)) {
        console.error('❌ Registration failed:', result.payload);
        // Error is already handled by Redux state, but we can add additional handling here if needed
      }
    } catch (err) {
      console.error('💥 Registration error:', err);
    }
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Left Side - Info */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-12">
            <div className="max-w-md text-white">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">Az</span>
                </div>
                <span className="text-2xl font-semibold">Arrivz</span>
              </div>
              <h1 className="text-4xl font-bold mb-6">Join the immigrant community</h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with opportunities, find housing, get legal help, and build your network in your new home.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-blue-100">Find jobs and housing opportunities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-blue-100">Connect with your community</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-blue-100">Get legal and professional help</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up for Arrivz</h2>
                <p className="text-gray-600">Create your account to get started</p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                          formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.firstName && touched.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                    {formErrors.lastName && touched.lastName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
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

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                          formErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="8+ characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                          formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && touched.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-2">
                      Where are you from?
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="countryOfOrigin"
                        name="countryOfOrigin"
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                          formErrors.countryOfOrigin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        value={formData.countryOfOrigin}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      >
                        <option value="">Select country</option>
                        {COUNTRY_CHOICES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.countryOfOrigin && touched.countryOfOrigin && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.countryOfOrigin}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="currentCountry" className="block text-sm font-medium text-gray-700 mb-2">
                      Current country
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="currentCountry"
                        name="currentCountry"
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                          formErrors.currentCountry ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        value={formData.currentCountry}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      >
                        <option value="">Select country</option>
                        {COUNTRY_CHOICES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.currentCountry && touched.currentCountry && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.currentCountry}</p>
                    )}
                  </div>
                </div>

                {/* Community */}
                <div>
                  <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-2">
                    Community (optional)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="community"
                      name="community"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                      value={formData.community}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="">Select community</option>
                      {COMMUNITY_CHOICES.map(community => (
                        <option key={community.value} value={community.value}>
                          {community.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start">
                    <input
                      name="agreeToTerms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Yes, I understand and agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline" target="_blank">
                        Arrivz Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline" target="_blank">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {formErrors.agreeToTerms && touched.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create my account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}