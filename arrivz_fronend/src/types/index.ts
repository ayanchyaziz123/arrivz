// types/index.ts - Updated to match your CustomUser model

export interface UserData {
    id?: string;
    isAuthenticated: boolean;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    country_of_origin?: string;
    country_of_origin_display?: string;
    current_country?: string;
    current_country_display?: string;
    immigration_status?: string;
    immigration_status_display?: string;
    languages_spoken?: string;
    profile_picture?: string;
    bio?: string;
    is_verified?: boolean;
    community?: string;
    community_display?: string;
    date_joined?: string;
    last_login?: string;
    created_at?: string;
  }
  
  // Choice options matching your Django model
  export const COUNTRY_CHOICES = [
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
  ] as const;
  
  export const IMMIGRATION_STATUS_CHOICES = [
    { value: 'citizen', label: 'Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'work_visa', label: 'Work Visa' },
    { value: 'student_visa', label: 'Student Visa' },
    { value: 'refugee', label: 'Refugee' },
    { value: 'asylum_seeker', label: 'Asylum Seeker' },
    { value: 'other', label: 'Other' },
  ] as const;
  
  export const COMMUNITY_CHOICES = [
    { value: 'latin_american', label: 'Latin American Community' },
    { value: 'east_asian', label: 'East Asian Community' },
    { value: 'south_asian', label: 'South Asian Community' },
    { value: 'middle_eastern', label: 'Middle Eastern Community' },
    { value: 'european', label: 'European Community' },
    { value: 'african', label: 'African Community' },
    { value: 'caribbean', label: 'Caribbean Community' },
    { value: 'general', label: 'General Community' },
  ] as const;
  
  // Type for choice values
  export type CountryChoice = typeof COUNTRY_CHOICES[number]['value'];
  export type ImmigrationStatusChoice = typeof IMMIGRATION_STATUS_CHOICES[number]['value'];
  export type CommunityChoice = typeof COMMUNITY_CHOICES[number]['value'];