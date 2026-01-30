import { api } from "../lib/api";

export interface TransactionData {
    id: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: 'INCOME' | 'EXPENSE';
    category: CategoryData;
    accountId: number;
    categoryId?: number;
    transferToId?: number;
}

export interface CategoryData {
    name: string;
    icon: string;
}

export interface TransactionsDataWithTotal {
    transactions: TransactionData[];
    totalIncome: number;
    totalExpense: number;
}


export interface CreateTransactionData {
    accountId: number;
    categoryId?: number;
    userId: number;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    amount: number;
    transactionDate: string;
    rawDescription?: string;
    transferToId?: number;
}

export const transactionService = {
    async getTransactions(userId: number, startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const queryString = params.toString();
        const url = `/transactions/user/${userId}${queryString ? `?${queryString}` : ''}`;

        const { data } = await api.get<TransactionsDataWithTotal>(url);
        return data;
    },

    async createTransaction(transactionData: CreateTransactionData) {
        const { data } = await api.post('/transactions', transactionData);
        return data;
    },

    async updateTransaction(id: string, transactionData: Partial<CreateTransactionData>) {
        const { data } = await api.patch(`/transactions/${id}`, transactionData);
        return data;
    },

    async deleteTransaction(userId: number, id: string) {
        const { data } = await api.delete(`/transactions/user/${userId}/${id}`);
        return data;
    }
}
