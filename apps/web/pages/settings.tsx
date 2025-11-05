import { useState, FormEvent, useEffect, useState as useStateAlias } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'

const LanguageSwitcher = dynamic(() => import('../components/LanguageSwitcher'), { ssr: false })

function SettingsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  const handleBecomeCreator = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!confirm('Do you want to become a creator? This will allow you to upload content and manage subscriptions.')) {
      return;
    }

    setLoading(true);
    try {
      // Create creator profile
      const res = await fetch(`${API_URL}/creator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: user?.email?.split('@')[0] || 'Creator',
          bio: 'New creator on AnonyPlace!',
          isAdult: false,
        }),
      });

      if (res.ok) {
        alert('Successfully became a creator! 🎉\n\nPlease log in again to access your dashboard.');
        // Log out and redirect to login to get new token with updated role
        logout();
      } else {
        const error = await res.json();
        if (res.status === 409) {
          // User already has a creator profile
          alert('You already have a creator profile!\n\nPlease log in again to access your dashboard.');
          logout();
        } else {
          alert(`Failed to create creator profile: ${error.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Failed to become creator:', error);
      alert('Failed to create creator profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-dark-border">
                  <div>
                    <h3 className="text-white font-medium">Language</h3>
                    <p className="text-gray-400 text-sm">Choose your preferred language</p>
                  </div>
                  <div>
                    <LanguageSwitcher />
                  </div>
                </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Role</label>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium capitalize">{user?.role?.toLowerCase()}</p>
                  {user?.role === 'CREATOR' && (
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-semibold">
                      ✓ Verified Creator
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Become Creator */}
          {user?.role !== 'CREATOR' && (
            <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/30 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">✨ Become a Creator</h2>
              <p className="text-gray-300 mb-4">
                Create your own content and build your community. As a creator, you'll be able to:
              </p>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Upload exclusive videos and photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Create subscription tiers for your fans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Manage your subscribers and engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Earn money from your content</span>
                </li>
              </ul>
              <form onSubmit={handleBecomeCreator}>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Become a Creator →'}
                </button>
              </form>
            </div>
          )}

          {/* Preferences */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-dark-border">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive notifications about new posts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-white font-medium">Show Adult Content</h3>
                  <p className="text-gray-400 text-sm">Display 18+ content in feeds</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-dark-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">⚠️ Danger Zone</h2>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);
