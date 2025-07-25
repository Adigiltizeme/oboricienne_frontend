'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/menu' }: ProtectedRouteProps) {
    const { state } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!state.isLoading && !state.isAuthenticated) {
            router.push(redirectTo);
        }
    }, [state.isLoading, state.isAuthenticated, router, redirectTo]);

    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!state.isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}