import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

export function Navbar() {

    return (
        <header className="bg-light border-b border-gray-200">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="Flou Logo" className="h-20 w-auto" />
                </Link>
                <div className="flex items-center space-x-4">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
