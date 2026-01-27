export interface Transaction {
    id: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    category: string;
    icon: string;
}

export interface GroupedTransactions {
    label: string;
    transactions: Transaction[];
}

export const groupTransactionsByDate = (txs: Transaction[]): GroupedTransactions[] => {
    const groups: { [key: string]: Transaction[] } = {};
    txs.forEach(tx => {
        const label = getDateLabel(tx.transactionDate);
        if (!groups[label]) {
            groups[label] = [];
        }
        groups[label].push(tx);
    });

    return Object.entries(groups).map(([label, transactions]) => ({
        label,
        transactions
    }));
};

const getDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hoy';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Ayer';
    } else {
        const formatted = new Intl.DateTimeFormat('es-CL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            timeZone: 'UTC'
        }).format(date);

        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
};