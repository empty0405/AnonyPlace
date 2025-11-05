import { useState, useEffect } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  created_at: string;
}

function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'NEW_POST':
        return '📝';
      case 'NEW_COMMENT':
        return '💬';
      case 'NEW_LIKE':
        return '❤️';
      default:
        return '🔔';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-9 h-9 bg-red-600 text-white text-base rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-primary">
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-400 text-xl mb-2">No notifications yet</p>
            <p className="text-gray-500">You'll see notifications here when creators you follow post new content</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 ${notification.isRead ? 'bg-dark-card' : 'bg-dark-hover border-l-4 border-primary'}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{getTypeIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{notification.title}</h3>
                        <p className="text-gray-300 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                      </div>
                      {!notification.isRead && (
                        <button onClick={() => markAsRead(notification.id)} className="text-sm text-primary hover:text-primary-dark">
                          Mark as read
                        </button>
                      )}
                    </div>
                    {notification.link && (
                      <Link href={notification.link}>
                        <button className="mt-3 btn-primary text-sm">View</button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(NotificationsPage);
