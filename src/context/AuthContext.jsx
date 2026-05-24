import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authService } from '../services/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user with backend MongoDB database
  const syncWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('watchhive_token', token);

      const res = await authService.syncUser();
      if (res.success && res.data?.user) {
        // Merge Firebase attributes with custom MongoDB profile configurations
        setCurrentUser({
          ...firebaseUser,
          ...res.data.user,
          uid: firebaseUser.uid,
          avatar: res.data.user.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
          name: res.data.user.name || firebaseUser.displayName || 'WatchHive Explorer',
          email: res.data.user.email || firebaseUser.email,
        });
      } else {
        console.warn('[AUTH SYSTEM WARNING]: User sync failed, using client fallback.', res.error);
        setCurrentUser(firebaseUser);
      }
    } catch (err) {
      console.error('[AUTH CRITICAL]: Failed to sync session token with backend: ', err);
      setCurrentUser(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setAuthError(null);

      if (firebaseUser) {
        await syncWithBackend(firebaseUser);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('watchhive_token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 1. SIGN UP
  const signupWithEmail = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
      
      // Update Firebase Profile displayName and photoURL
      await updateFirebaseProfile(result.user, {
        displayName: name,
        photoURL: defaultAvatar
      });

      await syncWithBackend(result.user);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIN WITH EMAIL
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(result.user);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. GOOGLE SIGN IN
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncWithBackend(result.user);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. LOG OUT
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem('watchhive_token');
    } catch (err) {
      console.error('[AUTH ERROR]: Log out execution failed.', err);
    } finally {
      setLoading(false);
    }
  };

  // 5. RESET PASSWORD
  const resetPasswordEmail = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Sync profile details updates to both state and backend MongoDB
  const updateProfileDetails = async (fields) => {
    try {
      const res = await authService.updateProfile(
        fields.name,
        fields.email,
        fields.avatar,
        fields.bio
      );
      if (res.success && res.data?.user) {
        setCurrentUser((prev) => ({
          ...prev,
          ...res.data.user
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (err) {
      console.error('[AUTH ERROR]: Failed updating user settings profiles.', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    resetPasswordEmail,
    updateProfileDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
