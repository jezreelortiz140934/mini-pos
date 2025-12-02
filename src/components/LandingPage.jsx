import React from 'react';
import { useNavigate } from 'react-router-dom';
import sfLogo from '../assets/shearflow.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-12">
          <img src={sfLogo} alt="SHEARFLOW" className="w-26 h-26 mx-auto mr-2" />
          <h1 className="text-5xl font-serif text-white tracking-wider mb-2">SHEARFLOW</h1>
          <p className="text-white/90 text-lg">Your Salon Management Solution</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 w-full max-w-xs mx-auto">
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
