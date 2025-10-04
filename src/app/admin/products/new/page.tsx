'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
}

export default function NewProduct() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    isAvailable: true,
    isPopular: false,
    isPromo: false,
    isSpicy: false,
    isVegetarian: false,
    isVegan: false,
    preparationTime: '15',
    stockQuantity: '',
    lowStockThreshold: '5'
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role || '')) {
      router.push('/');
      return;
    }

    loadCategories();
  }, [user, authLoading, router]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Générer le slug automatiquement depuis le nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Format non supporté (JPG, PNG, WEBP uniquement)');
      return;
    }

    setUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await api.post('/upload/image', uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl || null,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular,
        isPromo: formData.isPromo,
        isSpicy: formData.isSpicy,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        preparationTime: parseInt(formData.preparationTime),
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : null
      };

      const response = await api.post('/admin/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Produit créé avec succès !');
        router.push('/admin/products');
      }
    } catch (error: any) {
      console.error('Erreur création produit:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création du produit');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">✨ Nouveau Produit</h1>
          <p className="text-gray-600 mt-2">Ajouter un nouveau produit au menu</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">

          {/* Informations de base */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Informations de base</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Big OBB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                placeholder="big-obb"
              />
              <p className="text-xs text-gray-500 mt-1">Généré automatiquement depuis le nom</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Description détaillée du produit..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="7.50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temps de préparation (min) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.preparationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Image du produit</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload d'image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP (max 5MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://..."
              />
            </div>

            {formData.imageUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Aperçu :</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Attributs */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Attributs du produit</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">Disponible</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">🔥 Populaire</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPromo}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPromo: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">🎯 En promo</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isSpicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, isSpicy: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">🌶️ Épicé</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVegetarian}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">🌱 Végétarien</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVegan}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">🌿 Végan</span>
              </label>
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Gestion du stock</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Laisser vide si illimité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil d'alerte stock faible
                </label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Création...' : uploadingImage ? 'Upload en cours...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
