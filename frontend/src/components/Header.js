import React from 'react';
import logoHome from '../logo/logoHome4.png';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center">
          <img src={logoHome} alt="Toki" className="h-8 w-auto" />
        </Link>
        <NavBar />
      </div>
    </header>
  );
};

export default Header;
