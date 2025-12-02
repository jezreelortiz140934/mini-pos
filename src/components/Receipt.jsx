import React from 'react';
import shearflowLogo from '../assets/shearflow.png';

const Receipt = ({ isOpen, onClose, orderData }) => {
  if (!isOpen || !orderData) return null;

  const { customerName, items, subtotal, total, orderNumber, date } = orderData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 text-center print:bg-white print:text-black">
          <div className="mb-3">
            <img src={shearflowLogo} alt="SHEARFLOW" className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-wider">SHEARFLOW</h1>
          <p className="text-sm mt-1 opacity-90">Salon Management System</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6">
          {/* Success Icon */}
          <div className="text-center mb-4 print:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Order Completed!</h2>
            <p className="text-gray-600 text-sm">Thank you for your business</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order #:</span>
              <span className="font-mono font-semibold">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{customerName}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Order Items</h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.qty} × ₱{item.price.toFixed(2)}
                      {item.type && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {item.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800 ml-4">
                    ₱{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">₱0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mt-2">
              <span>TOTAL:</span>
              <span className="text-teal-600">₱{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-sm text-gray-600 border-t border-dashed border-gray-300 pt-4">
            <p className="font-medium mb-1">Thank you for choosing ShearFlow!</p>
            <p className="text-xs">We appreciate your business</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0 * {
            visibility: visible;
          }
          .fixed.inset-0 {
            position: absolute;
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;
