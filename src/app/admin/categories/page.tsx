'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  productsCount: number;
}

export default function CategoriesManagement() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreate = async () => {
    if (!formData.name) {
      alert('Le nom est requis');
      return;
    }

    try {
      const res = await api.post('/admin/categories', {
        ...formData,
        slug: formData.slug || generateSlug(formData.name)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert('Catégorie créée avec succès !');
        setIsCreating(false);
        setFormData({ name: '', slug: '', description: '' });
        loadCategories();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await api.put(`/admin/categories/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert('Catégorie mise à jour !');
        setEditingId(null);
        setFormData({ name: '', slug: '', description: '' });
        loadCategories();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ? Tous les produits associés seront affectés.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert('Catégorie supprimée !');
        loadCategories();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏷️ Gestion des Catégories</h1>
            <p className="text-gray-600 mt-2">{categories.length} catégorie(s)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Retour
            </button>
            <button
              onClick={() => {
                setIsCreating(true);
                setFormData({ name: '', slug: '', description: '' });
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              + Nouvelle Catégorie
            </button>
          </div>
        </div>

        {/* Formulaire création/édition */}
        {(isCreating || editingId) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {isCreating ? 'Nouvelle Catégorie' : 'Modifier la Catégorie'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: Burgers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  placeholder="burgers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({ name: '', slug: '', description: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => isCreating ? handleCreate() : handleUpdate(editingId!)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  {isCreating ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des catégories */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{category.productsCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => startEdit(category)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune catégorie trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
