import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  // If user is logged in, redirect to feed
  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/patreon`;
  };

  // Show loading or redirect if user is logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting to feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500 opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to AnonyPlace
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Connect with creators and access exclusive content from the people you love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg rounded-full font-semibold transition shadow-lg shadow-primary/50"
            >
              Get Started with Patreon
            </button>
            <Link href="/test-login">
              <button className="px-8 py-4 bg-dark-card hover:bg-dark-hover border border-dark-border text-white text-lg rounded-full font-semibold transition">
                🧪 Test Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary transition">
            <div className="text-5xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold mb-3">Exclusive Content</h3>
            <p className="text-gray-400">
              Access premium videos, photos, and live streams from your favorite creators
            </p>
          </div>
          
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary transition">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold mb-3">Tiered Memberships</h3>
            <p className="text-gray-400">
              Subscribe to different tiers for varying levels of exclusive access
            </p>
          </div>
          
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary transition">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-3">Private & Secure</h3>
            <p className="text-gray-400">
              Your data and content are protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-100 mb-8">
            Join thousands of fans supporting their favorite creators
          </p>
          <button
            onClick={handleLogin}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-primary text-lg rounded-full font-semibold transition"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
}

