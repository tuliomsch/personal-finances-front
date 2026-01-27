import { useState, useEffect } from 'react';
import { DateFilterDropdown } from '../components/dashboard/DateFilterDropdown';
import { TransactionItem } from '../components/TransactionItem';
import { groupTransactionsByDate, type Transaction } from '../utils/transactions';
import { transactionService } from '../services/transactionService';
import { useUserProfile } from '../hooks/useUserProfile';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { formatCurrency } from '../utils/format';

export function TransactionsView() {
    const { userProfile } = useUserProfile();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const [startDate, setStartDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    const refreshData = async () => {
        if (userProfile?.id) {
            setLoading(true);
            try {
                const startStr = startDate.toISOString().split('T')[0];
                const endStr = endDate.toISOString().split('T')[0];

                const data = await transactionService.getTransactions(userProfile.id, startStr, endStr);

                const mappedTransactions: Transaction[] = data.transactions.map((tx) => ({
                    id: tx.id,
                    description: tx.description,
                    amount: tx.amount,
                    transactionDate: tx.transactionDate,
                    type: tx.type,
                    category: tx.category?.name || 'Transferencia',
                    icon: tx.category?.icon || '💸',
                }));

                setTransactions(mappedTransactions);
                setTotalIncome(data.totalIncome);
                setTotalExpense(data.totalExpense);
            } catch (error) {
                console.error('Error loading transactions:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        refreshData();

        const handleTransactionCreated = () => {
            refreshData();
        };

        window.addEventListener('transaction-created', handleTransactionCreated);

        return () => {
            window.removeEventListener('transaction-created', handleTransactionCreated);
        };
    }, [userProfile, startDate, endDate]);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const groupedTransactions = groupTransactionsByDate(filteredTransactions);

    const visibleTotal = filteredTransactions.reduce((sum, tx) => {
        return tx.type === 'INCOME' ? sum + Number(tx.amount) : tx.type === 'EXPENSE' ? sum - Number(tx.amount) : sum;
    }, 0);

    return (
        <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8 animate-fade-in relative">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-darker">Movimientos</h1>
                        <p className="text-neutral">Historial detallado de tus transacciones</p>
                    </div>

                    <DateFilterDropdown
                        onDateRangeChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    />
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-light grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                    <div className="md:col-span-5 relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
                        <input
                            type="text"
                            placeholder="Buscar movimiento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-light/30 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-neutral-darker placeholder-neutral/70"
                        />
                    </div>

                    <div className="md:col-span-7 flex flex-wrap gap-2 justify-end">
                        <button
                            onClick={() => setTypeFilter('ALL')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${typeFilter === 'ALL'
                                ? 'bg-neutral-darker text-white shadow-md'
                                : 'bg-neutral-light/30 text-neutral hover:bg-neutral-light hover:text-neutral-darker'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setTypeFilter('INCOME')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${typeFilter === 'INCOME'
                                ? 'bg-success/10 text-success-dark border border-success/20 shadow-sm'
                                : 'bg-neutral-light/30 text-neutral hover:bg-success/5 hover:text-success'
                                }`}
                        >
                            Ingresos
                        </button>
                        <button
                            onClick={() => setTypeFilter('EXPENSE')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${typeFilter === 'EXPENSE'
                                ? 'bg-error/10 text-error-dark border border-error/20 shadow-sm'
                                : 'bg-neutral-light/30 text-neutral hover:bg-error/5 hover:text-error'
                                }`}
                        >
                            Gastos
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between text-sm px-2">
                            <span className="text-neutral">Mostrando <strong>{filteredTransactions.length}</strong> movimientos</span>
                            <span className="text-neutral">Total en pantalla: <strong className={visibleTotal >= 0 ? 'text-success-dark' : 'text-neutral-darker'}>{formatCurrency(visibleTotal)}</strong></span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-neutral font-medium">Cargando movimientos...</p>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-light border-dashed">
                                <p className="text-xl text-neutral-dark font-medium mb-2">No se encontraron movimientos</p>
                                <p className="text-neutral">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {groupedTransactions.map((group, groupIndex) => (
                                    <div key={groupIndex}>
                                        <div className="sticky top-0 z-10 py-2 bg-neutral-light/20 backdrop-blur-sm -mx-2 px-2 rounded-lg mb-2">
                                            <h4 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">{group.label}</h4>
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-light overflow-hidden">
                                            {group.transactions.map((tx, index) => (
                                                <div key={tx.id} className={index !== 0 ? 'border-t border-neutral-light/50' : ''}>
                                                    <TransactionItem transaction={tx} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-light sticky top-8">
                            <h3 className="text-lg font-bold text-neutral-darker mb-4">Resumen del Periodo</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-success/5 border border-success/10">
                                    <p className="text-sm text-neutral mb-1">Total Ingresos</p>
                                    <p className="text-2xl font-bold text-success-dark">{formatCurrency(totalIncome)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-error/5 border border-error/10">
                                    <p className="text-sm text-neutral mb-1">Total Gastos</p>
                                    <p className="text-2xl font-bold text-error-dark">{formatCurrency(totalExpense)}</p>
                                </div>
                                <div className="pt-4 border-t border-neutral-light">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-medium text-neutral-dark">Balance</p>
                                        <p className={`text-xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-primary' : 'text-error'}`}>
                                            {formatCurrency(totalIncome - totalExpense)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
