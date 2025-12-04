-- DATABASE UPDATES FOR MINI POS REVAMP
-- Execute these SQL commands in your Supabase SQL Editor

-- 1. DROP the walk_in_appointments table (no longer needed)
DROP TABLE IF EXISTS walk_in_appointments CASCADE;

-- 2. ADD stylist_id column to orders table (to track which stylist handled the order)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stylist_id UUID REFERENCES stylists(id);

-- 3. CREATE INDEX for better performance on stylist queries
CREATE INDEX IF NOT EXISTS idx_orders_stylist_id ON orders(stylist_id);

-- Note: The 'stylists' table should already exist from previous implementation
-- If it doesn't exist, create it with:
/*
CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  specialization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
*/

-- SUMMARY OF CHANGES:
-- ✅ Removed walk-in appointments functionality
-- ✅ Added stylist tracking to orders
-- ✅ Products and Services remain in the system
-- ✅ Inventory management removed from admin (but products table still exists)
