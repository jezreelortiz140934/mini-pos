import React, { useState, useEffect } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import { validateVoucher, markVoucherAsUsed } from '../data/vouchers';
import { supabase } from '../supabaseClient';

const CheckoutDialog = ({ isOpen, onClose, onSubmit, subtotal }) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [notes, setNotes] = useState('');
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStylists();
    }
  }, [isOpen]);

  const fetchStylists = async () => {
    try {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStylists(data || []);
    } catch (error) {
      console.error('Error fetching stylists:', error);
    }
  };

  if (!isOpen) return null;

  const discountPercent = appliedVoucher ? appliedVoucher.discount : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      setVoucherError('Please enter a voucher code');
      return;
    }

    const result = validateVoucher(voucherCode);
    if (result.valid) {
      setAppliedVoucher({ code: result.code, discount: result.discount });
      setVoucherError('');
    } else {
      setVoucherError(result.message);
      setAppliedVoucher(null);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim()) {
      // Mark voucher as used if applied
      if (appliedVoucher) {
        markVoucherAsUsed(appliedVoucher.code);
      }

      onSubmit({
        customerName: customerName.trim(),
        paymentMethod,
        discount: discountAmount,
        voucherCode: appliedVoucher?.code || null,
        notes: notes.trim(),
        stylistId: selectedStylist || null
      });
      // Reset form
      setCustomerName('');
      setPaymentMethod('cash');
      setVoucherCode('');
      setAppliedVoucher(null);
      setVoucherError('');
      setNotes('');
      setSelectedStylist('');
      onClose();
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

            {/* Stylist Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Stylist (Optional)
              </label>
              <select
                value={selectedStylist}
                onChange={(e) => setSelectedStylist(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select a stylist</option>
                {stylists.map((stylist) => (
                  <option key={stylist.id} value={stylist.id}>
                    {stylist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector 
              value={paymentMethod} 
              onChange={setPaymentMethod}
            />

            {/* Voucher Code */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Voucher Code (Optional)
              </label>
              
              {!appliedVoucher ? (
                <>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Enter voucher code"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode.trim()}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-red-600 text-sm mt-1">{voucherError}</p>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-700">{appliedVoucher.code}</p>
                      <p className="text-sm text-green-600">{appliedVoucher.discount}% discount applied</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
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
              {appliedVoucher && discountAmount > 0 && (
                <div className="flex justify-between text-green-600 mb-2">
                  <span>{appliedVoucher.discount}% OFF - Save:</span>
                  <span className="font-semibold">-₱{discountAmount.toFixed(2)}</span>
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
