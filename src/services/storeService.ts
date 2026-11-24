import type {
  Product,
  CartItem,
  Order,
  StoreInventory,
  OrderStatus,
  CustomerRecord,
  StoreSettings,
  AdminUser,
  SalesAnalytics
} from '../types/ecommerce';
import { TIBRA_PRODUCTS, INITIAL_ORDERS, INITIAL_INVENTORY } from './mockData';

const STORAGE_KEYS = {
  CART: 'tibra_cart_v1',
  ORDERS: 'tibra_orders_v1',
  INVENTORY: 'tibra_inventory_v1',
  PRODUCTS: 'tibra_products_v3',
  AUTH: 'tibra_spree_auth_v1',
  SETTINGS: 'tibra_store_settings_v1',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'TIBRA NATURALS Official Store',
  legalBusinessName: 'Tibra Naturals Botanical Wellness Ltd.',
  supportEmail: 'orders@tibranaturals.com',
  supportPhone: '+92 300 1234567',
  currency: 'PKR',
  timezone: 'Asia/Karachi (UTC+5)',
  standardShippingFee: 200,
  freeDeliveryThreshold: 3000,
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

export function calculateItemPrice(product: Product, quantity: number): {
  total: number;
  regularTotal: number;
  originalRegularTotal: number;
  discount: number;
  percentOff: number;
  isDuoApplied: boolean;
} {
  const regularUnitPrice = product.originalPrice || (product.id.includes('bundle-2') ? 3980 : 1990);
  const originalRegularTotal = regularUnitPrice * quantity;

  if (product.id === 'tibra-natural-joint-oil-30ml' || product.price === 1500) {
    // 1 bottle = Rs. 1,500; 2 or more bottles = Rs. 1,300 each (2 = Rs. 2,600, 3 = Rs. 3,900, 4 = Rs. 5,200, etc.)
    const total = quantity >= 2 ? quantity * 1300 : 1500 * quantity;
    const discount = originalRegularTotal - total;
    const percentOff = Math.round((discount / originalRegularTotal) * 100);
    return {
      total,
      regularTotal: originalRegularTotal,
      originalRegularTotal,
      discount,
      percentOff,
      isDuoApplied: quantity >= 2,
    };
  }
  const regularTotal = (product.originalPrice || product.price) * quantity;
  const total = product.price * quantity;
  const discount = Math.max(0, regularTotal - total);
  const percentOff = regularTotal > 0 ? Math.round((discount / regularTotal) * 100) : 0;
  return {
    total,
    regularTotal,
    originalRegularTotal: regularTotal,
    discount,
    percentOff,
    isDuoApplied: product.id.includes('bundle') || quantity >= 2,
  };
}

export function calculateCartTotal(cart: CartItem[]): {
  subtotal: number;
  regularSubtotal: number;
  totalDiscount: number;
} {
  let subtotal = 0;
  let regularSubtotal = 0;
  for (const item of cart) {
    const calc = calculateItemPrice(item.product, item.quantity);
    subtotal += calc.total;
    regularSubtotal += calc.regularTotal;
  }
  return {
    subtotal,
    regularSubtotal,
    totalDiscount: regularSubtotal - subtotal,
  };
}

export const storeService = {
  // PRODUCTS
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(TIBRA_PRODUCTS));
      return TIBRA_PRODUCTS;
    }
    try {
      const parsed: Product[] = JSON.parse(data);
      const updated = parsed.map(item => {
        const canonical = TIBRA_PRODUCTS.find(p => p.id === item.id);
        if (canonical && (item.price !== canonical.price || item.originalPrice !== canonical.originalPrice)) {
          return { ...item, price: canonical.price, originalPrice: canonical.originalPrice, bundleOffer: canonical.bundleOffer };
        }
        return item;
      });
      return updated;
    } catch {
      return TIBRA_PRODUCTS;
    }
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
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order {
    const orders = this.getOrders();
    const orderNumber = `PF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateFormatted
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct inventory
    orderData.items.forEach(item => {
      this.deductStock(item.productId, item.quantity);
    });

    window.dispatchEvent(new Event('tibra_orders_updated'));
    window.dispatchEvent(new Event('purefix_orders_updated'));
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, courier?: string, tracking?: string): void {
    const orders = this.getOrders().map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          deliveryCourier: courier !== undefined ? courier : o.deliveryCourier,
          trackingNumber: tracking !== undefined ? tracking : o.trackingNumber,
          paymentStatus: status === 'delivered' ? 'paid' : o.paymentStatus
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('tibra_orders_updated'));
    window.dispatchEvent(new Event('purefix_orders_updated'));
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
    const activeOrders = orders.filter(o => o.status !== 'cancelled');

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
      dispatchedCount: orders.filter(o => o.status === 'dispatched').length,
      deliveredCount: orders.filter(o => o.status === 'delivered').length
    };
  }
};
