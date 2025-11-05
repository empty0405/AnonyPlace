import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface Creator {
  id: string;
  displayName: string;
  bio?: string;
  isAdult: boolean;
  user: {
    email: string;
  };
  tiers: Tier[];
}

interface Tier {
  id: string;
  name: string;
  level: number;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  visibility: string;
  createdAt: string;
  _count?: {
    likes: number;
    comments: number;
  };
}

export default function CreatorProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, user } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'about'>('posts');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState<'PUBLIC' | 'TIER'>('PUBLIC');
  const [uploading, setUploading] = useState(false);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    if (id) {
      fetchCreatorProfile();
      checkSubscription();
    }
  }, [id]);

  const fetchCreatorProfile = async () => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const [creatorRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/creator/${id}`, { headers }),
        fetch(`${API_URL}/creator/${id}/posts`, { headers }),
      ]);

      if (creatorRes.ok) {
        setCreator(await creatorRes.json());
      }
      if (postsRes.ok) {
        setPosts(await postsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch creator:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/membership/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const memberships = await res.json();
        setIsSubscribed(memberships.some((m: any) => m.creator.id === id));
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }
    if (!creator?.tiers[0]) {
      alert('No tiers available');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/membership/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creatorId: id,
          tierId: creator.tiers[0].id,
        }),
      });

      if (res.ok) {
        alert('Successfully subscribed!');
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('파일을 선택해주세요');
      return;
    }

    // Check file size (500MB limit)
    const maxSize = 500 * 1024 * 1024;
    if (uploadFile.size > maxSize) {
      alert(`파일이 너무 큽니다! 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 업로드 가능합니다.\n현재 파일 크기: ${Math.round(uploadFile.size / 1024 / 1024)}MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDescription);
      formData.append('visibility', uploadVisibility);
      formData.append('creatorId', creator!.id);
      formData.append('isPublic', uploadVisibility === 'PUBLIC' ? 'true' : 'false');

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setUploadTitle('');
        setUploadDescription('');
        setUploadVisibility('PUBLIC');
        setUploadFile(null);
        setShowUploadModal(false);
        alert('영상이 업로드되었습니다! 🎉');
      } else {
        const error = await res.json();
        alert(`업로드 실패: ${error.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const isOwnProfile = user && creator && (user.creatorId === creator.id || user.id === creator.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Creator not found</div>
      </div>
    );
  }

  const postCount = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post._count?.likes || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          {/* Avatar */}
          <div className="absolute -top-16 md:-top-20 left-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-purple-500 border-4 border-dark-bg flex items-center justify-center text-4xl md:text-5xl font-bold">
              {creator.displayName[0].toUpperCase()}
            </div>
          </div>

          {/* Subscribe Button */}
          <div className="flex justify-end pt-4">
            {isOwnProfile ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-8 py-3 rounded-full font-semibold bg-primary hover:bg-primary-dark text-white transition flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                영상 업로드
              </button>
            ) : user && user.id !== creator.user.email ? (
              <button
                onClick={handleSubscribe}
                disabled={isSubscribed}
                className={`px-8 py-3 rounded-full font-semibold transition ${
                  isSubscribed
                    ? 'bg-dark-card text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
            ) : null}
          </div>

          {/* Profile Info */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">{creator.displayName}</h1>
              {creator.isAdult && (
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">18+</span>
              )}
            </div>
            <p className="text-gray-400 mt-2">{creator.bio || 'No bio provided'}</p>

            {/* Stats */}
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold">{postCount}</span>
                <span className="text-gray-400 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-bold">{totalLikes}</span>
                <span className="text-gray-400 ml-1">Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-6 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'posts'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'media'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'about'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 pb-8">
          {activeTab === 'posts' && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400">No posts yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <div className="relative aspect-square bg-dark-card rounded-lg overflow-hidden cursor-pointer group">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-dark-hover">
                            <span className="text-4xl">🎥</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition flex gap-4">
                            <span className="text-white flex items-center gap-1">
                              ❤️ {post._count?.likes || 0}
                            </span>
                            <span className="text-white flex items-center gap-1">
                              💬 {post._count?.comments || 0}
                            </span>
                          </div>
                        </div>
                        {post.visibility === 'SUBSCRIBERS_ONLY' && !isSubscribed && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-3 gap-2">
              {posts.filter(p => p.thumbnailUrl).map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className="aspect-square rounded-lg overflow-hidden cursor-pointer">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl">
              <div className="bg-dark-card rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">About</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{creator.bio || 'No bio provided'}</p>
              </div>

              {creator.tiers.length > 0 && (
                <div className="bg-dark-card rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Membership Tiers</h3>
                  <div className="space-y-3">
                    {creator.tiers.map((tier) => (
                      <div key={tier.id} className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
                        <div>
                          <h4 className="font-semibold">{tier.name}</h4>
                          <p className="text-sm text-gray-400">Level {tier.level}</p>
                        </div>
                        <button
                          onClick={handleSubscribe}
                          className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-full font-semibold transition"
                        >
                          Subscribe
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">새 포스트 작성</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6">
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">영상 파일</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                    required
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary transition bg-dark-hover"
                  >
                    {uploadFile ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎥</div>
                        <p className="font-semibold">{uploadFile.name}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {Math.round(uploadFile.size / 1024 / 1024)}MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-5xl mb-2">+</div>
                        <p className="font-semibold">영상을 선택하세요</p>
                        <p className="text-sm text-gray-400 mt-1">최대 500MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">제목</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">설명</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none"
                  rows={4}
                  placeholder="설명을 입력하세요 (선택사항)"
                />
              </div>

              {/* Visibility */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">공개 범위</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadVisibility('PUBLIC')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      uploadVisibility === 'PUBLIC'
                        ? 'bg-primary text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    🌍 전체 공개
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadVisibility('TIER')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      uploadVisibility === 'TIER'
                        ? 'bg-primary text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    🔒 구독자 전용
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                  uploading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {uploading ? '업로드 중...' : '포스트 작성하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

