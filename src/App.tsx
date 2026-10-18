  // Order Success Handler
  const handleOrderSuccess = async (rawOrder: Order) => {
    const newOrder = normalizeOrder(rawOrder);

    // 1. حساب نقاط الولاء
    const hasReward = newOrder.items.some((item) => item.isLoyaltyReward);
    setLoyaltyPoints((prev) => {
      let updated = prev;
      if (hasReward) {
        updated = Math.max(0, updated - 100);
      }
      return updated;
    });

    // 2. تحديث قائمة الطلبات فوراً في الواجهة
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.id !== newOrder.id);
      const updated = [newOrder, ...filtered];
      try {
        localStorage.setItem('haroun_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }
      return updated;
    });

    // 3. تصفير السلة
    setCartItems([]);

    // 4. الحفظ في Firebase Firestore
    try {
      await saveOrderToFirestore(newOrder);
      console.log('✅ تم حفظ الطلب في Firebase بنجاح');
    } catch (error) {
      console.error('❌ خطأ في حفظ الطلب بـ Firebase:', error);
    }
  };
lePinSuccess}
      />

      {/* Owner Dashboard Modal (خانة حسابات المتجر: اسم العميل، الرقم، المنتجات، السعر الإجمالي، وتاريخ الطلب) */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onConfirmOrderPoints={handleConfirmOrderPoints}
        onDeleteOrder={handleDeleteOrder}
        onClearAllOrders={handleClearAllOrders}
        onAddManualOrder={handleAddManualOrder}
        onLockDashboard={handleLockOwnerDashboard}
        onRefreshOrders={handleRefreshOrders}
      />

      {/* Floating Shortcut for Shop Owner (Appears after first unlock) */}
      {isOwnerUnlocked && (
        <button
          onClick={() => setIsOwnerDashboardOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 bg-[#2C1810] text-[#F3C07B] hover:text-white hover:bg-[#3E2723] px-4 py-2.5 rounded-2xl shadow-xl border border-[#C5A059]/40 text-xs sm:text-sm font-bold transition-all cursor-pointer group hover:scale-105 active:scale-95 animate-fadeIn"
          title="المكتب - ثروت هارون"
        >
          <div className="w-6 h-6 rounded-lg bg-[#C5A059] text-[#2C1810] flex items-center justify-center font-black text-xs">
            <i className="fa-solid fa-briefcase"></i>
          </div>
          <span>المكتب</span>
          <span className="bg-[#C5A059] text-[#2C1810] text-xs font-black px-1.5 py-0.2 rounded-full tabular-nums">
            {orders.length}
          </span>
        </button>
      )}
    </div>
  );
}
