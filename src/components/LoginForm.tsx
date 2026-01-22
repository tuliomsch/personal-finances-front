import { useState } from 'react';
import { MailIcon } from './icons/MailIcon';
import { LockIcon } from './icons/LockIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginFormProps {
    mode: 'signIn' | 'signUp';
    onSubmit: (email: string, password: string) => Promise<{ success: boolean; data?: unknown; error?: string | null }>;
    onSuccess?: (data?: unknown) => void;
    setSignedUpEmail?: (email: string) => void;
    onGoogleSignIn: () => void;
}

export function LoginForm({ mode, onSubmit, onSuccess, setSignedUpEmail, onGoogleSignIn }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await onSubmit(email, password);
            if (result.success) {
                if (setSignedUpEmail) setSignedUpEmail(email);
                if (onSuccess) onSuccess(result.data);
            } else {
                setError(result.error || `Ocurrió un error inesperado durante el ${mode === 'signIn' ? 'inicio de sesión' : 'registro'}. Por favor, inténtalo de nuevo.`);
            }
        } catch (err) {
            console.error(`Error during ${mode}:`, err);
            setError(`Ocurrió un error inesperado durante el ${mode === 'signIn' ? 'inicio de sesión' : 'registro'}. Por favor, inténtalo de nuevo.`);
        } finally {
            setLoading(false);
        }
    };

    const buttonText = mode === 'signIn' ? 'Iniciar Sesión' : 'Crear cuenta';
    const loadingButtonText = mode === 'signIn' ? 'Iniciando sesión...' : 'Creando cuenta...';
    const passwordAutocomplete = mode === 'signIn' ? 'current-password' : 'new-password';

    return (
        <form className="space-y-5 animate-fade-in" onSubmit={handleAction}>
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-neutral-darker mb-2"
                >
                    Correo electrónico
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-neutral transition-colors group-focus-within:text-primary" />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3.5 bg-white border-2 border-neutral-light rounded-xl shadow-soft placeholder-neutral transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-neutral group text-neutral-darker font-medium"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-neutral-darker mb-2"
                >
                    Contraseña
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockIcon className="h-5 w-5 text-neutral transition-colors group-focus-within:text-primary" />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={passwordAutocomplete}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white border-2 border-neutral-light rounded-xl shadow-soft placeholder-neutral transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-neutral group text-neutral-darker font-medium"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral hover:text-primary transition-colors"
                    >
                        {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
            <div className="pt-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center w-full px-6 py-4 text-base font-semibold text-white bg-linear-to-r from-primary via-primary-dark to-primary-darker rounded-xl shadow-medium hover:shadow-strong focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-medium transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center">
                        {loading ? (
                            <>
                                <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                {loadingButtonText}
                            </>
                        ) : (
                            <>
                                {buttonText}
                                <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-neutral-light"></div>
                <span className="flex-shrink mx-4 text-neutral text-sm font-medium">o continúa con</span>
                <div className="flex-grow border-t border-neutral-light"></div>
            </div>

            {/* Google Sign In Button */}
            <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={loading}
                className="flex justify-center items-center w-full px-6 py-4 text-base font-semibold text-neutral-darker bg-white border-2 border-neutral-light rounded-xl shadow-soft hover:shadow-medium hover:border-neutral focus:outline-none focus:ring-4 focus:ring-neutral/20 disabled:opacity-60 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
                <GoogleIcon className="w-5 h-5 mr-3" />
                <span>Google</span>
            </button>

            {error && (
                <div className="mt-4 p-4 bg-error/10 border-2 border-error/20 rounded-xl animate-slide-up">
                    <p className="text-sm text-center text-error flex items-center justify-center font-medium">
                        <ExclamationCircleIcon className="w-5 h-5 mr-2 shrink-0" />
                        {error}
                    </p>
                </div>
            )}
        </form>
    );
}