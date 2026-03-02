import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Eventos } from '../pages/Eventos';
import { api } from '../services/api';
import { ToastProvider } from '../contexts/ToastContext';

// Mock das funções da API conforme o arquivo api.ts
vi.mock('../services/api', () => ({
  api: {
    getEventos: vi.fn(),
    salvarEvento: vi.fn(),
    excluirEvento: vi.fn(),
  }
}));

// Helper para injetar os provedores necessários (Toast e Router)
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </MemoryRouter>
  );
};

describe('Componente Eventos', () => {
  // Limpa o estado dos mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de eventos e permitir pesquisa', async () => {
    // Dados simulados para o teste
    const mockEvents = [
      { id: '1', name: 'Tech Summit 2026', date: '2026-11-15 09:00', location: 'Centro de Convenções', status: 'Ativo' },
      { id: '2', name: 'Workshop React', date: '2025-10-20 14:00', location: 'Auditório', status: 'Encerrado' },
    ];

    vi.mocked(api.getEventos).mockResolvedValue(mockEvents);

    renderWithProviders(<Eventos />);

    // Verifica se a tabela carrega e exibe o evento
    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
    });

    // Testa o filtro de busca
    const searchInput = screen.getByPlaceholderText(/buscar por nome do evento/i);
    fireEvent.change(searchInput, { target: { value: 'Workshop' } });
    
    // Tech Summit deve sumir e Workshop deve continuar
    expect(screen.queryByText('Tech Summit 2026')).not.toBeInTheDocument();
    expect(screen.getByText('Workshop React')).toBeInTheDocument();
  });

  it('deve abrir o modal e cadastrar um novo evento com sucesso', async () => {
    vi.mocked(api.getEventos).mockResolvedValue([]);
    vi.mocked(api.salvarEvento).mockResolvedValue(undefined);

    renderWithProviders(<Eventos />);

    // Clica no botão para abrir o modal
    fireEvent.click(screen.getByText(/novo evento/i));

    // Preenche os campos usando as labels corretas definidas no componente
    fireEvent.change(screen.getByLabelText(/nome do evento/i), { target: { value: 'Nova Conferência' } });
    
    // NOTA: Inserimos uma data futura (Dezembro/2026) para passar na validação de data no passado
    fireEvent.change(screen.getByLabelText(/^data$/i), { target: { value: '2026-12-31' } });
    fireEvent.change(screen.getByLabelText(/hora/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/local/i), { target: { value: 'Auditório Central' } });
    
    // Submete o formulário clicando em Cadastrar
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    // Valida se a chamada para a API ocorreu
    await waitFor(() => {
      expect(api.salvarEvento).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Nova Conferência',
        date: '2026-12-31 10:00',
        location: 'Auditório Central',
        status: 'Ativo'
      }));
    });
  });
});