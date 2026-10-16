export type MehawegSpiceLevel = 'خفيف' | 'مخصوص متوازن' | 'دبل حبهان ملكي مع مستكة';

export interface ProductWeightOption {
  weight: '100g' | '250g';
  weightLabel: string;
  price: number;
  popular?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  isVerified: boolean;
  likes: number;
}

export interface Product {
  id: 'haroun-sada' | 'haroun-mehaweg';
  name: string;
  subtitle: string;
  description: string;
  category: 'سادة' | 'محوج';
  image: string;
  sizes: ProductWeightOption[];
  spiceLevels?: MehawegSpiceLevel[];
  rating: number;
  reviewsCount: number;
  flavorNotes: string[];
  features: string[];
}

export interface CartItem {
  id: string; // unique item id
  productId: 'haroun-sada' | 'haroun-mehaweg';
  productName: string;
  category: string;
  weight: '100g' | '250g' | '1000g';
  weightLabel: string;
  price: number;
  spiceLevel?: MehawegSpiceLevel;
  quantity: number;
  image: string;
  isLoyaltyReward?: boolean;
}

export type PaymentMethod = 'cod' | 'instapay' | 'vodafone_cash' | 'card';

export type OrderStatus = 'placed' | 'roasting' | 'packaged' | 'out_for_delivery' | 'delivered';

export interface OrderTimelineStep {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  pointsDiscount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'paid';
  status: OrderStatus;
  statusStep: number;
  trackingCode: string;
  carrier: string;
  estimatedDelivery: string;
  notes?: string;
  pointsEarned: number;
  pointsCredited?: boolean;
  timeline: OrderTimelineStep[];
}

export interface LoyaltyProfile {
  name: string;
  phone: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  tierName: string;
  ordersCount: number;
  totalSpent: number;
  memberSince: string;
}

export interface NotificationOffer {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'offer' | 'reward' | 'system' | 'order';
  code?: string;
  discountPercent?: number;
  read: boolean;
}
