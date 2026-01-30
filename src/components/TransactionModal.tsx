import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { MoneyInput } from './ui/MoneyInput';
import { AccountSelect } from './ui/AccountSelect';
import { CategorySelect } from './ui/CategorySelect';
import { useUserProfile } from './../hooks/useUserProfile';
import { transactionService } from '../services/transactionService';
import { type Transaction } from '../utils/transactions';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: 'EXPENSE' | 'INCOME' | 'TRANSFER';
    onSuccess?: () => void;
    editingTransaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, initialType = 'EXPENSE', onSuccess, editingTransaction }: TransactionModalProps) {
    const { userProfile } = useUserProfile();
    const [type, setType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>(initialType);
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState<number | undefined>(undefined);
    const [transferToId, setTransferToId] = useState<number | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (editingTransaction) {
                setType(editingTransaction.type);
                setAmount(editingTransaction.amount.toString());
                setAccountId(editingTransaction.accountId);
                setCategoryId(editingTransaction.categoryId);
                setTransferToId(editingTransaction.transferToId);
                setDate(new Date(editingTransaction.transactionDate).toISOString().split('T')[0]);
                setDescription(editingTransaction.description || '');
            } else {
                setType(initialType);
                setAmount('');
                setDescription('');
                setAccountId(undefined);
                setCategoryId(undefined);
                setTransferToId(undefined);
            }
            setError(null);
        }
    }, [isOpen, initialType, editingTransaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userProfile) return;
        if (!amount || parseFloat(amount) <= 0) {
            setError('Ingresa un monto válido');
            return;
        }
        if (!accountId) {
            setError('Selecciona una cuenta de origen');
            return;
        }
        if (type === 'TRANSFER') {
            if (!transferToId) {
                setError('Selecciona una cuenta de destino');
                return;
            }
            if (accountId === transferToId) {
                setError('La cuenta de destino debe ser distinta al origen');
                return;
            }
        } else {
            if (!categoryId) {
                setError('Selecciona una categoría');
                return;
            }
        }

        setLoading(true);
        try {
            const transactionData = {
                userId: userProfile.id,
                accountId,
                categoryId: type === 'TRANSFER' ? undefined : categoryId,
                type,
                amount: parseInt(amount), // MoneyInput returns string digits
                transactionDate: new Date(date).toISOString(),
                rawDescription: description,
                transferToId: type === 'TRANSFER' ? transferToId : undefined
            };

            if (editingTransaction) {
                await transactionService.updateTransaction(editingTransaction.id, transactionData);
            } else {
                await transactionService.createTransaction(transactionData);
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al guardar la transacción');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (editingTransaction) return 'Editar Transacción';
        switch (type) {
            case 'EXPENSE': return 'Nuevo Gasto';
            case 'INCOME': return 'Nuevo Ingreso';
            case 'TRANSFER': return 'Nueva Transferencia';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selector (Optional override) */}
                <div className="flex p-1 bg-neutral-light/30 rounded-xl">
                    {(['EXPENSE', 'INCOME', 'TRANSFER'] as const).map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === t
                                ? 'bg-white text-neutral-darker shadow-sm'
                                : 'text-neutral hover:text-neutral-dark'
                            }`}
                        >
                            {t === 'EXPENSE' ? 'Gasto' : t === 'INCOME' ? 'Ingreso' : 'Transferencia'}
                        </button>
                    ))}
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">Monto</label>
                    <MoneyInput
                        value={amount}
                        onChange={setAmount}
                        currency={userProfile?.currencyPref || 'CLP'}
                        autoFocus
                    />
                </div>

                {/* Accounts */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-darker mb-2">
                            {type === 'TRANSFER' ? 'Desde' : 'Cuenta'}
                        </label>
                        <AccountSelect
                            value={accountId}
                            onChange={setAccountId}
                        />
                    </div>

                    {type === 'TRANSFER' && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-neutral-darker mb-2">Hacia</label>
                            <AccountSelect
                                value={transferToId}
                                onChange={setTransferToId}
                                excludeId={accountId}
                            />
                        </div>
                    )}
                </div>

                {/* Category (Hide for Transfer) */}
                {type !== 'TRANSFER' && (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-neutral-darker mb-2">Categoría</label>
                        <CategorySelect
                            value={categoryId}
                            onChange={setCategoryId}
                            type={type}
                        />
                    </div>
                )}

                {/* Date & Description */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-darker mb-2">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-darker mb-2">Descripción</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Opcional"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium placeholder:text-neutral-light focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-error/10 text-error text-sm rounded-lg text-center animate-shake">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'bg-neutral cursor-wait' : 'bg-primary hover:bg-primary-dark'
                        }`}
                >
                    {loading ? 'Guardando...' : 'Guardar Transacción'}
                </button>
            </form>
        </Modal>
    );
}
