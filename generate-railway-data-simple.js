// Script simple pour générer les données Railway avec URLs Cloudinary
const fs = require('fs');

// Lire le mapping Cloudinary
function loadCloudinaryMapping() {
    const mappingFile = 'cloudinary-mapping.json';
    if (!fs.existsSync(mappingFile)) {
        console.error('❌ Fichier cloudinary-mapping.json non trouvé');
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

function convertImageUrl(localUrl, mapping) {
    if (!localUrl) return null;
    const cloudinaryUrl = mapping[localUrl];
    return cloudinaryUrl || localUrl;
}

async function generateRailwayData() {
    console.log('🔄 Génération des données pour Railway...\n');

    const mapping = loadCloudinaryMapping();
    console.log(`📋 ${Object.keys(mapping).length} URLs mappées trouvées\n`);

    // Données d'exemple basées sur vos produits
    const categories = [
        {
            id: "1",
            name: "Burgers",
            slug: "burgers",
            description: "Nos burgers classiques avec pain brioché",
            imageUrl: "/images/products/obb-uber/burgers/big-obb-seul.png",
            displayOrder: 1,
            productsCount: 11
        },
        {
            id: "2",
            name: "Smash Burger",
            slug: "smash-burger",
            description: "L'art du smash burger à la plancha",
            imageUrl: "/images/products/obb-uber/smash burger/BUFF-OBB-seul.png",
            displayOrder: 2,
            productsCount: 3
        },
        {
            id: "3",
            name: "Sandwichs",
            slug: "sandwichs",
            description: "Sandwichs gourmands",
            imageUrl: "/images/products/obb-uber/sandwichs/classic-obb-seul.png",
            displayOrder: 3,
            productsCount: 10
        },
        {
            id: "4",
            name: "Tacos",
            slug: "tacos",
            description: "Tacos à la française",
            imageUrl: "/images/products/obb-uber/tacos/tacos-2-viandes-seul.png",
            displayOrder: 4,
            productsCount: 6
        }
    ];

    const products = [
        {
            id: "1",
            name: "180 OBB",
            slug: "180-obb",
            description: "Notre burger signature avec steak haché 180g, fromage, salade, tomate, oignons rouges",
            shortDescription: "Steak 180g, fromage, crudités",
            price: 8.50,
            imageUrl: "/images/products/obb-uber/burgers/180-obb-seul.png",
            imageAlt: "180 OBB burger",
            isPopular: true,
            isSpicy: false,
            isVegetarian: false,
            isVegan: false,
            preparationTime: 12,
            categoryId: "1"
        },
        {
            id: "2",
            name: "Big OBB",
            slug: "big-obb",
            description: "Double steak, double fromage, salade, tomate",
            shortDescription: "Double steak, double fromage",
            price: 10.50,
            imageUrl: "/images/products/obb-uber/burgers/big-obb-seul.png",
            imageAlt: "Big OBB burger",
            isPopular: true,
            isSpicy: false,
            isVegetarian: false,
            isVegan: false,
            preparationTime: 15,
            categoryId: "1"
        }
        // Ajoutez plus de produits ici...
    ];

    // Convertir les URLs
    const railwayCategories = categories.map(cat => ({
        ...cat,
        imageUrl: convertImageUrl(cat.imageUrl, mapping)
    }));

    const railwayProducts = products.map(prod => ({
        ...prod,
        imageUrl: convertImageUrl(prod.imageUrl, mapping)
    }));

    const railwayData = {
        info: {
            generated: new Date().toISOString(),
            note: "Données de base - ajoutez plus de produits selon vos besoins"
        },
        categories: railwayCategories,
        products: railwayProducts
    };

    fs.writeFileSync('railway-import-data.json', JSON.stringify(railwayData, null, 2));

    console.log('✅ Données générées !');
    console.log('📄 Fichier: railway-import-data.json');
    console.log('📋 Ajoutez plus de produits manuellement si nécessaire');
}

generateRailwayData().catch(console.error);