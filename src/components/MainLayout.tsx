import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function MainLayout() {
    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-light via-white to-primary-light/30">
            <Navbar />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
