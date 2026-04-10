'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type User } from '@/lib/api/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        const { access_token } = await authApi.login(email, password);
        localStorage.setItem('access_token', access_token);
        await checkAuth();
    };

    const signup = async (email: string, password: string) => {
        const { access_token } = await authApi.signup(email, password);
        localStorage.setItem('access_token', access_token);
        await checkAuth();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        router.push('/login');
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Auth verification failed:', error);
            localStorage.removeItem('access_token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
