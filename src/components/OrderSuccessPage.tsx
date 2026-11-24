import React from 'react';
import { CheckCircle, Home, PhoneCall } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrder, setCurrentView } = useShop();

  const handleWhatsApp = () => {
    if (!lastCreatedOrder) return;
    const text = encodeURIComponent(
      `Hello TIBRA NATURALS Team! I just placed Order #${lastCreatedOrder.orderNumber}.\n` +
      `Customer Name: ${lastCreatedOrder.customerName}\n` +
      `Phone: ${lastCreatedOrder.customerPhone}\n` +
      `Delivery Address: ${lastCreatedOrder.shippingAddress}, ${lastCreatedOrder.city}\n` +
      `Total Amount: Rs. ${lastCreatedOrder.total.toLocaleString()} (${lastCreatedOrder.paymentMethod})\n` +
      `Please confirm tracking and dispatch.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-8 sm:p-12 text-center space-y-6">
        
        {/* Animated Success Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-botanical-100 text-botanical-800 flex items-center justify-center shadow-md border-2 border-botanical-300">
            <CheckCircle className="w-10 h-10 stroke-[2]" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gold" />
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
            Order Confirmed &amp; Logged
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-botanical-950">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-botanical-800/80 max-w-md mx-auto leading-relaxed">
            Your TIBRA NATURALS Pain Relief Oil order has been recorded into our fulfillment system. Our logistics team is preparing your package for fast doorstep delivery.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        {lastCreatedOrder && (
          <div className="bg-[#F5F0E6]/70 rounded-2xl p-5 border border-cream-300/80 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-cream-200">
              <span className="text-botanical-600 font-medium">Order Number:</span>
              <span className="font-mono font-bold text-sm text-botanical-950">{lastCreatedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-600">Customer Name:</span>
              <span className="font-semibold text-botanical-900">{lastCreatedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-600">Phone:</span>
              <span className="font-mono text-botanical-900">{lastCreatedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-600">Delivery To:</span>
              <span className="font-medium text-botanical-900 text-right max-w-[200px] truncate">
                {lastCreatedOrder.shippingAddress}, {lastCreatedOrder.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-600">Payment Method:</span>
              <span className="font-bold text-botanical-800 uppercase">{lastCreatedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-cream-200 text-sm font-bold text-botanical-950">
              <span>Total Payable:</span>
              <span className="text-base text-botanical-900">Rs. {lastCreatedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider bg-botanical-800 text-cream-50 hover:bg-botanical-900 transition-all shadow-md group"
          >
            <PhoneCall className="w-4 h-4 text-gold-light" />
            <span>Confirm on WhatsApp</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-botanical-900 border border-cream-300 hover:bg-cream-100 transition-all shadow-xs"
          >
            <Home className="w-4 h-4 text-botanical-600" />
            <span>Return to Home</span>
          </button>
        </div>

        <p className="text-[11px] text-botanical-600/70">
          Estimated dispatch time: <strong>Today within 4 hours</strong> • Official Tracking SMS will follow.
        </p>

      </div>
    </div>
  );
};
