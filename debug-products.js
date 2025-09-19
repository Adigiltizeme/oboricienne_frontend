// Script de debug pour vérifier les produits Duo
const fs = require('fs');
const path = require('path');

// Simuler l'import des produits (version simplifiée)
const dataPath = path.join(__dirname, 'src', 'data', 'products.ts');
const data = fs.readFileSync(dataPath, 'utf8');

// Compter les occurrences de "category: categories[7]" (qui correspond à Duo)
const duoMatches = data.match(/category: categories\[7\]/g);
console.log('🔍 Nombre de produits Duo trouvés:', duoMatches ? duoMatches.length : 0);

// Compter les produits populaires dans la catégorie Duo
const lines = data.split('\n');
let duoProductCount = 0;
let duoPopularCount = 0;
let inDuoProduct = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('category: categories[7]')) {
        duoProductCount++;
        inDuoProduct = true;

        // Chercher isPopular dans les lignes suivantes pour ce produit
        for (let j = i - 20; j < i + 5; j++) {
            if (j >= 0 && j < lines.length && lines[j].includes('isPopular: true')) {
                duoPopularCount++;
                break;
            }
        }
    }
}

console.log('📊 Produits Duo au total:', duoProductCount);
console.log('🔥 Produits Duo populaires:', duoPopularCount);
console.log('📝 Produits Duo non populaires:', duoProductCount - duoPopularCount);