// Define o utilizador autenticado no sistema
export interface User {
  id: string; // Identificador único do utilizador
  name: string; // Nome completo
  email: string; // E-mail de acesso
}

// Resposta esperada após um login bem-sucedido
export interface AuthResponse {
  user: User; // Dados do utilizador
  token: string; // Token JWT simulado de acesso
}

// Estrutura de um evento no sistema
export interface Evento {
  id: string; // Identificador único do evento
  name: string; // Nome do evento
  date: string; // Data e hora (ex: YYYY-MM-DD HH:mm)
  location: string; // Local de realização
  status: 'Ativo' | 'Encerrado'; // Estado atual do evento
}

// Estrutura de um participante vinculado a um evento
export interface Participante {
  id: string; // Identificador único do participante
  name: string; // Nome completo
  email: string; // E-mail de contacto
  eventId: string; // ID do evento vinculado
  eventName: string; // Nome do evento (para exibição rápida)
  checkIn: boolean; // Confirmação se o check-in foi realizado
}

// Regras de tempo e obrigatoriedade para o check-in
export interface CheckInRule {
  id: string; // Identificador único da regra
  name: string; // Nome da regra (ex: QR Code)
  minutesBefore: number; // Minutos libertados antes do evento
  minutesAfter: number; // Minutos tolerados após o evento
  isMandatory: boolean; // Define se a regra é obrigatória
  isActive: boolean; // Define se a regra está ativa no momento
}
