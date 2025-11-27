-- Migration: Improve Orders Table
-- Add missing columns and create order_items table for better data structure

-- Add new columns to orders table (skip if already exist)
DO $$ 
BEGIN
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add check constraints (skip if already exist)
DO $$ 
BEGIN
    ALTER TABLE orders ADD CONSTRAINT check_payment_method 
        CHECK (payment_method IN ('cash', 'card', 'gcash', 'paymaya', 'bank_transfer'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ADD CONSTRAINT check_payment_status 
        CHECK (payment_status IN ('pending', 'completed', 'refunded', 'cancelled'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ADD CONSTRAINT check_discount_valid 
        CHECK (discount >= 0 AND discount <= subtotal);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create normalized order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_type text NOT NULL, -- 'product', 'service', 'walkin'
    item_id uuid NOT NULL,
    item_name text NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    
    CONSTRAINT check_item_type CHECK (item_type IN ('product', 'service', 'walkin')),
    CONSTRAINT check_quantity_positive CHECK (quantity > 0),
    CONSTRAINT check_unit_price_positive CHECK (unit_price >= 0),
    CONSTRAINT check_total_price_valid CHECK (total_price = unit_price * quantity)
);

-- Add indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item_type ON order_items(item_type);
CREATE INDEX IF NOT EXISTS idx_order_items_item_id ON order_items(item_id);

-- Add comments
COMMENT ON TABLE order_items IS 'Normalized order items table - replaces JSON items column';
COMMENT ON COLUMN orders.payment_method IS 'Payment method used: cash, card, gcash, paymaya, bank_transfer';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, completed, failed, refunded';
COMMENT ON COLUMN orders.discount IS 'Discount amount applied to the order';
COMMENT ON COLUMN orders.user_id IS 'User who created the order';

-- Migrate existing JSON items to order_items table (if items exist)
-- This is a one-time migration - skip if already migrated
DO $$
DECLARE
    order_record RECORD;
    item_record jsonb;
BEGIN
    -- Only migrate if order_items are not already populated
    IF NOT EXISTS (SELECT 1 FROM order_items LIMIT 1) THEN
        FOR order_record IN SELECT id, items FROM orders WHERE items IS NOT NULL LOOP
            FOR item_record IN SELECT * FROM jsonb_array_elements(order_record.items) LOOP
                INSERT INTO order_items (
                    order_id,
                    item_type,
                    item_id,
                    item_name,
                    quantity,
                    unit_price,
                    total_price
                ) VALUES (
                    order_record.id,
                    COALESCE((item_record->>'type')::text, 'service'),
                    ((item_record->>'id')::text)::uuid,
                    (item_record->>'name')::text,
                    COALESCE((item_record->>'qty')::integer, 1),
                    (item_record->>'price')::numeric,
                    (item_record->>'price')::numeric * COALESCE((item_record->>'qty')::integer, 1)
                );
            END LOOP;
        END LOOP;
    END IF;
END $$;

-- Update existing orders to have default payment values
UPDATE orders 
SET 
    payment_method = 'cash',
    payment_status = 'completed'
WHERE payment_method IS NULL AND status = 'completed';
