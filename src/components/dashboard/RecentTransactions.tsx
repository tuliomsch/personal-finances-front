// import { formatCurrency } from '../../utils/format';
import { groupTransactionsByDate, type Transaction } from '../../utils/transactions';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { TransactionItem } from '../TransactionItem';
import { useNavigate } from 'react-router-dom';

interface RecentTransactionsProps {
    transactions: Transaction[];
    userId: number;
    loading: boolean;
}

export function RecentTransactions({ transactions, userId, loading }: RecentTransactionsProps) {

    const navigate = useNavigate();
    const groupedTransactions = groupTransactionsByDate(transactions);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-neutral-light/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-neutral-darker">Actividad Reciente</h3>
                <button onClick={() => navigate('/transactions')} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todo</button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[525px] custom-scrollbar">
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
                                <h4 className="text-sm font-bold text-neutral-dark">{group.label}</h4>
                            </div>

                            {group.transactions.map((tx) => (
                                <TransactionItem key={tx.id} transaction={tx} userId={userId} />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
