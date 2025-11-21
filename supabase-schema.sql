-- Create tables for the POS system

-- Stylists table
CREATE TABLE stylists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Walk-in appointments table
CREATE TABLE walk_in_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  service TEXT NOT NULL,
  stylist_id UUID REFERENCES stylists(id),
  appointment_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Sales/Transactions table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  service TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders table (for the POS cart system)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE walk_in_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
-- For now, allowing all operations for testing

-- Stylists policies
CREATE POLICY "Enable read access for all users" ON stylists FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON stylists FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON stylists FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON stylists FOR DELETE USING (true);

-- Products policies
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON products FOR DELETE USING (true);

-- Services policies
CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON services FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON services FOR DELETE USING (true);

-- Walk-in appointments policies
CREATE POLICY "Enable read access for all users" ON walk_in_appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON walk_in_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON walk_in_appointments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON walk_in_appointments FOR DELETE USING (true);

-- Sales policies
CREATE POLICY "Enable read access for all users" ON sales FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON sales FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON sales FOR DELETE USING (true);

-- Orders policies
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON orders FOR DELETE USING (true);

-- Insert initial services data
INSERT INTO services (title, description, price) VALUES
  ('Haircut and Styling', 'Professional haircut with styling', 500.00),
  ('Color and Highlights', 'Hair coloring and highlights service', 1200.00),
  ('Perm and Straightening', 'Hair perm or straightening treatment', 1500.00),
  ('Deep Conditioning', 'Intensive hair conditioning treatment', 800.00),
  ('Keratin Treatment', 'Professional keratin hair treatment', 2500.00),
  ('Hair Spa', 'Relaxing hair spa treatment', 1500.00);
