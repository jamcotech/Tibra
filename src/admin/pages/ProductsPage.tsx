import React, { useState, useEffect } from 'react';
import {
  Edit2,
  CheckCircle,
  ExternalLink,
  Check,
  X,
  Package,
  Calculator,
  Save,
  Tag,
  Truck
} from 'lucide-react';
import type { Product, PricingConfig } from '../../types/ecommerce';
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
  // Central Pricing Config State
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => storeService.getPricingConfig());
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // Individual Product Edit Modal State
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

  // Keep local pricing state in sync with central store & server
  useEffect(() => {
    const handlePricingUpdated = () => {
      setPricingConfig(storeService.getPricingConfig());
    };
    window.addEventListener('tibra_pricing_updated', handlePricingUpdated);
    // Fetch latest from server
    storeService.fetchPricingFromServer().then(cfg => {
      if (cfg) setPricingConfig(cfg);
    });
    return () => window.removeEventListener('tibra_pricing_updated', handlePricingUpdated);
  }, []);

  const handleSaveCentralPricing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPricing(true);
    storeService.updatePricingConfig(pricingConfig);
    setTimeout(() => {
      setIsSavingPricing(false);
      onRefresh();
      setSuccessToast('Central pricing and combo packages updated live across catalog, cart, checkout, and PDF slips!');
      setTimeout(() => setSuccessToast(''), 4500);
    }, 200);
  };

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

  const handleSaveProduct = (e: React.FormEvent) => {
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

    // Also sync with central pricingConfig if it's the main single bottle or combo
    if (editingProduct.id.includes('30ml') && !editingProduct.id.includes('bundle') && !editingProduct.id.includes('family')) {
      storeService.updatePricingConfig({
        singleBottle: {
          ...pricingConfig.singleBottle,
          name,
          unitPrice: Number(price),
          packagePrice: Number(price),
          originalPrice: Number(originalPrice),
        }
      });
    } else if (editingProduct.id.includes('bundle') || editingProduct.id.includes('combo')) {
      storeService.updatePricingConfig({
        twoBottleCombo: {
          ...pricingConfig.twoBottleCombo,
          name,
          packagePrice: Number(price),
          originalPrice: Number(originalPrice),
        }
      });
    } else if (editingProduct.id.includes('family')) {
      storeService.updatePricingConfig({
        threeBottleFamily: {
          ...pricingConfig.threeBottleFamily,
          name,
          packagePrice: Number(price),
          originalPrice: Number(originalPrice),
        }
      });
    }

    setTimeout(() => {
      setIsSaving(false);
      closeEditModal();
      onRefresh();
      setSuccessToast(`Product "${name}" updated live! Changes reflect immediately.`);
      setTimeout(() => setSuccessToast(''), 4500);
    }, 250);
  };

  // Preview calculations with exact package-wise delivery logic
  const isSingleFree = Boolean(pricingConfig.singleBottle.freeDelivery ?? pricingConfig.singleBottle.isDeliveryIncluded);
  const singleDeliveryFee = isSingleFree ? 0 : (pricingConfig.singleBottle.deliveryFee ?? pricingConfig.singleBottle.deliveryCharges ?? 200);
  const singlePrice = pricingConfig.singleBottle.packagePrice || pricingConfig.singleBottle.unitPrice;
  const singlePayable = singlePrice + singleDeliveryFee;
  const singleDiscount = Math.max(0, pricingConfig.singleBottle.originalPrice - singlePrice);

  const isComboFree = Boolean(pricingConfig.twoBottleCombo.freeDelivery ?? pricingConfig.twoBottleCombo.isDeliveryIncluded);
  const comboDeliveryFee = isComboFree ? 0 : (pricingConfig.twoBottleCombo.deliveryFee ?? pricingConfig.twoBottleCombo.deliveryCharges ?? 200);
  const comboPrice = pricingConfig.twoBottleCombo.packagePrice;
  const comboPayable = comboPrice + comboDeliveryFee;
  const comboDiscount = Math.max(0, pricingConfig.twoBottleCombo.originalPrice - comboPrice);

  const isFamilyFree = Boolean(pricingConfig.threeBottleFamily.freeDelivery ?? pricingConfig.threeBottleFamily.isDeliveryIncluded);
  const familyDeliveryFee = isFamilyFree ? 0 : (pricingConfig.threeBottleFamily.deliveryFee ?? pricingConfig.threeBottleFamily.deliveryCharges ?? 200);
  const familyPrice = pricingConfig.threeBottleFamily.packagePrice;
  const familyPayable = familyPrice + familyDeliveryFee;
  const familyDiscount = Math.max(0, pricingConfig.threeBottleFamily.originalPrice - familyPrice);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-zinc-900">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#252E15] border border-[#748C48] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-[#C5E18A] shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-white">Storefront Synchronized</span>
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="ml-3 text-zinc-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
            Product & Pricing Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Central pricing engine, package-wise standard delivery controls, and live storefront sync.
          </p>
        </div>

        <button
          onClick={onBackToStore}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#252E15] text-[#F5E6A3] border border-[#748C48]/40 hover:bg-[#34401F] transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Verify Live on Storefront</span>
        </button>
      </div>

      {/* Centralized Pricing Control Board */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#748C48]/15 border border-[#748C48]/30 flex items-center justify-center text-[#252E15]">
              <Calculator className="w-5 h-5 text-[#748C48]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#252E15] font-serif">Central Product & Package Pricing Engine</h2>
              <p className="text-xs text-zinc-500">
                Primary source of truth: edits here automatically govern Home, PDP, PLP, Cart, Checkout, Order Records, and A5 PDF Dispatch Slips.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveCentralPricing} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PACKAGE 1 — Single Bottle */}
            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200 space-y-4 shadow-2xs hover:border-[#748C48]/50 transition">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
                <span className="font-bold text-sm text-[#252E15] flex items-center gap-1.5 font-serif">
                  <Package className="w-4 h-4 text-[#748C48]" />
                  <span>Package 1 — Single Bottle</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold">
                  {pricingConfig.singleBottle.sku}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    value={pricingConfig.singleBottle.name}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      singleBottle: { ...pricingConfig.singleBottle, name: e.target.value }
                    })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-medium outline-none focus:border-[#748C48]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bottle Qty</label>
                    <input
                      type="number"
                      value={pricingConfig.singleBottle.bottleQuantity || 1}
                      disabled
                      className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-600 font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Price (PKR)</label>
                    <input
                      type="number"
                      value={pricingConfig.singleBottle.unitPrice}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        singleBottle: {
                          ...pricingConfig.singleBottle,
                          unitPrice: Number(e.target.value),
                          packagePrice: Number(e.target.value)
                        }
                      })}
                      min={1}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-bold outline-none focus:border-[#748C48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1">Compare-At Price (PKR)</label>
                  <input
                    type="number"
                    value={pricingConfig.singleBottle.originalPrice}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      singleBottle: { ...pricingConfig.singleBottle, originalPrice: Number(e.target.value) }
                    })}
                    min={0}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-700 outline-none focus:border-[#748C48]"
                  />
                </div>

                {/* Standard Delivery Configuration */}
                <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#748C48]" />
                      <span>Standard Delivery</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSingleFree ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {isSingleFree ? 'FREE DELIVERY' : `Rs. ${singleDeliveryFee}`}
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isSingleFree}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        singleBottle: {
                          ...pricingConfig.singleBottle,
                          isDeliveryIncluded: e.target.checked,
                          freeDelivery: e.target.checked,
                          deliveryCharges: e.target.checked ? 0 : (pricingConfig.singleBottle.deliveryFee || 200),
                          deliveryFee: e.target.checked ? 0 : (pricingConfig.singleBottle.deliveryFee || 200)
                        }
                      })}
                      className="accent-[#748C48] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-zinc-700 text-xs font-semibold">Free Standard Delivery</span>
                  </label>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-500 mb-0.5">Delivery Fee (PKR)</label>
                    <input
                      type="number"
                      disabled={isSingleFree}
                      value={isSingleFree ? 0 : singleDeliveryFee}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        singleBottle: {
                          ...pricingConfig.singleBottle,
                          deliveryCharges: Number(e.target.value),
                          deliveryFee: Number(e.target.value)
                        }
                      })}
                      min={0}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border ${isSingleFree ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-white border-zinc-300 text-zinc-900 focus:border-[#748C48]'}`}
                    />
                  </div>
                </div>

                {/* Price Preview */}
                <div className="pt-2 border-t border-zinc-200 text-[11px] space-y-1 font-medium">
                  <div className="flex justify-between text-zinc-600">
                    <span>Package Price:</span>
                    <span>Rs. {singlePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Standard Delivery:</span>
                    <span>{isSingleFree ? 'FREE (Rs. 0)' : `Rs. ${singleDeliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Discount:</span>
                    <span className="text-emerald-700">- Rs. {singleDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200 text-xs">
                    <span>Customer Payable:</span>
                    <span className="text-[#252E15]">Rs. {singlePayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PACKAGE 2 — Two-Bottle Combo */}
            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-[#748C48]/40 space-y-4 shadow-2xs hover:border-[#748C48] transition">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
                <span className="font-bold text-sm text-[#252E15] flex items-center gap-1.5 font-serif">
                  <Tag className="w-4 h-4 text-[#748C48]" />
                  <span>Package 2 — Two-Bottle Combo</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#748C48]/15 text-[#252E15] font-bold">
                  {pricingConfig.twoBottleCombo.sku}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    value={pricingConfig.twoBottleCombo.name}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      twoBottleCombo: { ...pricingConfig.twoBottleCombo, name: e.target.value }
                    })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-medium outline-none focus:border-[#748C48]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bottle Qty</label>
                    <input
                      type="number"
                      value={pricingConfig.twoBottleCombo.bottleQuantity || 2}
                      disabled
                      className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-600 font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Price (PKR) *</label>
                    <input
                      type="number"
                      value={pricingConfig.twoBottleCombo.packagePrice}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        twoBottleCombo: { ...pricingConfig.twoBottleCombo, packagePrice: Number(e.target.value) }
                      })}
                      min={1}
                      className="w-full bg-white border border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 font-bold outline-none focus:ring-1 focus:ring-[#748C48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1">Compare-At Price (2x Regular)</label>
                  <input
                    type="number"
                    value={pricingConfig.twoBottleCombo.originalPrice}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      twoBottleCombo: { ...pricingConfig.twoBottleCombo, originalPrice: Number(e.target.value) }
                    })}
                    min={0}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-700 outline-none focus:border-[#748C48]"
                  />
                </div>

                {/* Standard Delivery Configuration */}
                <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#748C48]" />
                      <span>Standard Delivery</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isComboFree ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {isComboFree ? 'FREE DELIVERY' : `Rs. ${comboDeliveryFee}`}
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isComboFree}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        twoBottleCombo: {
                          ...pricingConfig.twoBottleCombo,
                          isDeliveryIncluded: e.target.checked,
                          freeDelivery: e.target.checked,
                          deliveryCharges: e.target.checked ? 0 : (pricingConfig.twoBottleCombo.deliveryFee || 200),
                          deliveryFee: e.target.checked ? 0 : (pricingConfig.twoBottleCombo.deliveryFee || 200)
                        }
                      })}
                      className="accent-[#748C48] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-zinc-700 text-xs font-semibold">Free Standard Delivery</span>
                  </label>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-500 mb-0.5">Delivery Fee (PKR)</label>
                    <input
                      type="number"
                      disabled={isComboFree}
                      value={isComboFree ? 0 : comboDeliveryFee}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        twoBottleCombo: {
                          ...pricingConfig.twoBottleCombo,
                          deliveryCharges: Number(e.target.value),
                          deliveryFee: Number(e.target.value)
                        }
                      })}
                      min={0}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border ${isComboFree ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-white border-zinc-300 text-zinc-900 focus:border-[#748C48]'}`}
                    />
                  </div>
                </div>

                {/* Price Preview */}
                <div className="pt-2 border-t border-zinc-200 text-[11px] space-y-1 font-medium">
                  <div className="flex justify-between text-zinc-600">
                    <span>Package Price:</span>
                    <span>Rs. {comboPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Standard Delivery:</span>
                    <span>{isComboFree ? 'FREE (Rs. 0)' : `Rs. ${comboDeliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Discount:</span>
                    <span className="text-emerald-700">- Rs. {comboDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200 text-xs">
                    <span>Customer Payable:</span>
                    <span className="text-[#252E15]">Rs. {comboPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PACKAGE 3 — Three-Bottle / Family Pack */}
            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200 space-y-4 shadow-2xs hover:border-[#748C48]/50 transition">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
                <span className="font-bold text-sm text-[#252E15] flex items-center gap-1.5 font-serif">
                  <Package className="w-4 h-4 text-[#748C48]" />
                  <span>Package 3 — 3-Bottle Family Pack</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold">
                  {pricingConfig.threeBottleFamily.sku}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    value={pricingConfig.threeBottleFamily.name}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      threeBottleFamily: { ...pricingConfig.threeBottleFamily, name: e.target.value }
                    })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-medium outline-none focus:border-[#748C48]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bottle Qty</label>
                    <input
                      type="number"
                      value={pricingConfig.threeBottleFamily.bottleQuantity || 3}
                      disabled
                      className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-600 font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Package Price (PKR)</label>
                    <input
                      type="number"
                      value={pricingConfig.threeBottleFamily.packagePrice}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        threeBottleFamily: { ...pricingConfig.threeBottleFamily, packagePrice: Number(e.target.value) }
                      })}
                      min={1}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-bold outline-none focus:border-[#748C48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1">Compare-At Price (3x Regular)</label>
                  <input
                    type="number"
                    value={pricingConfig.threeBottleFamily.originalPrice}
                    onChange={(e) => setPricingConfig({
                      ...pricingConfig,
                      threeBottleFamily: { ...pricingConfig.threeBottleFamily, originalPrice: Number(e.target.value) }
                    })}
                    min={0}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-zinc-700 outline-none focus:border-[#748C48]"
                  />
                </div>

                {/* Standard Delivery Configuration */}
                <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#748C48]" />
                      <span>Standard Delivery</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFamilyFree ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {isFamilyFree ? 'FREE DELIVERY' : `Rs. ${familyDeliveryFee}`}
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isFamilyFree}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        threeBottleFamily: {
                          ...pricingConfig.threeBottleFamily,
                          isDeliveryIncluded: e.target.checked,
                          freeDelivery: e.target.checked,
                          deliveryCharges: e.target.checked ? 0 : (pricingConfig.threeBottleFamily.deliveryFee || 200),
                          deliveryFee: e.target.checked ? 0 : (pricingConfig.threeBottleFamily.deliveryFee || 200)
                        }
                      })}
                      className="accent-[#748C48] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-zinc-700 text-xs font-semibold">Free Standard Delivery</span>
                  </label>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-500 mb-0.5">Delivery Fee (PKR)</label>
                    <input
                      type="number"
                      disabled={isFamilyFree}
                      value={isFamilyFree ? 0 : familyDeliveryFee}
                      onChange={(e) => setPricingConfig({
                        ...pricingConfig,
                        threeBottleFamily: {
                          ...pricingConfig.threeBottleFamily,
                          deliveryCharges: Number(e.target.value),
                          deliveryFee: Number(e.target.value)
                        }
                      })}
                      min={0}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border ${isFamilyFree ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-white border-zinc-300 text-zinc-900 focus:border-[#748C48]'}`}
                    />
                  </div>
                </div>

                {/* Price Preview */}
                <div className="pt-2 border-t border-zinc-200 text-[11px] space-y-1 font-medium">
                  <div className="flex justify-between text-zinc-600">
                    <span>Package Price:</span>
                    <span>Rs. {familyPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Standard Delivery:</span>
                    <span>{isFamilyFree ? 'FREE (Rs. 0)' : `Rs. ${familyDeliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Discount:</span>
                    <span className="text-emerald-700">- Rs. {familyDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200 text-xs">
                    <span>Customer Payable:</span>
                    <span className="text-[#252E15]">Rs. {familyPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-100">
            <p className="text-xs text-zinc-500">
              * Order price snapshot policy: Historical and dispatched orders retain their original saved snapshot.
            </p>

            <button
              type="submit"
              disabled={isSavingPricing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingPricing ? 'Publishing Updates...' : 'Save & Propagate Central Pricing'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#252E15] font-serif">Product Catalog & Variant Stock</h2>
          <span className="text-xs text-zinc-500 font-medium">{products.length} Products Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50/70">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">SKU / Size</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Catalog Price</th>
                <th className="py-3.5 px-6">Compare At</th>
                <th className="py-3.5 px-6">Offer Badge</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {products.map((p) => {
                const discount = p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-zinc-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
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
                          <div className="font-semibold text-zinc-900">{p.name}</div>
                          <div className="text-[11px] text-zinc-500 line-clamp-1">{p.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-mono text-zinc-800 font-semibold">{p.sku || p.id}</div>
                      <div className="text-[11px] text-zinc-500">{p.size}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="font-semibold text-zinc-900">{p.stock} units</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">In Warehouse</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-[#252E15]">
                        Rs. {p.price.toLocaleString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {p.originalPrice > 0 ? (
                        <div>
                          <span className="line-through text-zinc-400 font-mono">
                            Rs. {p.originalPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="ml-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#748C48]/15 text-[#252E15] border border-[#748C48]/30">
                          <Tag className="w-3 h-3 text-[#748C48]" />
                          <span>{p.badge}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 ml-auto transition cursor-pointer border border-zinc-200"
                      >
                        <Edit2 className="w-3 h-3 text-[#748C48]" />
                        <span>Edit Product</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full text-zinc-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <h3 className="font-bold text-base text-[#252E15] font-serif">Edit Product & Pricing</h3>
                <p className="text-xs text-zinc-500">Live storefront SKU details</p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Subtitle / Marketing Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Catalog Price (PKR) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 font-bold outline-none focus:border-[#748C48] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1">Compare-At Price (PKR)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    min={0}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-800 outline-none focus:border-[#748C48] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={0}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'draft' | 'archived')}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Offer / Promo Badge</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Best Seller, Save 25% Today"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bundle Offer Tagline</label>
                <input
                  type="text"
                  value={bundleOffer}
                  onChange={(e) => setBundleOffer(e.target.value)}
                  placeholder="e.g. Save 35% + Free Delivery"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white rounded-xl px-3 py-2 text-zinc-900 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
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
