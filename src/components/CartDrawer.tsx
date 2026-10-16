import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10 sm:pl-16">
        <div className="w-screen max-w-md bg-[#FBF8F3] border-r border-[#EADBCE] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#EADBCE] flex items-center justify-between bg-[#F4EBE1]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-lg shadow-sm">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2C1810]">سلة المشتريات</h3>
                <span className="text-xs text-[#7A6958]">
                  {items.length === 0 ? 'سلتك فارغة' : `${items.length} أصناف مضافة`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7A6958] hover:bg-[#EADBCE] transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EBE1] text-[#8C5E35] flex items-center justify-center mx-auto text-2xl border border-[#DECFBE]">
                  <i className="fa-solid fa-mug-hot"></i>
                </div>
                <h4 className="font-bold text-base text-[#2C1810]">سلة مشترياتك فارغة حالياً</h4>
                <p className="text-xs text-[#7A6958] max-w-xs mx-auto leading-relaxed font-tajawal">
                  استكشف تشكيلة بن هارون السادة والمحوج الطازج واختر وزنك ودرجة تحميصك المفضلة.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md inline-block"
                >
                  تصفح تشكيلة البن الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#EADBCE] flex items-start gap-3 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#DECFBE] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-bold text-xs sm:text-sm text-[#2C1810] truncate">
                        {item.productName}
                      </h5>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="حذف من السلة"
                      >
                        <i className="fa-regular fa-trash-can text-sm"></i>
                      </button>
                    </div>

                    <div className="text-[11px] text-[#7A6958] space-y-0.5 mt-0.5">
                      <div>الوزن: <strong className="text-[#2C1810]">{item.weightLabel}</strong></div>
                      {item.spiceLevel && (
                        <div>التحويجة: <strong className="text-[#8C5E35]">{item.spiceLevel}</strong></div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#F4EBE1] flex items-center justify-between">
                      {item.isLoyaltyReward ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF3EA] text-[#8C5E35] rounded-lg border border-[#DECFBE] text-xs font-bold">
                          <i className="fa-solid fa-crown text-[#C5A059]"></i>
                          <span>مكافأة 100 نقطة</span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-[#F4EBE1] rounded-lg p-0.5 border border-[#DECFBE]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#EADBCE] text-[#3E2723] cursor-pointer"
                          >
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-[#2C1810]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#EADBCE] text-[#3E2723] cursor-pointer"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      )}

                      {item.isLoyaltyReward ? (
                        <span className="font-extrabold text-xs sm:text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          0 ج (مجاناً)
                        </span>
                      ) : (
                        <span className="font-bold text-xs sm:text-sm text-[#2C1810] font-mono tabular-nums">
                          {item.price * item.quantity} ج
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Calculations */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EADBCE] bg-[#F4EBE1] space-y-4">
              {/* Total Calculation */}
              <div className="space-y-1.5 text-xs text-[#5C4A3C]">
                <div className="flex justify-between items-baseline pt-1 text-base font-bold text-[#2C1810]">
                  <span>إجمالي الطلب:</span>
                  <span className="text-2xl font-bold font-tajawal text-[#8C5E35] font-mono tabular-nums">
                    {total} جنيه
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#3E2723] hover:bg-[#2C1810] active:scale-[0.98] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#3E2723]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>متابعة إتمام الطلب وتحديد الدفع</span>
                <i className="fa-solid fa-arrow-left text-[#C5A059]"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
