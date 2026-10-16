import React, { useState } from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

export const WholesaleSection: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [quantityKg, setQuantityKg] = useState('10 كجم');
  const [coffeeType, setCoffeeType] = useState('بن محوج ملكي');
  const [roastDegree, setRoastDegree] = useState('وسط متوازن');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendWholesaleWhatsapp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const text =
      `*طلب توريد جملة - بن هارون 1985*\n\n` +
      `🏢 المنشأة: ${businessName.trim() || 'كافيه / محمصة'}\n` +
      `👤 المسؤول: ${contactName.trim() || 'غير محدد'}\n` +
      `📞 الهاتف: ${phone.trim() || 'غير محدد'}\n` +
      `📍 المحافظة: ${governorate}\n` +
      `📦 الكمية المطلوبة: ${quantityKg}\n` +
      `☕ نوع البن: ${coffeeType}\n` +
      `🔥 درجة التحميص: ${roastDegree}\n` +
      (notes.trim() ? `📝 ملاحظات: ${notes.trim()}\n` : '') +
      `\nبرجاء إرسال تفاصيل التوريد وموعد التسليم. شكراً!`;

    window.open(`https://wa.me/201275075046?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  const PACKAGES = [
    { title: '5 كجم', subtitle: 'للكافيهات الناشئة' },
    { title: '10 كجم', subtitle: 'للمقاهي النشطة' },
    { title: '25 كجم', subtitle: 'شيكارة جملة معتمدة' },
    { title: '50 كجم فأكثر', subtitle: 'لكبار الموزعين والسلاسل' },
  ];

  return (
    <section id="wholesale" className="py-14 sm:py-20 bg-[#1E120B] text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#8C5E35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#F3C07B] text-xs font-bold mb-3">
            <i className="fa-solid fa-boxes-stacked text-[#C5A059]"></i>
            <span>تجار الجملة والكافيهات · B2B</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-white tracking-tight leading-tight">
            توريد بن هارون للكافيهات والمحامص
          </h2>

          <p className="text-xs sm:text-sm text-[#D8C7B5] mt-2 font-tajawal">
            توريد بن طازج ومطحون حسب الطلب بأسعار خاصة للمقاهي والمحامص في جميع المحافظات.
          </p>
        </div>

        {/* Simple Packages Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.title}
              type="button"
              onClick={() => setQuantityKg(pkg.title)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                quantityKg === pkg.title
                  ? 'bg-[#3E2723] border-[#C5A059] shadow-lg ring-2 ring-[#C5A059]/50 text-white'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-[#D8C7B5]'
              }`}
            >
              <div className="text-lg sm:text-xl font-black font-amiri text-white mb-0.5">
                {pkg.title}
              </div>
              <div className="text-[11px] text-[#C5A059] font-medium">
                {pkg.subtitle}
              </div>
            </button>
          ))}
        </div>

        {/* Wholesale Request Form */}
        <div className="bg-[#271910] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="font-bold text-base sm:text-lg text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-[#C5A059]"></i>
            <span>طلب أسعار وتوريد جملة</span>
          </h3>

          <form onSubmit={handleSendWholesaleWhatsapp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">اسم الكافيه أو المنشأة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كافيه السلطان"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">اسم المسؤول:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أ/ أحمد محمود"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">رقم الهاتف / الواتساب:</label>
                <input
                  type="tel"
                  required
                  placeholder="010 / 011 / 012 / 015..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">المحافظة:</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="الجيزة - 6 أكتوبر">الجيزة - مدينة 6 أكتوبر</option>
                  <option value="الجيزة - الشيخ زايد">الجيزة - الشيخ زايد</option>
                  <option value="الجيزة">الجيزة (الهرم وفيصل والدقي)</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الإسكندرية والساحل">الإسكندرية والساحل الشمالي</option>
                  <option value="محافظات الدلتا">محافظات الدلتا</option>
                  <option value="محافظات الصعيد">محافظات الصعيد</option>
                  <option value="البحر الأحمر والقناة">البحر الأحمر ومحافظات القناة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">الكمية المطلوبة:</label>
                <select
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="5 كجم">5 كجم</option>
                  <option value="10 كجم">10 كجم</option>
                  <option value="15 كجم">15 كجم</option>
                  <option value="25 كجم (شيكارة)">25 كجم (شيكارة)</option>
                  <option value="50 كجم فأكثر">50 كجم فأكثر</option>
                  <option value="100 كجم فأكثر">100 كجم فأكثر</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">نوع البن:</label>
                <select
                  value={coffeeType}
                  onChange={(e) => setCoffeeType(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="بن محوج ملكي">بن محوج ملكي</option>
                  <option value="بن سادة فاخر">بن سادة فاخر</option>
                  <option value="إسبريسو بلند">إسبريسو بلند</option>
                  <option value="حبوب خضراء نيئة">حبوب خضراء غير محمصة</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#D8C7B5] block mb-1">درجة التحميص:</label>
                <select
                  value={roastDegree}
                  onChange={(e) => setRoastDegree(e.target.value)}
                  className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="فاتح">فاتح</option>
                  <option value="وسط متوازن">وسط متوازن</option>
                  <option value="غامق">غامق</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#D8C7B5] block mb-1">ملاحظات إضافية (اختياري):</label>
              <input
                type="text"
                placeholder="مثال: نوع ماكينة الإسبريسو أو مواعيد التوريد..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#1A0F0A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>إرسال الطلب عبر واتساب</span>
              </button>

              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-phone text-[#C5A059]"></i>
                <span>الاتصال بالمبيعات:</span>
                <bdi dir="ltr" className="font-mono font-bold tracking-wider">
                  01275075046
                </bdi>
              </a>
            </div>

            {submitted && (
              <div className="p-3 bg-emerald-600/90 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-fadeIn">
                <i className="fa-solid fa-circle-check text-base"></i>
                <span>تم إرسال الطلب بنجاح! سيتم التواصل معك فوراً من إدارة مبيعات بن هارون.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
