-- Insert services data only
-- Run this if tables already exist

INSERT INTO services (title, description, price) VALUES
  ('Haircut and Styling', 'Professional haircut with styling', 500.00),
  ('Color and Highlights', 'Hair coloring and highlights service', 1200.00),
  ('Perm and Straightening', 'Hair perm or straightening treatment', 1500.00),
  ('Deep Conditioning', 'Intensive hair conditioning treatment', 800.00),
  ('Keratin Treatment', 'Professional keratin hair treatment', 2500.00),
  ('Hair Spa', 'Relaxing hair spa treatment', 1500.00)
ON CONFLICT DO NOTHING;
