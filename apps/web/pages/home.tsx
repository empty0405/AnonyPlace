import { useState, useEffect } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  visibility: string;
  createdAt: string;
  creator: {
    id: string;
    displayName: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface Creator {
  id: string;
  displayName: string;
  description?: string;
  _count?: {
    posts: number;
    memberships: number;
  };
}

function HomePage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Creator[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    fetchPosts();
    fetchStories();
    fetchSuggestedCreators();
  }, []);

  

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_URL}/creators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStories(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    }
  };

  const fetchSuggestedCreators = async () => {
    try {
      const res = await fetch(`${API_URL}/creators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCreators(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch suggested creators:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="flex max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex-1 max-w-2xl px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">HOME</h1>
          </div>

          {/* New Post Composer */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>

              <div className="flex-1">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Compose new post..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-lg"
                  rows={3}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-primary transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition">
                      GO LIVE (😉)
                    </button>
                    <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4 p-4 bg-dark-card rounded-xl border border-dark-border">
              {/* Add Story Button */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-dark-hover border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary transition">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Add to story</div>
                </div>
              </div>

              {/* Start Profile Promotion */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center cursor-pointer">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Start profile promotion</div>
                </div>
              </div>

              {/* Creator Stories */}
              {stories.map((creator) => (
                <div key={creator.id} className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 p-1 cursor-pointer">
                      <div className="w-full h-full rounded-full bg-dark-card flex items-center justify-center text-white font-semibold">
                        {creator.displayName[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-1 text-gray-400 truncate w-16">
                      {creator.displayName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Filter */}
          <div className="flex items-center gap-3 mb-6">
            <button className="px-4 py-2 bg-primary text-white rounded-full font-medium">
              All
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white transition">
              🗓️
            </button>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-400 mb-2">Your feed is empty</p>
              <p className="text-gray-500 mb-6">Subscribe to creators to see their content here</p>
              <Link href="/creators">
                <button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-full font-semibold transition">
                  Discover Creators
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-dark-card rounded-xl overflow-hidden border border-dark-border hover:border-primary/30 transition-all">
                  {/* Creator Header */}
                  <Link href={`/creator/${post.creator.id}`}>
                    <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-dark-hover transition">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-semibold text-white">
                        {post.creator.displayName[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{post.creator.displayName}</p>
                        <p className="text-sm text-gray-400">
                          @{post.creator.displayName.toLowerCase().replace(/\s+/g, '')} • {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-white p-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <Link href={`/post/${post.id}`}>
                    <div className="cursor-pointer">
                      {post.thumbnailUrl ? (
                        <div className="relative w-full bg-black">
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full max-h-[600px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-64 bg-dark-hover flex items-center justify-center">
                          <span className="text-6xl">🎥</span>
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-white">{post.title}</h3>
                        {post.description && (
                          <p className="text-gray-300 mb-3 line-clamp-3">{post.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Engagement Bar */}
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-semibold">{post._count?.likes || 0}</span>
                      </button>
                      
                      <Link href={`/post/${post.id}`}>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="font-semibold">{post._count?.comments || 0}</span>
                        </button>
                      </Link>

                      <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>

                    <button className="text-gray-400 hover:text-primary transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 p-6">
          <div className="sticky top-20 space-y-6">
            {/* Subscription Info */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-bold mb-4 text-white">SUBSCRIPTION</h3>
              <div className="text-gray-400">
                <p className="text-sm mb-2">Subscription price and promotions</p>
                <p className="text-xs text-gray-500">$12.50 per month, 1 subscription bundle</p>
              </div>
            </div>

            {/* Scheduled Events */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-bold mb-4 text-white">SCHEDULED EVENTS</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-dark-hover rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-4">You have no scheduled events</p>
                <p className="text-gray-500 text-xs mb-4">
                  Now you can schedule Posts, Messages and Streams to grow your online presence, and view it in Calendar
                </p>
                <button className="w-12 h-12 mx-auto bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button className="w-full text-primary text-sm font-medium hover:text-primary-light">
                VIEW QUEUE
              </button>
            </div>

            {/* P-P-V Messages */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-bold mb-4 text-primary">P-P-V MESSAGES</h3>
              <div className="text-center py-8">
                <div className="w-20 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-primary font-bold">💙 OnlyFans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePage);