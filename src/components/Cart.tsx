'use client';

import { getCategoryImage } from '@/helpers/getCategoryEmoji';
import { useCart } from '../contexts/CartContext';
import { formatPrice, getImageUrl } from '../lib/api';

export default function Cart() {
    const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();

    if (!state.isOpen) return null;

    return (
        <>
            {/* Overlay transparent */}
            <div
                className="fixed inset-0 z-40" // backdrop-blur-[15px]
                onClick={closeCart}
            />

            {/* Panier Sidebar */}
            <div className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">

                {/* Header */}
                <div className="bg-red-600 text-white p-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">🛒 Mon Panier</h2>
                            <p className="text-red-200">{state.totalItems} article(s)</p>
                        </div>
                        <button
                            onClick={closeCart}
                            className="text-white hover:text-red-200 transition-colors p-2 hover:bg-red-700 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contenu */}
                {state.items.length === 0 ? (
                    // Panier vide
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h3>
                            <p className="text-gray-600 mb-6">Ajoutez des délicieuses créations O'Boricienne !</p>
                            <button
                                onClick={closeCart}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Liste des items - Scrollable avec hauteur fixe */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                            {state.items.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-4">

                                    <div className="flex items-start space-x-4">

                                        {/* Image produit */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            {!item.product.imageUrl ? (
                                                <img
                                                    src={getCategoryImage(item.product.category?.slug || '')}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${getImageUrl(item.product.imageUrl, item.product.name)})`
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Infos produit */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                                            <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>

                                            {/* Personnalisations */}
                                            {item.customizations.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500 mb-1">Personnalisations:</p>
                                                    <div className="space-y-1">
                                                        {item.customizations.map((custom, index) => (
                                                            <div key={index} className="text-xs text-gray-600 flex justify-between">
                                                                <span>• {custom.optionName}</span>
                                                                {custom.priceModifier > 0 && (
                                                                    <span className="text-green-600">+{formatPrice(custom.priceModifier)}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {item.notes && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">Note: {item.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-end space-y-2">

                                            {/* Prix total de l'item */}
                                            <div className="font-bold text-red-600">
                                                {formatPrice(item.totalPrice)}
                                            </div>

                                            {/* Contrôles quantité */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Supprimer */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer avec totaux - Fixe en bas */}
                        <div className="border-t pt-2 pb-0 bg-white p-6 space-y-4 flex-shrink-0">

                            {/* Totaux */}
                            <div className="space-y-2 mb-0">
                                <div className="flex justify-between text-gray-600">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(state.totalPrice)}</span>
                                </div>
                                {state.deliveryFee > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Livraison</span>
                                        <span>{formatPrice(state.deliveryFee)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-red-600">{formatPrice(state.finalPrice)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        window.location.href = '/checkout';
                                        closeCart();
                                    }}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Commander ({formatPrice(state.finalPrice)})
                                </button>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={closeCart}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-4 rounded-lg transition-colors"
                                    >
                                        Continuer mes achats
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 font-medium py-1 px-4 rounded-lg transition-colors"
                                    >
                                        Vider le panier
                                    </button>
                                </div>
                            </div>

                            {/* Info livraison */}
                            <div className="text-center text-sm text-gray-500">
                                🚚 Livraison gratuite près du Bâtiment CFA • ⏱️ Préparation 15-20 min
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}