import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isLoading = false,
    variant = 'danger'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-dark/60 backdrop-blur-sm animate-fade-in"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Dialog Content */}
            <div className="relative bg-white rounded-2xl shadow-strong p-6 max-w-sm w-full animate-scale-up">
                <h3 className="text-lg font-bold text-neutral-darker mb-2">{title}</h3>
                <p className="text-neutral mb-6">
                    {description}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-neutral-darker bg-neutral-light hover:bg-neutral-light/80 transition-colors"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-colors ${variant === 'danger'
                                ? 'bg-error hover:bg-error-dark'
                                : 'bg-primary hover:bg-primary-dark'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
