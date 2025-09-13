
import React, { useState } from 'react';
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
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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

export default App;