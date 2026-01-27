import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { QuickActions } from './dashboard/QuickActions';

export function MainLayout() {
    const location = useLocation();

    const handleTransactionCreated = () => {
        // Dispatch custom event to notify other components to refresh data
        window.dispatchEvent(new Event('transaction-created'));
    };

    const isCompleteProfile = location.pathname === '/complete-profile';

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-light via-white to-primary-light/30 relative">
            <Navbar />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 pb-24">
                <Outlet />
            </main>
            {!isCompleteProfile && <QuickActions onTransactionCreated={handleTransactionCreated} />}
        </div>
    );
}
