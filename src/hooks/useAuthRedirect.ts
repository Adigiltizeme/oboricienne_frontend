'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useAuthRedirect() {
    const { state } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const requireAuth = useCallback((callback: () => void) => {
        if (state.isAuthenticated) {
            callback();
        } else {
            setShowAuthModal(true);
        }
    }, [state.isAuthenticated]);

    const closeAuthModal = useCallback(() => {
        setShowAuthModal(false);
    }, []);

    return {
        requireAuth,
        showAuthModal,
        closeAuthModal,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isLoading: state.isLoading
    };
}