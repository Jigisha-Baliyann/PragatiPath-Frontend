
import React, { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DigitalSignaturePage from './pages/DigitalSignaturePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Page } from './types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();

  console.log('App render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'user:', user);
  }, [isAuthenticated, user]);

  const handleLogin = async (email: string, password: string) => {
    console.log('handleLogin called with:', email, password);
    const success = await login(email, password);
    console.log('Login result:', success);
    if (success) {
      setCurrentPage('Dashboard');
      console.log('Setting current page to Dashboard');
    }
    return success;
  };

  const handleLogout = () => {
    logout();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Users':
        return <UsersPage />;
      case 'Leaderboard':
        return <LeaderboardPage />;
      case 'Help':
        return <HelpPage />;
      case 'Profile':
        return <ProfilePage />;
      case 'Settings':
        return <SettingsPage />;
      case 'DigitalSignature':
        return <DigitalSignaturePage />;
      default:
        return <DashboardPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'signin') {
      return <SignInPage onSignIn={handleLogin} onNavigateToSignUp={() => setAuthPage('signup')} />;
    }
    return <SignUpPage onSignUp={handleLogin} onNavigateToSignIn={() => setAuthPage('signin')} />;
  }

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout}>
      {renderPage()}
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;