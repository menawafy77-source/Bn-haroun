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

    // 4. الحفظ في Firebase مع إظهار رسالة واضحة على الشاشة لنعرف النتيجة
    try {
      const success = await saveOrderToFirestore(newOrder);
      if (success) {
        alert('✅ تم حفظ الطلب ورفعها لـ Firebase بنجاح!');
      } else {
        alert('❌ فشل حفظ الطلب في Firebase، راجع قواعد الحماية أو الاتصال.');
      }
    } catch (error: any) {
      alert('❌ خطأ استثنائي: ' + (error?.message || error));
    }
  };
tus']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // When Mr. Tharwat marks an order delivered or confirmed, credit the points if not already credited
          if (newStatus === 'delivered' && !ord.pointsCredited && (ord.pointsEarned || 0) > 0) {
            setLoyaltyPoints((pts) => pts + ord.pointsEarned);
            return { ...ord, status: newStatus, pointsCredited: true };
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );

    // Update in Firestore across all devices
    updateOrderStatusInFirestore(orderId, newStatus);
    // Update server database
    updateOrderStatusInDb(orderId, newStatus);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch {
      // ignore
    }
  };

  // Direct points confirmation by Mr. Tharwat ("النقاط متتضفش لحساب العميل غير لما الطلب يتاكد من استاذ ثروت")
  const handleConfirmOrderPoints = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (!ord.pointsCredited && (ord.pointsEarned || 0) > 0) {
            setLoyaltyPoints((pts) => pts + ord.pointsEarned);
            return {
              ...ord,
              status: 'delivered',
              pointsCredited: true,
            };
          }
        }
        return ord;
      })
    );

    // Update in Firestore across all devices
    updateOrderStatusInFirestore(orderId, 'delivered', true);
    // Update server database
    updateOrderStatusInDb(orderId, 'delivered', true);
    try {
      await supabase.from('orders').update({ status: 'delivered', pointsCredited: true }).eq('id', orderId);
    } catch {
      // ignore
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    deleteOrderFromFirestore(orderId);
    deleteOrderFromDb(orderId);
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch {
      // ignore
    }
  };

  const handleClearAllOrders = async () => {
    setOrders([]);
    clearAllOrdersFromFirestore();
    clearAllOrdersFromDb();
    try {
      localStorage.setItem('haroun_orders', JSON.stringify([]));
      localStorage.removeItem('haroun_orders');
    } catch {
      // ignore
    }
  };

  const handleAddManualOrder = async (rawOrder: Order) => {
    const newOrder = normalizeOrder(rawOrder);
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder);
    saveOrderToDb(newOrder);

    try {
      await supabase.from('orders').insert([newOrder]);
    } catch {
      // ignore
    }
  };

  const handleRefreshOrders = async () => {
    const serverOrders = await fetchOrdersFromDb();
    if (serverOrders.length > 0) {
      setOrders(serverOrders);
    }
  };

  // Owner Secret Authentication Handlers
  const handleFooterLogoClick = () => {
    if (isOwnerUnlocked) {
      setIsOwnerDashboardOpen(true);
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setIsOwnerUnlocked(true);
    setIsOwnerDashboardOpen(true);
  };

  const handleLockOwnerDashboard = () => {
    try {
      localStorage.removeItem('haroun_owner_unlocked');
    } catch {
      // ignore
    }
    setIsOwnerUnlocked(false);
    setIsOwnerDashboardOpen(false);
  };

  // Navigation scroll helper
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#2C1810] flex flex-col selection:bg-[#C5A059] selection:text-white font-tajawal">
      {/* 1. Navbar (Orouba Coffee Style with Announcement Bar) */}
      <Navbar
        cartCount={cartItemCount}
        loyaltyPoints={loyaltyPoints}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        isOwnerUnlocked={isOwnerUnlocked}
      />

      <main className="flex-1">
        {/* 1. Hero Section (with video embedded at the top) */}
        <HeroSection
          onExploreProducts={() => handleNavigate('products')}
        />

        {/* 2. Products Section (متجر البن) */}
        <ProductsSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onOpenDetails={(p) => setSelectedProductForDetail(p)}
        />

        {/* 5. Loyalty Points & Rewards Section (نظام النقاط والمكافآت - كيس صغير بنقطة وكيس كبير بـ3 نقاط و100 نقطة بكيلو) */}
        <LoyaltyPointsSection
          loyaltyPoints={loyaltyPoints}
          onRedeemReward={handleRedeemLoyaltyReward}
          hasRedeemedInCart={cartItems.some((i) => i.isLoyaltyReward)}
          orders={orders}
          cartItems={cartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onExploreProducts={() => handleNavigate('products')}
        />

        {/* 6. Wholesale & B2B Section (خانة تجار الجملة، الكافيهات والمحامص) */}
        <WholesaleSection />

        {/* 7. Roastery Story & Craftsmanship (قصة بن هارون) */}
        <StorySection />

        {/* 5. Brewing Masterclass (طريقة التحضير والفنجان المظبوط) */}
        <BrewingGuide />

        {/* 6. Branches & Outlets (الفروع ومنافذ البيع) */}
        <BranchesSection />

        {/* 7. Product Reviews & Customer Testimonials (آراء العملاء) */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* 8. Office Section (المكتب - ثروت هارون - تظهر تلقائياً بعد الفتح لأول مرة) */}
        {isOwnerUnlocked && (
          <OwnerSection
            orders={orders}
            onOpenDashboard={() => setIsOwnerDashboardOpen(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onConfirmOrderPoints={handleConfirmOrderPoints}
            onDeleteOrder={handleDeleteOrder}
            onLockDashboard={handleLockOwnerDashboard}
            onRefreshOrders={handleRefreshOrders}
          />
        )}

        <FacebookBanner />

        {/* 9. Contact & Hotline Section (اتصل بنا والطلب السريع) */}
        <ContactSection />
      </main>

      {/* 10. Footer (Orouba Style with Secret Owner Logo Gateway) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        onFooterLogoClick={handleFooterLogoClick}
        isOwnerUnlocked={isOwnerUnlocked}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Simplified Fast Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Product Detail & Tasting Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        reviews={reviews}
        onAddReview={handleAddReview}
        onAddToCartFromModal={(prod, size) => {
          const sizeObj = prod.sizes.find((s) => s.weight === size) || prod.sizes[1];
          handleAddToCart({
            productId: prod.id,
            productName: prod.name,
            category: prod.category,
            weight: size,
            weightLabel: sizeObj.weightLabel,
            price: sizeObj.price,
            spiceLevel: prod.category === 'محوج' ? 'مخصوص متوازن' : undefined,
            quantity: 1,
            image: prod.image,
          });
        }}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => {
          setSelectedProductForDetail(p);
        }}
      />

      {/* Secret PIN Entry Modal for Shop Owner (Triggered from Footer Logo) */}
      <OwnerPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
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
