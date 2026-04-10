import { apiClient } from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface AuthSetupStatus {
    signup_enabled: boolean;
    user_count: number;
}

export interface User {
    id: number;
    email: string;
    is_active: boolean;
}

export const authApi = {
    login: async (email: string, password: string) => {
        const { data } = await apiClient.post<Token>('/auth/login/json', {
            email,
            password,
        });
        return data;
    },

    signup: async (email: string, password: string) => {
        const { data } = await apiClient.post<Token>('/auth/signup', {
            email,
            password,
        });
        return data;
    },

    getCurrentUser: async () => {
        const { data } = await apiClient.get<User>('/auth/me');
        return data;
    },

    getSetupStatus: async () => {
        const { data } = await apiClient.get<AuthSetupStatus>('/auth/setup-status');
        return data;
    },
};
