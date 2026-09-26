import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  authError: null,
  clearAuthError: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(userRef, {
            displayName: currentUser.displayName || 'Usuario Chalamandra',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn('Failed to sync user document to Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';
      const isApiKeyIssue = 
        errCode === 'auth/api-key-not-valid' || 
        errCode === 'auth/invalid-api-key' || 
        errCode === 'auth/api-key-expired' || 
        errMsg.includes('api-key-not-valid') || 
        errMsg.includes('invalid-api-key') ||
        errMsg.includes('api-key-expired');

      if (isApiKeyIssue) {
        console.warn('Firebase Auth API Key issue detected:', errCode || errMsg);
        setAuthError('La autenticación en la nube con Google requiere una clave de Firebase activa. Mientras tanto, tu progreso, sombreros, escalera y ruleta cognitiva se guardan de forma local y funcionan al 100% en tu navegador.');
      } else if (errCode === 'auth/popup-closed-by-user') {
        // Closed deliberately by user
        setAuthError('Ventana de inicio de sesión cerrada por el usuario.');
      } else if (errCode === 'auth/cancelled-popup-request') {
        // Silent ignore for duplicate popup request
      } else if (errCode === 'auth/unauthorized-domain') {
        console.warn('Firebase Auth unauthorized domain:', errMsg);
        setAuthError('Dominio no autorizado en Firebase Authentication. Tu sesión continúa guardándose de manera local.');
      } else {
        console.warn('Google Sign-In notice:', errMsg);
        setAuthError('No se pudo conectar con Google Auth. Puedes seguir utilizando la aplicación en modo local.');
      }
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Sign-Out notice:', err);
      setAuthError('Error al cerrar sesión.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, authError, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
