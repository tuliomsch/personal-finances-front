interface PeriodTabProps {
    onSelect: (option: string) => void;
}

export function PeriodTab({ onSelect }: PeriodTabProps) {
    return (
        <div className="space-y-1 animate-in fade-in duration-300">
            <div className="px-3 py-2 text-[10px] text-neutral font-bold uppercase tracking-wider bg-neutral-light/10 rounded-lg mb-1">
                Ciclos de Pago (Último día hábil)
            </div>
            <button
                onClick={() => onSelect("Periodo Enero (Pagado el 30 Dic)")}
                className="w-full px-3 py-3 text-sm text-left rounded-xl hover:bg-neutral-light/50 transition-colors flex flex-col group"
            >
                <span className="font-bold text-neutral-darker group-hover:text-primary transition-colors">Periodo Enero</span>
                <span className="text-xs text-neutral">Pagado el 30 de Dic</span>
            </button>
            <button
                onClick={() => onSelect("Periodo Febrero (Pagado el 30 Ene)")}
                className="w-full px-3 py-3 text-sm text-left rounded-xl bg-primary/10 text-primary font-bold flex flex-col ring-1 ring-primary/20"
            >
                <span className="font-bold">Periodo Febrero</span>
                <span className="text-xs opacity-80">Pagado el 30 de Ene</span>
            </button>
            <button
                onClick={() => onSelect("Periodo Marzo (Pagado el 27 Feb)")}
                className="w-full px-3 py-3 text-sm text-left rounded-xl hover:bg-neutral-light/50 transition-colors flex flex-col group"
            >
                <span className="font-bold text-neutral-darker group-hover:text-primary transition-colors">Periodo Marzo</span>
                <span className="text-xs text-neutral">Pagado el 27 de Feb</span>
            </button>
        </div>
    );
}
