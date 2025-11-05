import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icons } from './Icons';

interface Creator {
  id: string;
  displayName: string;
  description?: string;
  _count?: {
    posts: number;
    memberships: number;
  };
}

interface TrendingPost {
  id: string;
  title: string;
  thumbnailUrl?: string;
  creator: {
    displayName: string;
  };
  _count?: {
    likes: number;
  };
}

export default function RightSidebar() {
  const { token } = useAuth();
  const [suggestedCreators, setSuggestedCreators] = useState<Creator[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    fetchSuggestedCreators();
    fetchTrendingPosts();
  }, []);

  const fetchSuggestedCreators = async () => {
    try {
      const res = await fetch(`${API_URL}/creators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCreators(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch suggested creators:', error);
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts?trending=true&limit=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTrendingPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch trending posts:', error);
    }
  };

  return (
    <div className="w-80 p-6 space-y-6">
      {/* Suggested Creators */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Suggested for you</h3>
          <Link href="/creators">
            <button className="text-primary hover:text-primary-light text-sm font-medium">
              See all
            </button>
          </Link>
        </div>
        <div className="space-y-4">
          {suggestedCreators.map((creator) => (
            <div key={creator.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-semibold text-white">
                {creator.displayName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/creator/${creator.id}`}>
                  <p className="font-medium text-white truncate hover:text-primary transition cursor-pointer">
                    {creator.displayName}
                  </p>
                </Link>
                <p className="text-sm text-gray-400">
                  {creator._count?.posts || 0} posts • {creator._count?.memberships || 0} fans
                </p>
              </div>
              <Link href={`/creator/${creator.id}`}>
                <button className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-full font-medium transition">
                  Follow
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Trending</h3>
          <button className="text-primary hover:text-primary-light text-sm font-medium">
            See all
          </button>
        </div>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <div className="flex gap-3 cursor-pointer hover:bg-dark-hover rounded-lg p-2 transition">
                <div className="w-16 h-16 bg-dark-hover rounded-lg flex items-center justify-center flex-shrink-0">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Icons.Play className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white line-clamp-2 text-sm mb-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    by {post.creator.displayName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Icons.HeartFilled className="w-3 h-3" />
                    <span>{post._count?.likes || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
        <div className="space-y-2">
          <Link href="/creators">
            <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white flex items-center">
              <span className="w-6 flex-shrink-0 text-center text-gray-300">
                <Icons.Search className="w-5 h-5 mx-auto" strokeWidth={2} />
              </span>
              <span className="ml-3">Discover Creators</span>
            </button>
          </Link>
          <Link href="/subscriptions">
            <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white flex items-center">
              <span className="w-6 flex-shrink-0 text-center text-gray-300">
                <Icons.Heart className="w-5 h-5 mx-auto" strokeWidth={2} />
              </span>
              <span className="ml-3">My Subscriptions</span>
            </button>
          </Link>
          <Link href="/settings">
            <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white flex items-center">
              <span className="w-6 flex-shrink-0 text-center text-gray-300">
                <Icons.Settings className="w-5 h-5 mx-auto" strokeWidth={2} />
              </span>
              <span className="ml-3">Settings</span>
            </button>
          </Link>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-3">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h4 className="font-bold text-white mb-2">AnonyPlace</h4>
          <p className="text-sm text-gray-400 mb-4">
            Connect with creators and discover exclusive content
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-400">About</Link>
            <Link href="#" className="hover:text-gray-400">Privacy</Link>
            <Link href="#" className="hover:text-gray-400">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}