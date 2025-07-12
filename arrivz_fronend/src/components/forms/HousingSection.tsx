import { HousingData } from "@/types/listing-components";
// components/forms/HousingSection.tsx
interface HousingSectionProps {
    data: HousingData;
    onChange: (data: Partial<HousingData>) => void;
  }
  
  export const HousingSection: React.FC<HousingSectionProps> = ({ data, onChange }) => {
    const update = (field: keyof HousingData, value: any) => {
      onChange({ [field]: value });
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Housing Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Housing Type</label>
            <select 
              value={data.housingType} 
              onChange={(e) => update('housingType', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="studio">Studio</option>
              <option value="condo">Condo</option>
              <option value="shared">Shared Housing</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Bedrooms</label>
            <input
              type="number"
              min="0"
              value={data.bedrooms}
              onChange={(e) => update('bedrooms', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Bathrooms</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={data.bathrooms}
              onChange={(e) => update('bathrooms', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rent Amount</label>
            <input
              type="number"
              value={data.rentAmount}
              onChange={(e) => update('rentAmount', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="2000"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Period</label>
            <select 
              value={data.rentPeriod} 
              onChange={(e) => update('rentPeriod', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select 
              value={data.rentCurrency} 
              onChange={(e) => update('rentCurrency', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Square Feet</label>
            <input
              type="number"
              value={data.squareFeet || ''}
              onChange={(e) => update('squareFeet', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="1200"
            />
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Security Deposit</label>
            <input
              type="number"
              value={data.depositRequired || ''}
              onChange={(e) => update('depositRequired', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="2000"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Utilities Cost</label>
            <input
              type="number"
              value={data.utilitiesCost || ''}
              onChange={(e) => update('utilitiesCost', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="150"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Lease Term (months)</label>
            <input
              type="number"
              min="1"
              value={data.leaseTermMin}
              onChange={(e) => update('leaseTermMin', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'utilitiesIncluded', label: 'Utilities Included' },
            { key: 'furnished', label: 'Furnished' },
            { key: 'petsAllowed', label: 'Pets Allowed' },
            { key: 'parkingAvailable', label: 'Parking Available' },
            { key: 'laundryAvailable', label: 'Laundry Available' },
            { key: 'rentNegotiable', label: 'Rent Negotiable' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data[key as keyof HousingData] as boolean}
                onChange={(e) => update(key as keyof HousingData, e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Available Date</label>
          <input
            type="date"
            value={data.availableDate || ''}
            onChange={(e) => update('availableDate', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    );
  };