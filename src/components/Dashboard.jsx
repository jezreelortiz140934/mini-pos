import React from 'react';

const Dashboard = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const orderItems = [];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col py-4 md:py-8 px-4 md:px-6">
      {/* Hamburger Button */}
      <div className="relative self-start mb-4">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-teal-600 rounded-lg transition-colors"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 w-56 z-50">
            <button className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 font-medium transition-colors">
              Inventory Section
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 font-medium transition-colors">
              Admin Dashboard
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-medium transition-colors border-t border-gray-200">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logo Section */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-lg">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-14 h-14 md:w-20 md:h-20 text-white" viewBox="0 0 100 100" fill="currentColor">
              {/* Placeholder for logo - replace with actual logo */}
              <circle cx="50" cy="50" r="40" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wider">SHEARFLOW</h1>
      </div>

      {/* Services Grid */}
      <div className="flex justify-center w-full mb-6 md:mb-8">
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl w-full">
        {/* Walk-in Service */}
        <div 
          onClick={() => onNavigate('walkin')}
          className="bg-white rounded-lg p-6 md:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-16 h-16 md:w-24 md:h-24 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
          </svg>
          <span className="mt-3 text-gray-800 font-semibold text-sm md:text-base">Walk-in Client</span>
        </div>

        {/* Stylist  */}
        <div 
          onClick={() => onNavigate('stylist')}
          className="bg-white rounded-lg p-6 md:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
          </svg>
          <span className="mt-3 text-gray-800 font-semibold text-sm md:text-base">Stylist</span>
        </div>

        {/* Services */}
        <div 
          onClick={() => onNavigate('services')}
          className="bg-white rounded-lg p-6 md:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100">
            <path fill="#e74c3c" d="M30 20 L30 50 L20 60 L30 70 L30 80 L50 80 L50 50" />
            <path fill="#3498db" d="M70 20 L70 50 L80 60 L70 70 L70 80 L50 80 L50 50" />
            <circle fill="#f39c12" cx="50" cy="35" r="8"/>
          </svg>
          <span className="mt-3 text-gray-800 font-semibold text-sm md:text-base">Services</span>
        </div>

        {/* Sales  */}
        <div className="bg-white rounded-lg p-6 md:p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100">
            <circle fill="#f4d03f" cx="35" cy="30" r="15"/>
            <text x="30" y="35" fontSize="12" fill="#333" fontWeight="bold">Sale!</text>
            <path fill="#5dade2" d="M45 45 Q50 40 55 45 L60 50 L55 55 L50 52 L45 55 L40 50 Z"/>
            <circle fill="#ec7063" cx="70" cy="35" r="6"/>
            <circle fill="#58d68d" cx="65" cy="50" r="5"/>
          </svg>
          <span className="mt-3 text-gray-800 font-semibold text-sm md:text-base">Sales</span>
        </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="flex justify-center w-full mb-6 md:mb-8">
      <div className="bg-gray-600 rounded-lg p-4 md:p-8 max-w-3xl w-full shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-20 h-20 md:w-32 md:h-32 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-4 gap-1 md:gap-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-12 md:w-16 md:h-16 ${i < 4 ? 'bg-amber-700' : 'bg-teal-600'} rounded shadow-md`}
                >
                  <div className="w-full h-1/3 bg-amber-900 rounded-t"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      {/* Order Tally - Right Sidebar */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-gray-300">Order Summary</h2>
        
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {orderItems.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-black font-medium text-sm flex-1">{item.name}</span>
                <span className="text-black font-semibold ml-2">₱{item.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Qty: {item.qty}</span>
                <span className="font-semibold text-black">₱{item.price * item.qty}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between text-black">
            <span>Subtotal:</span>
            <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Tax (12%):</span>
            <span className="font-semibold">₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black text-xl font-bold border-t-2 border-gray-400 pt-3 mt-3">
            <span>Total:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full text-white font-bold py-3 rounded-lg transition-colors" style={{ backgroundColor: '#F29C9B' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e88a89'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F29C9B'}>
            Checkout
          </button>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 rounded-lg transition-colors">
            Clear Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
