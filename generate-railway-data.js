// Script pour générer les données complètes avec URLs Cloudinary pour Railway
const fs = require('fs');
const path = require('path');

// Lire le mapping Cloudinary
function loadCloudinaryMapping() {
    const mappingFile = 'cloudinary-mapping.json';
    if (!fs.existsSync(mappingFile)) {
        console.error('❌ Fichier cloudinary-mapping.json non trouvé');
        console.error('Lancez d\'abord: node upload-to-cloudinary.js');
        process.exit(1);
    }

    const content = fs.readFileSync(mappingFile, 'utf8');
    const lines = content.trim().split('\n');
    const mapping = {};

    lines.forEach(line => {
        try {
            const data = JSON.parse(line);
            mapping[data.local] = data.cloudinary;
        } catch (e) {
            console.warn('Ligne ignorée:', line);
        }
    });

    return mapping;
}

// Convertir URL locale vers Cloudinary
function convertImageUrl(localUrl, mapping) {
    if (!localUrl) return null;

    // Chercher l'URL correspondante dans le mapping
    const cloudinaryUrl = mapping[localUrl];
    if (cloudinaryUrl) {
        return cloudinaryUrl;
    }

    console.warn(`⚠️  URL non trouvée dans Cloudinary: ${localUrl}`);
    return localUrl; // Garder l'URL locale en fallback
}

async function generateRailwayData() {
    console.log('🔄 Génération des données pour Railway...\n');

    // Charger le mapping Cloudinary
    const mapping = loadCloudinaryMapping();
    console.log(`📋 ${Object.keys(mapping).length} URLs mappées trouvées\n`);

    // Importer les données locales (dynamiquement pour éviter les erreurs ES modules)
    const { products, categories, popularProducts } = require('./src/data/products.js');

    // Convertir les catégories
    const railwayCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: convertImageUrl(category.imageUrl, mapping),
        displayOrder: category.displayOrder,
        productsCount: category.productsCount
    }));

    // Convertir les produits
    const railwayProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        imageUrl: convertImageUrl(product.imageUrl, mapping),
        imageAlt: product.imageAlt,
        isPopular: product.isPopular,
        isSpicy: product.isSpicy,
        isVegetarian: product.isVegetarian,
        isVegan: product.isVegan,
        preparationTime: product.preparationTime,
        categoryId: product.category.id,
        customizations: product.customizations || [],
        variants: product.variants ? product.variants.map(variant => ({
            ...variant,
            imageUrl: convertImageUrl(variant.imageUrl, mapping)
        })) : []
    }));

    // Générer le fichier final
    const railwayData = {
        info: {
            generated: new Date().toISOString(),
            totalCategories: railwayCategories.length,
            totalProducts: railwayProducts.length,
            cloudinaryImages: Object.keys(mapping).length
        },
        categories: railwayCategories,
        products: railwayProducts
    };

    // Sauvegarder
    const outputFile = 'railway-import-data.json';
    fs.writeFileSync(outputFile, JSON.stringify(railwayData, null, 2));

    console.log('✅ Données générées avec succès !');
    console.log(`📄 Fichier: ${outputFile}`);
    console.log(`📊 ${railwayCategories.length} catégories, ${railwayProducts.length} produits`);
    console.log(`🖼️  ${Object.keys(mapping).length} images Cloudinary\n`);

    // Statistiques
    const withImages = railwayProducts.filter(p => p.imageUrl && p.imageUrl.includes('cloudinary')).length;
    const withoutImages = railwayProducts.length - withImages;

    console.log('📈 STATISTIQUES:');
    console.log(`- Produits avec images Cloudinary: ${withImages}`);
    console.log(`- Produits sans images: ${withoutImages}`);

    if (withoutImages > 0) {
        console.log('\n⚠️  Produits sans images Cloudinary:');
        railwayProducts
            .filter(p => !p.imageUrl || !p.imageUrl.includes('cloudinary'))
            .forEach(p => console.log(`   - ${p.name}: ${p.imageUrl || 'NULL'}`));
    }

    console.log('\n🚀 Prochaines étapes:');
    console.log('1. Utilisez Railway CLI ou dashboard pour importer railway-import-data.json');
    console.log('2. Mettez TEMP_MODE_ENABLED = false');
    console.log('3. Testez votre app avec les vraies données API !');
}

generateRailwayData().catch(console.error);