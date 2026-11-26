import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  Truck,
  CreditCard,
  FileText
} from 'lucide-react';
import type { StoreSettings, SenderSettings } from '../../types/ecommerce';
import { storeService } from '../../services/storeService';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [senderSettings, setSenderSettings] = useState<SenderSettings>(() => storeService.getSenderSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.saveSettings(settings);
    storeService.updateSenderSettings(senderSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {isSaved && (
        <div className="fixed top-6 right-6 z-50 bg-[#252E15] border border-[#748C48] text-[#F8F9FA] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#748C48]" />
          <span className="text-xs font-semibold">Store settings and PDF slip sender metadata saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
          Store Configuration & Business Profile
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Store metadata, branded PDF dispatch slip sender credentials, and payment options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Official Sender & PDF Slip Settings */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#252E15] font-serif flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#748C48]" />
            <span>Official Sender Details (Printed on PDF Dispatch Slips)</span>
          </h2>
          <p className="text-xs text-zinc-500">
            These details appear directly on all generated A5 & A4 vector dispatch slips, customer receipts, and courier manifests.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Official Business / Brand Name
              </label>
              <input
                type="text"
                value={senderSettings.businessName}
                onChange={(e) => setSenderSettings({ ...senderSettings, businessName: e.target.value })}
                required
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Official Contact / Helpline Phone
              </label>
              <input
                type="text"
                value={senderSettings.officialPhone}
                onChange={(e) => setSenderSettings({ ...senderSettings, officialPhone: e.target.value })}
                required
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Sender Dispatch Warehouse Address (Karachi)
              </label>
              <textarea
                rows={2}
                value={senderSettings.senderAddress}
                onChange={(e) => setSenderSettings({ ...senderSettings, senderAddress: e.target.value })}
                required
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                WhatsApp Order Support
              </label>
              <input
                type="text"
                value={senderSettings.whatsappNumber}
                onChange={(e) => setSenderSettings({ ...senderSettings, whatsappNumber: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Official Website URL
              </label>
              <input
                type="url"
                value={senderSettings.website}
                onChange={(e) => setSenderSettings({ ...senderSettings, website: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={senderSettings.facebookUrl}
                onChange={(e) => setSenderSettings({ ...senderSettings, facebookUrl: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={senderSettings.instagramUrl}
                onChange={(e) => setSenderSettings({ ...senderSettings, instagramUrl: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Profiles */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#252E15] font-serif flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#748C48]" />
            <span>Store Delivery Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Standard Shipping Fee (PKR)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                min={0}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Default courier fee for a single bottle (Rs. 200).
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Free Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                min={0}
                className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] rounded-xl px-3 py-2 text-zinc-900 outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Orders equal to or above this amount (e.g. Rs. 2,600 combo) qualify for Free Delivery.
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#252E15] font-serif flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#748C48]" />
            <span>Payment Options</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#748C48] rounded"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">Cash on Delivery (COD)</span>
                <span className="text-zinc-500 text-[11px]">
                  Allow customers to pay cash directly to the courier rider upon doorstep delivery.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition">
              <input
                type="checkbox"
                checked={settings.bankTransferEnabled}
                onChange={(e) => setSettings({ ...settings, bankTransferEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#748C48] rounded"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">Direct Bank Transfer / Raast</span>
                <span className="text-zinc-500 text-[11px]">
                  Display IBAN & account details for advance bank transfer or Raast instant payments.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store & PDF Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
