import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product, MehawegSpiceLevel } from '../types';
import { STORE_CONTACT } from '../data/coffeeData';

interface ProductsSectionProps {
  products: Product[];
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

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onAddToCart,
  onOpenDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'سادة' | 'محوج'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  return (
    <section id="products" className="py-16 bg-[#FBF8F3] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5E35] mb-2 px-3 py-1 bg-[#F4EBE1] rounded-full">
              <i className="fa-solid fa-mug-saucer text-[#C5A059]"></i>
              <span>تشكيلة القهوة المعتمدة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810]">
              متجر بن هارون الفاخر
            </h2>
            <p className="text-sm text-[#6B5A4D] mt-2 max-w-xl leading-relaxed font-tajawal">
              استكشف توليفاتنا الأصيلة: البن السادة النقي لمذاق القهوة الخالص، أو البن المحوج الملكي بأجود حبات الحبهان الأخضر والمستكة.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#F4EBE1] rounded-2xl self-start md:self-auto border border-[#DECFBE] shadow-inner">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#3E2723] text-white shadow-md'
                  : 'text-[#635143] hover:text-[#2C1810]'
              }`}
            >
              جميع التشكيلة
            </button>
            <button
              onClick={() => setActiveFilter('سادة')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'سادة'
                  ? 'bg-[#3E2723] text-white shadow-md'
                  : 'text-[#635143] hover:text-[#2C1810]'
              }`}
            >
              بن سادة (من 70 ج)
            </button>
            <button
              onClick={() => setActiveFilter('محوج')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'محوج'
                  ? 'bg-[#3E2723] text-white shadow-md'
                  : 'text-[#635143] hover:text-[#2C1810]'
              }`}
            >
              بن محوج (من 85 ج)
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>

        {/* Custom Blend Banner - Orouba Specialty Feature */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#1E120B] text-white border border-[#C5A059]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold">
              <i className="fa-solid fa-blender text-sm"></i>
              <span>توليفات خاصة للشركات والكافيهات وعشاق المزاج الخاص</span>
            </div>
            <h4 className="font-extrabold text-lg sm:text-xl font-amiri text-white">
              هل تبحث عن نسبة تحميص أو تحويجة مخصصة لذوقك؟
            </h4>
            <p className="text-xs sm:text-sm text-[#D8C7B5] max-w-xl leading-relaxed font-tajawal">
              خبراء التحميص في بن هارون مستعدون لتجهيز خلطتك الخاصة بالميزان ونوع الطحن الذي تفضله فوراً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#wholesale"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-all border border-white/20 flex items-center gap-2 shrink-0"
            >
              <i className="fa-solid fa-boxes-stacked text-[#C5A059]"></i>
              <span>خانة تجار الجملة (B2B)</span>
            </a>

            <a
              href={`${STORE_CONTACT.whatsappUrl}?text=${encodeURIComponent(
                'مرحباً بن هارون، أود الاستفسار عن خلطة بن مخصصة أو طلب كميات.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08d48] text-[#2C1810] text-xs sm:text-sm font-black rounded-xl transition-all shadow-md flex items-center gap-2.5 shrink-0"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span>طلب خلطة خاصة عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
