import { useState, useRef, useEffect } from 'react';
import { formatCurrency } from '../utils/format';
import { type Transaction } from '../utils/transactions';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { transactionService } from '../services/transactionService';
import { TransactionModal } from './TransactionModal';
import { ConfirmDialog } from './ui/ConfirmDialog';

export function TransactionItem({ transaction, userId }: { transaction: Transaction, userId: number }) {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await transactionService.deleteTransaction(userId, transaction.id);
            window.dispatchEvent(new Event('transaction-event'));
        } catch (err) {
            console.error('Error deleting transaction:', err);
            alert('No se pudo eliminar el movimiento');
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
        setShowMenu(false);
    };

    const handleSuccess = () => {
        window.dispatchEvent(new Event('transaction-event'));
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light/30 transition-colors group cursor-pointer border border-transparent hover:border-neutral-light/50 relative ${isDeleting ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-neutral-light text-neutral-dark'
                    }`}>
                    {transaction.icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-darker truncate">{transaction.description}</p>
                    <p className="text-xs text-neutral capitalize">{transaction.category}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
                <div className="text-right whitespace-nowrap pl-2">
                    <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-neutral-darker'
                        }`}>
                        {transaction.type === 'INCOME' ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1.5 rounded-lg text-neutral hover:bg-neutral-light/50 hover:text-neutral-dark transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <DotsVerticalIcon className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-neutral-light rounded-xl shadow-strong z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                            <button
                                onClick={handleEdit}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-neutral-light/30 transition-colors"
                            >
                                <EditIcon className="w-4 h-4" />
                                <span>Editar</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteDialogOpen(true);
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <span>Eliminar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <TransactionModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editingTransaction={transaction}
                    onSuccess={handleSuccess}
                />
            )}

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar movimiento"
                description="¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                isLoading={isDeleting}
            />
        </div>
    );
}
