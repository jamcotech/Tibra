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
          <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
            Customer Directory & LTV
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track customer order history, repeat purchase rates, and lifetime spend.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Customer Base</span>
            <span className="text-sm font-bold text-[#748C48]">{customers.length} Verified Buyers</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none"
          />
        </div>

        <div className="text-xs text-zinc-500 hidden sm:block">
          Lifetime Customer Revenue: <strong className="text-[#252E15]">Rs. {totalRevenueFromCustomers.toLocaleString()}</strong>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50/80">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact Phone</th>
                <th className="py-3.5 px-6">City</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-6">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#748C48] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{cust.name}</div>
                          <div className="text-[11px] text-zinc-500">{cust.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-zinc-700">
                      {cust.phone}
                    </td>

                    <td className="py-4 px-6 text-zinc-700">
                      {cust.city}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#748C48]/10 text-[#252E15] border border-[#748C48]/30">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-[#252E15]">
                      Rs. {cust.totalSpend.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 text-zinc-500">
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
