import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

const AdminLogin = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const { toasts, showToast, removeToast } = useToast();
  const ADMIN_PIN = '808080';

  const handlePinInput = (digit) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 6) {
        if (newPin === ADMIN_PIN) {
          showToast('Access Granted!', 'success');
          setTimeout(() => {
            onLogin();
          }, 500);
        } else {
          showToast('Incorrect PIN. Please try again.', 'error');
          setTimeout(() => {
            setPin('');
          }, 1000);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter 6-digit PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className="mb-8">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin.length > index
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                }`}
              >
                {pin.length > index ? '•' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit.toString())}
              className="bg-gray-100 hover:bg-indigo-100 text-gray-800 text-xl font-semibold py-4 rounded-lg transition-colors active:scale-95"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-red-100 hover:bg-red-200 text-red-600 text-lg font-semibold py-4 rounded-lg transition-colors active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => handlePinInput('0')}
            className="bg-gray-100 hover:bg-indigo-100 text-gray-800 text-xl font-semibold py-4 rounded-lg transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg font-semibold py-4 rounded-lg transition-colors active:scale-95"
          >
            ⌫
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Authorized personnel only
        </p>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default AdminLogin;
