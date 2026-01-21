import { Navigate, Link } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { MailIcon } from "../components/icons/MailIcon";
import { CheckIcon } from "../components/icons/CheckIcon";
import { ChevronRightIcon } from "../components/icons/ChevronRightIcon";
import { ChartBarIcon } from "../components/icons/ChartBarIcon";
import { SavingsIcon } from "../components/icons/SavingsIcon";
import { TrendingIcon } from "../components/icons/TrendingIcon";

export function SignUpView() {
    const { session, signUp, resendVerificationEmail } = useAuth();
    const [signedUpUser, setSignedUpUser] = useState(false);
    const [email, setEmail] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleResendEmail = async () => {
        if (resendCooldown > 0 || resending) return;

        setResending(true);
        const result = await resendVerificationEmail(email);
        setResending(false);

        if (result.success) {
            setResendCooldown(60);
        }
    };

    if (session) {
        return <Navigate to="/" replace />;
    }

    return (
        signedUpUser ? (
            <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 bg-linear-to-br from-neutral-light via-white to-primary-light/30 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-light/20 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-strong p-10 border-2 border-neutral-light relative z-10 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-linear-to-br from-primary-light to-secondary-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                            <MailIcon className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4">
                            Confirma tu cuenta
                        </h1>
                        <p className="text-neutral text-lg leading-relaxed">
                            Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                        </p>
                    </div>
                    <div className="mt-8 p-5 bg-primary-light/50 rounded-2xl border-2 border-primary-light">
                        <p className="text-sm text-neutral-darker text-center font-medium">
                            <strong className="text-primary-dark">¿No recibiste el correo?</strong> Revisa tu carpeta de spam o solicita un nuevo enlace.
                            <button
                                className={`ml-1 transition-colors inline-flex items-center group ${resendCooldown > 0 || resending
                                        ? 'text-neutral cursor-not-allowed'
                                        : 'text-primary hover:text-primary-dark'
                                    }`}
                                onClick={handleResendEmail}
                                disabled={resendCooldown > 0 || resending}
                            >
                                {resending ? 'Enviando...' : resendCooldown > 0 ? `Espera ${resendCooldown}s` : 'Solicitar nuevo enlace'}
                                {!resending && resendCooldown === 0 && <ChevronRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-linear-to-br from-neutral-light via-white to-primary-light/30">
                {/* Left Column: Form */}
                <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16 xl:px-24 py-12 bg-white relative overflow-hidden">
                    {/* Animated decorative background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/40 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-light/30 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-light/20 rounded-full blur-3xl opacity-50"></div>

                    <div className="w-full max-w-md relative z-10 animate-fade-in">
                        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-4xl font-bold text-neutral-darker mb-3 leading-tight">
                                Crea tu cuenta
                            </h2>
                            <p className="text-neutral text-base">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/sign-in" className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center group">
                                    Inicia sesión aquí
                                    <ChevronRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </p>
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <LoginForm mode="signUp" onSubmit={signUp} setSignedUpEmail={setEmail} onSuccess={() => {setSignedUpUser(true); setResendCooldown(60);}} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Branding */}
                <div className="lg:flex flex-col justify-center items-center bg-linear-to-br from-primary via-primary-dark to-primary-darker p-12 relative overflow-hidden">
                    {/* Animated decorative elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -mr-[250px] -mt-[250px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -ml-[200px] -mb-[200px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>

                    <div className="w-full max-w-lg text-center relative z-10">
                        {/* Financial icons decoration */}
                        <div className="mb-10 flex justify-center space-x-5 animate-fade-in">
                            <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-strong border border-white/20 transform hover:scale-110 transition-transform duration-300">
                                <ChartBarIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-strong border border-white/20 transform hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                                <SavingsIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-strong border border-white/20 transform hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                                <TrendingIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <h2 className="text-5xl font-bold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            Comienza tu viaje financiero
                        </h2>
                        <p className="text-white/90 text-xl leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            Únete a miles de usuarios que ya están tomando el control de sus finanzas personales.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-5 text-left animate-fade-in" style={{ animationDelay: '0.5s' }}>
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-glow-green">
                                    <CheckIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Registro rápido y seguro</p>
                                    <p className="text-white/70 text-sm">Proceso simplificado en minutos</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                    <CheckIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Dashboard intuitivo</p>
                                    <p className="text-white/70 text-sm">Interfaz fácil de usar y moderna</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                                    <CheckIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Análisis en tiempo real</p>
                                    <p className="text-white/70 text-sm">Reportes y gráficos actualizados</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
