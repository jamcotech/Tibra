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
  Store,
  Truck
} from 'lucide-react';
import type { AdminUser } from '../../types/ecommerce';

export type AdminTab = 'overview' | 'orders' | 'tracking' | 'products' | 'inventory' | 'customers' | 'reports' | 'settings';

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
    { id: 'tracking', label: 'Live Tracking & Courier', icon: Truck },
    { id: 'products', label: 'Products & Pricing', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeVariant: 'amber' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col antialiased selection:bg-[#748C48] selection:text-white">
      {/* Top Bar for Mobile */}
      <div className="lg:hidden bg-[#252E15] text-white px-4 py-3 flex items-center justify-between border-b border-[#1B230F]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#748C48] flex items-center justify-center font-bold text-white text-xs shadow-xs">
            TN
          </div>
          <div>
            <span className="font-semibold text-sm text-white">TIBRA NATURALS Admin</span>
            <span className="text-[10px] text-zinc-300 block -mt-0.5">Spree Commerce Engine</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 text-zinc-200 hover:text-white cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Natural Botanical Green */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#252E15] text-zinc-100 flex flex-col border-r border-[#1B230F] shadow-md transition-transform duration-200 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Store Switcher */}
          <div className="p-4 border-b border-[#35431E]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1D2510] border border-[#3A4B21] hover:border-[#748C48] transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#748C48]/20 border border-[#748C48]/40 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4 text-[#C5E18A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-100 truncate group-hover:text-white">
                      TIBRA NATURALS Store
                    </p>
                    <p className="text-[11px] text-zinc-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Pakistan (PKR)
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
              </button>

              {storeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1B230F] border border-[#3A4B21] rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Channels & Stores
                  </div>
                  <div className="px-3 py-2 text-xs text-[#C5E18A] font-medium bg-[#748C48]/20 flex items-center justify-between">
                    <span>TIBRA NATURALS Official (PKR)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5E18A]" />
                  </div>
                  <div className="px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer">
                    Export / Direct Sales
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Operations & Store Management
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
                      ? 'bg-[#748C48] text-white shadow-sm font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                          : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
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
          <div className="p-3 border-t border-[#35431E] bg-[#1B230F] space-y-2">
            <button
              onClick={onBackToStore}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#F5E6A3] bg-[#252E15] border border-[#748C48]/50 hover:bg-[#323D1D] transition cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </button>

            <div className="flex items-center justify-between pt-2 px-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#748C48] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-100 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-300 truncate">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-zinc-300 hover:text-red-300 hover:bg-white/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Clean Crisp Light Background */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8F9FA]">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#252E15] bg-[#748C48]/15 border border-[#748C48]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#748C48]"></span>
                TIBRA NATURALS Admin Portal
              </span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="text-xs font-medium text-zinc-600 capitalize hidden sm:inline">
                {currentTab.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Storefront Button */}
              <button
                onClick={onBackToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#748C48]" />
                <span className="hidden md:inline">Open Store</span>
              </button>

              {/* Notification Pill */}
              <div className="relative p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer">
                <Bell className="w-4 h-4" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#748C48] animate-pulse" />
                )}
              </div>
            </div>
          </header>

          {/* Page View Body */}
          <main className="p-6 lg:p-8 flex-1 bg-[#F8F9FA]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
