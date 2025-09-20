'use client';

import { useState, useEffect } from 'react';
import { fetchPopularProducts, Product, formatPrice, getImageUrl } from '../lib/api';
import { useCart } from '@/contexts/CartContext';
import ProductCard from './ProductCard';

export default function PopularProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { addItem } = useCart();

    useEffect(() => {
        const loadPopularProducts = async () => {
            try {
                console.log('🔄 Chargement des produits populaires depuis Railway...');
                const data = await fetchPopularProducts();
                setProducts(data.products);
                console.log('✅ Produits populaires chargés depuis Railway:', data.products.length, 'produits');
                console.log('📋 Produits populaires:', data.products.map(p => p.name));
            } catch (err) {
                setError('Erreur lors du chargement des produits populaires');
                console.error('❌ Erreur produits populaires:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPopularProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-red-600 rounded-full"></div>
                        <p className="mt-4 text-gray-600">Chargement des produits populaires...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-600">
                            NOS HITS
                        </span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Les créations O'Boricienne qui font vibrer Évreux.
                        Goûtez l'art du burger de rue !
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products
                        .filter((product) => product.isAvailable !== false)
                        .map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                variant="featured"
                            />
                        ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-12">
                    <button
                        className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl"
                        onClick={() => window.location.href = '/menu'}
                    >
                        Voir tout le menu
                    </button>
                </div>
            </div>
        </section>
    );
}