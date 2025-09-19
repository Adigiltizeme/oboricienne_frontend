// Test direct de la fonction getProductsByCategory pour "duo"
const fs = require('fs');
const path = require('path');

// Lire le fichier products.ts
const dataPath = path.join(__dirname, 'src', 'data', 'products.ts');
const data = fs.readFileSync(dataPath, 'utf8');

// Extraire les noms des produits de la catégorie Duo
const lines = data.split('\n');
let duoProducts = [];
let currentProduct = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Détecter le début d'un produit avec son nom
    if (line.startsWith('name:')) {
        const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
        if (nameMatch) {
            currentProduct = nameMatch[1];
        }
    }

    // Si on trouve categories[7] (Duo), ajouter le produit à la liste
    if (line.includes('category: categories[7]') && currentProduct) {
        duoProducts.push(currentProduct);
        currentProduct = null;
    }
}

console.log('🍔 Produits de la catégorie Duo trouvés:');
duoProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product}`);
});
console.log(`\n📊 Total: ${duoProducts.length} produits`);