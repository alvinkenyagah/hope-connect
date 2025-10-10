import React from 'react';
import { Link } from 'react-router-dom';
import { Frown, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    // Container uses padding-top to account for the fixed Navbar
    <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-2xl shadow-2xl text-center transform transition-all hover:scale-[1.02] duration-300">
        
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center mb-6">
          <Frown className="w-10 h-10" />
        </div>
        
        {/* Error Code and Message */}
        <h1 className="text-7xl font-extrabold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Navigation Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.05] transition duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back Home</span>
        </Link>

      </div>
    </div>
  );
};

export default NotFoundPage;