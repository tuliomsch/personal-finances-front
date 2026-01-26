import { ChevronIcon } from '../../icons/ChevronIcon';
import { CheckIcon } from '../../icons/CheckIcon';

interface CalendarTabProps {
    currentYear: number;
    selectedOption: string;
    onPrevYear: (e: React.MouseEvent) => void;
    onNextYear: (e: React.MouseEvent) => void;
    onMonthSelect: (monthIndex: number) => void;
}

export function CalendarTab({ currentYear, selectedOption, onPrevYear, onNextYear, onMonthSelect }: CalendarTabProps) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="space-y-2 animate-in fade-in duration-300">
            {/* Year Selector */}
            <div className="flex items-center justify-between px-2 py-1 bg-neutral-light/20 rounded-lg">
                <button
                    onClick={onPrevYear}
                    className="p-1 hover:bg-neutral-light rounded-full text-neutral-dark transition-colors"
                >
                    <ChevronIcon className="w-4 h-4 rotate-90" />
                </button>
                <span className="font-bold text-neutral-darker">{currentYear}</span>
                <button
                    onClick={onNextYear}
                    className="p-1 hover:bg-neutral-light rounded-full text-neutral-dark transition-colors"
                >
                    <ChevronIcon className="w-4 h-4 -rotate-90" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-1">
                {months.map((m, index) => {
                    const isSelected = selectedOption === `${m} ${currentYear}`;
                    return (
                        <button
                            key={m}
                            onClick={() => onMonthSelect(index)}
                            className={`px-3 py-2 text-sm text-left rounded-xl transition-colors flex items-center justify-between ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'text-neutral hover:bg-neutral-light/50'
                                }`}
                        >
                            {m}
                            {isSelected && <CheckIcon className="w-4 h-4" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
