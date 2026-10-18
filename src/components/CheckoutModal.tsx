import React, { useState } from 'react';
import { Order, CartItem } from '../types';
import { normalizeOrder } from '../utils/orderUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onOrderSuccess: (order: Order) => Promise<void>;
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
  const [successInfo, setSuccessInfo] = useState<{ orderId: string; whatsappUrl: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');

    // 1. التحقق من رقم التحويل في حالة الدفع الإلكتروني
    if (paymentMethod !== 'cash' && !transferNumber.trim()) {
      setFormError('يرجى إدخال رقم التحويل الخاص بالدفع الإلكتروني لتأكيد الطلب.');
      return;
    }

    const orderId = `ORD-${crypto.randomUUID()}`;
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
      notes: paymentMethod !== 'cash' ? `رقم التحويل: ${transferNumber}` : undefined,
      pointsEarned,
      pointsCredited: false,
      status: 'placed',
      date: new Date().toLocaleString('ar-EG'),
    });

    // Confirm the single cloud write before showing success or clearing the cart.
    setIsSubmitting(true);
    try {
      await onOrderSuccess(newOrder);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'تعذر حفظ الطلب. يرجى إعادة المحاولة.');
      return;
    } finally {
      setIsSubmitting(false);
    }

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
          <button disabled={isSubmitting} onClick={() => { setSuccessInfo(null); onClose(); }} className="text-gray-500 hover:text-red-600 font-bold text-lg">✕</button>
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

          {/* خانة رقم التحويل تظهر فقط في حالة اختيار الدفع الإلكتروني */}
          {paymentMethod !== 'cash' && (
            <div className="bg-[#FDF8F0] p-3 rounded-xl border border-[#C5A059]/40 animate-fadeIn">
              <label className="block text-xs font-bold text-[#8C6239] mb-1">
                {paymentMethod === 'vodafone_cash' ? 'رقم محفظة فودافون المحول منها أو رقم عملية التحويل' : 'رقم مرجع التحويل (InstaPay Reference)'} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                placeholder="أدخل رقم التحويل هنا..."
                className="w-full p-2.5 rounded-xl border border-[#C5A059] bg-white focus:outline-none text-sm font-bold"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                * تحويل المبلغ على رقم المحمصة: <span className="font-bold text-[#4A2C11]">01275075046</span>
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#4A2C11] hover:bg-[#3E2723] text-[#F3C07B] font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-center"
            >
              تأكيد الطلب وإرسال عبر الواتساب ☕
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
