'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/api';

// Clé publique Stripe (à mettre dans .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
    orderData: {
        items: any[];
        deliveryMode: string;
        deliveryAddress?: any;
        scheduledFor?: string;
        customerNotes?: string;
    };
    onPaymentSuccess: (orderId: string, orderNumber: string) => void;
    onPaymentError: (error: string) => void;
}

function CheckoutForm({ orderData, onPaymentSuccess, onPaymentError }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { state, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Créer le Payment Intent au chargement
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    onPaymentError('Vous devez être connecté pour commander');
                    return;
                }

                const response = await fetch('/api/payment/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(orderData)
                });

                const data = await response.json();

                if (data.success) {
                    setClientSecret(data.clientSecret);
                } else {
                    onPaymentError(data.message || 'Erreur lors de la création du paiement');
                }
            } catch (error) {
                console.error('Erreur Payment Intent:', error);
                onPaymentError('Erreur de connexion au serveur de paiement');
            }
        };

        createPaymentIntent();
    }, [orderData, onPaymentError]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        const cardNumber = elements.getElement(CardNumberElement);

        if (!cardNumber) {
            setPaymentError('Élément de carte non trouvé');
            setIsProcessing(false);
            return;
        }

        // Confirmer le paiement
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumber,
                billing_details: {
                    name: orderData.deliveryAddress?.firstName + ' ' + orderData.deliveryAddress?.lastName,
                    phone: orderData.deliveryAddress?.phone,
                    address: orderData.deliveryAddress ? {
                        line1: orderData.deliveryAddress.street,
                        city: orderData.deliveryAddress.city,
                        postal_code: orderData.deliveryAddress.postalCode,
                        country: 'FR'
                    } : undefined
                }
            }
        });

        if (error) {
            setPaymentError(error.message || 'Erreur lors du paiement');
            setIsProcessing(false);
        } else if (paymentIntent.status === 'succeeded') {
            // Confirmer côté serveur
            try {
                const response = await fetch('/api/payment/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id
                    })
                });

                const data = await response.json();

                if (data.success) {
                    clearCart();
                    onPaymentSuccess(data.order.id, data.order.orderNumber);
                } else {
                    setPaymentError(data.message || 'Erreur lors de la confirmation');
                }
            } catch (error) {
                console.error('Erreur confirmation:', error);
                setPaymentError('Erreur lors de la confirmation du paiement');
            }

            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-2">Préparation du paiement...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Informations de paiement */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">💳 Informations de paiement</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro de carte
                        </label>
                        <div className="p-3 border border-gray-300 rounded-lg bg-white">
                            <CardNumberElement options={cardElementOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date d'expiration
                            </label>
                            <div className="p-3 border border-gray-300 rounded-lg bg-white">
                                <CardExpiryElement options={cardElementOptions} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVC
                            </label>
                            <div className="p-3 border border-gray-300 rounded-lg bg-white">
                                <CardCvcElement options={cardElementOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Erreur de paiement */}
            {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-red-600 text-lg mr-2">⚠️</span>
                        <span className="text-red-800">{paymentError}</span>
                    </div>
                </div>
            )}

            {/* Récapitulatif final */}
            <div className="bg-white border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Récapitulatif final</h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Articles ({state.totalItems})</span>
                        <span>{formatPrice(state.totalPrice)}</span>
                    </div>

                    {state.deliveryFee > 0 && (
                        <div className="flex justify-between">
                            <span>Livraison</span>
                            <span>{formatPrice(state.deliveryFee)}</span>
                        </div>
                    )}

                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total à payer</span>
                        <span className="text-red-600">{formatPrice(state.finalPrice)}</span>
                    </div>
                </div>
            </div>

            {/* Bouton de paiement */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-colors ${!stripe || isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                    </div>
                ) : (
                    `Payer ${formatPrice(state.finalPrice)} 💳`
                )}
            </button>

            {/* Sécurité */}
            <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-1 mb-2">
                    <span>🔒</span>
                    <span>Paiement 100% sécurisé par Stripe</span>
                </div>
                <p>Vos informations bancaires ne sont jamais stockées sur nos serveurs</p>
            </div>
        </form>
    );
}

interface StripeCheckoutProps {
    orderData: {
        items: any[];
        deliveryMode: string;
        deliveryAddress?: any;
        scheduledFor?: string;
        customerNotes?: string;
    };
    onPaymentSuccess: (orderId: string, orderNumber: string) => void;
    onPaymentError: (error: string) => void;
}

export default function StripeCheckout({ orderData, onPaymentSuccess, onPaymentError }: StripeCheckoutProps) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                orderData={orderData}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
            />
        </Elements>
    );
}