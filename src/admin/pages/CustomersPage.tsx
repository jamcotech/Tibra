import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { CustomerRecord } from '../../types/ecommerce';

interface CustomersPageProps {
  customers: CustomerRecord[];
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ customers }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const totalRevenueFromCustomers = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Customer Directory & LTV
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track customer order history, repeat purchase rates, and lifetime spend.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Customer Base</span>
            <span className="text-sm font-bold text-emerald-400">{customers.length} Verified Buyers</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="text-xs text-zinc-400 hidden sm:block">
          Lifetime Customer Revenue: <strong className="text-white">Rs. {totalRevenueFromCustomers.toLocaleString()}</strong>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/50">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact Phone</th>
                <th className="py-3.5 px-6">City</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-6">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{cust.name}</div>
                          <div className="text-[11px] text-zinc-400">{cust.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-zinc-300">
                      {cust.phone}
                    </td>

                    <td className="py-4 px-6 text-zinc-300">
                      {cust.city}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-semibold text-emerald-400">
                      Rs. {cust.totalSpend.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 text-zinc-400">
                      {cust.lastOrderDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
