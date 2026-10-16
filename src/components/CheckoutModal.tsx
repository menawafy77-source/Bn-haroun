import React, { useState } from 'react';
import { Order, CartItem } from '../types';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من إدخال رقم التحويل في حالة الدفع الإلكتروني
    if (paymentMethod !== 'cash' && !transferNumber.trim()) {
      alert('يرجى إدخال رقم التحويل الخاص بالدفع الإلكتروني لتأكيد الطلب.');
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const paymentLabel = 
      paymentMethod === 'vodafone_cash' ? 'فودافون كاش' :
      paymentMethod === 'instapay' ? 'إنستاباي' : 'الدفع عند الاستلام';

    // تجهيز رسالة الواتساب مع تفاصيل الدفع ورقم التحويل
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

    // فتح الواتساب للمحمصة
    const whatsappUrl = `https://wa.me/201275075046?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // حفظ الطلب في النظام لمكتب أستاذ ثروت
    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone: phone,
      customerAddress: address,
      items: [...items],
      total: subtotal,
      status: 'placed',
      date: new Date().toLocaleString('ar-EG'),
      // حفظ بيانات الدفع ضمن الطلب
      paymentMethod: paymentLabel as any,
      notes: paymentMethod !== 'cash' ? `رقم التحويل: ${transferNumber}` : undefined,
    } as any;

    onOrderSuccess(newOrder);

    // تصفير الخانات للطلب القادم
    setCustomerName('');
    setPhone('');
    setAddress('');
    setTransferNumber('');
    setPaymentMethod('cash');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-[#FBF8F3] text-[#2C1810] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#C5A059]/30 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-[#E6D5BE] pb-3">
          <h2 className="text-xl font-bold text-[#4A2C11]">إتمام الطلب وتأكيد الشراء</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </div>
  );
};
