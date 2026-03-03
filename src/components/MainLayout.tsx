import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Componente de layout principal com barra de navegação lateral
export const MainLayout = () => {
  // Obtém os dados do usuário e a função de logout do contexto de autenticação
  const { user, logout } = useAuth();

  // Hooks de roteamento para navegar e verificar a URL atual
  const navigate = useNavigate();
  const location = useLocation();

  // Estado que controla a visibilidade do menu em telas móveis
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define os itens do menu de navegação lateral
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Eventos', path: '/eventos', icon: Calendar },
    { name: 'Participantes', path: '/participantes', icon: Users },
  ];

  // Redireciona o usuário e fecha o menu móvel automaticamente
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Barra lateral para desktop (oculta em telas pequenas) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Calendar className="text-blue-600 mr-2" size={24} />
          <span className="text-lg font-bold text-gray-900">EventosPro</span>
        </div>

        {/* Renderiza os links de navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            // Destaca o botão se a URL atual começar com o caminho do item
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Rodapé com informações do usuário e botão de logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate w-32">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Menu sobreposto para dispositivos móveis */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Fundo escuro clicável para fechar o menu */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <Calendar className="text-blue-600 mr-2" size={24} />
              <span className="text-lg font-bold text-gray-900">EventosPro</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Área de conteúdo principal da aplicação */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho superior (visível apenas em dispositivos móveis) */}
        <header className="bg-white shadow-sm md:hidden h-16 flex items-center justify-between px-4 z-10">
          <div className="flex items-center">
            <Calendar className="text-blue-600 mr-2" size={24} />
            <span className="text-lg font-bold text-gray-900">EventosPro</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Container das rotas filhas */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* O Outlet injeta dinamicamente o ecrã atual (Dashboard, Eventos, etc) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
