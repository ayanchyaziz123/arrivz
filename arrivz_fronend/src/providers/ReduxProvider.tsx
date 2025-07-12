// providers/ReduxProvider.tsx
'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { setHydrated } from '@/store/slices/authSlice';

interface ReduxProviderProps {
  children: ReactNode;
}

// Loading component for PersistGate
const PersistLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden mx-auto mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-2xl" />
        <span className="text-white font-black text-xl relative z-10 tracking-tight">Az</span>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600 text-sm">Loading Arrivz...</p>
    </div>
  </div>
);

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Dispatch hydration complete after initial render
      const timer = setTimeout(() => {
        store.dispatch(setHydrated());
      }, 100);

      initialized.current = true;

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}