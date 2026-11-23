import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Store
} from 'lucide-react';
import type { AdminUser } from '../../types/ecommerce';

export type AdminTab = 'overview' | 'orders' | 'products' | 'inventory' | 'customers' | 'reports' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onBackToStore: () => void;
  pendingOrdersCount: number;
  lowStockCount: number;
  currentUser: AdminUser;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onBackToStore,
  pendingOrdersCount,
  lowStockCount,
  currentUser,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeVariant?: 'blue' | 'amber' }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrdersCount, badgeVariant: 'blue' },
    { id: 'products', label: 'Products & Pricing', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeVariant: 'amber' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090b0e] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar for Mobile */}
      <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            TN
          </div>
          <div>
            <span className="font-semibold text-sm">Tibra Natural Spree CRM</span>
            <span className="text-[10px] text-zinc-400 block -mt-1">v4.0 Admin</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1117] border-r border-zinc-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Store Switcher (Spree Style) */}
          <div className="p-4 border-b border-zinc-800/80">
            <div className="relative">
              <button
                type="button"
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white">
                      Tibra Natural Store
                    </p>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Default (PKR)
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
              </button>

              {storeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Stores & Channels
                  </div>
                  <div className="px-3 py-2 text-xs text-emerald-400 font-medium bg-emerald-950/30 flex items-center justify-between">
                    <span>Tibra Natural Official (PKR)</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer">
                    Tibra Natural International (USD)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Commerce Core
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Profile & Actions */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40 space-y-2">
            <button
              onClick={onBackToStore}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/30 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </button>

            <div className="flex items-center justify-between pt-2 px-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-[#0d1117]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                Spree Admin Panel
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-xs text-zinc-400 capitalize hidden sm:inline">
                {currentTab.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Storefront Button */}
              <button
                onClick={onBackToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Open Store</span>
              </button>

              {/* Notification Pill */}
              <div className="relative p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer">
                <Bell className="w-4 h-4" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
            </div>
          </header>

          {/* Page View Body */}
          <main className="p-6 lg:p-8 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
