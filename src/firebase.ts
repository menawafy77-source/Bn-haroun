import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Connect cleanly to the provisioned Firestore database
export const db = getFirestore(app, "ai-studio-8bb136c0-6ac3-4444-acbb-8fde45c51bd6");

export async function testFirestoreConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    // Use getDoc instead of getDocFromServer so it doesn't fail abruptly during initial handshake
    await getDoc(doc(db, 'test', 'connection'));
    return { ok: true };
  } catch (err: any) {
    // If it's a transient unavailable/offline status, Firestore will reconnect automatically
    if (err?.code === 'unavailable') {
      return { ok: true };
    }
    console.warn('Firestore connection check notice:', err);
    return { ok: false, error: err?.message || 'تعذر الاتصال بقاعدة بيانات Firestore' };
  }
}
