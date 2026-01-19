import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { Link } from 'react-router-dom';

export function Navbar() {
    const { user, signOut } = useAuth();
    const { userProfile } = useUserProfile();

    return (
        <header className="bg-light border-b border-gray-200">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-xl font-bold text-primary">Finanzas</Link>
                <div className="flex items-center space-x-4">
                    {userProfile && (
                        <span className="text-sm text-gray-600 hidden sm:inline">
                            Hola, {userProfile.name} {userProfile.lastName}
                        </span>
                    )}
                    {user && (
                        <button
                            onClick={signOut}
                            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
