// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Settings,
  Shield,
  Plus,
  List,
  Heart,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/authHook';
import { authService } from '@/services/authService';
import ClientOnly from '@/components/ClientOnly';

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

const IMMIGRATION_STATUS_CHOICES = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'permanent_resident', label: 'Permanent Resident' },
  { value: 'work_visa', label: 'Work Visa' },
  { value: 'student_visa', label: 'Student Visa' },
  { value: 'refugee', label: 'Refugee' },
  { value: 'asylum_seeker', label: 'Asylum Seeker' },
  { value: 'other', label: 'Other' },
];

const COMMUNITY_CHOICES = [
  { value: 'latin_american', label: 'Latin American Community' },
  { value: 'east_asian', label: 'East Asian Community' },
  { value: 'south_asian', label: 'South Asian Community' },
  { value: 'middle_eastern', label: 'Middle Eastern Community' },
  { value: 'european', label: 'European Community' },
  { value: 'african', label: 'African Community' },
  { value: 'caribbean', label: 'Caribbean Community' },
  { value: 'general', label: 'General Community' },
];

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  country_of_origin: string;
  current_country: string;
  immigration_status: string;
  languages_spoken: string;
  bio: string;
  community: string;
  profile_picture?: File | null;
}

interface FormErrors {
  [key: string]: string;
}

// Mock data for listings and stats (replace with actual API calls)
const mockListings = [
  {
    id: 1,
    title: "Software Engineer Position",
    description: "Looking for experienced software engineers to join our growing team",
    category: "Jobs",
    price: 75000,
    currency: "USD",
    created_at: "2025-01-08T10:00:00Z",
    views_count: 245,
    image: null
  },
  {
    id: 2,
    title: "Room for Rent in Downtown",
    description: "Cozy room available in shared apartment, great location near transit",
    category: "Housing",
    price: 800,
    currency: "USD",
    created_at: "2025-01-07T15:30:00Z",
    views_count: 156,
    image: null
  }
];

const mockStats = {
  activeListings: 5,
  totalViews: 1250,
  favorites: 8
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated, isHydrated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle authentication guard
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isAuthenticated, isHydrated, router]);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    country_of_origin: '',
    current_country: '',
    immigration_status: '',
    languages_spoken: '',
    bio: '',
    community: '',
    profile_picture: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        country_of_origin: user.country_of_origin || '',
        current_country: user.current_country || '',
        immigration_status: user.immigration_status || '',
        languages_spoken: user.languages_spoken || '',
        bio: user.bio || '',
        community: user.community || '',
        profile_picture: null,
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'first_name':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'last_name':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'phone':
        if (value && value.length < 10) return 'Phone number must be at least 10 digits';
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'bio':
        if (value && value.length > 500) return 'Bio cannot exceed 500 characters';
        return '';
      case 'languages_spoken':
        if (value && value.length > 200) return 'Languages cannot exceed 200 characters';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    if (fieldError) {
      setFormErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, profile_picture: 'Profile picture must be less than 5MB' }));
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFormErrors(prev => ({ ...prev, profile_picture: 'Only JPEG, PNG, GIF, and WebP images are allowed' }));
      return;
    }

    setProfileData(prev => ({ ...prev, profile_picture: file }));
    setFormErrors(prev => ({ ...prev, profile_picture: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    Object.keys(profileData).forEach(key => {
      if (key !== 'profile_picture') {
        const error = validateField(key, profileData[key as keyof ProfileData] as string);
        if (error) errors[key] = error;
      }
    });

    setFormErrors(errors);
    setTouched(Object.keys(profileData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add all profile data to FormData
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof ProfileData];
        if (key === 'profile_picture') {
          if (value instanceof File) {
            formData.append('profile_picture', value);
          }
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      const response = await authService.updateUserProfile(formData);
      
      // Update user in store
      updateUser(response.user);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setProfileImagePreview(null);
      
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        country_of_origin: user.country_of_origin || '',
        current_country: user.current_country || '',
        immigration_status: user.immigration_status || '',
        languages_spoken: user.languages_spoken || '',
        bio: user.bio || '',
        community: user.community || '',
        profile_picture: null,
      });
    }
    setFormErrors({});
    setTouched({});
    setError(null);
    setIsEditing(false);
    setProfileImagePreview(null);
  };

  const getChoiceLabel = (choices: readonly any[], value: string): string => {
    const choice = choices.find(c => c.value === value);
    return choice ? choice.label : value;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-gray-50" />}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">{success}</div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {profileImagePreview || user.profile_picture ? (
                      <img
                        src={profileImagePreview || user.profile_picture}
                        alt={user.username}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100">
                        <span className="text-white font-bold text-4xl">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {isEditing && (
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-4 right-1/2 transform translate-x-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user.username
                    }
                  </h1>
                  
                  {user.is_verified && (
                    <span className="inline-flex items-center text-blue-600 mt-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified Member
                    </span>
                  )}
                </div>

                {formErrors.profile_picture && (
                  <div className="mb-4">
                    <p className="text-sm text-red-600">{formErrors.profile_picture}</p>
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  {(user.bio || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">About</h3>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          rows={3}
                          value={profileData.bio}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="Tell us about yourself..."
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            formErrors.bio ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                      ) : (
                        <p className="text-gray-600">{user.bio || 'No bio provided'}</p>
                      )}
                      {formErrors.bio && touched.bio && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                      )}
                    </div>
                  )}
                  
                  {(user.country_of_origin || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Background</h3>
                      {isEditing ? (
                        <select
                          name="country_of_origin"
                          value={profileData.country_of_origin}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          disabled={isLoading}
                        >
                          <option value="">Select country</option>
                          {COUNTRY_CHOICES.map(country => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-600">
                          <Globe className="inline h-4 w-4 mr-2 text-blue-500" />
                          From {user.country_of_origin_display || 'Not specified'}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(user.current_country || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Current Location</h3>
                      {isEditing ? (
                        <select
                          name="current_country"
                          value={profileData.current_country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          disabled={isLoading}
                        >
                          <option value="">Select country</option>
                          {COUNTRY_CHOICES.map(country => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-600">
                          <MapPin className="inline h-4 w-4 mr-2 text-blue-500" />
                          {user.current_country_display || 'Not specified'}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(user.immigration_status || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Immigration Status</h3>
                      {isEditing ? (
                        <select
                          name="immigration_status"
                          value={profileData.immigration_status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          disabled={isLoading}
                        >
                          <option value="">Select status</option>
                          {IMMIGRATION_STATUS_CHOICES.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-600">
                          <Shield className="inline h-4 w-4 mr-2 text-blue-500" />
                          {user.immigration_status_display || 'Not specified'}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(user.languages_spoken || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Languages Spoken</h3>
                      {isEditing ? (
                        <input
                          type="text"
                          name="languages_spoken"
                          value={profileData.languages_spoken}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="e.g., English, Spanish, French"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            formErrors.languages_spoken ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                      ) : (
                        <p className="text-gray-600">
                          <Globe className="inline h-4 w-4 mr-2 text-blue-500" />
                          {user.languages_spoken || 'Not specified'}
                        </p>
                      )}
                      {formErrors.languages_spoken && touched.languages_spoken && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.languages_spoken}</p>
                      )}
                    </div>
                  )}
                  
                  {(user.phone || isEditing) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="+1 (555) 123-4567"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            formErrors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                      ) : (
                        <p className="text-gray-600">
                          <Phone className="inline h-4 w-4 mr-2 text-blue-500" />
                          {user.phone || 'Not provided'}
                        </p>
                      )}
                      {formErrors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Member Since</h3>
                    <p className="text-gray-600">
                      <Calendar className="inline h-4 w-4 mr-2 text-blue-500" />
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-center font-medium flex items-center justify-center"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-center font-medium flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-200 text-center font-medium flex items-center justify-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Community Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Listings</span>
                    <span className="font-medium">{mockStats.activeListings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-medium">{mockStats.totalViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorites</span>
                    <span className="font-medium">{mockStats.favorites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Join Date</span>
                    <span className="font-medium">
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user.first_name || user.username}!
                </h2>
                <p className="text-blue-100">
                  Manage your listings and connect with the immigrant community
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link href="/create-listing" className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="text-green-600 text-xl h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Create Listing</h3>
                  <p className="text-sm text-gray-600">Share opportunities</p>
                </Link>
                
                <Link href="/my-listings" className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <List className="text-blue-600 text-xl h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">My Listings</h3>
                  <p className="text-sm text-gray-600">{mockStats.activeListings} active</p>
                </Link>
                
                <Link href="/favorites" className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300 text-center">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="text-red-600 text-xl h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Favorites</h3>
                  <p className="text-sm text-gray-600">{mockStats.favorites} saved</p>
                </Link>
              </div>

              {/* Recent Listings */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Recent Listings</h3>
                  {mockListings.length > 3 && (
                    <Link href="/my-listings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All ({mockStats.activeListings})
                    </Link>
                  )}
                </div>
                
                {mockListings.length > 0 ? (
                  <div className="space-y-4">
                    {mockListings.slice(0, 3).map((listing) => (
                      <div key={listing.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                        {listing.image ? (
                          <img src={listing.image} alt={listing.title} className="w-16 h-16 object-cover rounded-lg mr-4" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            <Link href={`/listing/${listing.id}`} className="hover:text-blue-600">
                              {listing.title}
                            </Link>
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">{listing.description.length > 60 ? listing.description.substring(0, 60) + '...' : listing.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{listing.category}</span>
                            <span>{formatTimeAgo(listing.created_at)}</span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {listing.views_count}
                            </span>
                          </div>
                        </div>
                        
                        {listing.price && (
                          <div className="text-right">
                            <div className="font-bold text-green-600">${listing.price.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{listing.currency}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <List className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="mb-4">You haven't posted any listings yet</p>
                    <Link
                      href="/create-listing"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Link>
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Joined Arrivz</p>
                      <p className="text-sm text-gray-600">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  
                  {mockListings.length > 0 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Plus className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Posted first listing</p>
                        <p className="text-sm text-gray-600">
                          {new Date(mockListings[0].created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {user.is_verified && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Account verified</p>
                        <p className="text-sm text-gray-600">Trusted community member</p>
                      </div>
                    </div>
                  )}

                  {!user.is_verified && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Complete verification</p>
                        <p className="text-sm text-gray-600">Verify your account to access all features</p>
                      </div>
                    </div>
                  )}

                  {user.community && (
                    <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Joined community</p>
                        <p className="text-sm text-gray-600">{user.community_display}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}