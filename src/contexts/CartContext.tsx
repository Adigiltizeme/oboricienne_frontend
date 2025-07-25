'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../lib/api';

// Types pour le panier
export interface CartCustomization {
    customizationId: string;
    customizationName: string;
    optionId: string;
    optionName: string;
    priceModifier: number;
}

export interface CartItem {
    id: string; // ID unique pour cet item dans le panier
    productId: string;
    product: Product;
    quantity: number;
    customizations: CartCustomization[];
    totalPrice: number; // Prix total de cet item (produit + personnalisations) * quantité
    notes?: string; // Instructions spéciales
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    deliveryFee: number;
    finalPrice: number;
    isOpen: boolean;
}

// Actions du panier
type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
    | { type: 'REMOVE_ITEM'; payload: string } // item ID
    | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
    | { type: 'UPDATE_CUSTOMIZATIONS'; payload: { itemId: string; customizations: CartCustomization[] } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'OPEN_CART' }
    | { type: 'SET_DELIVERY_FEE'; payload: number }
    | { type: 'LOAD_CART'; payload: CartState };

// État initial
const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    deliveryFee: 0,
    finalPrice: 0,
    isOpen: false,
};

// Fonction pour calculer le prix d'un item
function calculateItemPrice(basePrice: number, customizations: CartCustomization[], quantity: number): number {
    const customizationsPrice = customizations.reduce((sum, custom) => sum + custom.priceModifier, 0);
    return (basePrice + customizationsPrice) * quantity;
}

// Fonction pour calculer les totaux du panier
function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return { totalItems, totalPrice };
}

// Fonction pour générer un ID unique
function generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Reducer du panier
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, customizations, quantity, notes } = action.payload;

            // Chercher si le produit avec les mêmes personnalisations existe déjà
            const existingItemIndex = state.items.findIndex(item =>
                item.productId === product.id &&
                JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
                item.notes === notes
            );

            let newItems: CartItem[];

            if (existingItemIndex >= 0) {
                // Produit existe déjà, augmenter la quantité
                newItems = state.items.map((item, index) => {
                    if (index === existingItemIndex) {
                        const newQuantity = item.quantity + quantity;
                        const newTotalPrice = calculateItemPrice(
                            item.product.price,
                            item.customizations,
                            newQuantity
                        );
                        return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
                    }
                    return item;
                });
            } else {
                // Nouveau produit, l'ajouter
                const newItem: CartItem = {
                    ...action.payload,
                    id: generateItemId(),
                    totalPrice: calculateItemPrice(
                        product.price,
                        customizations,
                        quantity
                    ),
                };
                newItems = [...state.items, newItem];
            }

            const { totalItems, totalPrice } = calculateTotals(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                finalPrice: totalPrice + state.deliveryFee,
            };
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const { totalItems, totalPrice } = calculateTotals(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                finalPrice: totalPrice + state.deliveryFee,
            };
        }

        case 'UPDATE_QUANTITY': {
            const { itemId, quantity } = action.payload;

            if (quantity <= 0) {
                return cartReducer(state, { type: 'REMOVE_ITEM', payload: itemId });
            }

            const newItems = state.items.map(item => {
                if (item.id === itemId) {
                    const newTotalPrice = calculateItemPrice(
                        item.product.price,
                        item.customizations,
                        quantity
                    );
                    return { ...item, quantity, totalPrice: newTotalPrice };
                }
                return item;
            });

            const { totalItems, totalPrice } = calculateTotals(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                finalPrice: totalPrice + state.deliveryFee,
            };
        }

        case 'UPDATE_CUSTOMIZATIONS': {
            const { itemId, customizations } = action.payload;

            const newItems = state.items.map(item => {
                if (item.id === itemId) {
                    const newTotalPrice = calculateItemPrice(
                        item.product.price,
                        customizations,
                        item.quantity
                    );
                    return { ...item, customizations, totalPrice: newTotalPrice };
                }
                return item;
            });

            const { totalItems, totalPrice } = calculateTotals(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                finalPrice: totalPrice + state.deliveryFee,
            };
        }

        case 'CLEAR_CART':
            return {
                ...initialState,
                isOpen: state.isOpen, // Garder l'état d'ouverture
            };

        case 'TOGGLE_CART':
            return {
                ...state,
                isOpen: !state.isOpen,
            };

        case 'CLOSE_CART':
            return {
                ...state,
                isOpen: false,
            };

        case 'OPEN_CART':
            return {
                ...state,
                isOpen: true,
            };

        case 'SET_DELIVERY_FEE':
            return {
                ...state,
                deliveryFee: action.payload,
                finalPrice: state.totalPrice + action.payload,
            };

        case 'LOAD_CART':
            return action.payload;

        default:
            return state;
    }
}

// Contexte
const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addItem: (product: Product, customizations?: CartCustomization[], quantity?: number, notes?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    updateCustomizations: (itemId: string, customizations: CartCustomization[]) => void;
    clearCart: () => void;
    toggleCart: () => void;
    closeCart: () => void;
    openCart: () => void;
    setDeliveryFee: (fee: number) => void;
} | null>(null);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('oboricienne_cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch (error) {
                console.error('Erreur lors du chargement du panier:', error);
            }
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('oboricienne_cart', JSON.stringify(state));
    }, [state]);

    // Fonctions helper
    const addItem = (
        product: Product,
        customizations: CartCustomization[] = [],
        quantity: number = 1,
        notes?: string
    ) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                productId: product.id,
                product,
                quantity,
                customizations,
                totalPrice: 0, // Sera calculé dans le reducer
                notes,
            },
        });
    };

    const removeItem = (itemId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    };

    const updateCustomizations = (itemId: string, customizations: CartCustomization[]) => {
        dispatch({ type: 'UPDATE_CUSTOMIZATIONS', payload: { itemId, customizations } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const toggleCart = () => {
        dispatch({ type: 'TOGGLE_CART' });
    };

    const closeCart = () => {
        dispatch({ type: 'CLOSE_CART' });
    };

    const openCart = () => {
        dispatch({ type: 'OPEN_CART' });
    };

    const setDeliveryFee = (fee: number) => {
        dispatch({ type: 'SET_DELIVERY_FEE', payload: fee });
    };

    return (
        <CartContext.Provider
            value={{
                state,
                dispatch,
                addItem,
                removeItem,
                updateQuantity,
                updateCustomizations,
                clearCart,
                toggleCart,
                closeCart,
                openCart,
                setDeliveryFee,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook pour utiliser le contexte
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart doit être utilisé dans un CartProvider');
    }
    return context;
}