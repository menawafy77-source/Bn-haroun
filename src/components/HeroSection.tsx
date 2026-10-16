import React, { useState, useRef, useEffect, useCallback } from 'react';
import { STORE_CONTACT } from '../data/coffeeData';
import { getSavedVideoUrl } from '../utils/videoStorage';
import { getPublicMediaPath } from '../utils/media';

interface HeroSectionProps {
  onExploreProducts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>('/videos/hero_video.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preserve and load the user's saved/downloaded video
  useEffect(() => {
    let active = true;

    // Check localStorage first
    try {
      const customUrl = localStorage.getItem('haroun_custom_video');
      if (customUrl) {
        setVideoSrc(customUrl);
      }
    } catch {}

    // Check IndexedDB
    getSavedVideoUrl().then((saved) => {
      if (active && saved) {
        setVideoSrc(saved);
      }
    });

    const handleSync = (e: any) => {
      if (e.detail?.url) {
        setVideoSrc(e.detail.url);
      }
    };
    window.addEventListener('haroun_video_changed', handleSync);
    return () => {
      active = false;
      window.removeEventListener('haroun_video_changed', handleSync);
    };
  }, []);

  // Listen to native video play/pause events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  // Play automatically when passing over it, and pause when scrolling down/away ("لما تعدي علي الفيديو يشتغل تلقائي ولما تنزل تحت يقف تلقائي")
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play().catch(() => {});
            }
          } else {
            // When user scrolls down away from the video, automatically pause
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Play on hover/cursor pass over the video ("لما تعدي عليه بالماوس")
  const handleMouseEnter = useCallback(() => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="hero" className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 overflow-hidden bg-[#FBF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid Banner - Orouba Specialty Coffee Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#3E2723]/10 border border-[#3E2723]/15 text-xs font-bold text-[#3E2723]">
              <i className="fa-solid fa-certificate text-[#C5A059]"></i>
              <span>محامص بن هارون التراثية · تحميص يدوي وطحن فوري</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-amiri text-[#2C1810] leading-[1.25] text-balance">
              عراقة الماضي.. وسر الفنجان الأصيل مع <span className="text-[#8C5E35]">بن هارون</span>
            </h1>

            {/* Slogan from official video */}
            <div className="inline-block px-4 py-1.5 rounded-2xl bg-gradient-to-r from-[#C5A059]/20 to-[#8C5E35]/10 border border-[#C5A059]/40 text-[#2C1810] text-sm sm:text-base font-bold font-amiri">
              « بن هارون ... القهوة كما ينبغي أن تكون »
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#5A493B] leading-relaxed max-w-2xl font-tajawal">
              من حبوب الأرابيكا والروبوستا المنتقاة بعناية فائقة، نقدم لك فنجاناً متوازناً بكريمة ذهبية كثيفة تدوم طويلاً. متوفر بن <strong className="text-[#2C1810]">سادة فاخر</strong> وبن <strong className="text-[#2C1810]">محوج ملكي</strong> بالحبهان الأخضر الهندي والمستكة الطبيعية.
            </p>

            {/* Quick Price Banner Highlight - Exactly matching poster */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EBE1] border border-[#DECFBE] grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fa-solid fa-mug-hot text-[#3E2723]"></i>
                  <span className="text-xs text-[#6B5A4D] font-bold">أسعار البن السادة:</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#2C1810] font-tajawal">
                  100 جم بـ <span className="text-[#8C5E35] font-extrabold font-mono tabular-nums">70 ج</span>
                  <span className="text-xs text-[#8C7A6B] mx-2">|</span>
                  250 جم بـ <span className="text-[#8C5E35] font-extrabold font-mono tabular-nums">160 ج</span>
                </div>
              </div>

              <div className="text-right sm:border-r sm:border-[#CBB8A3] sm:pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fa-solid fa-sparkles text-[#C5A059]"></i>
                  <span className="text-xs text-[#8C5E35] font-bold">أسعار البن المحوج:</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#2C1810] font-tajawal">
                  100 جم بـ <span className="text-[#C5A059] font-extrabold font-mono tabular-nums">85 ج</span>
                  <span className="text-xs text-[#8C7A6B] mx-2">|</span>
                  250 جم بـ <span className="text-[#C5A059] font-extrabold font-mono tabular-nums">200 ج</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-8 py-3.5 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#3E2723]/25 flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span>تسوق تشكيلة البن</span>
                <i className="fa-solid fa-arrow-left text-[#C5A059]"></i>
              </button>

              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="px-5 py-3.5 bg-white hover:bg-[#F4EBE1] text-[#3E2723] border border-[#DECFBE] rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-phone text-[#C5A059]"></i>
                <span className="font-bold text-[#3E2723]">الطلب الفوري:</span>
                <bdi dir="ltr" className="font-mono tabular-nums font-bold text-[#2C1810] tracking-wider select-all">
                  01275075046
                </bdi>
              </a>

              <a
                href={STORE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-[#25D366] hover:text-[#1da851] font-bold text-sm transition-colors flex items-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>طلب سريع عبر واتساب</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Showcase with Embedded Video Player ("سيب الي فوق") */}
          <div className="lg:col-span-5 relative flex items-center">
            <div
              className="w-full relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C5A059]/40 bg-[#1A0F0A] aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[500px] group"
              onMouseEnter={handleMouseEnter}
            >
              <video
                ref={videoRef}
                key={videoSrc}
                poster="/hero_haroun_coffee_1791931203817.jpg"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover cursor-pointer"
                onClick={togglePlay}
                title="اضغط للتشغيل أو الإيقاف المؤقت"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Sound & Controls Floating Badges (فقط أزرار الصوت والتشغيل/الإيقاف بدون أي نصوص أو شعارات) */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-[#F3C07B] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                >
                  <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-sm`}></i>
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-[#F3C07B] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                </button>
              </div>

              {/* Center Play Indicator when paused (أيقونة فقط بدون نصوص) */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#C5A059]/90 text-[#2C1810] flex items-center justify-center text-2xl shadow-2xl z-20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title="تشغيل الفيديو"
                >
                  <i className="fa-solid fa-play mr-1"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4-Item Feature / Trust Bar (Orouba Coffee Style) */}
        <div className="mt-14 pt-8 border-t border-[#EADBCE] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center shrink-0 border border-[#DECFBE]">
              <i className="fa-solid fa-seedling text-lg text-[#8C5E35]"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2C1810]">حبوب أرابيكا نقية</h4>
              <p className="text-xs text-[#736254] mt-0.5">منتقاة يدوياً من أجود المزارع لخلوها من أي شوائب.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center shrink-0 border border-[#DECFBE]">
              <i className="fa-solid fa-fire-flame-curved text-lg text-[#8C5E35]"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2C1810]">طحن فوري عند الطلب</h4>
              <p className="text-xs text-[#736254] mt-0.5">نطحن القهوة قبل تغليفها مباشرة لضمان أعلى وش ونكهة.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center shrink-0 border border-[#DECFBE]">
              <i className="fa-solid fa-truck-fast text-lg text-[#8C5E35]"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2C1810]">توصيل سريع لباب البيت</h4>
              <p className="text-xs text-[#736254] mt-0.5">خدمة شحن سريعة للقاهرة والجيزة وجميع المحافظات.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center shrink-0 border border-[#DECFBE]">
              <i className="fa-solid fa-tags text-lg text-[#8C5E35]"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2C1810]">أرخص وأفضل الأسعار</h4>
              <p className="text-xs text-[#736254] mt-0.5">من المحمصة للمستهلك مباشرة بأعلى جودة وقيمة عادلة.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
