
import React from 'react';
import { Page } from '../../types';
import { Home, FileText, Users, Trophy, LifeBuoy, UserCircle, Settings, LogOut, PenSquare } from '../shared/Icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const navItems: { page: Page; displayName: string; icon: React.ReactNode }[] = [
  { page: 'Dashboard', displayName: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { page: 'Reports', displayName: 'Reports', icon: <FileText className="h-5 w-5" /> },
  { page: 'Users', displayName: 'Users', icon: <Users className="h-5 w-5" /> },
  { page: 'Leaderboard', displayName: 'Leaderboard', icon: <Trophy className="h-5 w-5" /> },
  { page: 'Help', displayName: 'Help', icon: <LifeBuoy className="h-5 w-5" /> },
  { page: 'Profile', displayName: 'Profile', icon: <UserCircle className="h-5 w-5" /> },
  { page: 'DigitalSignature', displayName: 'Digital Signature', icon: <PenSquare className="h-5 w-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PragatiPath</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.page}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.page);
              }}
              className={`flex items-center px-4 py-2 mt-2 text-sm rounded-lg transition-colors duration-200 ${
                currentPage === item.page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.displayName}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
         <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage('Settings');
            }}
            className={`flex items-center px-4 py-2 mt-2 text-sm rounded-lg transition-colors duration-200 ${
                currentPage === 'Settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
        >
            <Settings className="h-5 w-5" />
            <span className="ml-3">Settings</span>
        </a>
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onLogout();
            }}
            className="flex items-center px-4 py-2 mt-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;