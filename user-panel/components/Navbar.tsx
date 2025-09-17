import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from './icons';
import { useAuth } from '../context/AuthContext';

interface NavLinksProps {
  isMobile: boolean;
  closeMenu?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile, closeMenu }) => {
  const { user } = useAuth();
  const navClass = isMobile
    ? "flex flex-col items-center space-y-4 pt-8"
    : "hidden md:flex items-center space-x-8";
  const linkClass = "text-lg text-gray-300 hover:text-cyan-400 transition-colors duration-300";

  const links = [
    { path: '/', label: 'Home' },
    { path: '/issues', label: 'Issues Feed' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className={navClass}>
      {links.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`}
          onClick={closeMenu}
        >
          {label}
        </NavLink>
      ))}
      {user?.role === 'admin' && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`}
          onClick={closeMenu}
        >
          Dashboard
        </NavLink>
      )}
    </nav>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const MotionDiv = motion.div;

  // Only show avatar icon, no welcome text
  const renderUserAvatar = (isMobile: boolean) => (
    <div className={isMobile ? "flex flex-col items-center mt-4" : "flex items-center space-x-2"}>
      {user ? (
        <>
          <Link to="/profile" onClick={closeMenu}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-cyan-400 transition-colors"
            />
          </Link>
          <button
            onClick={handleLogout}
            className={`text-gray-300 hover:text-cyan-400 font-semibold ${isMobile ? 'mt-2' : ''}`}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          onClick={closeMenu}
          className="text-gray-300 hover:text-cyan-400 font-semibold"
        >
          Login
        </Link>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
            />

            <span>PragatiPath</span>
          </Link>

          {/* Desktop Links */}
          <NavLinks isMobile={false} />

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {renderUserAvatar(false)}
            </div>

            <Link
              to="/report"
              className="hidden sm:inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Report Issue
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
                {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 absolute w-full pb-8"
          >
            <NavLinks isMobile={true} closeMenu={closeMenu} />
            <Link
              to="/report"
              onClick={closeMenu}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full block mx-auto text-center transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Report Issue
            </Link>
            {renderUserAvatar(true)}
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
