// hooks/useAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/authHook';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
}

/**
 * Hook for protecting routes based on authentication status
 * 
 * @param options - Configuration options
 * @returns Loading state and authentication status
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    redirectTo = '/login',
    requireAuth = true,
    redirectIfAuthenticated = false,
  } = options;

  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuth();

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const currentPath = window.location.pathname;

    if (requireAuth && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
      router.replace(`${redirectTo}${returnUrl}`);
      return;
    }

    if (redirectIfAuthenticated && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.replace(redirectUrl);
      return;
    }
  }, [isAuthenticated, isHydrated, requireAuth, redirectIfAuthenticated, redirectTo, router]);

  return {
    isLoading: !isHydrated,
    isAuthenticated,
    user,
  };
};

/**
 * Hook for protecting pages that require authentication
 */
export const useRequireAuth = (redirectTo?: string) => {
  return useAuthGuard({
    requireAuth: true,
    redirectTo,
  });
};

/**
 * Hook for pages that should redirect if user is already authenticated (login, register)
 */
export const useRedirectIfAuthenticated = (redirectTo?: string) => {
  return useAuthGuard({
    requireAuth: false,
    redirectIfAuthenticated: true,
    redirectTo,
  });
};