import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../logo/logo404.png';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-white">
      <img src={logo} alt="Toki 404" className="h-24 w-auto mb-8 opacity-40" />
      <h1 className="text-6xl font-bold text-gray-100 mb-2 select-none">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Page not found</h2>
      <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed">
        The page you're looking for doesn't exist — or hasn't been built yet.
      </p>
      <Link to="/home" className="btn-primary py-2.5 px-6">
        <ArrowLeft size={15} /> Back to home
      </Link>
    </div>
  );
};

export default NotFound;
