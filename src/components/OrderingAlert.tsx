'use client';

import { useState } from 'react';

export default function OrderingAlert() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-blue-900 text-white fixed top-20 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="bg-white/20 rounded-full p-2">
                                <span className="text-2xl">📞</span>
                            </div>
                        </div>

                        {/* Message principal */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                                <div className="mb-2 sm:mb-0">
                                    <div className="font-bold text-lg">
                                        🚨 Commandes en ligne temporairement indisponibles
                                    </div>
                                    <div className="text-sm opacity-90">
                                        Commandez par téléphone ou venez directement au restaurant
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <button
                                        onClick={() => window.open('tel:0744786478', '_self')}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-300 transform hover:scale-105"
                                    >
                                        📞 07 44 78 64 78
                                    </button>
                                    <div className="hidden sm:flex items-center text-sm opacity-90">
                                        <span className="mr-2">📍</span>
                                        <span>967 Rue Jacquard, Évreux</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info livraisons */}
                            <div className="mt-2 text-xs opacity-80 flex items-center">
                                <span className="mr-1">🚚</span>
                                <span>Livraisons disponibles - Appelez-nous pour commander</span>
                            </div>
                        </div>
                    </div>

                    {/* Bouton fermer */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 ml-4 text-white/70 hover:text-white transition-colors"
                        aria-label="Fermer l'alerte"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Animation de gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
    );
}