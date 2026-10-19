import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCzL6IulH6FziT_jPfuedzVJynxIdtTgTI",
  authDomain: "soy-dialect-h07pf.firebaseapp.com",
  projectId: "soy-dialect-h07pf",
  storageBucket: "soy-dialect-h07pf.firebasestorage.app",
  messagingSenderId: "159138877799",
  appId: "1:159138877799:web:3513de314fbe4174bedfc2",
  firestoreDatabaseId: "ai-studio-8bb136c0-6ac3-4444-acbb-8fde45c51bd6"
};

// Initialize or reuse existing Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Connect explicitly to the provisioned Firestore database with auto-detect long polling for mobile stability
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    "ai-studio-8bb136c0-6ac3-4444-acbb-8fde45c51bd6"
  );
} catch {
  firestoreInstance = getFirestore(app, "ai-studio-8bb136c0-6ac3-4444-acbb-8fde45c51bd6");
}

export const db = firestoreInstance;

export async function testFirestoreConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Connected to Google Firestore Database successfully');
    return { ok: true };
  } catch (err: any) {
    console.warn('Firestore connection check:', err);
    return { ok: false, error: err?.message || 'تعذر الاتصال بقاعدة بيانات Firestore' };
  }
}
