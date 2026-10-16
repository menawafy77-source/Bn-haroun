import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-16 bg-[#F4EBE1] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image Showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-[#2C1810]">
              <img
                src="/beans_roasting_craft_1791931205298.jpg"
                alt="محامص بن هارون - سر التحميص الحرفي"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 p-3.5 bg-black/70 backdrop-blur-md rounded-2xl text-white text-xs border border-white/10">
                <span className="font-bold text-[#C5A059] block mb-0.5">درجة تحميص متوازنة بدون حرق</span>
                <span className="text-[#D8C7B5] text-[11px]">تحافظ على الزيوت العطرية وكثافة قوام الفنجان العربي والوش الذهبي.</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5E35] px-3 py-1 bg-white rounded-full border border-[#DECFBE]">
              <i className="fa-solid fa-fire-flame-curved text-[#C5A059]"></i>
              <span>سر الخلطة وعراقة المحمصة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810] leading-snug">
              قصة «بن هارون».. عشق حبّة البن وأصالة التوليفة
            </h2>

            <p className="text-sm sm:text-base text-[#5A493B] leading-relaxed font-tajawal">
              في بن هارون، لم يكن الهدف مجرد بيع القهوة؛ بل إحياء طقوس فنجان الصباح والمساء كما عرفته بيوت الأصالة المصرية والعربية. نعتمد على معادلة دقيقة تجمع بين جودة الحبة وسر الصنعة:
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#EADBCE] shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#FBF8F3] text-[#C5A059] border border-[#DECFBE] flex items-center justify-center shrink-0 mt-0.5 text-base">
                  <i className="fa-solid fa-mug-hot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2C1810]">طحن فوري مخصص لكل عميل</h4>
                  <p className="text-xs text-[#6B5A4D] mt-1 leading-relaxed">
                    لا نترك البن مطحوناً على الرفوف لتفقد زيوته العطرية! كيس البن الخاص بك يُطحن ويُغلق حرارياً بعد ضغط زر الطلب مباشرة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#EADBCE] shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#FBF8F3] text-[#C5A059] border border-[#DECFBE] flex items-center justify-center shrink-0 mt-0.5 text-base">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2C1810]">حبهان أخضر هندي حبة كاملة</h4>
                  <p className="text-xs text-[#6B5A4D] mt-1 leading-relaxed">
                    نرفض بودرة الحبهان مجهولة المصدر؛ نستخدم حبات الحبهان الأخضر الهندي الفاخرة ونطحنها طازجة مع البن والمستكة اليونانية.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#EADBCE] shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#FBF8F3] text-[#C5A059] border border-[#DECFBE] flex items-center justify-center shrink-0 mt-0.5 text-base">
                  <i className="fa-solid fa-tag"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2C1810]">أرخص وأعدل سعر في السوق</h4>
                  <p className="text-xs text-[#6B5A4D] mt-1 leading-relaxed">
                    مباشرة من أفران التحميص إليك دون وسطاء، مما يمكننا من تقديم السعر الأفضل دائماً: 100 جم سادة بـ 70 ج ومحوج بـ 85 ج.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
