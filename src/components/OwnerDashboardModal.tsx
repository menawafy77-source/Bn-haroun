import React, { useState, useMemo } from 'react';
import { Order, CartItem } from '../types';
import { STORE_CONTACT } from '../data/coffeeData';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
  onConfirmOrderPoints?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onClearAllOrders?: () => void;
  onAddManualOrder?: (order: Order) => void;
  onLockDashboard?: () => void;
  onRefreshOrders?: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onConfirmOrderPoints,
  onDeleteOrder,
  onClearAllOrders,
  onAddManualOrder,
  onLockDashboard,
  onRefreshOrders,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'delivered'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState('');
  const [confirmPointsToast, setConfirmPointsToast] = useState('');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [clearSuccessToast, setClearSuccessToast] = useState('');

  // Password change state ("زر في المكتب يغير منه كلمة السر الي يسجل بيها")
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccessToast, setPasswordSuccessToast] = useState('');
  const [showPasswordDetails, setShowPasswordDetails] = useState(false);

  // New manual order form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualProduct, setManualProduct] = useState<'haroun-sada' | 'haroun-mehaweg'>('haroun-sada');
  const [manualWeight, setManualWeight] = useState<'100g' | '250g'>('250g');
  const [manualQty, setManualQty] = useState(1);
  const [manualPayment, setManualPayment] = useState<'cod' | 'instapay' | 'vodafone_cash'>('cod');
  const [manualNotes, setManualNotes] = useState('');

  // Customer aggregation for directory and points tally ("حط عدد النقاط الي بيجمعها العميل في المكتبة")
  const customerSummaries = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        phone: string;
        city?: string;
        address?: string;
        totalOrders: number;
        totalSpent: number;
        confirmedPoints: number;
        pendingPoints: number;
        totalPoints: number;
        lastOrderDate: string;
        orders: Order[];
      }
    >();

    orders.forEach((ord) => {
      const phoneKey = ord.customerPhone?.trim() || ord.customerName?.trim() || ord.id;
      const existing = map.get(phoneKey);
      const points = ord.pointsEarned || 0;
      const isCredited = ord.pointsCredited === true;

      if (!existing) {
        map.set(phoneKey, {
          id: ord.id,
          name: ord.customerName?.trim() || 'عميل بن هارون',
          phone: ord.customerPhone?.trim() || 'غير مسجل',
          city: ord.customerCity?.trim(),
          address: ord.customerAddress?.trim(),
          totalOrders: 1,
          totalSpent: Number(ord.total) || 0,
          confirmedPoints: isCredited ? points : 0,
          pendingPoints: isCredited ? 0 : points,
          totalPoints: points,
          lastOrderDate: ord.date,
          orders: [ord],
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += Number(ord.total) || 0;
        if (isCredited) {
          existing.confirmedPoints += points;
        } else {
          existing.pendingPoints += points;
        }
        existing.totalPoints += points;
        existing.orders.push(ord);
        if (!existing.city && ord.customerCity) existing.city = ord.customerCity;
        if (!existing.address && ord.customerAddress) existing.address = ord.customerAddress;
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Points totals across store
  const confirmedCustomerPoints = useMemo(() => {
    return orders
      .filter((o) => o.pointsCredited)
      .reduce((sum, ord) => sum + (ord.pointsEarned || 0), 0);
  }, [orders]);

  const pendingCustomerPoints = useMemo(() => {
    return orders
      .filter((o) => !o.pointsCredited)
      .reduce((sum, ord) => sum + (ord.pointsEarned || 0), 0);
  }, [orders]);

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (order.customerName || '').toLowerCase().includes(term) ||
      (order.customerPhone || '').includes(term) ||
      (order.orderNumber || '').toLowerCase().includes(term) ||
      (order.date || '').toLowerCase().includes(term) ||
      (order.items || []).some((item) => (item?.productName || '').toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'delivered'
        ? order.status === 'delivered'
        : order.status !== 'delivered';

    return matchesSearch && matchesStatus;
  });

  // Filtered customers for customer directory tab
  const filteredCustomers = customerSummaries.filter((cust) => {
    const term = searchTerm.toLowerCase();
    return (
      cust.name.toLowerCase().includes(term) ||
      cust.phone.includes(term) ||
      (cust.city || '').toLowerCase().includes(term)
    );
  });

  // Calculate Financial Summary ("مجموع كل الفلوس والمبيعات")
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const deliveredRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const pendingRevenue = orders
    .filter((o) => o.status !== 'delivered')
    .reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const uniqueCustomersCount = customerSummaries.length;

  // Calculate total coffee weight sold (grams and kilograms)
  const totalGramsSold = orders.reduce((sum, ord) => {
    return (
      sum +
      (ord.items || []).reduce((itemSum, item) => {
        const grams = item?.weight === '100g' ? 100 : item?.weight === '1000g' ? 1000 : 250;
        return itemSum + grams * (Number(item?.quantity) || 1);
      }, 0)
    );
  }, 0);

  const totalKgSold = (totalGramsSold / 1000).toFixed(2);

  // Manual order price computation
  const getManualUnitPrice = () => {
    if (manualProduct === 'haroun-sada') {
      return manualWeight === '100g' ? 70 : 160;
    } else {
      return manualWeight === '100g' ? 85 : 200;
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    const unitPrice = getManualUnitPrice();
    const totalPrice = unitPrice * manualQty;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `HRN-M${randomNum}`;

    const productName = manualProduct === 'haroun-sada' ? 'بن هارون سادة فاخر' : 'بن هارون محوج ملكي';
    const weightLabel = manualWeight === '100g' ? '100 جرام' : '250 جرام';

    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: manualProduct,
      productName,
      category: manualProduct === 'haroun-sada' ? 'سادة' : 'محوج',
      weight: manualWeight,
      weightLabel,
      price: unitPrice,
      quantity: manualQty,
      image:
        manualProduct === 'haroun-sada'
          ? '/product_haroun_sada_1791931204378.jpg'
          : '/product_haroun_mehaweg_1791931205594.jpg',
    };

    const newOrder: Order = {
      id: `ord-man-${Date.now()}`,
      orderNumber,
      date: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date()),
      customerName: manualName.trim(),
      customerPhone: manualPhone.trim(),
      customerCity: '',
      customerAddress: '',
      items: [newItem],
      subtotal: totalPrice,
      shippingFee: 0,
      discount: 0,
      pointsDiscount: 0,
      total: totalPrice,
      paymentMethod: manualPayment,
      paymentStatus: 'verified',
      status: 'placed',
      statusStep: 1,
      trackingCode: `EGY-${orderNumber}`,
      carrier: 'استلام مباشر / بن هارون',
      estimatedDelivery: 'تسليم فوري',
      notes: manualNotes.trim() || undefined,
      pointsEarned: 0,
      timeline: [],
    };

    if (onAddManualOrder) {
      onAddManualOrder(newOrder);
    }

    // Reset & close mini-modal
    setManualName('');
    setManualPhone('');
    setManualNotes('');
    setManualQty(1);
    setShowAddModal(false);
  };

  const handleConfirmDeleteBuyer = () => {
    if (orderToDelete && onDeleteOrder) {
      const deletedName = orderToDelete.customerName;
      onDeleteOrder(orderToDelete.id);
      setOrderToDelete(null);
      setDeleteSuccessToast(`تم حذف بيانات المشتري "${deletedName}" بنجاح`);
      setTimeout(() => setDeleteSuccessToast(''), 3500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExecuteClearAll = () => {
    try {
      localStorage.setItem('haroun_orders', '[]');
      localStorage.removeItem('haroun_orders');
    } catch {
      // ignore
    }
    if (onClearAllOrders) {
      onClearAllOrders();
    }
    setShowClearConfirmModal(false);
    setClearSuccessToast('تم تفريغ وحذف جميع الطلبات من السجل بنجاح!');
    setTimeout(() => setClearSuccessToast(''), 4500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    let storedPin = '00112275';
    try {
      storedPin = localStorage.getItem('haroun_owner_pin') || '00112275';
    } catch {
      storedPin = '00112275';
    }

    if (currentPinInput.trim() !== storedPin) {
      setPasswordError('كلمة السر الحالية غير صحيحة! تأكد من إدخال الرمز الصحيح.');
      return;
    }

    const trimmedNewPin = newPinInput.trim();
    if (!trimmedNewPin || trimmedNewPin.length < 4) {
      setPasswordError('كلمة السر الجديدة يجب أن تكون 4 أرقام على الأقل (أرقام فقط)');
      return;
    }

    // Enforce numbers only (no letters)
    if (!/^\d+$/.test(trimmedNewPin)) {
      setPasswordError('عفواً، كلمة السر يجب أن تتكون من أرقام فقط من غير أي حروف');
      return;
    }

    if (trimmedNewPin !== confirmPinInput.trim()) {
      setPasswordError('كلمة السر الجديدة وتأكيدها غير متطابقين!');
      return;
    }

    try {
      localStorage.setItem('haroun_owner_pin', trimmedNewPin);
      setPasswordSuccessToast(`تم تغيير كلمة سر المكتب بنجاح! الرمز الجديد هو: ${trimmedNewPin}`);
      setTimeout(() => setPasswordSuccessToast(''), 5500);
      setShowPasswordModal(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch {
      setPasswordError('تعذر حفظ كلمة السر في ذاكرة المتصفح');
    }
  };

  const handleResetPassword = () => {
    try {
      localStorage.setItem('haroun_owner_pin', '00112275');
      setPasswordSuccessToast('تمت استعادة كلمة السر الافتراضية بنجاح: 00112275');
      setTimeout(() => setPasswordSuccessToast(''), 5500);
      setShowPasswordModal(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-65 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div
        className={`bg-[#FBF8F3] border-2 border-[#C5A059]/40 flex flex-col shadow-2xl transition-all duration-300 overflow-hidden ${
          isFullScreen
            ? 'w-full h-full rounded-none'
            : 'rounded-2xl sm:rounded-3xl max-w-7xl w-full max-h-[96vh] h-[96vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] text-[#FBF8F3] border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#C5A059] to-[#8C5E35] shadow-lg shrink-0 border border-[#C5A059]">
              <img
                src="/haroun_official_logo_1791968496087.jpg"
                alt="شعار بن هارون"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-amiri font-bold text-lg sm:text-2xl text-white leading-tight">
                  المكتب · ثروت هارون
                </h2>
                <span className="bg-[#C5A059] text-[#2C1810] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                  مكتب الإدارة
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8DEC8] font-tajawal">
                سجل المبيعات، تفاصيل المشترين، وإمكانية حذف بيانات أي مشتري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Change Password Button ("زر في المكتب يغير منه كلمة السر الي يسجل بيها") */}
            <button
              onClick={() => {
                setPasswordError('');
                setShowPasswordModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-[#C5A059]/20 to-[#C5A059]/40 hover:from-[#C5A059]/40 hover:to-[#C5A059]/60 text-[#F3C07B] hover:text-white font-bold text-xs rounded-xl transition-all border border-[#C5A059]/60 shadow-sm cursor-pointer"
              title="تغيير كلمة السر التي يسجل بها صاحب المحل (ثروت هارون) للدخول للمكتب"
            >
              <i className="fa-solid fa-key text-xs text-[#C5A059]"></i>
              <span className="hidden sm:inline">تغيير كلمة السر</span>
              <span className="sm:hidden">كلمة السر</span>
            </button>

            {/* Manual Order Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#C5A059] hover:bg-[#b58f46] text-[#2C1810] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">تسجيل طلب يدوي</span>
              <span className="sm:hidden">طلب يدوي</span>
            </button>

            {/* Toggle Fullscreen Button (Helps if panel was clipped) */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isFullScreen ? 'تصغير النافذة' : 'تكبير ملء الشاشة'}
            >
              <i className={`fa-solid ${isFullScreen ? 'fa-compress' : 'fa-expand'} text-xs sm:text-sm`}></i>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              title="طباعة التقرير"
            >
              <i className="fa-solid fa-print"></i>
              <span>طباعة</span>
            </button>

            {/* Lock Button */}
            {onLockDashboard && (
              <button
                onClick={onLockDashboard}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 font-bold text-xs rounded-xl border border-red-700/50 transition-all cursor-pointer"
                title="قفل المكتب"
              >
                <i className="fa-solid fa-lock text-[10px]"></i>
                <span className="hidden lg:inline">قفل</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <i className="fa-solid fa-xmark text-sm sm:text-base"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Dashboard Body: Everything below Header scrolls together */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-[#FBF8F3] overscroll-contain">
          {/* Welcome Message for Mr. Tharwat ("أهلاً ثروت هارون") */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shadow-inner shrink-0">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C5E35] p-0.5 shadow-md shrink-0 flex items-center justify-center border border-[#C5A059]">
              <span className="text-xl sm:text-2xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-2xl font-bold font-amiri text-[#F3C07B] tracking-wide">
                  أهلاً ثروت هارون
                </h3>
                <span className="bg-[#C5A059] text-[#2C1810] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  مرحباً بك في المكتب
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E8DEC8] font-tajawal mt-0.5">
                مرحباً بحضرتك في مكتب إدارة بن هارون — جميع المبيعات، الطلبات، وبيانات المشترين محدثة وجاهزة أمامك.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onRefreshOrders && (
              <button
                onClick={onRefreshOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="تحديث قائمة الطلبات من قاعدة البيانات المركزية فوراً"
              >
                <i className="fa-solid fa-arrows-rotate text-xs"></i>
                <span>تحديث الطلبات</span>
              </button>
            )}
            <button
              onClick={() => {
                setPasswordError('');
                setShowPasswordModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#F3C07B] hover:text-white border border-[#C5A059]/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="تغيير كلمة السر (PIN) للدخول إلى المكتب"
            >
              <i className="fa-solid fa-key text-xs text-[#C5A059]"></i>
              <span>تغيير كلمة السر</span>
            </button>
            <div className="hidden md:flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-xl border border-[#C5A059]/30 text-xs text-[#EADBCE]">
              <i className="fa-solid fa-briefcase text-[#C5A059]"></i>
              <span>مكتب ثروت هارون</span>
            </div>
          </div>
        </div>

        {/* Password Success Toast */}
        {passwordSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0 shadow-md">
            <i className="fa-solid fa-shield-halved text-emerald-200 text-sm"></i>
            <span>{passwordSuccessToast}</span>
          </div>
        )}

        {/* Delete Success Toast */}
        {deleteSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0">
            <i className="fa-solid fa-check-circle"></i>
            <span>{deleteSuccessToast}</span>
          </div>
        )}

        {/* Delete Confirmation Modal / Overlay */}
        {orderToDelete && (
          <div className="p-3 sm:p-4 bg-red-50 border-b-2 border-red-300 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <i className="fa-solid fa-trash-can"></i>
              </div>
              <div className="text-right">
                <h4 className="font-bold text-red-900 text-xs sm:text-sm">
                  تأكيد حذف بيانات المشتري نهائياً:
                </h4>
                <p className="text-[11px] text-red-700">
                  هل أنت متأكد من مسح بيانات المشتري <strong>«{orderToDelete.customerName}»</strong> وهاتفه <strong>{orderToDelete.customerPhone}</strong> من سجل المحل؟
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 transition-colors cursor-pointer"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={handleConfirmDeleteBuyer}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can text-[11px]"></i>
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        )}

        {/* Clear All Orders Confirmation Banner (In-App Modal / Banner - No window.confirm) */}
        {showClearConfirmModal && (
          <div className="p-3.5 sm:p-5 bg-red-100 border-b-2 border-red-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div className="text-right">
                <h4 className="font-bold text-red-950 text-xs sm:text-sm">
                  تأكيد تفريغ وحذف سجل الطلبات بالكامل ({orders.length} طلب):
                </h4>
                <p className="text-[11px] text-red-800">
                  هل أنت متأكد من مسح جميع الطلبات من السجل؟ ستصبح قائمة الطلبات فارغة تماماً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 transition-colors cursor-pointer"
              >
                إلغاء وتراجع
              </button>
              <button
                type="button"
                onClick={handleExecuteClearAll}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
                <span>نعم، تفريغ السجل نهائياً</span>
              </button>
            </div>
          </div>
        )}

        {/* Clear Success Toast */}
        {clearSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0 shadow-md">
            <i className="fa-solid fa-circle-check text-emerald-200 text-base"></i>
            <span>{clearSuccessToast}</span>
          </div>
        )}

        {/* Points Confirmation Toast */}
        {confirmPointsToast && (
          <div className="mx-3 sm:mx-5 mt-3 p-3 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
              <span>{confirmPointsToast}</span>
            </div>
            <button
              onClick={() => setConfirmPointsToast('')}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Financial & Loyalty Highlights ("مجموع كل الفلوس والمبيعات" + "عدد النقاط الي بيجمعها العميل في المكتبة") */}
        <div className="p-3 sm:p-4 bg-[#F4EBE1] border-b border-[#EADBCE] shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {/* Box 1: Total Sales */}
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#2C1810] to-[#3E2723] text-white p-3 rounded-2xl border-2 border-[#C5A059] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#C5A059] mb-1">
                <span>مجموع كل الفلوس والمبيعات</span>
                <i className="fa-solid fa-coins text-sm text-[#F3C07B]"></i>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#F3C07B] font-tajawal tabular-nums leading-tight">
                  {totalRevenue.toLocaleString('ar-EG')}{' '}
                  <span className="text-xs font-bold text-[#EADBCE]">جنيه</span>
                </div>
                <span className="text-[10px] text-[#D8C7B5] mt-0.5 block">إجمالي مبيعات المتجر</span>
              </div>
            </div>

            {/* Box 2: Collected Sales */}
            <div className="bg-[#FBF8F3] p-3 rounded-2xl border border-[#D9CABB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1E7E34] mb-1">
                <span>المبيعات المحصلة</span>
                <i className="fa-solid fa-circle-check text-xs"></i>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-[#1E7E34] font-tajawal tabular-nums">
                  {deliveredRevenue.toLocaleString('ar-EG')}{' '}
                  <span className="text-[10px] font-bold text-[#7A6958]">ج</span>
                </div>
                <span className="text-[10px] text-[#8C7A6B] block">طلبات تم تسليمها</span>
              </div>
            </div>

            {/* Box 3: Pending Delivery */}
            <div className="bg-[#FBF8F3] p-3 rounded-2xl border border-[#D9CABB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#B7791F] mb-1">
                <span>مبيعات قيد التجهيز</span>
                <i className="fa-solid fa-hourglass-half text-xs"></i>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-[#B7791F] font-tajawal tabular-nums">
                  {pendingRevenue.toLocaleString('ar-EG')}{' '}
                  <span className="text-[10px] font-bold text-[#7A6958]">ج</span>
                </div>
                <span className="text-[10px] text-[#8C7A6B] block">معلقة في التوصيل</span>
              </div>
            </div>

            {/* Box 4: Total Orders & Customers */}
            <div className="bg-[#FBF8F3] p-3 rounded-2xl border border-[#D9CABB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8C5E35] mb-1">
                <span>إجمالي الطلبات</span>
                <i className="fa-solid fa-receipt text-xs"></i>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-[#2C1810] font-tajawal tabular-nums">
                  {totalOrdersCount}{' '}
                  <span className="text-xs font-bold text-[#8C7A6B]">طلب</span>
                </div>
                <span className="text-[10px] text-[#8C7A6B] block">من {uniqueCustomersCount} عميل مسجل</span>
              </div>
            </div>

            {/* Box 5: Quantity of Coffee Sold */}
            <div className="bg-[#FBF8F3] p-3 rounded-2xl border border-[#D9CABB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#3E2723] mb-1">
                <span>كمية البن المباعة</span>
                <i className="fa-solid fa-weight-hanging text-xs text-[#C5A059]"></i>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-[#2C1810] font-tajawal tabular-nums">
                  {totalKgSold}{' '}
                  <span className="text-xs font-bold text-[#8C5E35]">كجم</span>
                </div>
                <span className="text-[10px] text-[#8C7A6B] block">
                  ({totalGramsSold.toLocaleString('ar-EG')} جرام)
                </span>
              </div>
            </div>

            {/* Box 6: Customer Loyalty Points ("حط عدد النقاط الي بيجمعها العميل في المكتبة") */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 p-3 rounded-2xl border-2 border-[#C5A059] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-950 mb-1">
                <span>نقاط عملاء بن هارون</span>
                <span className="text-xs">🏆</span>
              </div>
              <div>
                <h3 id="total-points-display" className="text-lg sm:text-xl font-black text-amber-950 font-tajawal tabular-nums">
                  {confirmedCustomerPoints}{' '}
                  <span className="text-[10px] font-bold text-amber-800">نقطة مؤكدة</span>
                </h3>
                <p className="text-[10px] text-amber-900 block font-bold m-0">
                  {pendingCustomerPoints > 0 ? `⏳ ${pendingCustomerPoints} نقطة بانتظار التأكيد` : '✓ جميع النقاط معتمدة من الثروت هارون'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Tab Switcher & Filter Toolbar */}
        <div className="sticky top-0 z-20 bg-[#FAF4ED] border-b border-[#EADBCE] shadow-xs">
          {/* Primary View Switcher: Orders vs Customers Directory */}
          <div className="px-3 sm:px-5 pt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer border-t border-x ${
                  activeTab === 'orders'
                    ? 'bg-white text-[#2C1810] border-[#D9CABB] shadow-xs -mb-[1px]'
                    : 'bg-transparent text-[#7A6958] border-transparent hover:text-[#2C1810]'
                }`}
              >
                <i className="fa-solid fa-receipt text-amber-700"></i>
                <span>سجل الطلبات والمبيعات</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-950 font-mono font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`px-4 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer border-t border-x ${
                  activeTab === 'customers'
                    ? 'bg-white text-[#2C1810] border-[#D9CABB] shadow-xs -mb-[1px]'
                    : 'bg-transparent text-[#7A6958] border-transparent hover:text-[#2C1810]'
                }`}
              >
                <i className="fa-solid fa-users text-amber-700"></i>
                <span>دليل العملاء ونقاط الولاء</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#3E2723] text-[#F3C07B] font-mono font-bold">
                  {customerSummaries.length} عميل
                </span>
              </button>
            </div>

            <div className="text-xs text-[#8C7A6B] hidden md:block pb-1">
              {activeTab === 'orders' ? 'عرض تفاصيل مشتريات كل عميل مع تأكيد النقاط' : 'سجل أسماء العملاء وأرقامهم وإجمالي النقاط المجمعة'}
            </div>
          </div>

          {/* Filter & View Toolbar */}
          <div className="px-3 sm:px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89887] text-xs"></i>
              <input
                type="text"
                placeholder="ابحث باسم المشتري، رقم التليفون، الصنف، الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-9 py-1.5 bg-white border border-[#D9CABB] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89887] hover:text-[#2C1810] text-xs cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9CABB]">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-[#3E2723] text-white shadow-xs'
                      : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                  }`}
                >
                  الكل ({orders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('placed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'placed'
                      ? 'bg-[#C5A059] text-[#2C1810] shadow-xs'
                      : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                  }`}
                >
                  قيد التجهيز
                </button>
                <button
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'delivered'
                      ? 'bg-[#25D366] text-white shadow-xs'
                      : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                  }`}
                >
                  تم التسليم
                </button>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9CABB]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-[#3E2723] text-[#F3C07B]'
                      : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                  }`}
                  title="عرض جدول تفصيلي"
                >
                  <i className="fa-solid fa-table-list"></i>
                  <span>جدول</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-[#3E2723] text-[#F3C07B]'
                      : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                  }`}
                  title="عرض بطاقات"
                >
                  <i className="fa-solid fa-border-all"></i>
                  <span>بطاقات</span>
                </button>
              </div>

              {/* Clear All Orders Shortcut Button in Toolbar */}
              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirmModal(true)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                  title="تفريغ ومسح سجل الطلبات"
                >
                  <i className="fa-solid fa-trash-can text-red-500 text-[10px]"></i>
                  <span>تفريغ السجل</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-5 min-h-[350px] pb-12">
          {activeTab === 'customers' ? (
            /* Customers Directory Tab */
            filteredCustomers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#DECFBE] p-8">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#F4EBE1] flex items-center justify-center text-[#A89887] text-2xl">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="font-bold text-lg text-[#2C1810] mb-1">لا يوجد عملاء مطابِقون</h3>
                <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
                  {searchTerm ? `لم نجد أي عميل مطابق لـ "${searchTerm}".` : 'لم يتم تسجيل عملاء بعد.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((cust, cIdx) => (
                  <div key={cIdx} className="bg-white rounded-2xl p-4 border border-[#D9CABB] shadow-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0E6DC]">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center font-bold text-sm shrink-0">
                            <i className="fa-solid fa-user-tie"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#2C1810]">{cust.name}</h4>
                            <span className="text-[10px] text-[#8C7A6B] block">آخر طلب: {cust.lastOrderDate}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 font-mono">
                          {cust.totalOrders} طلب
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between bg-[#FAF8F3] p-2 rounded-xl border border-[#EADBCE]">
                          <span className="text-[#8C7A6B]">رقم الهاتف:</span>
                          <bdi dir="ltr" className="font-mono font-bold text-[#2C1810] select-all">{cust.phone}</bdi>
                        </div>

                        <div className="flex items-center justify-between bg-[#FAF8F3] p-2 rounded-xl border border-[#EADBCE]">
                          <span className="text-[#8C7A6B]">إجمالي المشتريات:</span>
                          <span className="font-bold text-[#8C5E35] font-tajawal">{cust.totalSpent.toLocaleString('ar-EG')} جنيه</span>
                        </div>

                        <div className="flex items-center justify-between bg-amber-50 p-2 rounded-xl border border-amber-200">
                          <span className="text-amber-900 font-bold">نقاط الولاء (المعتمدة):</span>
                          <span className="font-black text-amber-950 font-tajawal">{cust.confirmedPoints} نقطة</span>
                        </div>
                        {cust.pendingPoints > 0 && (
                          <div className="flex items-center justify-between bg-orange-50 p-2 rounded-xl border border-orange-200">
                            <span className="text-orange-900">نقاط معلقة (بانتظار التأكيد):</span>
                            <span className="font-bold text-orange-950 font-tajawal">{cust.pendingPoints} نقطة</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0E6DC] flex items-center justify-between">
                      <a
                        href={`https://wa.me/2${cust.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <i className="fa-brands fa-whatsapp text-sm"></i>
                        <span>مراسلة واتساب</span>
                      </a>

                      <a
                        href={`tel:${cust.phone}`}
                        className="px-3 py-1.5 bg-[#3E2723] hover:bg-[#2C1810] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-phone text-xs"></i>
                        <span>اتصال</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#DECFBE] p-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#F4EBE1] flex items-center justify-center text-[#A89887] text-2xl">
                <i className="fa-solid fa-clipboard-list"></i>
              </div>
              <h3 className="font-bold text-lg text-[#2C1810] mb-1">لا توجد طلبات مطابقة</h3>
              <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
                {searchTerm
                  ? `لم نجد أي طلب يحتوي على "${searchTerm}".`
                  : 'لم يتم تسجيل أي طلبات بعد. عند قيام الزبائن بالشراء ستظهر هنا فوراً.'}
              </p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-[#D9CABB] overflow-hidden shadow-sm">
              <div className="overflow-x-auto min-w-full">
                <table className="w-full text-right border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#2C1810] text-[#F4EBE1] border-b border-[#3E2723] font-bold text-xs whitespace-nowrap">
                      <th className="py-3 px-3 text-center w-10">#</th>
                      <th className="py-3 px-3 min-w-[130px]">اسم العميل</th>
                      <th className="py-3 px-3 min-w-[140px]">رقم الهاتف</th>
                      <th className="py-3 px-3 min-w-[200px]">المنتجات (اشتري ايه)</th>
                      <th className="py-3 px-3 text-center min-w-[100px]">السعر الإجمالي</th>
                      <th className="py-3 px-3 min-w-[110px]">تاريخ الطلب</th>
                      <th className="py-3 px-3 text-center min-w-[100px]">الحالة</th>
                      <th className="py-3 px-3 text-center min-w-[120px]">حذف بيانات المشتري</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBCE]">
                    {filteredOrders.map((order, idx) => {
                      const isDelivered = order.status === 'delivered';

                      return (
                        <tr
                          key={order.id}
                          className={`hover:bg-[#FAF6F0] transition-colors ${
                            isDelivered ? 'bg-[#FBFDFB]' : 'bg-white'
                          }`}
                        >
                          {/* Index & Order Number */}
                          <td className="py-3 px-3 text-center text-xs font-mono text-[#8C7A6B] align-top">
                            <span className="block font-bold text-[#2C1810]">{idx + 1}</span>
                            <span className="text-[10px] text-[#A89887] block font-mono">
                              {order.orderNumber}
                            </span>
                          </td>

                          {/* 1. اسم العميل */}
                          <td className="py-3 px-3 align-top">
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#DECFBE]">
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div>
                                <strong className="font-bold text-[#2C1810] block text-xs sm:text-sm">
                                  {order.customerName}
                                </strong>
                                {order.customerCity && (
                                  <span className="text-[10px] text-[#8C7A6B] block">
                                    {order.customerCity} {order.customerAddress ? `· ${order.customerAddress}` : ''}
                                  </span>
                                )}
                                {order.notes && (
                                  <span className="text-[10px] text-[#8C5E35] bg-[#F4EBE1] px-1 py-0.2 rounded mt-0.5 inline-block">
                                    ملاحظة: {order.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. رقم الهاتف */}
                          <td className="py-3 px-3 align-top">
                            <bdi
                              dir="ltr"
                              className="font-mono font-bold text-xs sm:text-sm text-[#2C1810] tracking-wider block select-all"
                            >
                              {order.customerPhone}
                            </bdi>
                            <div className="flex items-center gap-1.5 mt-1">
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="px-2 py-0.5 bg-[#3E2723] hover:bg-[#2C1810] text-white text-[10px] font-bold rounded flex items-center gap-1"
                                title="اتصال مباشر"
                              >
                                <i className="fa-solid fa-phone text-[8px]"></i>
                                <span>اتصال</span>
                              </a>
                              <a
                                href={`https://wa.me/2${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `أهلاً يا أستاذ ${order.customerName}، بن هارون بيحييك بخصوص طلبك رقم ${order.orderNumber}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold rounded flex items-center gap-1"
                                title="محادثة واتساب"
                              >
                                <i className="fa-brands fa-whatsapp text-[10px]"></i>
                                <span>واتساب</span>
                              </a>
                            </div>
                          </td>

                          {/* 3. المنتجات */}
                          <td className="py-3 px-3 align-top">
                            <div className="space-y-1">
                              {order.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="p-1 bg-[#F9F5EF] rounded border border-[#EDE2D5] flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#3E2723] text-[#F3C07B] font-bold text-[9px] flex items-center justify-center shrink-0">
                                      {item.quantity}×
                                    </span>
                                    <span className="font-bold text-[#2C1810]">{item.productName}</span>
                                    <span className="text-[10px] bg-[#EAE0D3] text-[#6B5A4B] px-1 py-0.2 rounded font-bold">
                                      {item.weightLabel}
                                    </span>
                                    {item.spiceLevel && (
                                      <span className="text-[10px] text-[#8C5E35]">
                                        ({item.spiceLevel})
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-bold text-[#3E2723] tabular-nums mr-2">
                                    {item.price * item.quantity} ج
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* 4. السعر الإجمالي */}
                          <td className="py-3 px-3 text-center align-top">
                            <div className="inline-block bg-[#F4EBE1] px-2.5 py-1 rounded-xl border border-[#DECFBE]">
                              <span className="text-sm sm:text-base font-black text-[#2C1810] font-tajawal tabular-nums block leading-none">
                                {order.total} <span className="text-[10px] font-bold text-[#8C5E35]">جنيه</span>
                              </span>
                              <span className="text-[9px] text-[#6B5A4D] font-bold block mt-0.5">
                                {order.paymentMethod === 'cod'
                                  ? 'عند الاستلام'
                                  : order.paymentMethod === 'instapay'
                                  ? 'إنستاباي'
                                  : order.paymentMethod === 'vodafone_cash'
                                  ? 'فودافون كاش'
                                  : 'بطاقة'}
                              </span>
                            </div>
                          </td>

                          {/* 5. تاريخ الطلب */}
                          <td className="py-3 px-3 align-top whitespace-nowrap text-xs text-[#6B5A4D]">
                            <span className="font-medium text-[#2C1810] block">{order.date}</span>
                          </td>

                          {/* 6. حالة الطلب */}
                          <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                            <div className="flex flex-col items-center gap-1.5">
                              {onUpdateOrderStatus ? (
                                <button
                                  onClick={() =>
                                    onUpdateOrderStatus(
                                      order.id,
                                      isDelivered ? 'placed' : 'delivered'
                                    )
                                  }
                                  className={`px-2 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                    isDelivered
                                      ? 'bg-[#E3F8EA] text-[#1E7E34] border-[#B9E8C7] hover:bg-[#d5f3df]'
                                      : 'bg-[#FFF6E5] text-[#B7791F] border-[#FDE68A] hover:bg-[#fdeece]'
                                  }`}
                                  title="اضغط لتغيير الحالة"
                                >
                                  {isDelivered ? 'تم التسليم ✓' : 'قيد التجهيز ⏳'}
                                </button>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    isDelivered
                                      ? 'bg-[#E3F8EA] text-[#1E7E34]'
                                      : 'bg-[#FFF6E5] text-[#B7791F]'
                                  }`}
                                >
                                  {isDelivered ? 'تم التسليم' : 'قيد التجهيز'}
                                </span>
                              )}

                              {onConfirmOrderPoints && !order.pointsCredited && (order.pointsEarned || 0) > 0 && (
                                <button
                                  onClick={() => {
                                    onConfirmOrderPoints(order.id);
                                    setConfirmPointsToast(`تم تأكيد الطلب وإضافة ${order.pointsEarned} نقطة لحساب العميل: ${order.customerName}`);
                                    setTimeout(() => setConfirmPointsToast(''), 4000);
                                  }}
                                  className="px-2 py-1 bg-[#C5A059] hover:bg-[#b58f46] text-[#2C1810] font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                                  title="تأكيد الطلب واعتماد النقاط للعميل"
                                >
                                  <i className="fa-solid fa-check-double text-[9px]"></i>
                                  <span>تأكيد الطلب والنقاط</span>
                                </button>
                              )}
                              {order.pointsCredited && (
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ تمت إضافة {order.pointsEarned} نقطة
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 7. حذف بيانات المشتري */}
                          <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                            <button
                              onClick={() => setOrderToDelete(order)}
                              className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                              title="حذف بيانات المشتري نهائياً"
                            >
                              <i className="fa-solid fa-trash-can text-[10px]"></i>
                              <span>حذف المشتري</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredOrders.map((order) => {
                const isDelivered = order.status === 'delivered';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl p-4 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                      isDelivered ? 'border-[#CDE8D5] bg-[#FBFDFB]' : 'border-[#E6D8CA]'
                    }`}
                  >
                    <div>
                      {/* Customer Name, Status, and Date */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#F0E6DC]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#F4EBE1] text-[#3E2723] flex items-center justify-center font-bold text-sm shrink-0">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[#2C1810] font-tajawal leading-tight">
                              {order.customerName}
                            </h3>
                            <span className="text-[10px] text-[#8C7A6B] block">
                              {order.date} · {order.orderNumber}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isDelivered
                              ? 'bg-[#E3F8EA] text-[#1E7E34] border border-[#B9E8C7]'
                              : 'bg-[#FFF6E5] text-[#B7791F] border border-[#FDE68A]'
                          }`}
                        >
                          {isDelivered ? 'تم التسليم' : 'قيد التجهيز'}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="mb-2.5 p-2 bg-[#FBF8F3] rounded-xl border border-[#EADBCE] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#8C7A6B] block">
                            رقم الهاتف:
                          </span>
                          <bdi
                            dir="ltr"
                            className="font-bold text-xs text-[#2C1810] font-mono tracking-wider select-all block"
                          >
                            {order.customerPhone}
                          </bdi>
                        </div>
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="px-2 py-0.5 bg-[#3E2723] hover:bg-[#2C1810] text-white text-[10px] font-bold rounded flex items-center gap-1"
                            title="اتصال"
                          >
                            <i className="fa-solid fa-phone text-[8px]"></i>
                            <span>اتصال</span>
                          </a>
                          <a
                            href={`https://wa.me/2${order.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold rounded flex items-center gap-1"
                            title="واتساب"
                          >
                            <i className="fa-brands fa-whatsapp text-[10px]"></i>
                            <span>واتساب</span>
                          </a>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="mb-2.5 space-y-1">
                        <span className="text-[10px] font-bold text-[#8C7A6B] block">
                          المنتجات (اشتري ايه):
                        </span>
                        {order.items.map((item, idx2) => (
                          <div
                            key={idx2}
                            className="flex items-center justify-between text-xs bg-[#FAF7F2] p-1.5 rounded-lg border border-[#EDE2D5]"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#3E2723] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                                {item.quantity}×
                              </span>
                              <span className="font-bold text-[#2C1810] text-[11px]">
                                {item.productName}
                              </span>
                              <span className="text-[10px] text-[#8C7A6B]">({item.weightLabel})</span>
                            </div>
                            <span className="font-bold text-[#3E2723] tabular-nums text-xs">
                              {item.price * item.quantity} ج
                            </span>
                          </div>
                        ))}
                        {order.notes && (
                          <div className="text-[10px] text-[#7A6958] bg-[#F4EBE1] p-1 rounded border border-[#EADBCE]">
                            <strong>ملاحظة:</strong> {order.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-2.5 border-t border-[#F0E6DC] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#6B5A4B] block">
                            السعر الإجمالي:
                          </span>
                          <div className="text-xl font-black text-[#2C1810] font-tajawal tabular-nums leading-none">
                            {order.total} <span className="text-xs font-bold text-[#8C5E35]">جنيه</span>
                          </div>
                        </div>

                        {onUpdateOrderStatus && (
                          <button
                            onClick={() =>
                              onUpdateOrderStatus(order.id, isDelivered ? 'placed' : 'delivered')
                            }
                            className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-colors cursor-pointer border ${
                              isDelivered
                                ? 'bg-white text-[#7A6958] border-[#D9CABB] hover:bg-[#F4EBE1]'
                                : 'bg-[#25D366] hover:bg-[#20ba59] text-white border-[#25D366]'
                            }`}
                          >
                            {isDelivered ? 'إلغاء التسليم' : 'تأكيد التسليم ✓'}
                          </button>
                        )}
                      </div>

                      {/* Points Confirmation Action for Mr. Tharwat */}
                      {onConfirmOrderPoints && !order.pointsCredited && (order.pointsEarned || 0) > 0 && (
                        <button
                          onClick={() => {
                            onConfirmOrderPoints(order.id);
                            setConfirmPointsToast(`تم تأكيد الطلب وإضافة ${order.pointsEarned} نقطة لحساب العميل: ${order.customerName}`);
                            setTimeout(() => setConfirmPointsToast(''), 4000);
                          }}
                          className="w-full py-1.5 bg-[#C5A059] hover:bg-[#b58f46] text-[#2C1810] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          title="تأكيد الطلب واعتماد النقاط للعميل"
                        >
                          <i className="fa-solid fa-check-double text-[11px]"></i>
                          <span>تأكيد الطلب واعتماد النقاط ({order.pointsEarned} نقطة)</span>
                        </button>
                      )}
                      {order.pointsCredited && (
                        <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-center">
                          ✓ تم اعتماد الطلب وإضافة {order.pointsEarned} نقطة لحساب العميل
                        </div>
                      )}

                      {/* Delete Buyer Data Button */}
                      <div className="pt-2 border-t border-[#F0E6DC] flex items-center justify-between">
                        <span className="text-[10px] text-[#8C7A6B]">
                          الدفع: {order.paymentMethod === 'cod' ? 'نقداً عند الاستلام' : 'إلكتروني'}
                        </span>

                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="حذف بيانات المشتري"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                          <span>حذف بيانات المشتري</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#F4EBE1] border-t border-[#EADBCE] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7A6958] flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-[#C5A059]"></i>
            <span className="hidden sm:inline">
              البيانات ومجموع المبيعات محفوظة تلقائياً ومتاحة لثروت هارون دائماً.
            </span>
            <span className="sm:hidden">البيانات محفوظة تلقائياً.</span>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-xl border border-red-300 transition-colors cursor-pointer flex items-center gap-1.5"
                title="تفريغ ومسح سجل الطلبات"
              >
                <i className="fa-solid fa-trash-can text-red-600 text-xs"></i>
                <span>تفريغ السجل ({orders.length})</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#3E2723] hover:bg-[#2C1810] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div> {/* Close scrollable dashboard body */}
      </div> {/* Close modal outer frame */}

      {/* Manual Order Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FBF8F3] border border-[#DECFBE] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp text-[#2C1810]">
            <div className="flex items-center justify-between border-b border-[#EADBCE] pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-[#C5A059] text-xl"></i>
                <h3 className="font-bold text-lg font-amiri text-[#2C1810]">
                  تسجيل طلب يدوي جديد (هاتف أو زبون حضوري)
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-[#EADBCE] text-[#3E2723] hover:bg-[#D9CABB] flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#6B5A4D] block mb-1">اسم العميل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أستاذ محمود عبد الله"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-bold text-[#6B5A4D] block mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810] font-mono text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6B5A4D] block mb-1">صنف البن:</label>
                  <select
                    value={manualProduct}
                    onChange={(e) => setManualProduct(e.target.value as any)}
                    className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810]"
                  >
                    <option value="haroun-sada">بن هارون سادة فاخر</option>
                    <option value="haroun-mehaweg">بن هارون محوج ملكي</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#6B5A4D] block mb-1">الوزن:</label>
                  <select
                    value={manualWeight}
                    onChange={(e) => setManualWeight(e.target.value as any)}
                    className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810]"
                  >
                    <option value="100g">
                      100 جرام ({manualProduct === 'haroun-sada' ? '70 ج' : '85 ج'})
                    </option>
                    <option value="250g">
                      250 جرام ({manualProduct === 'haroun-sada' ? '160 ج' : '200 ج'})
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6B5A4D] block mb-1">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={manualQty}
                    onChange={(e) => setManualQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810] font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#6B5A4D] block mb-1">طريقة الدفع:</label>
                  <select
                    value={manualPayment}
                    onChange={(e) => setManualPayment(e.target.value as any)}
                    className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810]"
                  >
                    <option value="cod">نقداً عند الاستلام</option>
                    <option value="instapay">إنستاباي (InstaPay)</option>
                    <option value="vodafone_cash">فودافون كاش</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6B5A4D] block mb-1">ملاحظات إضافية:</label>
                <input
                  type="text"
                  placeholder="مثال: تحويجة زيادة، توصيل العصر، إلخ"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-white border border-[#D9CABB] rounded-xl px-3 py-2 text-sm text-[#2C1810]"
                />
              </div>

              {/* Price Calculation Preview */}
              <div className="p-3 bg-[#F4EBE1] rounded-2xl border border-[#DECFBE] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#7A6958] block">السعر الإجمالي المحسوب:</span>
                  <div className="text-xl font-bold text-[#2C1810] font-tajawal tabular-nums">
                    {getManualUnitPrice() * manualQty} جنيه مصري
                  </div>
                </div>
                <div className="text-left text-[11px] text-[#8C5E35]">
                  ({manualQty} × {getManualUnitPrice()} ج)
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#EADBCE] text-[#3E2723] rounded-xl font-bold cursor-pointer hover:bg-[#D9CABB]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3E2723] hover:bg-[#2C1810] text-[#F3C07B] rounded-xl font-bold shadow-md cursor-pointer"
                >
                  حفظ وتسجيل الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal ("زر في المكتب يغير منه كلمة السر الي يسجل بيها") */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-[#FBF8F3] border-2 border-[#C5A059] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleUp text-[#2C1810]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] p-5 text-center text-white relative border-b border-[#C5A059]/30">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                }}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#EADBCE] flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>

              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C5E35] flex items-center justify-center text-white text-xl shadow-lg border border-[#C5A059]">
                <i className="fa-solid fa-key"></i>
              </div>

              <h3 className="text-xl font-bold font-amiri text-white">
                تغيير كلمة سر المكتب
              </h3>
              <p className="text-xs text-[#E8DEC8] mt-1 font-tajawal">
                تعيين كلمة سر جديدة للمكتب — أرقام فقط من غير حروف
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePassword} className="p-5 sm:p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-shake">
                  <i className="fa-solid fa-circle-exclamation shrink-0 text-red-500"></i>
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#6B5A4D] mb-1.5 text-right">
                  كلمة السر الحالية (أرقام فقط):
                </label>
                <div className="relative">
                  <input
                    type={showPasswordDetails ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentPinInput}
                    onChange={(e) => {
                      setCurrentPinInput(e.target.value.replace(/\D/g, ''));
                      setPasswordError('');
                    }}
                    placeholder="أدخل كلمة السر الحالية (الافتراضية: 00112275)"
                    className="w-full text-right text-sm font-mono font-bold py-2.5 px-10 bg-white rounded-xl border border-[#D9CABB] text-[#2C1810] focus:border-[#C5A059] focus:outline-none"
                    required
                  />
                  <i className="fa-solid fa-lock-open absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] text-xs"></i>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#6B5A4D] mb-1.5 text-right">
                  كلمة السر الجديدة (أرقام فقط):
                </label>
                <div className="relative">
                  <input
                    type={showPasswordDetails ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={newPinInput}
                    onChange={(e) => {
                      setNewPinInput(e.target.value.replace(/\D/g, ''));
                      setPasswordError('');
                    }}
                    placeholder="اكتب أرقام كلمة السر الجديدة (4 أرقام على الأقل)"
                    className="w-full text-right text-sm font-mono font-bold py-2.5 px-10 bg-white rounded-xl border border-[#D9CABB] text-[#2C1810] focus:border-[#C5A059] focus:outline-none"
                    required
                  />
                  <i className="fa-solid fa-key absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A059] text-xs"></i>
                </div>
                <span className="text-[10px] text-[#8C7A6B] block mt-1">
                  * مسموح بالأرقام فقط (0-9) ولا يُسمح بالحروف.
                </span>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#6B5A4D] mb-1.5 text-right">
                  تأكيد كلمة السر الجديدة:
                </label>
                <div className="relative">
                  <input
                    type={showPasswordDetails ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={confirmPinInput}
                    onChange={(e) => {
                      setConfirmPinInput(e.target.value.replace(/\D/g, ''));
                      setPasswordError('');
                    }}
                    placeholder="أعد كتابة نفس الأرقام لتأكيدها"
                    className="w-full text-right text-sm font-mono font-bold py-2.5 px-10 bg-white rounded-xl border border-[#D9CABB] text-[#2C1810] focus:border-[#C5A059] focus:outline-none"
                    required
                  />
                  <i className="fa-solid fa-check-double absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs"></i>
                </div>
              </div>

              {/* Toggle Show Password */}
              <div className="flex items-center justify-between text-xs text-[#6B5A4D]">
                <button
                  type="button"
                  onClick={() => setShowPasswordDetails(!showPasswordDetails)}
                  className="hover:text-[#2C1810] flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <i className={`fa-solid ${showPasswordDetails ? 'fa-eye-slash' : 'fa-eye'} text-xs text-[#C5A059]`}></i>
                  <span>{showPasswordDetails ? 'إخفاء الرموز' : 'إظهار الرموز'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-amber-700 hover:text-amber-900 underline cursor-pointer text-[11px]"
                  title="استعادة الرمز الافتراضي 00112275"
                >
                  استعادة الرمز الافتراضي (00112275)
                </button>
              </div>

              {/* Notice */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE2D5] text-[11px] text-[#7A6958] leading-relaxed">
                <span className="font-bold text-[#2C1810]">تنبيه أمني: </span>
                سيتم تفعيل كلمة السر الجديدة فوراً. استخدمها في المرات القادمة عند تسجيل الدخول إلى المكتب.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                  }}
                  className="px-4 py-2.5 bg-[#EADBCE] text-[#3E2723] rounded-xl font-bold text-xs hover:bg-[#D9CABB] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] hover:from-black hover:to-[#2C1810] text-[#F3C07B] hover:text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>حفظ كلمة السر الجديدة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
