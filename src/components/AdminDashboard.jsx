import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import Inventory from './Inventory';
import DailySales from './DailySales';
import ServicesManagement from './ServicesManagement';

const AdminDashboard = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'inventory':
        return <Inventory onBack={() => setCurrentPage('dashboard')} />;
      case 'daily-sales':
        return <DailySales onBack={() => setCurrentPage('dashboard')} />;
      case 'services':
        return <ServicesManagement onBack={() => setCurrentPage('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
            {/* Back to Main Dashboard */}
            <button 
              onClick={onBack}
              className="mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>

            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-white text-4xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-purple-100">Manage your salon operations</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </div>

              {/* Admin Menu Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Inventory Section */}
                <button
                  onClick={() => setCurrentPage('inventory')}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-left group"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Inventory Section</h2>
                  <p className="text-gray-600 mb-4">
                    Manage products, track stock levels, add new items, and update quantities
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold">
                    Open Inventory
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>

                {/* Daily Sales Report */}
                <button
                  onClick={() => setCurrentPage('daily-sales')}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-left group"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Daily Sales</h2>
                  <p className="text-gray-600 mb-4">
                    Monitor daily revenue, track transactions, and analyze sales performance
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    View Daily Sales
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>

                {/* Services Management */}
                <button
                  onClick={() => setCurrentPage('services')}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-left group"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Services Management</h2>
                  <p className="text-gray-600 mb-4">
                    Add, edit, and manage salon services including prices and descriptions
                  </p>
                  <div className="flex items-center text-green-600 font-semibold">
                    Manage Services
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white text-lg font-semibold mb-4">Quick Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Access Level</p>
                      <p className="font-semibold">Administrator</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Status</p>
                      <p className="font-semibold">Authenticated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPage();
};

export default AdminDashboard;
