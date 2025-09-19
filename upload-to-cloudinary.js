// Script pour uploader les images vers Cloudinary
require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary depuis les variables d'environnement
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Vérifier la configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Configuration Cloudinary manquante !');
    console.error('Vérifiez que les variables CLOUDINARY_* sont définies dans .env.local');
    process.exit(1);
}

// Fonction pour uploader récursivement un dossier
async function uploadFolder(localPath, cloudinaryFolder) {
    const items = fs.readdirSync(localPath);

    for (const item of items) {
        const itemPath = path.join(localPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Dossier : appel récursif
            await uploadFolder(itemPath, `${cloudinaryFolder}/${item}`);
        } else if (item.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            // Image : upload vers Cloudinary
            try {
                console.log(`📤 Upload: ${itemPath}`);

                const result = await cloudinary.uploader.upload(itemPath, {
                    folder: cloudinaryFolder,
                    public_id: path.parse(item).name, // nom sans extension
                    overwrite: true
                });

                console.log(`✅ Uploadé: ${result.secure_url}`);

                // Sauvegarder le mapping local -> cloudinary
                const mapping = {
                    local: itemPath.replace(/\\/g, '/').replace('public/', '/'),
                    cloudinary: result.secure_url,
                    public_id: result.public_id
                };

                // Append to mapping file
                fs.appendFileSync('cloudinary-mapping.json', JSON.stringify(mapping) + '\n');

            } catch (error) {
                console.error(`❌ Erreur upload ${item}:`, error.message);
            }
        }
    }
}

async function main() {
    console.log('🚀 Upload des images vers Cloudinary...\n');

    // Créer le fichier de mapping
    fs.writeFileSync('cloudinary-mapping.json', '');

    // Upload du dossier images
    const imagesPath = path.join('public', 'images', 'products', 'obb-uber');

    if (fs.existsSync(imagesPath)) {
        await uploadFolder(imagesPath, 'oboricienne/products');
        console.log('\n🎉 Upload terminé !');
        console.log('📄 Voir cloudinary-mapping.json pour les URLs');
    } else {
        console.error('❌ Dossier images non trouvé:', imagesPath);
    }
}

// Instructions d'utilisation
console.log('📋 INSTRUCTIONS:');
console.log('1. Allez sur https://cloudinary.com/console');
console.log('2. Copiez vos identifiants dans .env.local:');
console.log('   CLOUDINARY_CLOUD_NAME="votre_cloud_name"');
console.log('   CLOUDINARY_API_KEY="votre_api_key"');
console.log('   CLOUDINARY_API_SECRET="votre_api_secret"');
console.log('3. Ensuite lancez: node upload-to-cloudinary.js');
console.log('');

// Lancer automatiquement si configuré
if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
    main();
} else {
    console.log('⚠️  Configurez d\'abord Cloudinary dans .env.local');
}