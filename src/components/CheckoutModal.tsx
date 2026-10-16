import React, { useState } from 'react';
import { CartItem, PaymentMethod, Order } from '../types';
import { STORE_CONTACT } from '../data/coffeeData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onOrderSuccess,
}) => {
  // Form state - simplified to name and phone only
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Payment specific details
  const [walletSenderPhone, setWalletSenderPhone] = useState('');
  const [instapayRef, setInstapayRef] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  // UI state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const grandTotal = subtotal;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `HRN-${randomNum}`;

      const earnedPoints = items
        .filter((item) => !item.isLoyaltyReward)
        .reduce((sum, item) => {
          const pts = item.weight === '100g' ? 1 : 3;
          return sum + pts * item.quantity;
        }, 0);

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date()),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: '',
        customerAddress: '',
        items: [...items],
        subtotal,
        shippingFee: 0,
        discount: 0,
        pointsDiscount: 0,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verified',
        status: 'placed',
        statusStep: 1,
        trackingCode: `EGY-${orderNumber}`,
        carrier: 'شحن بن هارون السريع',
        estimatedDelivery: 'تجهيز وتسليم فوري',
        notes: notes.trim() || undefined,
        pointsEarned: earnedPoints,
        pointsCredited: false,
        timeline: [],
      };

      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    }, 1000);
  };

  const whatsappMessage = completedOrder
    ? encodeURIComponent(
        (() => {
          const hasReward = completedOrder.items.some((i) => i.isLoyaltyReward);
          const itemsList = completedOrder.items
            .map((i) => {
              if (i.isLoyaltyReward) {
                return `🎁 ${i.productName} (1 كيلو مجاناً - استبدال 100 نقطة)`;
              }
              return `• ${i.productName} (${i.weightLabel}) × ${i.quantity} = ${i.price * i.quantity} ج`;
            })
            .join('\n');

          const paymentTitle =
            completedOrder.paymentMethod === 'cod'
              ? 'الدفع نقداً عند الاستلام'
              : completedOrder.paymentMethod === 'instapay'
              ? 'إنستاباي (InstaPay)'
              : completedOrder.paymentMethod === 'vodafone_cash'
              ? 'محفظة فودافون كاش'
              : 'بطاقة بنكية';

          return (
            `مرحباً بن هارون! لقد قمت بطلب جديد عبر المتجر الإلكتروني.\n\n` +
            `📋 رقم الطلب: ${completedOrder.orderNumber}\n` +
            `👤 اسم العميل: ${completedOrder.customerName}\n` +
            `📞 رقم الهاتف: ${completedOrder.customerPhone}\n\n` +
            (hasReward ? `🎁 [مكافأة الولاء]: تم استبدال 100 نقطة بكيلو بن فاخر مجاناً!\n\n` : '') +
            `الأصناف المطلوبة:\n${itemsList}\n\n` +
            `💰 المبلغ الإجمالي: ${completedOrder.total} جنيه\n` +
            `💳 طريقة الدفع: ${paymentTitle}\n` +
            (completedOrder.pointsEarned > 0
              ? `🏆 نقاط هذا الطلب: +${completedOrder.pointsEarned} نقطة (تُضاف للرصيد فور تأكيد أستاذ ثروت)\n`
              : '') +
            (completedOrder.notes ? `📝 ملاحظات: ${completedOrder.notes}\n` : '') +
            `\nيرجى تأكيد تجهيز الطلب. شكراً لكم!`
          );
        })()
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FBF8F3] border border-[#DECFBE] rounded-3xl max-w-xl w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 bg-[#F4EBE1] border-b border-[#EADBCE] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#2C1810]">
              {completedOrder ? 'تم تأكيد طلبك بنجاح!' : 'تأكيد الطلب وبيانات الدفع'}
            </h3>
            <p className="text-xs text-[#7A6958] font-tajawal">
              {completedOrder ? 'شكراً لثقتك في بن هارون' : 'أدخل اسمك ورقم هاتفك لاكتمال الطلب'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A6958] hover:bg-[#EADBCE] transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {completedOrder ? (
            /* Post-Order Success Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50 text-2xl">
                <i className="fa-solid fa-check"></i>
              </div>

              <div>
                <span className="text-xs font-bold text-[#8C5E35] block mb-1">تم استلام طلبك بنجاح</span>
                <h4 className="text-2xl font-bold font-amiri text-[#2C1810]">
                  شكراً يا {completedOrder.customerName}، تم تسجيل طلبك!
                </h4>
                <div className="mt-3 inline-flex items-center gap-2 bg-[#F4EBE1] border border-[#DECFBE] px-4 py-2 rounded-xl text-sm font-mono font-bold text-[#2C1810]">
                  <span>رقم الطلب:</span>
                  <span className="text-[#C5A059]">{completedOrder.orderNumber}</span>
                </div>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-right space-y-3 text-xs text-[#4D3E33]">
                {completedOrder.items.some((i) => i.isLoyaltyReward) && (
                  <div className="p-2.5 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-xl text-amber-900 font-bold flex items-center gap-2">
                    <i className="fa-solid fa-gift text-base text-[#C5A059]"></i>
                    <span>مكافأة الولاء: تم استبدال 100 نقطة بكيلو بن مجاني (1000 جم)!</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-2">
                  <span>المبلغ الإجمالي المطلوب:</span>
                  <strong className="text-base text-[#8C5E35] font-mono tabular-nums">{completedOrder.total} جنيه</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>طريقة الدفع المختارة:</span>
                  <strong className="text-[#2C1810]">
                    {completedOrder.paymentMethod === 'cod' && 'الدفع نقداً عند الاستلام'}
                    {completedOrder.paymentMethod === 'instapay' && 'إنستاباي (InstaPay)'}
                    {completedOrder.paymentMethod === 'vodafone_cash' && 'محفظة فودافون كاش'}
                    {completedOrder.paymentMethod === 'card' && 'بطاقة بنكية / ميزة'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>رقم الهاتف المسجل:</span>
                  <bdi dir="ltr" className="font-mono font-bold tracking-wider text-[#2C1810]">
                    {completedOrder.customerPhone}
                  </bdi>
                </div>
                {completedOrder.pointsEarned > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-[#F4EBE1] bg-amber-50/70 -mx-4 -mb-3 px-4 py-2.5 rounded-b-2xl border-dashed">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <span>🏆</span>
                      <span>نقاط الولاء لهذا الطلب:</span>
                    </span>
                    <div className="text-left">
                      <strong className="text-amber-900 font-bold font-mono text-sm block">+{completedOrder.pointsEarned} نقطة</strong>
                      <span className="text-[10px] text-amber-700 block">تُضاف لرصيدك فور تأكيد أستاذ ثروت</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/201275075046?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>تأكيد الطلب مع المحمصة عبر واتساب فوراً</span>
                </a>

                <a
                  href={`tel:${STORE_CONTACT.phone}`}
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#2C1810] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-phone text-[#C5A059]"></i>
                  <span>الاتصال مباشرة بالمحمصة:</span>
                  <bdi dir="ltr" className="font-mono font-bold tracking-wider">
                    01275075046
                  </bdi>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-semibold text-[#7A6958] hover:text-[#2C1810] cursor-pointer"
                >
                  العودة للمتجر
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Customer Info (Name and Phone only) */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#2C1810]">بيانات العميل للتواصل السريع:</h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">الاسم بالكامل:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد أحمد علي"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">رقم الهاتف / الواتساب:</label>
                    <input
                      type="tel"
                      required
                      placeholder="010 / 011 / 012 / 015..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">ملاحظات خاصة للمحمصة (اختياري):</label>
                    <input
                      type="text"
                      placeholder="مثال: يرجى تنعيم الطحنة جداً / زيادة الحبهان..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-3 border-t border-[#EADBCE]">
                <h4 className="font-bold text-sm text-[#2C1810]">طريقة الدفع المفضلة:</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                        : 'bg-white hover:bg-[#F4EBE1] text-[#3E2723] border-[#DECFBE]'
                    }`}
                  >
                    <i className="fa-solid fa-money-bill-wave text-base mb-1 text-[#C5A059] block"></i>
                    <strong className="block text-xs font-bold">عند الاستلام</strong>
                    <span className="text-[10px] opacity-80 block">نقداً للمندوب</span>
                  </button>

                  {/* InstaPay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      paymentMethod === 'instapay'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                        : 'bg-white hover:bg-[#F4EBE1] text-[#3E2723] border-[#DECFBE]'
                    }`}
                  >
                    <i className="fa-solid fa-bolt text-base mb-1 text-[#C5A059] block"></i>
                    <strong className="block text-xs font-bold">إنستاباي</strong>
                    <span className="text-[10px] opacity-80 block">تحويل فوري IPA</span>
                  </button>

                  {/* Vodafone Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      paymentMethod === 'vodafone_cash'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                        : 'bg-white hover:bg-[#F4EBE1] text-[#3E2723] border-[#DECFBE]'
                    }`}
                  >
                    <i className="fa-solid fa-mobile-screen-button text-base mb-1 text-[#C5A059] block"></i>
                    <strong className="block text-xs font-bold">فودافون كاش</strong>
                    <span className="text-[10px] opacity-80 block">ومحافظ المحمول</span>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                        : 'bg-white hover:bg-[#F4EBE1] text-[#3E2723] border-[#DECFBE]'
                    }`}
                  >
                    <i className="fa-solid fa-credit-card text-base mb-1 text-[#C5A059] block"></i>
                    <strong className="block text-xs font-bold">بطاقة بنكية</strong>
                    <span className="text-[10px] opacity-80 block">فيزا / ميزة</span>
                  </button>
                </div>

                {/* Sub-panels based on payment method */}
                {paymentMethod === 'instapay' && (
                  <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C1810]">حساب إنستاباي بن هارون:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(STORE_CONTACT.instapayAccount)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#3E2723] text-[#F9EBD8] rounded-lg font-bold text-xs cursor-pointer hover:bg-[#2C1810]"
                      >
                        <i className={`fa-solid ${copiedText === STORE_CONTACT.instapayAccount ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                        <span>{copiedText === STORE_CONTACT.instapayAccount ? 'تم النسخ' : 'نسخ الحساب'}</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl font-mono text-center text-sm font-bold text-[#2C1810] border border-[#DECFBE]" dir="ltr">
                      {STORE_CONTACT.instapayAccount}
                    </div>
                    <p className="text-[#6B5A4D] text-[11px] leading-relaxed font-tajawal">
                      قم بفتح تطبيق InstaPay وتحويل المبلغ <strong>({grandTotal} جنيه)</strong>، ثم اكتب اسم حسابك المحول منه هنا:
                    </p>
                    <input
                      type="text"
                      placeholder="اسم حسابك أو رقم مرجع التحويل (اختياري)"
                      value={instapayRef}
                      onChange={(e) => setInstapayRef(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810]"
                    />
                  </div>
                )}

                {paymentMethod === 'vodafone_cash' && (
                  <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C1810]">رقم محفظة فودافون كاش الرسمية:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(STORE_CONTACT.vodafoneCashNumber)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#3E2723] text-[#F9EBD8] rounded-lg font-bold text-xs cursor-pointer hover:bg-[#2C1810]"
                      >
                        <i className={`fa-solid ${copiedText === STORE_CONTACT.vodafoneCashNumber ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                        <span>{copiedText === STORE_CONTACT.vodafoneCashNumber ? 'تم النسخ' : 'نسخ الرقم'}</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl font-mono text-center text-base font-bold text-[#2C1810] border border-[#DECFBE]" dir="ltr">
                      <bdi dir="ltr" className="select-all tracking-wider">{STORE_CONTACT.vodafoneCashNumber}</bdi>
                    </div>
                    <p className="text-[#6B5A4D] text-[11px] leading-relaxed font-tajawal">
                      حول المبلغ <strong>({grandTotal} جنيه)</strong> عبر محفظتك، ثم أدخل رقم الهاتف الذي حولت منه:
                    </p>
                    <input
                      type="tel"
                      placeholder="رقم المحفظة التي تم التحويل منها (01...)"
                      value={walletSenderPhone}
                      onChange={(e) => setWalletSenderPhone(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810]"
                      dir="ltr"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE] space-y-3 text-xs">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                        <span>بوابة دفع إلكتروني آمنة 256-bit</span>
                      </span>
                      <span>Visa / Master / Meeza</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="الاسم على البطاقة"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="رقم البطاقة (16 رقم)"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] font-mono text-center"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Final Summary Strip */}
              <div className="p-4 rounded-2xl bg-white border border-[#DECFBE] space-y-2 text-xs text-[#4D3E33]">
                {items.some((i) => i.isLoyaltyReward) && (
                  <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-xl text-amber-900 font-bold text-xs mb-2">
                    <i className="fa-solid fa-crown text-[#C5A059]"></i>
                    <span>يشمل 1 كيلو بن فاخر مجاناً مقابل 100 نقطة ولاء (سيتم خصمها بعد تأكيد الطلب)</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-bold text-[#2C1810]">
                  <span>المبلغ الإجمالي للطلب:</span>
                  <span className="text-2xl font-bold font-tajawal text-[#8C5E35] font-mono tabular-nums">
                    {grandTotal} جنيه
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#3E2723] hover:bg-[#2C1810] active:scale-[0.99] disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-[#3E2723]/25 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد الطلب الآن</span>
                    <i className="fa-solid fa-arrow-left text-[#C5A059]"></i>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
