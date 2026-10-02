/**
 * Métricas y feedback del ritual.
 * Extraído de App.tsx como parte de la división del monolito.
 *
 * Todos los helpers son funciones puras: reciben datos, devuelven resultado.
 * Sin dependencias de estado. 100% testeables.
 */

import type { HatsData, LadderData } from '../types/ritual';

type Tab = 'hats' | 'ladder' | 'trainer' | 'chat';

// ─── Métricas de progreso ─────────────────────────────────────
export function getInteractiveMetrics(
  activeTab: Tab,
  hatsData: HatsData,
  ladderData: LadderData,
): Record<string, number> {
  if (activeTab === 'hats') {
    const o = Math.min(100, Math.round((hatsData.blanco.trim().length / 120) * 100));
    const e = Math.min(100, Math.round((hatsData.rojo.trim().length / 100) * 100));
    const r = Math.min(100, Math.round((hatsData.negro.trim().length / 100) * 100));
    const g = Math.min(100, Math.round((hatsData.amarillo.trim().length / 100) * 100));
    const c = Math.min(100, Math.round((hatsData.verde.trim().length / 120) * 100));
    const a = Math.min(100, Math.round((hatsData.azul.trim().length / 80) * 100));
    return { blanco: o, rojo: e, negro: r, amarillo: g, verde: c, azul: a };
  }
  const i = Math.min(100, Math.round((ladderData.instinto.trim().length / 80) * 100));
  const em = Math.min(100, Math.round((ladderData.emocion.trim().length / 80) * 100));
  const ju = Math.min(100, Math.round((ladderData.jugada.trim().length / 50) * 100));
  const po = Math.min(100, Math.round((ladderData.posicion.trim().length / 80) * 100));
  const ej = Math.min(100, Math.round((ladderData.ejecucion.trim().length / 100) * 100));
  const bi = Math.min(100, Math.round((ladderData.bitacora.trim().length / 80) * 100));
  const inm = Math.min(100, Math.round((ladderData.inmunidad.trim().length / 60) * 100));
  return { instinto: i, emocion: em, jugada: ju, posicion: po, ejecucion: ej, bitacora: bi, inmunidad: inm };
}

// ─── Booleanos puros ────────────────────────────────────────────
export const isHatsVerdeStrong = (h: HatsData): boolean => h.verde.trim().length >= 10;
export const isHatsAzulStrong = (h: HatsData): boolean => h.azul.trim().length >= 15;
export const isHatsNegroHeavier = (h: HatsData): boolean =>
  h.negro.trim().length > h.amarillo.trim().length;

export const isLadderEjecucionStrong = (l: LadderData): boolean =>
  l.ejecucion.trim().length >= 15;
export const isLadderInmunidadStrong = (l: LadderData): boolean =>
  l.inmunidad.trim().length >= 15;
export const isLadderPassive = (l: LadderData): boolean =>
  l.posicion.toLowerCase().includes('víctima') ||
  l.posicion.toLowerCase().includes('sumiso') ||
  l.posicion.toLowerCase().includes('niño') ||
  l.posicion.toLowerCase().includes('justific');

// ─── Feedback de sombreros ─────────────────────────────────────
export function getHatsVerdeFeedback(h: HatsData): string {
  return isHatsVerdeStrong(h)
    ? '✓ Módulo creativo activo. Tu mente ha generado alternativas viables fuera del marco común.'
    : '⚠️ MÓDULO CREATIVO DÉBIL: Tu sombrero verde está vacío. Arriésgate a proponer soluciones más alocadas o bizarras.';
}

export function getHatsAzulFeedback(h: HatsData): string {
  return isHatsAzulStrong(h)
    ? '✓ Comando ejecutivo robusto. El paso 7 es concreto, medible e irreversible.'
    : '⚠️ PARÁLISIS OPERATIVA: El comando de acción azul es demasiado abstracto o tímido. Necesita un gatillo que duela o libere esta semana.';
}

export function getHatsCoherenceFeedback(h: HatsData): string {
  const negroLen = h.negro.trim().length;
  const amarilloLen = h.amarillo.trim().length;
  if (negroLen > amarilloLen) {
    return '⚠️ HEGEMONÍA DEL TEMOR (Negro > Amarillo): Las advertencias y el miedo eclipsan las oportunidades. Riesgo de inacción.';
  } else if (negroLen === 0 && amarilloLen === 0) {
    return '• Balanza de viabilidad pendiente: Completa riesgos (Negro) y oportunidades (Amarillo).';
  }
  return '✓ BALANCE DE PODER POSITIVO: Tus oportunidades superan tus miedos estratégicos. El camino está desbloqueado.';
}

// ─── Feedback de escalera ──────────────────────────────────────
export function getLadderEjecucionFeedback(l: LadderData): string {
  return isLadderEjecucionStrong(l)
    ? '✓ Contraataque táctico maduro. Planteas un desarme sin enojo ni sumisión.'
    : '⚠️ RESPUESTA REACCIONARIA: Tu ejecución táctica es demasiado corta. Riesgo de estallar en ira o dar explicaciones inútiles.';
}

export function getLadderInmunidadFeedback(l: LadderData): string {
  return isLadderInmunidadStrong(l)
    ? '✓ Blindaje de nivel 7 robusto. Tu creencia erradica la vulnerabilidad visceral.'
    : '⚠️ VULNERABILIDAD PERSISTENTE: No has blindado tu sistema operativo mental. El dardo volverá a dañarte.';
}

export function getLadderCoherenceFeedback(l: LadderData): string {
  if (isLadderPassive(l)) {
    return '⚠️ DETECTADO ANCLAJE SUMISO: Estás aceptando el marco o rol de víctima del manipulador. Debes quebrar el rol.';
  } else if (l.posicion.trim().length === 0) {
    return '• Pendiente evaluar el tablero relacional y máscaras de control.';
  }
  return '✓ POSICIONAMIENTO DE SOBERANÍA: Mantienes el marco emocional firme frente a la agresión externa.';
}
