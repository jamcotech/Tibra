import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { SeoHead } from '../SeoHead';
import { trackingService, type TrackingDetails } from '../../services/trackingService';

// The 11 standardized lifecycle stages in chronological order
const STANDARD_STAGES = [
  { key: 'order_placed', label: 'Order Placed', shortLabel: 'Placed' },
  { key: 'order_confirmed', label: 'Order Confirmed', shortLabel: 'Confirmed' },
  { key: 'processing', label: 'Processing', shortLabel: 'Processing' },
  { key: 'packed', label: 'Packed', shortLabel: 'Packed' },
  { key: 'ready_for_dispatch', label: 'Ready for Dispatch', shortLabel: 'Staged' },
  { key: 'shipment_booked', label: 'Shipment Booked', shortLabel: 'Booked' },
  { key: 'courier_picked_up', label: 'Courier Picked Up', shortLabel: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit', shortLabel: 'In Transit' },
  { key: 'arrived_at_hub', label: 'Destination Hub', shortLabel: 'At Hub' },
  { key: 'out_for_delivery', label: 'Out for Delivery', shortLabel: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered', shortLabel: 'Delivered' }
];

export const TrackOrderPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [useTokenMode, setUseTokenMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const executeLookup = useCallback(async (params: { order?: string; phone?: string; token?: string }, isAuto: boolean = false) => {
    if (!isAuto) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await trackingService.lookupOrder({
        orderNumber: params.order,
        phone: params.phone,
        token: params.token
      });
      setTrackingData(data);
      setLastRefreshedAt(new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' PKT');
      setError(null);
    } catch (err: any) {
      if (!isAuto) {
        setError(err?.message || 'Unable to find tracking records. Please verify your order number and phone.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Parse URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qOrder = params.get('order') || params.get('orderNumber') || '';
      const qPhone = params.get('phone') || params.get('mobile') || '';
      const qToken = params.get('token') || '';

      if (qToken) {
        setToken(qToken);
        setUseTokenMode(true);
        executeLookup({ token: qToken });
      } else if (qOrder) {
        setOrderNumber(qOrder);
        if (qPhone) {
          setPhone(qPhone);
          executeLookup({ order: qOrder, phone: qPhone });
        }
      }
    }
  }, [executeLookup]);

  // Live auto-refresh polling every 45s if order is tracked and not delivered/cancelled
  useEffect(() => {
    if (!trackingData || !autoRefreshEnabled) return;
    if (trackingData.status === 'delivered' || trackingData.status === 'cancelled') return;

    const interval = setInterval(() => {
      executeLookup(
        useTokenMode ? { token } : { order: orderNumber || trackingData.orderNumber, phone: phone },
        true
      );
    }, 45000);

    return () => clearInterval(interval);
  }, [trackingData, autoRefreshEnabled, useTokenMode, token, orderNumber, phone, executeLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useTokenMode) {
      if (!token.trim()) {
        setError('Please enter your tracking access token.');
        return;
      }
      executeLookup({ token });
    } else {
      if (!orderNumber.trim()) {
        setError('Please enter your Order Number (e.g. TN-2026-8941).');
        return;
      }
      executeLookup({ order: orderNumber });
    }
  };

  const handleManualRefresh = () => {
    if (!trackingData) return;
    executeLookup(
      useTokenMode ? { token } : { order: orderNumber || trackingData.orderNumber, phone },
      true
    );
  };

  // Determine stage progression
  const currentStatusKey = trackingData?.status || 'order_placed';
  const stageMeta = trackingData?.statusMeta;
  const isException = stageMeta?.isException || false;

  // Find index in standard 11 stages
  let currentStageIndex = STANDARD_STAGES.findIndex(s => s.key === currentStatusKey);
  if (currentStageIndex === -1) {
    // If exception status, find most recent matching event
    if (currentStatusKey.includes('attempt') || currentStatusKey.includes('unavailable') || currentStatusKey.includes('delay')) {
      currentStageIndex = 9; // Out for delivery stage
    } else if (currentStatusKey.includes('hub') || currentStatusKey.includes('address')) {
      currentStageIndex = 8;
    } else {
      currentStageIndex = 0;
    }
  }

  const whatsappMessage = trackingData
    ? encodeURIComponent(`Hi TIBRA NATURALS Team, I would like an update regarding my Order #${trackingData.orderNumber} (Consignment: ${trackingData.courier?.trackingNumber || 'Pending'}).`)
    : encodeURIComponent('Hi TIBRA NATURALS, I have an inquiry about my order delivery.');

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <SeoHead
        title="Live Order & Shipment Tracking | TIBRA NATURALS Pakistan"
        description="Track your TIBRA NATURALS order and live parcel delivery across Pakistan. Enter your Order Number and mobile number for real-time courier checkpoints."
        canonicalPath="/track-order/"
      />

      {/* Hero Header */}
      <div className="bg-[#252E15] text-[#FAF8F5] pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#748C48_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#748C48]/30 border border-[#748C48]/40 text-xs font-medium text-emerald-200 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official TIBRA NATURALS Tracking Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white mb-3">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Enter your Order Number to view live consignment milestones, scan locations, and estimated delivery across Pakistan.
          </p>
        </div>
      </div>

      {/* Tracking Input Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Secure Parcel Verification
            </span>
            <button
              type="button"
              onClick={() => {
                setUseTokenMode(!useTokenMode);
                setError(null);
              }}
              className="text-xs font-medium text-[#506326] hover:text-[#252E15] underline cursor-pointer"
            >
              {useTokenMode ? '← Use Order Number' : 'Use Tracking Token Instead →'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!useTokenMode ? (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. TN-2026-8941"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-xl text-sm font-mono font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#748C48] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Tracking Access Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.trim())}
                  placeholder="e.g. tn_trk_8941_a9f1b2c3d4e5f678"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-xl text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#748C48] focus:border-transparent transition"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Verification Notice</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#506326] hover:bg-[#3D4C1D] text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Order Records...
                </>
              ) : (
                <>
                  Track Live Shipment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Tracking Details View */}
      {trackingData && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#252E15]">
                    Order #{trackingData.orderNumber}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stageMeta?.badgeColor || 'bg-zinc-100 text-zinc-800 border-zinc-300'}`}>
                    {stageMeta?.label || trackingData.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Placed on {trackingData.orderDate} • Customer: {trackingData.customerName} ({trackingData.maskedPhone})
                </p>
              </div>

              {/* Refresh Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-medium text-zinc-700 transition cursor-pointer"
                  title="Refresh status from live courier network"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#506326]' : 'text-zinc-500'}`} />
                  Refresh
                </button>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    className="rounded text-[#506326] focus:ring-[#748C48]"
                  />
                  Live Sync
                </label>
              </div>
            </div>

            {/* Status Description Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-zinc-200/80 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#506326] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-zinc-900">{stageMeta?.description || 'Your order is progressing smoothly.'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 text-xs mt-1">
                  {trackingData.estimatedDeliveryDate && (
                    <span><strong>Estimated Delivery:</strong> {trackingData.estimatedDeliveryDate}</span>
                  )}
                  {trackingData.courier && (
                    <span><strong>Courier Partner:</strong> {trackingData.courier.name}</span>
                  )}
                  {lastRefreshedAt && (
                    <span><strong>Last Verified:</strong> {lastRefreshedAt}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Exception Warning Banner */}
            {isException && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Delivery Notice</p>
                  <p className="mt-0.5">
                    Our logistics dispatch team is actively monitoring this consignment. If delivery was attempted, courier will re-attempt on the next business day. You can also reach our support team directly.
                  </p>
                  <a
                    href={`https://wa.me/923001234567?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-950 underline hover:text-black"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Contact WhatsApp Support for Expedited Resolution →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 11-Stage Interactive Visual Progress Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm">
            <h3 className="text-sm font-bold text-[#252E15] uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>Delivery Progress Stages (11 Checkpoints)</span>
              <span className="text-xs font-normal text-zinc-500">
                Step {Math.min(11, currentStageIndex + 1)} of 11
              </span>
            </h3>

            {/* Desktop Horizontal Stepper */}
            <div className="hidden lg:block overflow-x-auto pb-4">
              <div className="min-w-[760px] flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-4 right-4 top-4 h-1 bg-zinc-200 -z-0" />
                <div
                  className="absolute left-4 top-4 h-1 bg-[#506326] transition-all duration-500 -z-0"
                  style={{
                    width: `${(Math.max(0, currentStageIndex) / (STANDARD_STAGES.length - 1)) * 100}%`
                  }}
                />

                {STANDARD_STAGES.map((st, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center relative z-10 w-16">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#506326] text-white shadow-sm'
                            : isCurrent
                            ? 'bg-white border-2 border-[#506326] text-[#506326] ring-4 ring-[#748C48]/20 animate-pulse'
                            : 'bg-zinc-100 border border-zinc-300 text-zinc-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] mt-2 font-medium leading-tight ${
                          isCurrent
                            ? 'text-[#252E15] font-bold'
                            : isCompleted
                            ? 'text-zinc-700'
                            : 'text-zinc-400'
                        }`}
                      >
                        {st.shortLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile / Tablet Vertical Stepper */}
            <div className="lg:hidden space-y-3">
              {STANDARD_STAGES.map((st, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={st.key} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-[#506326] text-white'
                          : isCurrent
                          ? 'bg-white border-2 border-[#506326] text-[#506326] ring-2 ring-[#748C48]/20'
                          : 'bg-zinc-100 border border-zinc-300 text-zinc-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${
                          isCurrent
                            ? 'font-bold text-[#252E15]'
                            : isCompleted
                            ? 'font-medium text-zinc-800'
                            : 'text-zinc-400'
                        }`}
                      >
                        {st.label}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Shipping Meta Card */}
          {trackingData.courier && (
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm">
              <h3 className="text-sm font-bold text-[#252E15] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#506326]" />
                Courier Logistics Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-zinc-200/80">
                <div>
                  <p className="text-xs text-zinc-500">Courier Service</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">{trackingData.courier.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Consignment / Tracking #</p>
                  <p className="text-sm font-mono font-bold text-zinc-900 mt-0.5">{trackingData.courier.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Route</p>
                  <p className="text-sm font-medium text-zinc-900 mt-0.5">
                    {trackingData.courier.originCity} → {trackingData.courier.destinationCity}
                  </p>
                </div>
              </div>

              {trackingData.courier.trackingUrl && (
                <div className="mt-4 flex justify-end">
                  <a
                    href={trackingData.courier.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition"
                  >
                    Open Official {trackingData.courier.name} Tracking Portal
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Chronological Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm">
            <h3 className="text-sm font-bold text-[#252E15] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#506326]" />
              Detailed Checkpoint History ({trackingData.events.length} Scans)
            </h3>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {trackingData.events.slice().reverse().map((ev, idx) => (
                <div key={ev.id || idx} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      idx === 0 ? 'bg-[#506326] ring-4 ring-emerald-100' : 'bg-zinc-400'
                    }`}
                  />
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-bold text-zinc-900">{ev.title}</p>
                      <span className="text-xs font-mono text-zinc-500">{ev.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5">{ev.description}</p>
                    {ev.location && (
                      <p className="text-[11px] font-medium text-zinc-500 mt-1 flex items-center gap-1">
                        <span>📍 Location:</span> {ev.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items & Summary */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm">
            <h3 className="text-sm font-bold text-[#252E15] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#506326]" />
              Items in This Parcel
            </h3>

            <div className="divide-y divide-zinc-100">
              {trackingData.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-contain rounded-lg bg-zinc-50 border border-zinc-200 p-1 shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900">{item.productName}</p>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-zinc-900 shrink-0">
                    Rs. {(item.quantity * item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500">Total Payable ({trackingData.paymentMethod}):</span>
                <p className="text-xs font-medium text-emerald-800">
                  Payment Status: {trackingData.paymentStatus.toUpperCase()}
                </p>
              </div>
              <span className="text-base sm:text-lg font-bold text-[#252E15]">
                Rs. {trackingData.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="bg-[#252E15] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h4 className="text-base font-bold font-serif">Have questions regarding this delivery?</h4>
              <p className="text-xs text-zinc-300 mt-1">
                Our customer care team is available 9 AM - 9 PM PKT to assist you with order status and address changes.
              </p>
            </div>
            <a
              href={`https://wa.me/923001234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
