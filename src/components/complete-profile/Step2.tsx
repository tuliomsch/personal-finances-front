// src/components/complete-profile/Step2.tsx
import React, { useState } from 'react';
import { MoneyInput } from '../ui/MoneyInput';
import { BankSelect, BANKS } from '../ui/BankSelect';
import { WalletIcon } from '../icons/WalletIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { SavingsIcon } from '../icons/SavingsIcon';
import { BankIcon } from '../icons/BankIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { CloseIcon } from '../icons/CloseIcon';

export type AccountType = 'Efectivo' | 'Cuenta Vista/Rut' | 'Cuenta Corriente' | 'Tarjeta de Crédito' | 'Cuenta de Ahorro';

export interface AccountData {
    type: string;
    name: string;
    balance: string;
    bankName?: string;
    cardDebt?: string;
}

interface Step2Props {
    accounts: AccountData[];
    setAccounts: React.Dispatch<React.SetStateAction<AccountData[]>>;
    currency: string;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleBack: () => void;
    loading: boolean;
    error: string | null;
}

const getAccountIcon = (type: string) => {
    switch (type) {
        case 'Efectivo':
            return <WalletIcon className="w-6 h-6" />;
        case 'Tarjeta de Crédito':
            return <CreditCardIcon className="w-6 h-6" />;
        case 'Cuenta de Ahorro':
            return <SavingsIcon className="w-6 h-6" />;
        default: // 'Cuenta Vista/Rut', 'Cuenta Corriente', others
            return <BankIcon className="w-6 h-6" />;
    }
};

const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
        CLP: '$',
        USD: 'US$',
        EUR: '€',
    };
    return symbols[currency] || '$';
};

const getBankLabel = (value?: string) => {
    if (!value) return '';
    const bank = BANKS.find(b => b.value === value);
    return bank ? bank.label : value;
};

export function Step2({ accounts, setAccounts, currency, handleSubmit, handleBack, loading, error }: Step2Props) {
    const [isUniqueModalOpen, setIsUniqueModalOpen] = useState(false);

    const [newAccountType, setNewAccountType] = useState<AccountType>('Cuenta Corriente');
    const [newAccountBalance, setNewAccountBalance] = useState('');
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountBankName, setNewAccountBankName] = useState('');
    const [newAccountCardDebt, setNewAccountCardDebt] = useState('');

    const currencySymbol = getCurrencySymbol(currency);

    const handleUpdateBalance = (index: number, val: string) => {
        const updated = [...accounts];
        updated[index].balance = val;
        setAccounts(updated);
    };

    const handleUpdateCardDebt = (index: number, val: string) => {
        const updated = [...accounts];
        updated[index].cardDebt = val;
        setAccounts(updated);
    };

    const handleRemoveAccount = (index: number) => {
        if (accounts.length <= 1) {
            alert("Debes mantener al menos una cuenta.");
            return;
        }
        const updated = accounts.filter((_, i) => i !== index);
        setAccounts(updated);
    };

    const handleAddAccount = () => {
        if (!newAccountBalance) return;

        // Default name if empty
        const name = newAccountName.trim() || newAccountType;

        const newAccount: AccountData = {
            type: newAccountType,
            name: name,
            balance: newAccountBalance,
        };

        if (newAccountType !== 'Efectivo' && newAccountBankName.trim()) {
            newAccount.bankName = newAccountBankName.trim();
        }

        if (newAccountType === 'Tarjeta de Crédito' && newAccountCardDebt) {
            newAccount.cardDebt = newAccountCardDebt;
        }

        setAccounts([
            ...accounts,
            newAccount
        ]);

        // Reset and close
        setNewAccountBalance('');
        setNewAccountName('');
        setNewAccountBankName('');
        setNewAccountCardDebt('');
        setNewAccountType('Cuenta Corriente');
        setIsUniqueModalOpen(false);
    };

    const accountTypes: AccountType[] = [
        'Efectivo',
        'Cuenta Vista/Rut',
        'Cuenta Corriente',
        'Tarjeta de Crédito',
        'Cuenta de Ahorro'
    ];

    const totalBalance = accounts.reduce((sum, acc) => {
        const balance = parseFloat(acc.balance) || 0;
        if (acc.type === 'Tarjeta de Crédito') {
            const debt = parseFloat(acc.cardDebt || '0') || 0;
            return sum - debt;
        }
        return sum + balance;
    }, 0);

    return (
        <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-medium">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                    <div className="w-16 h-1 bg-primary rounded-full">
                        <div className="w-full h-full bg-primary rounded-full"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-medium">
                        2
                    </div>
                </div>
                <p className="text-center text-sm text-neutral font-medium">Paso 2 de 2</p>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-darker mb-2">
                    Configura tus Cuentas
                </h2>
                <p className="text-neutral text-lg mb-4">
                    Agrega tus cuentas y saldos iniciales.
                </p>

                {/* Total Balance Card */}
                <div className="inline-block p-6 bg-linear-to-br from-primary via-primary to-primary-dark rounded-2xl shadow-strong text-white min-w-[280px] transform hover:scale-105 transition-transform duration-300">
                    <p className="text-white/80 text-sm font-medium mb-1">Patrimonio Inicial</p>
                    <p className="text-4xl font-bold tracking-tight">
                        {currencySymbol} {new Intl.NumberFormat('es-CL').format(totalBalance)}
                    </p>
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Accounts List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {accounts.map((account, index) => (
                        <div key={index} className="flex items-center p-4 bg-white border border-neutral-light rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-colors ${account.type === 'Efectivo' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                                account.type === 'Tarjeta de Crédito' ? 'bg-red-100 text-red-600 group-hover:bg-red-200' :
                                    'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                                }`}>
                                {getAccountIcon(account.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="truncate pr-2">
                                        <h3 className="font-semibold text-neutral-darker text-lg">{account.name}</h3>
                                        {account.bankName && (
                                            <p className="text-xs font-medium text-neutral-dark bg-neutral-light/50 inline-block px-2 py-0.5 rounded-md mt-0.5">
                                                {getBankLabel(account.bankName)}
                                            </p>
                                        )}
                                    </div>
                                    {account.name === 'Billetera' && index === 0 ? (
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">Principal</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAccount(index)}
                                            className="w-8 h-8 flex items-center justify-center text-neutral-dark hover:text-error bg-neutral-light/40 hover:bg-error/10 rounded-lg transition-all shadow-sm"
                                            title="Eliminar cuenta"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                {account.type === 'Tarjeta de Crédito' ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-dark mb-1">Cupo total</label>
                                            <MoneyInput
                                                value={account.balance}
                                                onChange={(val) => handleUpdateBalance(index, val)}
                                                currency={currency}
                                                placeholder="0"
                                                className="border-transparent bg-neutral-light/20 focus:bg-white hover:bg-neutral-light/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-dark mb-1">Deuda actual</label>
                                            <MoneyInput
                                                value={account.cardDebt || ''}
                                                onChange={(val) => handleUpdateCardDebt(index, val)}
                                                currency={currency}
                                                placeholder="0"
                                                className="border-transparent bg-neutral-light/20 focus:bg-white hover:bg-neutral-light/40"
                                            />
                                        </div>
                                        {(() => {
                                            const debt = parseFloat(account.cardDebt || '0') || 0;
                                            const limit = parseFloat(account.balance) || 0;
                                            const usagePercent = limit > 0 ? (debt / limit) * 100 : 0;
                                            return (
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-neutral">Utilización</span>
                                                        <span className={`font-semibold ${usagePercent > 80 ? 'text-error' :
                                                                usagePercent > 50 ? 'text-warning' :
                                                                    'text-success'
                                                            }`}>
                                                            {usagePercent.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-neutral-light/50 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-error' :
                                                                    usagePercent > 50 ? 'bg-warning' :
                                                                        'bg-success'
                                                                }`}
                                                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <MoneyInput
                                            value={account.balance}
                                            onChange={(val) => handleUpdateBalance(index, val)}
                                            currency={currency}
                                            placeholder="0"
                                            className="border-transparent bg-neutral-light/20 focus:bg-white hover:bg-neutral-light/40"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Account Button (Trigger Modal) */}
                    <button
                        type="button"
                        onClick={() => setIsUniqueModalOpen(true)}
                        className="w-full py-4 border-2 border-dashed border-neutral-light rounded-2xl flex items-center justify-center text-neutral font-semibold hover:border-primary hover:text-primary hover:bg-primary-light/5 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-neutral-light text-white flex items-center justify-center mr-3 group-hover:bg-primary transition-colors shadow-sm">
                            <PlusIcon className="w-5 h-5" />
                        </div>
                        <span className="text-lg">Agregar otra cuenta</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-error/10 border-2 border-error/20 rounded-xl animate-slide-up">
                        <p className="text-sm text-center text-error flex items-center justify-center font-medium">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2 shrink-0" />
                            {error}
                        </p>
                    </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex justify-between space-x-4 pt-4 border-t border-neutral-light/50">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="px-6 py-4 text-base font-semibold text-neutral-darker bg-neutral-light rounded-xl hover:bg-neutral-light/80 transition-all duration-300 shadow-soft disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={loading || accounts.length === 0}
                        className="flex-1 px-6 py-4 text-base font-semibold text-white bg-linear-to-r from-primary via-primary-dark to-primary-darker rounded-xl shadow-medium hover:shadow-strong focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-strong transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Guardando...' : 'Finalizar Configuración'}
                    </button>
                </div>
            </form>

            {/* Add Account Modal */}
            {isUniqueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-neutral-darker/60 backdrop-blur-sm animate-fade-in">
                    <div
                        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-neutral-light/30 px-6 py-4 border-b border-neutral-light flex justify-between items-center">
                            <h3 className="text-xl font-bold text-neutral-darker">Nueva Cuenta</h3>
                            <button
                                onClick={() => setIsUniqueModalOpen(false)}
                                className="text-neutral hover:text-neutral-darker transition-colors"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-dark mb-2">Tipo de Cuenta</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {accountTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewAccountType(type)}
                                            className={`px-4 py-3 text-sm font-medium rounded-xl border text-left transition-all ${newAccountType === type
                                                ? 'border-primary bg-primary text-white shadow-medium transform scale-105'
                                                : 'border-neutral-light bg-white text-neutral-darker hover:border-primary/50 hover:bg-neutral-light/20'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-dark mb-1">Nombre (Opcional)</label>
                                    <input
                                        type="text"
                                        value={newAccountName}
                                        onChange={(e) => setNewAccountName(e.target.value)}
                                        placeholder={newAccountType}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-light focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-neutral-light"
                                    />
                                </div>

                                {newAccountType !== 'Efectivo' && (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">Institución Bancaria</label>
                                        <BankSelect
                                            value={newAccountBankName}
                                            onChange={setNewAccountBankName}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                                        {newAccountType === 'Tarjeta de Crédito' ? 'Cupo total' : 'Saldo Inicial'}
                                    </label>
                                    <MoneyInput
                                        value={newAccountBalance}
                                        onChange={setNewAccountBalance}
                                        currency={currency}
                                        autoFocus
                                        placeholder="Ej: 500000"
                                    />
                                    {newAccountType === 'Tarjeta de Crédito' && (
                                        <p className="text-xs text-neutral mt-1">El límite de crédito total de tu tarjeta</p>
                                    )}
                                </div>

                                {newAccountType === 'Tarjeta de Crédito' && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">Deuda actual</label>
                                        <MoneyInput
                                            value={newAccountCardDebt}
                                            onChange={setNewAccountCardDebt}
                                            currency={currency}
                                            placeholder="Ej: 100000"
                                        />
                                        <p className="text-xs text-neutral mt-1">Cuánto debes actualmente</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-4 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsUniqueModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 text-neutral-dark font-medium bg-neutral-light/50 border border-transparent rounded-xl hover:bg-neutral-light transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddAccount}
                                    disabled={!newAccountBalance || (newAccountType !== 'Efectivo' && !newAccountBankName)}
                                    className="flex-1 px-6 py-3.5 text-white font-bold bg-primary rounded-xl shadow-medium hover:bg-primary-dark hover:shadow-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] active:translate-y-0"
                                >
                                    Agregar Cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
