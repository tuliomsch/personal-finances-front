import { api } from "../lib/api";

export interface TransactionData {
    id: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: 'INCOME' | 'EXPENSE';
    category: CategoryData;
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
    async getTransactions(userId: number) {
        const { data } = await api.get<TransactionsDataWithTotal>(`/transactions/user/${userId}`);
        return data;
    },

    async createTransaction(transactionData: CreateTransactionData) {
        const { data } = await api.post('/transactions', transactionData);
        return data;
    }
}
