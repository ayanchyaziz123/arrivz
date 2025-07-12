'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, ChevronDown, Shield, Clock, Award } from 'lucide-react';

// Sample product data with seller focus
const products = [
  {
    id: 1,
    title: "MacBook Pro 14-inch M2",
    price: 1899,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    seller: {
      name: "TechDeals Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      rating: 4.8,
      totalReviews: 124,
      verified: true,
      memberSince: "2019",
      totalSales: 340,
      responseTime: "Within 2 hours",
      badges: ["Top Seller", "Verified"]
    },
    category: "Electronics"
  },
  {
    id: 2,
    title: "Vintage Leather Sofa",
    price: 750,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    seller: {
      name: "HomeStyle Co",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop",
      rating: 4.9,
      totalReviews: 89,
      verified: true,
      memberSince: "2020",
      totalSales: 156,
      responseTime: "Within 4 hours",
      badges: ["Verified", "Fast Shipper"]
    },
    category: "Furniture"
  },
  {
    id: 3,
    title: "Professional Camera Kit",
    price: 2200,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    seller: {
      name: "PhotoGear Plus",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
      rating: 4.7,
      totalReviews: 203,
      verified: true,
      memberSince: "2018",
      totalSales: 567,
      responseTime: "Within 1 hour",
      badges: ["Top Seller", "Expert", "Verified"]
    },
    category: "Photography"
  },
  {
    id: 4,
    title: "Gaming Setup Complete",
    price: 1500,
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=300&fit=crop",
    seller: {
      name: "GameZone",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop",
      rating: 4.6,
      totalReviews: 67,
      verified: false,
      memberSince: "2021",
      totalSales: 89,
      responseTime: "Within 6 hours",
      badges: ["Fast Shipper"]
    },
    category: "Electronics"
  },
  {
    id: 5,
    title: "Handmade Wooden Table",
    price: 450,
    location: "Portland, OR",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
    seller: {
      name: "Craftwood Studio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      rating: 4.9,
      totalReviews: 145,
      verified: true,
      memberSince: "2017",
      totalSales: 234,
      responseTime: "Within 3 hours",
      badges: ["Artisan", "Verified", "Top Seller"]
    },
    category: "Furniture"
  },
  {
    id: 6,
    title: "Designer Bike - Like New",
    price: 890,
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1558618644-fcd25c85cd64?w=400&h=300&fit=crop",
    seller: {
      name: "CycleWorld",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop",
      rating: 4.8,
      totalReviews: 78,
      verified: true,
      memberSince: "2020",
      totalSales: 123,
      responseTime: "Within 2 hours",
      badges: ["Verified", "Sports Expert"]
    },
    category: "Sports"
  },
  {
    id: 7,
    title: "Art Collection Bundle",
    price: 320,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    seller: {
      name: "ArtSpace Gallery",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      rating: 4.5,
      totalReviews: 34,
      verified: true,
      memberSince: "2022",
      totalSales: 45,
      responseTime: "Within 8 hours",
      badges: ["Verified", "Art Expert"]
    },
    category: "Art"
  },
  {
    id: 8,
    title: "Professional Microphone",
    price: 280,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop",
    seller: {
      name: "AudioPro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
      rating: 4.7,
      totalReviews: 156,
      verified: true,
      memberSince: "2019",
      totalSales: 289,
      responseTime: "Within 1 hour",
      badges: ["Top Seller", "Audio Expert", "Verified"]
    },
    category: "Electronics"
  }
];

const categories = ["All", "Electronics", "Furniture", "Photography", "Sports", "Art"];
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest rated" }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </div>
        
        {/* Seller Information */}
        <div className="flex items-center mb-3">
          <img 
            src={product.seller.avatar} 
            alt={product.seller.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">{product.seller.name}</span>
              {product.seller.verified && (
                <Shield className="w-4 h-4 text-blue-600 ml-1" />
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{product.seller.rating}</span>
              <span className="mx-1">•</span>
              <span>{product.seller.totalReviews} reviews</span>
            </div>
          </div>
        </div>
        
        {/* Seller Stats */}
        {/* <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Sales:</span>
              <span className="font-medium text-gray-700 ml-1">{product.seller.totalSales}</span>
            </div>
            <div>
              <span className="text-gray-500">Since:</span>
              <span className="font-medium text-gray-700 ml-1">{product.seller.memberSince}</span>
            </div>
            <div className="col-span-2">
              <div className="flex items-center">
                <Clock className="w-3 h-3 text-gray-400 mr-1" />
                <span className="text-gray-600">{product.seller.responseTime}</span>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Seller Badges */}
        {/* <div className="flex flex-wrap gap-1 mb-3">
          {product.seller.badges.map((badge, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full font-medium ${
              badge === 'Top Seller' ? 'bg-yellow-100 text-yellow-800' :
              badge === 'Verified' ? 'bg-blue-100 text-blue-800' :
              badge === 'Expert' ? 'bg-purple-100 text-purple-800' :
              badge === 'Artisan' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-700'
            }`}>
              {badge === 'Top Seller' && <Award className="w-3 h-3 inline mr-1" />}
              {badge}
            </span>
          ))}
        </div> */}
        
        <div className="flex items-center mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 ml-1">{product.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </div>
          <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
            View
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-600 text-lg">Discover amazing products from trusted sellers</p>
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
                placeholder="Search products or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Any Price' },
                    { value: '0-100', label: 'Under $100' },
                    { value: '100-500', label: '$100 - $500' },
                    { value: '500-1000', label: '$500 - $1,000' },
                    { value: '1000-2000', label: '$1,000 - $2,000' },
                    { value: '2000+', label: '$2,000+' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seller Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seller Rating
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Any Rating' },
                    { value: '4.5+', label: '4.5+ Stars' },
                    { value: '4.0+', label: '4.0+ Stars' },
                    { value: '3.5+', label: '3.5+ Stars' }
                  ].map(rating => (
                    <label key={rating.value} className="flex items-center">
                      <input
                        type="radio"
                        name="sellerRating"
                        value={rating.value}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seller Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seller Features
                </label>
                <div className="space-y-2">
                  {[
                    'Verified Sellers Only',
                    'Top Sellers',
                    'Fast Response',
                    'Expert Sellers'
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
                    placeholder="Search products or locations..."
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

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Products
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Results (only show on mobile) */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;