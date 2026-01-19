import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta según tu estructura

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};