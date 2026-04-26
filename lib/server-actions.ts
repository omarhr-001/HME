// Example Server Action for adding a product to the cart
'use server'

import { db } from '@/lib/db'
import type { CartItem } from '@/lib/types'

export async function addToCart(
  userId: number,
  productId: number,
  quantity: number
): Promise<CartItem | null> {
  try {
    const result = await db.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET 
        quantity = cart_items.quantity + $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [userId, productId, quantity]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Example Server Action for removing from cart
export async function removeFromCart(
  userId: number,
  productId: number
): Promise<boolean> {
  try {
    const result = await db.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )
    return result.rowCount > 0
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

// Example Server Action for getting cart items
export async function getCartItems(userId: number) {
  try {
    const result = await db.query(
      `
      SELECT 
        ci.*,
        p.name,
        p.price,
        p.image_url,
        (ci.quantity * p.price) as total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
      `,
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

// Example Server Action for creating an order
export async function createOrderFromCart(userId: number) {
  try {
    // Get cart items
    const cartResult = await db.query(
      `
      SELECT 
        ci.*,
        p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      `,
      [userId]
    )

    if (cartResult.rows.length === 0) {
      throw new Error('Cart is empty')
    }

    // Calculate total
    const total = cartResult.rows.reduce(
      (sum, item) => sum + (item.quantity * item.price),
      0
    )

    // Create order
    const orderResult = await db.query(
      `
      INSERT INTO orders (user_id, order_number, total_amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, `ORD-${Date.now()}`, total, 'pending']
    )

    const orderId = orderResult.rows[0].id

    // Add order items
    for (const item of cartResult.rows) {
      await db.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [orderId, item.product_id, item.quantity, item.price, item.quantity * item.price]
      )
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId])

    return orderResult.rows[0]
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}
