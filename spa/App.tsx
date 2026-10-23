import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { AnimatedBackground } from './components/3d/AnimatedBackground';

// Pages
import { HomePage } from './pages/HomePage';
import { TransformerPage } from './pages/TransformerPage';
import { IntentLockPage } from './pages/IntentLockPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

// Scroll to top automatically when route changes
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        color: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <ScrollToTopOnRoute />

      {/* Global 3D Cinematic Animated Background */}
      <AnimatedBackground />

      {/* Persistent 3D Neon Brutalist Navigation */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transformer" element={<TransformerPage />} />
          <Route path="/intentlock" element={<IntentLockPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Unified Footer */}
      <Footer onScrollToTop={scrollToTop} />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
