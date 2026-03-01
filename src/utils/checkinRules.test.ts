import { describe, it, expect } from 'vitest';
import { hasConflicts, hasAtLeastOneActive } from './checkinRules';
import type { CheckInRule } from '../types';

describe('Validações de Regras de Check-in', () => {
  it('deve retornar false se houver menos de duas regras obrigatórias ativas', () => {
    const regras: CheckInRule[] = [
      {
        id: '1',
        name: 'Regra 1',
        minutesBefore: 60,
        minutesAfter: 30,
        isMandatory: true,
        isActive: true,
      },
      {
        id: '2',
        name: 'Regra 2',
        minutesBefore: 60,
        minutesAfter: 30,
        isMandatory: false,
        isActive: true,
      },
    ];
    expect(hasConflicts(regras)).toBe(false);
  });

  it('deve retornar true se houver conflito de horários entre regras obrigatórias', () => {
    const regrasConflitantes: CheckInRule[] = [
      // Exige check-in 60 a 30 min antes
      {
        id: '1',
        name: 'Regra 1',
        minutesBefore: 60,
        minutesAfter: -30,
        isMandatory: true,
        isActive: true,
      },
      // Exige check-in exatamente no horário (0 a 10 min depois)
      {
        id: '2',
        name: 'Regra 2',
        minutesBefore: 0,
        minutesAfter: 10,
        isMandatory: true,
        isActive: true,
      },
    ];
    // Como não se cruzam, é impossível cumprir ambas: logo, HÁ conflito
    expect(hasConflicts(regrasConflitantes)).toBe(true);
  });

  it('deve verificar se há pelo menos uma regra ativa', () => {
    const inativas: CheckInRule[] = [
      {
        id: '1',
        name: 'R1',
        minutesBefore: 0,
        minutesAfter: 0,
        isMandatory: false,
        isActive: false,
      },
    ];
    expect(hasAtLeastOneActive(inativas)).toBe(false);
  });
});
