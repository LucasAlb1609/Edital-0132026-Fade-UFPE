import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Participantes } from '../pages/Participantes';
import { api } from '../services/api'; 
import { ToastProvider } from '../contexts/ToastContext';

// Mock das funções da API em conformidade com o api.ts
vi.mock('../services/api', () => ({
  api: {
    getParticipantes: vi.fn(),
    getEventos: vi.fn(),
    salvarParticipante: vi.fn(),
    excluirParticipante: vi.fn(),
  }
}));

// Helper para injetar os provedores de contexto necessários
const renderWithProviders = (ui) => {
  return render(
    <ToastProvider>
      {ui}
    </ToastProvider>
  );
};

describe('Componente Participantes', () => {
  // Limpa o histórico de chamadas dos mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista e permitir busca por nome', async () => {
    const mockParts = [{ id: '1', name: 'John Doe', email: 'john@test.com', eventId: '101', eventName: 'Evento A', checkIn: false }];
    const mockEvts = [{ id: '101', name: 'Evento A' }];

    vi.mocked(api.getParticipantes).mockResolvedValue(mockParts);
    vi.mocked(api.getEventos).mockResolvedValue(mockEvts);

    renderWithProviders(<Participantes />);

    // Aguarda a promessa resolver e o componente sair do estado de Loading
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Realiza a busca
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou e-mail/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('deve abrir o modal e cadastrar um novo participante', async () => {
    vi.mocked(api.getParticipantes).mockResolvedValue([]);
    vi.mocked(api.getEventos).mockResolvedValue([{ id: '101', name: 'Evento Teste' }]);
    vi.mocked(api.salvarParticipante).mockResolvedValue(undefined);

    renderWithProviders(<Participantes />);

    // CORREÇÃO: Aguarda o carregamento inicial sumir para que o select seja populado
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Abre o formulário
    fireEvent.click(screen.getByText(/novo participante/i));

    // Preenche os campos de input do usuário
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'jane@io.com' } });
    fireEvent.change(screen.getByLabelText(/vincular ao evento/i), { target: { value: '101' } });
    
    // Submete o formulário
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    // Valida se a chamada para a API ocorreu
    await waitFor(() => {
      expect(api.salvarParticipante).toHaveBeenCalledTimes(1);
    });
  });
});