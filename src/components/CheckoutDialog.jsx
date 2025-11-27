import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';

const CheckoutDialog = ({ isOpen, onClose, onSubmit, subtotal, discount: initialDiscount = 0 }) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(initialDiscount);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const discountValue = parseFloat(discount) || 0;
  const total = Math.max(0, subtotal - discountValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim()) {
      onSubmit({
        customerName: customerName.trim(),
        paymentMethod,
        discount: parseFloat(discount),
        notes: notes.trim()
      });
      // Reset form
      setCustomerName('');
      setPaymentMethod('cash');
      setDiscount(0);
      setNotes('');
      onClose();
    }
  };

  const handleDiscountChange = (value) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= subtotal) {
      setDiscount(numValue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h3>
            
            {/* Customer Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector 
              value={paymentMethod} 
              onChange={setPaymentMethod}
            />

            {/* Discount */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Discount (Optional)
              </label>
              <div className="relative mb-2">
                <span className="absolute left-4 top-3 text-gray-500">₱</span>
                <input
                  type="tel"
                  inputMode="decimal"
                  value={discount || ''}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={subtotal}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              {/* Number Pad */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (num === '⌫') {
                        setDiscount(prev => {
                          const str = (prev || '0').toString();
                          const newStr = str.slice(0, -1);
                          return newStr === '' ? 0 : newStr;
                        });
                      } else if (num === '.') {
                        const str = (discount || '0').toString();
                        if (!str.includes('.')) {
                          setDiscount(str + '.');
                        }
                      } else {
                        const currentStr = (discount || '0').toString();
                        const newValue = currentStr === '0' ? num.toString() : currentStr + num.toString();
                        const numValue = parseFloat(newValue);
                        if (!isNaN(numValue) && numValue <= subtotal) {
                          setDiscount(newValue);
                        }
                      }
                    }}
                    className={`py-3 rounded-lg font-semibold text-lg transition-colors ${
                      num === '⌫' 
                        ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-red-600 mb-2">
                  <span>Discount:</span>
                  <span className="font-semibold">-₱{discountValue.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-teal-700 pt-2 border-t-2 border-teal-300">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              Complete Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutDialog;
