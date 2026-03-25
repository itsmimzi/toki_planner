import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import LogIn from '../modals/LogIn';
import SignUp from '../modals/SignUp';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    isLoggedIn,
    username,
    logOutUser,
    toggleLogin,
    toggleSignup,
  } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-toki-teal' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        <NavLink className={navLinkClass} to="/about-us">About</NavLink>
        <NavLink className={navLinkClass} to="/pricing">Pricing</NavLink>
        <NavLink className={navLinkClass} to="/contact-us">Contact</NavLink>
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <NavLink to="/homepage" className="text-sm font-medium text-toki-teal hover:text-toki-teal-light transition-colors">
              My workspace
            </NavLink>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Hi, {username}</span>
            <button onClick={logOutUser} className="btn-outline text-sm py-1.5 px-3">
              Log out
            </button>
          </>
        ) : (
          <>
            <button onClick={toggleLogin} className="btn-ghost text-sm py-1.5 px-4">
              Log in
            </button>
            <button onClick={toggleSignup} className="btn-primary text-sm py-2 px-4">
              Get started free
            </button>
          </>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden p-2 text-gray-500 hover:text-gray-900"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden animate-fade-in z-50">
          <div className="px-6 py-4 flex flex-col gap-4">
            <NavLink className="text-sm font-medium text-gray-700" to="/about-us" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink className="text-sm font-medium text-gray-700" to="/pricing" onClick={() => setMobileOpen(false)}>Pricing</NavLink>
            <NavLink className="text-sm font-medium text-gray-700" to="/contact-us" onClick={() => setMobileOpen(false)}>Contact</NavLink>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <button onClick={() => { logOutUser(); setMobileOpen(false); }} className="btn-outline w-full justify-center">Log out</button>
              ) : (
                <>
                  <button onClick={() => { toggleLogin(); setMobileOpen(false); }} className="btn-outline w-full justify-center">Log in</button>
                  <button onClick={() => { toggleSignup(); setMobileOpen(false); }} className="btn-primary w-full justify-center">Get started free</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LogIn />
      <SignUp />
    </>
  );
};

export default NavBar;
