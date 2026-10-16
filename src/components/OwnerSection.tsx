import React, { useState } from 'react';
import { Order } from '../types';

interface OwnerSectionProps {
  orders: Order[];
  onOpenDashboard: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onLockDashboard?: () => void;
}

export const OwnerSection: React.FC<OwnerSectionProps> = ({
  orders,
  onOpenDashboard,
  onUpdateOrderStatus,
  onDeleteOrder,
  onLockDashboard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'delivered'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Financial summary ("مجموع كل الفلوس والمبيعات")
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const deliveredRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, ord) => sum + ord.total, 0);
  const pendingRevenue = orders
    .filter((o) => o.status !== 'delivered')
    .reduce((sum, ord) => sum + ord.total, 0);
  const totalOrders = orders.length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.customerName.toLowerCase().includes(term) ||
      order.customerPhone.includes(term) ||
      order.orderNumber.toLowerCase().includes(term) ||
      order.items.some((item) => item.productName.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'delivered'
        ? order.status === 'delivered'
        : order.status !== 'delivered';

    return matchesSearch && matchesStatus;
  });

  const displayedOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, 6);

  const confirmDelete = () => {
    if (orderToDelete && onDeleteOrder) {
      onDeleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    }
  };

  return (
    <section id="owner-section" className="py-12 sm:py-16 bg-[#F4EBE1] border-y-2 border-[#D9CABB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E2723] text-[#F3C07B] text-xs font-bold mb-3 shadow-xs">
              <i className="fa-solid fa-briefcase text-[#C5A059]"></i>
              <span>المكتب · أستاذ ثروت الهارون</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-amiri text-[#2C1810]">
              المكتب · سجل طلبات ومبيعات أستاذ ثروت الهارون
            </h2>
            <p className="text-sm text-[#7A6958] mt-2 max-w-3xl font-tajawal leading-relaxed">
              تظهر لك بيانات المكتب كاملة بجميع تفاصيل المشترين: اسم العميل، الرقم، المنتجات المشتراة، السعر الإجمالي، وتاريخ الطلب مع إمكانية حذف بيانات المشتري وتحديث حالة الطلب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#C5A059] hover:bg-[#b58f46] text-[#2C1810] rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              title="تغيير كلمة السر التي يسجل بها صاحب المحل للدخول للمكتب"
            >
              <i className="fa-solid fa-key"></i>
              <span>تغيير كلمة السر</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#3E2723] hover:bg-[#2C1810] text-[#C5A059] hover:text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <i className="fa-solid fa-expand"></i>
              <span>تكبير المكتب في نافذة كاملة ({totalOrders} طلب)</span>
            </button>

            {onLockDashboard && (
              <button
                onClick={onLockDashboard}
                className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 bg-white hover:bg-red-50 text-red-700 rounded-xl font-bold text-xs border border-red-200 transition-all cursor-pointer shadow-xs"
                title="قفل لوحة الإدارة وإخفائها من الموقع"
              >
                <i className="fa-solid fa-lock"></i>
                <span>قفل المكتب</span>
              </button>
            )}
          </div>
        </div>

        {/* Welcome Message for Mr. Tharwat ("أهلاً أستاذ ثروت") */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2723] to-[#2C1810] text-white p-4 sm:p-5 rounded-3xl border-2 border-[#C5A059]/60 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C5E35] p-0.5 shadow-md shrink-0 flex items-center justify-center border border-[#C5A059]">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold font-amiri text-[#F3C07B]">
                  أهلاً أستاذ ثروت
                </h3>
                <span className="bg-[#C5A059] text-[#2C1810] text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  مرحباً بك في مكتبك
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E8DEC8] mt-1 font-tajawal">
                مرحباً بحضرتك أستاذ ثروت الهارون في مكتب الإدارة لمتابعة كافة مبيعات وحسابات المتجر وتفاصيل المشترين.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs text-[#EADBCE]">
            <i className="fa-solid fa-briefcase text-[#C5A059]"></i>
            <span>مكتب أستاذ ثروت الهارون</span>
          </div>
        </div>

        {/* Financial Highlights ("مجموع كل الفلوس والمبيعات") */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Box 1: Total Sales */}
          <div className="bg-[#2C1810] text-white p-4 rounded-2xl border-2 border-[#C5A059] shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-[#C5A059] mb-1">
              <span>مجموع كل الفلوس والمبيعات</span>
              <i className="fa-solid fa-coins text-base text-[#F3C07B]"></i>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#F3C07B] font-tajawal tabular-nums">
              {totalRevenue.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-bold text-[#EADBCE]">جنيه</span>
            </div>
            <span className="text-[10px] text-[#C5A059]/80 mt-1 block">إجمالي خزينة المتجر</span>
          </div>

          {/* Box 2: Collected Sales */}
          <div className="bg-[#FBF8F3] p-4 rounded-2xl border border-[#D9CABB] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E7E34] mb-1">
              <span>المبيعات المحصلة</span>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#1E7E34] font-tajawal tabular-nums">
              {deliveredRevenue.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-bold text-[#7A6958]">جنيه</span>
            </div>
            <span className="text-[10px] text-[#8C7A6B] block">طلبات تم تسليمها بنجاح</span>
          </div>

          {/* Box 3: Pending Sales */}
          <div className="bg-[#FBF8F3] p-4 rounded-2xl border border-[#D9CABB] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#B7791F] mb-1">
              <span>مبيعات قيد التجهيز</span>
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#B7791F] font-tajawal tabular-nums">
              {pendingRevenue.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-bold text-[#7A6958]">جنيه</span>
            </div>
            <span className="text-[10px] text-[#8C7A6B] block">طلبات جارية في التوصيل</span>
          </div>

          {/* Box 4: Total Orders Count */}
          <div className="bg-[#FBF8F3] p-4 rounded-2xl border border-[#D9CABB] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#3E2723] mb-1">
              <span>إجمالي عدد الطلبات</span>
              <i className="fa-solid fa-receipt text-[#C5A059]"></i>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2C1810] font-tajawal tabular-nums">
              {totalOrders} <span className="text-xs font-bold text-[#8C7A6B]">طلب</span>
            </div>
            <span className="text-[10px] text-[#8C7A6B] block">مسجلة في سجل المحل</span>
          </div>
        </div>

        {/* Filters, Search & View Controls */}
        <div className="bg-[#FAF4ED] p-3 sm:p-4 rounded-2xl border border-[#D9CABB] mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] text-xs"></i>
            <input
              type="text"
              placeholder="ابحث باسم الزبون أو الهاتف أو الصنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-9 py-2 bg-white border border-[#D9CABB] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2C1810] text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Filter Status & View Mode */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9CABB]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#3E2723] text-white shadow-xs'
                    : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                }`}
              >
                الكل ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('placed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'placed'
                    ? 'bg-[#C5A059] text-[#2C1810] shadow-xs'
                    : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                }`}
              >
                قيد التجهيز
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'delivered'
                    ? 'bg-[#25D366] text-white shadow-xs'
                    : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                }`}
              >
                تم التسليم
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9CABB]">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#3E2723] text-[#F3C07B]'
                    : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                }`}
                title="عرض البطاقات"
              >
                <i className="fa-solid fa-border-all"></i>
                <span>بطاقات</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#3E2723] text-[#F3C07B]'
                    : 'text-[#7A6958] hover:bg-[#F4EBE1]'
                }`}
                title="عرض جدول كامل"
              >
                <i className="fa-solid fa-table-list"></i>
                <span>جدول</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Banner (In-App Modal / Banner - No window.confirm) */}
        {orderToDelete && (
          <div className="mb-6 p-4 sm:p-5 bg-red-50 border-2 border-red-400 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-lg">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h4 className="font-bold text-red-900 text-sm sm:text-base">
                  تأكيد حذف بيانات المشتري نهائياً:
                </h4>
                <p className="text-xs text-red-700 mt-0.5">
                  هل أنت متأكد من حذف بيانات العميل <strong className="underline font-bold text-red-950">{orderToDelete.customerName}</strong> (طلب رقم {orderToDelete.orderNumber}) بمبلغ {orderToDelete.total} ج؟
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 transition-colors cursor-pointer"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>نعم، احذف بيانات المشتري</span>
              </button>
            </div>
          </div>
        )}

        {/* Orders Content */}
        {displayedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#DECFBE] p-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#F4EBE1] flex items-center justify-center text-[#8C7A6B] text-xl">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <h3 className="font-bold text-base text-[#2C1810] mb-1">لا توجد طلبات مطابقة</h3>
            <p className="text-xs text-[#8C7A6B]">
              {searchTerm
                ? `لم يتم العثور على أي نتائج لكلمة "${searchTerm}".`
                : 'لم يتم تسجيل أي طلبات مشتريين حتى الآن.'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View in OwnerSection */
          <div className="bg-white rounded-2xl border border-[#D9CABB] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#2C1810] text-[#F4EBE1] border-b border-[#3E2723] font-bold text-xs">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-4">اسم العميل</th>
                    <th className="py-3 px-4">رقم الهاتف</th>
                    <th className="py-3 px-4 min-w-[200px]">المنتجات (اشتري ايه)</th>
                    <th className="py-3 px-4 text-center">السعر الإجمالي</th>
                    <th className="py-3 px-4">تاريخ الطلب</th>
                    <th className="py-3 px-4 text-center">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات المشتري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBCE]">
                  {displayedOrders.map((order, idx) => {
                    const isDelivered = order.status === 'delivered';

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-[#FAF6F0] transition-colors ${
                          isDelivered ? 'bg-[#FBFDFB]' : 'bg-white'
                        }`}
                      >
                        <td className="py-3 px-3 text-center text-xs font-mono text-[#8C7A6B] align-top">
                          <span className="font-bold text-[#2C1810]">{idx + 1}</span>
                          <span className="text-[10px] text-[#A89887] block font-mono">
                            {order.orderNumber}
                          </span>
                        </td>

                        {/* Customer Name */}
                        <td className="py-3 px-4 align-top">
                          <strong className="font-bold text-[#2C1810] block text-sm">
                            {order.customerName}
                          </strong>
                          {order.customerCity && (
                            <span className="text-[11px] text-[#8C7A6B] block">
                              {order.customerCity} {order.customerAddress ? `· ${order.customerAddress}` : ''}
                            </span>
                          )}
                          {order.notes && (
                            <span className="text-[10px] text-[#8C5E35] bg-[#F4EBE1] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                              ملاحظة: {order.notes}
                            </span>
                          )}
                        </td>

                        {/* Customer Phone */}
                        <td className="py-3 px-4 align-top">
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
                        </td>

                        {/* Products */}
                        <td className="py-3 px-4 align-top">
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
                                  <span className="text-[10px] text-[#6B5A4B]">({item.weightLabel})</span>
                                  {item.spiceLevel && (
                                    <span className="text-[10px] text-[#8C5E35]">({item.spiceLevel})</span>
                                  )}
                                </div>
                                <span className="font-bold text-[#3E2723] tabular-nums mr-2">
                                  {item.price * item.quantity} ج
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Price */}
                        <td className="py-3 px-4 text-center align-top">
                          <div className="inline-block bg-[#F4EBE1] px-2.5 py-1 rounded-xl border border-[#DECFBE]">
                            <span className="text-base font-black text-[#2C1810] font-tajawal tabular-nums block">
                              {order.total} <span className="text-xs font-bold text-[#8C5E35]">ج</span>
                            </span>
                            <span className="text-[9px] text-[#6B5A4D] font-bold block">
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

                        {/* Date */}
                        <td className="py-3 px-4 align-top whitespace-nowrap text-xs text-[#6B5A4D]">
                          {order.date}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center align-top whitespace-nowrap">
                          {onUpdateOrderStatus ? (
                            <button
                              onClick={() =>
                                onUpdateOrderStatus(order.id, isDelivered ? 'placed' : 'delivered')
                              }
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
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
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isDelivered
                                  ? 'bg-[#E3F8EA] text-[#1E7E34]'
                                  : 'bg-[#FFF6E5] text-[#B7791F]'
                              }`}
                            >
                              {isDelivered ? 'تم التسليم' : 'قيد التجهيز'}
                            </span>
                          )}
                        </td>

                        {/* Delete Buyer Data Button */}
                        <td className="py-3 px-4 text-center align-top whitespace-nowrap">
                          <button
                            onClick={() => setOrderToDelete(order)}
                            className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                            title="حذف بيانات المشتري والطلب"
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
          /* Cards View in OwnerSection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedOrders.map((order) => {
              const isDelivered = order.status === 'delivered';

              return (
                <div
                  key={order.id}
                  className={`bg-[#FBF8F3] rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${
                    isDelivered ? 'border-[#CDE8D5]' : 'border-[#DECFBE]'
                  }`}
                >
                  <div>
                    {/* Customer Name & Code */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EADBCE]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#3E2723] text-[#F3C07B] flex items-center justify-center font-bold text-base shrink-0">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-[#2C1810]">
                            {order.customerName}
                          </h4>
                          <span className="text-[11px] text-[#8C7A6B] block">
                            {order.date} · {order.orderNumber}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isDelivered
                            ? 'bg-[#E3F8EA] text-[#1E7E34] border border-[#B9E8C7]'
                            : 'bg-[#FFF6E5] text-[#B7791F] border border-[#FDE68A]'
                        }`}
                      >
                        {isDelivered ? 'تم التسليم' : 'قيد التجهيز'}
                      </span>
                    </div>

                    {/* Customer Phone */}
                    <div className="mb-3 p-2.5 bg-white rounded-xl border border-[#EDE2D5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#8C7A6B] block">
                          رقم هاتف المشتري:
                        </span>
                        <bdi
                          dir="ltr"
                          className="font-bold text-sm text-[#2C1810] font-mono tracking-wider block select-all"
                        >
                          {order.customerPhone}
                        </bdi>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="px-2 py-1 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          title="اتصال"
                        >
                          <i className="fa-solid fa-phone text-[9px]"></i>
                          <span>اتصال</span>
                        </a>
                        <a
                          href={`https://wa.me/2${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          title="واتساب"
                        >
                          <i className="fa-brands fa-whatsapp text-[11px]"></i>
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>

                    {/* Products bought */}
                    <div className="mb-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#8C7A6B] block">
                        المنتجات (اشتري ايه):
                      </span>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-white p-2 rounded-lg border border-[#EDE2D5] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#3E2723]">{item.quantity}×</span>
                            <span className="text-[#2C1810] font-medium">{item.productName}</span>
                            <span className="text-[10px] text-[#8C7A6B]">({item.weightLabel})</span>
                            {item.spiceLevel && (
                              <span className="text-[10px] text-[#8C5E35]">({item.spiceLevel})</span>
                            )}
                          </div>
                          <span className="font-bold text-[#3E2723] font-tajawal tabular-nums">
                            {item.price * item.quantity} ج
                          </span>
                        </div>
                      ))}
                      {order.notes && (
                        <div className="text-[11px] text-[#7A6958] bg-[#F4EBE1] px-2 py-1 rounded border border-[#DECFBE]">
                          <strong>ملاحظة:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="pt-3 border-t border-[#EADBCE] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8C7A6B] block">سعر البيع الإجمالي:</span>
                        <div className="text-xl font-black text-[#2C1810] font-tajawal leading-none">
                          {order.total} <span className="text-xs font-bold text-[#8C5E35]">جنيه</span>
                        </div>
                      </div>

                      {onUpdateOrderStatus && (
                        <button
                          onClick={() =>
                            onUpdateOrderStatus(order.id, isDelivered ? 'placed' : 'delivered')
                          }
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
                            isDelivered
                              ? 'bg-white text-[#7A6958] border-[#D9CABB] hover:bg-[#F4EBE1]'
                              : 'bg-[#25D366] hover:bg-[#20ba59] text-white border-[#25D366]'
                          }`}
                        >
                          {isDelivered ? 'إلغاء التسليم' : 'تأكيد التسليم ✓'}
                        </button>
                      )}
                    </div>

                    {/* Delete Buyer Data Button */}
                    <div className="pt-2 border-t border-[#EDE2D5] flex items-center justify-between">
                      <span className="text-[10px] text-[#8C7A6B]">
                        الدفع: {order.paymentMethod === 'cod' ? 'عند الاستلام' : 'إلكتروني'}
                      </span>

                      <button
                        onClick={() => setOrderToDelete(order)}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl border border-red-200 transition-all cursor-pointer flex items-center gap-1.5"
                        title="حذف بيانات هذا المشتري نهائياً"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                        <span>حذف بيانات المشتري</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Expand Toggle */}
        {filteredOrders.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllOrders(!showAllOrders)}
              className="px-5 py-2.5 bg-white hover:bg-[#EADBCE] text-[#3E2723] rounded-xl font-bold text-xs border border-[#D9CABB] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <i className={`fa-solid ${showAllOrders ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              <span>
                {showAllOrders
                  ? 'عرض أقل (أول 6 طلبات)'
                  : `عرض كافة طلبات الزبائن الباقية (${filteredOrders.length} طلب)`}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
