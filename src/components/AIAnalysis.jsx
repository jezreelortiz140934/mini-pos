import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { generateSalesAnalysis } from '../lib/ai';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const AIAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [salesData, setSalesData] = useState([]);
  const { toasts, showToast, removeToast } = useToast();

  const fetchSalesData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('transaction_date', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setSalesData(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showToast('Failed to load sales data', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleGenerateAnalysis = async () => {
    if (salesData.length === 0) {
      showToast('No sales data available for analysis', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await generateSalesAnalysis(salesData);
      setAnalysis(result);
      showToast('Analysis generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating analysis:', error);
      showToast('Failed to generate analysis', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-4xl font-bold mb-2">AI Business Analysis</h1>
            <p className="text-purple-100">Get intelligent insights powered by Google Gemini</p>
          </div>
          <button
            onClick={handleGenerateAnalysis}
            disabled={loading || salesData.length === 0}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Generate Analysis
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-600 text-sm mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-purple-600">{salesData.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">
              ₱{salesData.reduce((sum, sale) => sum + sale.price, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-600 text-sm mb-2">Average Sale</p>
            <p className="text-3xl font-bold text-purple-600">
              ₱{salesData.length > 0 ? Math.round(salesData.reduce((sum, sale) => sum + sale.price, 0) / salesData.length).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis ? (
          <div className="bg-white rounded-lg shadow-xl p-8 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">AI Insights</h2>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 border-dashed p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <p className="text-white text-lg">Click "Generate Analysis" to get AI-powered insights</p>
            <p className="text-purple-200 text-sm mt-2">Powered by Google Gemini AI</p>
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

export default AIAnalysis;
