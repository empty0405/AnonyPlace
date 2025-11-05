import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), { ssr: false })

export default function Header() {
  const { user, logout, token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    if (user && token) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/unread`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/patreon`;
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-card border-b border-dark-border backdrop-blur-lg bg-opacity-95">
      <div className="max-w-8xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Only show on auth pages or mobile when sidebar is hidden */}
        <Link href="/" className="flex items-center gap-2 md:hidden lg:flex">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            AnonyPlace
          </span>
        </Link>

        {/* Search Bar - Center for logged in users */}
        {user && (
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search creators, posts..."
                className="w-full bg-dark-hover border border-dark-border rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4">
                {/* Create Post Button */}
                <button className="p-2 text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                {/* Messages */}
                <button className="p-2 text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>

                {/* Notification Bell */}
                <Link href="/notifications">
                  <button className="relative p-2 text-gray-400 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* Language switcher */}
                <LanguageSwitcher />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-dark-hover transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user.email[0].toUpperCase()}
                    </div>
                  </button>
                  
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl py-2 z-50">
                      {user.role === 'CREATOR' && (
                        <>
                          <Link href={user.creatorId ? `/creator/${user.creatorId}` : '/dashboard'} className="block px-4 py-2 text-gray-300 hover:bg-dark-hover hover:text-white">
                            My Profile
                          </Link>
                          <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-dark-hover hover:text-white">
                            Dashboard
                          </Link>
                          <div className="border-t border-dark-border my-1"></div>
                        </>
                      )}
                      <Link href="/settings" className="block px-4 py-2 text-gray-300 hover:bg-dark-hover hover:text-white">
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-hover hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition"
            >
              Login with Patreon
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && user && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <div className="px-4 py-4 space-y-3">
            <Link href="/feed" className="block text-gray-300 hover:text-white py-2">
              Feed
            </Link>
            <Link href="/creators" className="block text-gray-300 hover:text-white py-2">
              Creators
            </Link>
            {user.role === 'CREATOR' && (
              <>
                <Link href={user.creatorId ? `/creator/${user.creatorId}` : '/dashboard'} className="block text-gray-300 hover:text-white py-2">
                  My Profile
                </Link>
                <Link href="/dashboard" className="block text-gray-300 hover:text-white py-2">
                  Dashboard
                </Link>
              </>
            )}
            <Link href="/settings" className="block text-gray-300 hover:text-white py-2">
              Settings
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left text-gray-300 hover:text-white py-2"
            >
              Logout
            </button>
            {/* Mobile language switcher */}
            <div className="pt-2">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

