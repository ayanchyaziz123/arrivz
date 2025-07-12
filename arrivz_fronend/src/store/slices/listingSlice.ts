// src/store/slices/listingSlice.ts - Clean slice with correct API endpoints
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  CategoryData, 
  CreateListingFormData,
  LocationData,
  ListingResponse
} from '../../types/listingType';

// API base URL - adjust this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(
  'listings/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching categories from:', `${API_BASE_URL}/api/listings/categories/`);
      const response = await fetch(`${API_BASE_URL}/api/listings/categories/`);
    
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Categories fetchedddd:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const fetchCountries = createAsyncThunk(
  'listings/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching countries from:', `${API_BASE_URL}/api/listings/countries/`);
      const response = await fetch(`${API_BASE_URL}/api/listings/countries/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Countries fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching countries:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch countries');
    }
  }
);

export const fetchStates = createAsyncThunk(
  'listings/fetchStates',
  async (countryId: string, { rejectWithValue }) => {
    try {
      if (!countryId) {
        return rejectWithValue('Country ID is required');
      }
      
      console.log('📡 Fetching states for country:', countryId);
      const response = await fetch(`${API_BASE_URL}/api/listings/countries/${countryId}/states/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ States fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching states:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch states');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'listings/fetchCities',
  async (stateId: string, { rejectWithValue }) => {
    try {
      if (!stateId) {
        return rejectWithValue('State ID is required');
      }
      
      console.log('📡 Fetching cities for state:', stateId);
      const response = await fetch(`${API_BASE_URL}/api/listings/states/${stateId}/cities/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Cities fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching cities:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cities');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (listingData: CreateListingFormData, { rejectWithValue }) => {
    try {
      console.log('📡 Creating listing:', listingData);
      
      const formData = new FormData();
      
      // Add basic fields
      Object.entries(listingData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle file uploads
          if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append('images', file);
              }
            });
          }
        } else if (key === 'categoryData') {
          // Handle category-specific data
          if (value && typeof value === 'object') {
            Object.entries(value).forEach(([categoryKey, categoryValue]) => {
              if (categoryValue !== null && categoryValue !== undefined) {
                formData.append(categoryKey, String(categoryValue));
              }
            });
          }
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/listings/listings/`, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header when using FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Listing created:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating listing:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create listing');
    }
  }
);

// State interface
interface ListingState {
  // Essential data
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  countries: LocationData[];
  states: LocationData[];
  cities: LocationData[];
  
  // Loading states
  categoriesLoading: boolean;
  locationsLoading: boolean;
  isCreating: boolean;
  
  // Errors
  error: string | null;
  createError: string | null;
  
  // Optional: for compatibility
  listings: ListingResponse[];
  currentListing: ListingResponse | null;
}

// Initial state
const initialState: ListingState = {
  categories: [],
  selectedCategory: null,
  countries: [],
  states: [],
  cities: [],
  
  categoriesLoading: false,
  locationsLoading: false,
  isCreating: false,
  
  error: null,
  createError: null,
  
  listings: [],
  currentListing: null,
};

// Create the slice
const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedCategory: (state, action: PayloadAction<CategoryData | null>) => {
      state.selectedCategory = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    
    resetStates: (state) => {
      state.states = [];
      state.cities = [];
    },
    
    resetCities: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload as string;
      });

    // Countries
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.locationsLoading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.locationsLoading = false;
        state.countries = action.payload;
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.locationsLoading = false;
        state.error = action.payload as string;
      });

    // States
    builder
      .addCase(fetchStates.pending, (state) => {
        state.locationsLoading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.locationsLoading = false;
        state.states = action.payload;
        state.cities = []; // Reset cities when states change
        state.error = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.locationsLoading = false;
        state.error = action.payload as string;
        state.states = [];
        state.cities = [];
      });

    // Cities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.locationsLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.locationsLoading = false;
        state.cities = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.locationsLoading = false;
        state.error = action.payload as string;
        state.cities = [];
      });

    // Create listing
    builder
      .addCase(createListing.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isCreating = false;
        state.listings.unshift(action.payload); // Add to beginning of list
        state.createError = null;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      });
  },
});

// Export actions
export const { 
  setSelectedCategory, 
  clearError, 
  resetStates, 
  resetCities 
} = listingSlice.actions;

// Export reducer
export default listingSlice.reducer;