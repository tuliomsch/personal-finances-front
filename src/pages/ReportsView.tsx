import { useState, useEffect } from 'react';
import { subMonths, subDays, differenceInDays, startOfMonth, endOfMonth, isSameMonth, subMinutes } from 'date-fns';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { useUserProfile } from '../hooks/useUserProfile';
import { transactionService, type CategoryAnalytics, type CategoryDistributionData, type MonthComparison } from '../services/transactionService';
import { DateFilterDropdown } from '../components/dashboard/DateFilterDropdown';

const chartColors = [
    "#3b82f6", // Blue
    "#f43f5e", // Rose
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#14b8a6", // Teal
];

const progressBarColors = [
    "bg-blue-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-teal-500",
];

const currencyFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("es-CL").format(number)}`;

export default function ReportsView() {
    const { userProfile } = useUserProfile();
    const [distribution, setDistribution] = useState<CategoryDistributionData | null>(null);
    const [monthComparison, setMonthComparison] = useState<MonthComparison | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryAnalytics | null>(null);

    // Date range state (default to current month)
    const [startDate, setStartDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    });
    const [prevStartDate, setPrevStartDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() - 1, 1);
    });
    const [prevEndDate, setPrevEndDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 0);
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!userProfile?.id) return;

            setLoading(true);
            try {
                const offset = startDate.getTimezoneOffset();
                const startStr = subMinutes(startDate, offset).toISOString().split('T')[0];
                const endStr = subMinutes(endDate, offset).toISOString().split('T')[0];
                const prevStartStr = subMinutes(prevStartDate, offset).toISOString().split('T')[0];
                const prevEndStr = subMinutes(prevEndDate, offset).toISOString().split('T')[0];

                const [distributionResult, comparisonResult] = await Promise.allSettled([
                    transactionService.getCategoryDistribution(userProfile.id, startStr, endStr),
                    transactionService.getMonthlyComparison(userProfile.id, startStr, endStr, prevStartStr, prevEndStr),
                ]);

                if (distributionResult.status === 'fulfilled') {
                    setDistribution(distributionResult.value);
                } else {
                    console.error('Error fetching distribution:', distributionResult.reason);
                }

                if (comparisonResult.status === 'fulfilled') {
                    setMonthComparison(comparisonResult.value);
                } else {
                    console.error('Error fetching comparison:', comparisonResult.reason);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [userProfile, startDate, endDate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-96 bg-white rounded-2xl animate-pulse"></div>
                        <div className="h-96 bg-white rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!distribution) {
        return (
            <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-neutral-darker">Análisis de Gastos</h1>
                    <p className="text-neutral mt-2">No hay datos disponibles para mostrar.</p>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const donutData = (selectedCategory ? selectedCategory.subCategories : distribution.categories).map((cat) => ({
        name: cat.name,
        amount: cat.amount,
        icon: cat.icon,
    }));

    const comparisonData = monthComparison ? [
        { name: 'Período Anterior', amount: monthComparison.previous },
        { name: 'Período Actual', amount: monthComparison.current },
    ] : [];

    const handleCategoryClick = (_data: any, index: number) => {
        // Only drill down if the category has subcategories
        if (!selectedCategory && distribution.categories[index].subCategories.length > 0) {
            setSelectedCategory(distribution.categories[index]);
        }
    };

    const handleBackToMain = () => {
        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-darker">Análisis de Gastos</h1>
                        <p className="text-neutral text-lg">Descubre a dónde va tu dinero</p>
                    </div>
                    <DateFilterDropdown
                        startDate={startDate}
                        endDate={endDate}
                        onDateRangeChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);

                            // Calculate comparison period
                            if (start.getDate() === 1 && end.getDate() === endOfMonth(start).getDate() && isSameMonth(start, end)) {
                                // If full month selected, compare with previous month
                                const prevMonth = subMonths(start, 1);
                                setPrevStartDate(startOfMonth(prevMonth));
                                setPrevEndDate(endOfMonth(prevMonth));
                            } else {
                                // If custom range, compare with same period before
                                const durationDays = differenceInDays(end, start);
                                const prevEnd = subDays(start, 1);
                                const prevStart = subDays(prevEnd, durationDays);
                                setPrevStartDate(prevStart);
                                setPrevEndDate(prevEnd);
                            }
                        }}
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Expense Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-light/30 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-neutral-darker">
                                {selectedCategory ? `${selectedCategory.name} - Detalle` : 'Distribución de Gastos'}
                            </h2>
                            {selectedCategory && (
                                <button
                                    onClick={handleBackToMain}
                                    className="text-sm text-primary-dark hover:text-primary font-medium transition-colors"
                                >
                                    ← Volver
                                </button>
                            )}
                        </div>

                        {distribution && distribution.totalExpense > 0 ? (
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Donut Chart */}
                                <div className="w-64 h-64 shrink-0">
                                    <DonutChart
                                        data={donutData}
                                        category="amount"
                                        index="name"
                                        valueFormatter={currencyFormatter}
                                        colors={chartColors}
                                        onSegmentClick={handleCategoryClick}
                                        centerText={currencyFormatter(selectedCategory ? selectedCategory.amount : distribution.totalExpense)}
                                        centerSubtext="Total"
                                        className="h-64"
                                    />
                                </div>

                                {/* Legend */}
                                <div className="w-full space-y-2">
                                    <h3 className="text-gray-900 font-bold mb-4">Detalle</h3>
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {donutData.map((item, index) => (
                                            <div
                                                key={item.name}
                                                className="flex flex-wrap justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                                                onClick={() => handleCategoryClick(item, index)}
                                            >
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span
                                                        className="w-3 h-3 rounded-full shrink-0"
                                                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                                                    />
                                                    <span className="text-xl over shrink-0">{item.icon}</span>
                                                    <span className="text-gray-600 font-medium truncate">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-900 shrink-0">
                                                    {currencyFormatter(item.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <span className="text-4xl mb-4">📉</span>
                                <p className="text-neutral font-medium">No hay gastos registrados</p>
                                <p className="text-sm text-neutral/70 mt-1">Intenta seleccionar otro período</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Monthly Comparison */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-light/30 shadow-sm">
                        <h2 className="text-xl font-bold text-neutral-darker mb-6">Comparación Mensual</h2>

                        {monthComparison && monthComparison.current > 0 ? (
                            <>
                                <BarChart
                                    data={comparisonData}
                                    category="amount"
                                    index="name"
                                    valueFormatter={currencyFormatter}
                                    colors={["#94a3b8", "#3b82f6"]}
                                    layout="horizontal"
                                />

                                <div className="mt-6 p-4 bg-neutral-light/20 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral">Diferencia</span>
                                        <span className={`text-lg font-bold ${monthComparison.difference > 0
                                            ? 'text-error-dark'
                                            : 'text-success-dark'
                                            }`}>
                                            {monthComparison.difference > 0 ? '+' : ''}
                                            {currencyFormatter(monthComparison.difference)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm text-neutral">Cambio Porcentual</span>
                                        <span className={`text-lg font-bold ${monthComparison.percentageChange > 0
                                            ? 'text-error-dark'
                                            : 'text-success-dark'
                                            }`}>
                                            {monthComparison.percentageChange > 0 ? '+' : ''}
                                            {monthComparison.percentageChange.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <span className="text-4xl mb-4">📊</span>
                                <p className="text-neutral font-medium">No hay datos de comparación</p>
                                <p className="text-sm text-neutral/70 mt-1">Registra gastos este mes para ver el análisis</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top "Ladrones" de Dinero */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-light/30 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-darker mb-6">
                        🎯 Top "Ladrones" de Dinero
                    </h2>

                    <div className="space-y-4">
                        {distribution && (distribution.categories).length > 0 ? (
                            (distribution.categories).map((category, index) => {
                                const percentage = distribution.totalExpense > 0
                                    ? (category.amount / distribution.totalExpense) * 100
                                    : 0;

                                return (
                                    <div
                                        key={category.id}
                                        className="group p-4 rounded-xl hover:bg-neutral-light/20 transition-all border border-transparent hover:border-neutral-light/50"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${index === 0
                                                    ? 'bg-error-light/20 ring-2 ring-error-dark'
                                                    : 'bg-neutral-light/30'
                                                    }`}>
                                                    <span className="text-2xl">{category.icon}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-base font-bold text-neutral-darker">
                                                            {category.name}
                                                        </p>
                                                        {index === 0 && (
                                                            <span className="text-xs bg-error-dark text-white px-2 py-0.5 rounded-full font-semibold">
                                                                #1 Ladrón
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-neutral">
                                                        {percentage.toFixed(1)}% del total • {category.subCategories.length} subcategorías
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-neutral-darker">
                                                {currencyFormatter(category.amount)}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-neutral-light/30 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${progressBarColors[index % progressBarColors.length]}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-center text-neutral">
                                <p>No hay datos suficientes para mostrar el ranking</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}