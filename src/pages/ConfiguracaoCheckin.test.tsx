import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ConfiguracaoCheckin } from './ConfiguracaoCheckin';
import { ToastProvider } from '../contexts/ToastContext';

// Simula o comportamento do serviço de API para isolar o componente nos testes
vi.mock('../services/api', () => ({
  api: {
    // Retorna uma regra mockada para validar a listagem inicial
    getRegrasCheckin: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Regra QR Code Teste',
        minutesBefore: 60,
        minutesAfter: 30,
        isMandatory: true,
        isActive: true,
      },
    ]),
    // Simula sucesso ao persistir as regras na API
    salvarRegrasCheckin: vi.fn().mockResolvedValue(undefined),
  },
}));

/**
 * Injeta os contextos necessários e simula a rota com o parâmetro ID.
 * Essencial para componentes que dependem de useParams ou context providers.
 */
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/eventos/1/checkin']}>
        <Routes>
          <Route path="/eventos/:id/checkin" element={ui} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
};

// Suíte de testes para a funcionalidade de gestão de regras de check-in
describe('Componente React: ConfiguracaoCheckin', () => {
  // Utiliza findByText para lidar com o estado assíncrono de carregamento (Loader/API)
  it('deve renderizar o título principal após carregar os dados', async () => {
    renderWithProviders(<ConfiguracaoCheckin />);

    // findByText aguarda assincronamente até que o estado isLoading seja falso
    const title = await screen.findByText('Regras de Check-in');
    expect(title).toBeInTheDocument();

    // Confirma se o botão de adicionar está disponível na interface carregada
    expect(screen.getByRole('button', { name: /Nova Regra/i })).toBeInTheDocument();
  });

  // Valida se os dados vindos do mock da API são exibidos corretamente na listagem
  it('deve carregar e exibir as regras configuradas na listagem', async () => {
    renderWithProviders(<ConfiguracaoCheckin />);

    // Aguarda a renderização do nome da regra presente no objeto mockado acima
    expect(await screen.findByText('Regra QR Code Teste')).toBeInTheDocument();

    // Verifica se os detalhes matemáticos da regra aparecem formatados
    expect(screen.getByText(/60 min/)).toBeInTheDocument();
  });

  // Testa a abertura do modal e se os campos estão acessíveis via labels (a11y)
  it('deve abrir o modal de configuração ao clicar em Nova Regra', async () => {
    renderWithProviders(<ConfiguracaoCheckin />);

    // Localiza e clica no botão após a interface estar pronta e estável
    const addButton = await screen.findByRole('button', { name: /Nova Regra/i });
    fireEvent.click(addButton);

    // Confirma se o modal de cadastro apareceu no DOM
    expect(await screen.findByText('Configurar Regra', { selector: 'h3' })).toBeInTheDocument();

    // Valida se os campos de input estão devidamente vinculados às suas labels
    // Isso garante acessibilidade e permite que o teste encontre os elementos corretamente
    expect(screen.getByLabelText(/Nome da Regra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Liberar check-in/i)).toBeInTheDocument();
  });
});
