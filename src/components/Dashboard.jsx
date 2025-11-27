import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Toast from './Toast';
import PromptDialog from './PromptDialog';
import { useToast } from '../hooks/useToast';

const Dashboard = ({ orderItems = [], onRemoveFromOrder, onUpdateQuantity, onClearOrder, onLogout, user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal;

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      showToast('Please add items to your order first', 'warning');
      return;
    }
    setShowPrompt(true);
  };

  const processCheckout = async (name) => {
    try {
      // Insert single sales record
      const { error: salesError } = await supabase
        .from('sales')
        .insert([{
          customer_name: name,
          service: orderItems.map(item => item.name).join(', '),
          price: total,
          transaction_date: new Date().toISOString()
        }]);

      if (salesError) {
        console.error('Sales Error:', salesError);
        throw salesError;
      }

      // Save complete order details to orders table
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: name,
          items: orderItems,
          subtotal: subtotal,
          tax: 0,
          total: total,
          status: 'completed'
        }]);

      if (orderError) {
        console.error('Order Error:', orderError);
        throw orderError;
      }

      showToast(`Order placed for ${name}! Total: ₱${total.toFixed(2)}`, 'success');
      onClearOrder();
      setCustomerName('');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error processing checkout:', error);
      showToast(`Error: ${error.message || 'Please try again.'}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 pb-24 lg:pb-8">
      {/* Header: Hamburger Button and Logo */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 hover:bg-teal-600 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 w-56 z-50">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/admin');
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 font-medium transition-colors"
              >
                Admin Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-medium transition-colors border-t border-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Logo */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wider">SHEARFLOW</h1>
      </div>

      {/* Services Grid */}
      <div className="flex justify-center w-full mb-4 sm:mb-6 md:mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-4xl w-full">
        {/* Walk-in Service */}
        <div 
          onClick={() => navigate('/walkin')}
          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
          </svg>
          <span className="mt-2 sm:mt-3 text-gray-800 font-semibold text-xs sm:text-sm md:text-base text-center">Walk-in Client</span>
        </div>

        {/* Stylist  */}
        <div 
          onClick={() => navigate('/stylist')}
          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
          </svg>
          <span className="mt-2 sm:mt-3 text-gray-800 font-semibold text-xs sm:text-sm md:text-base text-center">Stylist</span>
        </div>

        {/* Services */}
        <div 
          onClick={() => navigate('/services')}
          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 100 100">
            <path fill="#e74c3c" d="M30 20 L30 50 L20 60 L30 70 L30 80 L50 80 L50 50" />
            <path fill="#3498db" d="M70 20 L70 50 L80 60 L70 70 L70 80 L50 80 L50 50" />
            <circle fill="#f39c12" cx="50" cy="35" r="8"/>
          </svg>
          <span className="mt-2 sm:mt-3 text-gray-800 font-semibold text-xs sm:text-sm md:text-base text-center">Services</span>
        </div>

        {/* Products */}
        <div 
          onClick={() => navigate('/products')}
          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
          </svg>
          <span className="mt-2 sm:mt-3 text-gray-800 font-semibold text-xs sm:text-sm md:text-base text-center">Products</span>
        </div>

        {/* Sales  */}
        <div 
          onClick={() => navigate('/sales')}
          className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer col-span-2 md:col-span-1"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 100 100">
            <circle fill="#f4d03f" cx="35" cy="30" r="15"/>
            <text x="30" y="35" fontSize="12" fill="#333" fontWeight="bold">Sale!</text>
            <path fill="#5dade2" d="M45 45 Q50 40 55 45 L60 50 L55 55 L50 52 L45 55 L40 50 Z"/>
            <circle fill="#ec7063" cx="70" cy="35" r="6"/>
            <circle fill="#58d68d" cx="65" cy="50" r="5"/>
          </svg>
          <span className="mt-2 sm:mt-3 text-gray-800 font-semibold text-xs sm:text-sm md:text-base text-center">Sales</span>
        </div>
        </div>
      </div>
      </div>

      {/* Order Tally - Right Sidebar */}
      <div className="hidden lg:block lg:w-80 xl:w-96 bg-white shadow-2xl p-4 lg:p-6 overflow-y-auto">
        <h2 className="text-xl lg:text-2xl font-bold text-black mb-4 lg:mb-6 pb-2 lg:pb-3 border-b-2 border-gray-300">Order Summary</h2>
        
        {/* Order Items */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {orderItems.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No items in order</p>
              <p className="text-sm mt-2">Add services or products</p>
            </div>
          ) : (
            orderItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="border-b border-gray-200 pb-3 mb-3">
                {/* Walk-in Customer Info Badge */}
                {item.type === 'walkin' && item.customerInfo && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-2 mb-2 text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                      <span className="font-semibold text-teal-700">{item.customerInfo.name}</span>
                    </div>
                    <div className="text-gray-600 space-y-0.5">
                      {item.customerInfo.contact && (
                        <div>📞 {item.customerInfo.contact}</div>
                      )}
                      {item.customerInfo.time && (
                        <div>🕐 {item.customerInfo.time}</div>
                      )}
                      {item.customerInfo.stylist && (
                        <div>✂️ {item.customerInfo.stylist}</div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <span className="text-black font-medium text-sm">{item.name}</span>
                    {item.type === 'walkin' && (
                      <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Walk-in</span>
                    )}
                    {item.type === 'product' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Product</span>
                    )}
                    {item.type === 'service' && (
                      <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">Service</span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveFromOrder(item.id, item.type)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.type, item.qty - 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.type, item.qty + 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">₱{item.price.toFixed(2)} each</div>
                    <div className="font-semibold text-black">₱{(item.price * item.qty).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between text-black text-xl font-bold pt-3">
            <span>Total:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={handleCheckout}
            disabled={orderItems.length === 0}
            className="w-full text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ backgroundColor: '#F29C9B' }} 
            onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e88a89')} 
            onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#F29C9B')}
          >
            Checkout
          </button>
          <button 
            onClick={onClearOrder}
            disabled={orderItems.length === 0}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Order
          </button>
        </div>
      </div>

      {/* Mobile Bottom Bar - Order Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-300 p-3 sm:p-4 z-50">
        <div className="flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">
              {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-black">
              ₱{total.toFixed(2)}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onClearOrder}
              disabled={orderItems.length === 0}
              className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Clear
            </button>
            <button 
              onClick={handleCheckout}
              disabled={orderItems.length === 0}
              className="text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base" 
              style={{ backgroundColor: '#F29C9B' }} 
              onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e88a89')} 
              onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#F29C9B')}
            >
              Checkout
            </button>
          </div>
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

      {/* Customer Name Prompt */}
      <PromptDialog
        isOpen={showPrompt}
        onClose={() => {
          setShowPrompt(false);
          setCustomerName('');
        }}
        onSubmit={processCheckout}
        title="Customer Information"
        message="Please enter the customer's name to complete the order"
        placeholder="Enter customer name"
        inputValue={customerName}
        onInputChange={setCustomerName}
        submitText="Complete Order"
      />
    </div>
  );
};

export default Dashboard;
