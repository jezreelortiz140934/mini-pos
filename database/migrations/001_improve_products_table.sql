-- Migration: Improve Products Table
-- Add missing columns for better product management

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS supplier text,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS description text;

-- Add index for active products
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Add index for category
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Add check constraint for stock
ALTER TABLE products
ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);

-- Update existing products to be active
UPDATE products SET is_active = true WHERE is_active IS NULL;

-- Add comment
COMMENT ON COLUMN products.category IS 'Product category: shampoo, conditioner, styling, treatment, tools';
COMMENT ON COLUMN products.is_active IS 'Whether the product is available for sale';
COMMENT ON COLUMN products.supplier IS 'Product supplier or brand name';
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit for inventory tracking';
