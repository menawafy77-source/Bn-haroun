import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// الاتصال المباشر بقاعدة البيانات لضمان المزامنة الفورية بين الأجهزة
export const db = getFirestore(app);

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Connected to Google Firestore Database successfully');
    return true;
  } catch (err) {
    console.warn('Firestore connection check:', err);
    return false;
  }
}
