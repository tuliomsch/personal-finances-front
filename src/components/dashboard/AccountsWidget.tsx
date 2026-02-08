import { useState } from 'react';
import { formatCurrency } from '../../utils/format';
import { WalletIcon } from '../icons/WalletIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { SavingsIcon } from '../icons/SavingsIcon';
import { BankIcon } from '../icons/BankIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { AccountModal } from '../AccountModal';
import { accountService } from '../../services/accountService';

import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface DashboardAccount {
    id: number;
    name: string;
    type: string;
    balance: number;
    currencyCode: string;
    bankName?: string;
    cardDebt?: number;
}

interface AccountsWidgetProps {
    accounts: DashboardAccount[];
    loading: boolean;
    onRefresh?: () => void;
}

export function AccountsWidget({ accounts, loading, onRefresh }: AccountsWidgetProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<DashboardAccount | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleAddAccount = () => {
        setSelectedAccount(null);
        setModalOpen(true);
    };

    const handleEditAccount = (account: DashboardAccount) => {
        setSelectedAccount(account);
        setModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        if (!deleteConfirmId) return;
        setDeleting(true);
        try {
            await accountService.deleteAccount(deleteConfirmId);
            setDeleteConfirmId(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error al eliminar la cuenta');
        } finally {
            setDeleting(false);
        }
    };

    const handleModalSuccess = () => {
        if (onRefresh) onRefresh();
    };

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
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden flex flex-col pb-6">
                <div className="p-6 border-b border-neutral-light/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-neutral-darker">Mis Cuentas</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddAccount}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Agregar
                        </button>
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isEditMode
                                ? 'text-white bg-neutral-dark hover:bg-neutral-darker'
                                : 'text-primary hover:text-primary-dark hover:bg-primary/10'
                                }`}
                        >
                            {isEditMode ? 'Listo' : 'Administrar'}
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto min-h-fit custom-scrollbar">
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
                                    {groupAccounts.map(account => {
                                        const isCreditCard = account.type === 'CREDIT_CARD';
                                        const creditLimit = isCreditCard ? Number(account.balance) : 0;
                                        const creditDebt = isCreditCard && account.cardDebt ? Number(account.cardDebt) : 0;
                                        const creditAvailable = creditLimit - creditDebt;
                                        const creditUsagePercent = isCreditCard && creditLimit > 0
                                            ? (creditDebt / creditLimit) * 100
                                            : 0;

                                        return (
                                            <div key={account.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group border border-transparent hover:border-neutral-light/50">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    {getIcon(account.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-neutral-darker">{account.name}</p>
                                                        {account.bankName && (
                                                            <p className="text-xs text-neutral">{account.bankName.replace(/_/g, ' ')}</p>
                                                        )}
                                                        {isCreditCard && (
                                                            <div className="mt-2 space-y-1">
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <span className="text-neutral">
                                                                        Usado: <span className="font-semibold text-error">{formatCurrency(creditDebt, account.currencyCode)}</span>
                                                                    </span>
                                                                    <span className="text-neutral-light">•</span>
                                                                    <span className="text-neutral">
                                                                        Disponible: <span className="font-semibold text-success">{formatCurrency(creditAvailable, account.currencyCode)}</span>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-neutral-light/50 rounded-full h-1.5 overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${creditUsagePercent > 80 ? 'bg-error' :
                                                                            creditUsagePercent > 50 ? 'bg-warning' :
                                                                                'bg-success'
                                                                            }`}
                                                                        style={{ width: `${Math.min(creditUsagePercent, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {!isCreditCard && (
                                                        <div className="text-right">
                                                            <p className="font-bold text-neutral-darker">
                                                                {formatCurrency(account.balance, account.currencyCode)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {isEditMode && (
                                                        <div className="flex gap-2 animate-fade-in">
                                                            <button
                                                                onClick={() => handleEditAccount(account)}
                                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                                title="Editar cuenta"
                                                            >
                                                                <EditIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(account.id)}
                                                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                                title="Eliminar cuenta"
                                                                disabled={accounts.length === 1}
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            <AccountModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                account={selectedAccount}
                onSuccess={handleModalSuccess}
            />

            <ConfirmDialog
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleDeleteAccount}
                title="¿Eliminar cuenta?"
                description="Esta acción no se puede deshacer. Se eliminará la cuenta pero se mantendrán sus transacciones."
                confirmLabel="Eliminar"
                isLoading={deleting}
            />
        </>
    );
}
