/ Usage Example - Complete Form:
// components/CreateListingForm.tsx
/*
import { useState } from 'react';
import { 
  JobSection, HousingSection, RoommateSection, LawyerSection, 
  MarketplaceSection, ServiceSection, LocationSection 
} from './forms';

export default function CreateListingForm() {
  const [listingType, setListingType] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData>({
    country: '', stateProvince: ''
  });

  const renderSection = () => {
    switch(listingType) {
      case 'job': return <JobSection data={jobData} onChange={setJobData} />;
      case 'housing': return <HousingSection data={housingData} onChange={setHousingData} />;
      case 'roommate': return <RoommateSection data={roommateData} onChange={setRoommateData} />;
      case 'lawyer': return <LawyerSection data={lawyerData} onChange={setLawyerData} />;
      case 'marketplace': return <MarketplaceSection data={marketplaceData} onChange={setMarketplaceData} />;
      case 'service': return <ServiceSection data={serviceData} onChange={setServiceData} />;
      default: return null;
    }
  };

  return (
    <form className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow">
      <LocationSection 
        data={locationData}
        onChange={(updates) => setLocationData(prev => ({ ...prev, ...updates }))}
        countries={countries} states={states} cities={cities}
      />
      
      {renderSection()}
      
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
        Create Listing
      </button>
    </form>
  );
}
*/