import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import type { User } from '../types';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();

  // Lazy Initialization: Lê o localStorage diretamente na criação do estado.
  // Isso resolve o erro do useEffect e melhora a performance (remove renderizações em cascata).
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@EventosApp:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@EventosApp:token');
  });

  const login = async (email: string, pass: string) => {
    try {
      const response = await api.login(email, pass);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('@EventosApp:token', response.token);
      localStorage.setItem('@EventosApp:user', JSON.stringify(response.user));
      addToast('Sessão iniciada com sucesso!', 'success');
    } catch (error) {
      // Resolve o erro de tipagem "any" convertendo para o tipo nativo "Error"
      const err = error as Error;
      addToast(err.message || 'Erro ao iniciar sessão', 'error');
      throw error;
    }
  };

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
export const useAuth = () => useContext(AuthContext);
