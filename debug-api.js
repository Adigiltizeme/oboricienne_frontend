// Script pour déboguer l'API Railway
const API_URL = 'https://oboriciennebackend-production.up.railway.app/api';

async function debugAPI() {
    try {
        console.log('🔍 Débogage API Railway...\n');

        // Test produits
        const productsResponse = await fetch(`${API_URL}/products`);
        const productsData = await productsResponse.json();
        console.log('📦 PRODUITS:');
        console.log(`- Nombre: ${productsData.products?.length || 'N/A'}`);
        console.log(`- Exemple 1: ${productsData.products?.[0]?.name || 'N/A'}`);
        console.log(`- Image 1: ${productsData.products?.[0]?.imageUrl || 'N/A'}`);
        console.log('');

        // Test catégories
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesResponse.json();
        console.log('📂 CATÉGORIES:');
        console.log(`- Nombre: ${categoriesData.categories?.length || 'N/A'}`);
        console.log(`- Exemple 1: ${categoriesData.categories?.[0]?.name || 'N/A'}`);
        console.log('');

        // Test produits populaires
        const popularResponse = await fetch(`${API_URL}/products/popular/list`);
        const popularData = await popularResponse.json();
        console.log('⭐ PRODUITS POPULAIRES:');
        console.log(`- Nombre: ${popularData.products?.length || 'N/A'}`);
        console.log('');

        // Détails des premiers produits
        console.log('🔍 DÉTAILS PREMIERS PRODUITS:');
        productsData.products?.slice(0, 3).forEach((product, i) => {
            console.log(`${i+1}. ${product.name}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   Prix: ${product.price}`);
            console.log(`   Image: ${product.imageUrl}`);
            console.log(`   Catégorie: ${product.category?.name}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

debugAPI();