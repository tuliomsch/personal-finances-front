import { useNavigate } from 'react-router-dom';
import { type CategorySummary } from '../../services/transactionService';

interface TopExpensesWidgetProps {
    topExpenses: CategorySummary[];
    totalExpense: number;
    loading?: boolean;
}

export function TopExpensesWidget({ topExpenses, totalExpense, loading = false }: TopExpensesWidgetProps) {
    const navigate = useNavigate();
    const currencyFormatter = (amount: number) =>
        `$ ${new Intl.NumberFormat('es-CL').format(amount)}`;

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-neutral-light/30 p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (topExpenses.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-neutral-light p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="pb-6 border-b border-neutral-light/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-neutral-darker">Top Gastos del Mes</h3>
                    <button onClick={() => navigate('/reports')} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todo</button>
                </div>
                <div className="text-center py-8 text-neutral">
                    <p>No hay gastos registrados en este período.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-neutral-light p-6 shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="flex justify-between items-center pb-6 border-b border-neutral-light/50">
                <h3 className="text-lg font-bold text-neutral-darker">Top Gastos del Mes</h3>
                <button onClick={() => navigate('/reports')} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todo</button>
            </div>

            <div className="space-y-3">
                {topExpenses.slice(0, 3).map((category, index) => {
                    const percentage = totalExpense > 0 ? (category.amount / totalExpense) * 100 : 0;

                    return (
                        <div
                            key={category.id}
                            className="group p-3 rounded-lg hover:bg-neutral-light/20 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-darker">
                                            {category.name}
                                        </p>
                                        <p className="text-xs text-neutral">
                                            {percentage.toFixed(1)}% del total
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-neutral-darker">
                                    {currencyFormatter(category.amount)}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-neutral-light/30 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${index === 0
                                        ? 'bg-primary'
                                        : index === 1
                                            ? 'bg-warning'
                                            : 'bg-error'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
