// scripts/create-placeholders.js - Créer des images placeholder
const fs = require('fs');
const path = require('path');

// Liste des images nécessaires pour O'Boricienne
const images = [
    // Smash Burgers
    'smash-original.jpg',
    'smash-bacon.jpg',
    'smash-pepper.jpg',
    'smash-garden.jpg',

    // Classiques
    'obb-classic.jpg',
    'cheesy.jpg',
    'chicken-run.jpg',
    'ocean-drive.jpg',
    'earth-burger.jpg',

    // Tacos
    'tacos-classico.jpg',
    'tacos-pollo-loco.jpg',
    'tacos-carnivore.jpg',

    // Pizzas
    'pizza-urbaine.jpg',
    'pizza-spicy-street.jpg',
    'pizza-veggie-art.jpg',
    'pizza-meatpacking.jpg',
    'pizza-oboricienne.jpg',
    'pizza-dolce-vita.jpg',

    // Boissons
    'coca-cola.jpg',
    'sprite.jpg',
    'fanta.jpg',
    'ice-tea.jpg',
    'eau-plate.jpg',
    'eau-gazeuse.jpg',
    'jus-orange.jpg',
    'jus-pomme.jpg',
    'smoothie-fruits-rouges.jpg',

    // Desserts
    'cheesecake-ny.jpg',
    'tiramisu-street-art.jpg',
    'mousse-chocolat-graffiti.jpg',
    'salade-fruits-urbaine.jpg',
    'glace-artisanale.jpg',

    // Blog
    'blog/smash-burger-technique.jpg',
    'blog/cfa-evreux-localisation.jpg',
    'blog/equipe-oboricienne.jpg',
    'blog/app-mobile-preview.jpg',
    'blog/ingredients-locaux-eure.jpg'
];

// URLs des images placeholder avec style O'Boricienne
const getPlaceholderUrl = (filename) => {
    const name = filename.split('.')[0].replace(/-/g, '%20');
    const emoji = getEmojiForProduct(filename);
    return `https://via.placeholder.com/400x300/ef4444/ffffff?text=${emoji}%20${name}`;
};

function getEmojiForProduct(filename) {
    if (filename.includes('smash') || filename.includes('burger')) return '🍔';
    if (filename.includes('pizza')) return '🍕';
    if (filename.includes('tacos')) return '🌮';
    if (filename.includes('coca') || filename.includes('sprite') || filename.includes('boisson') || filename.includes('fanta')) return '🥤';
    if (filename.includes('dessert') || filename.includes('cheesecake') || filename.includes('tiramisu')) return '🍰';
    if (filename.includes('jus') || filename.includes('smoothie')) return '🧃';
    if (filename.includes('chicken')) return '🐔';
    if (filename.includes('ocean') || filename.includes('fish')) return '🐟';
    if (filename.includes('garden') || filename.includes('earth') || filename.includes('veggie')) return '🌱';
    return '🍽️';
}

console.log('📸 IMAGES PLACEHOLDER POUR O\'BORICIENNE BURGER');
console.log('===========================================\n');

console.log('📁 Créez cette structure dans public/images/ :');
console.log('');

images.forEach(img => {
    const placeholderUrl = getPlaceholderUrl(img);
    console.log(`📄 ${img}`);
    console.log(`   URL: ${placeholderUrl}`);
    console.log('');
});

console.log('\n🔗 URLS COURTES POUR TÉLÉCHARGEMENT RAPIDE :');
console.log('');

// URLs simplifiées pour les principaux produits
const mainProducts = [
    { name: 'Smash Original', url: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=🍔%20Smash%20Original' },
    { name: 'Smash Bacon', url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=🍔%20Smash%20Bacon' },
    { name: 'OBB Classic', url: 'https://via.placeholder.com/400x300/059669/ffffff?text=🍔%20OBB%20Classic' },
    { name: 'Pizza Meatpacking', url: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=🍕%20Meatpacking' },
    { name: 'Tacos El Classico', url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=🌮%20El%20Classico' },
    { name: 'Cheesecake NY', url: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=🍰%20Cheesecake' }
];

mainProducts.forEach(product => {
    console.log(`${product.name}: ${product.url}`);
});

console.log('\n💡 INSTRUCTIONS :');
console.log('1. Créez le dossier : mkdir -p public/images');
console.log('2. Téléchargez les images depuis les URLs ci-dessus');
console.log('3. Ou utilisez des vraies photos de vos produits !');
console.log('4. Nommez les fichiers exactement comme indiqué');
console.log('\n🚀 Une fois fait, vos produits auront de belles images !');