import { RoommateData } from "@/types/listing-components";



interface RoommateSectionProps {
    data: RoommateData;
    onChange: (data: Partial<RoommateData>) => void;
  }
  
  export const RoommateSection: React.FC<RoommateSectionProps> = ({ data, onChange }) => {
    const update = (field: keyof RoommateData, value: any) => {
      onChange({ [field]: value });
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Roommate Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select 
              value={data.roomType} 
              onChange={(e) => update('roomType', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="private_room">Private Room</option>
              <option value="shared_room">Shared Room</option>
              <option value="master_bedroom">Master Bedroom</option>
              <option value="studio_share">Studio Share</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Rent</label>
            <input
              type="number"
              value={data.monthlyRent}
              onChange={(e) => update('monthlyRent', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="800"
            />
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
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gender Preference</label>
            <select 
              value={data.genderPreference} 
              onChange={(e) => update('genderPreference', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="any">Any Gender</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
              <option value="non_binary">Non-Binary</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Min Age</label>
            <input
              type="number"
              min="18"
              value={data.ageMin || ''}
              onChange={(e) => update('ageMin', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="21"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Max Age</label>
            <input
              type="number"
              value={data.ageMax || ''}
              onChange={(e) => update('ageMax', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="35"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Lease Term (months)</label>
            <input
              type="number"
              min="1"
              value={data.leaseTermMonths}
              onChange={(e) => update('leaseTermMonths', Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'privateBathroom', label: 'Private Bathroom' },
            { key: 'furnished', label: 'Furnished' },
            { key: 'utilitiesIncluded', label: 'Utilities Included' },
            { key: 'studentsWelcome', label: 'Students Welcome' },
            { key: 'workingProfessionals', label: 'Working Professionals' },
            { key: 'petsAllowed', label: 'Pets Allowed' },
            { key: 'smokingAllowed', label: 'Smoking Allowed' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data[key as keyof RoommateData] as boolean}
                onChange={(e) => update(key as keyof RoommateData, e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Move-in Date</label>
          <input
            type="date"
            value={data.moveInDate || ''}
            onChange={(e) => update('moveInDate', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    );
  };