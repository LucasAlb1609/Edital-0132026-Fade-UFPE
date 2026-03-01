import type { AuthResponse, Evento, Participante, CheckInRule } from '../types';

let mockEventos: Evento[] = [
  {
    id: '1',
    name: 'Tech Summit 2024',
    date: '2024-11-15 09:00',
    location: 'Centro de Convenções',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Workshop de React',
    date: '2024-10-20 14:00',
    location: 'Auditório Principal',
    status: 'Encerrado',
  },
  {
    id: '3',
    name: 'Meetup de Design',
    date: '2024-12-05 18:30',
    location: 'Sala 4B',
    status: 'Ativo',
  },
];

let mockParticipantes: Participante[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    eventId: '1',
    eventName: 'Tech Summit 2024',
    checkIn: true,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    eventId: '1',
    eventName: 'Tech Summit 2024',
    checkIn: false,
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    eventId: '2',
    eventName: 'Workshop de React',
    checkIn: true,
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    eventId: '3',
    eventName: 'Meetup de Design',
    checkIn: false,
  },
];

const mockRegras: Record<string, CheckInRule[]> = {
  '1': [
    {
      id: 'r1',
      name: 'QR Code App',
      minutesBefore: 60,
      minutesAfter: 30,
      isMandatory: true,
      isActive: true,
    },
    {
      id: 'r2',
      name: 'Documento de Identificação',
      minutesBefore: 120,
      minutesAfter: 60,
      isMandatory: false,
      isActive: true,
    },
  ],
};

export const api = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@eventos.pt' && password === '123456') {
          resolve({
            user: { id: '1', name: 'Organizador Principal', email: 'admin@eventos.pt' },
            token: 'mock_jwt_token_header.payload.signature',
          });
        } else {
          reject(new Error('Credenciais inválidas. Tente admin@eventos.pt e senha 123456.'));
        }
      }, 1500);
    });
  },
  getEventos: async (): Promise<Evento[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockEventos]), 800));
  },
  salvarEvento: async (evento: Evento): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!evento.id) mockEventos.push({ ...evento, id: Date.now().toString() });
        else {
          const index = mockEventos.findIndex((e) => e.id === evento.id);
          if (index > -1) mockEventos[index] = evento;
        }
        resolve();
      }, 600);
    });
  },
  excluirEvento: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockEventos = mockEventos.filter((e) => e.id !== id);
        mockParticipantes = mockParticipantes.filter((p) => p.eventId !== id);
        resolve();
      }, 600);
    });
  },
  getParticipantes: async (): Promise<Participante[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockParticipantes]), 800));
  },
  salvarParticipante: async (participante: Participante): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventoRelacionado = mockEventos.find((e) => e.id === participante.eventId);
        const participanteParaSalvar = {
          ...participante,
          eventName: eventoRelacionado ? eventoRelacionado.name : 'Desconhecido',
        };
        if (!participanteParaSalvar.id)
          mockParticipantes.push({ ...participanteParaSalvar, id: Date.now().toString() });
        else {
          const index = mockParticipantes.findIndex((p) => p.id === participanteParaSalvar.id);
          if (index > -1) mockParticipantes[index] = participanteParaSalvar;
        }
        resolve();
      }, 600);
    });
  },
  excluirParticipante: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockParticipantes = mockParticipantes.filter((p) => p.id !== id);
        resolve();
      }, 600);
    });
  },
  getRegrasCheckin: async (eventId: string): Promise<CheckInRule[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...(mockRegras[eventId] || [])]), 600)
    );
  },
  salvarRegrasCheckin: async (eventId: string, regras: CheckInRule[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockRegras[eventId] = [...regras];
        resolve();
      }, 800);
    });
  },
};
