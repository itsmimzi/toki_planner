import React from 'react';
import { Link } from 'react-router-dom';
import logoHome from '../logo/toki-logo-header.svg';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoHome} alt="Toki" className="h-6 w-auto opacity-80" />
          <span className="text-sm text-gray-400">© {new Date().getFullYear()} Toki. All rights reserved.</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/about-us"   className="text-sm text-gray-400 hover:text-gray-700 transition-colors">About</Link>
          <Link to="/pricing"    className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Pricing</Link>
          <Link to="/contact-us" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
          <a
            href="https://github.com/itsmimzi/toki_planner"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
