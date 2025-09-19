// Fonction pour obtenir l'emoji de la catégorie
export const getCategoryEmoji = (slug: string) => {
    const emojiMap: { [key: string]: string } = {
        'burgers': '🍔',
        'smash-burger': '🔥',
        'sandwichs': '🥪',
        'tacos': '🌮',
        'brasserie': '🍽️',
        'salades': '🥗',
        'menu-tenders': '🍗',
        'duo': '👥',
        // Anciens mappings pour compatibilité
        'smash-burgers': '🔥',
        'classiques': '🍔',
        'pizzas': '🍕',
        'boissons': '🥤',
        'desserts': '🍰'
    };
    return emojiMap[slug] || '🍽️';
};

export const getCategoryName = (slug: string): string => {
    const categoryNames: { [key: string]: string } = {
        'burgers': 'Burgers',
        'smash-burger': 'Smash Burger',
        'sandwichs': 'Sandwichs',
        'tacos': 'Tacos',
        'brasserie': 'Brasserie',
        'salades': 'Salades',
        'menu-tenders': 'Menu Tenders',
        'duo': 'Duo',
        // Anciens mappings pour compatibilité
        'smash-burgers': 'Smash Burgers',
        'classiques': 'Classiques',
        'pizzas': 'Pizzas',
        'boissons': 'Boissons',
        'desserts': 'Desserts'
    };
    return categoryNames[slug] || 'Produits';
};