import { useState, useEffect } from 'react';
import { categoryService, type Category } from '../../services/categoryService';
import { useUserProfile } from '../../hooks/useUserProfile';
import { CreateCategoryModal } from '../CreateCategoryModal';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function CategoriesSettings() {
    const { userProfile } = useUserProfile();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadCategories = () => {
        if (!userProfile?.id) return;
        setLoading(true);
        categoryService.getCategories(userProfile.id)
            .then(data => setCategories(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCategories();
    }, [userProfile]);

    const handleDelete = async () => {
        if (!deleteConfirmId) return;

        setIsDeleting(true);
        try {
            await categoryService.deleteCategory(deleteConfirmId);
            loadCategories();
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Hubo un error al eliminar la categoría.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsCreateModalOpen(true);
    };

    const handleModalClose = () => {
        setIsCreateModalOpen(false);
        setEditingCategory(null);
    };

    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

    const renderCategoryItem = (cat: Category) => (
        <div key={cat.id} className="p-3 bg-neutral-light/20 rounded-xl border border-transparent hover:border-neutral-light transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <span className="text-xl bg-white w-10 h-10 flex items-center justify-center rounded-lg shadow-sm">{cat.icon}</span>
                <div>
                    <span className="font-medium text-neutral-darker block">{cat.name}</span>
                    {cat.subCategories && cat.subCategories.length > 0 && (
                        <span className="text-[10px] text-neutral-dark font-bold uppercase tracking-wider">
                            {cat.subCategories.length} Subcategorías
                        </span>
                    )}
                </div>
            </div>

            {cat.userId !== null && (
                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 hover:bg-white rounded-lg text-neutral hover:text-primary transition-all"
                        title="Editar"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className="p-2 hover:bg-white rounded-lg text-neutral hover:text-error transition-all"
                        title="Eliminar"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-neutral-darker">Categorías</h2>
                    <p className="text-neutral text-sm">Gestiona tus categorías de gastos e ingresos</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setIsCreateModalOpen(true); }}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 text-sm flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Nueva Categoría
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gastos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-light">
                    <h3 className="text-lg font-bold text-neutral-darker mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                        Gastos
                    </h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="p-3 bg-neutral-light/50 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-light rounded-lg"></div>
                                            <div className="h-4 w-24 bg-neutral-light rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {expenseCategories.map(cat => (
                                    <div key={cat.id} className="space-y-2">
                                        {renderCategoryItem(cat)}
                                        {cat.subCategories && cat.subCategories.length > 0 && (
                                            <div className="pl-12 space-y-1">
                                                {cat.subCategories.map(sub => renderCategoryItem(sub))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {expenseCategories.length === 0 && (
                                    <p className="text-neutral text-sm text-center py-4">No hay categorías de gastos</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Ingresos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-light">
                    <h3 className="text-lg font-bold text-neutral-darker mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        Ingresos
                    </h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2].map(i => (
                                    <div key={i} className="p-3 bg-neutral-light/50 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-light rounded-lg"></div>
                                            <div className="h-4 w-24 bg-neutral-light rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {incomeCategories.map(cat => (
                                    <div key={cat.id} className="space-y-2">
                                        {renderCategoryItem(cat)}
                                        {cat.subCategories && cat.subCategories.length > 0 && (
                                            <div className="pl-12 space-y-1">
                                                {cat.subCategories.map(sub => renderCategoryItem(sub))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {incomeCategories.length === 0 && (
                                    <p className="text-neutral text-sm text-center py-4">No hay categorías de ingresos</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={handleModalClose}
                onSuccess={loadCategories}
                editingCategory={editingCategory}
            />

            <ConfirmDialog
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleDelete}
                title="Eliminar categoría"
                description="¿Estás seguro de que quieres eliminar esta categoría? Esto podría afectar a transacciones existentes."
                confirmLabel="Eliminar"
                isLoading={isDeleting}
            />
        </div>
    );
}
