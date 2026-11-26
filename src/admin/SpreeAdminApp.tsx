import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout, type AdminTab } from './components/AdminLayout';
import { OverviewPage } from './pages/OverviewPage';
import { OrdersPage } from './pages/OrdersPage';
import { ShipmentTrackingPage } from './pages/ShipmentTrackingPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { storeService } from '../services/storeService';
import type { Order, Product, StoreInventory, CustomerRecord, SalesAnalytics } from '../types/ecommerce';

interface SpreeAdminAppProps {
  onBackToStore: () => void;
}

export const SpreeAdminApp: React.FC<SpreeAdminAppProps> = ({ onBackToStore }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storeService.isAuthenticated());
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Live state
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<StoreInventory[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnitsSold: 0,
    averageOrderValue: 0,
    conversionRate: 4.8,
    pendingCount: 0,
    dispatchedCount: 0,
    deliveredCount: 0
  });

  const refreshAll = () => {
    setOrders(storeService.getOrders());
    setProducts(storeService.getProducts());
    setInventory(storeService.getInventory());
    setCustomers(storeService.getCustomers());
    setAnalytics(storeService.getAnalytics());
  };

  useEffect(() => {
    refreshAll();

    const handleOrders = () => refreshAll();
    const handleProducts = () => refreshAll();
    const handleInventory = () => refreshAll();

    window.addEventListener('tibra_orders_updated', handleOrders);
    window.addEventListener('tibra_products_updated', handleProducts);
    window.addEventListener('tibra_inventory_updated', handleInventory);
    window.addEventListener('purefix_orders_updated', handleOrders);
    window.addEventListener('purefix_products_updated', handleProducts);
    window.addEventListener('purefix_inventory_updated', handleInventory);

    return () => {
      window.removeEventListener('tibra_orders_updated', handleOrders);
      window.removeEventListener('tibra_products_updated', handleProducts);
      window.removeEventListener('tibra_inventory_updated', handleInventory);
      window.removeEventListener('purefix_orders_updated', handleOrders);
      window.removeEventListener('purefix_products_updated', handleProducts);
      window.removeEventListener('purefix_inventory_updated', handleInventory);
    };
  }, []);

  const handleLogout = () => {
    storeService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onSuccess={() => setIsAuthenticated(true)}
        onBackToStore={onBackToStore}
      />
    );
  }

  const lowStockCount = inventory.filter(i => i.stock <= i.threshold).length;
  const currentUser = storeService.getCurrentUser();

  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrderForModal(order);
    setCurrentTab('orders');
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onLogout={handleLogout}
      onBackToStore={onBackToStore}
      pendingOrdersCount={analytics.pendingCount}
      lowStockCount={lowStockCount}
      currentUser={currentUser}
    >
      {currentTab === 'overview' && (
        <OverviewPage
          analytics={analytics}
          orders={orders}
          inventory={inventory}
          onNavigateTab={setCurrentTab}
          onOpenOrderModal={handleOpenOrderModal}
        />
      )}

      {currentTab === 'orders' && (
        <OrdersPage
          orders={orders}
          onRefresh={refreshAll}
          selectedOrderForModal={selectedOrderForModal}
          onClearSelectedOrder={() => setSelectedOrderForModal(null)}
        />
      )}

      {currentTab === 'tracking' && (
        <ShipmentTrackingPage
          orders={orders}
          onRefresh={refreshAll}
        />
      )}

      {currentTab === 'products' && (
        <ProductsPage
          products={products}
          onRefresh={refreshAll}
          onBackToStore={onBackToStore}
        />
      )}

      {currentTab === 'inventory' && (
        <InventoryPage
          inventory={inventory}
          onRefresh={refreshAll}
        />
      )}

      {currentTab === 'customers' && (
        <CustomersPage
          customers={customers}
        />
      )}

      {currentTab === 'reports' && (
        <ReportsPage
          analytics={analytics}
          orders={orders}
          products={products}
        />
      )}

      {currentTab === 'settings' && (
        <SettingsPage />
      )}
    </AdminLayout>
  );
};
