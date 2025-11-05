import { useState, useEffect } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

interface Membership {
  id: string;
  status: string;
  expiresAt: string;
  creator: {
    id: string;
    displayName: string;
    bio?: string;
  };
  tier: {
    id: string;
    name: string;
    level: number;
  };
}

function SubscriptionsPage() {
  const { token } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API_URL}/membership/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMemberships(data);
      }
    } catch (error) {
      console.error('Failed to fetch memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (membershipId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/membership/${membershipId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Subscription cancelled successfully');
        fetchMemberships();
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Failed to cancel membership:', error);
      alert('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-6">My Subscriptions</h1>

        {memberships.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-400 text-xl mb-4">No active subscriptions</p>
            <Link href="/creators">
              <button className="btn-primary">Browse Creators</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership) => (
              <div key={membership.id} className="card flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Link href={`/creator/${membership.creator.id}`}>
                    <h3 className="text-xl font-semibold text-white hover:text-primary cursor-pointer mb-2">
                      {membership.creator.displayName}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mb-3">
                    {membership.creator.bio?.substring(0, 120) || 'No bio'}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 bg-primary text-black rounded-full text-sm font-medium">
                      {membership.tier.name}
                    </span>
                    <span className="text-gray-500">Level {membership.tier.level}</span>
                    <span className="text-gray-500">Expires: {new Date(membership.expiresAt).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${membership.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                      {membership.status}
                    </span>
                  </div>
                </div>
                {membership.status === 'ACTIVE' && (
                  <button onClick={() => handleCancel(membership.id)} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(SubscriptionsPage);
