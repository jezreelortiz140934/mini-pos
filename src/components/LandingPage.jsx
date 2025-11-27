import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-16 h-16 text-teal-500" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
              <path d="M30 40 Q50 25 70 40" fill="none" stroke="currentColor" strokeWidth="3"/>
              <circle cx="35" cy="45" r="3" fill="currentColor"/>
              <circle cx="65" cy="45" r="3" fill="currentColor"/>
              <path d="M35 60 Q50 70 65 60" fill="none" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </div>
          <h1 className="text-5xl font-serif text-white tracking-wider mb-2">SHEARFLOW</h1>
          <p className="text-white/90 text-lg">Your Salon Management Solution</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4 w-full max-w-xs mx-auto">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
