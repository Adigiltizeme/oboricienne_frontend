'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  stockQuantity: number | null;
  lowStockThreshold: number | null;
  isAvailable: boolean;
  category: {
    name: string;
  };
}

interface StockUpdate {
  productId: string;
  quantity: number;
}

export default function StockManagement() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (authLoading) return;

    if (!user || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role || '')) {
      router.push('/');
      return;
    }

    loadProducts();
  }, [user, authLoading, router]);

  const loadProducts = async () => {
    try {
      const res = await api.get('/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setProducts(res.data.data.products);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === null) return 'unlimited';
    if (product.stockQuantity === 0) return 'out';
    if (product.stockQuantity <= (product.lowStockThreshold || 5)) return 'low';
    return 'ok';
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'unlimited':
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Illimité</span>;
      case 'out':
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Épuisé</span>;
      case 'low':
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Stock Faible</span>;
      case 'ok':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Stock OK</span>;
      default:
        return null;
    }
  };

  const handleQuickUpdate = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stockQuantity === null) return;

    const newQuantity = Math.max(0, product.stockQuantity + change);
    await updateStock(productId, newQuantity);
  };

  const handleManualUpdate = async (productId: string) => {
    const newQuantity = parseInt(stockUpdates[productId]);
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Quantité invalide');
      return;
    }

    await updateStock(productId, newQuantity);
    setStockUpdates(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    setUpdating(productId);
    try {
      const res = await api.patch(
        `/admin/products/${productId}/stock`,
        { stockQuantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        loadProducts();
      }
    } catch (error: any) {
      console.error('Erreur mise à jour stock:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du stock');
    } finally {
      setUpdating(null);
    }
  };

  const lowStockProducts = products.filter(p => getStockStatus(p) === 'low' || getStockStatus(p) === 'out');
  const managedProducts = products.filter(p => p.stockQuantity !== null);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Gestion du Stock</h1>
            <p className="text-gray-600 mt-2">
              {managedProducts.length} produit(s) avec stock géré
            </p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Retour
          </button>
        </div>

        {/* Alertes Stock Faible */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Alerte Stock ({lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''})
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {lowStockProducts.slice(0, 5).map(product => (
                      <li key={product.id}>
                        {product.name} - {product.stockQuantity === 0 ? 'Épuisé' : `${product.stockQuantity} unités restantes`}
                      </li>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <li className="font-medium">+ {lowStockProducts.length - 5} autre(s) produit(s)</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock OK</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {products.filter(p => getStockStatus(p) === 'ok').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Faible</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {products.filter(p => getStockStatus(p) === 'low').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Épuisé</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {products.filter(p => getStockStatus(p) === 'out').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Illimité</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {products.filter(p => getStockStatus(p) === 'unlimited').length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actuel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seuil Alerte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const status = getStockStatus(product);
                  const isUpdating = updating === product.id;

                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 ${status === 'out' ? 'bg-red-50' : status === 'low' ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stockQuantity !== null ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              status === 'out' ? 'text-red-600' :
                              status === 'low' ? 'text-yellow-600' :
                              'text-gray-900'
                            }`}>
                              {product.stockQuantity} unités
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Non géré</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.lowStockThreshold || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStockBadge(status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stockQuantity !== null ? (
                          <div className="flex items-center gap-2">
                            {/* Boutons rapides */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleQuickUpdate(product.id, -10)}
                                disabled={isUpdating || product.stockQuantity < 10}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -10
                              </button>
                              <button
                                onClick={() => handleQuickUpdate(product.id, -1)}
                                disabled={isUpdating || product.stockQuantity === 0}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickUpdate(product.id, 1)}
                                disabled={isUpdating}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleQuickUpdate(product.id, 10)}
                                disabled={isUpdating}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +10
                              </button>
                            </div>

                            {/* Input manuel */}
                            <div className="flex gap-1">
                              <input
                                type="number"
                                min="0"
                                value={stockUpdates[product.id] ?? ''}
                                onChange={(e) => setStockUpdates(prev => ({
                                  ...prev,
                                  [product.id]: e.target.value
                                }))}
                                placeholder={product.stockQuantity.toString()}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isUpdating}
                              />
                              <button
                                onClick={() => handleManualUpdate(product.id)}
                                disabled={isUpdating || !stockUpdates[product.id]}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
