import { useState, useEffect, FormEvent } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';

interface Creator {
  id: string;
  displayName: string;
  bio?: string;
  isAdult: boolean;
}

interface Tier {
  id: string;
  name: string;
  level: number;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  createdAt: string;
}

function DashboardPage() {
  const { token, user } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  // posts removed from dashboard; managed on Home
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'tiers' | 'posts'>('profile');
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  // Profile form
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isAdult, setIsAdult] = useState(false);

  // Tier form
  const [tierName, setTierName] = useState('');
  const [tierLevel, setTierLevel] = useState('1');

  // Post form
  // post-related UI moved to Home page

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    try {
      // Fetch creator profile
      const creatorRes = await fetch(`${API_URL}/creator`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (creatorRes.ok) {
        const creatorData = await creatorRes.json();
        setCreator(creatorData);
        setDisplayName(creatorData.displayName);
        setBio(creatorData.bio || '');
        setIsAdult(creatorData.isAdult);

        // Fetch tiers
        const tiersRes = await fetch(`${API_URL}/tier`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (tiersRes.ok) {
          const tiersData = await tiersRes.json();
          setTiers(tiersData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const method = creator ? 'PUT' : 'POST';
      const res = await fetch(`${API_URL}/creator`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName, bio, isAdult }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreator(data);
        alert('Profile saved!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleTierSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: tierName, level: parseInt(tierLevel) }),
      });
      if (res.ok) {
        const newTier = await res.json();
        setTiers([...tiers, newTier]);
        setTierName('');
        setTierLevel('1');
        alert('Tier created!');
      }
    } catch (error) {
      console.error('Failed to create tier:', error);
      alert('Failed to create tier');
    }
  };

  // post creation moved to Home page

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Creator Dashboard</h1>

        <div className="mb-8 flex gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 ${
              activeTab === 'tiers'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
          >
            Tiers
          </button>
        
        </div>

        {activeTab === 'profile' && (
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Settings</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded h-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAdult}
                  onChange={(e) => setIsAdult(e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">Adult Content</label>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div>
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Create Tier</h2>
              <form onSubmit={handleTierSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tier Name</label>
                  <input
                    type="text"
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g., Bronze, Silver, Gold"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Level</label>
                  <input
                    type="number"
                    value={tierLevel}
                    onChange={(e) => setTierLevel(e.target.value)}
                    min="1"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Create Tier
                </button>
              </form>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Your Tiers</h2>
              {tiers.length === 0 ? (
                <p className="text-gray-400">No tiers yet</p>
              ) : (
                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="bg-gray-800 p-4 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{tier.name}</h3>
                          <p className="text-gray-400 text-sm">Level {tier.level}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default withAuth(DashboardPage, { requireCreator: true });
