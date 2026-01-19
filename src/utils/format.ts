
export const formatCurrency = (amount: number, currency: string = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-CL').format(amount);
};

export const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
        CLP: '$',
        USD: 'US$',
        EUR: '€',
    };
    return symbols[currency] || '$';
};

