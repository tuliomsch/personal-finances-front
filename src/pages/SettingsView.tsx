import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CategoriesSettings } from '../components/settings/CategoriesSettings';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { PreferencesSettings } from '../components/settings/PreferencesSettings';
import { ChevronIcon } from '../components/icons/ChevronIcon';

export function SettingsView() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tabParam = searchParams.get('tab');
    const validTabs = ['preferences', 'categories', 'profile'];
    const initialTab = validTabs.includes(tabParam || '') ? (tabParam as string) : 'preferences';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (tabParam) {
            if (validTabs.includes(tabParam)) {
                setActiveTab(tabParam);
            } else {
                setActiveTab('preferences');
            }
        }
    }, [tabParam]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        navigate(`/settings?tab=${tab}`);
    };

    return (
        <div className="min-h-screen bg-neutral-light/20 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white rounded-full transition-colors text-neutral-dark"
                    >
                        <ChevronIcon className="w-5 h-5 rotate-90" />
                    </button>
                    <h1 className="text-3xl font-bold text-neutral-darker">Configuración</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        <button
                            onClick={() => handleTabChange('profile')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'profile'
                                ? 'bg-white text-primary shadow-sm border border-neutral-light'
                                : 'text-neutral hover:bg-white/50'
                                }`}
                        >
                            <span>👤</span> Mi Perfil
                        </button>
                        <button
                            onClick={() => handleTabChange('preferences')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'preferences'
                                ? 'bg-white text-primary shadow-sm border border-neutral-light'
                                : 'text-neutral hover:bg-white/50'
                                }`}
                        >
                            <span>⚙️</span> Preferencias
                        </button>
                        <button
                            onClick={() => handleTabChange('categories')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'categories'
                                ? 'bg-white text-primary shadow-sm border border-neutral-light'
                                : 'text-neutral hover:bg-white/50'
                                }`}
                        >
                            <span>🏷️</span> Categorías
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'profile' && <ProfileSettings />}

                        {activeTab === 'preferences' && <PreferencesSettings />}

                        {activeTab === 'categories' && <CategoriesSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
}
