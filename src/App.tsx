import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Coffee, 
  Sparkles 
} from 'lucide-react';
import { Product, Order, CartItem } from './types';
import { PRODUCTS } from './data/coffeeData';
import { normalizeOrder } from './utils/orderUtils';
import { 
  subscribeToFirestoreOrders, 
  saveOrderToFirestore 
} from './services/firestoreOrderService';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Real-time Firestore Subscription & Local Orders Sync
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#2C221E] text-[#FDFBF7] shadow-lg border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4A373]/20 border border-[#D4A373] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">بن هارون</h1>
              <p className="text-xs text-[#D4A373]">محمصة البن المختص والفاخر</p>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#3E2F29] border border-[#D4A373]/30 flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5 text-[#D4A373]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4A373] text-[#2C221E] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#D4A373]/15 text-[#8C6239] mb-4 border border-[#D4A373]/30">
            <Sparkles className="w-3.5 h-3.5" /> قهوة مختصة تُحمّص بكل حب
          </span>
          <h2 className="text-3xl font-extrabold text-[#2C221E] mb-4">
            اختر قهوتك المفضلة وتصلك فوراً لمكتب أستاذ ثروت
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-[#EBE5D8] overflow-hidden flex flex-col">
              <div className="relative h-48 bg-[#F5F1EA]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#2C221E] mb-1">{product.name}</h3>
                  <p className="text-xs text-[#8C6239] mb-3">{product.origin} • {product.process}</p>
                  <p className="text-sm text-[#6B5B53] line-clamp-2 mb-4">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#F5F1EA]">
                  <span className="text-lg font-extrabold text-[#2C221E]">{product.price} ج.م</span>
                  <button 
                    onClick={async () => {
                      const newOrder: Order = {
                        id: 'ORD-' + Math.floor(1000000000 + Math.random() * 9000000000),
                        items: [{ product, quantity: 1 }],
                        totalAmount: product.price,
                        customerName: 'عميل متجر بن هارون',
                        customerPhone: '01000000000',
                        status: 'pending',
                        date: new Date().toISOString()
                      };
                      const normalized = normalizeOrder(newOrder);
                      setOrders(prev => [normalized, ...prev]);
                      setCartItems([]);
                      await saveOrderToFirestore(normalized);
                      alert('✅ تم إرسال الطلب لمكتب أستاذ ثروت بنجاح!');
                    }}
                    className="px-4 py-2 bg-[#2C221E] hover:bg-[#D4A373] text-[#FDFBF7] text-xs font-bold rounded-xl transition-colors"
                  >
                    اطلب الآن فوراً
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C221E] text-[#FDFBF7] py-6 text-center text-xs mt-16 border-t border-[#D4A373]/20">
        <p>© 2026 محمصة بن هارون. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
                               }
