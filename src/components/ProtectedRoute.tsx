import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // Se estiver autenticado, renderiza a rota filha (Outlet). Se não, redireciona.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
