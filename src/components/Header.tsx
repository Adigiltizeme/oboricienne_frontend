'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import UserMenu from './UserMenu';
import { fetchCategoriesTemp, fetchProductsTemp, isUsingTempData } from '../lib/temp-api';
import { fetchCategories, fetchProducts, Category } from '../lib/api';
import { getCategoryEmoji } from '../helpers/getCategoryEmoji';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const { state, toggleCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Charger les données pour le menu déroulant
    useEffect(() => {
        const loadMenuData = async () => {
            try {
                // Essayer d'abord l'API réelle
                if (!isUsingTempData()) {
                    try {
                        const [categoriesData, productsData] = await Promise.all([
                            fetchCategories(),
                            fetchProducts()
                        ]);
                        setCategories(categoriesData.categories);
                        setTotalProducts(productsData.products.length);
                        console.log('✅ Données chargées depuis l\'API Railway');
                        return;
                    } catch (apiError) {
                        console.warn('⚠️ API Railway échoué, fallback vers données locales:', apiError);
                    }
                }

                // Fallback vers les données temporaires
                const [categoriesData, productsData] = await Promise.all([
                    fetchCategoriesTemp(),
                    fetchProductsTemp()
                ]);
                setCategories(categoriesData.categories);
                setTotalProducts(productsData.products.length);
                console.log('📦 Données chargées depuis le fallback local');

            } catch (err) {
                console.error('❌ Erreur fatale chargement menu Header:', err);
            }
        };

        loadMenuData();
    }, []);

    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Menu', href: 'menu' },
        { name: 'Nos Hits', href: '#hits' },
        { name: 'Histoire', href: '#histoire' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl'
            : 'bg-transparent'
            }`}>
            <nav className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl">
                            <img
                                src="/images/logo_obb.jpeg"
                                alt="O'Boricienne Logo"
                                className="w-12 h-10 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="text-xl font-black text-white mr-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                                O'BB
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation avec dropdown */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="/"
                            className="text-white hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                        >
                            Accueil
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                        </a>

                        {/* Menu avec dropdown */}
                        <div className="relative group">
                            <a
                                href="/menu"
                                className="text-white hover:text-yellow-400 font-medium transition-colors duration-300 relative group flex items-center space-x-1"
                            >
                                <span>Menu</span>
                                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                            </a>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                                <div className="p-6">

                                    {/* Menu principal */}
                                    <a
                                        href="/menu"
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg mb-3 font-medium transition-colors group"
                                    >
                                        <span className="text-2xl">🍽️</span>
                                        <div>
                                            <div className="font-bold">Menu complet</div>
                                            <div className="text-sm text-gray-500">Toutes nos créations ({totalProducts})</div>
                                        </div>
                                        <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>

                                    {/* Séparateur */}
                                    <div className="border-t border-gray-200 my-3"></div>

                                    {/* Catégories */}
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-4">Par catégorie</div>

                                        {categories.map((category) => (
                                            <a
                                                key={category.id}
                                                href={`/menu/${category.slug}`}
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
                                            >
                                                <span className="text-xl">{getCategoryEmoji(category.slug)}</span>
                                                <div className="flex-1">
                                                    <div className="font-medium">{category.name}</div>
                                                    <div className="text-xs text-gray-500">{category.description}</div>
                                                </div>
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{category.productsCount}</span>
                                            </a>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="border-t border-gray-200 mt-4 pt-4">
                                        <a href="/menu" className="block w-full bg-gradient-to-r from-red-600 to-yellow-600 text-white text-center font-bold py-2 px-4 rounded-lg hover:from-red-700 hover:to-yellow-700 transition-colors">
                                            Voir tout le menu →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#hits"
                            className="text-white hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                        >
                            Nos Hits
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                        </a>

                        <a
                            href="#histoire"
                            className="text-white hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                        >
                            Histoire (Bientôt disponible)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                        </a>

                        <a
                            href="#contact"
                            className="text-white hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                        >
                            Contact (Bientôt disponible)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>

                    {/* Desktop CTA avec panier et authentification */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Bouton panier */}
                        {/* <button
                            onClick={toggleCart}
                            className="relative text-white hover:text-yellow-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L5 3H3m4 10l1 2m0 0h10m-10 0a2 2 0 002 2m-8 0a2 2 0 002 2" />
                            </svg>
                            {state.totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {state.totalItems}
                                </span>
                            )}
                        </button> */}

                        {/* Menu utilisateur */}
                        {/* <UserMenu />

                        <a
                            href="/menu"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Commander
                        </a> */}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden" >
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-yellow-400 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {
                    isMobileMenuOpen && (
                        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="block px-3 py-2 text-white hover:text-yellow-400 hover:bg-gray-800 rounded-md font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="px-3 py-2 space-y-3">
                                    {/* Menu utilisateur mobile */}
                                    {/* <div className="flex justify-center">
                                        <UserMenu />
                                    </div> */}

                                    {/* Bouton panier mobile */}
                                    {/* <button
                                        onClick={() => {
                                            toggleCart();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white font-medium py-3 px-6 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L5 3H3m4 10l1 2m0 0h10m-10 0a2 2 0 002 2m-8 0a2 2 0 002 2" />
                                        </svg>
                                        <span>Panier ({state.totalItems})</span>
                                    </button> */}

                                    {/* Bouton commander */}
                                    {/* <a
                                        href="/menu"
                                        className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Commander
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    )
                }
            </nav >
        </header >
    );
}