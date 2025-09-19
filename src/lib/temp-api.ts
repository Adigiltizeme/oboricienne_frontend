// Fonctions temporaires pour remplacer les appels API en utilisant les données locales
// Une fois le backend prêt, ces fonctions seront supprimées et les composants
// utiliseront de nouveau les fonctions de api.ts

import {
    products,
    categories,
    popularProducts,
    getProductsByCategory
} from '../data/products';
import { ProductsResponse, CategoriesResponse } from './api';

// Simulation d'un délai réseau pour rendre l'expérience réaliste
const simulateNetworkDelay = (ms: number = 500) =>
    new Promise(resolve => setTimeout(resolve, ms));

// Remplace fetchPopularProducts
export const fetchPopularProductsTemp = async (): Promise<ProductsResponse> => {
    await simulateNetworkDelay(300);

    console.log('🔄 [TEMP] Fetching popular products from local data');

    return {
        success: true,
        message: 'Produits populaires récupérés depuis les données locales',
        count: popularProducts.length,
        products: popularProducts,
        category: null
    };
};

// Remplace fetchCategories
export const fetchCategoriesTemp = async (): Promise<CategoriesResponse> => {
    await simulateNetworkDelay(200);

    console.log('🔄 [TEMP] Fetching categories from local data');

    return {
        success: true,
        message: 'Catégories récupérées depuis les données locales',
        count: categories.length,
        categories: categories
    };
};

// Remplace fetchProducts
export const fetchProductsTemp = async (): Promise<ProductsResponse> => {
    await simulateNetworkDelay(400);

    console.log('🔄 [TEMP] Fetching all products from local data');

    return {
        success: true,
        message: 'Tous les produits récupérés depuis les données locales',
        count: products.length,
        products: products,
        category: null
    };
};

// Remplace fetchProductsByCategory
export const fetchProductsByCategoryTemp = async (categorySlug: string): Promise<ProductsResponse> => {
    await simulateNetworkDelay(350);

    console.log(`🔄 [TEMP] Fetching products for category: ${categorySlug} from local data`);

    const categoryProducts = getProductsByCategory(categorySlug);
    const category = categories.find(cat => cat.slug === categorySlug) || null;

    return {
        success: true,
        message: `Produits de la catégorie ${categorySlug} récupérés depuis les données locales`,
        count: categoryProducts.length,
        products: categoryProducts,
        category: category
    };
};

// Remplace fetchProductBySlug
export const fetchProductBySlugTemp = async (productSlug: string): Promise<{ success: boolean; product: any }> => {
    await simulateNetworkDelay(250);

    console.log(`🔄 [TEMP] Fetching product by slug: ${productSlug} from local data`);

    const product = products.find(p => p.slug === productSlug);

    if (!product) {
        throw new Error(`Produit non trouvé: ${productSlug}`);
    }

    return {
        success: true,
        product: product
    };
};

// Flag pour activer/désactiver le mode temporaire
export const TEMP_MODE_ENABLED = false;

// Fonction utilitaire pour vérifier si on utilise les données temporaires
export const isUsingTempData = () => TEMP_MODE_ENABLED;

console.log('🔄 [TEMP API] Mode temporaire activé - utilisation des données locales');
console.log(`📊 [TEMP API] ${products.length} produits, ${categories.length} catégories, ${popularProducts.length} produits populaires`);