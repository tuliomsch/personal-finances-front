import { formatCurrency } from '../utils/format';
import { type Transaction } from '../utils/transactions';

export function TransactionItem({ transaction }: { transaction: Transaction }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group cursor-pointer border border-transparent hover:border-neutral-light/50">
            <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-neutral-light text-neutral-dark'
                    }`}>
                    {transaction.icon}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-neutral-darker line-clamp-1">{transaction.description}</p>
                    <p className="text-xs text-neutral capitalize">{transaction.category}</p>
                </div>
            </div>
            <div className="text-right whitespace-nowrap pl-2">
                <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-neutral-darker'
                    }`}>
                    {transaction.type === 'INCOME' ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
            </div>
        </div>
    );
}