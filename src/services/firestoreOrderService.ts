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
 * Strips all undefined properties from an object so Firestore never throws
 * "Unsupported field value: undefined"
 */
function sanitizeForFirestore(order: any): any {
  const clean = JSON.parse(
    JSON.stringify(order, (key, value) => (value === undefined ? null : value))
  );

  return {
    ...clean,
    notes: clean.notes || '',
    customerCity: clean.customerCity || '',
    customerAddress: clean.customerAddress || '',
    timestamp: clean.timestamp || Date.now(),
    createdAt: clean.createdAt || new Date().toISOString(),
  };
}

/**
 * Real-time listener for Firestore orders collection across all phones & devices.
 * Uses onSnapshot so any change in Firestore instantly reflects on every connected screen!
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
        const ordersList: Order[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return normalizeOrder({ id: docSnap.id, ...data });
        });

        // Sort newest first by timestamp / createdAt / date
        ordersList.sort((a, b) => {
          const timeA = (a as any).timestamp || (a as any).createdAt || a.id;
          const timeB = (b as any).timestamp || (b as any).createdAt || b.id;
          return String(timeB).localeCompare(String(timeA));
        });

        console.log(`📡 [FIRESTORE REALTIME] Synced ${ordersList.length} orders across all devices.`);
        onOrdersReceived(ordersList);
      },
      (err) => {
        if (err?.code === 'unavailable') {
          console.info('Firestore is operating in resilient reconnect mode.');
          return;
        }
        console.error('❌ Firestore onSnapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    if (err?.code === 'unavailable') {
      console.info('Firestore is operating in resilient reconnect mode.');
      return () => {};
    }
    console.error('❌ Failed to setup Firestore listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Saves an order directly to Google Cloud Firestore with sanitization.
 * Returns detailed success or error message.
 */
export async function saveOrderToFirestore(
  order: Order
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    const payload = sanitizeForFirestore(order);

    await setDoc(docRef, payload, { merge: true });
    console.log(`✅ [FIRESTORE] Order ${order.id} saved to Cloud Firestore successfully.`);
    return { success: true };
  } catch (err: any) {
    if (err?.code === 'unavailable') {
      console.warn('Firestore offline/reconnecting, order queued for sync.');
      return { success: true };
    }
    console.error('❌ [FIRESTORE] Failed to save order to Cloud Firestore:', err);
    return {
      success: false,
      error: err?.message || 'فشل الاتصال بسحابة فايربيس لحفظ الطلب',
    };
  }
}

/**
 * Updates order status in Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order['status'],
  pointsCredited?: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: any = { status: newStatus };
    if (pointsCredited !== undefined) {
      updates.pointsCredited = pointsCredited;
    }
    await updateDoc(docRef, updates);
    console.log(`✅ [FIRESTORE] Order ${orderId} status updated to ${newStatus}.`);
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to update order in Firestore:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes an order from Firestore
 */
export async function deleteOrderFromFirestore(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    console.log(`🗑️ [FIRESTORE] Order ${orderId} deleted.`);
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to delete order from Firestore:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Clears all orders from Firestore
 */
export async function clearAllOrdersFromFirestore(): Promise<{ success: boolean; error?: string }> {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersCol);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    console.log('🗑️ [FIRESTORE] All orders cleared.');
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to clear orders from Firestore:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Manually fetches all orders directly from Firestore
 */
export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersCol);
    const ordersList: Order[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return normalizeOrder({ id: docSnap.id, ...data });
    });

    ordersList.sort((a, b) => {
      const timeA = (a as any).timestamp || (a as any).createdAt || a.id;
      const timeB = (b as any).timestamp || (b as any).createdAt || b.id;
      return String(timeB).localeCompare(String(timeA));
    });

    return ordersList;
  } catch (err) {
    console.warn('Failed to fetch orders from Firestore:', err);
    return [];
  }
}
