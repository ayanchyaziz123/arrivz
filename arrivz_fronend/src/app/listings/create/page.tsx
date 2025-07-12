'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X,
  Globe,
  Users,
  Flag,
  UserCheck,
  AlertCircle,
  Loader2,
  Camera,
  ArrowRight,
  CheckCircle2,
  Upload,
  FileText,
  MapPin,
  Briefcase,
  Home,
  Users2,
  Scale,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { useCreateListing } from '../../../hooks/listingHook';
import { CategoryData, CreateListingFormData } from '../../../types/listingType';

// Import our reusable components
import { 
  JobSection, 
  HousingSection, 
  RoommateSection, 
  LawyerSection, 
  MarketplaceSection, 
  ServiceSection, 
  LocationSection 
} from '../../../components/forms';

// Import types for our components
import {
  JobData,
  HousingData,
  RoommateData,
  LawyerData,
  MarketplaceData,
  ServiceData,
  LocationData
} from '../../../types/listing-components';

const CreateListingPage = () => {
  const router = useRouter();
  const {
    isCreating,
    createError,
    categories = [],
    countries = [],
    states = [],
    cities = [],
    createListing,
    clearError,
    loadCategories,
    loadCountries,
    loadStates,
    loadCities,
  } = useCreateListing();

  if(categories){
    console.log("Create page category : ", categories)
  }

  // Component state
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<CreateListingFormData>({
    title: '',
    description: '',
    category: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    country: '',
    state_province: '',
    city: '',
    neighborhood: '',
    address_line_1: '',
    zip_code: '',
    visibility: 'public',
    priority: 'normal',
    categoryData: {},
    images: []
  });

  // Separate state for each listing type
  const [jobData, setJobData] = useState<JobData>({
    jobType: 'full_time',
    companyName: '',
    salaryPeriod: 'yearly',
    salaryCurrency: 'USD',
    salaryNegotiable: false,
    requirements: '',
    visaSponsorship: false,
    remoteWork: false,
  });

  const [housingData, setHousingData] = useState<HousingData>({
    housingType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    rentAmount: 0,
    rentPeriod: 'monthly',
    rentCurrency: 'USD',
    rentNegotiable: false,
    utilitiesIncluded: false,
    furnished: false,
    petsAllowed: false,
    parkingAvailable: false,
    laundryAvailable: false,
    leaseTermMin: 12,
  });

  const [roommateData, setRoommateData] = useState<RoommateData>({
    roomType: 'private_room',
    monthlyRent: 0,
    rentCurrency: 'USD',
    utilitiesIncluded: false,
    privateBathroom: false,
    furnished: false,
    genderPreference: 'any',
    studentsWelcome: true,
    workingProfessionals: true,
    petsAllowed: false,
    smokingAllowed: false,
    leaseTermMonths: 12,
    currentRoommatesCount: 0,
    totalBedrooms: 1,
    totalBathrooms: 1,
  });

  const [lawyerData, setLawyerData] = useState<LawyerData>({
    specializations: '',
    yearsExperience: 0,
    barAdmissions: '',
    pricingModel: 'hourly',
    currency: 'USD',
    acceptsProBono: false,
    freeConsultation: false,
    offersPaymentPlans: false,
    virtualConsultations: true,
  });

  const [marketplaceData, setMarketplaceData] = useState<MarketplaceData>({
    itemCategory: 'electronics',
    condition: 'new',
    price: 0,
    currency: 'USD',
    priceNegotiable: false,
    acceptingTrades: false,
    quantityAvailable: 1,
    pickupAvailable: true,
    deliveryAvailable: false,
    shippingAvailable: false,
    purchaseReceipt: false,
    warrantyRemaining: false,
  });

  const [serviceData, setServiceData] = useState<ServiceData>({
    serviceCategory: 'tutoring',
    pricingType: 'hourly',
    currency: 'USD',
    priceNegotiable: false,
    availableWeekdays: true,
    availableWeekends: false,
    availableEvenings: false,
    remoteService: false,
  });

  const [locationData, setLocationData] = useState<LocationData>({
    country: '',
    stateProvince: '',
  });

  // Category icon mapping
  const getCategoryIcon = (categoryType: string) => {
    const iconMap = {
      jobs: Briefcase,
      housing: Home,
      roommates: Users2,
      legal: Scale,
      marketplace: ShoppingBag,
      services: Settings,
    };
    return iconMap[categoryType as keyof typeof iconMap] || FileText;
  };

  // Load initial data

  useEffect(() => {
    loadCategories();
    loadCountries();
  }, [loadCategories, loadCountries]);

  // Load states when country changes
  useEffect(() => {
    if (locationData.country) {
      loadStates(locationData.country);
      setLocationData(prev => ({ ...prev, stateProvince: '', city: '' }));
    }
  }, [locationData.country, loadStates]);

  // Load cities when state changes
  useEffect(() => {
    if (locationData.stateProvince) {
      loadCities(locationData.stateProvince);
      setLocationData(prev => ({ ...prev, city: '' }));
    }
  }, [locationData.stateProvince, loadCities]);

  // Sync location data with form data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      country: locationData.country,
      state_province: locationData.stateProvince,
      city: locationData.city || '',
      neighborhood: locationData.neighborhood || '',
      address_line_1: locationData.addressLine1 || '',
      zip_code: locationData.zipCode || '',
    }));
  }, [locationData]);

  const handleCategorySelect = (category: CategoryData) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      category: category.id,
      categoryData: {}
    }));
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (createError) {
      clearError();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    const totalImages = selectedImages.length + validFiles.length;
    const filesToAdd = totalImages > 10 ? validFiles.slice(0, 10 - selectedImages.length) : validFiles;
    
    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
    }
    
    const newPreviews: string[] = [];
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        if (newPreviews.length === filesToAdd.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    setSelectedImages(prev => [...prev, ...filesToAdd]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images || [], ...filesToAdd]
    }));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!selectedCategory) {
          newErrors.category = 'Please select a category';
        }
        break;
        
      case 2:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.contact_email.trim()) newErrors.contact_email = 'Contact email is required';
        
        // Validate category-specific data based on type
        if (selectedCategory) {
          switch (selectedCategory.category_type) {
            case 'jobs':
              if (!jobData.companyName.trim()) newErrors.companyName = 'Company name is required';
              if (!jobData.requirements.trim()) newErrors.requirements = 'Requirements are required';
              break;
            case 'housing':
              if (!housingData.rentAmount || housingData.rentAmount <= 0) {
                newErrors.rentAmount = 'Rent amount is required';
              }
              break;
            case 'roommates':
              if (!roommateData.monthlyRent || roommateData.monthlyRent <= 0) {
                newErrors.monthlyRent = 'Monthly rent is required';
              }
              break;
            case 'legal':
              if (!lawyerData.specializations.trim()) {
                newErrors.specializations = 'Specializations are required';
              }
              if (!lawyerData.barAdmissions.trim()) {
                newErrors.barAdmissions = 'Bar admissions are required';
              }
              break;
            case 'marketplace':
              if (!marketplaceData.price || marketplaceData.price <= 0) {
                newErrors.price = 'Price is required';
              }
              break;
            case 'services':
              break;
          }
        }
        break;
        
      case 3:
        if (!locationData.country) newErrors.country = 'Country is required';
        if (!locationData.stateProvince) newErrors.stateProvince = 'State/Province is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const prepareCategoryData = () => {
    if (!selectedCategory) return {};
    
    switch (selectedCategory.category_type) {
      case 'jobs':
        return {
          job_type: jobData.jobType,
          company_name: jobData.companyName,
          salary_min: jobData.salaryMin,
          salary_max: jobData.salaryMax,
          salary_period: jobData.salaryPeriod,
          salary_currency: jobData.salaryCurrency,
          salary_negotiable: jobData.salaryNegotiable,
          bonus_info: jobData.bonusInfo,
          benefits: jobData.benefits,
          requirements: jobData.requirements,
          visa_sponsorship: jobData.visaSponsorship,
          remote_work: jobData.remoteWork,
        };
      case 'housing':
        return {
          housing_type: housingData.housingType,
          bedrooms: housingData.bedrooms,
          bathrooms: housingData.bathrooms,
          square_feet: housingData.squareFeet,
          rent_amount: housingData.rentAmount,
          rent_period: housingData.rentPeriod,
          rent_currency: housingData.rentCurrency,
          rent_negotiable: housingData.rentNegotiable,
          deposit_required: housingData.depositRequired,
          utilities_cost: housingData.utilitiesCost,
          utilities_included: housingData.utilitiesIncluded,
          furnished: housingData.furnished,
          pets_allowed: housingData.petsAllowed,
          parking_available: housingData.parkingAvailable,
          laundry_available: housingData.laundryAvailable,
          lease_term_min: housingData.leaseTermMin,
          available_date: housingData.availableDate,
        };
      case 'roommates':
        return {
          room_type: roommateData.roomType,
          monthly_rent: roommateData.monthlyRent,
          rent_currency: roommateData.rentCurrency,
          deposit_required: roommateData.depositRequired,
          utilities_cost: roommateData.utilitiesCost,
          utilities_included: roommateData.utilitiesIncluded,
          private_bathroom: roommateData.privateBathroom,
          furnished: roommateData.furnished,
          gender_preference: roommateData.genderPreference,
          age_min: roommateData.ageMin,
          age_max: roommateData.ageMax,
          students_welcome: roommateData.studentsWelcome,
          working_professionals: roommateData.workingProfessionals,
          pets_allowed: roommateData.petsAllowed,
          smoking_allowed: roommateData.smokingAllowed,
          lease_term_months: roommateData.leaseTermMonths,
          move_in_date: roommateData.moveInDate,
          current_roommates_count: roommateData.currentRoommatesCount,
          total_bedrooms: roommateData.totalBedrooms,
          total_bathrooms: roommateData.totalBathrooms,
        };
      case 'legal':
        return {
          law_firm: lawyerData.lawFirm,
          specializations: lawyerData.specializations,
          years_experience: lawyerData.yearsExperience,
          bar_admissions: lawyerData.barAdmissions,
          languages: lawyerData.languages,
          license_number: lawyerData.licenseNumber,
          pricing_model: lawyerData.pricingModel,
          hourly_rate: lawyerData.hourlyRate,
          consultation_fee: lawyerData.consultationFee,
          currency: lawyerData.currency,
          accepts_pro_bono: lawyerData.acceptsProBono,
          free_consultation: lawyerData.freeConsultation,
          offers_payment_plans: lawyerData.offersPaymentPlans,
          virtual_consultations: lawyerData.virtualConsultations,
        };
      case 'marketplace':
        return {
          item_category: marketplaceData.itemCategory,
          brand: marketplaceData.brand,
          model: marketplaceData.model,
          condition: marketplaceData.condition,
          year_purchased: marketplaceData.yearPurchased,
          price: marketplaceData.price,
          currency: marketplaceData.currency,
          price_negotiable: marketplaceData.priceNegotiable,
          accepting_trades: marketplaceData.acceptingTrades,
          trade_preferences: marketplaceData.tradePreferences,
          quantity_available: marketplaceData.quantityAvailable,
          pickup_available: marketplaceData.pickupAvailable,
          delivery_available: marketplaceData.deliveryAvailable,
          delivery_fee: marketplaceData.deliveryFee,
          shipping_available: marketplaceData.shippingAvailable,
          original_price: marketplaceData.originalPrice,
          purchase_receipt: marketplaceData.purchaseReceipt,
          warranty_remaining: marketplaceData.warrantyRemaining,
          warranty_details: marketplaceData.warrantyDetails,
        };
      case 'services':
        return {
          service_category: serviceData.serviceCategory,
          pricing_type: serviceData.pricingType,
          price: serviceData.price,
          currency: serviceData.currency,
          price_negotiable: serviceData.priceNegotiable,
          experience_years: serviceData.experienceYears,
          languages_offered: serviceData.languagesOffered,
          certifications: serviceData.certifications,
          available_weekdays: serviceData.availableWeekdays,
          available_weekends: serviceData.availableWeekends,
          available_evenings: serviceData.availableEvenings,
          remote_service: serviceData.remoteService,
          travel_radius_miles: serviceData.travelRadiusMiles,
        };
      default:
        return {};
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    try {
      const categoryData = prepareCategoryData();
      const submissionData = {
        ...formData,
        categoryData,
      };
      
      console.log('🚀 Submitting listing with data:', submissionData);
      const result = await createListing(submissionData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        alert('Listing created successfully!');
        router.push(`/listings/${result.payload.id}`);
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  const renderCategorySection = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory.category_type) {
      case 'jobs':
        return (
          <JobSection 
            data={jobData} 
            onChange={(updates) => setJobData(prev => ({ ...prev, ...updates }))} 
          />
        );
      case 'housing':
        return (
          <HousingSection 
            data={housingData} 
            onChange={(updates) => setHousingData(prev => ({ ...prev, ...updates }))} 
          />
        );
      case 'roommates':
        return (
          <RoommateSection 
            data={roommateData} 
            onChange={(updates) => setRoommateData(prev => ({ ...prev, ...updates }))} 
          />
        );
      case 'legal':
        return (
          <LawyerSection 
            data={lawyerData} 
            onChange={(updates) => setLawyerData(prev => ({ ...prev, ...updates }))} 
          />
        );
      case 'marketplace':
        return (
          <MarketplaceSection 
            data={marketplaceData} 
            onChange={(updates) => setMarketplaceData(prev => ({ ...prev, ...updates }))} 
          />
        );
      case 'services':
        return (
          <ServiceSection 
            data={serviceData} 
            onChange={(updates) => setServiceData(prev => ({ ...prev, ...updates }))} 
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Additional Fields</h3>
            <p className="text-gray-500">This category doesn't require additional information.</p>
          </div>
        );
    }
  };

  const steps = [
    { number: 1, name: 'Category', description: 'Choose listing type', icon: FileText },
    { number: 2, name: 'Details', description: 'Add information', icon: Briefcase },
    { number: 3, name: 'Location', description: 'Set location', icon: MapPin },
    { number: 4, name: 'Publish', description: 'Review & publish', icon: CheckCircle2 },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Create a New Listing</h1>
              <p className="text-xl text-gray-600">Choose the type of listing you want to create</p>
            </div>
            
            {!Array.isArray(categories) || categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading categories...</h3>
                <p className="text-gray-500 mb-6">Please wait while we load the available categories</p>
                <button
                  onClick={loadCategories}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.category_type);
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 text-left hover:border-blue-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <IconComponent className="w-8 h-8 text-blue-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{category.description}</p>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Listing Details</h1>
                  <p className="text-lg text-gray-600">
                    Tell us about your {selectedCategory?.name?.toLowerCase() || 'listing'}
                  </p>
                </div>
                {selectedCategory && (
                  <div className="flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      {React.createElement(getCategoryIcon(selectedCategory.category_type), { 
                        className: "w-4 h-4 text-blue-600" 
                      })}
                    </div>
                    <span className="font-medium text-blue-900">{selectedCategory.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter a clear, descriptive title"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Provide detailed information about your listing. Be specific and include relevant details that would help potential respondents."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.contact_email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.contact_email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.contact_email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Phone Number <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Website URL <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Category-Specific Fields */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {selectedCategory?.name} Specific Details
                </h2>
                {renderCategorySection()}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Details</h1>
              <p className="text-lg text-gray-600">Where is your listing located?</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Set Your Location</h2>
              </div>
              
              <LocationSection 
                data={locationData}
                onChange={(updates) => setLocationData(prev => ({ ...prev, ...updates }))}
                countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code }))}
                states={states.map(s => ({ id: s.id, name: s.name, countryId: s.country }))}
                cities={cities.map(c => ({ id: c.id, name: c.name, stateId: c.state_province }))}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Almost Done!</h1>
              <p className="text-lg text-gray-600">Add photos and configure your listing settings</p>
            </div>

            <div className="space-y-8">
              {/* Image Upload */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Camera className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Add Photos</h2>
                  <span className="ml-2 text-sm text-gray-500">(Optional)</span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
                    <p className="text-gray-500 mb-4">
                      Drag and drop images here, or click to browse
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Maximum 10 images • Up to 5MB each • JPG, PNG, GIF
                    </p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Uploaded Photos ({imagePreviews.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Globe className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Visibility & Settings</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Who can see this listing?</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          value: 'public', 
                          icon: Globe, 
                          label: 'Public', 
                          description: 'Anyone can discover and view this listing',
                          badge: 'Recommended'
                        },
                        { 
                          value: 'community', 
                          icon: Users, 
                          label: 'Your Community', 
                          description: 'Only people from your community can see this'
                        },
                        { 
                          value: 'same_origin', 
                          icon: Flag, 
                          label: 'Same Origin Country', 
                          description: 'Only people from your origin country can see this'
                        },
                        { 
                          value: 'verified_only', 
                          icon: UserCheck, 
                          label: 'Verified Users Only', 
                          description: 'Only verified users can see this listing'
                        }
                      ].map(option => {
                        const Icon = option.icon;
                        const isSelected = formData.visibility === option.value;
                        return (
                          <label key={option.value} className="cursor-pointer">
                            <div className={`p-4 border-2 rounded-lg transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="radio"
                                  name="visibility"
                                  value={option.value}
                                  checked={isSelected}
                                  onChange={handleInputChange}
                                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center">
                                    <Icon className={`w-5 h-5 mr-2 ${
                                      isSelected ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                    {option.badge && (
                                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                        {option.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      Higher priority listings may be shown more prominently
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Listing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                    <p className="text-gray-600">{selectedCategory?.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                    <p className="text-gray-600">{formData.title || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">
                      {locationData.country && locationData.stateProvince 
                        ? `${countries.find(c => c.id === locationData.country)?.name}, ${states.find(s => s.id === locationData.stateProvince)?.name}`
                        : 'Not set'
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Visibility</h3>
                    <p className="text-gray-600 capitalize">{formData.visibility.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Step {currentStep} of 4
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-8">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <li key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                        isCompleted 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : isCurrent
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {createError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Creating Listing</h3>
                <p className="text-sm text-red-700 mt-1">{createError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Publish Listing
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;