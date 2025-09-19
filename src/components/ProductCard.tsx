'use client';

import { useState } from 'react';
import { Product, ProductVariant, formatPrice, getImageUrl } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import ProductCustomizationModal from './ProductCustomizationModal';
import { getCategoryEmoji } from '../helpers/getCategoryEmoji';

interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'featured' | 'compact';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
    // console.log('ProductCard - Category info:', product.category);
    // console.log('ProductCard - Current URL:', window.location.pathname);
    const { addItem } = useCart();
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);

    // Gestion des variantes
    const hasVariants = product.variants && product.variants.length > 0;
    const defaultVariant = hasVariants && product.variants
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : null;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant);

    // Fonctions helper pour obtenir prix et image actuels
    const getCurrentPrice = () => selectedVariant ? selectedVariant.price : product.price;
    const getCurrentImageUrl = () => selectedVariant ? selectedVariant.imageUrl : product.imageUrl;
    const getCurrentName = () => selectedVariant ? selectedVariant.name : product.name;

    // 🛡️ Vérification de sécurité
    if (!product || !product.name) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                ⚠️ Erreur: Produit non défini
            </div>
        );
    }

    const hasCustomizations = product.customizations && product.customizations.length > 0;

    const handleAddToCart = () => {
        console.log('🔄 ProductCard variant:', variant);
        console.log('🔄 Has customizations:', hasCustomizations);
        console.log('🔄 Product:', product.name);
        console.log('🔄 Selected variant:', selectedVariant?.name);

        if (hasCustomizations) {
            console.log('🔄 Opening modal for:', product.name);
            setShowCustomizationModal(true);
        } else {
            // Si une variante est sélectionnée, créer un produit virtuel avec les données de la variante
            const productToAdd = selectedVariant ? {
                ...product,
                id: selectedVariant.id,
                name: selectedVariant.name,
                price: selectedVariant.price,
                imageUrl: selectedVariant.imageUrl,
                description: selectedVariant.description
            } : product;

            addItem(productToAdd, [], 1);
        }
    };

    // Variant featured pour PopularProducts
    if (variant === 'featured') {
        return (
            <>
                <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                    style={{ animationDelay: `${Math.random() * 0.5}s` }}
                >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden">
                        {!getCurrentImageUrl() ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-yellow-600">
                                <div className="text-white text-center p-4">
                                    <div className="text-6xl mb-2">{getCategoryEmoji(product.category?.slug || '')}</div>
                                    <div className="font-bold text-lg">{getCurrentName()}</div>
                                    <div className="text-sm opacity-75">O'Boricienne</div>
                                </div>
                            </div>

                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                style={{
                                    backgroundImage: `url(${getImageUrl(getCurrentImageUrl(), getCurrentName())})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                        )}

                        {/* Badges en haut à gauche */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isPopular && (
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    🔥 HIT
                                </span>
                            )}
                            {product.isPromo && (
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                    🎯 PROMO
                                </span>
                            )}
                        </div>

                        {/* Price badge - Prix plus visible */}
                        <div className="absolute top-4 right-4">
                            <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xl font-black shadow-lg border-2 border-white">
                                {formatPrice(getCurrentPrice())}
                            </span>
                        </div>

                        {/* Badges supplémentaires sur l'image */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            {product.isSpicy && (
                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🌶️ Épicé
                                </span>
                            )}
                            {product.isVegetarian && (
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🌱 Végétarien
                                </span>
                            )}
                            {product.isVegan && (
                                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🌿 Végan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                {hasVariants ? product.name : getCurrentName()}
                            </h3>
                            <span className="text-gray-500 text-sm">⏱️ {product.preparationTime}min</span>
                        </div>

                        {/* Prix bien visible */}
                        {/* <div className="text-2xl font-black text-red-600 mb-3">
                                    {formatPrice(product.price)}
                                </div> */}

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.shortDescription || product.description}
                        </p>

                        {/* Badges améliorés */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* {product.isPopular && (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                    🔥 HIT
                                </span>
                            )}
                            {product.isSpicy && (
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                    🌶️ Épicé
                                </span>
                            )}
                            {product.isVegetarian && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    🌱 Végétarien
                                </span>
                            )}
                            {product.isVegan && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    🌿 Vegan
                                </span>
                            )} */}
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                {product.category.name}
                            </span>
                        </div>

                        {/* Personnalisations disponibles */}
                        {hasCustomizations && (
                            <div className="mb-4">
                                <div className="text-xs text-gray-500 mb-1">
                                    ⚙️ {product.customizations.length} personnalisation(s) disponible(s)
                                </div>
                                <div className="text-xs text-gray-400">
                                    {product.customizations.map(c => c.name).slice(0, 2).join(', ')}
                                    {product.customizations.length > 2 && '...'}
                                </div>
                            </div>
                        )}

                        {/* Sélection des variantes */}
                        {hasVariants && product.variants && (
                            <div className="mb-4">
                                <div className="text-xs text-gray-500 mb-2 font-medium">Choisir :</div>
                                <div className="flex gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedVariant?.id === variant.id
                                                    ? 'bg-red-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <div className="text-xs font-bold">
                                                {variant.name.includes('Seul') ? '🍔 Seul' : '🍟 Menu'}
                                            </div>
                                            <div className="text-xs opacity-90">
                                                {formatPrice(variant.price)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message pour les produits sans variantes menu */}
                        {!hasVariants && (product.category?.slug === 'sandwichs' || product.category?.slug === 'tacos') && (
                            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="text-blue-400 mr-2">ℹ️</div>
                                    <div>
                                        <div className="text-xs font-medium text-blue-800">Prix menu sur demande</div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            Appelez-nous ou visitez-nous au restaurant pour connaître les prix des menus
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {/* <div className="flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
                            >
                                {hasCustomizations ? '⚙️ Personnaliser' : 'Ajouter au panier'}
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                                Détails
                            </button>
                        </div> */}
                    </div>
                </div>

                <ProductCustomizationModal
                    product={product}
                    isOpen={showCustomizationModal}
                    onClose={() => setShowCustomizationModal(false)}
                />
            </>
        );
    }

    // Variant compact pour listes courtes
    if (variant === 'compact') {
        return (
            <>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {!getCurrentImageUrl() ? (
                            <div className="w-full h-full bg-gradient-to-br from-red-600 to-yellow-600 flex items-center justify-center">
                                <span className="text-white text-xl">{getCategoryEmoji(product.category?.slug || '')}</span>
                            </div>
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${getImageUrl(getCurrentImageUrl(), getCurrentName())})`
                                }}
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">{hasVariants ? product.name : getCurrentName()}</h3>
                        <p className="text-xs text-gray-600 mb-2">{product.shortDescription}</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-red-600">{formatPrice(getCurrentPrice())}</span>
                            <button
                                onClick={handleAddToCart}
                                className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                            >
                                {hasCustomizations ? '⚙️' : '+'}
                            </button>
                        </div>
                    </div>
                </div>

                <ProductCustomizationModal
                    product={product}
                    isOpen={showCustomizationModal}
                    onClose={() => setShowCustomizationModal(false)}
                />
            </>
        );
    }

    // Variant default - Style menu/catégories
    return (
        <>
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${Math.random() * 0.3}s` }}>

                {/* Image avec badges et prix */}
                <div className="relative h-64 overflow-hidden">
                    {!getCurrentImageUrl() ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-yellow-600">
                            <div className="text-white text-center p-4">
                                <div className="text-6xl mb-2">{getCategoryEmoji(product.category?.slug || '')}</div>
                                <div className="font-bold text-lg">{getCurrentName()}</div>
                                <div className="text-sm opacity-75">O'Boricienne</div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                            style={{
                                backgroundImage: `url(${getImageUrl(getCurrentImageUrl(), getCurrentName())})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isPopular && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                🔥 HIT
                            </span>
                        )}
                        {product.isPromo && (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                🎯 PROMO
                            </span>
                        )}
                        {product.isSpicy && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                🌶️ Épicé
                            </span>
                        )}
                        {product.isVegetarian && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                🌱 Végétarien
                            </span>
                        )}
                        {product.isVegan && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                🌿 Végan
                            </span>
                        )}
                    </div>

                    {/* Prix */}
                    <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xl font-black shadow-lg border-2 border-white">
                            {formatPrice(getCurrentPrice())}
                        </span>
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                            {hasVariants ? product.name : getCurrentName()}
                        </h3>
                        <span className="text-gray-500 text-sm">⏱️ {product.preparationTime}min</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.shortDescription || product.description}
                    </p>

                    {/* Catégorie et badges */}
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {product.category?.name}
                        </span>
                    </div>

                    {/* Personnalisations disponibles */}
                    {hasCustomizations && (
                        <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-1">
                                ⚙️ {product.customizations.length} personnalisation(s) disponible(s)
                            </div>
                            <div className="text-xs text-gray-400">
                                {product.customizations.map(c => c.name).slice(0, 2).join(', ')}
                                {product.customizations.length > 2 && '...'}
                            </div>
                        </div>
                    )}

                    {/* Sélection des variantes */}
                    {hasVariants && product.variants && (
                        <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2 font-medium">Choisir :</div>
                            <div className="flex gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedVariant?.id === variant.id
                                                ? 'bg-red-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-xs font-bold">
                                            {variant.name.includes('Seul') ? '🍔 Seul' : '🍟 Menu'}
                                        </div>
                                        <div className="text-xs opacity-90">
                                            {formatPrice(variant.price)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message pour les produits sans variantes menu */}
                    {!hasVariants && (product.category?.slug === 'sandwichs' || product.category?.slug === 'tacos') && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <div className="flex items-start">
                                <div className="text-blue-400 mr-2">ℹ️</div>
                                <div>
                                    <div className="text-xs font-medium text-blue-800">Prix menu sur demande</div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        Appelez-nous ou visitez-nous au restaurant pour connaître les prix des menus
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {/* <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
                        >
                            {hasCustomizations ? '⚙️ Personnaliser' : 'Ajouter au panier'}
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                            Détails
                        </button>
                    </div> */}
                </div>
            </div>

            <ProductCustomizationModal
                product={product}
                isOpen={showCustomizationModal}
                onClose={() => setShowCustomizationModal(false)}
            />
        </>
    );
}