'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedPageProps {
  children: React.ReactNode;
}

/**
 * Wraps a page to require authentication.
 * Checks if user has a valid session by calling the auth/check endpoint.
 * Redirects to login if not authenticated.
 */
export default function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Call the auth check endpoint which reads the session_id cookie server-side
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            // User is authenticated
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        }

        // Not authenticated, redirect to login
        router.push('/login');
      } catch (err) {
        console.error('Auth check failed:', err);
        // On error, assume not authenticated
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Show nothing while checking authentication
  if (isChecking) {
    return null;
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
