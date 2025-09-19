// Script pour importer les données locales vers l'API Railway
import { products, categories } from './src/data/products.js';

const API_URL = 'https://oboriciennebackend-production.up.railway.app/api';

async function importData() {
    console.log('🚀 Import des données vers Railway...\n');

    try {
        // 1. Importer les catégories d'abord
        console.log('📂 Import des catégories...');
        for (const category of categories) {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    imageUrl: category.imageUrl,
                    displayOrder: category.displayOrder
                })
            });

            if (response.ok) {
                console.log(`✅ Catégorie "${category.name}" importée`);
            } else {
                console.log(`❌ Erreur catégorie "${category.name}":`, await response.text());
            }
        }

        console.log('\n📦 Import des produits...');
        // 2. Importer les produits
        for (const product of products) {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    shortDescription: product.shortDescription,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    imageAlt: product.imageAlt,
                    isPopular: product.isPopular,
                    isSpicy: product.isSpicy,
                    isVegetarian: product.isVegetarian,
                    isVegan: product.isVegan,
                    preparationTime: product.preparationTime,
                    categoryId: product.category.id,
                    customizations: product.customizations,
                    variants: product.variants
                })
            });

            if (response.ok) {
                console.log(`✅ Produit "${product.name}" importé`);
            } else {
                console.log(`❌ Erreur produit "${product.name}":`, await response.text());
            }
        }

        console.log('\n🎉 Import terminé !');

    } catch (error) {
        console.error('❌ Erreur générale:', error);
    }
}

// Lancer l'import
importData();