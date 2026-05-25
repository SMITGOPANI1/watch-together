import admin from 'firebase-admin';
import config from './environment.js';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

export let isFirebaseConfigured = false;

try {
  if (projectId && clientEmail && privateKey) {
    let formattedKey = privateKey.trim();
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.slice(1, -1);
    }
    formattedKey = formattedKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      })
    });
    console.log('[FIREBASE ADMIN]: Initialized successfully with service account certs.');
    isFirebaseConfigured = true;
  } else {
    console.warn('[FIREBASE ADMIN WARNING]: Environmental credentials are not set. Active Mock Developer Auth Mode enabled.');
    isFirebaseConfigured = false;
  }
} catch (error) {
  console.error('[FIREBASE ADMIN ERROR]: SDK initialization failed: ', error.message);
  isFirebaseConfigured = false;
}

export default admin;
