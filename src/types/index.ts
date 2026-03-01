export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Evento {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'Ativo' | 'Encerrado';
}

export interface Participante {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  checkIn: boolean;
}

export interface CheckInRule {
  id: string;
  name: string;
  minutesBefore: number;
  minutesAfter: number;
  isMandatory: boolean;
  isActive: boolean;
}
