"use client"

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, ChevronDown, Clock, DollarSign, Building, Users, Briefcase, BookOpen, Eye, Send } from 'lucide-react';

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    location: "San Francisco, CA",
    remote: true,
    type: "Full-time",
    experience: "Senior",
    salary: { min: 120000, max: 160000, type: "year" },
    posted: "2 days ago",
    applications: 45,
    description: "Join our team as a Senior Frontend Developer to build cutting-edge web applications using React, TypeScript, and modern web technologies.",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"],
    rating: 4.8,
    reviews: 234,
    featured: true,
    urgent: false
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop",
    location: "New York, NY",
    remote: false,
    type: "Full-time",
    experience: "Mid-level",
    salary: { min: 75000, max: 95000, type: "year" },
    posted: "1 day ago",
    applications: 28,
    description: "Create beautiful and intuitive user experiences for our digital products. Work with cross-functional teams to deliver exceptional designs.",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    benefits: ["Health Insurance", "Design Budget", "Learning Stipend"],
    rating: 4.6,
    reviews: 89,
    featured: false,
    urgent: true
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    companyLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    location: "Austin, TX",
    remote: true,
    type: "Full-time",
    experience: "Mid-level",
    salary: { min: 90000, max: 120000, type: "year" },
    posted: "3 days ago",
    applications: 67,
    description: "Build and maintain our platform using modern technologies. You'll work on both frontend and backend development in a fast-paced startup environment.",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS"],
    benefits: ["Equity", "Health Insurance", "Unlimited PTO"],
    rating: 4.4,
    reviews: 42,
    featured: false,
    urgent: false
  },
  {
    id: 4,
    title: "Content Writer",
    company: "Media House",
    companyLogo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    location: "Los Angeles, CA",
    remote: true,
    type: "Part-time",
    experience: "Entry-level",
    salary: { min: 25, max: 40, type: "hour" },
    posted: "4 days ago",
    applications: 123,
    description: "Create engaging content for our digital platforms. Write articles, blog posts, and social media content that resonates with our audience.",
    skills: ["Writing", "SEO", "Content Strategy", "Social Media"],
    benefits: ["Flexible Schedule", "Remote Work", "Learning Opportunities"],
    rating: 4.2,
    reviews: 156,
    featured: false,
    urgent: false
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Analytics Pro",
    companyLogo: "https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=100&h=100&fit=crop",
    location: "Seattle, WA",
    remote: true,
    type: "Full-time",
    experience: "Senior",
    salary: { min: 130000, max: 170000, type: "year" },
    posted: "1 week ago",
    applications: 89,
    description: "Analyze complex datasets and build machine learning models to drive business insights. Work with large-scale data infrastructure.",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics"],
    benefits: ["Stock Options", "Health Insurance", "Conference Budget"],
    rating: 4.7,
    reviews: 78,
    featured: true,
    urgent: false
  },
  {
    id: 6,
    title: "Marketing Coordinator",
    company: "Growth Agency",
    companyLogo: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=100&h=100&fit=crop",
    location: "Chicago, IL",
    remote: false,
    type: "Full-time",
    experience: "Entry-level",
    salary: { min: 45000, max: 60000, type: "year" },
    posted: "5 days ago",
    applications: 201,
    description: "Support marketing campaigns and help grow our client base. Perfect opportunity for someone starting their marketing career.",
    skills: ["Marketing", "Social Media", "Analytics", "Communication"],
    benefits: ["Health Insurance", "Professional Development", "Team Events"],
    rating: 4.3,
    reviews: 167,
    featured: false,
    urgent: false
  }
];

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["All", "Entry-level", "Mid-level", "Senior", "Executive"];
const remoteOptions = ["All", "Remote", "On-site", "Hybrid"];
const salaryRanges = [
  { value: "all", label: "Any Salary" },
  { value: "0-50000", label: "Under $50k" },
  { value: "50000-80000", label: "$50k - $80k" },
  { value: "80000-120000", label: "$80k - $120k" },
  { value: "120000-200000", label: "$120k - $200k" },
  { value: "200000+", label: "$200k+" }
];

const sortOptions = [
  { value: "newest", label: "Most Recent" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
  { value: "rating", label: "Highest Rated" },
  { value: "applications", label: "Fewest Applications" }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedRemote, setSelectedRemote] = useState('All');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience;
    const matchesRemote = selectedRemote === 'All' || 
                         (selectedRemote === 'Remote' && job.remote) ||
                         (selectedRemote === 'On-site' && !job.remote);
    
    return matchesSearch && matchesType && matchesExperience && matchesRemote;
  });

  const formatSalary = (salary) => {
    if (salary.type === 'hour') {
      return `$${salary.min}-${salary.max}/hr`;
    } else {
      return `$${(salary.min / 1000).toFixed(0)}k-${(salary.max / 1000).toFixed(0)}k/year`;
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <img 
            src={job.companyLogo} 
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-xl text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                {job.title}
              </h3>
              {job.featured && (
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                  Featured
                </span>
              )}
              {job.urgent && (
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                  Urgent
                </span>
              )}
            </div>
            <div className="text-lg font-medium text-gray-700 mb-2">{job.company}</div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
                {job.remote && <span className="ml-1 text-blue-600">(Remote)</span>}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.type}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {job.experience}
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-2">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 5).map((skill, index) => (
          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
        {job.skills.length > 5 && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            +{job.skills.length - 5} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-600 mr-1" />
            <span className="font-semibold text-gray-900">{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm text-gray-600">{job.rating} ({job.reviews})</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {job.posted}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {job.applications} applications
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {job.benefits.slice(0, 3).map((benefit, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {benefit}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              +{job.benefits.length - 3} more
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            <Send className="w-4 h-4 mr-1" />
            Apply
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
            <p className="text-gray-600 text-lg">Discover opportunities from top companies and startups</p>
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
                placeholder="Search jobs, companies, skills, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Job Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Experience Level */}
              <div className="relative">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Remote */}
              <div className="relative">
                <select
                  value={selectedRemote}
                  onChange={(e) => setSelectedRemote(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {remoteOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Salary Range */}
              <div className="relative">
                <select
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {salaryRanges.map(range => (
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
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Type
                </label>
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={selectedExperience === level}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Work Location
                </label>
                <div className="space-y-2">
                  {remoteOptions.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="workLocation"
                        value={option}
                        checked={selectedRemote === option}
                        onChange={(e) => setSelectedRemote(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Salary Range
                </label>
                <div className="space-y-2">
                  {salaryRanges.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="salaryRange"
                        value={range.value}
                        checked={selectedSalary === range.value}
                        onChange={(e) => setSelectedSalary(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Features
                </label>
                <div className="space-y-2">
                  {[
                    'Remote Work Available',
                    'Featured Jobs',
                    'Urgent Hiring',
                    'High Salary ($100k+)',
                    'Stock Options',
                    'Health Insurance',
                    'Flexible Hours',
                    'Startup Environment'
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

              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Skills & Technologies
                </label>
                <div className="space-y-2">
                  {[
                    'React',
                    'JavaScript',
                    'Python',
                    'Node.js',
                    'TypeScript',
                    'SQL',
                    'AWS',
                    'Figma'
                  ].map(skill => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
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
                    placeholder="Search jobs, companies, skills, or locations..."
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
                Remote Only
              </button>
              <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                High Salary ($100k+)
              </button>
              <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                Featured Jobs
              </button>
              <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                Urgent Hiring
              </button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs found
              </div>
              <div className="text-sm text-gray-500">
                Updated 1 hour ago
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Jobs
              </button>
            </div>

            {/* Job Alerts */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Job Alerts</h3>
              <p className="text-gray-600 mb-4">Never miss your dream job. Get notified when new jobs match your criteria.</p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Results (only show on mobile) */}
        <div className="lg:hidden">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
              Remote Only
            </button>
            <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
              High Salary ($100k+)
            </button>
            <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
              Featured Jobs
            </button>
            <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
              Urgent Hiring
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs found
            </div>
            <div className="text-sm text-gray-500">
              Updated 1 hour ago
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Jobs
            </button>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Job Alerts</h3>
            <p className="text-gray-600 mb-4">Never miss your dream job. Get notified when new jobs match your criteria.</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;