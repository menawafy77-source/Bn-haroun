import React, { useState } from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

export const BranchesSection: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 3000);
  };

  return (
    <section id="branches" className="py-16 sm:py-20 bg-[#FBF8F3] border-t border-[#EADBCE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5E35] mb-2 px-3.5 py-1.5 bg-[#F4EBE1] rounded-full border border-[#DECFBE]">
              <i className="fa-solid fa-store text-[#C5A059]"></i>
              <span>المنفذ الرسمي الحصري والمحمصة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810]">
              منفذ بن هارون المعتمد
            </h2>
            <p className="text-sm text-[#6B5A4D] mt-2 max-w-xl font-tajawal leading-relaxed">
              منفذ واحد رسمي ومعتمد في <strong className="text-[#2C1810]">مدينة السادس من أكتوبر - محافظة الجيزة</strong>، يخدم محبي القهوة الأصيلة مع خدمة شحن سريع لباب المنزل لكافة المحافظات.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#2C1810] block">شحن فوري لباب البيت</span>
              <span className="text-[11px] text-[#7A6958]">لجميع مناطق أكتوبر والشيخ زايد وكافة محافظات مصر</span>
            </div>
          </div>
        </div>

        {/* The Single Flagship Outlet Card */}
        <div className="bg-white border-2 border-[#C5A059]/50 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative mb-10">
          <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-[#C5A059] via-[#8C5E35] to-[#3E2723]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Main Column: Outlet Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#3E2723] text-[#F3C07B] font-bold text-xs">
                  المنفذ الوحيد المعتمد
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  مفتوح لاستقبالكم يومياً
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-amiri text-[#2C1810]">
                  منفذ ومحمصة بن هارون - مدينة 6 أكتوبر
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6958] mt-1 font-tajawal">
                  محافظة الجيزة · المقر الرسمي لإدارة وتحميص وطحن بن هارون
                </p>
              </div>

              {/* Key Location & Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#C5A059] flex items-center justify-center shrink-0 border border-[#DECFBE] shadow-xs">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#8C7A6B] block">العنوان والموقع:</span>
                    <span className="text-xs font-bold text-[#2C1810] leading-snug block mt-0.5">
                      مدينة السادس من أكتوبر - محافظة الجيزة
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#8C5E35] flex items-center justify-center shrink-0 border border-[#DECFBE] shadow-xs">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#8C7A6B] block">أوقات العمل الرسمية:</span>
                    <span className="text-xs font-bold text-[#2C1810] leading-snug block mt-0.5">
                      {STORE_CONTACT.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Outlet Services list */}
              <div className="p-4 rounded-2xl bg-[#F4EBE1]/60 border border-[#DECFBE]">
                <h4 className="text-xs font-bold text-[#3E2723] mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check text-[#C5A059]"></i>
                  <span>الخدمات المتوفرة مباشرة في المنفذ:</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#5C4A3C]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E35]"></span>
                    <span>تحميص مباشر وطازج</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E35]"></span>
                    <span>طحن فوري حسب الطلب</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E35]"></span>
                    <span>استلام فوري للطلبات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E35]"></span>
                    <span>تذوق الفنجان والتحويجة</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`tel:${STORE_CONTACT.phone}`}
                  className="px-4 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-[#F3C07B] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <i className="fa-solid fa-phone text-[#C5A059]"></i>
                  <span>اتصال بالمنفذ: {STORE_CONTACT.phone}</span>
                </a>

                <a
                  href={STORE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>واتساب المنفذ</span>
                </a>
              </div>
            </div>

            {/* Right Column: Official Payment Accounts Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#2C1810] via-[#3E2723] to-[#2C1810] text-white p-6 sm:p-7 rounded-3xl border-2 border-[#C5A059] shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[#F3C07B] text-xs font-bold">
                <i className="fa-solid fa-shield-halved"></i>
                <span>قنوات الدفع الرسمية المعتمدة للمنفذ:</span>
              </div>

              {/* InstaPay */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#2C1810] flex items-center justify-center font-bold text-xs">
                      IP
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">حساب إنستاباي (InstaPay):</span>
                      <span className="text-[10px] text-[#E8DEC8]">تحويل لحظي مباشر</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(STORE_CONTACT.instapayAccount, 'insta')}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    {copiedItem === 'insta' ? 'تم النسخ!' : 'نسخ'}
                  </button>
                </div>

                <div className="bg-black/30 p-2 rounded-xl text-center font-mono font-bold text-base text-[#F3C07B] tracking-wider select-all" dir="ltr">
                  {STORE_CONTACT.instapayAccount}
                </div>
              </div>

              {/* Vodafone Cash */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                      VC
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">فودافون كاش (Vodafone Cash):</span>
                      <span className="text-[10px] text-[#E8DEC8]">تحويل فودافون كاش للمنفذ</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(STORE_CONTACT.vodafoneCashNumber, 'voda')}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    {copiedItem === 'voda' ? 'تم النسخ!' : 'نسخ'}
                  </button>
                </div>

                <div className="bg-black/30 p-2 rounded-xl text-center font-mono font-bold text-base text-[#F3C07B] tracking-wider select-all" dir="ltr">
                  {STORE_CONTACT.vodafoneCashNumber}
                </div>
              </div>

              <p className="text-[11px] text-[#EADBCE] leading-relaxed text-center font-tajawal pt-1">
                يمكنك الدفع المسبق عبر إنستاباي أو فودافون كاش أو الدفع نقداً عند استلام طلبك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
