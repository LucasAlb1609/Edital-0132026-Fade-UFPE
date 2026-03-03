import type { CheckInRule } from '../types';

// Verifica se há conflito de horários entre regras obrigatórias
export const hasConflicts = (rulesToCheck: CheckInRule[]): boolean => {
  // Filtra apenas as regras que estão ativas e são obrigatórias
  const activeAndMandatoryRules = rulesToCheck.filter((rule) => rule.isActive && rule.isMandatory);

  // Se houver menos de duas regras obrigatórias, não há conflito possível
  if (activeAndMandatoryRules.length < 2) return false;

  // Compara todas as regras obrigatórias entre si
  for (let i = 0; i < activeAndMandatoryRules.length; i++) {
    for (let j = i + 1; j < activeAndMandatoryRules.length; j++) {
      const firstRule = activeAndMandatoryRules[i];
      const secondRule = activeAndMandatoryRules[j];

      // Calcula a interseção dos tempos (negativo para 'antes', positivo para 'depois')
      const overlapStart = Math.max(-firstRule.minutesBefore, -secondRule.minutesBefore);
      const overlapEnd = Math.min(firstRule.minutesAfter, secondRule.minutesAfter);

      // Se o início da interseção for maior que o fim, as janelas não se cruzam (há conflito)
      if (overlapStart > overlapEnd) return true;
    }
  }

  return false;
};

// Verifica se existe pelo menos uma regra ativa na lista
export const hasAtLeastOneActive = (rulesToCheck: CheckInRule[]): boolean => {
  return rulesToCheck.some((rule) => rule.isActive);
};
