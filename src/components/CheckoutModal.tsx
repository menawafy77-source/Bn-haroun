import React, { useState } from 'react';
import { Order, CartItem } from '../types';
import { normalizeOrder } from '../utils/orderUtils';
import { saveOrderToDb } from '../services/apiOrderService';
import { saveOrderToFirestore } from '../services/firestoreOrderService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onOrderSuccess: (order: Order) => void;
}

type PaymentMethod = 'cash' | 'vodafone_cash' | 'instapay';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [transferNumber, setTransferNumber] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedType, setCopiedType] = useState<'voda' | 'insta' | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ orderId: string; whatsappUrl: string; name: string } | null>(null);

  const handleCopyNumber = (num: string, type: 'voda' | 'insta') => {
    try {
      navigator.clipboard.writeText(num);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // 1. التحقق من رقم التحويل في حالة الدفع الإلكتروني
    if (paymentMethod !== 'cash' && !transferNumber.trim()) {
      setFormError('يرجى إدخال رقم التحويل الخاص بالدفع الإلكتروني لتأكيد الطلب.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Date.now()}`;
    const paymentLabel = 
      paymentMethod === 'vodafone_cash' ? 'فودافون كاش' :
      paymentMethod === 'instapay' ? 'إنستاباي' : 'الدفع عند الاستلام';

    // 2. حساب النقاط المستحقة للطلب
    const pointsEarned = items
      .filter((item) => !item.isLoyaltyReward)
      .reduce((sum, item) => {
        const pts = item.weight === '100g' ? 1 : 3;
        return sum + pts * item.quantity;
      }, 0);

    // 3. إنشاء كائن الطلب الجديد بالكامل ومطابقته بدقة
    const orderNumber = orderId.replace('ORD-', 'HRN-');
    const newOrder: Order = normalizeOrder({
      id: orderId,
      orderNumber,
      customerName,
      customerPhone: phone,
      customerAddress: address,
      items: [...items],
      total: subtotal,
      subtotal,
      paymentMethod: paymentLabel,
      notes: paymentMethod !== 'cash' ? `رقم التحويل: ${transferNumber}` : '',
      pointsEarned,
      pointsCredited: false,
      status: 'placed',
      date: new Date().toLocaleString('ar-EG'),
    });

    // 4. 🔥 الحفظ المباشر في سحابة Google Firestore المركزية المشتركة بين كل الهواتف 🔥
    const firestoreResult = await saveOrderToFirestore(newOrder);
    if (!firestoreResult.success) {
      setIsSubmitting(false);
      setFormError(`تعذر حفظ الطلب في السحابة المركزية (Firestore): ${firestoreResult.error || 'يرجى التحقق من اتصال الإنترنت'}`);
      return;
    }

    // 5. حفظ نسخة محلية احتياطية وعلى السيرفر الداخلي
    try {
      const savedOrders = localStorage.getItem('haroun_orders');
      const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
      const updatedOrders = [newOrder, ...currentOrders.filter((o: any) => o.id !== newOrder.id)];
      localStorage.setItem('haroun_orders', JSON.stringify(updatedOrders));
    } catch {
      // ignore
    }
    saveOrderToDb(newOrder);

    // 6. إبلاغ التطبيق بالطلب الجديد لتحديث الشاشة فوراً
    onOrderSuccess(newOrder);
    setIsSubmitting(false);

    // 6. تجهيز فتح الواتساب
    let message = `مرحباً بن هارون، أرغب في تأكيد طلبي:%0A` +
      `• رقم الطلب: ${orderId}%0A` +
      `• الاسم: ${customerName}%0A` +
      `• الهاتف: ${phone}%0A` +
      `• العنوان: ${address}%0A` +
      `• طريقة الدفع: ${paymentLabel}%0A`;

    if (paymentMethod !== 'cash') {
      message += `• رقم التحويل: ${transferNumber}%0A`;
    }

    message += `• الإجمالي: ${subtotal} ج.م`;

    const whatsappUrl = `https://wa.me/201275075046?text=${message}`;

    // 7. عرض شاشة النجاح
    setSuccessInfo({ orderId, whatsappUrl, name: customerName });

    // 8. إعادة ضبط الخانات وتصفير النموذج
    setCustomerName('');
    setPhone('');
    setAddress('');
    setTransferNumber('');
    setPaymentMethod('cash');

    // 9. فتح الواتساب في النهاية
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-[#FBF8F3] text-[#2C1810] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#C5A059]/30 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-[#E6D5BE] pb-3">
          <h2 className="text-xl font-bold text-[#4A2C11]">
            {successInfo ? 'تم إرسال الطلب للمكتب بنجاح!' : 'إتمام الطلب وتأكيد الشراء'}
          </h2>
          <button onClick={() => { setSuccessInfo(null); onClose(); }} className="text-gray-500 hover:text-red-600 font-bold text-lg">✕</button>
        </div>

        {successInfo ? (
          <div className="space-y-5 py-3 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-emerald-300">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2C1810]">
                مبروك يا {successInfo.name}! وصل طلبك إلى مكتب أستاذ ثروت هارون
              </h3>
              <p className="text-xs text-[#7A6958] mt-1 font-mono">
                رقم الطلب: {successInfo.orderId}
              </p>
              <p className="text-xs text-[#5C4A3C] mt-2 leading-relaxed">
                تم تسجيل الطلب في سجل الإدارة فوراً. يمكنك أيضاً تأكيد وإرسال تفاصيل الطلب مباشرة عبر الواتساب للمحمصة.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={successInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>فتح الواتساب لتأكيد الطلب الآن</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSuccessInfo(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-[#F3C07B] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                إغلاق والعودة للمتجر
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-shake">
              <i className="fa-solid fa-circle-exclamation shrink-0 text-red-500"></i>
              <span>{formError}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">الاسم بالكامل</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="اكتب اسمك الكريم..."
              className="w-full p-2.5 rounded-xl border border-[#E6D5BE] bg-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">رقم الهاتف (واتساب)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full p-2.5 rounded-xl border border-[#E6D5BE] bg-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">عنوان الاستلام بالتفصيل</label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المدينة، الشارع، رقم الحي..."
              className="w-full p-2.5 rounded-xl border border-[#E6D5BE] bg-white focus:outline-none focus:border-[#C5A059]"
            ></textarea>
          </div>

          {/* اختيار طريقة الدفع */}
          <div>
            <label className="block text-sm font-semibold mb-2">طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                  paymentMethod === 'cash' 
                    ? 'bg-[#4A2C11] text-white border-[#4A2C11]' 
                    : 'bg-white text-[#4A2C11] border-[#E6D5BE]'
                }`}
              >
                الدفع عند الاستلام
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                  paymentMethod === 'vodafone_cash' 
                    ? 'bg-red-700 text-white border-red-700' 
                    : 'bg-white text-red-700 border-[#E6D5BE]'
                }`}
              >
                فودافون كاش
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                  paymentMethod === 'instapay' 
                    ? 'bg-purple-800 text-white border-purple-800' 
                    : 'bg-white text-purple-800 border-[#E6D5BE]'
                }`}
              >
                إنستاباي
              </button>
            </div>
          </div>

          {/* تفاصيل وخانة التحويل لفودافون كاش */}
          {paymentMethod === 'vodafone_cash' && (
            <div className="bg-red-50/80 p-3.5 rounded-xl border border-red-200 animate-fadeIn space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-mobile-screen-button text-red-600"></i>
                  <span>رقم محفظة فودافون كاش:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyNumber('01002563614', 'voda')}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-700 hover:bg-red-800 text-white flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <i className={`fa-solid ${copiedType === 'voda' ? 'fa-check text-green-300' : 'fa-copy'}`}></i>
                  <span>{copiedType === 'voda' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-red-200 flex items-center justify-between shadow-xs">
                <span className="font-mono font-extrabold text-base sm:text-lg text-red-700 tracking-wider">01002563614</span>
                <span className="text-[11px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">فودافون كاش</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8C6239] mb-1">
                  رقم المحفظة المحول منها أو رقم عملية التحويل <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  placeholder="مثال: 010xxxxxxxx أو رقم العملية..."
                  className="w-full p-2.5 rounded-xl border border-red-300 bg-white focus:outline-none text-sm font-bold"
                />
              </div>

              <p className="text-[11px] text-gray-600">
                * يرجى تحويل مبلغ <strong className="text-red-700 font-bold">{subtotal} ج.م</strong> على رقم فودافون كاش أعلاه لتأكيد طلبك.
              </p>
            </div>
          )}

          {/* تفاصيل وخانة التحويل لإنستاباي */}
          {paymentMethod === 'instapay' && (
            <div className="bg-purple-50/80 p-3.5 rounded-xl border border-purple-200 animate-fadeIn space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-bolt text-purple-700"></i>
                  <span>رقم حساب إنستاباي (InstaPay):</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyNumber('01206027305', 'insta')}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-800 hover:bg-purple-900 text-white flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <i className={`fa-solid ${copiedType === 'insta' ? 'fa-check text-green-300' : 'fa-copy'}`}></i>
                  <span>{copiedType === 'insta' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-purple-200 flex items-center justify-between shadow-xs">
                <span className="font-mono font-extrabold text-base sm:text-lg text-purple-800 tracking-wider">01206027305</span>
                <span className="text-[11px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">إنستاباي</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8C6239] mb-1">
                  رقم مرجع التحويل أو اسم الحساب المحول منه <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  placeholder="أدخل رقم المرجع (Reference) أو اسم الحساب..."
                  className="w-full p-2.5 rounded-xl border border-purple-300 bg-white focus:outline-none text-sm font-bold"
                />
              </div>

              <p className="text-[11px] text-gray-600">
                * يرجى تحويل مبلغ <strong className="text-purple-800 font-bold">{subtotal} ج.م</strong> على رقم إنستاباي أعلاه لتأكيد طلبك.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#4A2C11] hover:bg-[#3E2723] text-[#F3C07B] font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>جاري تسجيل الطلب سحابياً...</span>
                </>
              ) : (
                <span>تأكيد الطلب وإرسال عبر الواتساب ☕</span>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
