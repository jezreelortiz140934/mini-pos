import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import DailySales from './DailySales';
import Sales from './Sales';
import ServicesManagement from './ServicesManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/admin');
  };

  return (
    <Routes>
      <Route path="daily-sales" element={<DailySales />} />
      <Route path="sales" element={<Sales />} />
      <Route path="services" element={<ServicesManagement />} />
      <Route path="/" element={
        <AdminDashboardHome handleLogout={handleLogout} />
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

const AdminDashboardHome = ({ handleLogout }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Back to Main Dashboard */}
      <button 
        onClick={() => navigate('/')}
        className="mb-4 sm:mb-6 md:mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
      >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>

            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 md:mb-12">
                <div>
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Admin Dashboard</h1>
                  <p className="text-purple-100 text-sm sm:text-base">Manage your salon operations</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </div>

              {/* Admin Menu Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Daily Sales Report */}
                <button
                  onClick={() => navigate('/admin/daily-sales')}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2 text-left group"
                >
                  <div className="bg-blue-100 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Daily Sales</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                    Monitor daily revenue, track transactions, and analyze sales performance
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm sm:text-base">
                    View Daily Sales
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>

                {/* Services Management */}
                <button
                  onClick={() => navigate('/admin/services')}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2 text-left group"
                >
                  <div className="bg-green-100 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Services Management</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                    Add, edit, and manage salon services including prices and descriptions
                  </p>
                  <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base">
                    Manage Services
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>

                {/* Sales Report */}
                <button
                  onClick={() => navigate('/admin/sales')}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2 text-left group"
                >
                  <div className="bg-teal-100 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:bg-teal-200 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Sales Report</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                    View all sales transactions with order numbers and customer details
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold text-sm sm:text-base">
                    View Sales
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 sm:mt-8 md:mt-12 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-white">
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
};

export default AdminDashboard;
