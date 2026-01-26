import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { useUserProfile } from '../hooks/useUserProfile';
import { categoryService, type Category } from '../services/categoryService';

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newCategory?: any) => void;
    initialType?: 'EXPENSE' | 'INCOME';
    editingCategory?: Category | null;
}

export function CreateCategoryModal({ isOpen, onClose, onSuccess, initialType = 'EXPENSE', editingCategory }: CreateCategoryModalProps) {
    const { userProfile } = useUserProfile();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🛒');
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>(initialType);
    const [parentId, setParentId] = useState<number | null>(null);

    const [availableParents, setAvailableParents] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset when modal opens or type changes
    useEffect(() => {
        if (isOpen && userProfile?.id) {
            // Load categories to populate parent selector
            categoryService.getCategories(userProfile.id)
                .then(cats => {
                    // Only top-level categories of the same type can be parents
                    // Also exclude the category being edited to avoid self-parenting
                    const parents = cats.filter(c =>
                        c.type === type &&
                        c.parentId === null &&
                        c.id !== editingCategory?.id
                    );
                    setAvailableParents(parents);
                })
                .catch(console.error);

            if (editingCategory) {
                setName(editingCategory.name);
                setIcon(editingCategory.icon);
                setType(editingCategory.type);
                setParentId(editingCategory.parentId);
            } else {
                setName('');
                setIcon('🛒');
                setType(initialType);
                setParentId(null);
            }
        }
    }, [isOpen, type, userProfile, editingCategory, initialType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!userProfile) return;
        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        setLoading(true);
        try {
            if (editingCategory) {
                const updatedCategory = await categoryService.updateCategory(editingCategory.id, {
                    name,
                    icon,
                    type,
                    parentId: parentId
                });
                onSuccess(updatedCategory);
            } else {
                const newCategory = await categoryService.createCategory({
                    userId: userProfile.id,
                    name,
                    icon,
                    type,
                    parentId: parentId
                });
                onSuccess(newCategory);
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError(`Error al ${editingCategory ? 'editar' : 'crear'} la categoría`);
        } finally {
            setLoading(false);
        }
    };

    const commonIcons = ['🛒', '🍔', '🚗', '🏠', '💊', '🎓', '✈️', '🎁', '💸', '💼', '💡', '🎮', '🐾', '🏦'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">Tipo</label>
                    <div className="flex p-1 bg-neutral-light/30 rounded-xl">
                        {(['EXPENSE', 'INCOME'] as const).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === t
                                    ? 'bg-white text-neutral-darker shadow-sm'
                                    : 'text-neutral hover:text-neutral-dark'
                                    }`}
                            >
                                {t === 'EXPENSE' ? 'Gasto' : 'Ingreso'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Parent Category Selector */}
                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">
                        Categoría Padre <span className="text-neutral font-normal">(Opcional)</span>
                    </label>
                    <select
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                    >
                        <option value="">Ninguna (Categoría Principal)</option>
                        {availableParents.map(parent => (
                            <option key={parent.id} value={parent.id}>
                                {parent.icon} {parent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">Icono</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {commonIcons.map(ic => (
                            <button
                                key={ic}
                                type="button"
                                onClick={() => setIcon(ic)}
                                className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-xl transition-all ml-1 mt-1 ${icon === ic
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                                    : 'bg-white border border-neutral-light hover:bg-neutral-light'
                                    }`}
                            >
                                {ic}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-darker mb-2">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Supermercado"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-light bg-white text-neutral-darker font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        autoFocus
                    />
                </div>

                {error && (
                    <div className="p-3 bg-error/10 text-error text-sm rounded-lg text-center animate-shake">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {loading ? (editingCategory ? 'Guardando...' : 'Creando...') : (editingCategory ? 'Guardar Cambios' : 'Crear Categoría')}
                </button>
            </form>
        </Modal>
    );
}
