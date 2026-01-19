import React, { useState, useEffect, useRef } from 'react';
import { formatNumber as formatNumberUtility, getCurrencySymbol } from '../../utils/format';

interface MoneyInputProps {
    value: string;
    onChange: (value: string) => void;
    currency: string;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
}

export function MoneyInput({ value, onChange, currency, placeholder = "0", className = "", autoFocus = false }: MoneyInputProps) {
    // Only format for display if there's a value
    const [displayValue, setDisplayValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatNumber = (val: string) => {
        // Remove non-digits
        const digits = val.replace(/\D/g, '');
        if (!digits) return '';
        // Add thousands separators using shared utility
        return formatNumberUtility(parseInt(digits, 10));
    };

    useEffect(() => {
        // When parent value changes externally/initially, update formatted display
        // Avoid overwriting valid user input if it's just a re-render
        if (value) {
            setDisplayValue(formatNumber(value));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const formatted = formatNumber(raw);
        setDisplayValue(formatted);

        // Return cleaned integer string to parent
        const cleanValue = raw.replace(/\D/g, '');
        onChange(cleanValue);
    };

    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral font-medium pointer-events-none select-none">
                {getCurrencySymbol(currency)}
            </span>
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium placeholder:text-neutral-light focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${className}`}
            />
        </div>
    );
}
