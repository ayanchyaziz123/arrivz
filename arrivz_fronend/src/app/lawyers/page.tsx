'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, Grid, List, ChevronDown, Clock, DollarSign, Building, Users, Scale, Award, Phone, Mail, MessageCircle, Calendar, Eye, Send, CheckCircle, TrendingUp, Briefcase } from 'lucide-react';

// Sample lawyers data
const lawyers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Partner",
    firm: "Johnson & Associates LLP",
    firmLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    specializations: ["Corporate Law", "Mergers & Acquisitions", "Securities Law"],
    experience: 15,
    education: ["Harvard Law School (JD)", "Stanford University (BA)"],
    barAdmissions: ["California", "New York"],
    rating: 4.9,
    reviews: 127,
    hourlyRate: { min: 450, max: 650 },
    languages: ["English", "Spanish"],
    bio: "Sarah is a leading corporate attorney with over 15 years of experience in complex M&A transactions and securities law. She has advised Fortune 500 companies on billion-dollar deals.",
    achievements: ["Super Lawyers Top 100", "Best Lawyers in America", "Chambers & Partners"],
    verified: true,
    responseTime: "Within 2 hours",
    consultationFee: 0,
    featured: true
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Senior Partner",
    firm: "Chen Legal Group",
    firmLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    location: "New York, NY",
    specializations: ["Immigration Law", "Business Immigration", "Family Immigration"],
    experience: 12,
    education: ["Columbia Law School (JD)", "NYU (BA)"],
    barAdmissions: ["New York", "New Jersey"],
    rating: 4.8,
    reviews: 203,
    hourlyRate: { min: 300, max: 450 },
    languages: ["English", "Mandarin", "Cantonese"],
    bio: "Michael specializes in immigration law with a focus on business and family immigration. He has successfully handled over 1,000 immigration cases.",
    achievements: ["AV Rated by Martindale-Hubbell", "Rising Stars"],
    verified: true,
    responseTime: "Within 4 hours",
    consultationFee: 150,
    featured: false
  },
  {
    id: 3,
    name: "Jennifer Rodriguez",
    title: "Attorney",
    firm: "Rodriguez Family Law",
    firmLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    location: "Los Angeles, CA",
    specializations: ["Family Law", "Divorce", "Child Custody"],
    experience: 8,
    education: ["UCLA School of Law (JD)", "UC Berkeley (BA)"],
    barAdmissions: ["California"],
    rating: 4.7,
    reviews: 89,
    hourlyRate: { min: 250, max: 350 },
    languages: ["English", "Spanish"],
    bio: "Jennifer is dedicated to helping families navigate difficult legal situations with compassion and expertise. She focuses on achieving the best outcomes for children.",
    achievements: ["California State Bar Certified", "Family Law Specialist"],
    verified: true,
    responseTime: "Within 6 hours",
    consultationFee: 100,
    featured: false
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Partner",
    firm: "Thompson Criminal Defense",
    firmLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    location: "Chicago, IL",
    specializations: ["Criminal Defense", "White Collar Crime", "DUI Defense"],
    experience: 20,
    education: ["University of Chicago Law School (JD)", "Northwestern University (BA)"],
    barAdmissions: ["Illinois", "Indiana"],
    rating: 4.9,
    reviews: 156,
    hourlyRate: { min: 400, max: 600 },
    languages: ["English"],
    bio: "David is a former prosecutor with 20+ years of criminal defense experience. He has successfully defended clients in high-profile cases and complex white-collar matters.",
    achievements: ["Best Criminal Defense Attorney", "AV Preeminent Rating"],
    verified: true,
    responseTime: "Within 1 hour",
    consultationFee: 200,
    featured: true
  },
  {
    id: 5,
    name: "Emily Watson",
    title: "Associate",
    firm: "Watson Personal Injury Law",
    firmLogo: "https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    location: "Miami, FL",
    specializations: ["Personal Injury", "Auto Accidents", "Medical Malpractice"],
    experience: 6,
    education: ["University of Miami School of Law (JD)", "Florida State University (BA)"],
    barAdmissions: ["Florida"],
    rating: 4.6,
    reviews: 74,
    hourlyRate: { min: 200, max: 300 },
    languages: ["English", "Portuguese"],
    bio: "Emily fights for injury victims and their families. She has recovered millions in settlements and verdicts for clients injured in accidents and medical malpractice.",
    achievements: ["Florida Rising Stars", "Trial Advocacy Award"],
    verified: true,
    responseTime: "Within 8 hours",
    consultationFee: 0,
    featured: false
  },
  {
    id: 6,
    name: "Robert Kim",
    title: "Senior Attorney",
    firm: "Kim Intellectual Property",
    firmLogo: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=100&h=100&fit=crop",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    location: "Austin, TX",
    specializations: ["Intellectual Property", "Patent Law", "Trademark Law"],
    experience: 10,
    education: ["UT Austin School of Law (JD)", "MIT (BS Engineering)"],
    barAdmissions: ["Texas", "USPTO"],
    rating: 4.8,
    reviews: 92,
    hourlyRate: { min: 350, max: 500 },
    languages: ["English", "Korean"],
    bio: "Robert combines his engineering background with legal expertise to help innovators protect their intellectual property. He has filed hundreds of patent applications.",
    achievements: ["IP Law Rising Star", "Patent Bar Certified"],
    verified: true,
    responseTime: "Within 12 hours",
    consultationFee: 75,
    featured: false
  }
];

const specializations = [
  "All Specializations",
  "Corporate Law",
  "Criminal Defense", 
  "Family Law",
  "Personal Injury",
  "Immigration Law",
  "Intellectual Property",
  "Real Estate Law",
  "Employment Law",
  "Tax Law"
];

const experienceRanges = [
  { value: "all", label: "Any Experience" },
  { value: "0-5", label: "0-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10-15", label: "10-15 years" },
  { value: "15-20", label: "15-20 years" },
  { value: "20+", label: "20+ years" }
];

const rateRanges = [
  { value: "all", label: "Any Rate" },
  { value: "0-200", label: "Under $200/hr" },
  { value: "200-300", label: "$200-300/hr" },
  { value: "300-400", label: "$300-400/hr" },
  { value: "400-500", label: "$400-500/hr" },
  { value: "500+", label: "$500+/hr" }
];

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "rate-low", label: "Lowest Rate" },
  { value: "rate-high", label: "Highest Rate" },
  { value: "reviews", label: "Most Reviews" }
];

const Lawyers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedRate, setSelectedRate] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === 'All Specializations' || 
                                 lawyer.specializations.includes(selectedSpecialization);
    
    return matchesSearch && matchesSpecialization;
  });

  const LawyerCard = ({ lawyer }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img 
            src={lawyer.photo} 
            alt={lawyer.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          {lawyer.verified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-xl text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                {lawyer.name}
              </h3>
              <p className="text-gray-600">{lawyer.title}</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <img 
              src={lawyer.firmLogo} 
              alt={lawyer.firm}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="font-medium text-gray-700">{lawyer.firm}</span>
            {lawyer.featured && (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                Featured
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {lawyer.location}
            </div>
            <div className="flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              {lawyer.experience} years
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {lawyer.rating} ({lawyer.reviews} reviews)
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm line-clamp-2">{lawyer.bio}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {lawyer.specializations.map((spec, index) => (
          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {spec}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Education:</span>
          <p className="font-medium text-gray-900">{lawyer.education[0]}</p>
        </div>
        <div>
          <span className="text-gray-500">Bar Admissions:</span>
          <p className="font-medium text-gray-900">{lawyer.barAdmissions.join(', ')}</p>
        </div>
        <div>
          <span className="text-gray-500">Languages:</span>
          <p className="font-medium text-gray-900">{lawyer.languages.join(', ')}</p>
        </div>
        <div>
          <span className="text-gray-500">Response Time:</span>
          <p className="font-medium text-gray-900">{lawyer.responseTime}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-600 mr-1" />
            <span className="font-semibold text-gray-900">
              ${lawyer.hourlyRate.min}-${lawyer.hourlyRate.max}/hr
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Consultation: {lawyer.consultationFee === 0 ? 'Free' : `$${lawyer.consultationFee}`}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {lawyer.achievements.slice(0, 2).map((achievement, index) => (
          <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md flex items-center">
            <Award className="w-3 h-3 mr-1" />
            {achievement}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            <Phone className="w-4 h-4 mr-1" />
            Call
          </button>
          <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            <Mail className="w-4 h-4 mr-1" />
            Email
          </button>
          <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-1" />
            View Profile
          </button>
          <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4 mr-1" />
            Consult
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Expert Legal Counsel</h1>
            <p className="text-gray-600 text-lg">Connect with experienced attorneys in your area</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Filters */}
        <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lawyers, firms, specializations, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Specialization */}
              <div className="relative">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Experience */}
              <div className="relative">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {experienceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Hourly Rate */}
              <div className="relative">
                <select
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {rateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lawyers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Legal Specializations */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Legal Specialization
                </label>
                <div className="space-y-2">
                  {specializations.map(spec => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="radio"
                        name="specialization"
                        value={spec}
                        checked={selectedSpecialization === spec}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Years of Experience
                </label>
                <div className="space-y-2">
                  {experienceRanges.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        value={range.value}
                        checked={selectedExperience === range.value}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hourly Rate
                </label>
                <div className="space-y-2">
                  {rateRanges.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="hourlyRate"
                        value={range.value}
                        checked={selectedRate === range.value}
                        onChange={(e) => setSelectedRate(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lawyer Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Lawyer Features
                </label>
                <div className="space-y-2">
                  {[
                    'Verified Lawyers Only',
                    'Featured Lawyers',
                    'Free Consultation',
                    'Quick Response (< 2 hours)',
                    'Top Rated (4.8+ stars)',
                    'Bar Certified'
                  ].map(feature => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Languages
                </label>
                <div className="space-y-2">
                  {[
                    'English',
                    'Spanish',
                    'French',
                    'German',
                    'Mandarin',
                    'Portuguese',
                    'Italian'
                  ].map(language => (
                    <label key={language} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city or state..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Search Bar and Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 relative mr-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lawyers, firms, specializations, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                Free Consultation
              </button>
              <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                Top Rated (4.8+)
              </button>
              <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                Verified Lawyers
              </button>
              <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                Quick Response
              </button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredLawyers.length}</span> lawyers found
              </div>
              <div className="text-sm text-gray-500">
                All lawyers verified • Updated daily
              </div>
            </div>

            {/* Lawyers List */}
            <div className="space-y-6">
              {filteredLawyers.map(lawyer => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Lawyers
              </button>
            </div>

            {/* Legal Help Section */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Legal Help?</h3>
              <p className="text-gray-600 mb-4">Get matched with qualified attorneys in your area. Free case evaluation available.</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Legal Help Now
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Results (only show on mobile) */}
        <div className="lg:hidden">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
              Free Consultation
            </button>
            <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
              Top Rated (4.8+)
            </button>
            <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
              Verified Lawyers
            </button>
            <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
              Quick Response
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredLawyers.length}</span> lawyers found
            </div>
            <div className="text-sm text-gray-500">
              All lawyers verified • Updated daily
            </div>
          </div>

          <div className="space-y-6">
            {filteredLawyers.map(lawyer => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Lawyers
            </button>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Legal Help?</h3>
            <p className="text-gray-600 mb-4">Get matched with qualified attorneys in your area. Free case evaluation available.</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Legal Help Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lawyers;