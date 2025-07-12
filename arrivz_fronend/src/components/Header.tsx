'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Bell, Mail, User, Briefcase, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/authHook';
import ClientOnly from '@/components/ClientOnly';

// Logo Component Props
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Component Props Interface
interface OnSettleNavbarProps {
  className?: string;
}

// Navigation links configuration
const navigationLinks = [
  { href: '/', label: 'Find work' },
  { href: '/jobs', label: 'Find talent' },
  { href: '/housing', label: 'Housing' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/lawyers', label: 'lawyers' },
  { href: '/community', label: 'community' },
] as const;

const browseMenuItems = [
  { href: '/opportunities', label: 'All opportunities' },
  { href: '/business', label: 'Business services' },
  { href: '/education', label: 'Education' },
  { href: '/roommates', label: 'Roommates' },
] as const;

const userMenuItems = [
  { href: '/profile', label: 'View profile', icon: User, iconColor: 'text-blue-600' },
  { href: '/my-listings', label: 'My opportunities', icon: Briefcase, iconColor: 'text-purple-600' },
  { href: '/settings', label: 'Settings', icon: Settings, iconColor: 'text-gray-600' },
  { href: '/help', label: 'Help', icon: HelpCircle, iconColor: 'text-gray-600' },
] as const;

// OnSettle Logo Component
const OnSettleLogo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  const textSizes: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-2xl'
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      bg-gradient-to-br from-blue-600 to-purple-600 
      rounded-xl flex items-center justify-center 
      relative overflow-hidden
      ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-xl" />
      <span className={`text-white font-black ${textSizes[size]} relative z-10 tracking-tight`}>
        OS
      </span>
    </div>
  );
};

// Main Navbar Component
const OnSettleNavbar: React.FC<OnSettleNavbarProps> = ({ className = '' }) => {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isHydrated, 
    logout,
    clearError 
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isBrowseMenuOpen, setIsBrowseMenuOpen] = useState<boolean>(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsUserMenuOpen(false);
        setIsBrowseMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = (): void => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = newState ? 'hidden' : '';
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      closeMobileMenu();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = (): void => {
    const currentPath = window.location.pathname;
    const redirectParam = currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
    router.push(`/login${redirectParam}`);
  };

  // Get user initials
  const getUserInitials = (): string => {
    if (!user) return '?';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return user.username.charAt(0).toUpperCase();
  };

  // Get display name
  const getDisplayName = (): string => {
    if (!user) return 'User';
    
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <OnSettleLogo size="md" />
                <div className="hidden xs:block">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">OnSettle</span>
                </div>
              </Link>
            </div>
            <div className="w-6 h-6 animate-pulse bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <ClientOnly>
      <>
        {/* Main Navigation */}
        <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm ${className}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              
              {/* Logo Section */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                  <OnSettleLogo 
                    size="md" 
                    className="group-hover:scale-105 transition-transform duration-200" 
                  />
                  <div className="hidden xs:block">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">OnSettle</span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                {navigationLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Browse Dropdown */}
                <div className="relative dropdown-container">
                  <button 
                    onClick={() => setIsBrowseMenuOpen(!isBrowseMenuOpen)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                    type="button"
                    aria-expanded={isBrowseMenuOpen}
                    aria-haspopup="true"
                  >
                    Browse
                    <ChevronDown className="ml-1 w-3 h-3" />
                  </button>
                  
                  {isBrowseMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {browseMenuItems.map((item) => (
                        <Link 
                          key={item.href}
                          href={item.href} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsBrowseMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">

                {isAuthenticated && user ? (
                  <>
                    {/* Notifications */}
                    <button 
                      className="hidden sm:block relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      type="button"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
                    </button>

                    {/* Messages */}
                    <button 
                      className="hidden sm:block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      type="button"
                      aria-label="Messages"
                    >
                      <Mail className="w-4 h-4" />
                    </button>

                    {/* User Menu */}
                    <div className="relative dropdown-container">
                      <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-1 sm:space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                        type="button"
                        aria-expanded={isUserMenuOpen}
                        aria-haspopup="true"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div className="hidden lg:block text-left">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-24">
                            {getDisplayName()}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-32">
                            {user.email}
                          </div>
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                      </button>
                      
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-1 w-56 sm:w-64 py-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : getDisplayName()
                              }
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          
                          {userMenuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <Link 
                                key={item.href}
                                href={item.href} 
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <IconComponent className={`mr-3 w-4 h-4 ${item.iconColor}`} />
                                {item.label}
                              </Link>
                            );
                          })}
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
                            type="button"
                          >
                            <LogOut className="mr-3 w-4 h-4 text-red-600" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Auth buttons */}
                    <button 
                      onClick={handleLoginRedirect}
                      className="text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors hidden sm:block"
                      type="button"
                    >
                      Log in
                    </button>
                    <Link 
                      href="/register" 
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors hidden sm:inline-flex"
                    >
                      Sign up
                    </Link>
                  </>
                )}

                {/* Post opportunity button */}
                <Link 
                  href="/listings/create" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors"
                >
                  Post
                </Link>

                {/* Mobile menu button */}
                <button 
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  type="button"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="flex flex-col h-full">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <OnSettleLogo size="lg" />
                    <span className="text-xl font-bold text-gray-900">OnSettle</span>
                  </div>
                  <button 
                    onClick={closeMobileMenu} 
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg"
                    type="button"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-6 space-y-6">
                  
                  {isAuthenticated && user && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {getDisplayName()}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  )}

                  {/* Navigation links */}
                  <div className="space-y-1">
                    {navigationLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link 
                      href="/opportunities" 
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Browse all
                    </Link>
                  </div>

                  {isAuthenticated && user && (
                    <div className="border-t border-gray-200 pt-6 space-y-1">
                      {userMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link 
                            key={item.href}
                            href={item.href} 
                            onClick={closeMobileMenu}
                            className="flex items-center px-4 py-3 text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <IconComponent className={`mr-3 w-5 h-5 ${item.iconColor}`} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu footer */}
              <div className="border-t border-gray-200 p-4 space-y-3">
                {isAuthenticated && user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    type="button"
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        handleLoginRedirect();
                        closeMobileMenu();
                      }}
                      className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      Log in
                    </button>
                    <Link 
                      href="/register" 
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </ClientOnly>
  );
};

export default OnSettleNavbar;