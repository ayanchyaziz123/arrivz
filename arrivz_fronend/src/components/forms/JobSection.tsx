import { JobData } from '@/types/listing-components';
import React from 'react';
import { 
  DollarSign, 
  Building2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Users
} from 'lucide-react';

interface JobSectionProps {
  data: JobData;
  onChange: (data: Partial<JobData>) => void;
}

export const JobSection: React.FC<JobSectionProps> = ({ data, onChange }) => {
  const update = (field: keyof JobData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Job Basic Details */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Job Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select 
              value={data.jobType} 
              onChange={(e) => update('jobType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Google, Microsoft, Startup Inc."
            />
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Compensation</h3>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Minimum Salary
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={data.salaryMin || ''}
                  onChange={(e) => update('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="50,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Maximum Salary
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={data.salaryMax || ''}
                  onChange={(e) => update('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="80,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pay Period
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  value={data.salaryPeriod} 
                  onChange={(e) => update('salaryPeriod', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="hourly">Per Hour</option>
                  <option value="monthly">Per Month</option>
                  <option value="yearly">Per Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Currency
              </label>
              <select 
                value={data.salaryCurrency} 
                onChange={(e) => update('salaryCurrency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="salary-negotiable"
              checked={data.salaryNegotiable}
              onChange={(e) => update('salaryNegotiable', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="salary-negotiable" className="ml-3 text-sm text-gray-700">
              Salary is negotiable
            </label>
          </div>
        </div>
      </div>

      {/* Work Arrangements */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Work Arrangements</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="remote-work"
                checked={data.remoteWork}
                onChange={(e) => update('remoteWork', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="remote-work" className="flex items-center text-sm font-medium text-gray-900">
                  <Globe className="w-4 h-4 mr-2" />
                  Remote Work Available
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Employees can work from anywhere
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="visa-sponsorship"
                checked={data.visaSponsorship}
                onChange={(e) => update('visaSponsorship', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="visa-sponsorship" className="flex items-center text-sm font-medium text-gray-900">
                  <Users className="w-4 h-4 mr-2" />
                  Visa Sponsorship Available
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  We sponsor work visas for qualified candidates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Requirements */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Requirements & Qualifications</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Job Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.requirements}
            onChange={(e) => update('requirements', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={5}
            placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years of experience with React and TypeScript&#10;• Experience with Node.js and databases&#10;• Strong problem-solving skills&#10;• Excellent communication abilities"
          />
          <p className="mt-2 text-xs text-gray-500">
            List the essential skills, experience, and qualifications for this role
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          <span className="ml-2 text-sm text-gray-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Benefits & Perks
            </label>
            <textarea
              value={data.benefits || ''}
              onChange={(e) => update('benefits', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="• Health, dental, and vision insurance&#10;• 401(k) with company matching&#10;• Flexible PTO policy&#10;• Professional development budget&#10;• Remote work stipend"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bonus & Incentives
            </label>
            <textarea
              value={data.bonusInfo || ''}
              onChange={(e) => update('bonusInfo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="• Annual performance bonus up to 20%&#10;• Stock options or equity&#10;• Quarterly team bonuses&#10;• Referral bonuses&#10;• Commission structure"
            />
          </div>
        </div>
      </div>

      {/* Preview Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Job Listing Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Position:</span>
            <span className="font-medium text-blue-900">
              {data.jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
              {data.companyName && ` at ${data.companyName}`}
            </span>
          </div>
          {(data.salaryMin || data.salaryMax) && (
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Compensation:</span>
              <span className="font-medium text-blue-900">
                {data.salaryMin && data.salaryMax 
                  ? `${data.salaryCurrency} ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()}`
                  : data.salaryMin 
                  ? `${data.salaryCurrency} ${data.salaryMin.toLocaleString()}+`
                  : `Up to ${data.salaryCurrency} ${data.salaryMax?.toLocaleString()}`
                } {data.salaryPeriod.replace('ly', '')}
                {data.salaryNegotiable && ' (Negotiable)'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Work Style:</span>
            <span className="font-medium text-blue-900">
              {data.remoteWork ? 'Remote Available' : 'On-site'}
              {data.visaSponsorship && ' • Visa Sponsorship'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};