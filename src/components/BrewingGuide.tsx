import React from 'react';

export const BrewingGuide: React.FC = () => {
  return (
    <section id="brewing" className="py-10 bg-[#F4EBE1] border-t border-[#EADBCE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#C5A059]/40 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C5E35] text-white flex items-center justify-center shrink-0 text-2xl shadow-md">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <div className="text-right flex-1 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FAF3EA] text-[#8C5E35] text-xs font-bold border border-[#DECFBE]">
              <i className="fa-solid fa-crown text-[#C5A059]"></i>
              <span>نصيحة خبراء بن هارون 1985</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-amiri text-[#2C1810]">
              سر الحفاظ على عراقة النكهة وثبات الوش
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4A3C] leading-relaxed font-tajawal">
              يُفضل دائماً حفظ عبوة البن في مكان جاف ومعتم أو داخل الفريزر في عبوتها المحكمة بصمام عزل الهواء للحفاظ على الزيوت العطرية والنكهة الطازجة لأطول فترة ممكنة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
