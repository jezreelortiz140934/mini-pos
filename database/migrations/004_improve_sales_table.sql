-- Migration: Improve Sales Table
-- Add missing columns and create proper relationship with orders

-- Add new columns to sales table
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES orders(id),
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS stylist_id uuid REFERENCES stylists(id),
ADD COLUMN IF NOT EXISTS notes text;

-- Add check constraint for payment method
ALTER TABLE sales
ADD CONSTRAINT check_sales_payment_method CHECK (payment_method IN ('cash', 'card', 'gcash', 'paymaya', 'bank_transfer'));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_sales_order_id ON sales(order_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_stylist_id ON sales(stylist_id);
CREATE INDEX IF NOT EXISTS idx_sales_transaction_date ON sales(transaction_date);

-- Add comments
COMMENT ON COLUMN sales.order_id IS 'Reference to the order that generated this sale';
COMMENT ON COLUMN sales.payment_method IS 'Payment method used for this sale';
COMMENT ON COLUMN sales.user_id IS 'User who processed this sale';
COMMENT ON COLUMN sales.stylist_id IS 'Stylist who provided the service (if applicable)';
COMMENT ON COLUMN sales.service IS 'Legacy field - use order_items table instead';

-- Create view for daily sales summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(transaction_date) as sale_date,
    COUNT(*) as total_transactions,
    SUM(price) as total_revenue,
    AVG(price) as average_transaction,
    COUNT(DISTINCT customer_name) as unique_customers,
    payment_method,
    user_id
FROM sales
GROUP BY DATE(transaction_date), payment_method, user_id
ORDER BY sale_date DESC;

-- Create view for sales by service
CREATE OR REPLACE VIEW sales_by_service AS
SELECT 
    service,
    COUNT(*) as service_count,
    SUM(price) as total_revenue,
    AVG(price) as average_price,
    DATE(transaction_date) as sale_date
FROM sales
GROUP BY service, DATE(transaction_date)
ORDER BY sale_date DESC, total_revenue DESC;

-- Create view for sales by stylist
CREATE OR REPLACE VIEW sales_by_stylist AS
SELECT 
    s.stylist_id,
    st.name as stylist_name,
    COUNT(*) as total_sales,
    SUM(s.price) as total_revenue,
    AVG(s.price) as average_sale,
    DATE(s.transaction_date) as sale_date
FROM sales s
LEFT JOIN stylists st ON s.stylist_id = st.id
WHERE s.stylist_id IS NOT NULL
GROUP BY s.stylist_id, st.name, DATE(s.transaction_date)
ORDER BY sale_date DESC, total_revenue DESC;

-- Add comments on views
COMMENT ON VIEW daily_sales_summary IS 'Daily aggregated sales summary with payment methods';
COMMENT ON VIEW sales_by_service IS 'Sales breakdown by service type';
COMMENT ON VIEW sales_by_stylist IS 'Sales performance by stylist';

-- Update existing sales to link with orders where possible
UPDATE sales s
SET order_id = o.id
FROM orders o
WHERE 
    s.customer_name = o.customer_name 
    AND s.price = o.total
    AND DATE(s.transaction_date) = DATE(o.created_at)
    AND s.order_id IS NULL
    AND o.id IS NOT NULL;

-- Set default payment method for existing sales
UPDATE sales 
SET payment_method = 'cash'
WHERE payment_method IS NULL;
