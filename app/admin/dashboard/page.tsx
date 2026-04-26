'use client'

import { useEffect, useState } from 'react'
import type { Product, Order, User } from '@/lib/types'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('/api/products')
        if (!productsRes.ok) throw new Error('Failed to fetch products')
        const productsData: Product[] = await productsRes.json()
        setProducts(productsData)

        // Calculate stats
        const totalRevenue = productsData.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
        
        setStats({
          totalProducts: productsData.length,
          totalOrders: 0, // Would need to fetch this
          totalUsers: 0, // Would need to fetch this
          totalRevenue: totalRevenue
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8 text-center">Chargement...</div>
  if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tableau de Bord Admin</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Produits</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-green-600">{stats?.totalOrders || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Utilisateurs</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Revenu</p>
            <p className="text-3xl font-bold text-orange-600">
              ${(stats?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Produits</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Prix</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Catégorie</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{product.id}</td>
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-3">{product.stock_quantity}</td>
                    <td className="px-6 py-3">{product.category || 'N/A'}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
