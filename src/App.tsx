/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductsSection } from './components/ProductsSection';
import { StorySection } from './components/StorySection';
import { LoyaltyPointsSection } from './components/LoyaltyPointsSection';
import { WholesaleSection } from './components/WholesaleSection';
import { BrewingGuide } from './components/BrewingGuide';
import { BranchesSection } from './components/BranchesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { OwnerSection } from './components/OwnerSection';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { OwnerPinModal } from './components/OwnerPinModal';
import { Footer } from './components/Footer';
import { FacebookBanner } from './components/FacebookBanner';
import { supabase } from './supabaseClient';
import { normalizeOrder } from './utils/orderUtils';
import {
  saveOrderToDb,
  updateOrderStatusInDb,
  deleteOrderFromDb,
  clearAllOrdersFromDb,
} from './services/apiOrderService';
import {
  subscribeToFirestoreOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  clearAllOrdersFromFirestore,
  fetchFirestoreOrders,
} from './services/firestoreOrderService';

import {
  Product,
  CartItem,
  Order,
  Review,
  MehawegSpiceLevel,
} from './types';
import {
  PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  STORE_CONTACT,
} from './data/coffeeData';

export default function App() {
  // 1. Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('haroun_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Orders State with localStorage persistence (No auto-clearing / cancellation of automatic filtering)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('haroun_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeOrder);
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // 3. Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('haroun_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 4. Customer Loyalty Points State with localStorage persistence (Starts at 0 for new visitors)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('haroun_loyalty_points');
      return saved !== null ? parseInt(saved, 10) : 0; // تبدأ من صفر للعميل الجديد
    } catch {
      return 0;
    }
  });

  // Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [isCloudPending, setIsCloudPending] = useState(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Hidden Shop Owner Authentication State (Persists across visits)
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('haroun_owner_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Restore owner PIN to old default '00112275'
  useEffect(() => {
    try {
      localStorage.setItem('haroun_owner_pin', '00112275');
    } catch {
      // ignore
    }
  }, []);

  // Sync orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem('haroun_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [orders]);

  // Firestore is the only authority for orders. Local data is just a display cache.
  useEffect(() => {
    return subscribeToFirestoreOrders(
      setOrders,
      (error) => {
        console.error('Order synchronization failed:', error);
        setSyncError('تعذرت مزامنة الطلبات. تحقق من اتصال الإنترنت وإعدادات وصلاحيات Firestore للقاعدة الافتراضية.');
      },
      (fromCache) => setIsCloudPending(fromCache),
    );
  }, []);

  const requireCloudWrite = async (operation: Promise<boolean>): Promise<boolean> => {
    const saved = await operation;
    setSyncError(saved ? '' : 'لم يتم حفظ التغيير سحابياً. تحقق من اتصال الإنترنت وصلاحيات Firestore ثم أعد المحاولة.');
    return saved;
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('haroun_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('haroun_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('haroun_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  // Cart Handlers
  const handleAddToCart = (newItem: {
    productId: 'haroun-sada' | 'haroun-mehaweg';
    productName: string;
    category: string;
    weight: '100g' | '250g';
    weightLabel: string;
    price: number;
    spiceLevel?: MehawegSpiceLevel;
    quantity: number;
    image: string;
  }) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.weight === newItem.weight &&
          item.spiceLevel === newItem.spiceLevel
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      } else {
        const generatedId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        return [...prev, { ...newItem, id: generatedId }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Review Submissions
  const handleAddReview = (newRevData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newRev: Review = {
      ...newRevData,
      id: `rev-${Date.now()}`,
      date: 'الآن',
      likes: 1,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Redeem 100 Points for 1kg Coffee Free Reward
  const handleRedeemLoyaltyReward = () => {
    if (loyaltyPoints < 100) {
      return;
    }

    // Check if already in cart
    const alreadyInCart = cartItems.some((item) => item.isLoyaltyReward);
    if (alreadyInCart) {
      setIsCartOpen(true);
      return;
    }

    const rewardItem: CartItem = {
      id: `reward-free-1kg-${Date.now()}`,
      productId: 'haroun-sada',
      productName: 'كيلو بن فاخر (مكافأة الولاء الكبرى)',
      category: 'سادة أو محوج',
      weight: '1000g',
      weightLabel: '1 كيلو (1000 جم) مجاناً',
      price: 0,
      quantity: 1,
      image: '/hero_haroun_coffee_1791931203817.jpg',
      spiceLevel: 'مخصوص متوازن',
      isLoyaltyReward: true,
    };

    setCartItems((prev) => [rewardItem, ...prev]);
    setIsCartOpen(true);
  };

  // Order Success Handler (تحديث الطلبات وحفظها فورا لظهورها في المكتب والمزامنة مع قاعدة البيانات)
  const handleOrderSuccess = async (rawOrder: Order) => {
    const newOrder = normalizeOrder(rawOrder);
    if (!await requireCloudWrite(saveOrderToFirestore(newOrder))) {
      throw new Error('تعذر إرسال الطلب إلى المتجر. لم يتم تفريغ السلة؛ يرجى إعادة المحاولة.');
    }

    // 1. حساب نقاط الولاء
    const hasReward = newOrder.items.some((item) => item.isLoyaltyReward);
    setLoyaltyPoints((prev) => {
      let updated = prev;
      if (hasReward) {
        updated = Math.max(0, updated - 100);
      }
      return updated;
    });

    // 2. تحديث قائمة الطلبات فوراً في الواجهة والمكتب
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

    // 5. الحفظ أيضاً في قاعدة بيانات السيرفر المحلية (/api/orders) للاحتياط
    saveOrderToDb(newOrder);

    // 6. محاولة إرسال إضافية إلى Supabase في الخلفية إن كانت متاحة
    try {
      const transferNumberVal = newOrder.notes?.includes('رقم التحويل:')
        ? newOrder.notes.replace('رقم التحويل: ', '').trim()
        : null;

      const dbPayload: any = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        phone: newOrder.customerPhone,
        customerAddress: newOrder.customerAddress,
        address: newOrder.customerAddress,
        customerCity: newOrder.customerCity,
        total: newOrder.total,
        totalPrice: newOrder.total,
        paymentMethod: newOrder.paymentMethod || 'الدفع عند الاستلام',
        transferNumber: transferNumberVal,
        status: newOrder.status || 'placed',
        items: newOrder.items,
        notes: newOrder.notes,
        date: newOrder.date,
      };

      await supabase.from('orders').insert([dbPayload]);
    } catch {
      // ignore
    }
  };

  // Owner Order Management Handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    const creditPoints = newStatus === 'delivered' && !currentOrder?.pointsCredited &&
      (currentOrder?.pointsEarned || 0) > 0;
    const pointsCredited = creditPoints ? true : currentOrder?.pointsCredited;
    if (!await requireCloudWrite(updateOrderStatusInFirestore(orderId, newStatus, pointsCredited))) return;
    if (creditPoints && currentOrder) setLoyaltyPoints((pts) => pts + currentOrder.pointsEarned);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // When Mr. Tharwat marks an order delivered or confirmed, credit the points if not already credited
          if (newStatus === 'delivered' && !ord.pointsCredited && (ord.pointsEarned || 0) > 0) {
            return { ...ord, status: newStatus, pointsCredited: true };
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );

    // Update in Firestore across all devices
    // Update server database
    updateOrderStatusInDb(orderId, newStatus, pointsCredited);
    try {
      await supabase.from('orders').update({ status: newStatus, pointsCredited }).eq('id', orderId);
    } catch {
      // ignore
    }
  };

  // Direct points confirmation by Mr. Tharwat ("النقاط متتضفش لحساب العميل غير لما الطلب يتاكد من استاذ ثروت")
  const handleConfirmOrderPoints = async (orderId: string) => {
    if (!await requireCloudWrite(updateOrderStatusInFirestore(orderId, 'delivered', true))) return;
    const currentOrder = orders.find((order) => order.id === orderId);
    if (currentOrder && !currentOrder.pointsCredited && currentOrder.pointsEarned > 0) {
      setLoyaltyPoints((pts) => pts + currentOrder.pointsEarned);
    }
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
            return {
              ...ord,
              status: 'delivered',
              pointsCredited: true,
            };
        }
        return ord;
      })
    );

    // Update in Firestore across all devices
    // Update server database
    updateOrderStatusInDb(orderId, 'delivered', true);
    try {
      await supabase.from('orders').update({ status: 'delivered', pointsCredited: true }).eq('id', orderId);
    } catch {
      // ignore
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!await requireCloudWrite(deleteOrderFromFirestore(orderId))) return;
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    deleteOrderFromDb(orderId);
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch {
      // ignore
    }
  };

  const handleClearAllOrders = async () => {
    if (!await requireCloudWrite(clearAllOrdersFromFirestore())) return;
    setOrders([]);
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
    if (!await requireCloudWrite(saveOrderToFirestore(newOrder))) return;
    setOrders((prev) => [newOrder, ...prev.filter((order) => order.id !== newOrder.id)]);
    saveOrderToDb(newOrder);

    try {
      await supabase.from('orders').insert([newOrder]);
    } catch {
      // ignore
    }
  };

  const handleRefreshOrders = async () => {
    try {
      setOrders(await fetchFirestoreOrders());
      setSyncError('');
    } catch (error) {
      console.error('Firestore refresh failed:', error);
      setSyncError('تعذر تحديث الطلبات من Firestore. تحقق من الاتصال وصلاحيات القاعدة الافتراضية.');
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
        {(syncError || isCloudPending) && (
          <div role={syncError ? 'alert' : 'status'} className="bg-amber-50 p-3 text-center text-sm text-amber-900" dir="rtl">
            {syncError || 'جارٍ الاتصال بقاعدة الطلبات؛ البيانات المحلية قد لا تكون محدثة.'}
          </div>
        )}
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
