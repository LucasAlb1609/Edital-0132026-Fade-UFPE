import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

// Simula o serviço de API para fornecer dados controlados ao Dashboard
vi.mock('../services/api', () => ({
  api: {
    // Retorna dois eventos simulados para o teste para validar as estatísticas
    getEventos: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Evento Alpha',
        date: '2026-05-10 10:00',
        location: 'Auditório A',
        status: 'Ativo',
      },
      {
        id: '2',
        name: 'Evento Beta',
        date: '2026-06-15 14:00',
        location: 'Sala 10',
        status: 'Ativo',
      },
    ]),
    // Retorna três participantes simulados para o teste
    getParticipantes: vi.fn().mockResolvedValue([
      { id: 'p1', name: 'User 1' },
      { id: 'p2', name: 'User 2' },
      { id: 'p3', name: 'User 3' },
    ]),
  },
}));

/**
 * Utilitário para renderizar o componente dentro do contexto de rotas.
 * Essencial pois o Dashboard utiliza navegação e links internos.
 */
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Agrupa os testes de interface e comportamento do Dashboard
describe('Componente React: Dashboard', () => {
  // Verifica se a estrutura base e o título aparecem após o carregamento inicial
  it('deve renderizar o título principal e a estrutura de visão geral', async () => {
    renderWithRouter(<Dashboard />);

    // Utilizamos findByText para aguardar que o estado de "Loading" termine
    const title = await screen.findByText(/Visão Geral/i);
    expect(title).toBeInTheDocument();

    // Verifica se os rótulos informativos dos cards estão presentes
    expect(screen.getByText(/Total de Eventos/i)).toBeInTheDocument();
    expect(screen.getByText(/Total de Participantes/i)).toBeInTheDocument();
  });

  // Valida a exibição correta dos dados processados vindos da API simulada
  it('deve exibir as contagens e a lista de próximos eventos vindos da API', async () => {
    renderWithRouter(<Dashboard />);

    // Aguarda a renderização do número '2' (Total de eventos no mock)
    expect(await screen.findByText('2')).toBeInTheDocument();

    // Aguarda a renderização do número '3' (Total de participantes no mock)
    expect(await screen.findByText('3')).toBeInTheDocument();

    // Confirma se o nome do primeiro evento aparece na lista de "Próximos Eventos"
    expect(screen.getByText(/Evento Alpha/i)).toBeInTheDocument();
  });
});
