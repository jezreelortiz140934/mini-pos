import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import sfLogo from '../assets/shearflow.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const appUrl = window.location.origin; // Current app URL

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center p-4 relative">
      {/* QR Code Section - Top Left, Hidden on Mobile */}
      <div className="hidden md:block absolute top-6 left-6 bg-white rounded-2xl p-4 shadow-2xl">
        <p className="text-gray-800 font-semibold text-sm mb-3 text-center">Scan to Install App</p>
        <div className="bg-white rounded-lg">
          <QRCodeSVG 
            value={appUrl} 
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="text-gray-600 text-xs mt-3 text-center">Scan with your phone camera</p>
      </div>

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
