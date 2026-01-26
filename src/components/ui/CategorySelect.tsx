import { useState, useEffect, useRef } from 'react';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { useUserProfile } from '../../hooks/useUserProfile';
import { categoryService } from '../../services/categoryService';
import { CreateCategoryModal } from '../CreateCategoryModal';

interface CategoryOption {
    id: number;
    name: string;
    icon?: string;
    subCategories?: CategoryOption[];
    type: 'INCOME' | 'EXPENSE';
}

interface CategorySelectProps {
    value?: number;
    onChange: (value: number) => void;
    type?: 'INCOME' | 'EXPENSE';
    error?: boolean;
}

export function CategorySelect({ value, onChange, type, error }: CategorySelectProps) {
    const { userProfile } = useUserProfile();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (userProfile?.id) {
            setLoading(true);
            loadCategories();
        }
    }, [userProfile]);

    const loadCategories = () => {
        if (!userProfile?.id) return;
        categoryService.getCategories(userProfile.id)
            .then(data => setCategories(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const filteredCategories = categories.filter(c => c.type === type);

    const selectedCategory = filteredCategories.flatMap(c => [c, ...(c.subCategories || [])]).find(c => c.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: number) => {
        onChange(val);
        setIsOpen(false);
    };

    const handleCreateSuccess = (newCategory: any) => {
        loadCategories();
        onChange(newCategory.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 text-left bg-white border rounded-xl flex items-center justify-between transition-all ${error
                    ? 'border-error ring-1 ring-error/50'
                    : isOpen
                        ? 'border-primary ring-4 ring-primary/10'
                        : 'border-neutral-light hover:border-primary/50'
                    } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                disabled={loading}
            >
                <span className={`block truncate ${!selectedCategory ? 'text-neutral' : 'text-neutral-darker font-medium'}`}>
                    {selectedCategory ? selectedCategory.icon + ' ' + selectedCategory.name : loading ? 'Cargando categorías...' : 'Selecciona una categoría'}
                </span>
                <ChevronIcon
                    className={`w-5 h-5 text-neutral transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-neutral-light overflow-hidden animate-fade-in origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredCategories.flatMap(category => [
                            // Render Parent
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => handleSelect(category.id)}
                                className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center justify-between font-semibold ${value === category.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-neutral-darker hover:bg-neutral-light/50'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    <span>{category.name}</span>
                                </span>
                                {value === category.id && (
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                )}
                            </button>,
                            // Render Children
                            ...(category.subCategories || []).map(sub => (
                                <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => handleSelect(sub.id)}
                                    className={`w-full pl-8 pr-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${value === sub.id
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-neutral-darker hover:bg-neutral-light/50'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{sub.name}</span>
                                    </span>
                                    {value === sub.id && (
                                        <CheckIcon className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))
                        ])}
                        {filteredCategories.length === 0 && (
                            <div className="px-4 py-3 text-sm text-neutral text-center">
                                No se encontraron categorías
                            </div>
                        )}

                        <div className="border-t border-neutral-light/50 mt-1 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="w-full px-3 py-2.5 text-left text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Crear nueva categoría...</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                initialType={type}
            />
        </div>
    );
}
