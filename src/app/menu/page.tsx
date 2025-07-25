'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, Product, Category, formatPrice, getImageUrl } from '../../lib/api';
import Header from '../../components/Header';
import { getCategoryEmoji } from '@/helpers/getCategoryEmoji';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtres avancés
    const [showVegetarian, setShowVegetarian] = useState(false);
    const [showVegan, setShowVegan] = useState(false);
    const [showSpicy, setShowSpicy] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 25]);

    const { addItem } = useCart();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    fetchProducts(),
                    fetchCategories()
                ]);
                setProducts(productsData.products);
                setCategories(categoriesData.categories);
                setFilteredProducts(productsData.products);
            } catch (err) {
                setError('Erreur lors du chargement du menu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Fonction de filtrage
    useEffect(() => {
        let filtered = [...products];

        // Filtre par catégorie
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category.slug === selectedCategory);
        }

        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtres spéciaux
        if (showVegetarian) {
            filtered = filtered.filter(product => product.isVegetarian);
        }
        if (showVegan) {
            filtered = filtered.filter(product => product.isVegan);
        }
        if (showSpicy) {
            filtered = filtered.filter(product => product.isSpicy);
        }

        // Filtre par prix
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Tri
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'popularity':
                    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchTerm, showVegetarian, showVegan, showSpicy, priceRange, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-red-600 rounded-full"></div>
                        <p className="mt-4 text-gray-600">Chargement du menu O'Boricienne...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center text-red-600">
                        <h2 className="text-2xl font-bold mb-4">Oups ! Une erreur est survenue</h2>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg"
                        >
                            Recharger
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section Menu */}
            <section className="pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                            NOTRE MENU
                        </span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-yellow-400 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Créations street art pour tous les goûts. L'art du burger de rue, sans compromis !
                    </p>

                    {/* Stats rapides */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-2xl font-black text-yellow-400">{products.length}</div>
                            <div className="text-sm text-gray-300">Créations</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-yellow-400">{categories.length}</div>
                            <div className="text-sm text-gray-300">Univers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-yellow-400">{products.filter(p => p.isVegetarian).length}</div>
                            <div className="text-sm text-gray-300">Végé</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-yellow-400">{products.filter(p => p.isPopular).length}</div>
                            <div className="text-sm text-gray-300">Hits</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filtres et Recherche */}
            <section className="bg-white shadow-lg sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

                    {/* Barre de recherche - Mobile first */}
                    <div className="mb-4">
                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-full focus:border-red-500 focus:outline-none text-sm sm:text-lg"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </div>
                        </div>
                    </div>

                    {/* Filtres catégories - Horizontal scroll sur mobile */}
                    <div className="mb-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors text-sm ${selectedCategory === 'all'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tout ({products.length})
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors text-sm ${selectedCategory === category.slug
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name} ({category.productsCount})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtres avancés - Collapsibles sur mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                        {/* Filtres spéciaux - Responsive */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showVegetarian}
                                    onChange={(e) => setShowVegetarian(e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-xs sm:text-sm font-medium">🌱 Végé</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showVegan}
                                    onChange={(e) => setShowVegan(e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-xs sm:text-sm font-medium">🌿 Vegan</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showSpicy}
                                    onChange={(e) => setShowSpicy(e.target.checked)}
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-xs sm:text-sm font-medium">🌶️ Épicé</span>
                            </label>
                        </div>

                        {/* Tri - Compact sur mobile */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Trier :</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popularity')}
                                className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                            >
                                <option value="name">Nom</option>
                                <option value="price">Prix</option>
                                <option value="popularity">Popularité</option>
                            </select>
                        </div>
                    </div>

                    {/* Compteur de résultats - Plus compact */}
                    <div className="mt-3 text-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                            {filteredProducts.length} création(s)
                            {selectedCategory !== 'all' && (
                                <span className="ml-1">
                                    · <strong>{categories.find(c => c.slug === selectedCategory)?.name}</strong>
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </section>

            {/* CSS à ajouter pour cacher la scrollbar sur mobile */}
            <style jsx>
                {`.scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }`}
            </style>

            {/* Grille des produits */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                            <p className="text-gray-600 mb-6">
                                Essayez de modifier vos filtres ou votre recherche
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchTerm('');
                                    setShowVegetarian(false);
                                    setShowVegan(false);
                                    setShowSpicy(false);
                                }}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product, index) => (
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

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold mb-4">Une question sur notre menu ?</h2>
                    <p className="text-gray-300 mb-8">
                        Notre équipe est là pour vous conseiller et personnaliser votre commande
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
                            Nous contacter
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-colors">
                            Commander par téléphone
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}