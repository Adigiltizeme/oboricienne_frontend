'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    loyaltyLevel: string;
    loyaltyPoints: number;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'AUTH_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoading: false,
                isAuthenticated: true,
            };

        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
            };

        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false
            };

        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };

        default:
            return state;
    }
}

const AuthContext = createContext<{
    state: AuthState;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Vérifier l'authentification au démarrage
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        dispatch({ type: 'AUTH_START' });

        const token = localStorage.getItem('auth_token');
        if (!token) {
            dispatch({ type: 'AUTH_FAILURE' });
            return;
        }

        // Vérifier le cache de session (5 minutes)
        const cachedUser = sessionStorage.getItem('cached_user');
        const cacheTime = sessionStorage.getItem('cache_time');

        if (cachedUser && cacheTime) {
            const now = Date.now();
            const timeDiff = now - parseInt(cacheTime);

            // Si le cache a moins de 5 minutes, l'utiliser
            if (timeDiff < 5 * 60 * 1000) {
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: JSON.parse(cachedUser),
                        token
                    }
                });
                return;
            }
        }

        try {
            const response = await api.get('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Mettre en cache l'utilisateur
                sessionStorage.setItem('cached_user', JSON.stringify(response.data.user));
                sessionStorage.setItem('cache_time', Date.now().toString());

                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: response.data.user,
                        token
                    }
                });
            } else {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('cached_user');
                sessionStorage.removeItem('cache_time');
                dispatch({ type: 'AUTH_FAILURE' });
            }
        } catch (error) {
            console.error('Erreur vérification auth:', error);
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('cached_user');
            sessionStorage.removeItem('cache_time');
            dispatch({ type: 'AUTH_FAILURE' });
        }
    };

    const login = async (email: string, password: string) => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.token);
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: response.data.user,
                        token: response.data.token
                    }
                });
                return { success: true, message: response.data.message };
            } else {
                dispatch({ type: 'AUTH_FAILURE' });
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Erreur login:', error);
            dispatch({ type: 'AUTH_FAILURE' });
            return { success: false, message: 'Erreur de connexion' };
        }
    };

    const register = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.token);
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: response.data.user,
                        token: response.data.token
                    }
                });
                return { success: true, message: response.data.message };
            } else {
                dispatch({ type: 'AUTH_FAILURE' });
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Erreur register:', error);
            dispatch({ type: 'AUTH_FAILURE' });
            return { success: false, message: 'Erreur lors de l\'inscription' };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('cached_user');
        sessionStorage.removeItem('cache_time');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{
            state,
            login,
            register,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return {
        ...context,
        user: context.state.user,
        token: context.state.token,
        isLoading: context.state.isLoading,
        isAuthenticated: context.state.isAuthenticated
    };
}