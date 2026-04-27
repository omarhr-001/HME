import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl ? 'Set' : 'Missing');
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🗄️  Setting up database schema...\n');

  try {
    // Create products table
    console.log('📝 Creating products table...');
    const { error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (productsError && productsError.code === 'PGRST116') {
      // Table doesn't exist, we need to create it via SQL
      console.log('ℹ️  Products table does not exist.');
      console.log('\n⚠️  Please run the following SQL in your Supabase SQL Editor:\n');
      
      const sqlScript = `
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100),
  image_url VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read" ON products
  FOR SELECT USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, category, stock_quantity, image_url) VALUES
  ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop'),
  ('Mouse', 'Wireless mouse with precision tracking', 29.99, 'Electronics', 200, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'),
  ('Keyboard', 'Mechanical keyboard with RGB lighting', 129.99, 'Electronics', 100, 'https://images.unsplash.com/photo-1587829191301-4f34603b614b?w=500&h=500&fit=crop'),
  ('Monitor', '4K Ultra HD Monitor 27 inch', 399.99, 'Electronics', 30, 'https://images.unsplash.com/photo-1545239351-ef35ac4a4038?w=500&h=500&fit=crop'),
  ('Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics', 75, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'),
  ('USB Cable', 'Premium USB-C charging cable', 19.99, 'Accessories', 500, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'),
  ('Phone Stand', 'Adjustable phone stand for desk', 24.99, 'Accessories', 150, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'),
  ('Laptop Stand', 'Ergonomic laptop stand', 49.99, 'Accessories', 80, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop');
      `;
      
      console.log(sqlScript);
      console.log('\n\n✅ After running the SQL above, your database will be ready!');
      return false;
    } else if (productsError) {
      console.error('Error checking products table:', productsError);
      return false;
    } else {
      console.log('✅ Products table exists');
      
      // Check if we have sample data
      const { data, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact' });
      
      if (countError) {
        console.error('Error counting products:', countError);
      } else if (data && data.length === 0) {
        console.log('⚠️  Products table is empty. Insert sample data to get started.');
      } else {
        console.log(`✅ Database is ready! Found ${data?.length || 0} products.`);
      }
      return true;
    }
  } catch (error) {
    console.error('Setup error:', error);
    return false;
  }
}

setupDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
