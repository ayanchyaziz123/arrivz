'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, ChevronDown, Clock, DollarSign, Calendar, Users, Eye, User, Share2, Bookmark, CheckCircle, TrendingUp, Coffee, Briefcase, Music, Camera, Dumbbell, BookOpen, Utensils } from 'lucide-react';

// Sample events data
const events = [
  {
    id: 1,
    title: "SF Tech Networking Mixer",
    description: "Join us for an evening of networking with fellow tech professionals. Great opportunity to meet potential collaborators, mentors, and friends in the industry.",
    date: "2024-12-15",
    time: "6:00 PM - 9:00 PM",
    location: "WeWork SOMA, San Francisco, CA",
    address: "995 Market St, San Francisco, CA 94103",
    price: 25,
    capacity: 100,
    attendees: 67,
    organizer: {
      name: "TechConnect SF",
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.8,
      events: 23
    },
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    tags: ["Tech", "Networking", "Professional"],
    featured: true,
    online: false,
    difficulty: "All levels"
  },
  {
    id: 2,
    title: "Photography Workshop: Street Photography",
    description: "Learn the art of street photography with award-winning photographer John Smith. We'll cover composition, lighting, and capturing candid moments.",
    date: "2024-12-18",
    time: "10:00 AM - 4:00 PM",
    location: "Mission District, San Francisco, CA",
    address: "Mission Dolores Park area",
    price: 85,
    capacity: 15,
    attendees: 12,
    organizer: {
      name: "SF Photo Academy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.9,
      events: 45
    },
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop",
    tags: ["Photography", "Creative", "Workshop"],
    featured: false,
    online: false,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Startup Founders Coffee Chat",
    description: "Casual morning meetup for startup founders and aspiring entrepreneurs. Share experiences, challenges, and advice over coffee.",
    date: "2024-12-20",
    time: "8:00 AM - 10:00 AM",
    location: "Blue Bottle Coffee, Oakland, CA",
    address: "300 Webster St, Oakland, CA 94607",
    price: 0,
    capacity: 25,
    attendees: 18,
    organizer: {
      name: "Bay Area Entrepreneurs",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.7,
      events: 12
    },
    category: "Meetup",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
    tags: ["Startup", "Entrepreneurs", "Coffee"],
    featured: false,
    online: false,
    difficulty: "All levels"
  },
  {
    id: 4,
    title: "Yoga in the Park",
    description: "Start your weekend with a refreshing outdoor yoga session. All levels welcome. Bring your own mat and water bottle.",
    date: "2024-12-21",
    time: "9:00 AM - 10:30 AM",
    location: "Golden Gate Park, San Francisco, CA",
    address: "Near Japanese Tea Garden entrance",
    price: 15,
    capacity: 40,
    attendees: 28,
    organizer: {
      name: "SF Outdoor Fitness",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.6,
      events: 67
    },
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    tags: ["Yoga", "Fitness", "Outdoor"],
    featured: false,
    online: false,
    difficulty: "All levels"
  },
  {
    id: 5,
    title: "Virtual Book Club: 'The Midnight Library'",
    description: "Join our monthly book discussion via Zoom. This month we're discussing 'The Midnight Library' by Matt Haig. Great for remote participants!",
    date: "2024-12-22",
    time: "7:00 PM - 8:30 PM",
    location: "Online (Zoom)",
    address: "Link will be provided after registration",
    price: 0,
    capacity: 50,
    attendees: 34,
    organizer: {
      name: "Bay Area Book Lovers",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.8,
      events: 28
    },
    category: "Education",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    tags: ["Books", "Discussion", "Virtual"],
    featured: true,
    online: true,
    difficulty: "All levels"
  },
  {
    id: 6,
    title: "Food Truck Festival",
    description: "Sample delicious food from 20+ local food trucks. Live music, family-friendly activities, and great community vibes.",
    date: "2024-12-23",
    time: "11:00 AM - 6:00 PM",
    location: "Civic Center Plaza, San Francisco, CA",
    address: "355 McAllister St, San Francisco, CA 94102",
    price: 0,
    capacity: 500,
    attendees: 234,
    organizer: {
      name: "SF Food Events",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
      verified: true,
      rating: 4.7,
      events: 15
    },
    category: "Food",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
    tags: ["Food", "Festival", "Family"],
    featured: true,
    online: false,
    difficulty: "All levels"
  }
];

const categories = ["All", "Networking", "Workshop", "Meetup", "Fitness", "Education", "Food", "Music", "Art"];
const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "free", label: "Free" },
  { value: "0-25", label: "$1 - $25" },
  { value: "25-50", label: "$25 - $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100+", label: "$100+" }
];

const timeFilters = [
  { value: "all", label: "Any Time" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This Week" },
  { value: "this-weekend", label: "This Weekend" },
  { value: "next-week", label: "Next Week" }
];

const sortOptions = [
  { value: "date", label: "Upcoming Date" },
  { value: "popularity", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "distance", label: "Distance" }
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [savedEvents, setSavedEvents] = useState(new Set());

  const toggleSave = (eventId) => {
    const newSaved = new Set(savedEvents);
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId);
    } else {
      newSaved.add(eventId);
    }
    setSavedEvents(newSaved);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Networking': <Users className="w-4 h-4" />,
      'Workshop': <BookOpen className="w-4 h-4" />,
      'Meetup': <Coffee className="w-4 h-4" />,
      'Fitness': <Dumbbell className="w-4 h-4" />,
      'Education': <BookOpen className="w-4 h-4" />,
      'Food': <Utensils className="w-4 h-4" />,
      'Music': <Music className="w-4 h-4" />,
      'Art': <Camera className="w-4 h-4" />
    };
    return icons[category] || <Calendar className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={() => toggleSave(event.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart className={`w-4 h-4 ${savedEvents.has(event.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
        {event.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
        {event.online && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            Online Event
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
          {event.attendees}/{event.capacity} attending
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(event.category)}
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
              {event.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.date)} • {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <img 
            src={event.organizer.avatar} 
            alt={event.organizer.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700 font-medium">{event.organizer.name}</span>
          {event.organizer.verified && (
            <CheckCircle className="w-4 h-4 text-blue-600 ml-1" />
          )}
          <div className="flex items-center ml-auto text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            {event.organizer.rating} ({event.organizer.events} events)
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.map((tag, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {event.attendees} going
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {Math.floor(Math.random() * 500) + 100} views
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              Join Event
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Events</h1>
            <p className="text-gray-600 text-lg">Discover meetups, workshops, and networking events in your area</p>
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
                placeholder="Search events, organizers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Time */}
              <div className="relative">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Price */}
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
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Event Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Category
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="eventCategory"
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

              {/* Date & Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date & Time
                </label>
                <div className="space-y-2">
                  {timeFilters.map(filter => (
                    <label key={filter.value} className="flex items-center">
                      <input
                        type="radio"
                        name="eventTime"
                        value={filter.value}
                        checked={selectedTime === filter.value}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
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

              {/* Event Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Features
                </label>
                <div className="space-y-2">
                  {[
                    'Online Events',
                    'Featured Events',
                    'Free Events',
                    'Weekend Events',
                    'Beginner Friendly',
                    'Professional Networking',
                    'Hands-on Workshop',
                    'Certificate Provided'
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

              {/* Event Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Size
                </label>
                <div className="space-y-2">
                  {[
                    'Small (Under 25 people)',
                    'Medium (25-100 people)',
                    'Large (100-500 people)',
                    'Very Large (500+ people)'
                  ].map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        name="eventSize"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Organizer Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Organizer Type
                </label>
                <div className="space-y-2">
                  {[
                    'Verified Organizers',
                    'Top Rated (4.5+ stars)',
                    'Professional Organizations',
                    'Community Groups',
                    'Educational Institutions'
                  ].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
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
                    placeholder="Enter city or area..."
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
                    placeholder="Search events, organizers, or keywords..."
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
              <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                🆓 Free Events
              </button>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                📅 This Weekend
              </button>
              <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                💻 Online Events
              </button>
              <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                🔥 Featured
              </button>
              <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors">
                🏃‍♀️ Fitness
              </button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events found
              </div>
              <div className="text-sm text-gray-500">
                Updated 15 minutes ago
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Events
              </button>
            </div>

            {/* Create Event CTA */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Host Your Own Event</h3>
              <p className="text-gray-600 mb-4">Create and promote your own community events. Connect with like-minded people in your area.</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Results (only show on mobile) */}
        <div className="lg:hidden">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
              🆓 Free Events
            </button>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
              📅 This Weekend
            </button>
            <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
              💻 Online Events
            </button>
            <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
              🔥 Featured
            </button>
            <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors">
              🏃‍♀️ Fitness
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events found
            </div>
            <div className="text-sm text-gray-500">
              Updated 15 minutes ago
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Events
            </button>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Host Your Own Event</h3>
            <p className="text-gray-600 mb-4">Create and promote your own community events. Connect with like-minded people in your area.</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;