// src/lib/api.ts - Configuration API O'Boricienne Frontend
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getApiBaseUrl = () => {
    // Détecter si on est sur Vercel (production)
    if (typeof window !== 'undefined' && (
        window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('oboricienne') ||
        !window.location.hostname.includes('localhost')
    )) {
        return 'https://oboriciennebackend-production.up.railway.app/api';
    }

    // En développement local, utiliser la variable d'environnement
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Détecter si on est sur ngrok (pour tests mobiles)
    if (typeof window !== 'undefined' && window.location.hostname.includes('ngrok')) {
        return 'https://VOTRE-BACKEND-NGROK-URL.ngrok.app/api';
    }

    // En développement local, utiliser le proxy Next.js
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Ajouter ce debug pour voir quelle URL est utilisée
console.log('🔗 API_BASE_URL:', API_BASE_URL);

// Types pour les réponses API
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    data?: T;
}

export interface ProductVariant {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    isDefault?: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    price: number; // Prix de base (variante par défaut)
    imageUrl: string | null; // Image par défaut
    imageAlt: string | null;
    isPopular: boolean;
    isSpicy: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    preparationTime: number;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    customizations: Customization[];
    variants?: ProductVariant[]; // Variantes optionnelles (seul, menu, etc.)
    isAvailable?: boolean; // Disponibilité du produit (prix connus)
    isPromo?: boolean; // Indique si le produit est en promotion
}

export interface Customization {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    isMultiple: boolean;
    options: CustomizationOption[];
}

export interface CustomizationOption {
    id: string;
    name: string;
    priceModifier: number;
    isDefault: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    displayOrder: number;
    productsCount: number;
    popularProductsCount?: number;
}

export interface ProductsResponse extends ApiResponse<Product[]> {
    products: Product[];
    category: Category | null;
}

export interface CategoriesResponse extends ApiResponse<Category[]> {
    categories: Category[];
}

// ===== FONCTIONS API =====

const defaultHeaders = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',  // ← Bypass ngrok warning page
    'User-Agent': 'OBoricienne-App/1.0.0'  // ← User agent custom
};

// Fonction helper pour fetch avec headers ngrok
const fetchWithNgrokHeaders = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });
};

// Récupérer tous les produits
export const fetchProducts = async (): Promise<ProductsResponse> => {
    try {
        console.log('🔗 Fetching products from:', `${API_BASE_URL}/products`);
        const response = await fetchWithNgrokHeaders(`${API_BASE_URL}/products`, {
            method: 'GET',
            cache: 'no-store',
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        // Vérifier le content-type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Response is not JSON:', text.substring(0, 200));
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        throw error;
    }
};

// Récupérer les produits populaires
export const fetchPopularProducts = async (): Promise<ProductsResponse> => {
    try {
        console.log('🔗 Fetching popular products from:', `${API_BASE_URL}/products/popular/list`);
        const response = await fetchWithNgrokHeaders(`${API_BASE_URL}/products/popular/list`, {
            method: 'GET',
            cache: 'no-store',
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        // Vérifier le content-type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Response is not JSON:', text.substring(0, 200));
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits populaires:', error);
        throw error;
    }
};

// Récupérer toutes les catégories
export const fetchCategories = async (): Promise<CategoriesResponse> => {
    try {
        console.log('🔗 Fetching categories from:', `${API_BASE_URL}/categories`);
        const response = await fetchWithNgrokHeaders(`${API_BASE_URL}/categories`, {
            method: 'GET',
            cache: 'no-store',
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        // Vérifier le content-type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Response is not JSON:', text.substring(0, 200));
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
    }
};

// Récupérer les produits d'une catégorie
export const fetchProductsByCategory = async (categorySlug: string): Promise<ProductsResponse> => {
    try {
        console.log('🔗 Fetching products for category:', categorySlug);
        const response = await fetchWithNgrokHeaders(`${API_BASE_URL}/products/category/${categorySlug}`, {
            method: 'GET',
            cache: 'no-store',
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        // Vérifier le content-type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Response is not JSON:', text.substring(0, 200));
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
        throw error;
    }
};

// Récupérer un produit par slug
export const fetchProductBySlug = async (productSlug: string): Promise<{ success: boolean; product: Product }> => {
    try {
        console.log('🔗 Fetching product by slug:', productSlug);
        const response = await fetchWithNgrokHeaders(`${API_BASE_URL}/products/${productSlug}`, {
            method: 'GET',
            cache: 'no-store',
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        // Vérifier le content-type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Response is not JSON:', text.substring(0, 200));
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération du produit ${productSlug}:`, error);
        throw error;
    }
};

// Fonction utilitaire pour formater les prix
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(price);
};

// Fonction utilitaire pour les images avec fallbacks intelligents
export const getImageUrl = (imageUrl: string | null, productName?: string): string => {
    if (!imageUrl) {
        // Générer une image placeholder basée sur le nom du produit
        if (productName) {
            const emoji = getEmojiForProduct(productName);
            const encodedName = encodeURIComponent(productName);
            return `https://via.placeholder.com/400x300/ef4444/ffffff?text=${emoji}%20${encodedName}`;
        }
        return 'https://via.placeholder.com/400x300/ef4444/ffffff?text=🍔%20O\'Boricienne'; // Image par défaut
    }

    // Si l'image commence par http, la retourner telle quelle
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Pour les images locales, s'assurer qu'elles commencent par /
    let cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

    // Encoder les espaces et caractères spéciaux dans l'URL
    // Séparer le chemin en segments et encoder chaque segment individuellement
    const pathParts = cleanUrl.split('/');
    const encodedParts = pathParts.map(part =>
        part === '' ? '' : encodeURIComponent(part)
    );
    const encodedUrl = encodedParts.join('/');

    // Debug: log des URLs d'images pour vérification
    console.log('🖼️ Image URL original:', cleanUrl);
    console.log('🖼️ Image URL encodée:', encodedUrl);

    return encodedUrl;
};

// Fonction pour obtenir l'emoji correspondant au produit
function getEmojiForProduct(productName: string): string {
    const name = productName.toLowerCase();

    if (name.includes('smash') || name.includes('burger') || name.includes('classic')) return '🍔';
    if (name.includes('pizza')) return '🍕';
    if (name.includes('tacos')) return '🌮';
    if (name.includes('coca') || name.includes('sprite') || name.includes('fanta') || name.includes('eau')) return '🥤';
    if (name.includes('jus') || name.includes('smoothie')) return '🧃';
    if (name.includes('cheesecake') || name.includes('tiramisu') || name.includes('mousse') || name.includes('glace')) return '🍰';
    if (name.includes('salade')) return '🥗';
    if (name.includes('chicken') || name.includes('poulet')) return '🐔';
    if (name.includes('ocean') || name.includes('cabillaud')) return '🐟';
    if (name.includes('garden') || name.includes('earth') || name.includes('veggie') || name.includes('végé')) return '🌱';

    return '🍽️';
}

// Test de connexion API
export const testApiConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error('Connexion API échouée:', error);
        return false;
    }
};