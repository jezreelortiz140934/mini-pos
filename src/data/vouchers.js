// Pre-generated voucher codes with 20% discount
export const VOUCHERS = [
  { code: 'SHEAR20A', discount: 20, isUsed: false },
  { code: 'SHEAR20B', discount: 20, isUsed: false },
  { code: 'SHEAR20C', discount: 20, isUsed: false },
  { code: 'SHEAR20D', discount: 20, isUsed: false },
  { code: 'SHEAR20E', discount: 20, isUsed: false },
  { code: 'SHEAR20F', discount: 20, isUsed: false },
  { code: 'SHEAR20G', discount: 20, isUsed: false },
  { code: 'SHEAR20H', discount: 20, isUsed: false },
  { code: 'SHEAR20I', discount: 20, isUsed: false },
  { code: 'SHEAR20J', discount: 20, isUsed: false },
  { code: 'SHEAR20K', discount: 20, isUsed: false },
  { code: 'SHEAR20L', discount: 20, isUsed: false },
  { code: 'SHEAR20M', discount: 20, isUsed: false },
  { code: 'SHEAR20N', discount: 20, isUsed: false },
  { code: 'SHEAR20O', discount: 20, isUsed: false },
  { code: 'SHEAR20P', discount: 20, isUsed: false },
  { code: 'SHEAR20Q', discount: 20, isUsed: false },
  { code: 'SHEAR20R', discount: 20, isUsed: false },
  { code: 'SHEAR20S', discount: 20, isUsed: false },
  { code: 'SHEAR20T', discount: 20, isUsed: false },
];

// Store used vouchers in localStorage
const USED_VOUCHERS_KEY = 'shearflow_used_vouchers';

export const getUsedVouchers = () => {
  const stored = localStorage.getItem(USED_VOUCHERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const markVoucherAsUsed = (code) => {
  const usedVouchers = getUsedVouchers();
  if (!usedVouchers.includes(code)) {
    usedVouchers.push(code);
    localStorage.setItem(USED_VOUCHERS_KEY, JSON.stringify(usedVouchers));
  }
};

export const validateVoucher = (code) => {
  const upperCode = code.toUpperCase().trim();
  const voucher = VOUCHERS.find(v => v.code === upperCode);
  
  if (!voucher) {
    return { valid: false, message: 'Invalid voucher code' };
  }
  
  const usedVouchers = getUsedVouchers();
  if (usedVouchers.includes(upperCode)) {
    return { valid: false, message: 'Voucher already used' };
  }
  
  return { valid: true, discount: voucher.discount, code: upperCode };
};
