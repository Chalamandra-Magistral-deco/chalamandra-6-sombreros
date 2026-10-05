export interface SavedHatsRitual {
  id: string;
  title: string;
  azotea: string;
  blanco: string;
  rojo: string;
  negro: string;
  amarillo: string;
  verde: string;
  azul: string;
  createdAt?: string | Date;
}

export interface SavedLadderRitual {
  id: string;
  title: string;
  instinto: string;
  emocion: string;
  jugada: string;
  posicion: string;
  ejecucion: string;
  bitacora: string;
  inmunidad: string;
  createdAt?: string | Date;
}

const HATS_STORAGE_KEY = 'chalamandra_saved_hats_rituals';
const LADDER_STORAGE_KEY = 'chalamandra_saved_ladder_rituals';

const hatsSubscribers = new Set<(rituals: SavedHatsRitual[]) => void>();
const ladderSubscribers = new Set<(rituals: SavedLadderRitual[]) => void>();

function notifyHatsSubscribers() {
  const rituals = getSavedHatsRituals();
  hatsSubscribers.forEach((cb) => {
    try {
      cb(rituals);
    } catch (err) {
      console.error('Error notifying hats subscriber:', err);
    }
  });
}

function notifyLadderSubscribers() {
  const rituals = getSavedLadderRituals();
  ladderSubscribers.forEach((cb) => {
    try {
      cb(rituals);
    } catch (err) {
      console.error('Error notifying ladder subscriber:', err);
    }
  });
}

export function getSavedHatsRituals(): SavedHatsRitual[] {
  try {
    const raw = localStorage.getItem(HATS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading hats rituals from localStorage:', err);
    return [];
  }
}

export function getSavedLadderRituals(): SavedLadderRitual[] {
  try {
    const raw = localStorage.getItem(LADDER_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading ladder rituals from localStorage:', err);
    return [];
  }
}

/**
 * Save a 6 Thinking Hats ritual to localStorage (Autonomous & 100% private)
 */
export async function saveHatsRitual(
  param1: string | { azotea: string; blanco: string; rojo: string; negro: string; amarillo: string; verde: string; azul: string; },
  param2?: any,
  customTitle?: string
): Promise<string> {
  const hatsData = (typeof param1 === 'object' ? param1 : param2) || {};
  const explicitTitle = typeof param1 === 'string' && typeof param2 === 'object' ? customTitle : (typeof param2 === 'string' ? param2 : customTitle);
  const title = explicitTitle || hatsData.azotea?.slice(0, 60) || 'Ritual Seis Sombreros';

  const newRitual: SavedHatsRitual = {
    id: `hats-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    azotea: hatsData.azotea || '',
    blanco: hatsData.blanco || '',
    rojo: hatsData.rojo || '',
    negro: hatsData.negro || '',
    amarillo: hatsData.amarillo || '',
    verde: hatsData.verde || '',
    azul: hatsData.azul || '',
    createdAt: new Date().toISOString()
  };

  const existing = getSavedHatsRituals();
  const updated = [newRitual, ...existing];
  localStorage.setItem(HATS_STORAGE_KEY, JSON.stringify(updated));
  notifyHatsSubscribers();

  return newRitual.id;
}

/**
 * Subscribe to real-time updates for Saved 6 Hats rituals
 */
export function subscribeHatsRituals(
  param1: string | ((rituals: SavedHatsRitual[]) => void),
  param2?: (rituals: SavedHatsRitual[]) => void
): () => void {
  const callback = typeof param1 === 'function' ? param1 : (param2 || (() => {}));
  hatsSubscribers.add(callback);

  // Initial emit asynchronously so caller has hook settled
  setTimeout(() => {
    callback(getSavedHatsRituals());
  }, 0);

  return () => {
    hatsSubscribers.delete(callback);
  };
}

/**
 * Delete a 6 Thinking Hats ritual
 */
export async function deleteHatsRitual(param1: string, param2?: string): Promise<void> {
  const ritualId = param2 ? param2 : param1;
  const existing = getSavedHatsRituals();
  const updated = existing.filter((item) => item.id !== ritualId);
  localStorage.setItem(HATS_STORAGE_KEY, JSON.stringify(updated));
  notifyHatsSubscribers();
}

/**
 * Save a Strategic Ladder ritual to localStorage
 */
export async function saveLadderRitual(
  param1: string | { instinto: string; emocion: string; jugada: string; posicion: string; ejecucion: string; bitacora: string; inmunidad: string; },
  param2?: any,
  customTitle?: string
): Promise<string> {
  const ladderData = (typeof param1 === 'object' ? param1 : param2) || {};
  const explicitTitle = typeof param1 === 'string' && typeof param2 === 'object' ? customTitle : (typeof param2 === 'string' ? param2 : customTitle);
  const title = explicitTitle || ladderData.instinto?.slice(0, 60) || 'Ritual Escalera Estratégica';

  const newRitual: SavedLadderRitual = {
    id: `ladder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    instinto: ladderData.instinto || '',
    emocion: ladderData.emocion || '',
    jugada: ladderData.jugada || '',
    posicion: ladderData.posicion || '',
    ejecucion: ladderData.ejecucion || '',
    bitacora: ladderData.bitacora || '',
    inmunidad: ladderData.inmunidad || '',
    createdAt: new Date().toISOString()
  };

  const existing = getSavedLadderRituals();
  const updated = [newRitual, ...existing];
  localStorage.setItem(LADDER_STORAGE_KEY, JSON.stringify(updated));
  notifyLadderSubscribers();

  return newRitual.id;
}

/**
 * Subscribe to real-time updates for Saved Strategic Ladder rituals
 */
export function subscribeLadderRituals(
  param1: string | ((rituals: SavedLadderRitual[]) => void),
  param2?: (rituals: SavedLadderRitual[]) => void
): () => void {
  const callback = typeof param1 === 'function' ? param1 : (param2 || (() => {}));
  ladderSubscribers.add(callback);

  setTimeout(() => {
    callback(getSavedLadderRituals());
  }, 0);

  return () => {
    ladderSubscribers.delete(callback);
  };
}

/**
 * Delete a Strategic Ladder ritual
 */
export async function deleteLadderRitual(param1: string, param2?: string): Promise<void> {
  const ritualId = param2 ? param2 : param1;
  const existing = getSavedLadderRituals();
  const updated = existing.filter((item) => item.id !== ritualId);
  localStorage.setItem(LADDER_STORAGE_KEY, JSON.stringify(updated));
  notifyLadderSubscribers();
}
