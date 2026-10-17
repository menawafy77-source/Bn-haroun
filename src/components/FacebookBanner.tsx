import React from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

export const FacebookBanner: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-[#1877F2]/10 via-[#FBF8F3] to-[#1877F2]/10 border-y border-[#1877F2]/20 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-[#1877F2]/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4.5 text-right">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center text-3xl shadow-lg shrink-0">
              <i className="fa-brands fa-facebook-f"></i>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877F2] bg-blue-50 px-3 py-1 rounded-full mb-1 border border-blue-200">
                <i className="fa-solid fa-users"></i>
                <span>انضم إلى مجتمع محبي قهوة هارون</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-amiri text-[#2C1810]">
                تابع صفحتنا الرسمية على فيسبوك (Brandworid)
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4A3C] font-tajawal mt-1">
                تابع أحدث عروض التحميص الطازج، مسابقات عشاق القهوة، وشاربوي الفنجان المظبوط معنا يومياً.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href={STORE_CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <i className="fa-brands fa-facebook text-lg group-hover:scale-110 transition-transform"></i>
              <span>زيارة صفحة الفيسبوك الآن</span>
              <i className="fa-solid fa-arrow-left text-xs mr-1 opacity-80"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
