import { formatCurrency } from '../../utils/format';
import { WalletIcon } from '../icons/WalletIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { SavingsIcon } from '../icons/SavingsIcon';
import { BankIcon } from '../icons/BankIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';

export interface DashboardAccount {
    id: number;
    name: string;
    type: string;
    balance: number;
    currencyCode: string;
    bankName?: string;
}

interface AccountsWidgetProps {
    accounts: DashboardAccount[];
    loading: boolean;
}

export function AccountsWidget({ accounts, loading }: AccountsWidgetProps) {

    const getIcon = (type: string) => {
        switch (type) {
            case 'CASH':
                return (
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <WalletIcon className="w-5 h-5" />
                    </div>
                );
            case 'CHECKING':
                return (
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <CreditCardIcon className="w-5 h-5" />
                    </div>
                );
            case 'SAVINGS':
            case 'INVESTMENTS':
                return (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <SavingsIcon className="w-5 h-5" />
                    </div>
                );
            default: // Checked / Banks
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <BankIcon className="w-5 h-5" />
                    </div>
                );
        }
    };

    // Grouping
    const groups = {
        'Efectivo': accounts.filter(a => a.type === 'CASH'),
        'Cuentas Bancarias': accounts.filter(a => ['DEPOSIT', 'CHECKING'].includes(a.type)),
        'Tarjetas': accounts.filter(a => a.type === 'CREDIT_CARD'),
        'Ahorro e Inversión': accounts.filter(a => ['SAVINGS', 'INVESTMENTS'].includes(a.type)),
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-neutral-light/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-neutral-darker">Mis Cuentas</h3>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todas</button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : Object.entries(groups).map(([groupName, groupAccounts]) => (
                    groupAccounts.length > 0 && (
                        <div key={groupName}>
                            <h4 className="text-xs font-semibold text-neutral-dark uppercase tracking-wider mb-3 px-2">
                                {groupName}
                            </h4>
                            <div className="space-y-3">
                                {groupAccounts.map(account => (
                                    <div key={account.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group cursor-pointer border border-transparent hover:border-neutral-light/50">
                                        <div className="flex items-center space-x-4">
                                            {getIcon(account.type)}
                                            <div>
                                                <p className="font-semibold text-neutral-darker">{account.name}</p>
                                                {account.bankName && (
                                                    <p className="text-xs text-neutral">{account.bankName.replace(/_/g, ' ')}</p> // Simple cleanup
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-neutral-darker">
                                                {formatCurrency(account.balance, account.currencyCode)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
