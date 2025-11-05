import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
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
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
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
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span className="ml-3">Discover Creators</span>
            </button>
          </Link>
          <Link href="/subscriptions">
            <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white flex items-center">
              <span className="w-6 flex-shrink-0 text-center text-gray-300">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              <span className="ml-3">My Subscriptions</span>
            </button>
          </Link>
          <Link href="/settings">
            <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white flex items-center">
              <span className="w-6 flex-shrink-0 text-center text-gray-300">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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