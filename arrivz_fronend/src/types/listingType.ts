// store/types/listingType.ts - Type definitions for listings
export interface CategoryData {
  id: string;
  name: string;
  category_type: string;
  description: string;
  icon: string;
  priority_score: number;
}

export interface LocationData {
  id: string;
  name: string;
  code?: string;
  short_name?: string;
  country?: string;
  state_province?: string;
}

export interface FieldConfig {
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'email' | 'tel';
  label: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
  help_text?: string;
}

export interface CategoryFieldsConfig {
  required: string[];
  optional: string[];
  fields: Record<string, FieldConfig>;
}

export interface ListingData {
  // Basic listing fields
  title: string;
  description: string;
  category: string;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  
  // Location fields
  country: string;
  state_province: string;
  city?: string;
  neighborhood?: string;
  address_line_1?: string;
  address_line_2?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  
  // Visibility and settings
  visibility: 'public' | 'community' | 'same_origin' | 'verified_only';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status?: string;
  expires_at?: string;
  
  // Category-specific fields (will be flattened)
  [key: string]: any;
}

export interface ListingResponse {
  id: string;
  title: string;
  description: string;
  category: CategoryData;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    is_verified: boolean;
  };
  
  // Location
  country: LocationData;
  state_province: LocationData;
  city?: LocationData;
  neighborhood?: string;
  
  // Status and metadata
  status: string;
  status_display: string;
  is_public: boolean;
  visibility: string;
  priority: string;
  is_featured: boolean;
  views_count: number;
  helpful_count: number;
  
  // Contact info
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  expires_at?: string;
  
  // User interactions
  is_helpful_by_user?: boolean;
  is_favorited_by_user?: boolean;
  can_edit?: boolean;
  
  // Images
  images: ListingImage[];
  
  // Category-specific data
  job_data?: JobListingData;
  housing_data?: HousingListingData;
  roommate_data?: RoommateListingData;
  lawyer_data?: LawyerListingData;
  marketplace_data?: MarketplaceListingData;
  service_data?: ServiceListingData;
}

export interface ListingImage {
  id: string;
  image: string;
  caption: string;
  is_primary: boolean;
}

// Category-specific data interfaces
export interface JobListingData {
  job_type: string;
  company_name: string;
  salary_min?: number;
  salary_max?: number;
  salary_period: string;
  salary_currency: string;
  salary_negotiable: boolean;
  requirements: string;
  benefits?: string;
  visa_sponsorship: boolean;
  remote_work: boolean;
  salary_display: string;
}

export interface HousingListingData {
  housing_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  rent_amount: number;
  rent_period: string;
  rent_currency: string;
  rent_negotiable: boolean;
  deposit_required?: number;
  utilities_included: boolean;
  furnished: boolean;
  pets_allowed: boolean;
  parking_available: boolean;
  available_date?: string;
  price_display: string;
}

export interface RoommateListingData {
  room_type: string;
  monthly_rent: number;
  rent_currency: string;
  deposit_required?: number;
  utilities_included: boolean;
  private_bathroom: boolean;
  furnished: boolean;
  gender_preference: string;
  age_min?: number;
  age_max?: number;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  total_bedrooms: number;
  total_bathrooms: number;
  move_in_date?: string;
  price_display: string;
}

export interface LawyerListingData {
  law_firm?: string;
  specializations: string;
  years_experience: number;
  bar_admissions: string;
  languages?: string;
  pricing_model: string;
  hourly_rate?: number;
  consultation_fee?: number;
  currency: string;
  free_consultation: boolean;
  virtual_consultations: boolean;
  accepts_pro_bono: boolean;
  pricing_display: string;
}

export interface MarketplaceListingData {
  item_category: string;
  brand?: string;
  model?: string;
  condition: string;
  price: number;
  currency: string;
  price_negotiable: boolean;
  accepting_trades: boolean;
  year_purchased?: number;
  pickup_available: boolean;
  delivery_available: boolean;
  price_display: string;
}

export interface ServiceListingData {
  service_category: string;
  pricing_type: string;
  price?: number;
  currency: string;
  price_negotiable: boolean;
  experience_years?: number;
  languages_offered?: string;
  remote_service: boolean;
  available_weekdays: boolean;
  available_weekends: boolean;
  available_evenings: boolean;
  price_display: string;
}

// API Error interface
export interface ListingApiError {
  message: string;
  code: string;
  field?: string;
  errors?: Record<string, string[]>;
}

// Search and filter interfaces
export interface ListingSearchParams {
  search?: string;
  category?: string;
  country?: string;
  state_province?: string;
  city?: string;
  price_min?: number;
  price_max?: number;
  listing_type?: string;
  visibility?: string;
  status?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

// Form interfaces for creating/editing listings
export interface CreateListingFormData extends ListingData {
  images?: File[];
  categoryData: Record<string, any>;
}

export interface UpdateListingFormData extends Partial<ListingData> {
  images?: File[];
  categoryData?: Record<string, any>;
}