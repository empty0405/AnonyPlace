import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import { appWithTranslation } from 'next-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

function AppContent({ Component, pageProps }: AppProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const isAuthPage = router.pathname === '/' || router.pathname === '/test-login';
  const showSidebar = user && !isAuthPage;

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''} pb-16 md:pb-0`}>
          <Component {...pageProps} />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  )
}

export default appWithTranslation(MyApp)

