-- Seed sample data for E-Commerce Application

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
  ('user1@example.com', '$2a$12$...hash1...', 'Ahmed', 'Hassan', '0612345678'),
  ('user2@example.com', '$2a$12$...hash2...', 'Fatima', 'Ali', '0687654321'),
  ('user3@example.com', '$2a$12$...hash3...', 'Mohammed', 'Ibrahim', '0698765432')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, stock, image_url) VALUES
  ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 'Electronics', 50, '/images/laptop.jpg'),
  ('Mouse', 'Wireless mouse with precision tracking', 29.99, 'Electronics', 200, '/images/mouse.jpg'),
  ('Keyboard', 'Mechanical keyboard with RGB lighting', 129.99, 'Electronics', 100, '/images/keyboard.jpg'),
  ('Monitor', '4K Ultra HD Monitor 27 inch', 399.99, 'Electronics', 30, '/images/monitor.jpg'),
  ('Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics', 75, '/images/headphones.jpg'),
  ('USB Cable', 'Premium USB-C charging cable', 19.99, 'Accessories', 500, '/images/usb-cable.jpg'),
  ('Phone Stand', 'Adjustable phone stand for desk', 24.99, 'Accessories', 150, '/images/phone-stand.jpg'),
  ('Laptop Stand', 'Ergonomic laptop stand', 49.99, 'Accessories', 80, '/images/laptop-stand.jpg')
ON CONFLICT DO NOTHING;

-- Insert sample orders (optional - add after users exist)
-- INSERT INTO orders (user_id, total_amount, status) VALUES
--   ((SELECT id FROM users WHERE email = 'user1@example.com' LIMIT 1), 1329.98, 'completed'),
--   ((SELECT id FROM users WHERE email = 'user2@example.com' LIMIT 1), 199.99, 'pending')
-- ON CONFLICT DO NOTHING;
