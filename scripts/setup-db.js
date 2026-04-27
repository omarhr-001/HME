import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🗄️  Setting up database...\n');

  try {
    // Check if products table exists
    console.log('🔍 Checking if products table exists...');
    const { data: existing, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Products table already exists!\n');
      
      // Check record count
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Found ${count} products in the database`);
      
      if (count === 0) {
        console.log('\n⚠️  Database is empty. Adding sample products...');
        
        const sampleProducts = [
          {
            name: 'Laptop',
            description: 'High-performance laptop for work and gaming',
            price: 1299.99,
            category: 'Electronics',
            stock_quantity: 50,
            image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop'
          },
          {
            name: 'Mouse',
            description: 'Wireless mouse with precision tracking',
            price: 29.99,
            category: 'Electronics',
            stock_quantity: 200,
            image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'
          },
          {
            name: 'Keyboard',
            description: 'Mechanical keyboard with RGB lighting',
            price: 129.99,
            category: 'Electronics',
            stock_quantity: 100,
            image_url: 'https://images.unsplash.com/photo-1587829191301-4f34603b614b?w=500&h=500&fit=crop'
          },
          {
            name: 'Monitor',
            description: '4K Ultra HD Monitor 27 inch',
            price: 399.99,
            category: 'Electronics',
            stock_quantity: 30,
            image_url: 'https://images.unsplash.com/photo-1545239351-ef35ac4a4038?w=500&h=500&fit=crop'
          },
          {
            name: 'Headphones',
            description: 'Noise-cancelling wireless headphones',
            price: 199.99,
            category: 'Electronics',
            stock_quantity: 75,
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
          },
          {
            name: 'USB Cable',
            description: 'Premium USB-C charging cable',
            price: 19.99,
            category: 'Accessories',
            stock_quantity: 500,
            image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'
          },
          {
            name: 'Phone Stand',
            description: 'Adjustable phone stand for desk',
            price: 24.99,
            category: 'Accessories',
            stock_quantity: 150,
            image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
          },
          {
            name: 'Laptop Stand',
            description: 'Ergonomic laptop stand',
            price: 49.99,
            category: 'Accessories',
            stock_quantity: 80,
            image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
          }
        ];
        
        const { error: insertError } = await supabase
          .from('products')
          .insert(sampleProducts);
        
        if (insertError) {
          console.error('❌ Error inserting sample data:', insertError.message);
        } else {
          console.log('✅ Sample products added successfully!');
        }
      }
      
      console.log('\n✨ Database is ready to use!');
      return true;
    }

    if (checkError.code === 'PGRST205') {
      console.log('❌ Products table does not exist\n');
      console.log('📋 Please execute this SQL in your Supabase SQL Editor:');
      console.log('━'.repeat(60));
      console.log(`
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read" ON products
  FOR SELECT USING (is_active = true);
      `);
      console.log('━'.repeat(60));
      console.log('\n📌 After creating the table, run this script again to add sample data.');
      return false;
    }

    throw checkError;
  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
