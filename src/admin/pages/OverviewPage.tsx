import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  PackageCheck,
  Percent,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  PlusCircle
} from 'lucide-react';
import type { Order, StoreInventory, SalesAnalytics } from '../../types/ecommerce';
import type { AdminTab } from '../components/AdminLayout';

interface OverviewPageProps {
  analytics: SalesAnalytics;
  orders: Order[];
  inventory: StoreInventory[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenOrderModal: (order: Order) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  analytics,
  orders,
  inventory,
  onNavigateTab,
  onOpenOrderModal,
}) => {
  const recentOrders = orders.slice(0, 5);
  const lowStockItems = inventory.filter((item) => item.stock <= item.threshold);

  const kpis = [
    {
      label: 'Gross Sales',
      value: `Rs. ${analytics.totalRevenue.toLocaleString()}`,
      change: '+18.4%',
      isPositive: true,
      subtext: 'vs last 30 days',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: '+12.5%',
      isPositive: true,
      subtext: 'across all channels',
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Average Order Value',
      value: `Rs. ${analytics.averageOrderValue.toLocaleString()}`,
      change: '+4.2%',
      isPositive: true,
      subtext: 'per confirmed order',
      icon: TrendingUp,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      label: 'Units Sold',
      value: analytics.totalUnitsSold.toString(),
      change: '+22.0%',
      isPositive: true,
      subtext: 'bottles delivered',
      icon: PackageCheck,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+0.6%',
      isPositive: true,
      subtext: 'storefront visitors',
      icon: Percent,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  // Daily revenue mock distribution based on orders
  const dailyBars = [
    { day: 'Mon', height: 45, amount: 'Rs. 5,240' },
    { day: 'Tue', height: 60, amount: 'Rs. 7,100' },
    { day: 'Wed', height: 35, amount: 'Rs. 3,700' },
    { day: 'Thu', height: 80, amount: 'Rs. 9,450' },
    { day: 'Fri', height: 95, amount: 'Rs. 11,200' },
    { day: 'Sat', height: 70, amount: 'Rs. 8,300' },
    { day: 'Sun (Today)', height: 85, amount: `Rs. ${analytics.totalRevenue.toLocaleString()}` },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
            Store Performance & Real-Time Pulse
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time analytics, order dispatching, and live inventory sync for TIBRA NATURALS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Products & Prices</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-zinc-200/90 rounded-2xl p-5 hover:border-[#748C48]/50 shadow-sm transition duration-150 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-zinc-900 tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <span className="font-semibold text-[#748C48]">{kpi.change}</span>
                  <span className="text-zinc-400">{kpi.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations Quick Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-zinc-200 hover:border-blue-500 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">Pending Orders</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{analytics.pendingCount} to process</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-zinc-200 hover:border-teal-500 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">In Transit Courier</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{analytics.dispatchedCount} dispatched</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-zinc-200 hover:border-[#748C48] rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">Delivered & Paid</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{analytics.deliveredCount} completed</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white border border-zinc-200 hover:border-amber-500 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">Stock Alerts</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">
              {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : 'All Stock Healthy'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Bar Graph + Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Graph */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-[#252E15] font-serif">Daily Revenue Velocity</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Live store order trends</p>
            </div>
            <span className="text-xs font-semibold text-[#252E15] bg-[#748C48]/15 border border-[#748C48]/30 px-2.5 py-1 rounded-lg">
              Live Real-Time
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-zinc-100">
            {dailyBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-medium">
                  {bar.amount}
                </span>
                <div className="w-full bg-zinc-100 rounded-t-lg relative overflow-hidden h-36 flex items-end">
                  <div
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      i === dailyBars.length - 1
                        ? 'bg-[#748C48] shadow-sm'
                        : 'bg-[#748C48]/70 group-hover:bg-[#748C48]'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium text-zinc-600">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-4">
            <span>Currency: Pakistani Rupee (PKR)</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#748C48] hover:text-[#5F7339] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View full financial breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Low Stock Alerts & Live Inventory Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#252E15] font-serif">Inventory Watch</h2>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs text-[#748C48] hover:text-[#5F7339] font-semibold cursor-pointer"
              >
                All SKUs →
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              Critical warehouse levels monitored in real-time.
            </p>

            <div className="space-y-3">
              {inventory.slice(0, 3).map((item) => {
                const isLow = item.stock <= item.threshold;
                return (
                  <div
                    key={item.sku}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-zinc-800 truncate">{item.productName}</p>
                      <p className="text-[11px] text-zinc-500">SKU: {item.sku}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {item.stock} left
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-1">Min: {item.threshold}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-100">
            <button
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition cursor-pointer text-center block shadow-2xs"
            >
              Restock or Adjust Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#252E15] font-serif">Recent Orders Pipeline</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live customer orders from TIBRA NATURALS storefront
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#748C48] hover:text-[#5F7339] flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50/70">
                <th className="py-3 px-6">Order #</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/70 transition">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#748C48]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-6 text-zinc-500 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-zinc-900">{order.customerName}</div>
                    <div className="text-[11px] text-zinc-500">{order.city} • {order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-700">
                    {order.items.reduce((s, it) => s + it.quantity, 0)} bottle(s)
                  </td>
                  <td className="py-3.5 px-6 font-bold text-zinc-900">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {order.paymentMethod} • {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : order.status === 'dispatched'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : order.status === 'confirmed' || order.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onOpenOrderModal(order)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
