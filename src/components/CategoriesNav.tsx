'use client';

import { useState, useEffect } from 'react';
import { fetchCategories, Category } from '../lib/api';

export default function CategoriesNav() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Icons pour chaque catégorie
    const categoryIcons: { [key: string]: string } = {
        'smash-burgers': '🍔',
        'classiques': '🇺🇸',
        'tacos': '🌮',
        'pizzas': '🍕',
        'boissons': '🥤',
        'desserts': '🍰'
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data.categories);
            } catch (err) {
                console.error('Erreur chargement catégories:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-yellow-500 rounded-full"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-900 relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 text-9xl">🍔</div>
                <div className="absolute top-20 right-20 text-8xl">🌮</div>
                <div className="absolute bottom-20 left-20 text-9xl">🍕</div>
                <div className="absolute bottom-10 right-10 text-8xl">🥤</div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-400">
                            NOS UNIVERS
                        </span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-400 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Chaque catégorie raconte une histoire. Laquelle vous appelle ?
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 hover:from-red-900 hover:to-red-800 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-gray-700 hover:border-red-500"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >

                            {/* Category Icon */}
                            <div className="text-6xl text-gray-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {categoryIcons[category.slug] || '🍴'}
                            </div>

                            {/* Category Info */}
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                                {category.name}
                            </h3>

                            <p className="text-gray-300 mb-4 leading-relaxed">
                                {category.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between">
                                <span className="text-yellow-400 font-bold">
                                    {category.productsCount} créations
                                </span>
                                <div className="text-white group-hover:text-yellow-400 transition-colors transform group-hover:translate-x-2 duration-300">
                                    →
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-yellow-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>

                            {/* Popular indicator */}
                            {category.popularProductsCount && category.popularProductsCount > 0 && (
                                <div className="absolute top-4 right-4">
                                    <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                                        🔥 {category.popularProductsCount} hits
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full p-2">
                        <button className="bg-white text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
                            Menu Complet
                        </button>
                        <span className="text-white font-medium pr-4">
                            32 créations vous attendent
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}