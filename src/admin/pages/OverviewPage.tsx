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
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Store Performance & Real-Time Pulse
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time analytics, order dispatching, and live inventory sync for Tibra Natural.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-md shadow-emerald-950 cursor-pointer"
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
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition duration-150 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <span className="font-semibold text-emerald-400">{kpi.change}</span>
                  <span className="text-zinc-500">{kpi.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations Quick Counters (Spree Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-zinc-900/50 border border-zinc-800/80 hover:border-blue-500/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Pending Orders</div>
            <div className="text-lg font-bold text-white mt-0.5">{analytics.pendingCount} to process</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-zinc-900/50 border border-zinc-800/80 hover:border-teal-500/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">In Transit Courier</div>
            <div className="text-lg font-bold text-white mt-0.5">{analytics.dispatchedCount} dispatched</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Delivered & Paid</div>
            <div className="text-lg font-bold text-white mt-0.5">{analytics.deliveredCount} completed</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Stock Alerts</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : 'All Stock Healthy'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Bar Graph + Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Graph */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Daily Revenue Velocity</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Live store order trends</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
              Live Real-Time
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-zinc-800/80">
            {dailyBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {bar.amount}
                </span>
                <div className="w-full bg-zinc-800 rounded-t-lg relative overflow-hidden h-36 flex items-end">
                  <div
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      i === dailyBars.length - 1
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-emerald-600/60 group-hover:bg-emerald-500/80'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium text-zinc-400">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-4">
            <span>Currency: Pakistani Rupee (PKR)</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View full financial breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Low Stock Alerts & Live Inventory Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Inventory Watch</h2>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                All SKUs →
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Critical warehouse levels monitored in real-time.
            </p>

            <div className="space-y-3">
              {inventory.slice(0, 3).map((item) => {
                const isLow = item.stock <= item.threshold;
                return (
                  <div
                    key={item.sku}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{item.productName}</p>
                      <p className="text-[11px] text-zinc-500">SKU: {item.sku}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isLow
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.stock} left
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1">Min: {item.threshold}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800">
            <button
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer text-center block"
            >
              Restock or Adjust Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Orders Pipeline</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live customer orders from Tibra Natural storefront
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/40">
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
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/30 transition">
                  <td className="py-3.5 px-6 font-mono font-medium text-emerald-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-6 text-zinc-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-medium text-white">{order.customerName}</div>
                    <div className="text-[11px] text-zinc-500">{order.city} • {order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-300">
                    {order.items.reduce((s, it) => s + it.quantity, 0)} bottle(s)
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-white">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.paymentMethod} • {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : order.status === 'dispatched'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : order.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : order.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onOpenOrderModal(order)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer inline-flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
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
