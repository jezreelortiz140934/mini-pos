import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SkeletonTable from './loading/SkeletonTable';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Sales = ({ onBack }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  // Fetch sales from Supabase
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      setSalesData(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showToast('Error loading sales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalSales = salesData.reduce((sum, sale) => sum + sale.price, 0);
  const averageSale = salesData.length > 0 ? (totalSales / salesData.length) : 0;
  const highestSale = salesData.length > 0 ? Math.max(...salesData.map(s => s.price)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-white hover:text-pink-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-bold">Sales Report</h1>
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <p className="text-gray-600 text-sm">Total Sales</p>
            <p className="text-2xl font-bold text-teal-600">₱{totalSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Sales Table */}
        {loading ? (
          <SkeletonTable columns={4} rows={8} />
        ) : salesData.length === 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No sales records yet</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl fade-in">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-500">
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-teal-600">Date</th>
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-teal-600">Name</th>
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-teal-600">Service</th>
                  <th className="py-4 px-6 text-white font-bold text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr 
                    key={sale.id} 
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-teal-50 transition-colors`}
                  >
                    <td className="py-4 px-6 border-r border-gray-200">
                      {new Date(sale.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 border-r border-gray-200 font-medium">{sale.customer_name}</td>
                    <td className="py-4 px-6 border-r border-gray-200">{sale.service}</td>
                    <td className="py-4 px-6 text-right font-semibold text-teal-600">₱{sale.price.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-teal-100 font-bold">
                  <td colSpan="3" className="py-4 px-6 text-right text-lg">Total Sales:</td>
                  <td className="py-4 px-6 text-right text-xl text-teal-700">₱{totalSales.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && salesData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-800">{salesData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Average Sale</p>
              <p className="text-3xl font-bold text-gray-800">₱{averageSale.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Highest Sale</p>
              <p className="text-3xl font-bold text-gray-800">₱{highestSale.toLocaleString()}</p>
            </div>
          </div>
        )}
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

export default Sales;
