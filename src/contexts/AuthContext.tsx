import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import type { User } from '../types';

// Interface com os dados exportados pelo contexto de autenticação
interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Cria o contexto global de autenticação
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Componente provedor que envolve a aplicação para gerenciar o estado de acesso
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();

  // Estado do usuário com inicialização preguiçosa (lê o localStorage apenas uma vez)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@EventosApp:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Estado do token com inicialização preguiçosa
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@EventosApp:token');
  });

  // Valida credenciais na API simulada e salva a sessão
  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);

      setUser(response.user);
      setToken(response.token);

      // Salva os dados no navegador para manter a sessão ativa após reload
      localStorage.setItem('@EventosApp:token', response.token);
      localStorage.setItem('@EventosApp:user', JSON.stringify(response.user));

      addToast('Sessão iniciada com sucesso!', 'success');
    } catch (error) {
      const authError = error as Error;
      addToast(authError.message || 'Erro ao iniciar sessão', 'error');
      throw authError;
    }
  };

  // Limpa os dados do estado e do navegador para encerrar a sessão
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@EventosApp:token');
    localStorage.removeItem('@EventosApp:user');
    addToast('Sessão terminada.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Desativa o aviso do Fast Refresh do Vite especificamente para esta linha
// eslint-disable-next-line react-refresh/only-export-components
// Hook customizado para acessar o contexto de autenticação de forma direta
export const useAuth = () => useContext(AuthContext);
