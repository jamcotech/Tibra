import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, Order, StoreInventory } from '../types/ecommerce';
import { storeService, calculateCartTotal } from '../services/storeService';
import analyticsService from '../services/analyticsService';

export type AppView =
  | 'home'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'product-detail'
  | 'ingredients'
  | 'how-to-use'
  | 'our-quality'
  | 'about-us'
  | 'blog'
  | 'blog-post'
  | 'faq'
  | 'contact'
  | 'policy-shipping'
  | 'policy-returns'
  | 'policy-privacy'
  | 'policy-terms';

export function parsePathnameToView(pathname: string): { view: AppView; blogSlug?: string } {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '' || clean === '/') return { view: 'home' };
  if (clean === '/cart') return { view: 'cart' };
  if (clean === '/checkout') return { view: 'checkout' };
  if (clean === '/order-success') return { view: 'order-success' };
  if (clean === '/products' || clean.startsWith('/products/')) return { view: 'product-detail' };
  if (clean === '/ingredients') return { view: 'ingredients' };
  if (clean === '/how-to-use') return { view: 'how-to-use' };
  if (clean === '/our-quality') return { view: 'our-quality' };
  if (clean === '/about-us' || clean === '/about') return { view: 'about-us' };
  if (clean === '/blog') return { view: 'blog' };
  if (clean.startsWith('/blog/')) {
    const slug = clean.replace('/blog/', '');
    return { view: 'blog-post', blogSlug: slug };
  }
  if (clean === '/faq') return { view: 'faq' };
  if (clean === '/contact-us' || clean === '/contact') return { view: 'contact' };
  if (clean === '/shipping-policy') return { view: 'policy-shipping' };
  if (clean === '/return-policy') return { view: 'policy-returns' };
  if (clean === '/privacy-policy') return { view: 'policy-privacy' };
  if (clean === '/terms-and-conditions' || clean === '/terms') return { view: 'policy-terms' };
  return { view: 'home' };
}

export function getViewCanonicalPath(view: AppView, blogSlug?: string): string {
  switch (view) {
    case 'home': return '/';
    case 'cart': return '/cart/';
    case 'checkout': return '/checkout/';
    case 'order-success': return '/order-success/';
    case 'product-detail': return '/products/pain-relief-oil/';
    case 'ingredients': return '/ingredients/';
    case 'how-to-use': return '/how-to-use/';
    case 'our-quality': return '/our-quality/';
    case 'about-us': return '/about-us/';
    case 'blog': return '/blog/';
    case 'blog-post': return blogSlug ? `/blog/${blogSlug}/` : '/blog/';
    case 'faq': return '/faq/';
    case 'contact': return '/contact-us/';
    case 'policy-shipping': return '/shipping-policy/';
    case 'policy-returns': return '/return-policy/';
    case 'policy-privacy': return '/privacy-policy/';
    case 'policy-terms': return '/terms-and-conditions/';
    default: return '/';
  }
}

interface ShopContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  products: Product[];
  refreshProducts: () => void;
  addToCart: (product: Product, quantity?: number, selectedBundle?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeBlogSlug?: string;
  setActiveBlogSlug: (slug?: string) => void;
  navigate: (view: AppView, slug?: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
  orders: Order[];
  refreshOrders: () => void;
  inventory: StoreInventory[];
  refreshInventory: () => void;
  quickBuyNow: (product: Product, quantity?: number) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  // Initialize view from pathname
  const initialRoute = typeof window !== 'undefined'
    ? parsePathnameToView(window.location.pathname)
    : { view: 'home' as AppView };

  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | undefined>(initialRoute.blogSlug);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      return path.startsWith('/admin') || search.includes('admin') || hash === '#admin';
    }
    return false;
  });

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<StoreInventory[]>([]);

  // Navigation function with HTML5 pushState
  const navigate = (view: AppView, slug?: string) => {
    setCurrentView(view);
    setActiveBlogSlug(slug);
    if (typeof window !== 'undefined') {
      const targetPath = getViewCanonicalPath(view, slug);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      analyticsService.trackPageView(targetPath);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  // Sync state
  const syncProducts = () => {
    setProducts(storeService.getProducts());
  };

  const syncCart = () => {
    setCart(storeService.getCart());
  };

  const refreshOrders = () => {
    setOrders(storeService.getOrders());
  };

  const refreshInventory = () => {
    setInventory(storeService.getInventory());
  };

  useEffect(() => {
    syncProducts();
    syncCart();
    refreshOrders();
    refreshInventory();
    analyticsService.init();
    if (typeof window !== 'undefined') {
      analyticsService.trackPageView(window.location.pathname);
    }

    const handleCartUpdate = () => syncCart();
    const handleProductsUpdate = () => {
      syncProducts();
      refreshInventory();
    };
    const handleOrdersUpdate = () => {
      refreshOrders();
      refreshInventory();
    };
    const handleInventoryUpdate = () => {
      refreshInventory();
      syncProducts();
    };

    window.addEventListener('tibra_cart_updated', handleCartUpdate);
    window.addEventListener('tibra_products_updated', handleProductsUpdate);
    window.addEventListener('tibra_orders_updated', handleOrdersUpdate);
    window.addEventListener('tibra_inventory_updated', handleInventoryUpdate);
    window.addEventListener('purefix_cart_updated', handleCartUpdate);
    window.addEventListener('purefix_products_updated', handleProductsUpdate);
    window.addEventListener('purefix_orders_updated', handleOrdersUpdate);
    window.addEventListener('purefix_inventory_updated', handleInventoryUpdate);

    // Support popstate (browser back/forward buttons)
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || search.includes('admin') || hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
        const resolved = parsePathnameToView(path);
        setCurrentView(resolved.view);
        setActiveBlogSlug(resolved.blogSlug);
        analyticsService.trackPageView(path);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('tibra_cart_updated', handleCartUpdate);
      window.removeEventListener('tibra_products_updated', handleProductsUpdate);
      window.removeEventListener('tibra_orders_updated', handleOrdersUpdate);
      window.removeEventListener('tibra_inventory_updated', handleInventoryUpdate);
      window.removeEventListener('purefix_cart_updated', handleCartUpdate);
      window.removeEventListener('purefix_products_updated', handleProductsUpdate);
      window.removeEventListener('purefix_orders_updated', handleOrdersUpdate);
      window.removeEventListener('purefix_inventory_updated', handleInventoryUpdate);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const addToCart = (product: Product, quantity = 1, selectedBundle?: string) => {
    storeService.addToCart(product, quantity, selectedBundle);
    setIsCartDrawerOpen(true);
    analyticsService.trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity,
    });
  };

  const quickBuyNow = (product: Product, quantity = 1) => {
    storeService.addToCart(product, quantity);
    navigate('checkout');
    setIsCartDrawerOpen(false);
    analyticsService.trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity,
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentView]);

  const updateQuantity = (productId: string, quantity: number) => {
    storeService.updateCartQuantity(productId, quantity);
  };

  const removeFromCart = (productId: string) => {
    storeService.removeFromCart(productId);
  };

  const clearCart = () => {
    storeService.clearCart();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSummary = calculateCartTotal(cart);
  const cartSubtotal = cartSummary.subtotal;
  const cartDiscount = cartSummary.totalDiscount;

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        products,
        refreshProducts: syncProducts,
        addToCart,
        quickBuyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        currentView,
        setCurrentView,
        activeBlogSlug,
        setActiveBlogSlug,
        navigate,
        isAdminOpen,
        setIsAdminOpen,
        lastCreatedOrder,
        setLastCreatedOrder,
        orders,
        refreshOrders,
        inventory,
        refreshInventory,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
