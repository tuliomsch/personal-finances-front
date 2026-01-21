import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { MoneyInput } from './ui/MoneyInput';
import { BankSelect } from './ui/BankSelect';
import { AccountTypeSelect } from './ui/AccountTypeSelect';
import { useUserProfile } from '../hooks/useUserProfile';
import { accountService, type AccountData } from '../services/accountService';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    account?: AccountData | null;
    onSuccess?: () => void;
}

export function AccountModal({ isOpen, onClose, account, onSuccess }: AccountModalProps) {
    const { userProfile } = useUserProfile();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [bankName, setBankName] = useState('');
    const [balance, setBalance] = useState('');
    const [cardDebt, setCardDebt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!account;
    const isCreditCard = type === 'CREDIT_CARD';

    useEffect(() => {
        if (isOpen) {
            if (account) {
                setName(account.name);
                setType(account.type);
                setBankName(account.bankName || '');
                setBalance(String(Math.round(Number(account.balance))));
                setCardDebt(account.type === 'CREDIT_CARD' && account.cardDebt ? String(Math.round(Number(account.cardDebt))) : '');
            } else {
                setName('');
                setType('');
                setBankName('');
                setBalance('');
                setCardDebt('');
            }
            setError(null);
        }
    }, [isOpen, account]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userProfile) return;
        if (!name.trim()) {
            setError('Ingresa un nombre para la cuenta');
            return;
        }
        if (!type) {
            setError('Selecciona un tipo de cuenta');
            return;
        }
        if (!balance || parseFloat(balance) < 0) {
            setError('Ingresa un saldo válido');
            return;
        }
        if (isCreditCard && cardDebt && parseFloat(cardDebt) < 0) {
            setError('Ingresa una deuda válida');
            return;
        }

        setLoading(true);
        try {
            const accountData: any = {
                userId: userProfile.id,
                name: name.trim(),
                type,
                balance: parseInt(balance),
                currencyCode: userProfile.currencyPref,
                bankName: bankName || undefined,
                cardDebt: isCreditCard && cardDebt ? parseInt(cardDebt) : undefined,
            };

            if (isEditMode && account) {
                await accountService.updateAccount(account.id, accountData);
            } else {
                await accountService.createAccount(accountData);
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la cuenta`);
        } finally {
            setLoading(false);
        }
    };

    const showBankField = type && ['CHECKING', 'DEPOSIT', 'SAVINGS', 'CREDIT_CARD'].includes(type);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Editar Cuenta' : 'Nueva Cuenta'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">
                        Nombre de la cuenta
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Cuenta Corriente Principal"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium placeholder:text-neutral-light focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">
                        Tipo de cuenta
                    </label>
                    <AccountTypeSelect
                        value={type}
                        onChange={setType}
                    />
                </div>

                {showBankField && (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-neutral-darker mb-2">
                            Banco
                        </label>
                        <BankSelect
                            value={bankName}
                            onChange={setBankName}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">
                        {isCreditCard ? 'Cupo total' : `Saldo ${isEditMode ? 'actual' : 'inicial'}`}
                    </label>
                    <MoneyInput
                        value={balance}
                        onChange={setBalance}
                        currency={userProfile?.currencyPref || 'CLP'}
                    />
                    {isCreditCard && (
                        <p className="text-xs text-neutral mt-1">El límite de crédito total de tu tarjeta</p>
                    )}
                </div>

                {isCreditCard && (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-neutral-darker mb-2">
                            Deuda actual
                        </label>
                        <MoneyInput
                            value={cardDebt}
                            onChange={setCardDebt}
                            currency={userProfile?.currencyPref || 'CLP'}
                        />
                        <p className="text-xs text-neutral mt-1">Cuánto debes actualmente</p>
                    </div>
                )}

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
                    {loading ? 'Guardando...' : isEditMode ? 'Actualizar Cuenta' : 'Crear Cuenta'}
                </button>
            </form>
        </Modal>
    );
}
