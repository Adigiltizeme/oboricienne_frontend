'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductsByCategory, Product, formatPrice, getImageUrl, Category } from '../../../lib/api';
import Header from '../../../components/Header';
import { getCategoryEmoji, getCategoryName } from '@/helpers/getCategoryEmoji';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categorySlug = params.category as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { addItem } = useCart();

    useEffect(() => {
        const loadCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProductsByCategory(categorySlug);

                const enrichedProducts = data.products.map(product => ({
                    ...product,
                    category: data.category || {
                        id: '',
                        name: getCategoryName(categorySlug), // Fonction helper
                        slug: categorySlug
                    }
                }));

                setProducts(enrichedProducts);
                setCategory(data.category);
            } catch (err) {
                setError('Catégorie non trouvée');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug) {
            loadCategoryProducts();
        }
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-red-600 rounded-full"></div>
                        <p className="mt-4 text-gray-600">Chargement de la catégorie...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😵</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h2>
                        <p className="text-gray-600 mb-6">Cette catégorie n'existe pas ou a été supprimée</p>
                        <button
                            onClick={() => router.push('/menu')}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Retour au menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section Catégorie */}
            <section className="pt-20 bg-gradient-to-br from-gray-900 to-red-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <div className="flex items-center space-x-2 text-gray-300">
                            <button
                                onClick={() => router.push('/')}
                                className="hover:text-white transition-colors"
                            >
                                Accueil
                            </button>
                            <span>/</span>
                            <button
                                onClick={() => router.push('/menu')}
                                className="hover:text-white transition-colors"
                            >
                                Menu
                            </button>
                            <span>/</span>
                            <span className="text-yellow-400 font-medium">{category.name}</span>
                        </div>
                    </nav>

                    <div className="text-center">
                        <div className="text-8xl mb-6">{getCategoryEmoji(categorySlug)}</div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                                {category.name.toUpperCase()}
                            </span>
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-yellow-400 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                            {category.description}
                        </p>

                        {/* Stats catégorie */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-black text-yellow-400">{products.length}</div>
                                <div className="text-sm text-gray-300">Créations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-yellow-400">
                                    {products.filter(p => p.isPopular).length}
                                </div>
                                <div className="text-sm text-gray-300">Hits</div>
                            </div>
                            <div className="text-center md:col-span-1 col-span-2">
                                <div className="text-3xl font-black text-yellow-400">
                                    {Math.round(products.reduce((acc, p) => acc + p.preparationTime, 0) / products.length)}min
                                </div>
                                <div className="text-sm text-gray-300">Temps moyen</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation rapide */}
            <section className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/menu')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <span>←</span>
                            <span>Retour au menu complet</span>
                        </button>
                        <div className="text-gray-600">
                            <span className="font-medium">{products.length}</span> création(s)
                        </div>
                    </div>
                </div>
            </section>

            {/* Grille des produits */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {products.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">{getCategoryEmoji(categorySlug)}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit dans cette catégorie</h3>
                            <p className="text-gray-600 mb-6">
                                Cette catégorie est temporairement vide
                            </p>
                            <button
                                onClick={() => router.push('/menu')}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                Voir tout le menu
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    variant="default"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Autres catégories */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Découvrez nos autres univers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['smash-burgers', 'classiques', 'tacos', 'pizzas', 'boissons', 'desserts']
                            .filter(slug => slug !== categorySlug)
                            .map((slug) => (
                                <button
                                    key={slug}
                                    onClick={() => router.push(`/menu/${slug}`)}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="text-4xl mb-2">{getCategoryEmoji(slug)}</div>
                                    <div className="font-medium text-gray-900 capitalize">
                                        {slug.replace('-', ' ')}
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold mb-4">
                        Prêt à goûter nos {category.name.toLowerCase()} ?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Commandez maintenant et savourez l'art du burger de rue en 15 minutes !
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
                            Commander maintenant
                        </button>
                        <button
                            onClick={() => router.push('/menu')}
                            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-colors"
                        >
                            Voir tout le menu
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}