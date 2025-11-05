import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function MobileNav() {
  const { user } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link href="/feed">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/feed') ? 'text-primary' : 'text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>

        <Link href="/search">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/search') ? 'text-primary' : 'text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs mt-1">Search</span>
          </div>
        </Link>

        <Link href="/subscriptions">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/subscriptions') ? 'text-primary' : 'text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs mt-1">Subs</span>
          </div>
        </Link>

        <Link href="/notifications">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/notifications') ? 'text-primary' : 'text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-xs mt-1">Activity</span>
          </div>
        </Link>

        <Link href={user.role === 'CREATOR' && user.creatorId ? `/creator/${user.creatorId}` : '/settings'}>
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/dashboard') || isActive('/settings') || router.pathname.startsWith('/creator') ? 'text-primary' : 'text-gray-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
