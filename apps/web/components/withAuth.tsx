import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireCreator?: boolean } = {}
) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/');
        } else if (options.requireCreator && user.role !== 'CREATOR') {
          router.push('/');
        }
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }

    if (options.requireCreator && user.role !== 'CREATOR') {
      return null;
    }

    return <Component {...props} />;
  };
}
