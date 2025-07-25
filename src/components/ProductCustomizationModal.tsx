'use client';

import { useState, useEffect } from 'react';
import { Product, CustomizationOption } from '../lib/api';
import { useCart, CartCustomization } from '../contexts/CartContext';
import { formatPrice } from '../lib/api';

interface ProductCustomizationModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

interface SelectedOption {
    customizationId: string;
    optionId: string;
    option: CustomizationOption;
}

export default function ProductCustomizationModal({
    product,
    isOpen,
    onClose
}: ProductCustomizationModalProps) {
    const { addItem } = useCart();
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [totalPrice, setTotalPrice] = useState(product.price);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Initialize default options
            const defaultOptions: SelectedOption[] = [];
            product.customizations?.forEach(customization => {
                const defaultOption = customization.options.find(opt => opt.isDefault);
                if (defaultOption) {
                    defaultOptions.push({
                        customizationId: customization.id,
                        optionId: defaultOption.id,
                        option: defaultOption
                    });
                }
            });
            setSelectedOptions(defaultOptions);
            setQuantity(1);
            setNotes('');
        }
    }, [isOpen, product]);

    // Calculate total price when options or quantity change
    useEffect(() => {
        const customizationsPrice = selectedOptions.reduce(
            (sum, selected) => sum + selected.option.priceModifier,
            0
        );
        setTotalPrice((product.price + customizationsPrice) * quantity);
    }, [selectedOptions, quantity, product.price]);

    const handleOptionSelect = (customizationId: string, option: CustomizationOption) => {
        const customization = product.customizations?.find(c => c.id === customizationId);
        if (!customization) return;

        if (customization.isMultiple) {
            // Multiple selection allowed
            const existingIndex = selectedOptions.findIndex(
                selected => selected.customizationId === customizationId &&
                    selected.optionId === option.id
            );

            if (existingIndex >= 0) {
                // Remove if already selected
                setSelectedOptions(prev => prev.filter((_, index) => index !== existingIndex));
            } else {
                // Add new selection
                setSelectedOptions(prev => [...prev, {
                    customizationId,
                    optionId: option.id,
                    option
                }]);
            }
        } else {
            // Single selection only
            setSelectedOptions(prev => [
                ...prev.filter(selected => selected.customizationId !== customizationId),
                { customizationId, optionId: option.id, option }
            ]);
        }
    };

    const isOptionSelected = (customizationId: string, optionId: string) => {
        return selectedOptions.some(
            selected => selected.customizationId === customizationId &&
                selected.optionId === optionId
        );
    };

    const handleAddToCart = () => {
        const cartCustomizations: CartCustomization[] = selectedOptions.map(selected => ({
            customizationId: selected.customizationId,
            customizationName: product.customizations?.find(c => c.id === selected.customizationId)?.name || '',
            optionId: selected.optionId,
            optionName: selected.option.name,
            priceModifier: selected.option.priceModifier
        }));

        addItem(product, cartCustomizations, quantity, notes || undefined);
        onClose();
    };

    const getCustomizationTypeIcon = (type: string) => {
        switch (type) {
            case 'SAUCE': return '🥄';
            case 'SUPPLEMENT': return '🥓';
            case 'CUISSON': return '🔥';
            case 'FROMAGE': return '🧀';
            case 'TAILLE': return '📏';
            default: return '⚙️';
        }
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
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Personnaliser votre {product.name}
                                </h2>
                                <p className="text-gray-600">{product.shortDescription}</p>
                            </div>
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
                    </div>

                    {/* Customizations */}
                    <div className="p-6 space-y-8">
                        {product.customizations?.map((customization) => (
                            <div key={customization.id} className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">
                                        {getCustomizationTypeIcon(customization.type)}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {customization.name}
                                        {customization.isRequired && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </h3>
                                    {customization.isMultiple && (
                                        <span className="text-sm text-gray-500">
                                            (Plusieurs choix possibles)
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {customization.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(customization.id, option)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${isOptionSelected(customization.id, option.id)
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">
                                                    {option.name}
                                                </span>
                                                {option.priceModifier > 0 && (
                                                    <span className="text-green-600 font-medium">
                                                        +{formatPrice(option.priceModifier)}
                                                    </span>
                                                )}
                                                {option.priceModifier === 0 && option.isDefault && (
                                                    <span className="text-gray-500 text-sm">
                                                        Inclus
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Special Instructions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                                <span>📝</span>
                                <span>Instructions spéciales</span>
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Des demandes particulières ? (Ex: bien cuit, sans cornichons...)"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                rows={3}
                                maxLength={200}
                            />
                            <p className="text-sm text-gray-500">
                                {notes.length}/200 caractères
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                                <span>🔢</span>
                                <span>Quantité</span>
                            </h3>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-xl"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-medium text-gray-700">
                                Prix total :
                            </span>
                            <span className="text-2xl font-bold text-red-600">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Ajouter au panier ({formatPrice(totalPrice)})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}