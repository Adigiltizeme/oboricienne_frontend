'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string | null;
  isAvailable: boolean;
  stockQuantity: number | null;
  lowStockThreshold: number | null;
  isPopular: boolean;
  isPromo: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsAdmin() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  useEffect(() => {
    if (!user || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role || '')) {
      router.push('/');
      return;
    }

    loadData();
  }, [user, router, filterCategory, filterAvailability]);

  const loadData = async () => {
    try {
      const params: any = {};
      if (filterCategory) params.categoryId = filterCategory;
      if (filterAvailability) params.isAvailable = filterAvailability;
      if (searchTerm) params.search = searchTerm;

      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/products', {
          params,
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.data.products);
      }
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await api.patch(
        `/admin/products/${productId}/availability`,
        { isAvailable: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        loadData();
      }
    } catch (error) {
      console.error('Erreur toggle disponibilité:', error);
      alert('Erreur lors de la mise à jour de la disponibilité');
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return;
    }

    try {
      const response = await api.delete(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(response.data.message);
        loadData();
      }
    } catch (error) {
      console.error('Erreur suppression produit:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} produit(s) trouvé(s)
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Retour
              </Link>
              <Link
                href="/admin/products/new"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                + Nouveau Produit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filtre catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Filtre disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité
              </label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tous</option>
                <option value="true">Disponibles</option>
                <option value="false">Indisponibles</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">?</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                              {product.isPromo && (
                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                  PROMO
                                </span>
                              )}
                              {product.isPopular && (
                                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                                  POPULAIRE
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.price.toFixed(2)}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stockQuantity !== null ? (
                          <div className="text-sm">
                            <span
                              className={`font-medium ${
                                product.stockQuantity <= (product.lowStockThreshold || 5)
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {product.stockQuantity}
                            </span>
                            <span className="text-gray-500 ml-1">unités</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Non géré</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAvailability(product.id, product.isAvailable)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition`}
                        >
                          {product.isAvailable ? 'Disponible' : 'Indisponible'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/stock`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Stock
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id, product.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
