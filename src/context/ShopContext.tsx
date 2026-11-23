import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, Order, StoreInventory } from '../types/ecommerce';
import { storeService } from '../services/storeService';

interface ShopContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  products: Product[];
  refreshProducts: () => void;
  addToCart: (product: Product, quantity?: number, selectedBundle?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  currentView: 'home' | 'cart' | 'checkout' | 'order-success';
  setCurrentView: (view: 'home' | 'cart' | 'checkout' | 'order-success') => void;
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
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'checkout' | 'order-success'>('home');
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

    // Support popstate and hash change for /admin route
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || search.includes('admin') || hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
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
  };

  const quickBuyNow = (product: Product, quantity = 1) => {
    storeService.addToCart(product, quantity);
    setCurrentView('checkout');
    setIsCartDrawerOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
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
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
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
