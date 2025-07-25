'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function UserMenu() {
    const { state, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    if (state.isLoading) {
        return (
            <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        );
    }

    if (!state.isAuthenticated) {
        return (
            <>
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                    <span>👤</span>
                    <span>Connexion</span>
                </button>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    {state.user?.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                        {state.user?.firstName}
                    </div>
                    <div className="text-xs text-gray-600">
                        {state.user?.loyaltyPoints} pts
                    </div>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">

                        {/* Header utilisateur */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {state.user?.firstName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {state.user?.firstName} {state.user?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {state.user?.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Programme fidélité */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Programme fidélité</span>
                                <span className="text-sm font-bold text-red-600">
                                    {state.user?.loyaltyLevel}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">🏆</span>
                                <span className="text-sm text-gray-600">
                                    {state.user?.loyaltyPoints} points
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {100 - (state.user?.loyaltyPoints || 0) % 100} points pour la prochaine récompense
                            </div>
                        </div>

                        {/* Menu options */}
                        <div className="p-2">
                            <a
                                href="/profile"
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span>👤</span>
                                <span>Mon profil</span>
                            </a>

                            <a
                                href="/orders"
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span>📋</span>
                                <span>Mes commandes</span>
                            </a>

                            <a
                                href="/favorites"
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span>❤️</span>
                                <span>Mes favoris</span>
                            </a>

                            <a
                                href="/addresses"
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span>📍</span>
                                <span>Mes adresses</span>
                            </a>

                            <div className="border-t border-gray-200 my-2"></div>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <span>🚪</span>
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}