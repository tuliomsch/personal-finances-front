import { useState, useEffect, useRef } from 'react';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CheckIcon } from '../icons/CheckIcon';

export function DateFilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'period' | 'custom'>('calendar');
    const [selectedOption, setSelectedOption] = useState("Enero 2026");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border rounded-xl shadow-sm transition-all hover:bg-neutral-light/20 ${isOpen ? 'border-primary ring-4 ring-primary/10' : 'border-neutral-light'
                    }`}
            >
                <div className="flex flex-col items-start translate-y-[2px]">
                    <span className="text-[10px] text-neutral font-bold uppercase tracking-wider leading-none">Periodo</span>
                    <span className="text-sm text-neutral-darker font-semibold">{selectedOption}</span>
                </div>
                <ChevronIcon className={`w-5 h-5 text-neutral transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-neutral-light rounded-2xl shadow-strong overflow-hidden z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                    {/* Tabs Header */}
                    <div className="flex p-1.5 bg-neutral-light/30 border-b border-neutral-light">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-neutral hover:text-neutral-dark'
                                }`}
                        >
                            Calendario
                        </button>
                        <button
                            onClick={() => setActiveTab('period')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'period' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-neutral hover:text-neutral-dark'
                                }`}
                        >
                            Mi Periodo
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'custom' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-neutral hover:text-neutral-dark'
                                }`}
                        >
                            Personalizado
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                        {activeTab === 'calendar' && (
                            <div className="grid grid-cols-2 gap-1 animate-in fade-in duration-300">
                                {months.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => { setSelectedOption(`${m} 2026`); setIsOpen(false); }}
                                        className={`px-3 py-2 text-sm text-left rounded-xl transition-colors flex items-center justify-between ${selectedOption.startsWith(m) ? 'bg-primary/10 text-primary font-bold' : 'text-neutral hover:bg-neutral-light/50'
                                            }`}
                                    >
                                        {m}
                                        {selectedOption.startsWith(m) && <CheckIcon className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'period' && (
                            <div className="space-y-1 animate-in fade-in duration-300">
                                <div className="px-3 py-2 text-[10px] text-neutral font-bold uppercase tracking-wider bg-neutral-light/10 rounded-lg mb-1">
                                    Ciclos de Pago (Último día hábil)
                                </div>
                                <button
                                    onClick={() => { setSelectedOption("Periodo Enero (Pagado el 30 Dic)"); setIsOpen(false); }}
                                    className="w-full px-3 py-3 text-sm text-left rounded-xl hover:bg-neutral-light/50 transition-colors flex flex-col group"
                                >
                                    <span className="font-bold text-neutral-darker group-hover:text-primary transition-colors">Periodo Enero</span>
                                    <span className="text-xs text-neutral">Pagado el 30 de Dic</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedOption("Periodo Febrero (Pagado el 30 Ene)"); setIsOpen(false); }}
                                    className="w-full px-3 py-3 text-sm text-left rounded-xl bg-primary/10 text-primary font-bold flex flex-col ring-1 ring-primary/20"
                                >
                                    <span className="font-bold">Periodo Febrero</span>
                                    <span className="text-xs opacity-80">Pagado el 30 de Ene</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedOption("Periodo Marzo (Pagado el 27 Feb)"); setIsOpen(false); }}
                                    className="w-full px-3 py-3 text-sm text-left rounded-xl hover:bg-neutral-light/50 transition-colors flex flex-col group"
                                >
                                    <span className="font-bold text-neutral-darker group-hover:text-primary transition-colors">Periodo Marzo</span>
                                    <span className="text-xs text-neutral">Pagado el 27 de Feb</span>
                                </button>
                            </div>
                        )}

                        {activeTab === 'custom' && (
                            <div className="p-2 space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] text-neutral font-bold uppercase mb-1.5 block">Fecha Desde</label>
                                        <input type="date" className="w-full px-3 py-2 text-sm border border-neutral-light rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-neutral font-bold uppercase mb-1.5 block">Fecha Hasta</label>
                                        <input type="date" className="w-full px-3 py-2 text-sm border border-neutral-light rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all transform active:scale-95 text-sm"
                                >
                                    Aplicar Rango
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Menu Footer */}
                    <div className="p-3 bg-neutral-light/10 border-t border-neutral-light flex justify-between items-center text-[10px] text-neutral">
                        <span className="font-bold">Rango: 01 Ene - 31 Ene</span>
                    </div>
                </div>
            )}
        </div>
    );
}
