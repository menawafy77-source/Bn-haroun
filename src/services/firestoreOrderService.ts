import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
  getDocsFromServer,
  serverTimestamp,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { normalizeOrder } from '../utils/orderUtils';

const ORDERS_COLLECTION = 'orders';

function ordersFromSnapshot(snapshot: QuerySnapshot<DocumentData>): Order[] {
  return snapshot.docs
    .map((snapshotDoc) => {
      const data = snapshotDoc.data({ serverTimestamps: 'estimate' });
      const createdAt = data.createdAt ?? data.timestamp;
      const time = typeof createdAt?.toMillis === 'function'
        ? createdAt.toMillis()
        : Date.parse(createdAt ?? '') || 0;
      return { order: normalizeOrder({ ...data, id: snapshotDoc.id }), time };
    })
    .sort((a, b) => b.time - a.time || b.order.id.localeCompare(a.order.id))
    .map(({ order }) => order);
}

export async function fetchFirestoreOrders(): Promise<Order[]> {
  return ordersFromSnapshot(await getDocsFromServer(collection(db, ORDERS_COLLECTION)));
}

/**
 * Real-time listener for Firestore orders collection.
 * Triggers callback immediately on initial load and whenever any new order is placed
 * from any phone, computer, or tablet worldwide!
 */
export function subscribeToFirestoreOrders(
  onOrdersReceived: (orders: Order[]) => void,
  onError?: (err: unknown) => void,
  onConnectionChange?: (fromCache: boolean) => void,
): () => void {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol);

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        onConnectionChange?.(snapshot.metadata.fromCache);
        // Do not erase the last known orders with an unconfirmed, empty cache.
        // A server-confirmed empty collection MUST clear deleted orders on all devices.
        if (!snapshot.metadata.fromCache || !snapshot.empty) {
          onOrdersReceived(ordersFromSnapshot(snapshot));
        }
      },
      (err) => {
        console.warn('Firestore onSnapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to setup Firestore listener:', err);
    onError?.(err);
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
      // Orders are JSON data; strip optional undefined fields, including nested items.
      ...JSON.parse(JSON.stringify(order)),
      createdAt: serverTimestamp(),
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
