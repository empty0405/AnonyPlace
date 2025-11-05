import { useState, useEffect, useRef } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { Icons } from '../components/Icons';

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
  assets?: Array<any>;
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

function FeedPage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');
  
  // Composer state for creating a new post inline
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [posting, setPosting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [tier, setTier] = useState<string>('Public');
  const [showTierMenu, setShowTierMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchPosts();
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

  const fetchSuggestedCreators = async () => {
    try {
      const res = await fetch(`${API_URL}/creators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCreators(data.slice(0, 5)); // Show top 5 creators
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
          {/* Create Post Button / Composer */}
          <div className="mb-6">
            <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
              <div className="flex items-start gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                  U
                </div>

                <div className="flex-1 flex items-start">
                  {!showComposer ? (
                    <>
                      <div className="flex-1">
                        <button
                          onClick={() => setShowComposer(true)}
                          className="w-full bg-dark-hover rounded-full py-3 px-4 text-left text-gray-400 hover:bg-gray-800 transition"
                        >
                          What's on your mind?
                        </button>
                      </div>
                      <div className="ml-3 flex items-center">
                        <button onClick={() => setShowComposer(true)} className="bg-primary hover:bg-primary-dark rounded-full p-3 transition">
                          <Icons.Plus className="w-5 h-5" strokeWidth={2} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        {user?.role !== 'CREATOR' ? (
                          <div className="text-sm text-gray-400">
                            You need a creator profile to publish posts. <a href="/dashboard" className="text-primary">Create a creator profile</a>
                          </div>
                        ) : (
                          <>
                            <input
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="Title (optional)"
                                className="input mb-2 w-full"
                            />
                              <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Share something with your followers..."
                                className="input w-full min-h-[140px] resize-none"
                              />
                              {/* Hidden file input for attachments */}
                              <input
                                ref={(el) => (fileInputRef.current = el)}
                                type="file"
                                accept="video/*,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  setAttachedFile(f);
                                  setAttachedFileName(f ? f.name : null);
                                }}
                              />
                          </>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col items-center justify-center space-y-2">
                        <div className="flex flex-col items-center mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              title="Attach file"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 rounded-md bg-dark-hover hover:bg-gray-700 transition"
                            >
                              <Icons.Paperclip className="w-5 h-5 text-gray-300" strokeWidth={2} />
                            </button>

                            <div className="relative">
                              <button
                                title="Visibility / Tier"
                                onClick={() => setShowTierMenu((s) => !s)}
                                className="p-2 rounded-md bg-dark-hover hover:bg-gray-700 transition flex items-center gap-2"
                              >
                                <Icons.Globe className="w-5 h-5 text-gray-300" />
                                <span className="text-sm text-gray-300">{tier}</span>
                              </button>

                              {showTierMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-dark-card border border-dark-border rounded-md shadow-lg z-10">
                                  <button onClick={() => { setTier('Public'); setShowTierMenu(false); }} className="w-full text-left p-2 hover:bg-dark-hover">Public</button>
                                  <button onClick={() => { setTier('Tier 1'); setShowTierMenu(false); }} className="w-full text-left p-2 hover:bg-dark-hover">Tier 1</button>
                                  <button onClick={() => { setTier('Tier 2'); setShowTierMenu(false); }} className="w-full text-left p-2 hover:bg-dark-hover">Tier 2</button>
                                </div>
                              )}
                            </div>
                          </div>
                          {attachedFileName && (
                            <div className="text-xs text-gray-400 mt-2">Attached: {attachedFileName}</div>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            if (!newTitle.trim() && !newDescription.trim() && !attachedFile) return;
                            setPosting(true);
                            try {
                              let res;
                              if (attachedFile) {
                                const form = new FormData();
                                form.append('title', newTitle.trim());
                                form.append('description', newDescription.trim());
                                form.append('visibility', tier);
                                form.append('video', attachedFile);

                                res = await fetch(`${API_URL}/posts`, {
                                  method: 'POST',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  } as any,
                                  body: form,
                                });
                              } else {
                                const payload = { title: newTitle.trim(), description: newDescription.trim(), visibility: tier };
                                res = await fetch(`${API_URL}/posts`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify(payload),
                                });
                              }

                              if (res.ok) {
                                const created = await res.json();
                                setPosts((prev) => [created, ...prev]);
                                setNewTitle('');
                                setNewDescription('');
                                setAttachedFile(null);
                                setAttachedFileName(null);
                                setShowComposer(false);
                              } else {
                                const text = await res.text();
                                console.error('Failed to create post:', res.status, text);
                                alert(text || `Failed to create post (status ${res.status})`);
                              }
                            } catch (err) {
                              console.error('Failed to create post:', err);
                              alert('Failed to create post — network error');
                            } finally {
                              setPosting(false);
                            }
                          }}
                          disabled={posting}
                          className="btn-primary w-28"
                        >
                          {posting ? 'Posting...' : 'Post'}
                        </button>
                        <button
                          onClick={() => {
                            setShowComposer(false);
                            setNewTitle('');
                            setNewDescription('');
                          }}
                          className="btn-secondary w-28"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
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
              {posts.map((post) => {
                const imageAsset = post.assets?.find((a: any) => a.type === 'IMAGE');
                const imageSrc = post.thumbnailUrl || (imageAsset ? `/api/${String(imageAsset.s3Key).replace(/^\/?\.?\//, '')}` : null);
                return (
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
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-white p-2">
                        <Icons.DotsVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <Link href={`/post/${post.id}`}>
                    <div className="cursor-pointer">
                      {/* Image/Thumbnail */}
                      {imageSrc ? (
                                <div className="relative w-full bg-black">
                                  <img
                                    src={imageSrc}
                                    alt={post.title}
                                    className="w-full max-h-[600px] object-contain"
                                  />
                                </div>
                              ) : (post.assets && post.assets.length > 0) ? (
                        // Has assets but no thumbnail: show a subtle media placeholder with play affordance
                        <div className="relative w-full h-64 bg-black flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                            <Icons.Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        // No media attached: render nothing (show only text content)
                        <></>
                      )}

                      {/* Post Info */}
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
                        <Icons.Heart className="w-6 h-6" strokeWidth={2} />
                        <span className="font-semibold">{post._count?.likes || 0}</span>
                      </button>
                      
                      <Link href={`/post/${post.id}`}>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
                          <Icons.Message className="w-6 h-6" strokeWidth={2} />
                          <span className="font-semibold">{post._count?.comments || 0}</span>
                        </button>
                      </Link>

                      <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
                        <Icons.Share className="w-6 h-6" strokeWidth={2} />
                      </button>
                    </div>

                    <button className="text-gray-400 hover:text-primary transition">
                      <Icons.Bookmark className="w-6 h-6" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ); })}
            </div>
          )}
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="hidden xl:block w-80 p-6">
          <div className="sticky top-20">
            {/* Suggested Creators */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-white">Suggested for you</h3>
              <div className="space-y-4">
                {suggestedCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-semibold text-white">
                      {creator.displayName[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{creator.displayName}</p>
                      <p className="text-sm text-gray-400">
                        {creator._count?.posts || 0} posts • {creator._count?.memberships || 0} subscribers
                      </p>
                    </div>
                    <Link href={`/creator/${creator.id}`}>
                      <button className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-full font-medium transition">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="/creators">
                <button className="w-full mt-4 text-primary hover:text-primary-light text-sm font-medium">
                  See all creators
                </button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/creators">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white">
                    🔍 Discover Creators
                  </button>
                </Link>
                <Link href="/subscriptions">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white">
                    💎 My Subscriptions
                  </button>
                </Link>
                <Link href="/settings">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-dark-hover transition text-gray-300 hover:text-white">
                    ⚙️ Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FeedPage);

