# Database Setup Instructions

## ✅ Changes Made

Your app has been updated to **display products only from the Supabase database** instead of from JSON files. The following changes were implemented:

### Modified Components:
1. **`ProductsSection`** - Now fetches products from `/api/products` endpoint
2. **`ProductPage`** - Dynamically loads product details from database
3. **`ProductCard`** - Uses database data with proper null checking
4. **`ProductDetailsModal`** - Updated to handle database product structure
5. **API Routes** - Added `dynamic = 'force-dynamic'` flag for real-time data fetching

### Database Integration:
- Products are now fetched via REST API
- Support for database fields: `id`, `name`, `price`, `category`, `image_url`, `stock_quantity`, `description`, `specs`
- Category filtering works dynamically from database records

---

## 🗄️ Database Setup

### Step 1: Create the Products Table

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
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
```

6. Click **Run** to execute the query

### Step 2: Populate Sample Data (Optional)

After creating the table, run this command to automatically add sample products:

```bash
npm run setup-db
```

Or manually insert products using this SQL:

```sql
INSERT INTO products (name, description, price, category, stock_quantity, image_url, is_active) VALUES
  ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop', true),
  ('Mouse', 'Wireless mouse with precision tracking', 29.99, 'Electronics', 200, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', true),
  ('Keyboard', 'Mechanical keyboard with RGB lighting', 129.99, 'Electronics', 100, 'https://images.unsplash.com/photo-1587829191301-4f34603b614b?w=500&h=500&fit=crop', true),
  ('Monitor', '4K Ultra HD Monitor 27 inch', 399.99, 'Electronics', 30, 'https://images.unsplash.com/photo-1545239351-ef35ac4a4038?w=500&h=500&fit=crop', true),
  ('Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics', 75, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', true),
  ('USB Cable', 'Premium USB-C charging cable', 19.99, 'Accessories', 500, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop', true),
  ('Phone Stand', 'Adjustable phone stand for desk', 24.99, 'Accessories', 150, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', true),
  ('Laptop Stand', 'Ergonomic laptop stand', 49.99, 'Accessories', 80, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', true);
```

---

## 📦 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Setup database with sample data
npm run setup-db
```

---

## 🎯 How It Works

### Data Flow:
1. **Frontend Components** → Request from `/api/products` or `/api/products/[id]`
2. **API Routes** → Fetch from Supabase database
3. **Supabase Database** → Return product data
4. **Components** → Display products dynamically

### Component Updates:
- **ProductsSection**: Fetches products on mount via `useEffect`
- **ProductPage**: Loads single product by ID from database
- **Product Categories**: Dynamically generated from database records
- All components now handle `null` values gracefully

---

## 🔒 Row Level Security (RLS)

The database policy allows:
- ✅ Anyone can read products where `is_active = true`
- ❌ Users cannot modify products (admin only)

---

## ✨ Next Steps

1. Create the table in Supabase SQL Editor
2. Run `npm run setup-db` to add sample data
3. Refresh your application - products should now load from the database!
4. You can manage products in Supabase Table Editor

Enjoy your database-driven product catalog! 🚀
