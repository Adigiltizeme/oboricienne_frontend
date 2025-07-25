// src/components/AuthRequiredButton.tsx
'use client';

import { useAuthRedirect } from '../hooks/useAuthRedirect';
import AuthModal from './AuthModal';

interface AuthRequiredButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
}

export default function AuthRequiredButton({
    children,
    onClick,
    className = '',
    disabled = false,
    title,
    type = 'button'
}: AuthRequiredButtonProps) {
    const { requireAuth, showAuthModal, closeAuthModal } = useAuthRedirect();

    const handleClick = () => {
        if (disabled) return;
        requireAuth(onClick);
    };

    return (
        <>
            <button
                type={type}
                onClick={handleClick}
                className={className}
                disabled={disabled}
                title={title}
            >
                {children}
            </button>

            <AuthModal
                isOpen={showAuthModal}
                onClose={closeAuthModal}
                defaultTab="login"
            />
        </>
    );
}