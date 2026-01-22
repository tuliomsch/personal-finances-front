import { formatCurrency } from '../../utils/format';
import { SpinnerIcon } from '../icons/SpinnerIcon';

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    icon: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
    loading: boolean;
}

interface GroupedTransactions {
    label: string;
    transactions: Transaction[];
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {

    const getDateLabel = (dateStr: string): string => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return 'Hoy';
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return 'Ayer';
        } else {
            return new Intl.DateTimeFormat('es-CL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            }).format(date);
        }
    };

    const groupTransactionsByDate = (txs: Transaction[]): GroupedTransactions[] => {
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

    const groupedTransactions = groupTransactionsByDate(transactions);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-neutral-light/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-neutral-darker">Actividad Reciente</h3>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todo</button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-neutral">
                        <p>No hay movimientos recientes</p>
                    </div>
                ) : (
                    groupedTransactions.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                            <div className="sticky top-0 bg-white z-10 py-2">
                                <h4 className="text-sm font-bold text-neutral-dark capitalize">{group.label}</h4>
                            </div>

                            {group.transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group cursor-pointer border border-transparent hover:border-neutral-light/50">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-neutral-light text-neutral-dark'
                                            }`}>
                                            {tx.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-neutral-darker line-clamp-1">{tx.description}</p>
                                            <p className="text-xs text-neutral capitalize">{tx.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right whitespace-nowrap pl-2">
                                        <p className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-neutral-darker'
                                            }`}>
                                            {tx.type === 'INCOME' ? '+' : ''}{formatCurrency(tx.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
