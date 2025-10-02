// Fonction pour obtenir l'emoji de la catégorie (DEPRECATED - utiliser getCategoryImage)
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

// Fonction pour obtenir l'image représentative de la catégorie
export const getCategoryImage = (slug: string): string => {
    const imageMap: { [key: string]: string } = {
        // Images Cloudinary représentatives par catégorie (URLs réelles depuis la BDD)
        'burgers': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1759432768/oboricienne/products/dat6hjazm4iuzsdvse4u.png', // OB180
        'smash-burger': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314908/oboricienne/products/smash%20burger/BOURSINE-seul.png', // Smash Boursine
        'sandwichs': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314890/oboricienne/products/sandwichs/classic-obb-seul.png', // Classic OBB
        'tacos': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314922/oboricienne/products/tacos/tacos-1-viande-seul.png', // Tacos 1 viande
        'brasserie': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314839/oboricienne/products/brasserie/escalope-normande.png', // Escalope Normande
        'salades': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314887/oboricienne/products/Salades/cesar-b.png', // Salade César
        'menu-tenders': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314881/oboricienne/products/menu%20tenders/menu-tenders-x6.png', // Tenders x6
        'duo': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314873/oboricienne/products/Duo/180-duo.png', // Duo 180
        // Anciens mappings pour compatibilité
        'smash-burgers': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1758314908/oboricienne/products/smash%20burger/BOURSINE-seul.png',
        'classiques': 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1759432768/oboricienne/products/dat6hjazm4iuzsdvse4u.png'
    };

    return imageMap[slug] || 'https://res.cloudinary.com/dpxqbfxqq/image/upload/v1759432768/oboricienne/products/dat6hjazm4iuzsdvse4u.png';
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