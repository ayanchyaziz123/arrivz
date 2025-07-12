import { LawyerData } from "@/types/listing-components";


interface LawyerSectionProps {
  data: LawyerData;
  onChange: (data: Partial<LawyerData>) => void;
}

export const LawyerSection: React.FC<LawyerSectionProps> = ({ data, onChange }) => {
  const update = (field: keyof LawyerData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Legal Professional Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Law Firm (Optional)</label>
          <input
            type="text"
            value={data.lawFirm || ''}
            onChange={(e) => update('lawFirm', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Smith & Associates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Years of Experience</label>
          <input
            type="number"
            min="0"
            value={data.yearsExperience}
            onChange={(e) => update('yearsExperience', Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Specializations</label>
        <input
          type="text"
          value={data.specializations}
          onChange={(e) => update('specializations', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Immigration Law, Employment Law, Family Law"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bar Admissions</label>
          <input
            type="text"
            value={data.barAdmissions}
            onChange={(e) => update('barAdmissions', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="NY, CA, Federal Courts"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Languages (Optional)</label>
          <input
            type="text"
            value={data.languages || ''}
            onChange={(e) => update('languages', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="English, Spanish, French"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pricing Model</label>
          <select 
            value={data.pricingModel} 
            onChange={(e) => update('pricingModel', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="hourly">Hourly Rate</option>
            <option value="flat_fee">Flat Fee</option>
            <option value="contingency">Contingency Fee</option>
            <option value="retainer">Retainer</option>
            <option value="consultation_only">Consultation Only</option>
            <option value="pro_bono">Pro Bono</option>
            <option value="varies">Varies by Case</option>
          </select>
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
      </div>

      {(data.pricingModel === 'hourly' || data.pricingModel === 'consultation_only') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.pricingModel === 'hourly' && (
            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate</label>
              <input
                type="number"
                value={data.hourlyRate || ''}
                onChange={(e) => update('hourlyRate', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border rounded-md"
                placeholder="350"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Consultation Fee</label>
            <input
              type="number"
              value={data.consultationFee || ''}
              onChange={(e) => update('consultationFee', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-md"
              placeholder="200"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'acceptsProBono', label: 'Accepts Pro Bono Cases' },
          { key: 'freeConsultation', label: 'Free Initial Consultation' },
          { key: 'offersPaymentPlans', label: 'Offers Payment Plans' },
          { key: 'virtualConsultations', label: 'Virtual Consultations' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data[key as keyof LawyerData] as boolean}
              onChange={(e) => update(key as keyof LawyerData, e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};