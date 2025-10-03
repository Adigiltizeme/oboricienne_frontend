'use client';

import { useState, useEffect } from 'react';

export default function OrderingAlert() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Charger l'état depuis sessionStorage au montage (persiste pendant la session de navigation)
    useEffect(() => {
        setIsMounted(true);
        const alertDismissed = sessionStorage.getItem('orderingAlertDismissed');
        if (alertDismissed === 'true') {
            setIsVisible(false);
        } else {
            // Auto-expand pendant 5 secondes au premier affichage
            setIsExpanded(true);
            setTimeout(() => setIsExpanded(false), 5000);
        }
    }, []);

    // Fonction pour fermer et persister l'état (pour cette session de navigation uniquement)
    const handleClose = () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('orderingAlertDismissed', 'true');
        }
    };

    // Ne rien afficher pendant l'hydratation pour éviter les erreurs
    if (!isMounted) return null;
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] pointer-events-none">
            <div className="pointer-events-auto">
                {/* Version compacte (badge) */}
                {!isExpanded && (
                    <div className="relative group">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full p-4 shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all duration-300 flex items-center space-x-2"
                        >
                            <span className="text-2xl">📞</span>
                            <span className="font-bold">Commander</span>
                        </button>

                        {/* Tooltip au hover */}
                        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                                Commandes en ligne indisponibles
                                <div className="absolute top-full right-4 -mt-1">
                                    <div className="border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Version étendue (carte) */}
                {isExpanded && (
                    <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-blue-900 text-white rounded-2xl shadow-2xl w-96 animate-slide-up">

                        {/* Alerte en ligne indisponible - TRÈS VISIBLE */}
                        <div className="bg-red-600/90 border-2 border-red-400 p-3 m-3 rounded-xl flex items-center space-x-3 animate-pulse">
                            <span className="text-3xl">🚨</span>
                            <div className="flex-1">
                                <div className="font-bold text-base">Commandes en ligne temporairement indisponibles</div>
                                <div className="text-xs opacity-90 mt-1">Appelez-nous directement pour commander ou rendez-vous au restaurant</div>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 rounded-full p-2">
                                    <span className="text-2xl">📞</span>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Commandes téléphoniques</div>
                                    <div className="text-xs opacity-75">En ligne bientôt disponible</div>
                                </div>
                            </div>

                            {/* Boutons header */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                                    title="Réduire"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                                    title="Fermer définitivement"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Bouton téléphone */}
                            <a
                                href="tel:0744786478"
                                className="flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl p-3 transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <div className="font-bold">07 44 78 64 78</div>
                                        <div className="text-xs opacity-75">Appelez maintenant</div>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>

                            {/* Adresse */}
                            <div className="flex items-center space-x-3 text-sm opacity-90">
                                <span>📍</span>
                                <span>967 Rue Jacquard, Évreux</span>
                            </div>

                            {/* Info livraisons */}
                            <div className="flex items-center space-x-3 text-xs opacity-80 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                                <span>🚚</span>
                                <span>Livraisons disponibles sur appel</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
