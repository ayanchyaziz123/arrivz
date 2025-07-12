import { ServiceData } from "@/types/listing-components";


interface ServiceSectionProps {
    data: ServiceData;
    onChange: (data: Partial<ServiceData>) => void;
  }
  
  export const ServiceSection: React.FC<ServiceSectionProps> = ({ data, onChange }) => {
    const update = (field: keyof ServiceData, value: any) => {
      onChange({ [field]: value });
    };
  
    const serviceCategories = [
      'home_services', 'tutoring', 'tech_support', 'translation', 
      'photography', 'event_planning', 'consulting', 'fitness', 
      'childcare', 'pet_services', 'automotive', 'other'
    ];
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Service Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service Category</label>
            <select 
              value={data.serviceCategory} 
              onChange={(e) => update('serviceCategory', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {serviceCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Pricing Type</label>
            <select 
              value={data.pricingType} 
              onChange={(e) => update('pricingType', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="hourly">Hourly Rate</option>
              <option value="fixed">Fixed Price</option>
              <option value="per_session">Per Session</option>
              <option value="per_project">Per Project</option>
              <option value="consultation">Consultation Fee</option>
              <option value="free">Free</option>
              <option value="varies">Varies</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Experience (Years)</label>
            <input
              type="number"
              min="0"
              value={data.experienceYears || ''}
              onChange={(e) => update('experienceYears', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
  
        {data.pricingType !== 'free' && data.pricingType !== 'varies' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={data.price || ''}
                onChange={(e) => update('price', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border rounded-md"
                placeholder="50.00"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={data.currency} 
                onChange={(e) => update('currency', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
  
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.priceNegotiable}
                  onChange={(e) => update('priceNegotiable', e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm">Price Negotiable</label>
              </div>
            </div>
          </div>
        )}
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Languages Offered</label>
            <input
              type="text"
              value={data.languagesOffered || ''}
              onChange={(e) => update('languagesOffered', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="English, Spanish, French"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Travel Radius (miles)</label>
            <input
              type="number"
              min="0"
              value={data.travelRadiusMiles || ''}
              onChange={(e) => update('travelRadiusMiles', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="25"
            />
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Certifications</label>
          <textarea
            value={data.certifications || ''}
            onChange={(e) => update('certifications', e.target.value)}
            className="w-full p-2 border rounded-md h-20"
            placeholder="List relevant certifications, licenses, or qualifications..."
          />
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'availableWeekdays', label: 'Available Weekdays' },
            { key: 'availableWeekends', label: 'Available Weekends' },
            { key: 'availableEvenings', label: 'Available Evenings' },
            { key: 'remoteService', label: 'Remote Service Available' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data[key as keyof ServiceData] as boolean}
                onChange={(e) => update(key as keyof ServiceData, e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };
  