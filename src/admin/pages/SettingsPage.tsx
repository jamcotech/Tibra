import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  Truck,
  CreditCard,
  Building
} from 'lucide-react';
import type { StoreSettings } from '../../types/ecommerce';
import { storeService } from '../../services/storeService';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {isSaved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">Store settings saved and updated successfully.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
          Store Configuration & Channels
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Spree commerce channel rules, delivery rate thresholds, and official business metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Store Profile & Contacts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Legal Entity / Company Name
              </label>
              <input
                type="text"
                value={settings.legalBusinessName}
                onChange={(e) => setSettings({ ...settings, legalBusinessName: e.target.value })}
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Support Helpline / WhatsApp
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Base Currency
              </label>
              <input
                type="text"
                disabled
                value={`${settings.currency} (Pakistani Rupee)`}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Timezone
              </label>
              <input
                type="text"
                disabled
                value={settings.timezone}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Profiles */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Delivery Profiles & Free Shipping Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Standard Shipping Fee (PKR)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                min={0}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Applied to orders below the free delivery threshold.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Free Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                min={0}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Orders equal to or above this amount get Free Delivery.
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payment Gateway & COD Settings</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="font-semibold text-white block">Cash on Delivery (COD)</span>
                <span className="text-zinc-400 text-[11px]">
                  Allow customers to pay cash directly to courier rider upon doorstep delivery.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bankTransferEnabled}
                onChange={(e) => setSettings({ ...settings, bankTransferEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="font-semibold text-white block">Direct Bank Transfer / Raast</span>
                <span className="text-zinc-400 text-[11px]">
                  Display IBAN & account details for advance bank transfer or Raast instant payments.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
