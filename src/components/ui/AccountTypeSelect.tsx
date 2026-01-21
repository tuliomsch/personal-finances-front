import { useState, useEffect, useRef } from 'react';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface AccountTypeOption {
    value: string;
    label: string;
    group: string;
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
    { value: 'CASH', label: 'Efectivo', group: 'Efectivo' },
    { value: 'CHECKING', label: 'Cuenta Corriente', group: 'Cuentas Bancarias' },
    { value: 'DEPOSIT', label: 'Cuenta Vista', group: 'Cuentas Bancarias' },
    { value: 'SAVINGS', label: 'Cuenta de Ahorro', group: 'Ahorro e Inversión' },
    { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito', group: 'Tarjetas' },
];

interface AccountTypeSelectProps {
    value?: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export function AccountTypeSelect({ value, onChange, error }: AccountTypeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedType = ACCOUNT_TYPES.find(t => t.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    // Group types by category
    const groupedTypes = ACCOUNT_TYPES.reduce((acc, type) => {
        if (!acc[type.group]) acc[type.group] = [];
        acc[type.group].push(type);
        return acc;
    }, {} as Record<string, AccountTypeOption[]>);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 text-left bg-white border rounded-xl flex items-center justify-between transition-all ${error
                    ? 'border-error ring-1 ring-error/50'
                    : isOpen
                        ? 'border-primary ring-4 ring-primary/10'
                        : 'border-neutral-light hover:border-primary/50'
                    }`}
            >
                <span className={`block truncate ${!selectedType ? 'text-neutral' : 'text-neutral-darker font-medium'}`}>
                    {selectedType ? selectedType.label : 'Selecciona un tipo de cuenta'}
                </span>
                <ChevronIcon
                    className={`w-5 h-5 text-neutral transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-neutral-light overflow-hidden animate-fade-in origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {Object.entries(groupedTypes).map(([group, types]) => (
                            <div key={group}>
                                <div className="px-3 py-2 text-xs font-semibold text-neutral uppercase tracking-wide">
                                    {group}
                                </div>
                                {types.map(type => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleSelect(type.value)}
                                        className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${value === type.value
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-neutral-darker hover:bg-neutral-light/50'
                                            }`}
                                    >
                                        <span>{type.label}</span>
                                        {value === type.value && (
                                            <CheckIcon className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
