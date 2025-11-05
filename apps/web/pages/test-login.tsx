import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'FAN' | 'CREATOR'>('FAN');
  const [loading, setLoading] = useState(false);
  const API_URL = (typeof window !== 'undefined') ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/test-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to home with token
        router.push(`/?token=${data.accessToken}`);
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (testEmail: string, testRole: 'FAN' | 'CREATOR') => {
    setEmail(testEmail);
    setRole(testRole);
    // Trigger form submission after state update
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <div className="max-w-md w-full mx-4">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
              테스트 로그인
            </h1>
            <p className="text-gray-400 text-sm">개발 환경 전용</p>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                required
                className="w-full px-4 py-3 bg-dark-hover border border-dark-border rounded-lg focus:border-primary outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                역할 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('FAN')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    role === 'FAN'
                      ? 'bg-primary text-white'
                      : 'bg-dark-hover text-gray-400 hover:text-white'
                  }`}
                >
                  👤 팬
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CREATOR')}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    role === 'CREATOR'
                      ? 'bg-primary text-white'
                      : 'bg-dark-hover text-gray-400 hover:text-white'
                  }`}
                >
                  ⭐ 크리에이터
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-border">
            <p className="text-sm text-gray-400 mb-3">빠른 로그인:</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('fan@test.com', 'FAN')}
                className="w-full px-4 py-2 bg-dark-hover hover:bg-dark-border text-left rounded-lg transition"
              >
                <span className="text-gray-300">👤 팬 계정</span>
                <span className="text-xs text-gray-500 ml-2">fan@test.com</span>
              </button>
              <button
                onClick={() => quickLogin('creator@test.com', 'CREATOR')}
                className="w-full px-4 py-2 bg-dark-hover hover:bg-dark-border text-left rounded-lg transition"
              >
                <span className="text-gray-300">⭐ 크리에이터 계정</span>
                <span className="text-xs text-gray-500 ml-2">creator@test.com</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-primary transition"
            >
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>

        <div className="mt-6 bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-4">
          <p className="text-yellow-500 text-sm">
            ⚠️ <strong>개발 환경 전용:</strong> 이 로그인 방법은 테스트 목적으로만 사용하세요. 
            실제 운영 환경에서는 Patreon OAuth를 사용하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
