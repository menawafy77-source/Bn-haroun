import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  onAddToCartFromModal: (product: Product, size: '100g' | '250g') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  reviews,
  onAddReview,
  onAddToCartFromModal,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'brewing' | 'reviews'>('details');
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  if (!isOpen || !product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    onAddReview({
      productId: product.id,
      author: authorName.trim(),
      rating: newRating,
      comment: reviewComment.trim(),
      isVerified: true,
    });

    setSubmittedReview(true);
    setAuthorName('');
    setReviewComment('');
    setTimeout(() => {
      setSubmittedReview(false);
      setActiveTab('reviews');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FBF8F3] border border-[#DECFBE] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="relative p-6 bg-[#F4EBE1] border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-xl shadow-md">
              <i className="fa-solid fa-mug-hot"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold font-amiri text-[#2C1810]">{product.name}</h2>
              <div className="flex items-center gap-2 text-xs text-[#7A6958] mt-0.5">
                <span>{product.category === 'سادة' ? 'بن صافي خالي من الإضافات' : 'توليفة بحبهان هندي ومستكة'}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-[#C5A059] font-bold">
                  <i className="fa-solid fa-star text-xs"></i>
                  <span>{product.rating}</span>
                  <span>({productReviews.length} تقييم)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B5A4D] hover:bg-[#EADBCE] transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#EADBCE] bg-[#FBF8F3]">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#C5A059] text-[#3E2723]'
                : 'border-transparent text-[#7A6958] hover:text-[#2C1810]'
            }`}
          >
            تفاصيل ومميزات البن
          </button>
          <button
            onClick={() => setActiveTab('brewing')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'brewing'
                ? 'border-[#C5A059] text-[#3E2723]'
                : 'border-transparent text-[#7A6958] hover:text-[#2C1810]'
            }`}
          >
            طريقة التحضير المثالية
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#C5A059] text-[#3E2723]'
                : 'border-transparent text-[#7A6958] hover:text-[#2C1810]'
            }`}
          >
            <span>آراء العملاء والتقييمات</span>
            <span className="text-[11px] bg-[#EADBCE] text-[#3E2723] px-1.5 py-0.2 rounded-md font-bold">
              {productReviews.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] border border-[#DECFBE]">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-7 space-y-3">
                  <h3 className="font-bold text-base text-[#2C1810]">عن هذه التوليفة:</h3>
                  <p className="text-xs sm:text-sm text-[#5C4A3C] leading-relaxed font-tajawal">
                    {product.description}
                  </p>
                  
                  {/* Price breakdown */}
                  <div className="p-3 bg-[#F4EBE1] rounded-xl border border-[#DECFBE]">
                    <span className="text-xs font-bold text-[#8C5E35] block mb-1">الأسعار الرسمية المعتمدة:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {product.sizes.map((s) => (
                        <div key={s.weight} className="flex justify-between items-center text-[#2C1810]">
                          <span>{s.weightLabel}:</span>
                          <span className="font-bold tabular-nums font-mono">{s.price} جنيه</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Distinctive Features */}
              <div>
                <h4 className="font-bold text-sm text-[#2C1810] mb-3">ما يميز بن هارون:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#EADBCE]">
                      <i className="fa-solid fa-check text-emerald-600 mt-1 shrink-0 text-xs"></i>
                      <span className="text-xs text-[#4D3E33] leading-relaxed font-tajawal">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavor Profile */}
              <div>
                <h4 className="font-bold text-sm text-[#2C1810] mb-2">الملامح النكهية:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1.5 bg-[#F4EBE1] border border-[#DECFBE] rounded-xl text-xs font-bold text-[#3E2723]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brewing' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE]">
                <h3 className="font-bold text-base text-[#2C1810] font-amiri mb-1">
                  طريقة إعداد الفنجان المضبوط بوش ثقيل مع بن هارون
                </h3>
                <p className="text-xs text-[#6B5A4D] leading-relaxed font-tajawal">
                  اتبع هذه الخطوات البسيطة من خبراء المحمصة للحصول على فنجان ذو وش كثيف ونكهة متوازنة بدون أي مرارة:
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-[#EADBCE]">
                  <span className="w-7 h-7 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2C1810]">المعيار والمياه</h5>
                    <p className="text-xs text-[#6B5A4D] mt-0.5 leading-relaxed font-tajawal">
                      استخدم فنجان ماء بارد ومثلج من الثلاجة (الماء البارد يبطئ استخلاص القهوة ويسمح بتكوين وش أغنى).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-[#EADBCE]">
                  <span className="w-7 h-7 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2C1810]">معيار بن هارون والسكر</h5>
                    <p className="text-xs text-[#6B5A4D] mt-0.5 leading-relaxed font-tajawal">
                      ضع ملعقتين صغيرتين ممتلئتين (حوالي 8-10 جرام) من بن هارون، وأضف السكر حسب رغبتك.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-[#EADBCE]">
                  <span className="w-7 h-7 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2C1810]">التقليب قبل النار</h5>
                    <p className="text-xs text-[#6B5A4D] mt-0.5 leading-relaxed font-tajawal">
                      قلب القهوة مع الماء والسكر جيداً في الكنكة قبل وضعها على النار، حتى يذوب البن تماماً.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-[#EADBCE]">
                  <span className="w-7 h-7 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                    4
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2C1810]">التسوية على نار هادئة جداً (شمعة)</h5>
                    <p className="text-xs text-[#6B5A4D] mt-0.5 leading-relaxed font-tajawal">
                      ضع الكنكة على أهدأ شعلة لديك، واتركها تصعد ببطء بدون تقليب إضافي حتى يرتفع الوش الكثيف الذهبي، ثم صب الوش أولاً برفق في الفنجان.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="space-y-3.5">
                <h4 className="font-bold text-sm text-[#2C1810]">مراجعات وتجارب الزبائن:</h4>
                {productReviews.length === 0 ? (
                  <p className="text-xs text-[#7A6958] py-4 text-center">كن أول من يقيم هذا البن الرائع!</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-white border border-[#EADBCE] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2C1810]">{rev.author}</span>
                          {rev.isVerified && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                              <span>مشترٍ موثوق</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8C7A6B]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#C5A059]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fa-solid fa-star text-xs ${
                              star <= rev.rating ? 'text-[#C5A059]' : 'text-stone-300'
                            }`}
                          ></i>
                        ))}
                      </div>

                      <p className="text-xs text-[#5C4A3C] leading-relaxed font-tajawal">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Form */}
              <div className="pt-4 border-t border-[#EADBCE]">
                <div className="p-4 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE]">
                  <h4 className="font-bold text-sm text-[#2C1810] mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-pen-nib text-[#C5A059]"></i>
                    <span>أضف تقييمك وتجربتك لبن هارون</span>
                  </h4>

                  {submittedReview ? (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold text-center">
                      شكراً لتقييمك الراقي! تمت إضافة تجربتك بنجاح.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[#3E2723] block mb-1">تقييمك بالنجوم:</label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <i
                                className={`fa-solid fa-star text-lg ${
                                  star <= newRating ? 'text-[#C5A059]' : 'text-stone-300'
                                }`}
                              ></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#3E2723] block mb-1">اسمك الكريم:</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: أحمد عبد الله"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#3E2723] block mb-1">تعليقك وتجربتك مع الفنجان:</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="اكتب انطباعك عن ريحة البن، الوش، التحويجة..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-white border border-[#DECFBE] rounded-xl p-3 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>نشر التقييم الآن</span>
                        <i className="fa-solid fa-paper-plane text-[#C5A059]"></i>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-[#EADBCE] bg-[#F4EBE1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAddToCartFromModal(product, '250g');
                onClose();
              }}
              className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>إضافة عبوة 250 جم للسلة</span>
              <span className="tabular-nums text-[#C5A059] font-mono">
                ({product.sizes[1].price} ج)
              </span>
            </button>

            <button
              onClick={() => {
                onAddToCartFromModal(product, '100g');
                onClose();
              }}
              className="px-4 py-2.5 bg-white hover:bg-[#FBF8F3] text-[#3E2723] border border-[#DECFBE] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <span>100 جم ({product.sizes[0].price} ج)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#5A493B] hover:bg-[#EADBCE] rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
