'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Formulaire de connexion
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Formulaire d'inscription
    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: ''
    });

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setIsLoading(false);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            setIsLoading(false);
            return;
        }

        if (registerData.password.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
            setIsLoading(false);
            return;
        }

        const result = await register({
            email: registerData.email,
            password: registerData.password,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            phone: registerData.phone || undefined
        });

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'login' ? '🔑 Connexion' : '✨ Inscription'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === 'login'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === 'register'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Inscription
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">

                        {/* Message */}
                        {message && (
                            <div className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                <div className="flex items-center">
                                    <span className="mr-2">
                                        {message.type === 'success' ? '✅' : '⚠️'}
                                    </span>
                                    {message.text}
                                </div>
                            </div>
                        )}

                        {/* Formulaire de connexion */}
                        {activeTab === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={loginData.email}
                                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={loginData.password}
                                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Votre mot de passe"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {isLoading ? 'Inscription...' : 'Créer mon compte'}
                                </button>

                                {/* Avantages inscription */}
                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-medium text-green-800 mb-2">🎁 Avantages membre :</h4>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• 50 points de bienvenue offerts</li>
                                        <li>• Programme de fidélité exclusif</li>
                                        <li>• Commandes plus rapides</li>
                                        <li>• Offres et promotions en avant-première</li>
                                    </ul>
                                </div>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                            {activeTab === 'login' ? (
                                <p>
                                    Pas encore de compte ?{' '}
                                    <button
                                        onClick={() => setActiveTab('register')}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Inscrivez-vous gratuitement
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Déjà un compte ?{' '}
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Connectez-vous
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}