import React, { useState } from 'react';
import { STORE_CONTACT } from '../data/coffeeData';

interface NavbarProps {
  cartCount: number;
  loyaltyPoints?: number;
  ordersCount?: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenOwnerDashboard?: () => void;
  isOwnerUnlocked?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  loyaltyPoints = 0,
  ordersCount = 0,
  onOpenCart,
  onNavigate,
  onOpenSearch,
  onOpenOwnerDashboard,
  isOwnerUnlocked = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* الشريط العلوي Top Announcement Bar */}
      <div className="bg-[#2C1810] text-[#F4EBE1] text-xs py-1.5 px-3 flex justify-between items-center w-full overflow-hidden">
        <span className="truncate">تحميص يدوي فاخر · بن هارون 1985</span>
        <div className="flex items-center gap-3 shrink-0">
          {isOwnerUnlocked && onOpenOwnerDashboard && (
            <button
              onClick={onOpenOwnerDashboard}
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-200 text-[10px] font-bold border border-amber-500/30 cursor-pointer"
            >
              <span>المكتب ({ordersCount})</span>
            </button>
          )}
          <a
            href="tel:01275075046"
            className="flex items-center gap-1 shrink-0 font-semibold text-amber-200 hover:text-white transition-colors"
            dir="ltr"
          >
            <i className="fas fa-phone-alt text-[10px]"></i>
            <span>01275075046</span>
          </a>
        </div>
      </div>

      {/* الهيدر الرئيسي Header */}
      <header className="bg-[#FBF8F3] border-b border-amber-900/10 sticky top-0 z-40 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          
          {/* جهة اليمين: اللوجو والقائمة */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="menuToggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#2C1810] lg:hidden cursor-pointer"
              title="القائمة"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
            <button
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-2 text-right cursor-pointer group focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#C5A059] to-[#3E2723] shrink-0 border border-amber-700/30">
                <img
                  src="/haroun_official_logo_1791968496087.jpg"
                  alt="شعار بن هارون"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-extrabold text-base sm:text-lg text-[#2C1810] leading-tight font-amiri">
                  بن هارون
                </span>
                <span className="text-[9px] text-amber-800 tracking-tighter">
                  HAROUN COFFEE
                </span>
              </div>
            </button>
          </div>

          {/* روابط سطح المكتب */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs sm:text-sm font-bold text-[#3E2723]">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              متجر البن
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              قصة بن هارون
            </button>
            <button
              onClick={() => handleNavClick('loyalty')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <span>نقاط ومكافآت</span>
            </button>
            <button
              onClick={() => handleNavClick('wholesale')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1 font-bold text-amber-900"
            >
              تجار الجملة
            </button>
            <button
              onClick={() => handleNavClick('brewing')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              نصيحة الخبراء
            </button>
            <button
              onClick={() => handleNavClick('branches')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              المنفذ الرسمي (6 أكتوبر)
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-amber-800 transition-colors cursor-pointer py-1"
            >
              اتصل بنا
            </button>

            {isOwnerUnlocked && onOpenOwnerDashboard && (
              <button
                onClick={onOpenOwnerDashboard}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-xs font-bold transition-all cursor-pointer"
                title="مكتب ثروت هارون"
              >
                <i className="fas fa-briefcase text-[11px] text-amber-700"></i>
                <span>المكتب ({ordersCount})</span>
              </button>
            )}
          </nav>

          {/* الوسط واليسار: النقاط والبحث والسلة */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* شارة النقاط */}
            <button
              type="button"
              onClick={() => handleNavClick('loyalty')}
              className="bg-amber-100/80 hover:bg-amber-100 text-amber-900 text-[11px] px-2 py-1 rounded-full flex items-center gap-1 font-bold cursor-pointer transition-colors active:scale-95"
              title="رصيد نقاطك - اضغط للاستبدال"
            >
              <span>🏆</span>
              <span className="font-mono tabular-nums">{loyaltyPoints} نقاط</span>
            </button>

            {/* زر البحث */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 text-[#2C1810] hover:text-amber-800 cursor-pointer"
              title="بحث في المتجر"
            >
              <i className="fas fa-search text-base"></i>
            </button>



            {/* زر السلة */}
            <button
              id="cartBtn"
              type="button"
              onClick={onOpenCart}
              className="bg-[#2C1810] hover:bg-[#1E120B] text-[#F4EBE1] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow cursor-pointer active:scale-95 transition-transform"
              title="سلة المشتريات"
            >
              <i className="fas fa-shopping-bag text-amber-400"></i>
              <span
                id="cartCount"
                className="bg-amber-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold tabular-nums"
              >
                {cartCount}
              </span>
            </button>
          </div>

        </div>

        {/* قائمة الهاتف Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-4 border-t border-amber-900/10 bg-[#FBF8F3] space-y-1.5 animate-fadeIn">
            {isOwnerUnlocked && onOpenOwnerDashboard && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerDashboard();
                }}
                className="flex items-center justify-between w-full text-right px-3 py-2 text-xs font-bold bg-amber-100 text-[#2C1810] rounded-lg border border-amber-200"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-briefcase text-amber-800"></i>
                  <span>المكتب (ثروت هارون)</span>
                </div>
                <span className="bg-[#2C1810] text-amber-300 text-[10px] px-2 py-0.5 rounded-full tabular-nums">
                  {ordersCount} طلب
                </span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('hero')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              متجر البن (سادة ومحوج)
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              قصة بن هارون
            </button>
            <button
              onClick={() => handleNavClick('loyalty')}
              className="flex items-center justify-between w-full text-right px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>🏆</span>
                <span>نقاط ومكافآت بن هارون</span>
              </div>
              <span className="font-mono tabular-nums text-xs">
                {loyaltyPoints} نقطة
              </span>
            </button>
            <button
              onClick={() => handleNavClick('wholesale')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 rounded-lg"
            >
              تجار الجملة والكافيهات (B2B)
            </button>
            <button
              onClick={() => handleNavClick('brewing')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              نصيحة الخبراء
            </button>
            <button
              onClick={() => handleNavClick('branches')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              المنفذ الرسمي (مدينة 6 أكتوبر)
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-right px-3 py-2 text-xs font-bold text-[#3E2723] hover:bg-amber-50 rounded-lg"
            >
              اتصل بنا
            </button>
          </div>
        )}
      </header>
    </>
  );
};
