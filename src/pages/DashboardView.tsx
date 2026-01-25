import { SummaryCard } from '../components/dashboard/SummaryCard';
import { AccountsWidget, type DashboardAccount } from '../components/dashboard/AccountsWidget';
import { RecentTransactions, type Transaction } from '../components/dashboard/RecentTransactions';
import { QuickActions } from '../components/dashboard/QuickActions';
import { SavingsIcon } from '../components/icons/SavingsIcon';
import { StonksIcon } from '../components/icons/StonksIcon';
import { NotStonksIcon } from '../components/icons/NotStonksIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';

export function DashboardView() {
    const { userProfile } = useUserProfile();

    const [accounts, setAccounts] = useState<DashboardAccount[]>([]);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    const refreshData = async () => {
        if (userProfile?.id) {
            setLoadingAccounts(true);
            setLoadingTransactions(true);
            try {
                const [accountsData, transactionsData] = await Promise.all([
                    accountService.getAccounts(userProfile.id),
                    transactionService.getTransactions(userProfile.id)
                ]);

                setAccounts(accountsData.accounts);
                setTotalBalance(accountsData.totalBalance);

                const mappedTransactions: Transaction[] = transactionsData.transactions.map((tx) => ({
                    id: tx.id,
                    description: tx.description,
                    amount: tx.amount,
                    transactionDate: tx.transactionDate,
                    type: tx.type,
                    category: tx.category?.name || 'Transferencia',
                    icon: tx.category?.icon || '💸',
                })).slice(0, 5);
                setRecentTransactions(mappedTransactions);
                setTotalIncome(transactionsData.totalIncome);
                setTotalExpense(transactionsData.totalExpense);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingAccounts(false);
                setLoadingTransactions(false);
            }
        }
    };

    useEffect(() => {
        refreshData();
    }, [userProfile]);

    return (
        <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* Hero / Summary Section */}
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-darker">Panel General</h1>
                        <p className="text-neutral text-lg">Resumen de tu salud financiera</p>
                    </div>
                    {/* Date or Filter could go here */}
                    <div className="text-sm text-neutral-dark font-medium bg-white px-4 py-2 rounded-xl border border-neutral-light shadow-sm">
                        Enero 2026
                    </div>
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

                {/* Main Content Grid: Accounts (Left) & Activity (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (2/3 width on large screens) */}
                    <div className="lg:col-span-2 space-y-6">
                        <AccountsWidget accounts={accounts} loading={loadingAccounts} onRefresh={refreshData} />
                    </div>

                    {/* Right Column (1/3 width) */}
                    <div className="space-y-6">
                        <RecentTransactions transactions={recentTransactions} loading={loadingTransactions} />
                    </div>
                </div>

            </div>
            <QuickActions onTransactionCreated={refreshData} />
        </div>
    );
}
