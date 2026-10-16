import React, { useState } from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    // Construct WhatsApp message with user query
    const text = encodeURIComponent(
      `مرحباً بن هارون!\nالاسم: ${name}\nرقم الهاتف: ${phone}\nالرسالة: ${message || 'استفسار عن طلب البن'}`
    );
    window.open(`https://wa.me/201275075046?text=${text}`, '_blank');

    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-16 bg-[#F4EBE1] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Contact Details & Hotline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5E35] px-3 py-1 bg-white rounded-full border border-[#DECFBE]">
              <i className="fa-solid fa-headset text-[#C5A059]"></i>
              <span>خدمة العملاء والطلبات المباشرة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810]">
              تواصل مع محامص بن هارون
            </h2>

            <p className="text-sm text-[#5C4A3C] leading-relaxed font-tajawal">
              فريقنا جاهز لمساعدتك في اختيار الطحنة والتحميصة المناسبة لجهازك أو رغبتك، وتوصيل طلبك في أسرع وقت ممكن.
            </p>

            <div className="space-y-4 pt-2">
              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="p-4 rounded-2xl bg-white border border-[#EADBCE] flex items-center gap-4 hover:border-[#C5A059] transition-colors shadow-sm block"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <span className="text-xs text-[#7A6958] font-bold block">الخط الساخن والطلب السريع:</span>
                  <bdi dir="ltr" className="text-lg font-bold text-[#2C1810] font-mono tracking-wider block select-all">
                    01275075046
                  </bdi>
                </div>
              </a>

              <a
                href={STORE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-[#EADBCE] flex items-center gap-4 hover:border-[#25D366] transition-colors shadow-sm block"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-xl shrink-0">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <span className="text-xs text-[#7A6958] font-bold block">محادثة واتساب مباشرة:</span>
                  <span className="text-sm font-bold text-[#2C1810]">تحدث معنا لحظياً على مدار الساعة</span>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-white border border-[#EADBCE] flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF8F3] text-[#8C5E35] flex items-center justify-center text-xl shrink-0 border border-[#DECFBE]">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div>
                  <span className="text-xs text-[#7A6958] font-bold block">ساعات العمل الرسمية:</span>
                  <span className="text-xs font-bold text-[#2C1810]">{STORE_CONTACT.workingHours}</span>
                </div>
              </div>

              {/* Outlet & Payment Channels Quick Info */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#F4EBE1] border border-[#DECFBE] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#2C1810]">
                  <i className="fa-solid fa-location-dot text-[#C5A059]"></i>
                  <span>المنفذ الرسمي: مدينة السادس من أكتوبر - محافظة الجيزة</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EADBCE] text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#3E2723]">
                    <span className="font-bold text-[#8C5E35]">إنستاباي:</span>
                    <span className="font-mono font-bold select-all">{STORE_CONTACT.instapayAccount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#3E2723]">
                    <span className="font-bold text-red-700">فودافون كاش:</span>
                    <span className="font-mono font-bold select-all">{STORE_CONTACT.vodafoneCashNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#DECFBE] rounded-3xl p-6 sm:p-8 shadow-md">
              <h3 className="font-extrabold text-xl font-amiri text-[#2C1810] mb-2">
                أرسل استفسارك أو طلبك الفوري
              </h3>
              <p className="text-xs text-[#6B5A4D] mb-6 font-tajawal">
                سيتواصل معك ممثل خدمة عملاء بن هارون مباشرة لتأكيد تفاصيل البن.
              </p>

              {sent ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center space-y-2">
                  <i className="fa-solid fa-circle-check text-3xl text-emerald-600 block"></i>
                  <strong className="block text-sm">تم فتح محادثة الواتساب بنجاح!</strong>
                  <p className="text-xs">سيسعدنا خدمتك وتلبية طلبك فوراً.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1.5">اسمك الكريم:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: أحمد عبد الله"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FBF8F3] border border-[#DECFBE] rounded-xl px-4 py-2.5 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1.5">رقم الهاتف / الواتساب:</label>
                      <input
                        type="tel"
                        required
                        placeholder="010 / 011 / 012 / 015..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#FBF8F3] border border-[#DECFBE] rounded-xl px-4 py-2.5 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1.5">الرسالة أو الطلب المخصص:</label>
                    <textarea
                      rows={4}
                      placeholder="اكتب استفسارك، أو الكمية التي ترغب بطلبها ونوع التحميص..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#FBF8F3] border border-[#DECFBE] rounded-xl p-4 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#3E2723] hover:bg-[#2C1810] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>إرسال الرسالة إلى خدمة العملاء</span>
                    <i className="fa-brands fa-whatsapp text-[#25D366] text-base"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
