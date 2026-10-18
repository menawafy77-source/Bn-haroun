import { Order, CartItem } from '../types';

/**
 * Normalizes any order object (whether from Supabase columns, localStorage, or forms)
 * into a complete, standard Order object to prevent runtime errors and ensure
 * total consistency across the owner dashboard and sales views.
 */
export function normalizeOrder(raw: any): Order {
  if (!raw || typeof raw !== 'object') {
    const fallbackId = `ORD-${Date.now()}`;
    return {
      id: fallbackId,
      orderNumber: `HRN-${fallbackId.slice(-6)}`,
      date: new Date().toLocaleString('ar-EG'),
      customerName: 'عميل بن هارون',
      customerPhone: '',
      customerCity: 'السادس من أكتوبر',
      customerAddress: '',
      items: [],
      subtotal: 0,
      shippingFee: 0,
      discount: 0,
      pointsDiscount: 0,
      total: 0,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'placed',
      statusStep: 1,
      trackingCode: `EGY-HRN-${fallbackId.slice(-6)}`,
      carrier: 'محامص بن هارون',
      estimatedDelivery: 'خلال 24-48 ساعة',
      pointsEarned: 0,
      pointsCredited: false,
      timeline: [],
    };
  }

  const id = String(raw.id || `ORD-${Date.now()}`);
  const orderNumber = String(
    raw.orderNumber || raw.order_number || id.replace('ORD-', 'HRN-')
  );
  const customerName = String(
    raw.customerName || raw.customer_name || 'عميل بن هارون'
  );
  const customerPhone = String(
    raw.customerPhone || raw.phone || raw.customer_phone || ''
  );
  const customerAddress = String(
    raw.customerAddress || raw.address || raw.customer_address || ''
  );
  const customerCity = String(
    raw.customerCity || raw.city || raw.customer_city || 'السادس من أكتوبر'
  );

  let items: CartItem[] = [];
  if (Array.isArray(raw.items)) {
    items = raw.items;
  } else if (typeof raw.items === 'string') {
    try {
      items = JSON.parse(raw.items);
    } catch {
      items = [];
    }
  }

  // Handle total / totalPrice / total_price
  const rawTotal = raw.total ?? raw.totalPrice ?? raw.total_price ?? raw.subtotal;
  const total = Number(rawTotal) || 0;

  const paymentMethod = raw.paymentMethod || raw.payment_method || 'cod';
  const notes =
    raw.notes ||
    (raw.transferNumber
      ? `رقم التحويل: ${raw.transferNumber}`
      : raw.transfer_number
      ? `رقم التحويل: ${raw.transfer_number}`
      : undefined);

  let date = raw.date;
  if (!date && raw.created_at) {
    try {
      date = new Date(raw.created_at).toLocaleString('ar-EG');
    } catch {
      date = new Date().toLocaleString('ar-EG');
    }
  }
  if (!date) {
    date = new Date().toLocaleString('ar-EG');
  }

  const rawStatus = raw.status;
  const status =
    rawStatus === 'delivered'
      ? 'delivered'
      : rawStatus === 'out_for_delivery'
      ? 'out_for_delivery'
      : rawStatus === 'packaged'
      ? 'packaged'
      : rawStatus === 'roasting'
      ? 'roasting'
      : 'placed';

  const pointsEarned = Number(raw.pointsEarned ?? raw.points_earned) || 0;
  const pointsCredited = Boolean(raw.pointsCredited ?? raw.points_credited);

  return {
    id,
    orderNumber,
    date,
    customerName,
    customerPhone,
    customerCity,
    customerAddress,
    items,
    subtotal: total,
    shippingFee: 0,
    discount: 0,
    pointsDiscount: 0,
    total,
    paymentMethod: paymentMethod as any,
    paymentStatus:
      paymentMethod === 'cash' || paymentMethod === 'cod' ? 'pending' : 'verified',
    status,
    statusStep: status === 'delivered' ? 4 : 1,
    trackingCode: String(raw.trackingCode || raw.tracking_code || `EGY-${orderNumber}`),
    carrier: String(raw.carrier || 'محامص بن هارون'),
    estimatedDelivery: String(raw.estimatedDelivery || raw.estimated_delivery || 'خلال 24-48 ساعة'),
    notes,
    pointsEarned,
    pointsCredited,
    timeline: Array.isArray(raw.timeline) && raw.timeline.length > 0
      ? raw.timeline
      : [
          {
            step: 1,
            title: 'تم استلام الطلب',
            description: 'تم تسجيل الطلب في سجلات بن هارون',
            timestamp: date,
            completed: true,
            current: status !== 'delivered',
          },
        ],
  };
}
