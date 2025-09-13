
import React from 'react';
import { Search, Bell, User } from '../shared/Icons';
import { Page } from '../../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search for reports, users..."
          className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex items-center">
        <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
        </button>
        <button 
          onClick={() => setCurrentPage('Profile')}
          className="ml-4 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</span>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
            </div>
        </button>
      </div>
    </header>
  );
};

export default Header;