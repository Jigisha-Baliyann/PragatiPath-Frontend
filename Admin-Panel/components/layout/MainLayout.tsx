
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Page } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, setCurrentPage, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;