import type { CheckInRule } from '../types';

export const hasConflicts = (rulesToCheck: CheckInRule[]): boolean => {
  const ativasEObrigatorias = rulesToCheck.filter((r) => r.isActive && r.isMandatory);
  if (ativasEObrigatorias.length < 2) return false;

  for (let i = 0; i < ativasEObrigatorias.length; i++) {
    for (let j = i + 1; j < ativasEObrigatorias.length; j++) {
      const r1 = ativasEObrigatorias[i];
      const r2 = ativasEObrigatorias[j];

      const overlapStart = Math.max(-r1.minutesBefore, -r2.minutesBefore);
      const overlapEnd = Math.min(r1.minutesAfter, r2.minutesAfter);

      if (overlapStart > overlapEnd) return true;
    }
  }
  return false;
};

export const hasAtLeastOneActive = (rulesToCheck: CheckInRule[]): boolean => {
  return rulesToCheck.some((r) => r.isActive);
};
