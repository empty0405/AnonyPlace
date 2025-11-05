import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Icons } from './Icons';

export default function Sidebar() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
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

  const isActive = (path: string) => router.pathname === path;

  const NavItem = ({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) => (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-6 py-3 rounded-lg mx-4 mb-2 transition-all duration-200 ${
        isActive(href) 
          ? 'bg-primary text-white shadow-lg shadow-primary/25' 
          : 'text-gray-400 hover:text-white hover:bg-dark-hover'
      }`}>
        <div className="w-6 h-6 flex-shrink-0">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
        {badge && badge > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[20px] text-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
    </Link>
  );

  if (!user) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border z-30 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-white">AnonyPlace</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="py-6">
        <NavItem
          href="/feed"
          icon={<Icons.Home className="w-full h-full" strokeWidth={2} />}
          label="Home"
        />
        
        <NavItem
          href="/notifications"
          icon={<Icons.Bell className="w-full h-full" strokeWidth={2} />}
          label="Notifications"
          badge={unreadCount}
        />
        
        <NavItem
          href="/creators"
          icon={<Icons.Users className="w-full h-full" strokeWidth={2} />}
          label="Creators"
        />
        
        <NavItem
          href="/subscriptions"
          icon={<Icons.Heart className="w-full h-full" strokeWidth={2} />}
          label="Subscriptions"
        />
        
        <NavItem
          href="/search"
          icon={<Icons.Search className="w-full h-full" strokeWidth={2} />}
          label="Search"
        />

        {user.role === 'CREATOR' && (
          <>
            <div className="mx-4 my-4 border-t border-dark-border"></div>
            <NavItem
              href={user.creatorId ? `/creator/${user.creatorId}` : '/dashboard'}
              icon={<Icons.User className="w-full h-full" strokeWidth={2} />}
              label="My Profile"
            />
            
            <NavItem
              href="/dashboard"
              icon={<Icons.ChartBar className="w-full h-full" strokeWidth={2} />}
              label="Dashboard"
            />
          </>
        )}
        
        <div className="mx-4 my-4 border-t border-dark-border"></div>
        
        <NavItem
          href="/settings"
          icon={<Icons.Settings className="w-full h-full" strokeWidth={2} />}
          label="Settings"
        />
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border bg-dark-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
            {user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}