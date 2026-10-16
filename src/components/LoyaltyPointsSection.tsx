import React, { useState } from 'react';
import { CartItem, Order } from '../types';

interface LoyaltyPointsSectionProps {
  loyaltyPoints?: number;
  onRedeemReward?: () => void;
  hasRedeemedInCart?: boolean;
  orders?: Order[];
  cartItems?: CartItem[];
  onOpenCart?: () => void;
  onExploreProducts?: () => void;
}

export const LoyaltyPointsSection: React.FC<LoyaltyPointsSectionProps> = ({
  loyaltyPoints = 100,
  onRedeemReward,
  hasRedeemedInCart = false,
  orders,
  cartItems = [],
  onOpenCart,
  onExploreProducts,
}) => {
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState(false);

  // Calculate cart points (كيس صغير = 1 نقطة | كيس كبير = 3 نقاط)
  const cartPoints = cartItems.reduce((acc, item) => {
    if (item.isLoyaltyReward) return acc;
    const ptsPerBag = item.weight === '100g' ? 1 : 3;
    return acc + ptsPerBag * item.quantity;
  }, 0);

  const handleRedeemClick = () => {
    if (onRedeemReward) {
      onRedeemReward();
      setRedeemSuccessMsg(true);
      setTimeout(() => setRedeemSuccessMsg(false), 5000);
    }
  };

  return (
    <section id="loyalty" className="py-16 sm:py-20 bg-gradient-to-b from-[#FBF8F3] via-[#F4EBE1] to-[#FBF8F3] border-b border-[#EADBCE] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#8C5E35]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3E2723] text-[#F3C07B] text-xs font-bold mb-4 shadow-sm border border-[#C5A059]/40">
            <i className="fa-solid fa-crown text-[#C5A059]"></i>
            <span>نادي ولاء بن هارون · 100 نقطة بكيلو</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-amiri text-[#2C1810] tracking-tight leading-tight">
            نظام النقاط والمكافأة الكبرى
          </h2>

          <p className="text-sm sm:text-base text-[#7A6958] mt-3 font-tajawal leading-relaxed">
            نظام مكافآت مباشر وبسيط: كل كيس تشتريه يمنحك نقاطاً تلقائية، وعند الوصول لـ <strong className="text-[#2C1810] font-black">100 نقطة</strong> تستلم <strong className="text-[#8C5E35] font-black">كيلو بن كامل مجاناً</strong> هدية من أستاذ ثروت الهارون.
          </p>
        </div>

        {/* 1. Point Collection Rules (طريقة جمع النقاط) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {/* Rule 1: Small Bag */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#D9CABB] hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F4EBE1] text-[#8C5E35] group-hover:bg-[#8C5E35] group-hover:text-white flex items-center justify-center text-3xl transition-colors shrink-0 shadow-inner">
              <i className="fa-solid fa-mug-hot"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#8C7A6B] block">كيس صغير (100 جرام)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-amiri text-[#2C1810]">
                  1 نقطة
                </span>
                <span className="text-xs text-[#7A6958] font-bold">لكل كيس</span>
              </div>
              <p className="text-xs text-[#7A6958] mt-1.5 leading-relaxed font-tajawal">
                تحصل على نقطة واحدة مباشرة عن كل كيس سادة أو محوج 100 جم.
              </p>
            </div>
          </div>

          {/* Rule 2: Large Bag */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#D9CABB] hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF4ED] text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#2C1810] flex items-center justify-center text-3xl transition-colors shrink-0 shadow-inner">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#8C7A6B] block">كيس كبير (250 جرام)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-amiri text-[#2C1810]">
                  3 نقاط
                </span>
                <span className="text-xs text-[#7A6958] font-bold">لكل كيس (أسرع 3 أضعاف)</span>
              </div>
              <p className="text-xs text-[#7A6958] mt-1.5 leading-relaxed font-tajawal">
                تحصل على 3 نقاط كاملة عن كل كيس ربع كيلو (250 جم).
              </p>
            </div>
          </div>
        </div>

        {/* Current Cart Points Notification (if cart has items) */}
        {cartItems.length > 0 && (
          <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-5 bg-gradient-to-r from-[#FAF4ED] via-[#F4EBE1] to-[#FAF4ED] rounded-2xl border-2 border-[#C5A059]/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#2C1810] flex items-center justify-center text-lg font-bold shadow-xs">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#2C1810]">
                  سلة مشترياتك الحالية بها {cartItems.reduce((s, i) => s + i.quantity, 0)} منتج
                </h4>
                <p className="text-xs text-[#7A6958]">
                  إتمام هذا الطلب سيضيف إلى رصيدك <strong className="text-[#8C5E35] font-black">{cartPoints} نقطة جديدة</strong> نحو مكافأة الكيلو المجاني!
                </p>
              </div>
            </div>

            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="px-4 py-2 bg-[#3E2723] hover:bg-[#2C1810] text-[#F3C07B] hover:text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                عرض السلة ({cartPoints} نقطة)
              </button>
            )}
          </div>
        )}

        {/* 2. The Grand Reward Showcase (مكافأة الـ 100 نقطة فقط) */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#2C1810] via-[#3E2723] to-[#2C1810] text-white rounded-3xl border-2 border-[#C5A059] shadow-2xl p-7 sm:p-10 relative overflow-hidden ring-4 ring-[#C5A059]/30">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left Content */}
            <div className="space-y-4 text-center lg:text-right flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-[#C5A059] text-[#2C1810] text-xs font-black shadow-md">
                <i className="fa-solid fa-star"></i>
                <span>المكافأة المعتمدة · 100 نقطة بكيلو</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-white leading-tight">
                1 كيلو بن فاخر مجاناً
              </h3>

              <p className="text-sm text-[#F3C07B] font-bold font-tajawal">
                هدية خاصة من أستاذ ثروت الهارون عند تجميع 100 نقطة
              </p>

              <p className="text-xs sm:text-sm text-[#E8DEC8] leading-relaxed font-tajawal max-w-xl">
                بمجرد وصول رصيدك إلى 100 نقطة، تستلم كيلو بن كامل (1000 جرام) طازج ومطحون حسب رغبتك — اختر بين بن هارون سادة فاخر أو بن هارون محوج ملكي بالحبهان والمستكة، مع توصيل مجاني لباب منزلك.
              </p>

              {/* Reward Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                  <i className="fa-solid fa-scale-balanced text-base text-[#F3C07B] block mb-1"></i>
                  <span className="font-bold text-white block">1000 جرام كاملة</span>
                  <span className="text-[10px] text-[#D9CABB]">كيلو بن صافي</span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                  <i className="fa-solid fa-award text-base text-[#F3C07B] block mb-1"></i>
                  <span className="font-bold text-white block">سادة أو محوج</span>
                  <span className="text-[10px] text-[#D9CABB]">اختيارك المفضل</span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                  <i className="fa-solid fa-truck-fast text-base text-[#F3C07B] block mb-1"></i>
                  <span className="font-bold text-white block">توصيل مجاني</span>
                  <span className="text-[10px] text-[#D9CABB]">لكل المحافظات</span>
                </div>
              </div>
            </div>

            {/* Right Card / CTA */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-[#C5A059]/50 text-center w-full lg:w-72 shrink-0 space-y-4 shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C5E35] text-[#2C1810] flex items-center justify-center text-3xl shadow-lg">
                <i className="fa-solid fa-crown"></i>
              </div>

              <div>
                <span className="text-xs text-[#EADBCE] block">رصيد نقاطك الحالي:</span>
                <span className="text-3xl font-black font-amiri text-[#F3C07B] tabular-nums">
                  {loyaltyPoints} نقطة
                </span>
                <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden mt-2 border border-white/20">
                  <div
                    className="bg-gradient-to-r from-[#C5A059] to-amber-300 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (loyaltyPoints / 100) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#D9CABB] block mt-1">
                  {loyaltyPoints >= 100
                    ? '🎉 مبروك! يمكنك استبدال 100 نقطة بكيلو بن مجاني الآن'
                    : `متبقي ${100 - loyaltyPoints} نقطة للحصول على الكيلو المجاني`}
                </span>
              </div>

              {/* Redemption Action */}
              <div className="pt-2">
                {hasRedeemedInCart ? (
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <i className="fa-solid fa-circle-check text-base"></i>
                    <span>كيلو البن بالسلة! (عرض السلة)</span>
                  </button>
                ) : loyaltyPoints >= 100 ? (
                  <button
                    type="button"
                    onClick={handleRedeemClick}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#2C1810] font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ring-2 ring-white/40 animate-pulse"
                    title="استبدال 100 نقطة وإضافة كيلو بن مجاني لسلة المشتريات"
                  >
                    <i className="fa-solid fa-gift text-base"></i>
                    <span>استبدال 100 نقطة بكيلو مجاني</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onExploreProducts}
                    className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-bag-shopping text-[#C5A059]"></i>
                    <span>تسوق واجمع {100 - loyaltyPoints} نقطة</span>
                  </button>
                )}

                <span className="text-[10px] text-[#E8DEC8] block mt-2 leading-relaxed">
                  عند إتمام الشراء، يتم خصم 100 نقطة وتأكيد طلب الكيلو على واتساب.
                </span>
              </div>

              {onExploreProducts && (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-bag-shopping text-[#C5A059]"></i>
                  <span>تسوق تشكيلة البن</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Redeem toast feedback */}
        {redeemSuccessMsg && (
          <div className="max-w-xl mx-auto mt-6 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 animate-fadeIn">
            <i className="fa-solid fa-circle-check text-lg text-emerald-200 shrink-0"></i>
            <span>
              تمت إضافة كيلو بن فاخر مجاناً إلى سلة مشترياتك! اضغط على السلة لتأكيد الطلب عبر واتساب وسيتم خصم 100 نقطة من رصيدك.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
