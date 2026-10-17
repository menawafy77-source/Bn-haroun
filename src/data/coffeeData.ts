import { Product, Review, Order, NotificationOffer, LoyaltyProfile } from '../types';

export const STORE_CONTACT = {
  name: 'بن هارون',
  tagline: 'عبق القهوة العربية والتركية الأصيلة بأرخص الأسعار وأعلى جودة',
  phone: '01275075046',
  formattedPhone: '01275075046',
  whatsappUrl: 'https://wa.me/201275075046',
  facebookUrl: 'https://www.facebook.com/Brandworid/',
  instapayAccount: '01206027305',
  vodafoneCashNumber: '01002563614',
  address: 'مصر - الجيزة - مدينة السادس من أكتوبر',
  outletLocation: 'مدينة السادس من أكتوبر - محافظة الجيزة',
  workingHours: 'يومياً من 9:00 صباحاً حتى 11:00 مساءً',
};

export const PRODUCTS: Product[] = [
  {
    id: 'haroun-sada',
    name: 'بن هارون سادة فاخر',
    subtitle: 'توليفة أرابيكا وروبوستا نقية 100% بدون إضافات لمذاق غني وقوام كريمي',
    description: 'تم اختيار حبوب البن بعناية فائقة من أجود مزارع البن، وتحميصها طازجة بطريقة حرفية تمنحك فنجاناً متوازناً مع كريمة (وش) غنية ومذاق قهوة نقي يدوم طويلاً.',
    category: 'سادة',
    image: '/product_haroun_sada_1791931204378.jpg',
    sizes: [
      { weight: '100g', weightLabel: '100 جرام', price: 70 },
      { weight: '250g', weightLabel: '250 جرام', price: 160, popular: true }
    ],
    rating: 4.9,
    reviewsCount: 142,
    flavorNotes: ['شوكولاتة داكنة', 'مكسرات محمصة', 'حموضة خفيفة متوازنة', 'قوام مخملي كثيف'],
    features: [
      'تحميص وطحن فوري قبل التغليف مباشرة',
      'حبوب بن منتقاة يدوياً خالية من العيوب',
      'صمام تفريغ هواء للحفاظ على طزاجة النكهة',
      'مناسب تماماً للقهوة التركي ذات الوش الثقيل'
    ]
  },
  {
    id: 'haroun-mehaweg',
    name: 'بن هارون محوج ملكي',
    subtitle: 'توليفة فاخرة مع حبهان أخضر هندي أصيل ومستكة يونانية وقرنفل بلدي',
    description: 'خلطة بن هارون السرية التي تجمع بين حبوب البن الممتازة وأندر أنواع الحبهان الأخضر والمستكة والقرنفل بنسب دقيقة وموزونة تعيد إليك أصالة مجالس القهوة العربية وعراقة الدكاكين التراثية.',
    category: 'محوج',
    image: '/product_haroun_mehaweg_1791931205594.jpg',
    sizes: [
      { weight: '100g', weightLabel: '100 جرام', price: 85 },
      { weight: '250g', weightLabel: '250 جرام', price: 200, popular: true }
    ],
    spiceLevels: ['خفيف', 'مخصوص متوازن', 'دبل حبهان ملكي مع مستكة'],
    rating: 4.95,
    reviewsCount: 189,
    flavorNotes: ['حبهان أخضر فواح', 'مستكة عطرية', 'لمسة قرنفل دافئة', 'نهاية حلوة كراميلية'],
    features: [
      'حبهان أخضر هندي حبة كاملة يتم طحنها مع البن',
      'مستكة طبيعية نقية تعطي الفنجان رائحة لا تقاوم',
      'تحويجة متوازنة لا تطغى على طعم البن الأصلي',
      'تعبئة محكمة بأكياس كرافت عالية الحفظ الغذائي'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'haroun-mehaweg',
    author: 'المهندس أحمد شكري',
    rating: 5,
    date: 'منذ يومين',
    comment: 'ما شاء الله تبارك الله، طلبت البن المحوج 250 جم، ريحة الحبهان والمستكة فاحت في البيت كله أول ما فتحت الكيس، والوش في الكنكة النحاس ثابت ومثالي جداً. تسلم إيديكم!',
    isVerified: true,
    likes: 24
  },
  {
    id: 'rev-2',
    productId: 'haroun-sada',
    author: 'د. محمود عبد الرحمن',
    rating: 5,
    date: 'منذ 4 أيام',
    comment: 'أنا مدمن بن سادة وبجرب من كل المحامص المعروفة في القاهرة، بن هارون تفوق بامتياز في نقاء الحبة وعدم وجود أي مرارة صناعية، وطعم البن نقي 100%. التوصيل كان سريع جداً.',
    isVerified: true,
    likes: 19
  },
  {
    id: 'rev-3',
    productId: 'haroun-mehaweg',
    author: 'أستاذ سامح القاضي',
    rating: 5,
    date: 'منذ أسبوع',
    comment: 'البن المحوج دبل حبهان حاجة من كوكب تاني! طاقة ومزاج عالي جداً لبداية يوم الشغل.',
    isVerified: true,
    likes: 15
  },
  {
    id: 'rev-4',
    productId: 'haroun-sada',
    author: 'نورهان فهمي',
    rating: 5,
    date: 'منذ أسبوعين',
    comment: 'طلبت البن السادة 100 جم للتجربة، بجد طعم أصيل ووش تقيل ومظبوط، وطلبت بعدها 250 جم على طول.',
    isVerified: true,
    likes: 12
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_LOYALTY: LoyaltyProfile = {
  name: 'عاشق القهوة الأصيل',
  phone: '01275075046',
  points: 0,
  tier: 'bronze',
  tierName: 'عضو بن هارون',
  ordersCount: 1,
  totalSpent: 270,
  memberSince: 'أكتوبر 2026'
};

export const INITIAL_NOTIFICATIONS: NotificationOffer[] = [
  {
    id: 'notif-1',
    title: 'تحميص طازج يومي متوفر الآن',
    message: 'تم الانتهاء من تحميص دفعة طازجة من البن السادة والمحوج بحبوب أرابيكا ممتازة ومستكة نقية.',
    time: 'منذ ساعة',
    type: 'offer',
    read: false
  },
  {
    id: 'notif-2',
    title: 'توليفة البن المحوج الملكي',
    message: 'متوفر بن محوج دبل حبهان أخضر هندي ومستكة يونانية لعشاق الفنجان الثقيل ذو الوش الذهبي.',
    time: 'منذ 5 ساعات',
    type: 'offer',
    read: false
  }
];
