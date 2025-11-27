import React from 'react';

const PaymentMethodSelector = ({ value, onChange, label = "Payment Method" }) => {
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'gcash', label: 'GCash', icon: '📱' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {paymentMethods.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange(method.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              value === method.value
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-gray-300 bg-white hover:border-teal-300'
            }`}
          >
            <div className="text-2xl mb-1">{method.icon}</div>
            <div className="text-sm font-medium">{method.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
