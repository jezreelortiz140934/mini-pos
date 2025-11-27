import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonCard from './loading/SkeletonCard';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

const DailySales = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toasts, showToast, removeToast } = useToast();

  const fetchDailySales = useCallback(async () => {
    try {
      setLoading(true);
      
      // Create date range for the selected date
      // Start of day in local timezone
      const startOfDay = new Date(selectedDate + 'T00:00:00');
      // End of day in local timezone
      const endOfDay = new Date(selectedDate + 'T23:59:59.999');

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSalesData(data || []);
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      showToast('Error loading daily sales', 'error');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, showToast]);

  useEffect(() => {
    fetchDailySales();
  }, [fetchDailySales]);

  const calculateSaleTotal = (sale) => {
    // First try to use the total field
    if (sale.total != null && !isNaN(parseFloat(sale.total))) {
      return parseFloat(sale.total);
    }
    // If no total field, calculate from items
    if (sale.items && Array.isArray(sale.items)) {
      return sale.items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.qty || 1));
      }, 0);
    }
    // Fallback to price field
    if (sale.price != null && !isNaN(parseFloat(sale.price))) {
      return parseFloat(sale.price);
    }
    return 0;
  };

  const totalRevenue = salesData.reduce((sum, sale) => sum + calculateSaleTotal(sale), 0);
  const totalTransactions = salesData.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="mb-8 flex items-center text-white hover:text-blue-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Daily Sales Report</h1>
            <p className="text-blue-100">Monitor today's sales performance</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <label className="text-gray-700 font-semibold text-sm block mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fade-in">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">₱{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-semibold">Total Transactions</p>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-semibold">Average Transaction</p>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">₱{averageTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        )}

        {/* Sales Transactions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-white text-xl font-bold">Transactions for {formatDate(selectedDate)}</h2>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : salesData.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p className="text-gray-500 text-lg font-semibold">No transactions for this date</p>
              <p className="text-gray-400 text-sm mt-2">Sales will appear here once transactions are completed</p>
            </div>
          ) : (
            <div className="p-6 space-y-4 fade-in">
              {salesData.map((sale, index) => (
                <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          #{index + 1}
                        </span>
                        <span className="text-gray-600 text-sm">{formatTime(sale.created_at)}</span>
                      </div>
                      <p className="text-gray-800 font-semibold">Customer: {sale.customer_name || 'Walk-in'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₱{calculateSaleTotal(sale).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {sale.items && sale.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Items:</p>
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} 
                              <span className="text-gray-500"> x{item.qty}</span>
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                item.type === 'walk-in' ? 'bg-pink-100 text-pink-700' :
                                item.type === 'product' ? 'bg-purple-100 text-purple-700' :
                                'bg-teal-100 text-teal-700'
                              }`}>
                                {item.type}
                              </span>
                            </span>
                            <span className="text-gray-600 font-medium">
                              ₱{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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

export default DailySales;
