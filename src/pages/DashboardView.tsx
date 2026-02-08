import { SummaryCard } from '../components/dashboard/SummaryCard';
import { AccountsWidget, type DashboardAccount } from '../components/dashboard/AccountsWidget';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { TopExpensesWidget } from '../components/dashboard/TopExpensesWidget';
import { SavingsIcon } from '../components/icons/SavingsIcon';
import { StonksIcon } from '../components/icons/StonksIcon';
import { NotStonksIcon } from '../components/icons/NotStonksIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import { transactionService, type ExpenseAnalyticsSummaryData } from '../services/transactionService';
import { DateFilterDropdown } from '../components/dashboard/DateFilterDropdown';
import { type Transaction } from '../utils/transactions';
import { subMinutes } from 'date-fns';

export function DashboardView() {
    const { userProfile } = useUserProfile();

    const [accounts, setAccounts] = useState<DashboardAccount[]>([]);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [analyticsSummary, setAnalyticsSummary] = useState<ExpenseAnalyticsSummaryData | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    // Estados para el filtro de fecha (por defectos mes actual)
    const [startDate, setStartDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    });

    const refreshData = async () => {
        if (userProfile?.id) {
            setLoadingAccounts(true);
            setLoadingTransactions(true);
            setLoadingAnalytics(true);
            try {
                // Formatear fechas para la API (YYYY-MM-DD)
                const offset = startDate.getTimezoneOffset();
                const startStr = subMinutes(startDate, offset).toISOString().split('T')[0];
                const endStr = subMinutes(endDate, offset).toISOString().split('T')[0];

                const [accountsResult, transactionsResult, analyticsSummaryResult] = await Promise.allSettled([
                    accountService.getAccounts(userProfile.id),
                    transactionService.getTransactions(userProfile.id, startStr, endStr),
                    transactionService.getExpenseAnalyticsSummary(userProfile.id, startStr, endStr, 3)
                ]);

                if (accountsResult.status === 'fulfilled') {
                    setAccounts(accountsResult.value.accounts);
                    setTotalBalance(accountsResult.value.totalBalance);
                } else {
                    console.error('Error fetching accounts:', accountsResult.reason);
                }

                if (transactionsResult.status === 'fulfilled') {
                    const transactionsData = transactionsResult.value;
                    const mappedTransactions: Transaction[] = transactionsData.transactions.map((tx) => ({
                        id: tx.id,
                        description: tx.description,
                        amount: tx.amount,
                        transactionDate: tx.transactionDate,
                        type: tx.type,
                        category: tx.transferToId ? 'Transferencia' : tx.category?.name || 'Sin asignar',
                        icon: tx.transferToId ? '💸' : tx.category?.icon || '❓',
                        accountId: tx.accountId,
                        categoryId: tx.categoryId,
                        transferToId: tx.transferToId,
                    })).slice(0, 5);
                    setRecentTransactions(mappedTransactions);
                    setTotalIncome(transactionsData.totalIncome);
                    setTotalExpense(transactionsData.totalExpense);
                } else {
                    console.error('Error fetching transactions:', transactionsResult.reason);
                }

                if (analyticsSummaryResult.status === 'fulfilled') {
                    setAnalyticsSummary(analyticsSummaryResult.value);
                } else {
                    console.error('Error fetching analytics summary:', analyticsSummaryResult.reason);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingAccounts(false);
                setLoadingTransactions(false);
                setLoadingAnalytics(false);
            }
        }
    };

    useEffect(() => {
        refreshData();

        const handleTransactionEvent = () => {
            refreshData();
        };

        window.addEventListener('transaction-event', handleTransactionEvent);

        return () => {
            window.removeEventListener('transaction-event', handleTransactionEvent);
        };
    }, [userProfile, startDate, endDate]);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* Hero / Summary Section */}
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-darker">Panel General</h1>
                        <p className="text-neutral text-lg">Resumen de tu salud financiera</p>
                    </div>
                    <DateFilterDropdown
                        startDate={startDate}
                        endDate={endDate}
                        onDateRangeChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    />
                </div>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard
                        label="Patrimonio Neto"
                        amount={totalBalance}
                        currency="CLP"
                        variant="primary"
                        icon={<SavingsIcon className="w-6 h-6" />}
                        loading={loadingAccounts}
                    />
                    <SummaryCard
                        label="Ingresos (Mes)"
                        amount={totalIncome}
                        currency="CLP"
                        variant="default"
                        icon={<StonksIcon className="w-6 h-6 text-success-dark" />}
                    />
                    <SummaryCard
                        label="Gastos (Mes)"
                        amount={totalExpense}
                        currency="CLP"
                        variant="default"
                        icon={<NotStonksIcon className="w-6 h-6 text-error-dark" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-min gap-8 overflow-y-auto pb-4">

                    <div className="lg:col-span-2 lg:row-span-2">
                        <AccountsWidget accounts={accounts} loading={loadingAccounts} onRefresh={refreshData} />
                    </div>

                    <div className="lg:col-span-1">
                        <TopExpensesWidget
                            topExpenses={analyticsSummary?.topCategories || []}
                            totalExpense={analyticsSummary?.totalExpense || 0}
                            loading={loadingAnalytics}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <RecentTransactions transactions={recentTransactions} userId={userProfile?.id || 0} loading={loadingTransactions} />
                    </div>
                </div>

            </div>
        </div>
    );
}
