import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  role: string;
  patreonId?: string;
  creatorId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in URL (OAuth callback)
    const { token: urlToken } = router.query;
    if (urlToken && typeof urlToken === 'string') {
      handleLogin(urlToken);
      // Clean up URL
      router.replace(router.pathname, undefined, { shallow: true });
    } else {
      // Check localStorage
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        handleLogin(savedToken);
      } else {
        setLoading(false);
      }
    }
  }, [router.query]);

  const handleLogin = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    try {
      // Decode JWT to get user info
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      const userData = {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'FAN',
        creatorId: payload.creatorId,
      };
      setUser(userData);

      // Fetch creator profile if user is a creator
      if (userData.role === 'CREATOR' && !userData.creatorId) {
        await fetchCreatorId(newToken);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      handleLogout();
    }

    setLoading(false);
  };

  const fetchCreatorId = async (authToken: string) => {
    try {
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');
      const res = await fetch(`${API_URL}/creator`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const creator = await res.json();
        setUser(prev => prev ? { ...prev, creatorId: creator.id } : null);
      }
    } catch (error) {
      console.error('Failed to fetch creator ID:', error);
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCreatorId(token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
