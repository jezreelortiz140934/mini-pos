import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Toast from './Toast';
import CheckoutDialog from './CheckoutDialog';
import Receipt from './Receipt';
import { useToast } from '../hooks/useToast';

const Dashboard = ({ orderItems = [], onRemoveFromOrder, onUpdateQuantity, onClearOrder, onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  // Handle loading state when returning from product/service pages
  useEffect(() => {
    if (location.state?.showLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Clear the state
        navigate(location.pathname, { replace: true, state: {} });
      }, 800);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal; // Will be recalculated with discount in checkout

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      showToast('Please add items to your order first', 'warning');
      return;
    }
    setShowPrompt(true);
  };

  const processCheckout = async (checkoutData) => {
    const { customerName, paymentMethod, discount, notes, stylistId } = checkoutData;
    const total = Math.max(0, subtotal - discount);
    
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save order to orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName,
          items: orderItems, // Keep for backward compatibility
          subtotal: subtotal,
          tax: 0,
          discount: discount,
          total: total,
          status: 'completed',
          payment_method: paymentMethod,
          payment_status: 'completed',
          notes: notes,
          stylist_id: stylistId,
          user_id: user?.id
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Order Error:', orderError);
        throw orderError;
      }

      // Insert order items into order_items table
      const orderItemsData = orderItems.map(item => ({
        order_id: orderData.id,
        item_type: item.type || 'product',
        item_id: item.id,
        item_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        console.error('Order Items Error:', itemsError);
        throw itemsError;
      }

      // Insert sales record linked to order
      const { error: salesError } = await supabase
        .from('sales')
        .insert([{
          customer_name: customerName,
          service: orderItems.map(item => item.name).join(', '),
          price: total,
          transaction_date: new Date().toISOString(),
          order_id: orderData.id,
          payment_method: paymentMethod,
          notes: notes,
          user_id: user?.id
        }]);

      if (salesError) {
        console.error('Sales Error:', salesError);
        throw salesError;
      }

      // Update inventory for products in the order
      const productItems = orderItems.filter(item => item.type === 'product');
      
      for (const item of productItems) {
        // Get current stock
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (fetchError) {
          console.error('Error fetching product:', fetchError);
          continue; // Skip this item but continue with others
        }

        // Calculate new stock
        const newStock = product.stock - item.qty;

        // Update inventory
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);

        if (updateError) {
          console.error('Error updating inventory:', updateError);
          // Don't throw error, just log it and continue
        }
      }

      // Update inventory for products used in services
      const serviceItems = orderItems.filter(item => item.type === 'service' && item.productsUsed && item.productsUsed.length > 0);
      
      for (const serviceItem of serviceItems) {
        for (const product of serviceItem.productsUsed) {
          // Get current stock
          const { data: productData, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', product.id)
            .single();

          if (fetchError) {
            console.error('Error fetching product for service:', fetchError);
            continue;
          }

          // Calculate new stock (deduct 1 unit per service since quantity is for the service, not the product)
          const newStock = productData.stock - (serviceItem.qty || 1);

          // Update inventory
          const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', product.id);

          if (updateError) {
            console.error('Error updating product inventory for service:', updateError);
          }
        }
      }

      // Generate order number
      const orderNumber = `SHF${Date.now().toString().slice(-8)}`;
      
      // Prepare receipt data (before clearing order)
      const receiptInfo = {
        customerName: customerName,
        items: [...orderItems], // Create a copy of the items
        subtotal: subtotal,
        total: total,
        discount: discount,
        paymentMethod: paymentMethod,
        orderNumber: orderNumber,
        date: new Date().toISOString()
      };
      
      setReceiptData(receiptInfo);
      
      showToast(`Order placed for ${customerName}! Total: ₱${total.toFixed(2)}`, 'success');
      setShowPrompt(false);
      
      // Show receipt modal (don't clear order yet)
      setShowReceipt(true);
    } catch (error) {
      console.error('Error processing checkout:', error);
      showToast(`Error: ${error.message || 'Please try again.'}`, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500"></div>
            <p className="text-gray-700 font-semibold">Adding to order...</p>
          </div>
        </div>
      )}

      {/* Header - Fixed at Top */}
      <div className="fixed top-0 left-0 right-0 lg:right-80 xl:right-96 bg-gradient-to-br from-teal-400 to-teal-500 z-40 px-3 sm:px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-teal-600 rounded-lg transition-colors bg-white bg-opacity-20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 w-56 z-50">
                {user && (
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Logged in as</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                )}
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">SHEARFLOW</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 pb-24 lg:pb-8 pt-20 bg-gradient-to-br from-teal-400 to-teal-500">
      {/* Services Grid */}
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl w-full px-2">
        {/* Stylist Card */}
        <div 
          onClick={() => navigate('/stylist')}
          className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-400"
        >
          <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-full p-5 md:p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Stylist</h3>
          <p className="text-xs md:text-sm text-gray-500 text-center">View and manage stylists</p>
          <div className="mt-4 flex items-center text-teal-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Services Card */}
        <div 
          onClick={() => navigate('/services')}
          className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-400"
        >
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-full p-5 md:p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">Services</h3>
          <p className="text-xs md:text-sm text-gray-500 text-center">Browse salon services</p>
          <div className="mt-4 flex items-center text-pink-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Products Card */}
        <div 
          onClick={() => navigate('/products')}
          className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-400"
        >
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-full p-5 md:p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Products</h3>
          <p className="text-xs md:text-sm text-gray-500 text-center">Shop salon products</p>
          <div className="mt-4 flex items-center text-purple-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
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
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <span className="text-black font-medium text-sm">{item.name}</span>
                    {item.type === 'product' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Product</span>
                    )}
                    {item.type === 'service' && (
                      <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">Service</span>
                    )}
                    {/* Show products used for service */}
                    {item.type === 'service' && item.productsUsed && item.productsUsed.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        <div className="font-semibold">Products used:</div>
                        <ul className="ml-2 space-y-0.5">
                          {item.productsUsed.map((product, idx) => (
                            <li key={idx}>• {product.name}</li>
                          ))}
                        </ul>
                      </div>
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

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSubmit={processCheckout}
        subtotal={subtotal}
      />

      {/* Receipt Modal */}
      <Receipt
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          onClearOrder(); // Clear order when receipt is closed
        }}
        orderData={receiptData}
      />
    </div>
  );
};

export default Dashboard;
