import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Creator {
  id: string;
  displayName: string;
  bio?: string;
  isAdult: boolean;
  _count: {
    posts: number;
  };
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await fetch(`${API_URL}/creator`);
      if (res.ok) {
        const data = await res.json();
        setCreators(data);
      }
    } catch (error) {
      console.error('Failed to fetch creators:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-6">Explore Creators</h1>

        {creators.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-400">No creators yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/creator/${creator.id}`}>
                <div className="card hover:border-primary transition cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-white">{creator.displayName}</h2>
                    {creator.isAdult && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">18+</span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-3">{creator.bio || 'No bio provided'}</p>
                  <div className="text-sm text-gray-500">{creator._count.posts} posts</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
