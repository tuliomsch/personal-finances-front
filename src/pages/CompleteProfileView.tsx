import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { Step1 } from '../components/complete-profile/Step1';
import { Step2 } from '../components/complete-profile/Step2';

export function CompleteProfileView() {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Step 1 state
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currency, setCurrency] = useState('CLP');

    const [accounts, setAccounts] = useState<{ type: string; name: string; balance: string; bankName?: string; cardDebt?: string }[]>([
        { type: 'Efectivo', name: 'Billetera', balance: '' }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = location.state?.user;

    if (!user) {
        return <Navigate to="/sign-up" replace />;
    }

    const handleStep1Next = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name.trim() && lastName.trim() && currency) {
            setStep(2);
        }
    };

    const handleStep2Back = () => {
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formattedAccounts = accounts.map(acc => ({
                type: acc.type,
                name: acc.name,
                balance: parseFloat(acc.balance) || 0,
                bankName: acc.bankName,
                cardDebt: acc.cardDebt ? parseFloat(acc.cardDebt) : undefined,
            }));

            const profileData = {
                email: user.email,
                supabaseId: user.id,
                name: name,
                lastName: lastName,
                currencyPref: currency,
                accounts: formattedAccounts,
            };

            await userService.completeUserProfile(profileData);

            navigate('/');

        } catch (err) {
            console.error('Error completing profile:', err);
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Error al guardar el perfil. Por favor, inténtalo de nuevo.';
            setError(errorMessage || 'Error al guardar el perfil. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-light/20 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-white rounded-3xl shadow-strong p-8 md:p-12 border-2 border-neutral-light">
                    {step === 1 && (
                        <Step1
                            name={name}
                            lastName={lastName}
                            currency={currency}
                            setName={setName}
                            setLastName={setLastName}
                            setCurrency={setCurrency}
                            handleNextStep={handleStep1Next}
                        />
                    )}

                    {step === 2 && (
                        <Step2
                            accounts={accounts}
                            setAccounts={setAccounts}
                            currency={currency}
                            handleSubmit={handleSubmit}
                            handleBack={handleStep2Back}
                            loading={loading}
                            error={error}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

