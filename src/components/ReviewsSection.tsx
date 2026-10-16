import React, { useState } from 'react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
}) => {
  const [filterProduct, setFilterProduct] = useState<'all' | 'haroun-sada' | 'haroun-mehaweg'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<'haroun-sada' | 'haroun-mehaweg'>('haroun-mehaweg');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const filteredReviews = reviews.filter((r) => {
    if (filterProduct === 'all') return true;
    return r.productId === filterProduct;
  });

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    onAddReview({
      productId: selectedProduct,
      author: authorName.trim(),
      rating,
      comment: comment.trim(),
      isVerified: true,
    });

    setSubmittedSuccess(true);
    setAuthorName('');
    setComment('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowAddForm(false);
    }, 2500);
  };

  const handleToggleLike = (id: string) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="reviews" className="py-16 bg-[#FBF8F3] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5E35] mb-2 px-3 py-1 bg-[#F4EBE1] rounded-full border border-[#DECFBE]">
              <i className="fa-solid fa-star text-[#C5A059]"></i>
              <span>تجارب متذوقي القهوة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810]">
              آراء وتقييمات زبائن بن هارون
            </h2>
            <p className="text-sm text-[#6B5A4D] mt-2 max-w-xl leading-relaxed font-tajawal">
              تجارب حقيقية لزبائننا في مختلف المحافظات مع البن السادة والمحوج بعد أول رشفة من الكنكة.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="self-start md:self-auto px-6 py-3 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'} text-[#C5A059]`}></i>
            <span>{showAddForm ? 'إلغاء النموذج' : 'شاركنا تقييم فنجانك'}</span>
          </button>
        </div>

        {/* Aggregate Ratings Strip */}
        <div className="p-6 rounded-3xl bg-white border border-[#EADBCE] mb-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center md:text-right md:border-l md:border-[#EADBCE] md:pl-6">
            <span className="text-4xl sm:text-5xl font-bold font-tajawal text-[#2C1810] tabular-nums">
              {averageRating}
            </span>
            <span className="text-sm font-normal text-[#7A6958] mr-2">من 5 نجوم</span>
            <div className="flex items-center justify-center md:justify-start gap-1 my-2 text-[#C5A059]">
              {[1, 2, 3, 4, 5].map((s) => (
                <i key={s} className="fa-solid fa-star text-sm"></i>
              ))}
            </div>
            <span className="text-xs text-[#7A6958]">بناءً على {reviews.length} تقييماً معتمداً</span>
          </div>

          <div className="md:col-span-8 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5 text-xs text-[#5C4A3C]">
              <div className="flex items-center gap-2">
                <span className="w-24 font-bold text-[#2C1810]">ثبات الوش:</span>
                <span className="font-bold text-emerald-800">99% ممتاز وكثيف</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 font-bold text-[#2C1810]">نقاء الطعم:</span>
                <span className="font-bold text-emerald-800">98% طبيعي بدون مرارة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 font-bold text-[#2C1810]">سرعة التوصيل:</span>
                <span className="font-bold text-emerald-800">97% في الموعد المحدد</span>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F4EBE1] rounded-xl border border-[#DECFBE]">
              <button
                onClick={() => setFilterProduct('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterProduct === 'all'
                    ? 'bg-[#3E2723] text-white shadow-sm'
                    : 'text-[#635143] hover:text-[#2C1810]'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterProduct('haroun-sada')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterProduct === 'haroun-sada'
                    ? 'bg-[#3E2723] text-white shadow-sm'
                    : 'text-[#635143] hover:text-[#2C1810]'
                }`}
              >
                البن السادة
              </button>
              <button
                onClick={() => setFilterProduct('haroun-mehaweg')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterProduct === 'haroun-mehaweg'
                    ? 'bg-[#3E2723] text-white shadow-sm'
                    : 'text-[#635143] hover:text-[#2C1810]'
                }`}
              >
                البن المحوج
              </button>
            </div>
          </div>
        </div>

        {/* Add Review Inline Form */}
        {showAddForm && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#F4EBE1] border border-[#DECFBE] shadow-md animate-scaleUp">
            <h3 className="font-extrabold text-base text-[#2C1810] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square text-[#C5A059]"></i>
              <span>إضافة تقييم جديد لمنتجات بن هارون</span>
            </h3>
            <p className="text-xs text-[#736254] mb-4 font-tajawal">
              يسعدنا سماع رأيك بخصوص نكهة القهوة وجودة التغليف وسرعة التوصيل.
            </p>

            {submittedSuccess ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                تم استلام تقييمك بنجاح وسيبقى معروضاً لجميع زوار المتجر! شكراً لذوقك.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">نوع البن:</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value as 'haroun-sada' | 'haroun-mehaweg')}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="haroun-mehaweg">بن هارون محوج ملكي</option>
                      <option value="haroun-sada">بن هارون سادة فاخر</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">اسمك الكريم:</label>
                    <input
                      type="text"
                      required
                      placeholder="اسمك أو لقبك"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-white border border-[#DECFBE] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#3E2723] block mb-1.5">تقييمك بالنجوم:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <i
                          className={`fa-solid fa-star text-xl ${
                            s <= rating ? 'text-[#C5A059]' : 'text-stone-300'
                          }`}
                        ></i>
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#8C5E35] mr-2">
                      {rating === 5 && 'ممتاز وفنجان مظبوط! ☕'}
                      {rating === 4 && 'جيد جداً'}
                      {rating === 3 && 'جيد'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#3E2723] block mb-1">رأيك وتجربتك بالتفصيل:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="صف لنا كيف كان الوش، طعم البن، والتحويجة..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border border-[#DECFBE] rounded-xl p-3 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs font-medium text-[#7A6958] hover:text-[#2C1810] cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>نشر التقييم الآن</span>
                    <i className="fa-solid fa-paper-plane text-[#C5A059]"></i>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => {
            const isLiked = likedReviews[rev.id];
            const currentLikes = rev.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white border border-[#EADBCE] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2C1810]">{rev.author}</span>
                      {rev.isVerified && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                          <span>مشترٍ موثوق</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8C7A6B]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-2.5 text-[#C5A059]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`fa-solid fa-star text-xs ${
                          s <= rev.rating ? 'text-[#C5A059]' : 'text-stone-300'
                        }`}
                      ></i>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C4A3C] leading-relaxed font-tajawal">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4EBE1] flex items-center justify-between text-xs text-[#8C7A6B]">
                  <span>
                    المنتج: {rev.productId === 'haroun-sada' ? 'بن سادة فاخر' : 'بن محوج ملكي'}
                  </span>
                  <button
                    onClick={() => handleToggleLike(rev.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isLiked ? 'text-[#8C5E35] font-bold bg-[#F4EBE1]' : 'hover:text-[#2C1810]'
                    }`}
                  >
                    <i className="fa-solid fa-thumbs-up text-xs"></i>
                    <span className="tabular-nums font-mono">{currentLikes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
