import React from 'react';
import { formatCurrency } from '../../utils/format';
import { SavingsIcon } from '../icons/SavingsIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';

interface SummaryCardProps {
    label: string;
    amount: number;
    currency: string;
    trend?: number; // percentage change, e.g. +5.2 or -1.5
    icon?: React.ReactNode;
    variant?: 'primary' | 'default' | 'success' | 'danger';
    loading?: boolean;
}

export function SummaryCard({ label, amount, currency, trend, icon, variant = 'default', loading }: SummaryCardProps) {


    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-linear-to-br from-primary via-primary to-primary-dark text-white shadow-strong';
            case 'success':
                return 'bg-green-50 border border-green-100 text-green-800';
            case 'danger':
                return 'bg-red-50 border border-red-100 text-red-800';
            default:
                return 'bg-white border border-neutral-light text-neutral-darker shadow-sm';
        }
    };

    const isPrimary = variant === 'primary';

    return (
        <div className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-md ${getVariantClasses()}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isPrimary ? 'bg-white/20 text-white' : 'bg-neutral-light/50 text-neutral-dark'}`}>
                    {icon || (
                        <SavingsIcon className="w-6 h-6" />
                    )}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-lg ${trend >= 0
                        ? (isPrimary ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700')
                        : (isPrimary ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700')
                        }`}>
                        <span>{trend > 0 ? '+' : ''}{trend}%</span>
                        <ArrowUpIcon className={`w-3 h-3 ml-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                    </div>
                )}
            </div>

            <div>
                <p className={`text-sm font-medium mb-1 ${isPrimary ? 'text-white/80' : 'text-neutral'}`}>
                    {label}
                </p>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <SpinnerIcon className="w-8 h-8 text-neutral-light animate-spin" />
                    </div>
                ) : (
                    <h3 className="text-2xl font-bold tracking-tight">
                        {formatCurrency(amount, currency)}
                    </h3>
                )}
            </div>
        </div>
    );
}
