// components/ClientOnly.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component prevents hydration mismatches by only rendering
 * children on the client side after the component has mounted.
 * 
 * This is particularly useful for components that:
 * - Access localStorage/sessionStorage
 * - Use dynamic content that differs between server and client
 * - Depend on client-side only APIs
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}