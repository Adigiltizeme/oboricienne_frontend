// Test des endpoints Railway pour voir lesquels acceptent POST
const API_URL = 'https://oboriciennebackend-production.up.railway.app/api';

async function testEndpoints() {
    console.log('🔍 Test des endpoints Railway...\n');

    // Test GET endpoints (on sait qu'ils fonctionnent)
    console.log('✅ Endpoints GET qui fonctionnent:');
    console.log('- GET /products');
    console.log('- GET /categories');
    console.log('- GET /products/popular/list\n');

    // Test si on peut créer des catégories
    console.log('🧪 Test POST /categories...');
    try {
        const testCategory = {
            name: 'Test Category',
            slug: 'test-category',
            description: 'Test description',
            displayOrder: 999
        };

        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testCategory)
        });

        console.log(`Status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ POST /categories fonctionne !');
            console.log('Réponse:', data);
        } else {
            console.log('❌ POST /categories échoué');
            console.log('Erreur:', await response.text());
        }
    } catch (error) {
        console.log('❌ Erreur réseau:', error.message);
    }

    console.log('\n🧪 Test POST /products...');
    try {
        const testProduct = {
            name: 'Test Product',
            slug: 'test-product',
            description: 'Test description',
            price: 9.99,
            categoryId: '1'
        };

        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProduct)
        });

        console.log(`Status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ POST /products fonctionne !');
            console.log('Réponse:', data);
        } else {
            console.log('❌ POST /products échoué');
            console.log('Erreur:', await response.text());
        }
    } catch (error) {
        console.log('❌ Erreur réseau:', error.message);
    }

    // Test autres endpoints possibles
    console.log('\n🔍 Autres endpoints possibles:');
    const endpoints = [
        'POST /products/bulk',
        'POST /categories/bulk',
        'POST /import',
        'GET /admin'
    ];

    for (const endpoint of endpoints) {
        const [method, path] = endpoint.split(' ');
        try {
            const response = await fetch(`${API_URL}${path}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`${endpoint}: ${response.status}`);
        } catch (error) {
            console.log(`${endpoint}: Erreur réseau`);
        }
    }
}

testEndpoints();