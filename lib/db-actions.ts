'use server';

import { query } from '@/lib/db';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  notes: string;
  created_at: string;
}

// Products functions
export async function getAllProducts() {
  try {
    const result = await query(
      'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] as Product | null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const result = await query(
      'SELECT * FROM products WHERE category = $1 AND is_active = true',
      [category]
    );
    return result.rows as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const result = await query(
      `INSERT INTO products (name, description, price, category, image_url, stock_quantity, sku, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.image_url,
        product.stock_quantity,
        product.sku,
        product.is_active,
      ]
    );
    return result.rows[0] as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Orders functions
export async function getUserOrders(userId: number) {
  try {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
      [userId]
    );
    return result.rows as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: number) {
  try {
    const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    return result.rows[0] as Order | null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function createOrder(
  userId: number,
  totalAmount: number,
  shippingAddress: string,
  notes?: string
) {
  try {
    const result = await query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, notes, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [userId, totalAmount, shippingAddress, notes || null]
    );
    return result.rows[0] as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    return result.rows[0] as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Users functions
export async function getUserById(id: number) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] as User | null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] as User | null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  phone?: string,
  address?: string,
  city?: string,
  postalCode?: string,
  country?: string
) {
  try {
    const result = await query(
      `INSERT INTO users (email, password, name, phone, address, city, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [email, password, name, phone || null, address || null, city || null, postalCode || null, country || null]
    );
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: number, updates: Partial<User>) {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
