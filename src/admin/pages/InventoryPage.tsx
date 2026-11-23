import React, { useState } from 'react';
import {
  Plus,
  Minus,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import type { StoreInventory } from '../../types/ecommerce';
import { storeService } from '../../services/storeService';

interface InventoryPageProps {
  inventory: StoreInventory[];
  onRefresh: () => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  inventory,
  onRefresh
}) => {
  const [selectedItem, setSelectedItem] = useState<StoreInventory | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(10);
  const [threshold, setThreshold] = useState<number>(10);
  const [isSaving, setIsSaving] = useState(false);

  const openAdjustModal = (item: StoreInventory) => {
    setSelectedItem(item);
    setAdjustmentQty(0);
    setThreshold(item.threshold);
  };

  const closeAdjustModal = () => {
    setSelectedItem(null);
  };

  const handleApplyAdjustment = () => {
    if (!selectedItem) return;
    setIsSaving(true);

    const newStock = Math.max(0, selectedItem.stock + adjustmentQty);
    storeService.updateInventoryStock(selectedItem.productId, newStock, threshold);

    setTimeout(() => {
      setIsSaving(false);
      closeAdjustModal();
      onRefresh();
    }, 200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Warehouse Inventory & Stock
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time SKU quantities, automated low-stock warnings, and reorder alerts.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh Stock Levels</span>
        </button>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const isLow = item.stock <= item.threshold;
          return (
            <div
              key={item.sku}
              className={`p-5 rounded-2xl border transition ${
                isLow
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-emerald-400">
                  {item.sku}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLow
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isLow ? 'Low Stock Warning' : 'Healthy Stock'}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-white mb-2">{item.productName}</h2>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-bold text-white tracking-tight">{item.stock}</span>
                <span className="text-xs text-zinc-400">units available</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-zinc-800/80">
                <span>Alert Threshold: {item.threshold}</span>
                <span>Restocked: {item.lastRestocked}</span>
              </div>

              <button
                onClick={() => openAdjustModal(item)}
                className="mt-4 w-full py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 transition cursor-pointer"
              >
                Adjust Stock / Restock
              </button>
            </div>
          );
        })}
      </div>

      {/* Stock Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/40">
          <h2 className="text-sm font-semibold text-white">Central Warehouse Stock Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/50">
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Units on Hand</th>
                <th className="py-3 px-6">Min Threshold</th>
                <th className="py-3 px-6">Last Restocked</th>
                <th className="py-3 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {inventory.map((item) => (
                <tr key={item.sku} className="hover:bg-zinc-800/30 transition">
                  <td className="py-4 px-6 font-mono font-medium text-emerald-400">
                    {item.sku}
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">
                    {item.productName}
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    Karachi Fulfillment Hub #1
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white text-sm">{item.stock}</span> units
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    {item.threshold} units
                  </td>
                  <td className="py-4 px-6 text-zinc-500">
                    {item.lastRestocked}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openAdjustModal(item)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="font-semibold text-white text-base">Adjust Warehouse Stock</h3>
                <p className="text-xs text-zinc-400">{selectedItem.productName}</p>
              </div>
              <button
                onClick={closeAdjustModal}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Current Stock</span>
                  <span className="text-2xl font-bold text-white">{selectedItem.stock}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[11px]">New Projected Stock</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {Math.max(0, selectedItem.stock + adjustmentQty)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Stock Adjustment (+ / - units)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentQty((prev) => prev - 10)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentQty((prev) => prev - 1)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-center text-white font-bold text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentQty((prev) => prev + 1)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentQty((prev) => prev + 25)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                  >
                    +25
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  min={1}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={closeAdjustModal}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleApplyAdjustment}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Updating...' : 'Save Adjustment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
