import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { ChevronIcon } from './icons/ChevronIcon';

export function UserMenu() {
    const { signOut } = useAuth();
    const { userProfile } = useUserProfile();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string, lastName: string) => {
        return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!userProfile) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-neutral-light transition-colors group focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                    {getInitials(userProfile.name, userProfile.lastName)}
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-neutral-darker hidden sm:block group-hover:text-primary transition-colors">
                    {userProfile.name}
                </span>

                {/* Chevorn */}
                <ChevronIcon
                    className={`w-4 h-4 text-neutral transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-neutral-light py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-neutral-light/50 mb-1">
                        <p className="text-sm font-bold text-neutral-darker truncate">{userProfile.name} {userProfile.lastName}</p>
                        <p className="text-xs text-neutral truncate">{userProfile.email}</p>
                    </div>

                    <div className="space-y-1 px-1">
                        <Link
                            to="/settings?tab=profile"
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-darker hover:bg-neutral-light rounded-lg transition-colors w-full text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Mi Perfil</span>
                        </Link>

                        <Link
                            to="/settings?tab=preferences"
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-darker hover:bg-neutral-light rounded-lg transition-colors w-full text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Preferencias</span>
                        </Link>

                        <Link
                            to="/settings?tab=categories"
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-darker hover:bg-neutral-light rounded-lg transition-colors w-full text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Categorías</span>
                        </Link>
                    </div>

                    <div className="mt-1 pt-1 border-t border-neutral-light/50 px-1">
                        <button
                            onClick={signOut}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left font-medium"
                        >
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
