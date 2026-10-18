import { Order } from '../types';
import { normalizeOrder } from '../utils/orderUtils';

/**
 * Service to communicate with our self-hosted Express database (/api/orders)
 * Stores and syncs all customer orders across all devices and phones permanently!
 */

export async function fetchOrdersFromDb(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.orders)) {
      return data.orders.map(normalizeOrder);
    }
  } catch (err) {
    console.warn('API fetchOrders error, falling back to local memory:', err);
  }
  return [];
}

export async function saveOrderToDb(order: Order): Promise<boolean> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const result = await res.json();
      console.log('✅ Order saved to server database successfully:', result);
      return true;
    }
  } catch (err) {
    console.error('❌ Failed to save order to server database:', err);
  }
  return false;
}

export async function updateOrderStatusInDb(
  orderId: string,
  status: Order['status'],
  pointsCredited?: boolean
): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(pointsCredited !== undefined ? { pointsCredited } : {}) }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to update order status in server database:', err);
    return false;
  }
}

export async function deleteOrderFromDb(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to delete order from server database:', err);
    return false;
  }
}

export async function clearAllOrdersFromDb(): Promise<boolean> {
  try {
    const res = await fetch('/api/orders', {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to clear orders from server database:', err);
    return false;
  }
}
