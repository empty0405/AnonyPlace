import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Icons } from './Icons';

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
            <Icons.Home className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>

        <Link href="/search">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/search') ? 'text-primary' : 'text-gray-400'
          }`}>
            <Icons.Search className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1">Search</span>
          </div>
        </Link>

        <Link href="/subscriptions">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/subscriptions') ? 'text-primary' : 'text-gray-400'
          }`}>
            <Icons.Bookmark className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1">Subs</span>
          </div>
        </Link>

        <Link href="/notifications">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/notifications') ? 'text-primary' : 'text-gray-400'
          }`}>
            <Icons.Bell className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1">Activity</span>
          </div>
        </Link>

        <Link href={user.role === 'CREATOR' && user.creatorId ? `/creator/${user.creatorId}` : '/settings'}>
          <div className={`flex flex-col items-center justify-center w-16 h-full ${
            isActive('/dashboard') || isActive('/settings') || router.pathname.startsWith('/creator') ? 'text-primary' : 'text-gray-400'
          }`}>
            <Icons.User className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
