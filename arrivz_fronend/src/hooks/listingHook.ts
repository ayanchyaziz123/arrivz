// src/hooks/listingHook.ts - Clean hooks file
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store';
import {
  fetchCategories,
  fetchCountries,
  fetchStates,
  fetchCities,
  createListing,
  setSelectedCategory,
  clearError,
} from '../store/slices/listingSlice';
import type {
  CategoryData,
  CreateListingFormData,
} from '../types/listingType';

// Basic hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Main useCreateListing hook
export const useCreateListing = () => {
  const dispatch = useAppDispatch();
  
  // Select state from your slice
  const {
    categories,
    selectedCategory,
    countries,
    states,
    cities,
    categoriesLoading,
    locationsLoading,
    isCreating,
    createError,
    error
  } = useAppSelector((state) => ({
    categories: state.listings.categories || [],
    selectedCategory: state.listings.selectedCategory,
    countries: state.listings.countries || [],
    states: state.listings.states || [],
    cities: state.listings.cities || [],
    categoriesLoading: state.listings.categoriesLoading,
    locationsLoading: state.listings.locationsLoading,
    isCreating: state.listings.isCreating,
    createError: state.listings.createError,
    error: state.listings.error,
  }));

  // Action creators
  const loadCategories = useCallback(() => {
    console.log('🔄 Loading categories...');
    return dispatch(fetchCategories());
  }, [dispatch]);

  const loadCountries = useCallback(() => {
    console.log('🔄 Loading countries...');
    return dispatch(fetchCountries());
  }, [dispatch]);

  const loadStates = useCallback((countryId: string) => {
    console.log('🔄 Loading states for country:', countryId);
    if (!countryId) {
      console.warn('⚠️ No country ID provided');
      return;
    }
    return dispatch(fetchStates(countryId));
  }, [dispatch]);

  const loadCities = useCallback((stateId: string) => {
    console.log('🔄 Loading cities for state:', stateId);
    if (!stateId) {
      console.warn('⚠️ No state ID provided');
      return;
    }
    return dispatch(fetchCities(stateId));
  }, [dispatch]);

  const selectCategory = useCallback((category: CategoryData | null) => {
    console.log('🎯 Selecting category:', category?.name || 'None');
    dispatch(setSelectedCategory(category));
  }, [dispatch]);

  const createNewListing = useCallback(async (listingData: CreateListingFormData) => {
    console.log('🚀 Creating listing...');
    const result = await dispatch(createListing(listingData));
    
    // Return format expected by your form
    if (createListing.fulfilled.match(result)) {
      return { 
        payload: result.payload, 
        meta: { requestStatus: 'fulfilled' } 
      };
    } else {
      return { 
        payload: null, 
        meta: { requestStatus: 'rejected' },
        error: result.payload 
      };
    }
  }, [dispatch]);

  const clearListingError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Debug logging
  console.log('=== useCreateListing Debug ===');
  console.log('Categories:', categories?.length || 0);
  console.log('Countries:', countries?.length || 0);
  console.log('States:', states?.length || 0);
  console.log('Cities:', cities?.length || 0);
  console.log('Selected Category:', selectedCategory?.name || 'None');
  console.log('Categories Loading:', categoriesLoading);
  console.log('Locations Loading:', locationsLoading);
  console.log('Is Creating:', isCreating);
  console.log('===============================');

  return {
    // State
    categories,
    selectedCategory,
    countries,
    states,
    cities,
    isCreating,
    categoriesLoading,
    locationsLoading,
    createError,
    error,
    
    // Actions
    createListing: createNewListing,
    loadCategories,
    loadCountries,
    loadStates,
    loadCities,
    selectCategory,
    clearError: clearListingError,
  };
};

// Export as default
export default useCreateListing;