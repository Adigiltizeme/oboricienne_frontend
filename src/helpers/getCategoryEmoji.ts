// Fonction pour obtenir l'emoji de la catégorie
export const getCategoryEmoji = (slug: string) => {
    const emojiMap: { [key: string]: string } = {
        'smash-burgers': '🍔',
        'classiques': '🇺🇸',
        'tacos': '🌮',
        'pizzas': '🍕',
        'boissons': '🥤',
        'desserts': '🍰'
    };
    return emojiMap[slug] || '🍽️';
};

export const getCategoryName = (slug: string): string => {
    const categoryNames: { [key: string]: string } = {
        'smash-burgers': 'Smash Burgers',
        'classiques': 'Classiques',
        'tacos': 'Tacos',
        'pizzas': 'Pizzas',
        'boissons': 'Boissons',
        'desserts': 'Desserts'
    };
    return categoryNames[slug] || 'Produits';
};