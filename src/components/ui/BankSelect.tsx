import { useState, useRef, useEffect } from 'react';
import { ChevronIcon } from '../icons/ChevronIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface BankOption {
    value: string;
    label: string;
}

export const BANKS: BankOption[] = [
    { value: 'BANCO_DE_CHILE', label: 'Banco de Chile' },
    { value: 'BANCO_SANTANDER', label: 'Banco Santander' },
    { value: 'BANCO_ESTADO', label: 'Banco Estado' },
    { value: 'SCOTIABANK', label: 'Scotiabank' },
    { value: 'BCI', label: 'BCI' },
    { value: 'ITAU', label: 'Itaú' },
    { value: 'BANCO_FALABELLA', label: 'Banco Falabella' },
    { value: 'BANCO_RIPLEY', label: 'Banco Ripley' },
    { value: 'BANCO_CONSORCIO', label: 'Banco Consorcio' },
    { value: 'BANCO_SECURITY', label: 'Banco Security' },
    { value: 'BANCO_BICE', label: 'Banco Bice' },
    { value: 'BANCO_INTERNACIONAL', label: 'Banco Internacional' },
    { value: 'COOPEUCH', label: 'Coopeuch' },
    { value: 'TENPO', label: 'Tenpo' },
    { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
    { value: 'OTRO', label: 'Otro' }
];

interface BankSelectProps {
    value?: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export function BankSelect({ value, onChange, error }: BankSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedBank = BANKS.find(b => b.value === value);

    // Filter banks based on search
    const filteredBanks = BANKS.filter(bank =>
        bank.label.toLowerCase().includes(search.toLowerCase())
    );

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

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        setSearch('');
    };

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
                <span className={`block truncate ${!selectedBank ? 'text-neutral' : 'text-neutral-darker font-medium'}`}>
                    {selectedBank ? selectedBank.label : 'Selecciona un banco'}
                </span>
                <ChevronIcon
                    className={`w-5 h-5 text-neutral transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-neutral-light overflow-hidden animate-fade-in origin-top">
                    <div className="p-2 border-b border-neutral-light/50">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
                            <input
                                type="text"
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar banco..."
                                className="w-full pl-9 pr-3 py-2 bg-neutral-light/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 text-neutral-darker placeholder:text-neutral"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredBanks.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-neutral text-center">
                                No se encontraron bancos
                            </div>
                        ) : (
                            filteredBanks.map(bank => (
                                <button
                                    key={bank.value}
                                    type="button"
                                    onClick={() => handleSelect(bank.value)}
                                    className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${value === bank.value
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-neutral-darker hover:bg-neutral-light/50'
                                        }`}
                                >
                                    {bank.label}
                                    {value === bank.value && (
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
