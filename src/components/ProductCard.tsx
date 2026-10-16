import React, { useState } from 'react';
import { Product, MehawegSpiceLevel } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: {
    productId: 'haroun-sada' | 'haroun-mehaweg';
    productName: string;
    category: string;
    weight: '100g' | '250g';
    weightLabel: string;
    price: number;
    spiceLevel?: MehawegSpiceLevel;
    quantity: number;
    image: string;
  }) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
}) => {
  // Only 100g and 250g
  const [selectedWeight, setSelectedWeight] = useState<'100g' | '250g'>('250g');
  const [selectedSpice, setSelectedSpice] = useState<MehawegSpiceLevel>('مخصوص متوازن');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currentSizeObj = product.sizes.find((s) => s.weight === selectedWeight) || product.sizes[1];
  const unitPrice = currentSizeObj.price;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      productName: product.name,
      category: product.category,
      weight: selectedWeight,
      weightLabel: currentSizeObj.weightLabel,
      price: unitPrice,
      spiceLevel: product.category === 'محوج' ? selectedSpice : undefined,
      quantity,
      image: product.image,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white border border-[#EADBCE] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-[#F4EBE1] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between pointer-events-auto">
          <span className="px-3.5 py-1 rounded-full bg-[#2C1810]/85 backdrop-blur-md text-[#F4EBE1] text-xs font-bold border border-[#C5A059]/30">
            {product.category === 'سادة' ? 'بن سادة صافي' : 'خلطة محوجة ملكية'}
          </span>
          <button
            onClick={() => onOpenDetails(product)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-[#2C1810] backdrop-blur-md text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-circle-info text-[#C5A059]"></i>
            <span>التفاصيل والنكهة</span>
          </button>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-white">
          <div className="flex items-center gap-1 bg-[#2C1810]/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
            <i className="fa-solid fa-star text-[#C5A059]"></i>
            <span className="font-bold tabular-nums">{product.rating}</span>
            <span className="text-[#D8C7B5]">({product.reviewsCount} تقييم)</span>
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          <h3 className="text-xl font-bold font-amiri text-[#2C1810] mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#6B5A4D] leading-relaxed line-clamp-2">
            {product.subtitle}
          </p>

          {/* Flavor Notes */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#8C5E35]">
            <span className="font-bold text-[#3E2723]">النوتات:</span>
            {product.flavorNotes.map((note, idx) => (
              <React.Fragment key={note}>
                <span>{note}</span>
                {idx < product.flavorNotes.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Interactive Weight Selection (100g or 250g only) */}
        <div className="space-y-4 pt-2 border-t border-[#EADBCE]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#3E2723]">اختر وزن العبوة:</label>
              <span className="text-[11px] text-[#8C7A6B]">
                {selectedWeight === '100g' ? 'حجم 100 جرام' : 'حجم 250 جرام (الأكثر طلباً)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s.weight}
                  onClick={() => setSelectedWeight(s.weight)}
                  className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    selectedWeight === s.weight
                      ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md ring-2 ring-[#C5A059]/40'
                      : 'bg-[#FBF8F3] hover:bg-[#F4EBE1] text-[#3E2723] border-[#DECFBE]'
                  }`}
                >
                  <span className="block font-bold text-sm">{s.weightLabel}</span>
                  <span className={`block text-xs font-mono tabular-nums mt-0.5 ${selectedWeight === s.weight ? 'text-[#C5A059]' : 'text-[#8C5E35]'}`}>
                    {s.price} جنيه
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Price & Quantity & Add CTA */}
        <div className="pt-4 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right w-full sm:w-auto">
            <span className="text-[11px] text-[#7A6958] block">المجموع:</span>
            <div className="text-2xl font-bold font-tajawal text-[#2C1810] tabular-nums">
              {totalPrice}{' '}
              <span className="text-sm font-normal text-[#6B5A4D]">جنيه</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#F4EBE1] rounded-xl p-1 border border-[#DECFBE]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#EADBCE] text-[#3E2723] transition-colors cursor-pointer"
                title="تقليل الكمية"
              >
                <i className="fa-solid fa-minus text-xs"></i>
              </button>
              <span className="w-7 text-center text-xs font-bold tabular-nums text-[#2C1810]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#EADBCE] text-[#3E2723] transition-colors cursor-pointer"
                title="زيادة الكمية"
              >
                <i className="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isAdded
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-[#3E2723] hover:bg-[#2C1810] active:scale-95 text-white shadow-[#3E2723]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <i className="fa-solid fa-check text-emerald-300"></i>
                  <span>تمت الإضافة بنجاح!</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bag-shopping text-[#C5A059]"></i>
                  <span>أضف للسلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
