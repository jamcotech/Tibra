import type {
  Product,
  CartItem,
  Order,
  StoreInventory,
  OrderStatus,
  CustomerRecord,
  StoreSettings,
  AdminUser,
  SalesAnalytics,
  PricingConfig,
  SenderSettings,
  OrderStatusHistoryEntry,
  OrderPricingSnapshot
} from '../types/ecommerce';
import { TIBRA_PRODUCTS, INITIAL_ORDERS, INITIAL_INVENTORY } from './mockData';

const STORAGE_KEYS = {
  CART: 'tibra_cart_v1',
  ORDERS: 'tibra_orders_v1',
  INVENTORY: 'tibra_inventory_v1',
  PRODUCTS: 'tibra_products_v3',
  AUTH: 'tibra_spree_auth_v1',
  SETTINGS: 'tibra_store_settings_v1',
  PRICING: 'tibra_pricing_config_v1',
  SENDER: 'tibra_sender_settings_v1',
};

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  singleBottle: {
    id: 'tibra-natural-joint-oil-30ml',
    name: 'TIBRA NATURALS Pain Relief Oil (30 ML)',
    sku: 'TN-PRO-030',
    bottleQuantity: 1,
    unitPrice: 1500,
    packagePrice: 1500,
    originalPrice: 1990,
    deliveryCharges: 200,
    deliveryFee: 200,
    isDeliveryIncluded: false,
    freeDelivery: false,
    enabled: true,
  },
  twoBottleCombo: {
    id: 'tibra-natural-joint-oil-bundle-2',
    name: 'TIBRA NATURALS Two-Bottle Combo',
    sku: 'TN-PRO-060-DUO',
    bottleQuantity: 2,
    packagePrice: 2600,
    originalPrice: 3980,
    deliveryCharges: 0,
    deliveryFee: 0,
    isDeliveryIncluded: true,
    freeDelivery: true,
    enabled: true,
  },
  threeBottleFamily: {
    id: 'tibra-natural-joint-oil-family-pack',
    name: 'TIBRA NATURALS Complete Family Care (Pack of 3)',
    sku: 'TN-PRO-090-TRI',
    bottleQuantity: 3,
    packagePrice: 3600,
    originalPrice: 5970,
    deliveryCharges: 0,
    deliveryFee: 0,
    isDeliveryIncluded: true,
    freeDelivery: true,
    enabled: true,
  },
  standardDeliveryFee: 200,
  freeDeliveryThreshold: 2600,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SENDER_SETTINGS: SenderSettings = {
  businessName: 'TIBRA NATURALS',
  senderAddress: 'R-60, Pink Residency, Gulistan-e-Johar, Block 8, Karachi, Pakistan.',
  officialPhone: '+92 321 8294711',
  whatsappNumber: '+92 321 8294711',
  website: 'https://www.tibranaturals.com/',
  facebookUrl: 'https://www.facebook.com/tibranaturals',
  instagramUrl: 'https://www.instagram.com/tibranaturals/',
  socialHandle: '@tibranaturals',
  logoUrl: '/assets/tibra-naturals-brand-logo.png',
  taxRatePercent: 0,
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'TIBRA NATURALS Official Store',
  legalBusinessName: 'Tibra Naturals Botanical Wellness Ltd.',
  supportEmail: 'orders@tibranaturals.com',
  supportPhone: '+92 321 8294711',
  currency: 'PKR',
  timezone: 'Asia/Karachi (UTC+5)',
  standardShippingFee: 200,
  freeDeliveryThreshold: 2600,
  codEnabled: true,
  bankTransferEnabled: true,
  autoFulfill: false,
};

const DEFAULT_ADMIN: AdminUser = {
  id: 'usr-admin-1',
  name: 'Store Administrator',
  email: 'admin@tibranaturals.com',
  role: 'Store Administrator & Owner',
};

// Transition matrix for order workflow guards
export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['approved', 'cancelled'],
  approved: ['processing', 'packed', 'ready_for_dispatch', 'cancelled'],
  processing: ['packed', 'ready_for_dispatch', 'cancelled'],
  packed: ['ready_for_dispatch', 'processing', 'cancelled'],
  ready_for_dispatch: ['dispatched', 'packed', 'cancelled'],
  dispatched: ['delivered', 'returned', 'in_transit', 'out_for_delivery'],
  delivered: ['returned'],
  cancelled: ['pending'], // Admin can reopen cancelled with audit
  returned: [],
  confirmed: ['processing', 'packed', 'ready_for_dispatch', 'cancelled'],
  order_placed: ['order_confirmed', 'approved', 'cancelled'],
  order_confirmed: ['processing', 'packed', 'ready_for_dispatch', 'cancelled'],
  shipment_booked: ['dispatched', 'in_transit', 'courier_picked_up'],
  courier_picked_up: ['in_transit', 'out_for_delivery'],
  in_transit: ['arrived_at_hub', 'out_for_delivery', 'delivered', 'delayed'],
  arrived_at_hub: ['out_for_delivery', 'held_at_hub'],
  out_for_delivery: ['delivered', 'delivery_attempted', 'customer_unavailable'],
  delivery_attempted: ['out_for_delivery', 'returned_to_sender'],
  delayed: ['in_transit', 'out_for_delivery'],
  address_issue: ['out_for_delivery', 'returned_to_sender'],
  customer_unavailable: ['out_for_delivery', 'returned_to_sender'],
  held_at_hub: ['out_for_delivery', 'returned_to_sender'],
  returned_to_sender: ['returned'],
};

export function canTransitionStatus(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  const allowed = VALID_STATUS_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

/**
 * Centrally calculated item pricing using dynamic PricingConfig
 */
export function calculateItemPrice(product: Product, quantity: number, explicitPricing?: PricingConfig): {
  total: number;
  regularTotal: number;
  originalRegularTotal: number;
  discount: number;
  percentOff: number;
  isDuoApplied: boolean;
  unitPrice: number;
} {
  const pricing = explicitPricing || storeService.getPricingConfig();
  const isCombo = product.id === 'tibra-natural-joint-oil-bundle-2' || product.id.includes('bundle') || product.id.includes('combo');
  const isFamily = product.id === 'tibra-natural-joint-oil-family-pack' || product.id.includes('family');

  let total = 0;
  let regularTotal = 0;
  let isDuoApplied = false;
  let unitPrice = pricing.singleBottle.unitPrice;

  if (isCombo) {
    total = pricing.twoBottleCombo.packagePrice * quantity;
    regularTotal = pricing.twoBottleCombo.originalPrice * quantity;
    unitPrice = Math.round(pricing.twoBottleCombo.packagePrice / 2);
    isDuoApplied = true;
  } else if (isFamily) {
    total = pricing.threeBottleFamily.packagePrice * quantity;
    regularTotal = pricing.threeBottleFamily.originalPrice * quantity;
    unitPrice = Math.round(pricing.threeBottleFamily.packagePrice / 3);
    isDuoApplied = true;
  } else {
    // Single product line item
    if (quantity === 1) {
      total = pricing.singleBottle.unitPrice;
      regularTotal = pricing.singleBottle.originalPrice;
      unitPrice = pricing.singleBottle.unitPrice;
      isDuoApplied = false;
    } else if (quantity === 2) {
      total = pricing.twoBottleCombo.packagePrice;
      regularTotal = pricing.twoBottleCombo.originalPrice;
      unitPrice = Math.round(pricing.twoBottleCombo.packagePrice / 2);
      isDuoApplied = true;
    } else if (quantity === 3) {
      total = pricing.threeBottleFamily.packagePrice;
      regularTotal = pricing.threeBottleFamily.originalPrice;
      unitPrice = Math.round(pricing.threeBottleFamily.packagePrice / 3);
      isDuoApplied = true;
    } else {
      const comboUnitPrice = Math.round(pricing.twoBottleCombo.packagePrice / 2);
      total = comboUnitPrice * quantity;
      regularTotal = pricing.singleBottle.originalPrice * quantity;
      unitPrice = comboUnitPrice;
      isDuoApplied = true;
    }
  }

  const discount = Math.max(0, regularTotal - total);
  const percentOff = regularTotal > 0 ? Math.round((discount / regularTotal) * 100) : 0;

  return {
    total,
    regularTotal,
    originalRegularTotal: regularTotal,
    discount,
    percentOff,
    isDuoApplied,
    unitPrice
  };
}

/**
 * Centrally calculated cart totals with delivery charge rules
 */
export function calculateCartTotal(cart: CartItem[], explicitPricing?: PricingConfig): {
  subtotal: number;
  regularSubtotal: number;
  totalDiscount: number;
  shippingFee: number;
  grandTotal: number;
  isFreeDelivery: boolean;
} {
  const pricing = explicitPricing || storeService.getPricingConfig();
  if (cart.length === 0) {
    return {
      subtotal: 0,
      regularSubtotal: 0,
      totalDiscount: 0,
      shippingFee: 0,
      grandTotal: 0,
      isFreeDelivery: true
    };
  }

  let subtotal = 0;
  let regularSubtotal = 0;
  let anyFreeDelivery = false;
  let maxDeliveryFee = 0;

  for (const item of cart) {
    const calc = calculateItemPrice(item.product, item.quantity, pricing);
    subtotal += calc.total;
    regularSubtotal += calc.regularTotal;

    const isCombo = item.product.id.includes('bundle') || item.product.id.includes('combo') || item.quantity === 2;
    const isFamily = item.product.id.includes('family') || item.quantity === 3;

    let itemFree = false;
    let itemFee = 0;

    if (isFamily) {
      itemFree = Boolean(pricing.threeBottleFamily.freeDelivery ?? pricing.threeBottleFamily.isDeliveryIncluded);
      itemFee = itemFree ? 0 : (pricing.threeBottleFamily.deliveryFee ?? pricing.threeBottleFamily.deliveryCharges ?? 200);
    } else if (isCombo) {
      itemFree = Boolean(pricing.twoBottleCombo.freeDelivery ?? pricing.twoBottleCombo.isDeliveryIncluded);
      itemFee = itemFree ? 0 : (pricing.twoBottleCombo.deliveryFee ?? pricing.twoBottleCombo.deliveryCharges ?? 200);
    } else {
      itemFree = Boolean(pricing.singleBottle.freeDelivery ?? pricing.singleBottle.isDeliveryIncluded);
      itemFee = itemFree ? 0 : (pricing.singleBottle.deliveryFee ?? pricing.singleBottle.deliveryCharges ?? 200);
    }

    if (itemFree) {
      anyFreeDelivery = true;
    } else {
      maxDeliveryFee = Math.max(maxDeliveryFee, itemFee);
    }
  }

  // Precedence rule:
  // 1. If any eligible package has Free Delivery ON, or if subtotal reaches threshold, delivery is FREE (Rs. 0)
  // 2. Otherwise apply the configured package standard delivery fee. Delivery is never added twice.
  const isFreeDelivery = anyFreeDelivery || (pricing.freeDeliveryThreshold > 0 && subtotal >= pricing.freeDeliveryThreshold);
  const shippingFee = isFreeDelivery ? 0 : maxDeliveryFee;
  // Critical formula: Grand Total = Package Price - Discount + Applicable Delivery Charges + Applicable Taxes
  const grandTotal = subtotal + shippingFee;

  return {
    subtotal,
    regularSubtotal,
    totalDiscount: Math.max(0, regularSubtotal - subtotal),
    shippingFee,
    grandTotal,
    isFreeDelivery
  };
}

export function cleanStatusHistory(entries?: OrderStatusHistoryEntry[]): OrderStatusHistoryEntry[] {
  if (!entries || !Array.isArray(entries)) return [];
  const cleaned: OrderStatusHistoryEntry[] = [];
  for (const entry of entries) {
    const prev = cleaned[cleaned.length - 1];
    if (prev) {
      const isSelfTransition = entry.note && entry.note.toLowerCase().includes(`from ${entry.status.toLowerCase()} to ${entry.status.toLowerCase()}`);
      if (prev.status === entry.status && (isSelfTransition || prev.note === entry.note)) {
        continue;
      }
    }
    cleaned.push(entry);
  }
  return cleaned;
}

export const storeService = {
  // PRICING MANAGEMENT
  getPricingConfig(): PricingConfig {
    if (typeof window === 'undefined') return DEFAULT_PRICING_CONFIG;
    const data = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING_CONFIG));
      return DEFAULT_PRICING_CONFIG;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.twoBottleCombo && parsed.twoBottleCombo.packagePrice === 2500) {
        parsed.twoBottleCombo.packagePrice = 2600;
        localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(parsed));
      }
      return {
        ...DEFAULT_PRICING_CONFIG,
        ...parsed,
        singleBottle: { ...DEFAULT_PRICING_CONFIG.singleBottle, ...parsed.singleBottle },
        twoBottleCombo: {
          ...DEFAULT_PRICING_CONFIG.twoBottleCombo,
          ...parsed.twoBottleCombo,
          packagePrice: parsed.twoBottleCombo?.packagePrice === 2500 ? 2600 : (parsed.twoBottleCombo?.packagePrice || 2600)
        },
        threeBottleFamily: { ...DEFAULT_PRICING_CONFIG.threeBottleFamily, ...parsed.threeBottleFamily },
      };
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  },

  updatePricingConfig(updates: Partial<PricingConfig>): PricingConfig {
    const current = this.getPricingConfig();
    const updated: PricingConfig = {
      ...current,
      ...updates,
      singleBottle: updates.singleBottle ? { ...current.singleBottle, ...updates.singleBottle } : current.singleBottle,
      twoBottleCombo: updates.twoBottleCombo ? { ...current.twoBottleCombo, ...updates.twoBottleCombo } : current.twoBottleCombo,
      threeBottleFamily: updates.threeBottleFamily ? { ...current.threeBottleFamily, ...updates.threeBottleFamily } : current.threeBottleFamily,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(updated));

    // Synchronize products catalog with updated pricing
    const products = this.getProducts().map(p => {
      if (p.id === 'tibra-natural-joint-oil-30ml' || p.id === 'tibra-joint-oil-30ml') {
        return {
          ...p,
          price: updated.singleBottle.unitPrice,
          originalPrice: updated.singleBottle.originalPrice,
          sku: updated.singleBottle.sku,
        };
      }
      if (p.id === 'tibra-natural-joint-oil-bundle-2' || p.id === 'tibra-joint-oil-bundle-2') {
        return {
          ...p,
          price: updated.twoBottleCombo.packagePrice,
          originalPrice: updated.twoBottleCombo.originalPrice,
          sku: updated.twoBottleCombo.sku,
        };
      }
      if (p.id === 'tibra-natural-joint-oil-family-pack') {
        return {
          ...p,
          price: updated.threeBottleFamily.packagePrice,
          originalPrice: updated.threeBottleFamily.originalPrice,
          sku: updated.threeBottleFamily.sku,
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    window.dispatchEvent(new Event('tibra_pricing_updated'));
    window.dispatchEvent(new Event('tibra_products_updated'));

    // Persist to server API in background
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(err => console.warn('[Pricing] Server sync failed (offline or local):', err));
    }

    return updated;
  },

  async fetchPricingFromServer(): Promise<PricingConfig> {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
      return this.getPricingConfig();
    }
    try {
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const data = await res.json();
        if (data && data.pricing) {
          const current = this.getPricingConfig();
          const merged: PricingConfig = {
            ...current,
            ...data.pricing,
            singleBottle: { ...current.singleBottle, ...data.pricing.singleBottle },
            twoBottleCombo: { ...current.twoBottleCombo, ...data.pricing.twoBottleCombo },
            threeBottleFamily: { ...current.threeBottleFamily, ...data.pricing.threeBottleFamily },
          };
          localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(merged));
          window.dispatchEvent(new Event('tibra_pricing_updated'));
          return merged;
        }
      }
    } catch {
      // offline fallback
    }
    return this.getPricingConfig();
  },

  // SENDER / BUSINESS SETTINGS (for branded PDF slips)
  getSenderSettings(): SenderSettings {
    if (typeof window === 'undefined') return DEFAULT_SENDER_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEYS.SENDER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SENDER, JSON.stringify(DEFAULT_SENDER_SETTINGS));
      return DEFAULT_SENDER_SETTINGS;
    }
    try {
      return { ...DEFAULT_SENDER_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SENDER_SETTINGS;
    }
  },

  updateSenderSettings(updates: Partial<SenderSettings>): SenderSettings {
    const current = this.getSenderSettings();
    const updated: SenderSettings = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SENDER, JSON.stringify(updated));
    window.dispatchEvent(new Event('tibra_sender_updated'));
    return updated;
  },

  // PRODUCTS
  getProducts(): Product[] {
    const pricing = this.getPricingConfig();
    const data = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PRODUCTS) : null;
    let products = TIBRA_PRODUCTS;
    if (data) {
      try {
        products = JSON.parse(data);
      } catch {
        products = TIBRA_PRODUCTS;
      }
    }

    // Always dynamically sync with active pricing configuration
    return products.map(item => {
      if (item.id === 'tibra-natural-joint-oil-30ml' || item.id === 'tibra-joint-oil-30ml') {
        return {
          ...item,
          price: pricing.singleBottle.unitPrice,
          originalPrice: pricing.singleBottle.originalPrice,
          sku: pricing.singleBottle.sku,
        };
      }
      if (item.id === 'tibra-natural-joint-oil-bundle-2' || item.id === 'tibra-joint-oil-bundle-2') {
        return {
          ...item,
          price: pricing.twoBottleCombo.packagePrice,
          originalPrice: pricing.twoBottleCombo.originalPrice,
          sku: pricing.twoBottleCombo.sku,
        };
      }
      if (item.id === 'tibra-natural-joint-oil-family-pack') {
        return {
          ...item,
          price: pricing.threeBottleFamily.packagePrice,
          originalPrice: pricing.threeBottleFamily.originalPrice,
          sku: pricing.threeBottleFamily.sku,
        };
      }
      return item;
    });
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  updateProductPrice(id: string, newPrice: number, newStock: number): void {
    const products = this.getProducts().map(p => {
      if (p.id === id) {
        return { ...p, price: newPrice, stock: newStock };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.updateInventoryStock(id, newStock);
    window.dispatchEvent(new Event('tibra_products_updated'));
    window.dispatchEvent(new Event('purefix_products_updated'));
  },

  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.getProducts().map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    if (updates.stock !== undefined) {
      this.updateInventoryStock(id, updates.stock);
    }
    window.dispatchEvent(new Event('tibra_products_updated'));
    window.dispatchEvent(new Event('purefix_products_updated'));
  },

  // CART
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('tibra_cart_updated'));
    window.dispatchEvent(new Event('purefix_cart_updated'));
  },

  addToCart(product: Product, quantity = 1, selectedBundle?: string): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity, selectedBundle });
    }
    this.saveCart(cart);
  },

  updateCartQuantity(productId: string, quantity: number): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.product.id !== productId);
    } else {
      cart = cart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    }
    this.saveCart(cart);
  },

  removeFromCart(productId: string): void {
    const cart = this.getCart().filter(item => item.product.id !== productId);
    this.saveCart(cart);
  },

  clearCart(): void {
    this.saveCart([]);
  },

  getCartCount(): number {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartSubtotal(): number {
    return calculateCartTotal(this.getCart()).subtotal;
  },

  // ORDERS
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      const parsed: Order[] = JSON.parse(data);
      let needsSave = false;
      const cleaned = parsed.map(order => {
        if (order.statusHistory && Array.isArray(order.statusHistory)) {
          const deduplicated = cleanStatusHistory(order.statusHistory);
          if (deduplicated.length !== order.statusHistory.length) {
            needsSave = true;
            return { ...order, statusHistory: deduplicated };
          }
        }
        return order;
      });
      if (needsSave && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'date'> & { trackingAccessToken?: string; status?: OrderStatus }): Order {
    const orders = this.getOrders();
    const orderNumber = `TN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const trackingAccessToken = orderData.trackingAccessToken || `tn_trk_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const pricing = this.getPricingConfig();
    const status: OrderStatus = orderData.status || 'pending';

    // Ensure item attributes have SKU and subtotal
    const items = orderData.items.map(item => {
      const canonical = this.getProductById(item.productId);
      const sku = item.sku || canonical?.sku || (item.productId.includes('bundle') ? 'TN-PRO-060-DUO' : 'TN-PRO-030');
      const originalUnitPrice = item.originalUnitPrice || canonical?.originalPrice || (item.price > 1500 ? 1990 : 1990);
      return {
        ...item,
        sku,
        originalUnitPrice,
        subtotal: item.subtotal !== undefined ? item.subtotal : item.price * item.quantity,
      };
    });

    const totalBottles = orderData.items.reduce((sum, item) => {
      if (item.productId.includes('family')) return sum + item.quantity * 3;
      if (item.productId.includes('bundle') || item.productId.includes('combo')) return sum + item.quantity * 2;
      return sum + item.quantity;
    }, 0);

    const subtotal = orderData.subtotal !== undefined
      ? orderData.subtotal
      : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = orderData.shippingFee !== undefined ? orderData.shippingFee : 0;
    const discount = orderData.discount !== undefined ? orderData.discount : 0;
    const tax = orderData.tax !== undefined ? orderData.tax : 0;
    // Formula: Grand Total = Package Price - Discount + Applicable Delivery Charges + Applicable Taxes
    const total = orderData.total !== undefined ? orderData.total : Math.max(0, subtotal - discount + shippingFee + tax);
    const paymentStatus = orderData.paymentStatus || 'pending';
    const amountPaid = paymentStatus === 'paid' ? total : (orderData.amountPaid ?? 0);
    const outstandingBalance = Math.max(0, total - amountPaid);
    // For unpaid COD order: COD Collection = Grand Total - Amount Already Paid. For fully prepaid order: COD Collection = Rs. 0
    const codCollection = (orderData.paymentMethod === 'COD' || !orderData.paymentMethod)
      ? (paymentStatus === 'paid' ? 0 : outstandingBalance)
      : 0;

    const primaryItem = items[0];
    const isCombo = items.some(i => i.productId.includes('bundle') || i.productId.includes('combo')) || totalBottles === 2;
    const isFamily = items.some(i => i.productId.includes('family')) || totalBottles >= 3;
    const activePkg = isFamily ? pricing.threeBottleFamily : (isCombo ? pricing.twoBottleCombo : pricing.singleBottle);
    const packageType: 'single' | 'combo' | 'family' | 'custom' = isFamily ? 'family' : (isCombo ? 'combo' : 'single');

    const isDeliveryIncluded = shippingFee === 0;

    const pricingSnapshot: OrderPricingSnapshot = orderData.pricingSnapshot || {
      packageId: activePkg.id,
      packageName: activePkg.name,
      bottleQuantity: totalBottles,
      unitPrice: primaryItem ? primaryItem.price : subtotal,
      packagePrice: activePkg.packagePrice || activePkg.unitPrice,
      subtotal,
      deliveryCharges: shippingFee,
      isDeliveryIncluded,
      freeDelivery: isDeliveryIncluded,
      deliveryFee: shippingFee,
      discount,
      tax,
      grandTotal: total,
      amountPaid,
      outstandingBalance,
      codCollection,
      packageType,
      calculatedAt: now.toISOString(),
    };

    const initialHistory: OrderStatusHistoryEntry[] = orderData.statusHistory && orderData.statusHistory.length > 0
      ? orderData.statusHistory
      : [
          {
            id: `hist-${Date.now()}-1`,
            status,
            timestamp: now.toISOString(),
            note: 'Order placed by customer via website checkout',
            updatedBy: 'Customer / System',
          },
        ];

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateFormatted,
      status,
      items,
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      amountPaid,
      outstandingBalance,
      codCollection,
      statusHistory: initialHistory,
      pricingSnapshot,
      trackingAccessToken,
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct inventory
    orderData.items.forEach(item => {
      this.deductStock(item.productId, item.quantity);
    });

    // Synchronize asynchronously with persistent server backend
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(err => {
        console.warn('[storeService] Failed syncing order to /api/orders:', err);
      });
    }

    window.dispatchEvent(new Event('tibra_orders_updated'));
    window.dispatchEvent(new Event('purefix_orders_updated'));
    return newOrder;
  },

  async syncOrdersFromApi(): Promise<Order[]> {
    if (typeof window === 'undefined' || typeof fetch !== 'function') {
      return this.getOrders();
    }
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const current = this.getOrders();
          const mergedMap = new Map<string, Order>();
          data.orders.forEach((o: Order) => mergedMap.set(o.id || o.orderNumber, o));
          current.forEach(o => {
            if (!mergedMap.has(o.id) && !mergedMap.has(o.orderNumber)) {
              mergedMap.set(o.id, o);
            }
          });
          const merged = Array.from(mergedMap.values());
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(merged));
          window.dispatchEvent(new Event('tibra_orders_updated'));
          return merged;
        }
      }
    } catch (err) {
      console.warn('[storeService] Error syncing orders from API:', err);
    }
    return this.getOrders();
  },

  approveOrder(orderId: string, adminUser = 'Administrator', note = 'Order approved for processing'): Order {
    return this.updateOrderStatusWithAudit(orderId, 'approved', undefined, undefined, note, adminUser);
  },

  rejectOrder(orderId: string, reason: string, adminUser = 'Administrator'): Order {
    return this.updateOrderStatusWithAudit(orderId, 'cancelled', undefined, undefined, `Order rejected / cancelled: ${reason}`, adminUser);
  },

  updateOrderStatusWithAudit(
    orderId: string,
    newStatus: OrderStatus,
    courier?: string,
    tracking?: string,
    note?: string,
    adminUser = 'Administrator'
  ): Order {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Order ${orderId} not found`);
    }

    const order = orders[orderIndex];
    const previousStatus = order.status;
    const isStatusChanged = previousStatus !== newStatus;
    const isCourierChanged = courier !== undefined && courier !== order.deliveryCourier;
    const isTrackingChanged = tracking !== undefined && tracking !== order.trackingNumber;

    // Validate status transition guard only if status actually changed
    if (isStatusChanged && !canTransitionStatus(previousStatus, newStatus)) {
      console.warn(`[storeService] Warning: Transitioning from ${previousStatus} to ${newStatus} is guarded.`);
    }

    const currentHistory = Array.isArray(order.statusHistory) ? cleanStatusHistory(order.statusHistory) : [];
    let updatedHistory = [...currentHistory];

    // Only add a new history entry if status changed, courier/tracking changed, or an explicit note was provided
    if (isStatusChanged || isCourierChanged || isTrackingChanged || note) {
      let auditNote = note;
      if (!auditNote) {
        if (isStatusChanged) {
          auditNote = `Status updated from ${previousStatus} to ${newStatus}`;
        } else if (isCourierChanged || isTrackingChanged) {
          const cName = courier !== undefined ? courier : (order.deliveryCourier || 'N/A');
          const tNum = tracking !== undefined ? tracking : (order.trackingNumber || 'N/A');
          auditNote = `Courier details updated: ${cName} (Tracking #${tNum})`;
        }
      }

      // Check if last entry is duplicate or redundant self-transition
      const lastEntry = updatedHistory[updatedHistory.length - 1];
      const isDuplicate = lastEntry && lastEntry.status === newStatus && (
        lastEntry.note === auditNote ||
        (!isStatusChanged && !note && !isCourierChanged && !isTrackingChanged)
      );

      if (!isDuplicate && auditNote) {
        const now = new Date();
        const historyEntry: OrderStatusHistoryEntry = {
          id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: newStatus,
          previousStatus,
          timestamp: now.toISOString(),
          note: auditNote,
          updatedBy: adminUser,
        };
        updatedHistory.push(historyEntry);
      }
    }

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      deliveryCourier: courier !== undefined ? courier : order.deliveryCourier,
      trackingNumber: tracking !== undefined ? tracking : order.trackingNumber,
      paymentStatus: newStatus === 'delivered' ? 'paid' : order.paymentStatus,
      dispatchedAt: newStatus === 'dispatched' ? (order.dispatchedAt || new Date().toISOString()) : order.dispatchedAt,
      statusHistory: cleanStatusHistory(updatedHistory),
    };

    orders[orderIndex] = updatedOrder;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Sync to API backend if available
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.orderNumber,
          status: newStatus,
          deliveryCourier: updatedOrder.deliveryCourier,
          trackingNumber: updatedOrder.trackingNumber,
          notes: updatedOrder.notes,
          adminNotes: updatedOrder.adminNotes,
          statusHistory: updatedOrder.statusHistory,
        })
      }).catch(err => {
        console.warn('[storeService] Failed syncing updated order to /api/orders:', err);
      });
    }

    window.dispatchEvent(new Event('tibra_orders_updated'));
    window.dispatchEvent(new Event('purefix_orders_updated'));
    return updatedOrder;
  },

  updateCustomerShippingInfo(
    orderId: string,
    shippingData: {
      customerName?: string;
      customerPhone?: string;
      alternatePhone?: string;
      shippingAddress?: string;
      city?: string;
      postalCode?: string;
      notes?: string;
      adminNotes?: string;
    },
    adminUser = 'Administrator'
  ): Order {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error(`Order ${orderId} not found`);

    const order = orders[orderIndex];
    if (order.status === 'dispatched' || order.status === 'delivered') {
      throw new Error('Cannot edit customer shipping details after the order has been dispatched or delivered.');
    }

    const now = new Date();
    const historyEntry: OrderStatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      status: order.status,
      timestamp: now.toISOString(),
      note: `Customer shipping details updated: ${Object.keys(shippingData).filter(k => (shippingData as any)[k] !== undefined).join(', ')}`,
      updatedBy: adminUser,
    };

    const currentHistory = Array.isArray(order.statusHistory) ? cleanStatusHistory(order.statusHistory) : [];

    const updatedOrder: Order = {
      ...order,
      ...shippingData,
      statusHistory: cleanStatusHistory([...currentHistory, historyEntry]),
    };

    orders[orderIndex] = updatedOrder;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('tibra_orders_updated'));
    return updatedOrder;
  },

  recalculatePendingOrder(orderId: string, adminUser = 'Administrator'): Order {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error(`Order ${orderId} not found`);

    const order = orders[orderIndex];
    if (order.status !== 'pending') {
      throw new Error('Only Pending orders can be recalculated with latest pricing.');
    }

    const pricing = this.getPricingConfig();

    // Reconstruct mock CartItems from order.items to run central calculation
    const pseudoCart: CartItem[] = order.items.map(item => ({
      product: this.getProductById(item.productId) || {
        id: item.productId,
        name: item.productName,
        subtitle: '',
        size: '30ml',
        price: item.price,
        originalPrice: item.originalUnitPrice || item.price,
        stock: 50,
        image: item.image,
        description: '',
      },
      quantity: item.quantity,
    }));

    const cartCalc = calculateCartTotal(pseudoCart, pricing);

    const now = new Date();
    const historyEntry: OrderStatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      status: order.status,
      timestamp: now.toISOString(),
      note: `Order pricing recalculated from Rs. ${order.total} to Rs. ${cartCalc.grandTotal} based on latest pricing catalog`,
      updatedBy: adminUser,
    };

    const updatedOrder: Order = {
      ...order,
      subtotal: cartCalc.subtotal,
      shippingFee: cartCalc.shippingFee,
      discount: cartCalc.totalDiscount,
      total: cartCalc.grandTotal,
      pricingSnapshot: {
        unitPrice: pricing.singleBottle.unitPrice,
        deliveryCharges: cartCalc.shippingFee,
        isDeliveryIncluded: cartCalc.isFreeDelivery,
        packageType: cartCalc.isFreeDelivery ? 'combo' : 'single',
        calculatedAt: now.toISOString(),
      },
      statusHistory: [...(order.statusHistory || []), historyEntry],
    };

    orders[orderIndex] = updatedOrder;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('tibra_orders_updated'));
    return updatedOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, courier?: string, tracking?: string): void {
    this.updateOrderStatusWithAudit(orderId, status, courier, tracking);
  },

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('tibra_orders_updated'));
    window.dispatchEvent(new Event('purefix_orders_updated'));
  },

  // INVENTORY
  getInventory(): StoreInventory[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  updateInventoryStock(productId: string, stock: number, threshold?: number): void {
    const inv = this.getInventory().map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          stock,
          threshold: threshold !== undefined ? threshold : item.threshold,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));

    // Also update product stock
    const products = this.getProducts().map(p => {
      if (p.id === productId) {
        return { ...p, stock };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    window.dispatchEvent(new Event('tibra_inventory_updated'));
    window.dispatchEvent(new Event('tibra_products_updated'));
    window.dispatchEvent(new Event('purefix_inventory_updated'));
    window.dispatchEvent(new Event('purefix_products_updated'));
  },

  deductStock(productId: string, quantity: number): void {
    const inv = this.getInventory().map(item => {
      if (item.productId === productId) {
        return { ...item, stock: Math.max(0, item.stock - quantity) };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));

    // Also update product stock
    const products = this.getProducts().map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock - quantity) };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('tibra_inventory_updated'));
    window.dispatchEvent(new Event('tibra_products_updated'));
    window.dispatchEvent(new Event('purefix_inventory_updated'));
    window.dispatchEvent(new Event('purefix_products_updated'));
  },

  // CUSTOMERS
  getCustomers(): CustomerRecord[] {
    const orders = this.getOrders();
    const map = new Map<string, CustomerRecord>();

    orders.forEach(order => {
      const key = (order.customerPhone || order.customerEmail || order.customerName).toLowerCase().trim();
      const existing = map.get(key);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpend += order.total;
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
        }
      } else {
        map.set(key, {
          id: `cust-${map.size + 1}`,
          name: order.customerName,
          email: order.customerEmail || 'orders@customer.pk',
          phone: order.customerPhone,
          city: order.city,
          totalOrders: 1,
          totalSpend: order.total,
          lastOrderDate: order.date
        });
      }
    });

    return Array.from(map.values());
  },

  // SETTINGS
  getSettings(): StoreSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // AUTHENTICATION
  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  login(email: string, pass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    if ((cleanEmail === 'admin@tibranaturals.com' || cleanEmail === 'admin@tibranatural.com' || cleanEmail === 'admin@purefix.com') && pass === 'admin123') {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    // Also allow any demo login with admin
    if (cleanEmail.includes('admin') && pass.length >= 4) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getCurrentUser(): AdminUser {
    return DEFAULT_ADMIN;
  },

  // ANALYTICS
  getAnalytics(): SalesAnalytics {
    const orders = this.getOrders();
    const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'returned');

    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalUnitsSold = activeOrders.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const averageOrderValue = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0;

    return {
      totalRevenue,
      totalOrders,
      totalUnitsSold,
      averageOrderValue,
      conversionRate: 4.8, // 4.8% baseline conversion rate
      pendingCount: orders.filter(o => o.status === 'pending').length,
      approvedCount: orders.filter(o => o.status === 'approved' || o.status === 'confirmed').length,
      processingCount: orders.filter(o => o.status === 'processing').length,
      packedCount: orders.filter(o => o.status === 'packed').length,
      readyForDispatchCount: orders.filter(o => o.status === 'ready_for_dispatch').length,
      dispatchedCount: orders.filter(o => o.status === 'dispatched' || o.status === 'in_transit' || o.status === 'out_for_delivery').length,
      deliveredCount: orders.filter(o => o.status === 'delivered').length,
      cancelledCount: orders.filter(o => o.status === 'cancelled').length,
      returnedCount: orders.filter(o => o.status === 'returned' || o.status === 'returned_to_sender').length,
    };
  }
};
