import type { Product, Order, StoreInventory } from '../types/ecommerce';

export const TIBRA_PRODUCTS: Product[] = [
  {
    id: 'tibra-natural-joint-oil-30ml',
    name: 'Tibra Natural Joint Oil (30 ML)',
    subtitle: 'Natural Relief for Active Living',
    size: '30 ML',
    price: 1500,
    originalPrice: 1990,
    rating: 4.9,
    reviewsCount: 384,
    stock: 48,
    image: '/assets/purefix-bottle-transparent.png',
    description: '100% Natural Herbal Blend formulated with 16 time-tested botanical oils and active roots including Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia.',
    badge: 'Best Seller',
    bundleOffer: 'Save 25% (Flat Rs. 490 OFF)'
  },
  {
    id: 'tibra-natural-joint-oil-bundle-2',
    name: 'Tibra Natural Joint Oil (Duo Pack of 2)',
    subtitle: 'Complete 60-Day Mobility Ritual',
    size: '2 x 30 ML',
    price: 2500,
    originalPrice: 3980,
    rating: 4.9,
    reviewsCount: 196,
    stock: 35,
    image: '/assets/purefix-bottle-box-showcase.jpg',
    description: 'Double pack for continuous daily morning & evening joint care. Best value for chronic knee, lumbar back and joint wellness.',
    badge: 'Best Value Duo',
    bundleOffer: 'Buy 2 for Rs. 2,500 — Save 37% (Flat Rs. 1,480 OFF)'
  },
  {
    id: 'tibra-natural-joint-oil-family-pack',
    name: 'Tibra Natural Complete Family Care (Pack of 3)',
    subtitle: 'Triple Protection Bundle',
    size: '3 x 30 ML',
    price: 4790,
    originalPrice: 7350,
    rating: 5.0,
    reviewsCount: 92,
    stock: 22,
    image: '/assets/purefix-bottle-box-showcase.jpg',
    description: 'Comprehensive family bundle. Keep one at home, one at the office, or gift to parents for pain-free mobility.',
    badge: 'Maximum Savings',
    bundleOffer: 'Save 35% + Free VIP Delivery'
  }
];

// Alias for backwards compatibility
export const PUREFIX_PRODUCTS = TIBRA_PRODUCTS;

export const INITIAL_INVENTORY: StoreInventory[] = [
  {
    productId: 'tibra-natural-joint-oil-30ml',
    productName: 'Tibra Natural Joint Oil (30 ML Single)',
    sku: 'TN-JO-030',
    stock: 48,
    threshold: 15,
    lastRestocked: '2026-10-20'
  },
  {
    productId: 'tibra-natural-joint-oil-bundle-2',
    productName: 'Tibra Natural Joint Oil (Pack of 2)',
    sku: 'TN-JO-060-DUO',
    stock: 35,
    threshold: 10,
    lastRestocked: '2026-10-20'
  },
  {
    productId: 'tibra-natural-joint-oil-family-pack',
    productName: 'Tibra Natural Joint Oil (Family Pack of 3)',
    sku: 'TN-JO-090-TRIO',
    stock: 22,
    threshold: 8,
    lastRestocked: '2026-10-18'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TN-2026-8941',
    date: '2026-10-24 18:24',
    customerName: 'Muhammad Tariq',
    customerPhone: '+92 300 4821950',
    customerEmail: 'tariq.m@gmail.com',
    shippingAddress: 'House 42-B, Street 7, Phase 5, DHA',
    city: 'Lahore',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    items: [
      {
        productId: 'tibra-natural-joint-oil-bundle-2',
        productName: 'Tibra Natural Joint Oil (Pack of 2)',
        quantity: 1,
        price: 3390,
        image: '/assets/purefix-bottle-box-showcase.jpg'
      }
    ],
    subtotal: 3390,
    shippingFee: 0,
    total: 3390,
    status: 'dispatched',
    deliveryCourier: 'Trax Logistics',
    trackingNumber: 'TRX-9481028',
    notes: 'Please call before delivery in evening.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'TN-2026-8942',
    date: '2026-10-24 19:40',
    customerName: 'Dr. Ayesha Siddiqui',
    customerPhone: '+92 333 5192847',
    customerEmail: 'ayesha.doc@yahoo.com',
    shippingAddress: 'Apartment 402, Royal Residency, Clifton Block 4',
    city: 'Karachi',
    paymentMethod: 'Direct Transfer',
    paymentStatus: 'paid',
    items: [
      {
        productId: 'tibra-natural-joint-oil-30ml',
        productName: 'Tibra Natural Joint Oil (30 ML)',
        quantity: 2,
        price: 1850,
        image: '/assets/purefix-bottle-transparent.png'
      }
    ],
    subtotal: 3700,
    shippingFee: 0,
    total: 3700,
    status: 'confirmed',
    deliveryCourier: 'TCS Express',
    trackingNumber: 'TCS-8391023',
    notes: 'Gift pack for elderly parents.'
  },
  {
    id: 'ord-1003',
    orderNumber: 'TN-2026-8943',
    date: '2026-10-24 20:15',
    customerName: 'Kamran Ali Khan',
    customerPhone: '+92 321 8294711',
    customerEmail: 'kamran.ali@hotmail.com',
    shippingAddress: 'Villa 18, Street 12, Sector F-7/2',
    city: 'Islamabad',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    items: [
      {
        productId: 'tibra-natural-joint-oil-30ml',
        productName: 'Tibra Natural Joint Oil (30 ML)',
        quantity: 1,
        price: 1850,
        image: '/assets/purefix-bottle-transparent.png'
      }
    ],
    subtotal: 1850,
    shippingFee: 150,
    total: 2000,
    status: 'pending',
    notes: 'Urgent delivery needed for knee pain.'
  },
  {
    id: 'ord-1004',
    orderNumber: 'TN-2026-8944',
    date: '2026-10-23 14:10',
    customerName: 'Haji Ghulam Rasool',
    customerPhone: '+92 345 7183920',
    shippingAddress: 'Chak 214-RB, Near Main Bazar',
    city: 'Faisalabad',
    paymentMethod: 'COD',
    paymentStatus: 'paid',
    items: [
      {
        productId: 'tibra-natural-joint-oil-family-pack',
        productName: 'Tibra Natural Complete Family Care (Pack of 3)',
        quantity: 1,
        price: 4790,
        image: '/assets/purefix-bottle-box-showcase.jpg'
      }
    ],
    subtotal: 4790,
    shippingFee: 0,
    total: 4790,
    status: 'delivered',
    deliveryCourier: 'Leopards Courier',
    trackingNumber: 'LEO-7482910',
    notes: 'Customer confirmed fast pain relief.'
  }
];
