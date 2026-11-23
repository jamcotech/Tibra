import React from 'react';
import {
  TrendingUp,
  Target,
  CreditCard,
  Truck
} from 'lucide-react';
import type { SalesAnalytics, Order, Product } from '../../types/ecommerce';

interface ReportsPageProps {
  analytics: SalesAnalytics;
  orders: Order[];
  products: Product[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  analytics,
  orders,
  products
}) => {
  // Payment Breakdown
  const codOrders = orders.filter(o => o.paymentMethod === 'COD');
  const transferOrders = orders.filter(o => o.paymentMethod === 'Direct Transfer' || o.paymentMethod === 'Online');

  const codTotal = codOrders.reduce((sum, o) => sum + o.total, 0);
  const transferTotal = transferOrders.reduce((sum, o) => sum + o.total, 0);

  // City Breakdown
  const cityMap = new Map<string, number>();
  orders.forEach(o => {
    cityMap.set(o.city, (cityMap.get(o.city) || 0) + o.total);
  });
  const topCities = Array.from(cityMap.entries())
    .map(([city, revenue]) => ({ city, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
          Executive Reports & Analytics
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Deep-dive financial performance, payment channels, and geographical distribution.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block">Total Store Revenue</span>
          <div className="text-2xl font-bold text-white mt-1">
            Rs. {analytics.totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 font-semibold mt-2 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% monthly velocity
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-white mt-1">
            Rs. {analytics.averageOrderValue.toLocaleString()}
          </div>
          <span className="text-xs text-teal-400 font-semibold mt-2 inline-flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Strong bundle adoption
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block">Total Units Dispatched</span>
          <div className="text-2xl font-bold text-white mt-1">
            {analytics.totalUnitsSold} Units
          </div>
          <span className="text-xs text-zinc-500 mt-2 block">
            Tibra Natural 30 ML Amber Glass
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block">Storefront Conversion</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {analytics.conversionRate}%
          </div>
          <span className="text-xs text-zinc-400 mt-2 block">
            Benchmark: 3.2% e-commerce avg
          </span>
        </div>
      </div>

      {/* Grid: Payment Method Breakdown & Geographic Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channels */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Revenue by Payment Channel</span>
          </h2>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Cash on Delivery (COD)</span>
                <span className="text-white font-bold">
                  Rs. {codTotal.toLocaleString()} ({analytics.totalRevenue > 0 ? Math.round((codTotal / analytics.totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${analytics.totalRevenue > 0 ? (codTotal / analytics.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Direct Bank Transfer / Online</span>
                <span className="text-white font-bold">
                  Rs. {transferTotal.toLocaleString()} ({analytics.totalRevenue > 0 ? Math.round((transferTotal / analytics.totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${analytics.totalRevenue > 0 ? (transferTotal / analytics.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 pt-2">
            COD remains the preferred payment method in Pakistan e-commerce, backed by courier verification.
          </p>
        </div>

        {/* Geographic Demand */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Top Purchasing Cities</span>
          </h2>

          <div className="space-y-3 pt-2">
            {topCities.slice(0, 4).map(({ city, revenue }) => (
              <div key={city} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="font-semibold text-zinc-200">{city}</span>
                <span className="font-bold text-emerald-400">Rs. {revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top SKUs / Product Bundles Performance */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <h2 className="text-base font-semibold text-white mb-4">Catalog Performance & Contribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-white block">{p.name}</span>
              <p className="text-[11px] text-zinc-400">{p.subtitle}</p>
              <div className="flex items-baseline justify-between pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Listed Price:</span>
                <span className="text-sm font-bold text-emerald-400">Rs. {p.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
