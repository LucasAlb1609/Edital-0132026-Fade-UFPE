import type { AuthResponse, Evento, Participante, CheckInRule } from '../types';

// Armazena a lista simulada de eventos na memória
let mockEvents: Evento[] = [
  { id: '1', name: 'Tech Summit 2026', date: '2026-11-15 09:00', location: 'Centro de Convenções', status: 'Ativo' },
  { id: '2', name: 'Workshop de React', date: '2025-10-20 14:00', location: 'Auditório Principal', status: 'Encerrado' },
  { id: '3', name: 'Meetup de Design', date: '2026-12-05 18:30', location: 'Sala 4B', status: 'Ativo' },
  { id: '4', name: 'Conferência de IA', date: '2026-02-10 10:00', location: 'Auditório Sul', status: 'Encerrado' },
];

// Armazena a lista simulada de participantes na memória
let mockParticipants: Participante[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', eventId: '1', eventName: 'Tech Summit 2026', checkIn: true },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', eventId: '1', eventName: 'Tech Summit 2026', checkIn: false },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', eventId: '2', eventName: 'Workshop de React', checkIn: true },
  { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', eventId: '3', eventName: 'Meetup de Design', checkIn: false },
];

// Armazena as regras de check-in vinculadas aos IDs dos eventos
let mockRules: Record<string, CheckInRule[]> = {
  '1': [
    { id: 'r1', name: 'QR Code App', minutesBefore: 60, minutesAfter: 30, isMandatory: true, isActive: true },
    { id: 'r2', name: 'Documento de Identificação', minutesBefore: 120, minutesAfter: 60, isMandatory: false, isActive: true }
  ]
};

// Gera um token JWT dinâmico e simulado utilizando a Web Crypto API
const generateDynamicToken = (userEmail: string): string => {
  const headerObj = { alg: 'HS256', typ: 'JWT' };
  const base64Header = btoa(JSON.stringify(headerObj));

  const currentTime = Date.now();
  const payloadObj = {
    email: userEmail,
    iat: currentTime,
    exp: currentTime + 1000 * 60 * 60 * 24 // Expira em 24h
  };
  const base64Payload = btoa(JSON.stringify(payloadObj));

  // Cria uma hash simulada usando Web Crypto API
  const randomValues = new Uint32Array(4);
  window.crypto.getRandomValues(randomValues);
  const hashString = Array.from(randomValues, dec => dec.toString(16).padStart(8, '0')).join('');
  
  const base64Signature = btoa(hashString);

  return `${base64Header}.${base64Payload}.${base64Signature}`;
};

export const api = {
  // Simula o processo de autenticação de um usuário
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@eventos.pt' && password === '123456') {
          const dynamicToken = generateDynamicToken(email);
          
          resolve({
            user: { id: '1', name: 'Organizador Principal', email: 'admin@eventos.pt' },
            token: dynamicToken
          });
        } else {
          reject(new Error('Credenciais inválidas. Tente admin@eventos.pt e senha 123456.'));
        }
      }, 1500);
    });
  },
  
  // Retorna a lista completa de eventos
  getEventos: async (): Promise<Evento[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockEvents]), 800));
  },
  
  // Cria um novo evento ou atualiza um existente
  salvarEvento: async (evento: Evento): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!evento.id) {
          mockEvents.push({ ...evento, id: Date.now().toString() });
        } else {
          const index = mockEvents.findIndex(e => e.id === evento.id);
          if (index > -1) mockEvents[index] = evento;
        }
        resolve();
      }, 600);
    });
  },
  
  // Remove um evento específico e os seus participantes associados
  excluirEvento: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockEvents = mockEvents.filter(e => e.id !== id);
        mockParticipants = mockParticipants.filter(p => p.eventId !== id);
        resolve();
      }, 600);
    });
  },

  // Retorna a lista completa de participantes
  getParticipantes: async (): Promise<Participante[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockParticipants]), 800));
  },
  
  // Cria um novo participante ou atualiza um existente
  salvarParticipante: async (participante: Participante): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const linkedEvent = mockEvents.find(e => e.id === participante.eventId);
        const participantToSave = {
          ...participante,
          eventName: linkedEvent ? linkedEvent.name : 'Desconhecido'
        };

        if (!participantToSave.id) {
          mockParticipants.push({ ...participantToSave, id: Date.now().toString() });
        } else {
          const index = mockParticipants.findIndex(p => p.id === participantToSave.id);
          if (index > -1) mockParticipants[index] = participantToSave;
        }
        resolve();
      }, 600);
    });
  },
  
  // Remove um participante da base de dados
  excluirParticipante: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockParticipants = mockParticipants.filter(p => p.id !== id);
        resolve();
      }, 600);
    });
  },

  // Retorna as regras de check-in associadas a um evento
  getRegrasCheckin: async (eventId: string): Promise<CheckInRule[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...(mockRules[eventId] || [])]), 600));
  },
  
  // Guarda as definições de regras de check-in para um evento
  salvarRegrasCheckin: async (eventId: string, regras: CheckInRule[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockRules[eventId] = [...regras];
        resolve();
      }, 800);
    });
  }
};