import React, { useState } from 'react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.flavorNotes.some((n) => n.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FBF8F3] border border-[#DECFBE] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#EADBCE] flex items-center gap-3 bg-white">
          <i className="fa-solid fa-magnifying-glass text-[#8C5E35] text-lg"></i>
          <input
            type="text"
            autoFocus
            placeholder="ابحث في بن هارون (مثال: سادة، محوج، حبهان، تحميص وسط...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-tajawal text-[#2C1810] focus:outline-none placeholder-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A6958] hover:text-[#2C1810] transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#7A6958]">
              لا توجد نتائج مطابقة لبحثك. جرب البحث عن «سادة» أو «محوج».
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-white hover:bg-[#F4EBE1] border border-[#EADBCE] flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#DECFBE]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#2C1810]">{p.name}</h4>
                    <span className="text-[11px] text-[#7A6958] block">{p.subtitle}</span>
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-xs text-[#8C5E35]">
                  من {p.sizes[0].price} ج
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
