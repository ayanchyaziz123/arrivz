// store/index.ts - Fixed imports
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from './slices/authSlice';
import listingReducer from './slices/listingSlice'; // Default import

// Auth persist configuration
const authPersistConfig = {
  key: 'arrivz-auth',
  storage,
  whitelist: ['user', 'token', 'refreshToken'], // Only persist specific fields
  blacklist: ['isLoading', 'error'], // Don't persist loading states
};

// Listings persist configuration (optional - you might not want to persist all listings data)
const listingsPersistConfig = {
  key: 'arrivz-listings',
  storage,
  whitelist: ['categories', 'countries'], // Only persist static data that doesn't change often
  blacklist: [
    'listings', 
    'currentListing', 
    'userListings', 
    'isLoading', 
    'isCreating', 
    'isUpdating', 
    'error', 
    'createError', 
    'updateError',
    'states', 
    'cities', // These change based on user selection
    'categoryFields', // This changes based on selected category
  ],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);
const persistedListingsReducer = persistReducer(listingsPersistConfig, listingReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    listings: persistedListingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Alternative simpler configuration without persistence for listings
// (uncomment this and comment the above if you want simpler setup)
/*
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    listings: listingReducer, // No persistence for listings
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
*/