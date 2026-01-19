// src/components/complete-profile/Step1.tsx
import React from 'react';
import { UserIcon } from '../icons/UserIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Step1Props {
    name: string;
    lastName: string;
    currency: string;
    setName: (name: string) => void;
    setLastName: (lastName: string) => void;
    setCurrency: (currency: string) => void;
    handleNextStep: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Step1({ name, lastName, currency, setName, setLastName, setCurrency, handleNextStep }: Step1Props) {
    const currencies = [
        { value: 'CLP', label: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
        { value: 'USD', label: 'Dólar Americano', symbol: 'US$', flag: '🇺🇸' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <div
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-medium">
                        1
                    </div>
                    <div className="w-16 h-1 bg-neutral-light rounded-full">
                        <div className="w-0 h-full bg-primary rounded-full transition-all duration-300"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neutral-light text-neutral flex items-center justify-center font-bold">
                        2
                    </div>
                </div>
                <p className="text-center text-sm text-neutral font-medium">Paso 1 de 2</p>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-linear-to-br from-primary-light to-secondary-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                    <UserIcon className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-darker mb-3">
                    Bienvenido
                </h2>
                <p className="text-neutral text-lg">
                    Comencemos por conocerte un poco mejor.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleNextStep}>

                <div className="relative">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="peer h-14 w-full px-4 rounded-xl text-neutral-darker placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 border-2 border-neutral-light focus:border-primary"
                        placeholder="Nombre"
                        required
                    />
                    <label
                        htmlFor="name"
                        className="absolute left-4 -top-3.5 text-sm text-neutral-dark bg-white px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-dark peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm"
                    >
                        Nombre
                    </label>
                </div>

                <div className="relative">
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="peer h-14 w-full px-4 rounded-xl text-neutral-darker placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 border-2 border-neutral-light focus:border-primary"
                        placeholder="Apellido"
                        required
                    />
                    <label
                        htmlFor="lastName"
                        className="absolute left-4 -top-3.5 text-sm text-neutral-dark bg-white px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-dark peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm"
                    >
                        Apellido
                    </label>
                </div>

                <div className="pt-2">
                    <p className="text-lg font-semibold text-neutral-darker mb-4 text-center">¿Qué moneda usas?</p>
                    <div className="space-y-3">
                        {currencies.map((curr) => {
                            const isSelected = currency === curr.value;
                            return (
                                <label
                                    key={curr.value}
                                    className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                                            ? 'border-primary bg-primary-light shadow-medium'
                                            : 'border-neutral-light bg-white hover:border-primary/50 hover:shadow-soft'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="currency"
                                        value={curr.value}
                                        checked={isSelected}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center w-full">
                                        <div className="text-3xl mr-4">{curr.flag}</div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg text-neutral-darker">
                                                {curr.label}
                                            </div>
                                            <div className="text-sm text-neutral">
                                                {curr.value} - {curr.symbol}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!name.trim() || !lastName.trim() || !currency}
                        className="flex justify-center items-center w-full px-6 py-4 text-base font-semibold text-white bg-linear-to-r from-primary via-primary-dark to-primary-darker rounded-xl shadow-medium hover:shadow-strong focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-strong transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Continuar
                        <ArrowRightIcon className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}