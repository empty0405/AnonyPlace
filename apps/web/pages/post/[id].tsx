import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import VideoPlayer from '../../components/VideoPlayer';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  createdAt: string;
  creator: {
    id: string;
    displayName: string;
  };
  assets: Array<{
    id: string;
    type: string;
    url: string;
  }>;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    email: string;
  };
  userId: string;
}

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchLikes();
      fetchComments();
      if (user) {
        checkLiked();
      }
    }
  }, [id, user]);

  const fetchPost = async () => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/posts/${id}`, { headers });
      
      if (!res.ok) {
        if (res.status === 403) {
          setError('You need to subscribe to access this content');
        } else {
          setError('Failed to load post');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await fetch(`${API_URL}/likes/post/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  };

  const checkLiked = async () => {
    try {
      const res = await fetch(`${API_URL}/likes/post/${id}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
      }
    } catch (error) {
      console.error('Failed to check like:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/comments/post/${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      if (liked) {
        await fetch(`${API_URL}/likes/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await fetch(`${API_URL}/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId: id }),
        });
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Failed to like/unlike:', error);
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: id,
          content: commentText,
        }),
      });

      if (res.ok) {
        setCommentText('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-red-500 text-xl mb-4">{error}</div>
          {!user && (
            <p className="text-gray-400 mb-4">
              Please log in to access this content
            </p>
          )}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-full font-semibold transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Media Viewer */}
        <div className="bg-black">
          {post.assets.length > 0 && post.assets[0].type === 'VIDEO' && (
            <VideoPlayer
              src={post.assets[0].url}
              poster={post.assets.find(a => a.type === 'THUMBNAIL')?.url}
            />
          )}
        </div>

        {/* Post Content */}
        <div className="px-4 py-4">
          {/* Creator Info */}
          <Link href={`/creator/${post.creator.id}`}>
            <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-semibold">
                {post.creator.displayName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{post.creator.displayName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Link>

          {/* Engagement Bar */}
          <div className="flex items-center gap-6 mb-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <svg className="w-7 h-7" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <button className="ml-auto text-gray-400 hover:text-primary transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Likes Count */}
          <p className="font-semibold mb-3">{likeCount} likes</p>

          {/* Title & Description */}
          <div className="mb-4">
            <h1 className="font-bold text-xl mb-2">{post.title}</h1>
            {post.description && (
              <p className="text-gray-300 whitespace-pre-wrap">{post.description}</p>
            )}
          </div>

          {/* Visibility Badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            post.visibility === 'PUBLIC' 
              ? 'bg-green-600/20 text-green-400'
              : 'bg-purple-600/20 text-purple-400'
          }`}>
            {post.visibility}
          </span>
        </div>

        {/* Comments Section */}
        <div className="border-t border-dark-border px-4 py-6">
          <h3 className="font-bold text-lg mb-4">Comments ({comments.length})</h3>
          
          {/* Comment Input */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-full focus:border-primary outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-full font-semibold transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {comment.user.email[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="bg-dark-card rounded-2xl px-4 py-3">
                    <p className="font-semibold text-sm mb-1">{comment.user.email}</p>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 px-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

