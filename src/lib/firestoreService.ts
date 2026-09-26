import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

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
  createdAt?: Timestamp | Date | string;
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
  createdAt?: Timestamp | Date | string;
}

/**
 * Save a Six Thinking Hats ritual to Firestore under /users/{userId}/hats_rituals
 */
export async function saveHatsRitual(
  userId: string, 
  hatsData: {
    azotea: string;
    blanco: string;
    rojo: string;
    negro: string;
    amarillo: string;
    verde: string;
    azul: string;
  },
  customTitle?: string
): Promise<string> {
  const path = `users/${userId}/hats_rituals`;
  try {
    const title = customTitle || hatsData.azotea.slice(0, 60) || 'Ritual Seis Sombreros';
    const hatsRef = collection(db, 'users', userId, 'hats_rituals');
    const docRef = await addDoc(hatsRef, {
      title,
      azotea: hatsData.azotea || '',
      blanco: hatsData.blanco || '',
      rojo: hatsData.rojo || '',
      negro: hatsData.negro || '',
      amarillo: hatsData.amarillo || '',
      verde: hatsData.verde || '',
      azul: hatsData.azul || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for user's Six Thinking Hats rituals
 */
export function subscribeHatsRituals(
  userId: string, 
  onUpdate: (rituals: SavedHatsRitual[]) => void
): () => void {
  const path = `users/${userId}/hats_rituals`;
  const hatsRef = collection(db, 'users', userId, 'hats_rituals');
  
  return onSnapshot(
    hatsRef,
    (snapshot) => {
      const list: SavedHatsRitual[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Ritual Sombreros',
          azotea: data.azotea || '',
          blanco: data.blanco || '',
          rojo: data.rojo || '',
          negro: data.negro || '',
          amarillo: data.amarillo || '',
          verde: data.verde || '',
          azul: data.azul || '',
          createdAt: data.createdAt
        };
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Delete a Six Thinking Hats ritual from Firestore
 */
export async function deleteHatsRitual(userId: string, ritualId: string): Promise<void> {
  const path = `users/${userId}/hats_rituals/${ritualId}`;
  try {
    const docRef = doc(db, 'users', userId, 'hats_rituals', ritualId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Save a Strategic Ladder ritual to Firestore under /users/{userId}/ladder_rituals
 */
export async function saveLadderRitual(
  userId: string, 
  ladderData: {
    instinto: string;
    emocion: string;
    jugada: string;
    posicion: string;
    ejecucion: string;
    bitacora: string;
    inmunidad: string;
  },
  customTitle?: string
): Promise<string> {
  const path = `users/${userId}/ladder_rituals`;
  try {
    const title = customTitle || ladderData.instinto.slice(0, 60) || 'Ritual Escalera Estratégica';
    const ladderRef = collection(db, 'users', userId, 'ladder_rituals');
    const docRef = await addDoc(ladderRef, {
      title,
      instinto: ladderData.instinto || '',
      emocion: ladderData.emocion || '',
      jugada: ladderData.jugada || '',
      posicion: ladderData.posicion || '',
      ejecucion: ladderData.ejecucion || '',
      bitacora: ladderData.bitacora || '',
      inmunidad: ladderData.inmunidad || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for user's Strategic Ladder rituals
 */
export function subscribeLadderRituals(
  userId: string, 
  onUpdate: (rituals: SavedLadderRitual[]) => void
): () => void {
  const path = `users/${userId}/ladder_rituals`;
  const ladderRef = collection(db, 'users', userId, 'ladder_rituals');

  return onSnapshot(
    ladderRef,
    (snapshot) => {
      const list: SavedLadderRitual[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Ritual Escalera',
          instinto: data.instinto || '',
          emocion: data.emocion || '',
          jugada: data.jugada || '',
          posicion: data.posicion || '',
          ejecucion: data.ejecucion || '',
          bitacora: data.bitacora || '',
          inmunidad: data.inmunidad || '',
          createdAt: data.createdAt
        };
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Delete a Strategic Ladder ritual from Firestore
 */
export async function deleteLadderRitual(userId: string, ritualId: string): Promise<void> {
  const path = `users/${userId}/ladder_rituals/${ritualId}`;
  try {
    const docRef = doc(db, 'users', userId, 'ladder_rituals', ritualId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
