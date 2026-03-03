import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { ToastProvider } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

// Mock do hook useNavigate do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do módulo AuthContext para podermos controlar o retorno do hook useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Cria uma função falsa (mock) para o login
const mockLogin = vi.fn();

// Utilitário para renderizar o componente com os provedores de Toast e Router
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ToastProvider>
  );
};

describe('Componente Login', () => {
  // Limpa o histórico de chamadas e redefine o mock antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Define o retorno padrão simulado para o useAuth
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any); 
  });

  it('deve renderizar o formulário de login corretamente', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole('heading', { name: /painel do organizador/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/palavra-passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar no painel/i })).toBeInTheDocument();
  });

  it('deve chamar a função de login e redirecionar em caso de sucesso', async () => {
    // Configura o mock do login para resolver com sucesso
    mockLogin.mockResolvedValueOnce(undefined);
    
    renderWithProviders(<Login />);

    // Simula a entrada do usuário
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'admin@eventos.pt' } });
    fireEvent.change(screen.getByLabelText(/palavra-passe/i), { target: { value: '123456' } });
    
    // Dispara a submissão
    fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

    await waitFor(() => {
      // Verifica se a função foi chamada com as credenciais inseridas
      expect(mockLogin).toHaveBeenCalledWith('admin@eventos.pt', '123456');
      // Verifica se a navegação foi acionada para o dashboard
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir mensagem de erro ao inserir credenciais inválidas', async () => {
    // Configura o mock do login para rejeitar (simulando erro na API)
    mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas.'));
    
    renderWithProviders(<Login />);

    // Simula credenciais incorretas
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'errado@eventos.pt' } });
    fireEvent.change(screen.getByLabelText(/palavra-passe/i), { target: { value: 'senhaerrada' } });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

    await waitFor(() => {
      // Verifica se o login foi tentado
      expect(mockLogin).toHaveBeenCalled();
      // O redirecionamento NÃO deve acontecer
      expect(mockNavigate).not.toHaveBeenCalled();
      // O Toast de erro deve estar visível na tela
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});