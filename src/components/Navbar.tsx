import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

export function Navbar() {

    return (
        <header className="bg-light border-b border-gray-200">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-xl font-bold text-primary">Finanzas</Link>
                <div className="flex items-center space-x-4">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
