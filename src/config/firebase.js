import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Reads from standard React/Vite environment variables, with visual fallback structures
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyWatchHive1234567890",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "watchhive-auth-mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "watchhive-auth-mock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "watchhive-auth-mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:a1b2c3d4e5f6g7h8i9"
};

// Check if keys are custom mock placeholders
const isMock = firebaseConfig.apiKey.includes('FakeKey');
if (isMock) {
  console.log('[FIREBASE CLIENT WARNING]: Firebase environment variables are not yet configured. Operating in preview fallback.');
}

// Initialize Firebase client instance
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
