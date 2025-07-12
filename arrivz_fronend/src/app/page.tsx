'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Globe, X, Filter, Star, Plus, Briefcase, Home, Scale, Users, ShoppingCart, Heart, Search, TrendingUp, Award, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');

  const countries = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
  ];

  const usStates = [
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania',
    'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
    'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
    'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama'
  ];

  const origins = [
    { value: 'mx', label: '🇲🇽 Mexico' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'cn', label: '🇨🇳 China' },
    { value: 'ph', label: '🇵🇭 Philippines' },
    { value: 'vn', label: '🇻🇳 Vietnam' },
    { value: 'kr', label: '🇰🇷 South Korea' },
    { value: 'co', label: '🇨🇴 Colombia' },
    { value: 'br', label: '🇧🇷 Brazil' },
    { value: 'other', label: '🌍 Other' },
  ];

  const categories = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Jobs & Employment',
      description: 'Find work opportunities, visa sponsorship, and career resources',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      href: '/jobs',
      count: '12.5K+ listings',
      links: [
        { href: '/jobs?type=full-time', label: 'Full-time jobs', count: 2340 },
        { href: '/jobs?visa=true', label: 'Visa sponsorship', count: 890 },
        { href: '/jobs?remote=true', label: 'Remote opportunities', count: 670 },
        { href: '/jobs?entry-level=true', label: 'Entry level', count: 1120 },
      ]
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: 'Housing & Real Estate',
      description: 'Apartments, rooms, and homes from trusted landlords',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      href: '/housing',
      count: '8.9K+ properties',
      links: [
        { href: '/housing?type=apartment', label: 'Apartments', count: 1890 },
        { href: '/housing?no-credit=true', label: 'No credit check', count: 450 },
        { href: '/housing?furnished=true', label: 'Furnished rentals', count: 320 },
        { href: '/housing?shared=true', label: 'Shared housing', count: 560 },
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: 'Legal Services',
      description: 'Immigration lawyers, visa help, and legal assistance',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      href: '/lawyers',
      count: '340+ attorneys',
      links: [
        { href: '/lawyers?specialty=immigration', label: 'Immigration lawyers', count: 340 },
        { href: '/lawyers?specialty=visa', label: 'Visa assistance', count: 180 },
        { href: '/lawyers?free=true', label: 'Free consultations', count: 45 },
        { href: '/lawyers?language=spanish', label: 'Spanish speaking', count: 120 },
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Events',
      description: 'Meetups, workshops, and networking opportunities',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      href: '/community',
      count: '280+ events',
      links: [
        { href: '/community?type=networking', label: 'Networking events', count: 90 },
        { href: '/community?type=workshop', label: 'Workshops', count: 65 },
        { href: '/community?free=true', label: 'Free events', count: 120 },
        { href: '/community?online=true', label: 'Online events', count: 85 },
      ]
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: 'Marketplace',
      description: 'Buy and sell items from trusted community members',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      href: '/marketplace',
      count: '1.8K+ items',
      links: [
        { href: '/marketplace?category=furniture', label: 'Furniture', count: 320 },
        { href: '/marketplace?category=electronics', label: 'Electronics', count: 410 },
        { href: '/marketplace?category=appliances', label: 'Appliances', count: 210 },
        { href: '/marketplace?category=vehicles', label: 'Vehicles', count: 95 },
      ]
    }
  ];

  const cities = [
    { name: 'New York', jobs: 2340, housing: 890, legal: 120, community: 180 },
    { name: 'Los Angeles', jobs: 1890, housing: 1230, legal: 95, community: 150 },
    { name: 'Chicago', jobs: 1450, housing: 670, legal: 78, community: 120 },
    { name: 'Houston', jobs: 1120, housing: 560, legal: 65, community: 95 },
    { name: 'Miami', jobs: 980, housing: 780, legal: 89, community: 140 },
    { name: 'San Francisco', jobs: 890, housing: 450, legal: 67, community: 110 },
  ];

  const recentPosts = [
    {
      title: 'Software Engineer - Visa Sponsorship Available',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      salary: '$85,000-$120,000',
      timeAgo: '2h ago',
      type: 'job'
    },
    {
      title: '2BR Apartment - No Credit Check Required',
      company: 'Brooklyn Heights',
      location: '$2,200/month',
      salary: 'Pet friendly',
      timeAgo: '4h ago',
      type: 'housing'
    },
    {
      title: 'Tech Networking Mixer - SF',
      company: 'TechConnect SF',
      location: 'San Francisco, CA',
      salary: 'Free event',
      timeAgo: '6h ago',
      type: 'event'
    },
    {
      title: 'MacBook Pro M2 - Like New',
      company: 'Private Seller',
      location: 'Los Angeles, CA',
      salary: '$1,800',
      timeAgo: '8h ago',
      type: 'marketplace'
    },
  ];

  const featuredServices = [
    {
      name: 'Rodriguez Immigration Law',
      description: 'Immigration attorney • 15+ years experience • Spanish/English',
      rating: 4.9,
      reviews: 127,
      category: 'Legal'
    },
    {
      name: 'Global Skills Training Center',
      description: 'IT certification courses • Job placement assistance',
      rating: 4.8,
      reviews: 89,
      category: 'Education'
    },
    {
      name: 'New American Community Center',
      description: 'ESL classes • Cultural events • Family support',
      rating: 4.9,
      reviews: 203,
      category: 'Community'
    },
  ];

  const clearAllFilters = () => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedOrigin('');
  };

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCountry) {
      const country = countries.find(c => c.value === selectedCountry);
      filters.push({ type: 'country', label: `📍 ${country?.label.split(' ').slice(1).join(' ')}` });
    }
    if (selectedState) {
      filters.push({ type: 'state', label: `📍 ${selectedState}` });
    }
    if (selectedOrigin) {
      const origin = origins.find(o => o.value === selectedOrigin);
      filters.push({ type: 'origin', label: `🌍 From ${origin?.label.split(' ').slice(1).join(' ')}` });
    }
    return filters;
  };

  const showFilterStatus = selectedCountry || selectedState || selectedOrigin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Location & Origin Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between h-auto lg:h-12 py-2 lg:py-0 gap-4 lg:gap-0">
            {/* Left: Current Location */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Current Location:</span>
              </div>
              
              {/* Country */}
              <select 
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState('');
                }}
                className="h-8 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
              >
                <option value="">Country</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>

              {/* State/Province */}
              {selectedCountry === 'us' && (
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="h-8 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                >
                  <option value="">State/Province</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Right: Origin & Clear */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="text-green-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">From:</span>
              </div>
              
              {/* Origin Country */}
              <select 
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="h-8 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white min-w-[140px]"
              >
                <option value="">Select Origin</option>
                {origins.map(origin => (
                  <option key={origin.value} value={origin.value}>{origin.label}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button 
                onClick={clearAllFilters}
                className="h-8 px-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Status Bar */}
      {showFilterStatus && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <Filter className="text-blue-600 w-4 h-4" />
              <span className="text-blue-800">Active filters:</span>
              <div className="flex items-center space-x-2">
                {getActiveFilters().map((filter, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs gap-1">
                    {filter.label}
                    <button 
                      onClick={() => {
                        if (filter.type === 'country') {
                          setSelectedCountry('');
                          setSelectedState('');
                        } else if (filter.type === 'state') {
                          setSelectedState('');
                        } else if (filter.type === 'origin') {
                          setSelectedOrigin('');
                        }
                      }}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Welcome to Arrivz
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Your gateway to opportunities, housing, legal help, and community connections. 
            Built by immigrants, for immigrants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Find Jobs
            </Link>
            <Link 
              href="/housing" 
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Find Housing
            </Link>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to build your new life in America
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                href={category.href}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <div className={category.iconColor}>
                      {category.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">{category.count}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <div className="space-y-2">
                  {category.links.slice(0, 3).map((link, linkIndex) => (
                    <div key={linkIndex} className="flex justify-between text-sm">
                      <span className="text-gray-700">{link.label}</span>
                      <span className="text-gray-500">{link.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">Explore all</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cities.map((city, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-3">{city.name}</h3>
                <div className="space-y-2 text-sm">
                  <Link href={`/jobs?city=${city.name.toLowerCase()}`} className="block text-blue-600 hover:text-blue-700">
                    Jobs ({city.jobs.toLocaleString()})
                  </Link>
                  <Link href={`/housing?city=${city.name.toLowerCase()}`} className="block text-blue-600 hover:text-blue-700">
                    Housing ({city.housing.toLocaleString()})
                  </Link>
                  <Link href={`/lawyers?city=${city.name.toLowerCase()}`} className="block text-blue-600 hover:text-blue-700">
                    Legal ({city.legal})
                  </Link>
                  <Link href={`/community?city=${city.name.toLowerCase()}`} className="block text-blue-600 hover:text-blue-700">
                    Events ({city.community})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium mr-2 ${
                            post.type === 'job' ? 'bg-blue-100 text-blue-700' :
                            post.type === 'housing' ? 'bg-purple-100 text-purple-700' :
                            post.type === 'event' ? 'bg-orange-100 text-orange-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}>
                            {post.type}
                          </span>
                          <span className="text-xs text-gray-500">{post.timeAgo}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600">
                          {post.company} • {post.location} • {post.salary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link href="/recent" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all recent posts →
                  </Link>
                </div>
              </div>
            </div>

            {/* Featured Services */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Services</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                  {featuredServices.map((service, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Star className="w-5 h-5 text-yellow-600 fill-current" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center text-xs text-yellow-600">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="ml-1">{service.rating} ({service.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link href="/featured" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all featured services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by immigrants nationwide</h2>
            <p className="text-blue-200 text-lg">Real results from real people building new lives in America</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">125K+</div>
              <div className="text-blue-200">Immigrants helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">18K+</div>
              <div className="text-blue-200">Active listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Cities covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-blue-200">Average rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About Arrivz</h3>
              <p className="text-gray-600 mb-4">
                Connecting immigrants with opportunities, services, and community across America. 
                Built by immigrants, for immigrants.
              </p>
              <div className="flex space-x-4">
                <Link href="/about" className="text-blue-600 hover:text-blue-700">About us</Link>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact</Link>
                <Link href="/help" className="text-blue-600 hover:text-blue-700">Help</Link>
              </div>
            </div>
            
            {/* Safety & Tips */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Safety & Tips</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Always meet in public places</li>
                <li>• Verify credentials before paying</li>
                <li>• Trust your instincts</li>
                <li>• Report suspicious activity</li>
              </ul>
              <div className="mt-4">
                <Link href="/safety" className="text-blue-600 hover:text-blue-700">Safety guidelines</Link>
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Immigration Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    USCIS official website
                  </a>
                </li>
                <li>
                  <Link href="/legal-aid" className="hover:text-blue-600">Free legal aid directory</Link>
                </li>
                <li>
                  <Link href="/learn-english" className="hover:text-blue-600">English learning resources</Link>
                </li>
                <li>
                  <Link href="/job-tips" className="hover:text-blue-600">Job search tips for immigrants</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Post Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link 
          href="/create" 
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;