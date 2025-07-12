// types/listing-components.ts - Add this file for the component types
export interface BaseListingData {
    title: string;
    description: string;
    category: string;
    contactEmail: string;
    contactPhone?: string;
    websiteUrl?: string;
  }
  
  export interface JobData {
    jobType: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship' | 'freelance';
    companyName: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryPeriod: 'hourly' | 'monthly' | 'yearly';
    salaryCurrency: string;
    salaryNegotiable: boolean;
    bonusInfo?: string;
    benefits?: string;
    requirements: string;
    visaSponsorship: boolean;
    remoteWork: boolean;
  }
  
  export interface HousingData {
    housingType: 'apartment' | 'house' | 'room' | 'studio' | 'condo' | 'shared';
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    rentAmount: number;
    rentPeriod: 'monthly' | 'weekly' | 'daily';
    rentCurrency: string;
    rentNegotiable: boolean;
    depositRequired?: number;
    utilitiesCost?: number;
    utilitiesIncluded: boolean;
    furnished: boolean;
    petsAllowed: boolean;
    parkingAvailable: boolean;
    laundryAvailable: boolean;
    leaseTermMin: number;
    availableDate?: string;
  }
  
  export interface RoommateData {
    roomType: 'private_room' | 'shared_room' | 'master_bedroom' | 'studio_share';
    monthlyRent: number;
    rentCurrency: string;
    depositRequired?: number;
    utilitiesCost?: number;
    utilitiesIncluded: boolean;
    privateBathroom: boolean;
    furnished: boolean;
    genderPreference: 'any' | 'male' | 'female' | 'non_binary';
    ageMin?: number;
    ageMax?: number;
    studentsWelcome: boolean;
    workingProfessionals: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    leaseTermMonths: number;
    moveInDate?: string;
    currentRoommatesCount: number;
    totalBedrooms: number;
    totalBathrooms: number;
  }
  
  export interface LawyerData {
    lawFirm?: string;
    specializations: string;
    yearsExperience: number;
    barAdmissions: string;
    languages?: string;
    licenseNumber?: string;
    pricingModel: 'hourly' | 'flat_fee' | 'contingency' | 'retainer' | 'consultation_only' | 'pro_bono' | 'varies';
    hourlyRate?: number;
    consultationFee?: number;
    currency: string;
    acceptsProBono: boolean;
    freeConsultation: boolean;
    offersPaymentPlans: boolean;
    virtualConsultations: boolean;
  }
  
  export interface MarketplaceData {
    itemCategory: string;
    brand?: string;
    model?: string;
    condition: 'new' | 'like_new' | 'excellent' | 'good' | 'fair' | 'poor' | 'for_parts';
    yearPurchased?: number;
    price: number;
    currency: string;
    priceNegotiable: boolean;
    acceptingTrades: boolean;
    tradePreferences?: string;
    quantityAvailable: number;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
    deliveryFee?: number;
    shippingAvailable: boolean;
    originalPrice?: number;
    purchaseReceipt: boolean;
    warrantyRemaining: boolean;
    warrantyDetails?: string;
  }
  
  export interface ServiceData {
    serviceCategory: string;
    pricingType: 'hourly' | 'fixed' | 'per_session' | 'per_project' | 'consultation' | 'free' | 'varies';
    price?: number;
    currency: string;
    priceNegotiable: boolean;
    experienceYears?: number;
    languagesOffered?: string;
    certifications?: string;
    availableWeekdays: boolean;
    availableWeekends: boolean;
    availableEvenings: boolean;
    remoteService: boolean;
    travelRadiusMiles?: number;
  }
  
  export interface LocationData {
    country: string;
    stateProvince: string;
    city?: string;
    neighborhood?: string;
    addressLine1?: string;
    addressLine2?: string;
    zipCode?: string;
  }