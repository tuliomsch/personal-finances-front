import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignInView } from './pages/SignInView';
import { SignUpView } from './pages/SignUpView';
import { DashboardView } from './pages/DashboardView';
import { NotFoundView } from './pages/NotFoundView';
import { CompleteProfileView } from './pages/CompleteProfileView';
import { MainLayout } from './components/MainLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/sign-in" element={<SignInView />} />
          <Route path="/sign-up" element={<SignUpView />} />

          {/* Ruta para completar perfil (accesible después de Supabase signup, antes de crear perfil en DB) */}
          <Route element={<MainLayout />}>
            <Route path="/complete-profile" element={<CompleteProfileView />} />
          </Route>


          {/* Rutas Protegidas (requieren usuario en Supabase Y en nuestra DB) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/transactions" element={<div>Transacciones</div>} />
              {/* Cualquier otra ruta que necesite el perfil completo */}
            </Route>
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
