'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options = { requireAuth: true }
) {
  return function WithAuthComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user && options.requireAuth) {
          router.push('/login');
        } else if (user && !options.requireAuth) {
          // Redirect away from login/signup pages if already authenticated
          router.push('/');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      );
    }

    if (!user && options.requireAuth) {
      return null;
    }

    if (user && !options.requireAuth) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
