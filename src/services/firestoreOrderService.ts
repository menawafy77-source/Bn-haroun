import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { normalizeOrder } from '../utils/orderUtils';

const ORDERS_COLLECTION = 'orders';

/**
 * Real-time listener for Firestore orders collection.
 * Triggers callback immediately on initial load and whenever any new order is placed
 * from any phone, computer, or tablet worldwide!
 */
export function subscribeToFirestoreOrders(
  onOrdersReceived: (orders: Order[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          ordersList.push(normalizeOrder({ id: docSnap.id, ...data }));
        });

        // Sort newest first by date or timestamp
        ordersList.sort((a, b) => {
          const timeA = (a as any).createdAt || (a as any).timestamp || a.date;
          const timeB = (b as any).createdAt || (b as any).timestamp || b.date;
          return String(timeB).localeCompare(String(timeA));
        });

        console.log(`📡 [FIRESTORE REALTIME] Received ${ordersList.length} orders across all devices.`);
        onOrdersReceived(ordersList);
      },
      (err) => {
        console.warn('Firestore onSnapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to setup Firestore listener:', err);
    return () => {};
  }
}

/**
 * Saves an order directly to Google Cloud Firestore
 */
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    const payload = {
      ...order,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    console.log(`✅ [FIRESTORE] Order ${order.id} saved to Cloud Firestore successfully.`);
    return true;
  } catch (err) {
    console.error('❌ [FIRESTORE] Failed to save order to Cloud Firestore:', err);
    return false;
  }
}

/**
 * Updates order status in Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order['status'],
  pointsCredited?: boolean
): Promise<boolean> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: any = { status: newStatus };
    if (pointsCredited !== undefined) {
      updates.pointsCredited = pointsCredited;
    }
    await updateDoc(docRef, updates);
    console.log(`✅ [FIRESTORE] Order ${orderId} updated to ${newStatus}.`);
    return true;
  } catch (err) {
    console.warn('Failed to update order in Firestore:', err);
    return false;
  }
}

/**
 * Deletes an order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    console.log(`🗑️ [FIRESTORE] Order ${orderId} deleted.`);
    return true;
  } catch (err) {
    console.warn('Failed to delete order from Firestore:', err);
    return false;
  }
}

/**
 * Clears all orders from Firestore
 */
export async function clearAllOrdersFromFirestore(): Promise<boolean> {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersCol);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    console.log('🗑️ [FIRESTORE] All orders cleared.');
    return true;
  } catch (err) {
    console.warn('Failed to clear orders from Firestore:', err);
    return false;
  }
}
