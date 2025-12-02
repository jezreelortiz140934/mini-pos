import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sfLogo from '../assets/shearflow.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    }
  };

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
          {installPrompt && !isInstalled && (
            <button
              onClick={handleInstall}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <span>⬇️</span> Install App
            </button>
          )}
          {isInstalled && (
            <p className="text-white/80 text-sm">App installed! You can use it offline.</p>
          )}
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
