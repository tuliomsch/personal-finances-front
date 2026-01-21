import { api } from '../lib/api';

export interface AccountData {
    id: number;
    name: string;
    type: string;
    balance: number;
    currencyCode: string;
    bankName?: string;
    cardDebt?: number;
}

export interface AccountsDataWithTotal {
    accounts: AccountData[];
    totalBalance: number;
}

export const accountService = {
    getAccounts: async (userId: number) => {
        const { data } = await api.get<AccountsDataWithTotal>(`/accounts/user/${userId}`);
        return data;
    },

    createAccount: async (accountData: AccountData) => {
        const { data } = await api.post('/accounts', accountData);
        return data;
    },

    updateAccount: async (id: number, accountData: AccountData) => {
        const { data } = await api.patch(`/accounts/${id}`, accountData);
        return data;
    },

    deleteAccount: async (id: number) => {
        const { data } = await api.delete(`/accounts/${id}`);
        return data;
    }
};