import React from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenOwnerDashboard?: () => void;
  onFooterLogoClick?: () => void;
  isOwnerUnlocked?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenOwnerDashboard,
  onFooterLogoClick,
  isOwnerUnlocked = false,
}) => {
  const [logoClicks, setLogoClicks] = React.useState(0);
  const clickTimerRef = React.useRef<any>(null);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextClicks >= 3) {
      setLogoClicks(0);
      if (onFooterLogoClick) {
        onFooterLogoClick();
      } else if (onOpenOwnerDashboard) {
        onOpenOwnerDashboard();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 1500);
    }
  };

  return (
    <footer className="bg-[#1E120B] text-[#D8C7B5] pt-16 pb-8 border-t border-[#3E2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Story */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {/* Clickable Logo - Hidden Gateway for Shop Owner (3 clicks) */}
              <button
                type="button"
                onClick={handleLogoClick}
                className="w-13 h-13 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#C5A059] to-[#8C5E35] shadow-lg shrink-0 border border-[#C5A059]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                title={
                  isOwnerUnlocked
                    ? 'المكتب · ثروت هارون'
                    : 'المكتب (اضغط 3 مرات متتالية)'
                }
              >
                <img
                  src="/haroun_official_logo_1791968496087.jpg"
                  alt="شعار بن هارون الرسمي"
                  className="w-full h-full object-cover rounded-full group-hover:brightness-110 transition-all"
                  referrerPolicy="no-referrer"
                />
              </button>
              <div>
                <span className="text-2xl font-bold font-amiri text-white tracking-wide block leading-none">
                  {STORE_CONTACT.name}
                </span>
                <span className="text-[11px] font-tajawal text-[#C5A059] tracking-wider">
                  قهوة عربية أصيلة · منذ 1985
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#BDB0A3] leading-relaxed max-w-sm font-tajawal">
              محامص بن هارون المتخصصة في تحميص وطحن البن العربي والتركي الأصيل. نجمع بين أحدث ماكينات التحميص الحرفية وسر الخلطة التراثية بالحبهان الأخضر الهندي والمستكة الطبيعية.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={STORE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>طلب سريع عبر واتساب</span>
              </a>

              <a
                href={STORE_CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                title="تابع صفحتنا الرسمية على فيسبوك"
              >
                <i className="fa-brands fa-facebook text-sm"></i>
                <span>صفحتنا على فيسبوك</span>
              </a>

              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-phone text-[#C5A059]"></i>
                <bdi dir="ltr" className="tabular-nums font-mono font-bold tracking-wider select-all">
                  01275075046
                </bdi>
              </a>
            </div>
          </div>

          {/* Quick Links (Orouba Navigation) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#C5A059] tracking-wide font-tajawal">أقسام الموقع</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  متجر البن (سادة ومحوج)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  قصة بن هارون والتحميص
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brewing')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  نصيحة خبراء بن هارون
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  منفذ بن هارون (مدينة 6 أكتوبر)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer text-[#C5A059] font-bold"
                >
                  تجار الجملة وتوريد الكافيهات والمحامص
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('loyalty')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer text-[#F3C07B] font-bold"
                >
                  نقاط ومكافآت بن هارون (100 نقطة بكيلو)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  اتصل بنا
                </button>
              </li>
              {isOwnerUnlocked && (
                <li className="pt-1">
                  <button
                    onClick={() => {
                      if (onOpenOwnerDashboard) onOpenOwnerDashboard();
                      else onNavigate('owner-section');
                    }}
                    className="text-[#F3C07B] hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-briefcase text-xs text-[#C5A059]"></i>
                    <span>المكتب (ثروت هارون)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#C5A059] tracking-wide font-tajawal">خدمة العملاء والاتصال</h4>
            <ul className="space-y-2.5 text-xs text-[#BDB0A3]">
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-location-dot text-[#C5A059] mt-0.5"></i>
                <span>{STORE_CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-regular fa-clock text-[#C5A059]"></i>
                <span>{STORE_CONTACT.workingHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-phone text-[#C5A059]"></i>
                <span>الخط الساخن:</span>
                <bdi dir="ltr" className="tabular-nums font-mono font-bold text-[#F3C07B] select-all">
                  01275075046
                </bdi>
              </li>
              <li className="flex items-center gap-2.5 text-[11px]">
                <i className="fa-solid fa-money-bill-transfer text-[#C5A059]"></i>
                <span>إنستاباي:</span>
                <bdi dir="ltr" className="tabular-nums font-mono font-bold text-white select-all">
                  {STORE_CONTACT.instapayAccount}
                </bdi>
              </li>
              <li className="flex items-center gap-2.5 text-[11px]">
                <i className="fa-solid fa-wallet text-red-400"></i>
                <span>فودافون كاش:</span>
                <bdi dir="ltr" className="tabular-nums font-mono font-bold text-white select-all">
                  {STORE_CONTACT.vodafoneCashNumber}
                </bdi>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A6B] gap-4">
          <p>© {new Date().getFullYear()} بن هارون — جميع الحقوق محفوظة لمحامص بن هارون للقهوة التراثية.</p>
          <div className="flex items-center gap-2">
            <span>صُنع بعناية لعشاق القهوة العربية الأصيلة</span>
            <i className="fa-solid fa-heart text-red-500"></i>
          </div>
        </div>
      </div>

      {/* شريط توقيع شركة أواويني (Owoainy) أسفل الموقع */}
      <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: '#1a1a1a', color: '#ffffff', fontFamily: 'sans-serif', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ marginBottom: '10px' }}>
          {/* الشعار */}
          <img
            src="/watermarked_img_4062161912489923997.jpg"
            alt="أواويني - Owoainy"
            style={{ height: '52px', width: 'auto', verticalAlign: 'middle', display: 'inline-block', borderRadius: '6px' }}
            onError={(e) => {
              // Fallback to asset logo if needed
              (e.target as HTMLImageElement).src = '/owoainy_logo_1792148946617.jpg';
            }}
          />
        </div>
        <p style={{ margin: '6px 0', fontSize: '14px', lineHeight: '1.6' }}>
          صُنِع بشغف | تصميم وتطوير بواسطة <strong>شركة أواويني (Owoainy)</strong>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#a0a0a0', direction: 'ltr' }}>
          Designed & Developed by Owoainy
        </p>
        <p style={{ margin: '6px 0', fontSize: '14px' }}>
          📞 للتواصل: <a href="tel:01283569077" style={{ color: '#4da6ff', textDecoration: 'none', fontWeight: 'bold', margin: '0 4px' }}>01283569077</a>
          <span style={{ color: '#777', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#bbb' }} dir="ltr">Contact: +20 128 356 9077</span>
        </p>
      </div>
    </footer>
  );
};
