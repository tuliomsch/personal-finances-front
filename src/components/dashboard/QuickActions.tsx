import { useState, useRef, useEffect } from 'react';
import { ShoppingIcon } from '../icons/ShoppingIcon';
import { MoneyIcon } from '../icons/MoneyIcon';
import { TransferIcon } from '../icons/TransferIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { TransactionModal } from '../TransactionModal';

export function QuickActions({ onTransactionCreated }: { onTransactionCreated?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleActionClick = (type: 'EXPENSE' | 'INCOME' | 'TRANSFER') => {
        setModalType(type);
        setModalOpen(true);
        setIsOpen(false);
    };

    const actions = [
        {
            label: 'Gasto',
            icon: <ShoppingIcon className="w-5 h-5" />,
            color: 'bg-error hover:bg-error-dark',
            onClick: () => handleActionClick('EXPENSE')
        },
        {
            label: 'Ingreso',
            icon: <MoneyIcon className="w-5 h-5" />,
            color: 'bg-success hover:bg-success-dark',
            onClick: () => handleActionClick('INCOME')
        },
        {
            label: 'Transferencia entre cuentas',
            icon: <TransferIcon className="w-5 h-5" />,
            color: 'bg-primary hover:bg-primary-dark',
            onClick: () => handleActionClick('TRANSFER')
        },
    ];

    return (
        <>
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4" ref={containerRef}>
                {/* Actions Menu */}
                {isOpen && (
                    <div className="flex flex-col items-end space-y-3 mb-2">
                        {actions.map((action, index) => (
                            <div
                                key={action.label}
                                className="flex items-center space-x-3 group animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="bg-white px-2 py-1 rounded-md shadow-sm text-sm font-medium text-neutral-dark opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {action.label}
                                </span>
                                <button
                                    onClick={action.onClick}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 ${action.color}`}
                                >
                                    {action.icon}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAB Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-strong transition-all duration-300 hover:scale-105 z-50 ${isOpen ? 'bg-neutral-dark rotate-45' : 'bg-primary'
                        }`}
                >
                    <PlusIcon className="w-7 h-7" />
                </button>

                {/* Backdrop for mobile focus */}
                {isOpen && (
                    <div className="fixed inset-0 bg-neutral-dark/20 backdrop-blur-[1px] -z-10 animate-fade-in" />
                )}
            </div>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialType={modalType}
                onSuccess={onTransactionCreated}
            />
        </>
    );
}
