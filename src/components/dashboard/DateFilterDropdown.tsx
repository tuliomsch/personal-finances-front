import { useState, useEffect, useRef } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, setYear, setMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CalendarTab } from './tabs/CalendarTab';
// import { PeriodTab } from './tabs/PeriodTab';
import { CustomTab } from './tabs/CustomTab';

interface DateFilterDropdownProps {
    startDate: Date;
    endDate: Date;
    onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

export function DateFilterDropdown({ startDate, endDate, onDateRangeChange }: DateFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'period' | 'custom'>('calendar');

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedOption, setSelectedOption] = useState("");
    const [rangeLabel, setRangeLabel] = useState("");
    const [periodType, setPeriodType] = useState<'calendar' | 'period' | 'custom'>('calendar');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update labels when props change
    useEffect(() => {
        if (periodType === 'calendar') {
            setSelectedOption(format(startDate, "MMMM yyyy", { locale: es }));
        } else if (periodType === 'custom') {
            setSelectedOption(`${format(startDate, "dd MMM", { locale: es })} - ${format(endDate, "dd MMM", { locale: es })}`);
        }

        setRangeLabel(`${format(startDate, "dd MMM", { locale: es })} - ${format(endDate, "dd MMM", { locale: es })}`);

        // Update calendar year if the selected date is different
        setCurrentYear(startDate.getFullYear());
    }, [startDate, endDate]);

    // Handler para Calendar Tab
    const handleMonthSelect = (monthIndex: number) => {
        setPeriodType('calendar');
        let date = new Date();
        date = setYear(date, currentYear);
        date = setMonth(date, monthIndex);

        const start = startOfMonth(date);
        const end = endOfMonth(date);

        setIsOpen(false);

        if (onDateRangeChange) {
            onDateRangeChange(start, end);
        }
    };

    // Handler para Custom Tab
    const handleCustomApply = (startStr: string, endStr: string) => {
        setPeriodType('custom');
        const start = parseISO(`${startStr}T00:00:00`);
        const end = parseISO(`${endStr}T00:00:00`);

        setIsOpen(false);

        if (onDateRangeChange) {
            onDateRangeChange(start, end);
        }
    };

    // Handler para Period Tab
    // const handlePeriodSelect = (option: string) => {
    //     setSelectedOption(option);
    //     setRangeLabel("Periodo seleccionado");
    //     setIsOpen(false);
    // };

    const prevYear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentYear(prev => prev - 1);
    };

    const nextYear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentYear(prev => prev + 1);
    };

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
                    <span className="text-sm text-neutral-darker font-semibold capitalize">{selectedOption}</span>
                </div>
                <ChevronIcon className={`w-5 h-5 text-neutral transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-neutral-light rounded-2xl shadow-strong overflow-hidden z-100 animate-in fade-in zoom-in duration-200 origin-top-right">
                    {/* Tabs Header */}
                    <div className="flex p-1.5 bg-neutral-light/30 border-b border-neutral-light">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-neutral hover:text-neutral-dark'
                                }`}
                        >
                            Calendario
                        </button>
                        {/* <button
                            onClick={() => setActiveTab('period')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'period' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-neutral hover:text-neutral-dark'
                                }`}
                        >
                            Mi Periodo
                        </button> */}
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
                            <CalendarTab
                                currentYear={currentYear}
                                selectedOption={selectedOption}
                                onPrevYear={prevYear}
                                onNextYear={nextYear}
                                onMonthSelect={handleMonthSelect}
                            />
                        )}

                        {/* {activeTab === 'period' && (
                            <PeriodTab onSelect={handlePeriodSelect} />
                        )} */}

                        {activeTab === 'custom' && (
                            <CustomTab onApply={handleCustomApply} />
                        )}
                    </div>

                    {/* Menu Footer */}
                    <div className="p-3 bg-neutral-light/10 border-t border-neutral-light flex justify-between items-center text-[10px] text-neutral">
                        <span className="font-bold">Rango: {rangeLabel}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
