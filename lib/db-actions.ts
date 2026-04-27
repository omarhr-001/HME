'use server';

import { supabase, supabaseAdmin } from './supabase';
import { revalidateTag } from 'next/cache';

// Product Actions
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return data;
}

export async function getProducts() {
  return getAllProducts();
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch product: ${error.message}`);
  return data;
}

// User Actions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to fetch user profile: ${error.message}`);
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  revalidateTag('user-profile');
  return data;
}

// Order Actions
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

export async function createOrder(userId: string, items: any[], totalAmount: number) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ user_id: userId, total_amount: totalAmount, status: 'pending' }])
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to add order items: ${itemsError.message}`);

  revalidateTag('user-orders');
  return order;
}

// Cart Actions
export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to fetch cart: ${error.message}`);
  return data;
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert([{ user_id: userId, product_id: productId, quantity }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add to cart: ${error.message}`);
  revalidateTag('cart-items');
  return data;
}

export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) throw new Error(`Failed to remove from cart: ${error.message}`);
  revalidateTag('cart-items');
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update cart: ${error.message}`);
  revalidateTag('cart-items');
  return data;
}

// Address Actions
export async function getUserAddresses(userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to fetch addresses: ${error.message}`);
  return data;
}

export async function addAddress(userId: string, address: any) {
  const { data, error } = await supabase
    .from('addresses')
    .insert([{ user_id: userId, ...address }])
    .select()
    .single();

  if (error) throw new Error(`Failed to add address: ${error.message}`);
  revalidateTag('user-addresses');
  return data;
}

// Review Actions
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(first_name, last_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
  return data;
}

export async function createReview(productId: string, userId: string, rating: number, comment: string) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ product_id: productId, user_id: userId, rating, comment }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create review: ${error.message}`);
  revalidateTag('product-reviews');
  return data;
}
