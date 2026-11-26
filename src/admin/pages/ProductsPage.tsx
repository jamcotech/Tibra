import React, { useState } from 'react';
import {
  Edit2,
  DollarSign,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import type { Product } from '../../types/ecommerce';
import { storeService } from '../../services/storeService';

interface ProductsPageProps {
  products: Product[];
  onRefresh: () => void;
  onBackToStore: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onRefresh,
  onBackToStore
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [badge, setBadge] = useState('');
  const [bundleOffer, setBundleOffer] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSubtitle(p.subtitle);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setStock(p.stock);
    setBadge(p.badge || '');
    setBundleOffer(p.bundleOffer || '');
    setStatus(p.status || 'active');
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);

    storeService.updateProduct(editingProduct.id, {
      name,
      subtitle,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stock: Number(stock),
      badge,
      bundleOffer,
      status,
    });

    setTimeout(() => {
      setIsSaving(false);
      closeEditModal();
      onRefresh();
      setSuccessToast(`Product "${name}" updated live! Changes are now reflecting on the customer storefront.`);
      setTimeout(() => setSuccessToast(''), 4500);
    }, 250);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/80 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-white">Live Storefront Sync Complete</span>
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="ml-3 text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Products & Pricing Engine
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time price modifications, compare-at discounts, and storefront catalog management.
          </p>
        </div>

        <button
          onClick={onBackToStore}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Verify Live on Storefront</span>
        </button>
      </div>

      {/* Real-time sync guarantee card */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">Zero-Lag Real-Time Integration</h2>
            <p className="text-[11px] text-zinc-400">
              When you change a product price here, the Hero Section, Packaging Showcase, Cart Drawer, and Checkout page automatically recalculate immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Products Table (Spree Style) */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/50">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">SKU / Size</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Current Price</th>
                <th className="py-3.5 px-6">Compare At</th>
                <th className="py-3.5 px-6">Offer Badge</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {products.map((p) => {
                const discount = p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            width={48}
                            height={48}
                            loading="lazy"
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1">{p.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-mono text-zinc-300 font-medium">{p.sku || p.id}</div>
                      <div className="text-[11px] text-zinc-500">{p.size}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {p.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className="font-semibold text-white">{p.stock} units</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">In Warehouse</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-base font-bold text-emerald-400">
                        Rs. {p.price.toLocaleString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {p.originalPrice > 0 ? (
                        <div>
                          <span className="line-through text-zinc-500">
                            Rs. {p.originalPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="ml-1.5 text-[10px] font-bold text-amber-400">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Price</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product & Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Edit Product & Live Price</h3>
                  <p className="text-xs text-zinc-400">{editingProduct.name}</p>
                </div>
              </div>

              <button
                onClick={closeEditModal}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                    Selling Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full bg-zinc-950 border border-emerald-500/50 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-white font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Compare-At Price (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      min={0}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Inventory Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={0}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'draft' | 'archived')}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Offer / Promo Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Best Seller, Save 25% Today"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Bundle Offer Tagline
                </label>
                <input
                  type="text"
                  value={bundleOffer}
                  onChange={(e) => setBundleOffer(e.target.value)}
                  placeholder="e.g. Save 30% + Free Delivery"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Syncing Store...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
