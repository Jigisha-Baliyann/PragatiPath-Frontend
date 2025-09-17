
import React from 'react';
import { MapPinIcon } from './icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-xl font-bold text-white mb-4 md:mb-0">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Logo"
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
            />

            <span>PragatiPath</span>
          </div>
          <p className="text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} PragatiPath AI. All rights reserved.
            <br />
            Empowering citizens for a better community.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
