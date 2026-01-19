import { api } from '../lib/api';

export interface UserProfile {
    id: number;
    email: string;
    supabaseId: string;
    name: string;
    lastName: string;
    currencyPref: string;
}

export interface AccountData {
    type: string;
    name: string;
    balance: number;
    bankName?: string;
}

export interface CreateUserProfileData {
    email: string;
    supabaseId: string;
    name?: string;
    lastName?: string;
    currencyPref: string;
    accounts: AccountData[];
}

export const userService = {
    getUserProfile: async () => {
        const { data } = await api.get<UserProfile>('/users/me');
        return data;
    },

    completeUserProfile: async (userData: CreateUserProfileData) => {
        const { data } = await api.post('/users/register', userData);
        return data;
    }
};
