import React, { useState, useEffect, useRef } from 'react';

interface OwnerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DEFAULT_OWNER_PIN = '00112275';

export const getStoredOwnerPin = (): string => {
  try {
    return localStorage.getItem('haroun_owner_pin') || DEFAULT_OWNER_PIN;
  } catch {
    return DEFAULT_OWNER_PIN;
  }
};

export const OwnerPinModal: React.FC<OwnerPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDigits, setShowDigits] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWelcomeSuccess, setIsWelcomeSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePin = getStoredOwnerPin();

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setIsWelcomeSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify !== undefined ? codeToVerify : pin;
    if (!code) {
      setError(true);
      setErrorMessage('يرجى كتابة كلمة السر (PIN)');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const targetPin = getStoredOwnerPin();
      if (code === targetPin || code === DEFAULT_OWNER_PIN) {
        try {
          localStorage.setItem('haroun_owner_unlocked', 'true');
          localStorage.setItem('haroun_owner_pin', DEFAULT_OWNER_PIN);
        } catch {
          // ignore localStorage error
        }
        setIsWelcomeSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 900);
      } else {
        setError(true);
        setErrorMessage('كلمة السر غير صحيحة! تأكد من إدخال الرمز المخصص لثروت هارون (00112275).');
        setPin('');
        inputRef.current?.focus();
      }
    }, 250);
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 16) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      const targetPin = getStoredOwnerPin();
      if (nextPin === targetPin || nextPin === DEFAULT_OWNER_PIN) {
        handleVerify(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#FBF8F3] border-2 border-[#C5A059]/40 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleUp text-[#2C1810]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] p-6 text-center text-white relative border-b border-[#C5A059]/30">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#EADBCE] flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          {/* Logo Crest */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#C5A059] to-[#8C5E35] shadow-xl border-2 border-[#C5A059]/80">
            <img
              src="/haroun_official_logo_1791968496087.jpg"
              alt="شعار بن هارون"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#F3C07B] text-xs font-bold border border-[#C5A059]/40 mb-2">
            <i className="fa-solid fa-lock text-xs"></i>
            <span>منطقة سرية ومحمية</span>
          </div>

          <h3 className="text-xl font-bold font-amiri text-white tracking-wide">
            المكتب · ثروت هارون
          </h3>
          <p className="text-xs text-[#E8DEC8] mt-1 font-tajawal max-w-xs mx-auto">
            أدخل الرقم السري (PIN) للدخول إلى المكتب وسجل الحسابات والطلبات
          </p>
        </div>

        {/* Form Body or Welcome Success Screen */}
        {isWelcomeSuccess ? (
          <div className="p-8 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-md border-2 border-emerald-400">
              <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <div className="inline-block bg-[#C5A059] text-[#2C1810] text-xs font-black px-3 py-1 rounded-full mb-2">
                مكتب الإدارة
              </div>
              <h4 className="text-2xl font-bold font-amiri text-[#2C1810]">
                أهلاً ثروت هارون
              </h4>
              <p className="text-sm text-[#7A6958] mt-1 font-tajawal">
                تم التحقق من الرمز السري بنجاح. جاري فتح المكتب الخاص بحضرتك...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#8C5E35] font-bold">
              <i className="fa-solid fa-spinner fa-spin text-sm"></i>
              <span>جاري التحميل...</span>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#6B5A4D] mb-2 text-right">
                  الرقم السري الخاص بثروت هارون (PIN):
                </label>

              <div className="relative">
                <input
                  ref={inputRef}
                  type={showDigits ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••"
                  className={`w-full text-center text-2xl font-mono tracking-[0.3em] font-bold py-3 px-12 bg-white rounded-2xl border-2 transition-all focus:outline-none ${
                    error
                      ? 'border-red-500 bg-red-50/50 text-red-700 focus:border-red-600'
                      : 'border-[#D9CABB] text-[#2C1810] focus:border-[#C5A059] shadow-inner'
                  }`}
                  autoComplete="off"
                />

                <button
                  type="button"
                  onClick={() => setShowDigits(!showDigits)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-[#8C7A6B] hover:text-[#2C1810] transition-colors cursor-pointer"
                  title={showDigits ? 'إخفاء الأرقام' : 'إظهار الأرقام'}
                >
                  <i className={`fa-solid ${showDigits ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>

                {pin && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8C7A6B] hover:text-[#2C1810] transition-colors cursor-pointer"
                    title="مسح"
                  >
                    <i className="fa-solid fa-circle-xmark text-sm"></i>
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-shake">
                  <i className="fa-solid fa-triangle-exclamation shrink-0 text-red-500"></i>
                  <span>{errorMessage || 'الرقم السري غير صحيح'}</span>
                </div>
              )}
            </div>

            {/* Quick Digital Keypad */}
            <div className="bg-[#F4EBE1] p-3 rounded-2xl border border-[#EADBCE]">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeyPress(digit)}
                    className="py-2.5 bg-white hover:bg-[#FAF4ED] active:bg-[#EADBCE] text-[#2C1810] font-mono font-bold text-lg rounded-xl border border-[#D9CABB] shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-2.5 bg-[#EADBCE] hover:bg-[#DECFBE] text-[#6B5A4D] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  مسح الكل
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="py-2.5 bg-white hover:bg-[#FAF4ED] active:bg-[#EADBCE] text-[#2C1810] font-mono font-bold text-lg rounded-xl border border-[#D9CABB] shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-2.5 bg-[#EADBCE] hover:bg-[#DECFBE] text-[#6B5A4D] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-delete-left text-base"></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#3E2723] hover:bg-[#2C1810] active:scale-[0.98] text-[#F3C07B] hover:text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#3E2723]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-unlock-keyhole"></i>
                  <span>دخول المكتب</span>
                </>
              )}
            </button>

            {/* Quick Restore Old Password Button */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('haroun_owner_pin', DEFAULT_OWNER_PIN);
                  } catch {
                    // ignore
                  }
                  setPin(DEFAULT_OWNER_PIN);
                  setError(false);
                  setErrorMessage('');
                  handleVerify(DEFAULT_OWNER_PIN);
                }}
                className="text-xs text-[#8C5E35] hover:text-[#2C1810] font-bold underline transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto py-1"
                title="استعادة كلمة المرور القديمة 00112275 والدخول مباشرة"
              >
                <i className="fa-solid fa-rotate-left text-xs"></i>
                <span>استعادة كلمة المرور القديمة (00112275) والدخول فوراً</span>
              </button>
            </div>
          </form>

          {/* Helper note */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE2D5] text-[11px] text-[#7A6958] text-center leading-relaxed">
            <span className="font-bold text-[#2C1810]">ملاحظة: </span>
            بعد تسجيل الدخول للمرة الأولى بالرمز السري، سيظهر لك "المكتب" دائماً عند دخول الموقع من هذا المتصفح.
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
