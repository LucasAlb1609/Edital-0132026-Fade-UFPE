import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Eventos } from './pages/Eventos';
import { Participantes } from './pages/Participantes';
import { ConfiguracaoCheckin } from './pages/ConfiguracaoCheckin';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<Login />} />

            {/* O ProtectedRoute bloqueia todas as rotas abaixo para não autenticados */}
            <Route element={<ProtectedRoute />}>
              {/* O MainLayout envolve as páginas com a Sidebar e Header */}
              <Route element={<MainLayout />}>
                {/* Redirecionamento da raiz genérica */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Páginas Protegidas */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/participantes" element={<Participantes />} />

                {/* Rota Protegida com Parâmetro Dinâmico (:id) */}
                <Route path="/eventos/:id/checkin" element={<ConfiguracaoCheckin />} />
              </Route>
            </Route>

            {/* Rota coringa: URL não existente vai pro Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
