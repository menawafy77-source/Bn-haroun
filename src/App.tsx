import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Coffee, 
  Package, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { Product, Order, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { normalizeOrder } from './utils/orderUtils';
import { 
  subscribeToFirestoreOrders, 
  saveOrderToFirestore, 
  updateOrderStatusInFirestore, 
  deleteOrderFromFirestore, 
  clearAllOrdersFromFirestore 
} from './services/firestoreOrderService';

export default function App() {
  // States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  
  // Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
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

  // Real-time Firestore Subscription & Local Orders Sync
  useEffect(() => {
    // 1. Load initial local orders as fallback
    try {
      const savedOrders = localStorage.getItem('haroun_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed.map(normalizeOrder));
        }
      }
      const savedPoints = localStorage.getItem('haroun_loyalty');
      if (savedPoints) {
        setLoyaltyPoints(Number(savedPoints));
      }
    } catch (e) {
      console.error('Error loading initial local storage:', e);
    }

    // 2. Setup Real-time Firestore Listener across all devices
    const unsubscribe = subscribeToFirestoreOrders(
      (firestoreOrders) => {
        setOrders(firestoreOrders);
        try {
          localStorage.setItem('haroun_orders', JSON.stringify(firestoreOrders));
        } catch (e) {
          console.error('Error saving orders to localStorage:', e);
        }
      },
      (err) => {
        console.warn('Using local fallback due to Firestore sync error:', err);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save loyalty points when updated
  useEffect(() => {
    try {
      localStorage.setItem('haroun_loyalty', loyaltyPoints.toString());
    } catch (e) {
      console.error('Error saving loyalty points:', e);
    }
  }, [loyaltyPoints]);

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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col font-sans selection:bg-[#D4A373] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#2C221E]/95 backdrop-blur-md text-[#FDFBF7] shadow-lg border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4A373]/20 border border-[#D4A373] flex items-center justify-center shadow-inner">
              <Coffee className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">بن هارون</h1>
              <p className="text-xs text-[#D4A373] tracking-wider">محمصة البن المختص والفاخر</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#3E2F29] hover:bg-[#D4A373]/20 transition-colors border border-[#D4A373]/30 flex items-center gap-2"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart className="w-5 h-5 text-[#D4A373]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4A373] text-[#2C221E] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        
