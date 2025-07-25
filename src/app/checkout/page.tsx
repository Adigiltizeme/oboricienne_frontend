'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice, getImageUrl } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/AuthModal';
import StripeCheckout from '../../components/StripeCheckout';

type DeliveryMode = 'DELIVERY' | 'PICKUP' | 'DINE_IN';

interface DeliveryAddress {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    apartment?: string;
    instructions?: string;
}

interface RestaurantHours {
    [key: string]: { open: string; close: string };
}

export default function CheckoutPage() {
    const { state: authState } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderInfo, setOrderInfo] = useState<{ orderId: string; orderNumber: string } | null>(null);
    const { state, setDeliveryFee } = useCart();
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('DELIVERY');
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        firstName: '',
        lastName: '',
        phone: '',
        street: '',
        city: 'Évreux',
        postalCode: '27000'
    });
    const [selectedDateTime, setSelectedDateTime] = useState<string>('asap');
    const [customerNotes, setCustomerNotes] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Restaurant hours (from config)
    const restaurantHours: RestaurantHours = {
        monday: { open: '07:00', close: '21:30' },
        tuesday: { open: '07:00', close: '21:30' },
        wednesday: { open: '07:00', close: '21:30' },
        thursday: { open: '07:00', close: '21:30' },
        friday: { open: '07:00', close: '21:30' },
        saturday: { open: '07:00', close: '21:30' },
        sunday: { open: '07:00', close: '21:30' }
    };

    // Calculate delivery fee based on address
    useEffect(() => {
        if (deliveryMode === 'DELIVERY' && deliveryAddress.postalCode) {
            let fee = 0;
            const postalCode = deliveryAddress.postalCode;

            // Zone CFA et proche (gratuit)
            if (['27000', '27100'].includes(postalCode)) {
                fee = 0;
            }
            // Zone industrielle (1.50€)
            else if (['27930', '27950'].includes(postalCode)) {
                fee = 1.50;
            }
            // Périphérie (3€)
            else {
                fee = 3.00;
            }

            setDeliveryFee(fee);
        } else {
            setDeliveryFee(0);
        }
    }, [deliveryMode, deliveryAddress.postalCode]);

    // Validate form
    useEffect(() => {
        let valid = state.items.length > 0;

        if (deliveryMode === 'DELIVERY') {
            valid = valid &&
                deliveryAddress.firstName.trim() !== '' &&
                deliveryAddress.lastName.trim() !== '' &&
                deliveryAddress.phone.trim() !== '' &&
                deliveryAddress.street.trim() !== '' &&
                deliveryAddress.city.trim() !== '' &&
                deliveryAddress.postalCode.trim() !== '';
        }

        setIsFormValid(valid);
    }, [deliveryMode, deliveryAddress, state.items]);

    const generateTimeSlots = () => {
        const slots = [{ value: 'asap', label: 'Dès que possible (15-20 min)' }];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Generate slots for today and tomorrow
        for (let day = 0; day < 2; day++) {
            const date = new Date();
            date.setDate(date.getDate() + day);
            const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
            const hours = restaurantHours[dayName];

            if (hours) {
                const [openHour] = hours.open.split(':').map(Number);
                const [closeHour] = hours.close.split(':').map(Number);

                let startHour = day === 0 ? Math.max(currentHour + 1, openHour) : openHour;

                for (let hour = startHour; hour < closeHour; hour++) {
                    for (let minute of [0, 30]) {
                        // Skip past times for today
                        if (day === 0 && hour === currentHour && minute <= currentMinute) continue;

                        const timeSlot = new Date(date);
                        timeSlot.setHours(hour, minute, 0, 0);

                        const value = timeSlot.toISOString();
                        const label = timeSlot.toLocaleDateString('fr-FR', {
                            weekday: day === 0 ? undefined : 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        slots.push({ value, label });
                    }
                }
            }
        }

        return slots.slice(0, 20); // Limite à 20 créneaux
    };

    const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
        setDeliveryAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Vérifier l'authentification
        if (!authState.isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        // Préparer les données de commande
        const orderData = {
            items: state.items,
            deliveryMode,
            deliveryAddress: deliveryMode === 'DELIVERY' ? deliveryAddress : null,
            scheduledFor: selectedDateTime === 'asap' ? null : selectedDateTime,
            customerNotes,
            totalAmount: state.finalPrice
        };

        // Passer au paiement
        setShowPayment(true);
    };

    // 4. Ajouter ces fonctions de callback Stripe :
    const handlePaymentSuccess = (orderId: string, orderNumber: string) => {
        setOrderInfo({ orderId, orderNumber });
        setPaymentSuccess(true);
        setShowPayment(false);
    };

    const handlePaymentError = (error: string) => {
        alert(`Erreur de paiement: ${error}`);
        setShowPayment(false);
    };

    const getDeliveryModeIcon = (mode: DeliveryMode) => {
        switch (mode) {
            case 'DELIVERY': return '🚚';
            case 'PICKUP': return '🏃‍♂️';
            case 'DINE_IN': return '🍽️';
        }
    };

    const getDeliveryModeDescription = (mode: DeliveryMode) => {
        switch (mode) {
            case 'DELIVERY': return 'Livraison à domicile ou au travail';
            case 'PICKUP': return 'Retrait au restaurant (Zone Industrielle)';
            case 'DINE_IN': return 'Consommation sur place';
        }
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
                    <p className="text-gray-600 mb-6">Ajoutez des produits avant de commander</p>
                    <a
                        href="/menu"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Voir le menu
                    </a>
                </div>
            </div>
        );
    }

    // Affichage succès commande
    if (paymentSuccess && orderInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Commande confirmée !
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">
                            Commande #{orderInfo.orderNumber}
                        </p>
                        <p className="text-green-600 text-sm">
                            Vous recevrez un email de confirmation
                        </p>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="/orders"
                            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Suivre ma commande
                        </a>
                        <a
                            href="/menu"
                            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Continuer mes achats
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Affichage paiement Stripe
    if (showPayment) {
        const orderData = {
            items: state.items,
            deliveryMode,
            deliveryAddress: deliveryMode === 'DELIVERY' ? deliveryAddress : null,
            scheduledFor: selectedDateTime === 'asap' ? undefined : selectedDateTime,
            customerNotes
        };

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            💳 Paiement sécurisé
                        </h1>
                        <p className="text-gray-600">
                            Dernière étape avant de savourer vos créations O'Boricienne !
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <StripeCheckout
                            orderData={orderData}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />

                        <button
                            onClick={() => setShowPayment(false)}
                            className="w-full mt-4 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            ← Retour au récapitulatif
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🛒 Finaliser ma commande
                    </h1>
                    <p className="text-gray-600">
                        Plus qu'une étape avant de déguster vos créations O'Boricienne !
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Formulaire principal */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Mode de réception */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                🎯 Comment souhaitez-vous recevoir votre commande ?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(['DELIVERY', 'PICKUP', 'DINE_IN'] as DeliveryMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setDeliveryMode(mode)}
                                        className={`p-4 rounded-lg border-2 transition-all text-center ${deliveryMode === mode
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{getDeliveryModeIcon(mode)}</div>
                                        <div className="font-bold text-gray-900 mb-1">
                                            {mode === 'DELIVERY' && 'Livraison'}
                                            {mode === 'PICKUP' && 'Retrait'}
                                            {mode === 'DINE_IN' && 'Sur place'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {getDeliveryModeDescription(mode)}
                                        </div>
                                        {mode === 'DELIVERY' && state.deliveryFee > 0 && (
                                            <div className="text-sm font-medium text-green-600 mt-2">
                                                +{formatPrice(state.deliveryFee)}
                                            </div>
                                        )}
                                        {mode === 'DELIVERY' && state.deliveryFee === 0 && (
                                            <div className="text-sm font-medium text-green-600 mt-2">
                                                Gratuit
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Adresse de livraison */}
                        {deliveryMode === 'DELIVERY' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    📍 Adresse de livraison
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prénom *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={deliveryAddress.firstName}
                                            onChange={(e) => handleAddressChange('firstName', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Votre prénom"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={deliveryAddress.lastName}
                                            onChange={(e) => handleAddressChange('lastName', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Votre nom"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={deliveryAddress.phone}
                                            onChange={(e) => handleAddressChange('phone', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="06 XX XX XX XX"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Code postal *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={deliveryAddress.postalCode}
                                            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="27000"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Adresse *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={deliveryAddress.street}
                                            onChange={(e) => handleAddressChange('street', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Numéro et nom de rue"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ville *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={deliveryAddress.city}
                                            onChange={(e) => handleAddressChange('city', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Évreux"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Appartement / Étage
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress.apartment || ''}
                                            onChange={(e) => handleAddressChange('apartment', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Bât. A, 3ème étage..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Instructions de livraison
                                        </label>
                                        <textarea
                                            value={deliveryAddress.instructions || ''}
                                            onChange={(e) => handleAddressChange('instructions', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                            rows={2}
                                            placeholder="Codes d'accès, localisation précise..."
                                        />
                                    </div>
                                </div>

                                {/* Zone de livraison info */}
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-blue-600 text-lg">ℹ️</span>
                                        <div className="text-sm">
                                            <p className="font-medium text-blue-800 mb-1">Zones de livraison :</p>
                                            <ul className="text-blue-700 space-y-1">
                                                <li>• <strong>Gratuit</strong> : CFA Évreux et centre-ville (27000)</li>
                                                <li>• <strong>1,50€</strong> : Zone industrielle (27930, 27950)</li>
                                                <li>• <strong>3,00€</strong> : Périphérie d'Évreux</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Horaires */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                ⏰ Quand souhaitez-vous {deliveryMode === 'DELIVERY' ? 'être livré' : 'récupérer votre commande'} ?
                            </h2>

                            <select
                                value={selectedDateTime}
                                onChange={(e) => setSelectedDateTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                {generateTimeSlots().map((slot) => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-3 text-sm text-gray-600">
                                <p>🕒 <strong>Horaires d'ouverture :</strong> Tous les jours de 7h00 à 21h30</p>
                                <p>📍 <strong>Adresse :</strong> Zone Industrielle d'Évreux, près du CFA</p>
                            </div>
                        </div>

                        {/* Notes spéciales */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                📝 Notes ou demandes spéciales
                            </h2>

                            <textarea
                                value={customerNotes}
                                onChange={(e) => setCustomerNotes(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                rows={3}
                                placeholder="Allergies, préférences particulières, demandes spéciales..."
                                maxLength={300}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                {customerNotes.length}/300 caractères
                            </p>
                        </div>
                    </div>

                    {/* Récapitulatif commande */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                📋 Récapitulatif
                            </h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            {!item.product.imageUrl ? (
                                                <div className="w-full h-full bg-gradient-to-br from-red-600 to-yellow-600 flex items-center justify-center">
                                                    <span className="text-white text-sm">🍔</span>
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-full h-full bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${getImageUrl(item.product.imageUrl, item.product.name)})`
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                {item.quantity}x {item.product.name}
                                            </h4>
                                            {item.customizations.length > 0 && (
                                                <div className="text-xs text-gray-600 mt-1">
                                                    {item.customizations.map((custom, index) => (
                                                        <span key={index}>
                                                            {custom.optionName}
                                                            {index < item.customizations.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.notes && (
                                                <div className="text-xs text-gray-500 mt-1 italic">
                                                    "{item.notes}"
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(item.totalPrice)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totaux */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="text-gray-900">{formatPrice(state.totalPrice)}</span>
                                </div>

                                {state.deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Frais de livraison
                                        </span>
                                        <span className="text-gray-900">{formatPrice(state.deliveryFee)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-red-600">{formatPrice(state.finalPrice)}</span>
                                </div>
                            </div>

                            {/* Bouton de validation */}
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full mt-6 py-4 px-6 rounded-lg font-bold text-white transition-colors ${isFormValid
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {!isFormValid ? (
                                    'Veuillez compléter le formulaire'
                                ) : !authState.isAuthenticated ? (
                                    '🔑 Se connecter pour commander'
                                ) : (
                                    `Procéder au paiement ${formatPrice(state.finalPrice)} 💳`
                                )}
                            </button>
                            {/* Moyens de paiement */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 mb-2">Paiement sécurisé par :</p>
                                <div className="flex justify-center space-x-2">
                                    <span className="text-lg">💳</span>
                                    <span className="text-lg">🍎</span>
                                    <span className="text-lg">📱</span>
                                    <span className="text-xs text-gray-500">CB • Apple Pay • Google Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {/* Modal d'authentification */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                defaultTab="login"
            />
        </div>
    );
}