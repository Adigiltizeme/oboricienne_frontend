'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, fetchPopularProducts, testApiConnection, Product, Category, formatPrice } from '../lib/api';

export default function ApiTest() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                setLoading(true);

                // Test de connexion
                console.log('🔄 Test de connexion API...');
                const connected = await testApiConnection();
                setIsConnected(connected);

                if (!connected) {
                    throw new Error('Impossible de se connecter à l\'API');
                }

                console.log('✅ Connexion API réussie');

                // Récupérer les catégories
                console.log('🔄 Récupération des catégories...');
                const categoriesData = await fetchCategories();
                setCategories(categoriesData.categories);
                console.log(`✅ ${categoriesData.categories.length} catégories récupérées`);

                // Récupérer tous les produits
                console.log('🔄 Récupération des produits...');
                const productsData = await fetchProducts();
                setProducts(productsData.products);
                console.log(`✅ ${productsData.products.length} produits récupérés`);

                // Récupérer les produits populaires
                console.log('🔄 Récupération des produits populaires...');
                const popularData = await fetchPopularProducts();
                setPopularProducts(popularData.products);
                console.log(`✅ ${popularData.products.length} produits populaires récupérés`);

            } catch (err) {
                console.error('❌ Erreur:', err);
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        testConnection();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-red-600 rounded-full" role="status">
                </div>
                <p className="mt-4 text-gray-600">Connexion à l'API O'Boricienne...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-800 mb-2">❌ Erreur de connexion API</h2>
                <p className="text-red-600">{error}</p>
                <div className="mt-4 text-sm text-red-500">
                    <p>Vérifiez que le backend est démarré sur http://localhost:5000</p>
                    <p>Commande: <code className="bg-red-100 px-2 py-1 rounded">npm run dev</code></p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">

            {/* Status de connexion */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-800 mb-2">✅ API O'Boricienne Connectée</h2>
                <p className="text-green-600">Backend opérationnel sur http://localhost:5000</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-800">{categories.length}</h3>
                    <p className="text-blue-600">Catégories</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-red-800">{products.length}</h3>
                    <p className="text-red-600">Produits Total</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-yellow-800">{popularProducts.length}</h3>
                    <p className="text-yellow-600">Produits Populaires</p>
                </div>
            </div>

            {/* Catégories */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">📂 Catégories O'Boricienne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{category.productsCount} produits</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Produits populaires */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Produits Populaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.filter(p => p.isSpicy || p.isVegetarian || p.isVegan).slice(0, 8).map((product) => (
                        <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                                <span className="text-red-600 font-bold text-sm">{formatPrice(product.price)}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{product.shortDescription}</p>
                            <div className="flex flex-wrap items-center gap-1 text-xs mt-2">
                                {product.isSpicy && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">🌶️ Épicé</span>}
                                {product.isVegetarian && <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">🌱 Végé</span>}
                                {product.isVegan && <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">🌿 Vegan</span>}
                                {product.isPopular && <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">🔥 Populaire</span>}
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">{product.category.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">⏱️ {product.preparationTime} min</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tous les produits (aperçu) */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">🍔 Tous les Produits (Aperçu)</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                        {products.slice(0, 12).map((product) => (
                            <div key={product.id} className="bg-white rounded p-2 text-center">
                                <p className="font-medium text-xs text-gray-800">{product.name}</p>
                                <p className="text-red-600 font-bold text-xs">{formatPrice(product.price)}</p>
                                <p className="text-gray-500 text-xs">{product.category.name}</p>
                            </div>
                        ))}
                    </div>
                    {products.length > 12 && (
                        <p className="text-center text-gray-500 text-sm mt-4">
                            ... et {products.length - 12} autres produits
                        </p>
                    )}
                </div>
            </div>

            {/* Debug info */}
            <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">🔧 Informations Debug</h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>API URL: http://localhost:5000/api</p>
                    <p>Statut: {isConnected ? '✅ Connecté' : '❌ Déconnecté'}</p>
                    <p>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</p>
                </div>
            </div>

        </div>
    );
}