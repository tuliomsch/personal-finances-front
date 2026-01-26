import { useState } from "react";

interface CustomTabProps {
    onApply: (startDate: string, endDate: string) => void;
}

export function CustomTab({ onApply }: CustomTabProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleApply = () => {
        if (startDate && endDate) {
            onApply(startDate, endDate);
        }
    };

    return (
        <div className="p-2 space-y-4 animate-in fade-in duration-300">
            <div className="space-y-3">
                <div>
                    <label className="text-[10px] text-neutral font-bold uppercase mb-1.5 block">Fecha Desde</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-light rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-neutral font-bold uppercase mb-1.5 block">Fecha Hasta</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-light rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>
            <button
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="w-full py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all transform active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Aplicar Rango
            </button>
        </div>
    );
}
