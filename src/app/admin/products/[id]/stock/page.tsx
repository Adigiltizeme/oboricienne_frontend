'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
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

interface StockHistory {
  id: string;
  productId: string;
  quantityChange: number;
  quantityAfter: number;
  reason: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function ProductStock() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [updating, setUpdating] = useState(false);
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [quickAdjust, setQuickAdjust] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role || '')) {
      router.push('/');
      return;
    }

    loadProduct();
  }, [user, authLoading, router, productId]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data) {
        const productData = res.data.data;
        setProduct(productData);
        setStockQuantity(productData.stockQuantity?.toString() || '');
        setLowStockThreshold(productData.lowStockThreshold?.toString() || '5');
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = () => {
    if (!product || product.stockQuantity === null) return 'unlimited';
    if (product.stockQuantity === 0) return 'out';
    if (product.stockQuantity <= (product.lowStockThreshold || 5)) return 'low';
    return 'ok';
  };

  const getStatusBadge = () => {
    const status = getStockStatus();
    switch (status) {
      case 'unlimited':
        return (
          <span className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
            📦 Stock Illimité
          </span>
        );
      case 'out':
        return (
          <span className="px-4 py-2 text-sm font-medium bg-red-100 text-red-800 rounded-full">
            ❌ Épuisé
          </span>
        );
      case 'low':
        return (
          <span className="px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
            ⚠️ Stock Faible
          </span>
        );
      case 'ok':
        return (
          <span className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            ✅ Stock OK
          </span>
        );
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuantity = parseInt(stockQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Quantité invalide');
      return;
    }

    const newThreshold = parseInt(lowStockThreshold);
    if (isNaN(newThreshold) || newThreshold < 0) {
      alert('Seuil invalide');
      return;
    }

    setUpdating(true);
    try {
      const res = await api.patch(
        `/admin/products/${productId}/stock`,
        {
          stockQuantity: newQuantity,
          lowStockThreshold: newThreshold
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Stock mis à jour avec succès !');
        loadProduct();
      }
    } catch (error: any) {
      console.error('Erreur mise à jour stock:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du stock');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickAdjust = async () => {
    if (!product || product.stockQuantity === null) return;

    const adjustment = parseInt(quickAdjust);
    if (isNaN(adjustment)) {
      alert('Ajustement invalide');
      return;
    }

    const newQuantity = Math.max(0, product.stockQuantity + adjustment);
    setStockQuantity(newQuantity.toString());
    setQuickAdjust('');
  };

  const handleSetUnlimited = async () => {
    if (!confirm('Définir ce produit comme ayant un stock illimité ?')) return;

    setUpdating(true);
    try {
      const res = await api.patch(
        `/admin/products/${productId}/stock`,
        { stockQuantity: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Produit défini comme stock illimité !');
        loadProduct();
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Produit non trouvé</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📦 Gestion du Stock</h1>
              <p className="text-gray-600 mt-2">
                {product.name} • <span className="text-sm text-gray-500">{product.category.name}</span>
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Retour
            </button>
          </div>

          {/* Statut actuel */}
          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {product.stockQuantity !== null && (
              <div className="text-gray-600">
                <span className="font-semibold text-2xl text-gray-900">
                  {product.stockQuantity}
                </span>
                {' '}unités en stock
              </div>
            )}
          </div>
        </div>

        {/* Cartes d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Stock Actuel</div>
            <div className="text-3xl font-bold text-gray-900">
              {product.stockQuantity !== null ? product.stockQuantity : '∞'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {product.stockQuantity !== null ? 'unités' : 'Illimité'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Seuil d'Alerte</div>
            <div className="text-3xl font-bold text-orange-600">
              {product.lowStockThreshold || '-'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {product.lowStockThreshold ? 'unités minimum' : 'Non défini'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Disponibilité</div>
            <div className="text-3xl font-bold">
              {product.isAvailable ? '✅' : '❌'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {product.isAvailable ? 'Disponible' : 'Indisponible'}
            </div>
          </div>
        </div>

        {/* Formulaire de mise à jour */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Mettre à Jour le Stock</h2>

          <form onSubmit={handleUpdateStock} className="space-y-6">
            {/* Ajustement rapide */}
            {product.stockQuantity !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ajustement Rapide
                </label>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setStockQuantity(Math.max(0, parseInt(stockQuantity || '0') - 50).toString())}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      -50
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockQuantity(Math.max(0, parseInt(stockQuantity || '0') - 10).toString())}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockQuantity(Math.max(0, parseInt(stockQuantity || '0') - 1).toString())}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      -1
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setStockQuantity((parseInt(stockQuantity || '0') + 1).toString())}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockQuantity((parseInt(stockQuantity || '0') + 10).toString())}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockQuantity((parseInt(stockQuantity || '0') + 50).toString())}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                    >
                      +50
                    </button>
                  </div>
                  <input
                    type="number"
                    value={quickAdjust}
                    onChange={(e) => setQuickAdjust(e.target.value)}
                    placeholder="Autre..."
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleQuickAdjust}
                    disabled={!quickAdjust}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajuster
                  </button>
                </div>
              </div>
            )}

            {/* Quantité exacte */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité en Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ex: 50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Laissez vide ou utilisez le bouton "Illimité" pour un stock non géré
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seuil d'Alerte Stock Faible
                </label>
                <input
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ex: 5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous serez alerté quand le stock descend sous ce seuil
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Mise à jour...' : 'Enregistrer les Modifications'}
              </button>
              <button
                type="button"
                onClick={handleSetUnlimited}
                disabled={updating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Définir comme Illimité
              </button>
            </div>
          </form>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">À propos de la gestion du stock</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Le stock est automatiquement décrémenté lors des commandes</li>
                  <li>Une alerte apparaît sur le dashboard quand le stock est faible</li>
                  <li>Les produits avec stock à 0 peuvent être automatiquement marqués indisponibles</li>
                  <li>Le stock illimité signifie que le produit n'a pas de limite de quantité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
