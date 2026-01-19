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

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {

    const formatDate = (dateStr: string) => {

        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' }).format(date);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-neutral-light/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-neutral-darker">Actividad Reciente</h3>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todo</button>
            </div>

            <div className="p-4 space-y-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-neutral">
                        <p>No hay movimientos recientes</p>
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group cursor-pointer border border-transparent hover:border-neutral-light/50">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-neutral-light text-neutral-dark'
                                    }`}>
                                    {tx.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-darker line-clamp-1">{tx.description}</p>
                                    <p className="text-xs text-neutral">{formatDate(tx.transactionDate)} • {tx.category}</p>
                                </div>
                            </div>
                            <div className="text-right whitespace-nowrap pl-2">
                                <p className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-neutral-darker'
                                    }`}>
                                    {tx.type === 'INCOME' ? '+' : ''}{formatCurrency(tx.amount)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
