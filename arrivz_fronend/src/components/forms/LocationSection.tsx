import { LocationData } from "@/types/listing-components";
import React, { useEffect } from 'react';
import { 
  MapPin, 
  Globe, 
  Navigation, 
  Building, 
  Home,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface LocationSectionProps {
  data: LocationData;
  onChange: (data: Partial<LocationData>) => void;
  countries: Array<{ id: string; name: string; code: string }>;
  states: Array<{ id: string; name: string; countryId: any }>;  // countryId can be object or string
  cities: Array<{ id: string; name: string; stateId: any }>;    // stateId can be object or string
}

export const LocationSection: React.FC<LocationSectionProps> = ({ 
  data, 
  onChange, 
  countries, 
  states, 
  cities 
}) => {
  // Debug logging
  useEffect(() => {
    console.log('=== LocationSection Debug ===');
    console.log('Countries:', countries?.length || 0, 'items:', countries);
    console.log('States:', states?.length || 0, 'items:', states);
    if (states?.length > 0) {
      console.log('First state detailed:', states[0]);
      console.log('State countryId type:', typeof states[0].countryId);
      console.log('State countryId value:', states[0].countryId);
    }
    console.log('Cities:', cities?.length || 0, 'items:', cities);
    console.log('Current data:', data);
    console.log('===============================');
  }, [countries, states, cities, data]);

  const update = (field: keyof LocationData, value: any) => {
    console.log(`🔄 Updating ${field}:`, value);
    onChange({ [field]: value });
  };

  // Helper function to get ID from object or string
  const getId = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return String(value.id || value.pk || '');
    }
    return String(value || '');
  };

  // Fixed filtering to handle object countryId
  const filteredStates = states?.filter(state => {
    const stateCountryId = getId(state.countryId);
    const selectedCountryId = String(data.country);
    
    console.log('🔍 State filtering:');
    console.log('  State:', state.name);
    console.log('  State countryId raw:', state.countryId);
    console.log('  State countryId extracted:', stateCountryId);
    console.log('  Selected country:', selectedCountryId);
    console.log('  Match:', stateCountryId === selectedCountryId);
    
    return stateCountryId === selectedCountryId;
  }) || [];

  // Fixed filtering to handle object stateId  
  const filteredCities = cities?.filter(city => {
    const cityStateId = getId(city.stateId);
    const selectedStateId = String(data.stateProvince);
    
    console.log('🏙️ City filtering:');
    console.log('  City:', city.name);
    console.log('  City stateId raw:', city.stateId);
    console.log('  City stateId extracted:', cityStateId);
    console.log('  Selected state:', selectedStateId);
    console.log('  Match:', cityStateId === selectedStateId);
    
    return cityStateId === selectedStateId;
  }) || [];

  const selectedCountry = countries?.find(c => c.id === data.country);
  const selectedState = filteredStates?.find(s => s.id === data.stateProvince);
  const selectedCity = filteredCities?.find(c => c.id === data.city);

  console.log('Final filtered results:');
  console.log('Filtered states:', filteredStates?.length || 0, 'for country:', data.country);
  console.log('Filtered cities:', filteredCities?.length || 0, 'for state:', data.stateProvince);

  const getLocationProgress = () => {
    let progress = 0;
    if (data.country) progress += 33;
    if (data.stateProvince) progress += 33;
    if (data.city || data.neighborhood || data.zipCode) progress += 34;
    return progress;
  };

  const isLocationComplete = data.country && data.stateProvince;

  return (
    <div className="space-y-8">
      {/* Enhanced Debug Panel */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">🐛 Debug Info (Remove in production)</h4>
        <div className="text-sm text-yellow-800 space-y-1">
          <p><strong>Countries:</strong> {countries?.length || 0} items</p>
          <p><strong>States:</strong> {states?.length || 0} items (filtered: {filteredStates?.length || 0})</p>
          <p><strong>Cities:</strong> {cities?.length || 0} items (filtered: {filteredCities?.length || 0})</p>
          <p><strong>Selected Country:</strong> {data.country || 'None'}</p>
          <p><strong>Selected State:</strong> {data.stateProvince || 'None'}</p>
          <p><strong>Selected City:</strong> {data.city || 'None'}</p>
          
          {states?.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 rounded">
              <p><strong>First State Structure:</strong></p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(states[0], null, 2)}
              </pre>
            </div>
          )}
          
          {filteredStates?.length > 0 && (
            <div className="mt-2 p-2 bg-green-100 rounded">
              <p><strong>Filtered States:</strong></p>
              {filteredStates.map(state => (
                <p key={state.id} className="text-xs">
                  • {state.name} (ID: {state.id})
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
          </div>
          <div className="flex items-center space-x-2">
            {isLocationComplete ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">In Progress</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getLocationProgress()}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          Help people find your listing by providing accurate location information
        </p>
      </div>

      {/* Primary Location */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-md font-semibold text-gray-900">Primary Location</h4>
          <span className="ml-2 text-sm text-red-500">Required</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={data.country || ''} 
                onChange={(e) => {
                  console.log('🏴 Country changed to:', e.target.value);
                  update('country', e.target.value);
                  update('stateProvince', '');
                  update('city', '');
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                required
              >
                <option value="">Choose your country</option>
                {countries?.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            {data.country && selectedCountry && (
              <p className="mt-2 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {selectedCountry.name} selected
              </p>
            )}
          </div>

          {/* State/Province Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              State/Province <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={data.stateProvince || ''} 
                onChange={(e) => {
                  console.log('🗺️ State changed to:', e.target.value);
                  update('stateProvince', e.target.value);
                  update('city', '');
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                  !data.country 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300'
                }`}
                disabled={!data.country}
                required
              >
                <option value="">
                  {!data.country ? 'Select country first' : 'Choose state/province'}
                </option>
                {filteredStates?.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            {data.stateProvince && selectedState && (
              <p className="mt-2 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {selectedState.name} selected
              </p>
            )}
            {!data.country && (
              <p className="mt-2 text-xs text-gray-500">
                Please select a country first
              </p>
            )}
            {data.country && filteredStates.length === 0 && (
              <p className="mt-2 text-xs text-orange-600">
                ⚠️ No states found. Check your API data structure.
              </p>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              City <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={data.city || ''} 
                onChange={(e) => {
                  console.log('🏙️ City changed to:', e.target.value);
                  update('city', e.target.value);
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                  !data.stateProvince 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300'
                }`}
                disabled={!data.stateProvince}
              >
                <option value="">
                  {!data.stateProvince ? 'Select state/province first' : 'Choose city (optional)'}
                </option>
                {filteredCities?.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {data.city && selectedCity && (
              <p className="mt-2 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {selectedCity.name} selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Location Details - Simplified */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Home className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-md font-semibold text-gray-900">Additional Details</h4>
          <span className="ml-2 text-sm text-gray-500">Optional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Neighborhood/Area
            </label>
            <input
              type="text"
              value={data.neighborhood || ''}
              onChange={(e) => update('neighborhood', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Downtown, Midtown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ZIP/Postal Code
            </label>
            <input
              type="text"
              value={data.zipCode || ''}
              onChange={(e) => update('zipCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., 10001, SW1A 1AA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={data.addressLine1 || ''}
              onChange={(e) => update('addressLine1', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., 123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Apartment/Suite/Floor
            </label>
            <input
              type="text"
              value={data.addressLine2 || ''}
              onChange={(e) => update('addressLine2', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Apt 4B, Suite 200"
            />
          </div>
        </div>
      </div>

      {/* Location Summary */}
      {isLocationComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-medium text-green-900 mb-3">✅ Location Set Successfully</h4>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-medium">
                {[
                  selectedCity?.name,
                  data.neighborhood,
                  selectedState?.name,
                  selectedCountry?.name
                ].filter(Boolean).join(', ')}
              </span>
            </div>
            {data.zipCode && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>Postal Code: {data.zipCode}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};