-- Migration: Improve Services Table
-- Add missing columns for better service management

-- Add new columns to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS duration integer, -- duration in minutes
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS image_url text;

-- Add index for active services
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- Add index for category
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Add check constraint for duration
ALTER TABLE services
ADD CONSTRAINT check_duration_positive CHECK (duration > 0);

-- Update existing services to be active
UPDATE services SET is_active = true WHERE is_active IS NULL;

-- Set default duration for existing services (60 minutes)
UPDATE services SET duration = 60 WHERE duration IS NULL;

-- Add comments
COMMENT ON COLUMN services.duration IS 'Service duration in minutes';
COMMENT ON COLUMN services.category IS 'Service category: haircut, coloring, treatment, styling, spa';
COMMENT ON COLUMN services.is_active IS 'Whether the service is available for booking';
