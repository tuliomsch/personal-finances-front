import { useState, useEffect, useRef } from 'react';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { accountService, type AccountData } from '../../services/accountService';
import { useUserProfile } from '../../hooks/useUserProfile';

interface AccountSelectProps {
    value?: number;
    onChange: (value: number) => void;
    error?: boolean;
    label?: string;
    excludeId?: number;
}

export function AccountSelect({ value, onChange, error, label = "Selecciona una cuenta", excludeId }: AccountSelectProps) {
    const { userProfile } = useUserProfile();
    const [accounts, setAccounts] = useState<AccountData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (userProfile?.id) {
            setLoading(true);
            accountService.getAccounts(userProfile.id)
                .then(data => setAccounts(data.accounts))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [userProfile]);

    const filteredAccounts = excludeId
        ? accounts.filter(a => a.id !== excludeId)
        : accounts;

    const selectedAccount = accounts.find(a => a.id === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: number) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 text-left bg-white border rounded-xl flex items-center justify-between transition-all ${error
                    ? 'border-error ring-1 ring-error/50'
                    : isOpen
                        ? 'border-primary ring-4 ring-primary/10'
                        : 'border-neutral-light hover:border-primary/50'
                    } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                disabled={loading}
            >
                <div className="flex flex-col items-start overflow-hidden">
                    {selectedAccount ? (
                        <>
                            <span className="text-neutral-darker font-medium truncate w-full">{selectedAccount.name}</span>
                            <span className="text-xs text-neutral truncate w-full">
                                {selectedAccount.bankName?.replace(/_/g, ' ') || 'EFECTIVO'} • ${Number(selectedAccount.balance).toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-neutral">{loading ? 'Cargando cuentas...' : label}</span>
                    )}
                </div>
                <ChevronIcon
                    className={`w-5 h-5 text-neutral transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-neutral-light overflow-hidden animate-fade-in origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredAccounts.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-neutral text-center">
                                No hay cuentas disponibles
                            </div>
                        ) : (
                            filteredAccounts.map(account => (
                                <button
                                    key={account.id}
                                    type="button"
                                    onClick={() => handleSelect(account.id)}
                                    className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${value === account.id
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-neutral-darker hover:bg-neutral-light/50'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span>{account.name}</span>
                                        <span className="text-xs opacity-70">
                                            {account.bankName?.replace(/_/g, ' ') || account.type} • ${Number(account.balance).toLocaleString()}
                                        </span>
                                    </div>
                                    {value === account.id && (
                                        <CheckIcon className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
