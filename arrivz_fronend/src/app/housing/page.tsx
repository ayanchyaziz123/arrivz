'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, ChevronDown, Bed, Bath, Square, Car, Wifi, Tv, Coffee, Dumbbell, Camera, Phone, Mail } from 'lucide-react';

// Sample housing data
const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 2850,
    priceType: "month",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    location: "Downtown San Francisco, CA",
    address: "123 Market St, San Francisco, CA 94105",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
    ],
    rating: 4.8,
    reviews: 42,
    landlord: "Premium Properties",
    amenities: ["Wifi", "Parking", "Gym", "Rooftop"],
    available: "Available Now",
    featured: true
  },
  {
    id: 2,
    title: "Cozy Studio in Brooklyn",
    price: 1800,
    priceType: "month",
    type: "Studio",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 600,
    location: "Brooklyn, NY",
    address: "456 Brooklyn Ave, Brooklyn, NY 11201",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    ],
    rating: 4.6,
    reviews: 28,
    landlord: "Brooklyn Living",
    amenities: ["Wifi", "Laundry", "Pet-friendly"],
    available: "Available Dec 15",
    featured: false
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    price: 4500,
    priceType: "month",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    location: "Manhattan, NY",
    address: "789 5th Ave, Manhattan, NY 10022",
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=300&fit=crop"
    ],
    rating: 4.9,
    reviews: 15,
    landlord: "Manhattan Elite",
    amenities: ["Concierge", "Gym", "Pool", "Parking"],
    available: "Available Jan 1",
    featured: true
  },
  {
    id: 4,
    title: "Shared House Room",
    price: 950,
    priceType: "month",
    type: "Room",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 300,
    location: "Austin, TX",
    address: "321 Cedar St, Austin, TX 78701",
    images: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    ],
    rating: 4.4,
    reviews: 33,
    landlord: "Austin Roomies",
    amenities: ["Wifi", "Kitchen", "Backyard"],
    available: "Available Now",
    featured: false
  },
  {
    id: 5,
    title: "Beachfront Condo",
    price: 3200,
    priceType: "month",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    location: "Santa Monica, CA",
    address: "654 Ocean Blvd, Santa Monica, CA 90401",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop"
    ],
    rating: 4.7,
    reviews: 19,
    landlord: "Coastal Living",
    amenities: ["Ocean View", "Balcony", "Gym"],
    available: "Available Feb 1",
    featured: true
  },
  {
    id: 6,
    title: "Student Housing Near Campus",
    price: 750,
    priceType: "month",
    type: "Dorm",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 400,
    location: "College Park, MD",
    address: "987 University Ave, College Park, MD 20742",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e460b1e5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    ],
    rating: 4.2,
    reviews: 67,
    landlord: "Campus Living",
    amenities: ["Study Room", "Wifi", "Laundry"],
    available: "Available Now",
    featured: false
  }
];

const propertyTypes = ["All", "Apartment", "Studio", "Penthouse", "Room", "Condo", "Dorm"];
const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-1000", label: "Under $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "2000-3000", label: "$2,000 - $3,000" },
  { value: "3000-5000", label: "$3,000 - $5,000" },
  { value: "5000+", label: "$5,000+" }
];

const bedrooms = ["Any", "Studio", "1+", "2+", "3+", "4+"];
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest rated" }
];

const Housing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || property.type === selectedType;
    const matchesBedrooms = selectedBedrooms === 'Any' || 
                           (selectedBedrooms === 'Studio' && property.bedrooms === 0) ||
                           (selectedBedrooms === '1+' && property.bedrooms >= 1) ||
                           (selectedBedrooms === '2+' && property.bedrooms >= 2) ||
                           (selectedBedrooms === '3+' && property.bedrooms >= 3) ||
                           (selectedBedrooms === '4+' && property.bedrooms >= 4);
    
    return matchesSearch && matchesType && matchesBedrooms;
  });

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Wifi': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Gym': <Dumbbell className="w-4 h-4" />,
      'TV': <Tv className="w-4 h-4" />,
      'Kitchen': <Coffee className="w-4 h-4" />,
      'Pool': <span className="w-4 h-4 text-xs">🏊</span>,
      'Balcony': <span className="w-4 h-4 text-xs">🏡</span>,
      'Ocean View': <span className="w-4 h-4 text-xs">🌊</span>
    };
    return icons[amenity] || <span className="w-4 h-4 text-xs">•</span>;
  };

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
        {property.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
          {property.images.length} photos
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              ${property.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per {property.priceType}</div>
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 ml-1">{property.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
            </div>
          )}
          {property.bedrooms === 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              Studio
            </div>
          )}
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            {property.sqft} sqft
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {property.rating} ({property.reviews} reviews)
            </span>
          </div>
          <span className="text-gray-400 mx-2">•</span>
          <span className="text-sm text-gray-600">{property.landlord}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-600 font-medium">
            {property.available}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4 text-gray-600" />
            </button>
            <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
            <p className="text-gray-600 text-lg">Discover apartments, rooms, and houses from trusted landlords</p>
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
                placeholder="Search by location, neighborhood, or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Property Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Bedrooms */}
              <div className="relative">
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bedrooms.map(bed => (
                    <option key={bed} value={bed}>
                      {bed} {bed !== 'Any' && bed !== 'Studio' ? 'Beds' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="relative">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
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
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Type
                </label>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="propertyType"
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

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bedrooms
                </label>
                <div className="space-y-2">
                  {bedrooms.map(bed => (
                    <label key={bed} className="flex items-center">
                      <input
                        type="radio"
                        name="bedrooms"
                        value={bed}
                        checked={selectedBedrooms === bed}
                        onChange={(e) => setSelectedBedrooms(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {bed} {bed !== 'Any' && bed !== 'Studio' ? 'Beds' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Monthly Rent
                </label>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={selectedPrice === range.value}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-2">
                  {[
                    'Wifi',
                    'Parking',
                    'Gym',
                    'Pool',
                    'Pet-friendly',
                    'Laundry',
                    'Balcony',
                    'Kitchen'
                  ].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    'Available Now',
                    'Within 30 days',
                    'Within 60 days',
                    'Future availability'
                  ].map(availability => (
                    <label key={availability} className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{availability}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Features
                </label>
                <div className="space-y-2">
                  {[
                    'Featured Properties',
                    'Recently Added',
                    'Virtual Tour Available',
                    'Photos Available'
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

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city, neighborhood..."
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
                    placeholder="Search by location, neighborhood, or property name..."
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

            {/* Map Toggle */}
            <div className="mb-6">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4 mr-2" />
                Show Map
              </button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties found
              </div>
              <div className="text-sm text-gray-500">
                Updated 2 hours ago
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Properties
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Results (only show on mobile) */}
        <div className="lg:hidden">
          {/* Map Toggle */}
          <div className="mb-6">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4 mr-2" />
              Show Map
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties found
            </div>
            <div className="text-sm text-gray-500">
              Updated 2 hours ago
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Housing;