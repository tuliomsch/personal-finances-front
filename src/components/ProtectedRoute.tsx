import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { AxiosError } from 'axios';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const ProtectedRoute = () => {
  const { user, loading: supabaseLoading } = useAuth();
  const { loading: profileLoading, hasProfile, error } = useUserProfile();
  const navigate = useNavigate();

  const loading = supabaseLoading || profileLoading;

  useEffect(() => {
    // Si hay un error que no sea 404, redirigir a sign-in
    if (error && error instanceof AxiosError && error.response?.status !== 404) {
      console.error('Error checking backend user:', error);
      navigate('/sign-in');
      return;
    }

    // Si el usuario de Supabase existe pero no tiene perfil en el backend, redirigir a completar perfil
    if (!loading && user && !hasProfile && (!error || (error instanceof AxiosError && error.response?.status === 404))) {
      navigate('/complete-profile', { state: { user } });
    }
  }, [user, loading, hasProfile, error, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-neutral-dark font-medium animate-pulse">Cargando...</p>
      </div>
    </div>;
  }

  if (!user) { // No Supabase session
    return <Navigate to="/sign-in" replace />;
  }

  // Si hay un error que no sea 404, redirigir a sign-in
  if (error && error instanceof AxiosError && error.response?.status !== 404) {
    return <Navigate to="/sign-in" replace />;
  }

  // Si el usuario no tiene perfil, ya se está redirigiendo en el useEffect
  if (!hasProfile) {
    return <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-neutral-dark font-medium animate-pulse">Cargando...</p>
      </div>
    </div>;
  }

  // Si llegamos aquí, significa:
  // 1. El usuario de Supabase existe
  // 2. El usuario tiene un perfil en el backend (hasProfile === true)
  // 3. No hay errores o el error es 404 (que ya se maneja arriba)
  // Por lo tanto, podemos renderizar las rutas protegidas

  return <Outlet />;
};
