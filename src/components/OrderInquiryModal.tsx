import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  MessageSquare,
  ShoppingBag,
  PackageCheck,
  MapPin,
  PhoneCall,
  User,
  Phone,
  FileText,
  BadgeCheck,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storeService } from '../services/storeService';
import type { Order } from '../types/ecommerce';

interface OrderInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInquiryModal: React.FC<OrderInquiryModalProps> = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const products = storeService.getProducts();
  const primaryProduct = products[0] || {
    id: 'tibra-natural-joint-oil-30ml',
    name: 'Tibra Natural Joint Oil',
    price: 1500,
    image: '/assets/purefix-bottle-transparent.png',
  };
  const unitPrice = primaryProduct.price;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create real order in storeService
    const order = storeService.createOrder({
      customerName: name || 'Valued Customer',
      customerPhone: phone || '+92 300 0000000',
      shippingAddress: address || 'Doorstep Delivery',
      city: address.split(',')[0]?.trim() || 'Direct Order',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      items: [
        {
          productId: primaryProduct.id,
          productName: primaryProduct.name,
          quantity: quantity,
          price: unitPrice,
          image: primaryProduct.image,
        },
      ],
      subtotal: totalPrice,
      shippingFee: 0,
      total: totalPrice,
      status: 'pending',
      notes: notes ? `Customer Note: ${notes}` : 'Placed via Header Quick Order Modal',
    });

    setCreatedOrder(order);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#748C48', '#D4AF37', '#252E15', '#F5E6A3'],
      });
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Tibra Natural Team! I want to confirm my order for Tibra Natural Joint Oil (30 ML).\n` +
      `Order: ${createdOrder ? createdOrder.orderNumber : 'Pending'}\n` +
      `Quantity: ${quantity} bottle(s) - Rs. ${totalPrice.toLocaleString()}\n` +
      `Name: ${name || 'Customer'}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n` +
      `Payment: Cash on Delivery`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border border-cream-200 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-botanical-600 hover:text-botanical-950 hover:bg-cream-100 transition-colors cursor-pointer z-20"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header with right padding to clear close button */}
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-11 h-11 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center shrink-0 border border-botanical-200">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-botanical-950 truncate">
                  Confirm Quick Order
                </h3>
                <p className="text-xs text-botanical-700 truncate">
                  Tibra Natural Joint Oil • Cash on Delivery
                </p>
              </div>
            </div>

            {/* Visual 3-Step Process Flow at Top */}
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-4 bg-[#F5F0E6]/70 rounded-2xl border border-cream-200 text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-botanical-800 text-gold-light flex items-center justify-center shadow-xs">
                  <PackageCheck className="w-3.5 h-3.5 stroke-[1.75]" />
                </div>
                <span className="font-bold text-[10px] text-botanical-950 uppercase tracking-wide">1. Bottles</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-cream-300/80">
                <div className="w-6 h-6 rounded-lg bg-botanical-800 text-gold-light flex items-center justify-center shadow-xs">
                  <MapPin className="w-3.5 h-3.5 stroke-[1.75]" />
                </div>
                <span className="font-bold text-[10px] text-botanical-950 uppercase tracking-wide">2. Address</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-botanical-800 text-gold-light flex items-center justify-center shadow-xs">
                  <Truck className="w-3.5 h-3.5 stroke-[1.75]" />
                </div>
                <span className="font-bold text-[10px] text-botanical-950 uppercase tracking-wide">3. Fast COD</span>
              </div>
            </div>

            {/* Product Summary Preview with Live Price */}
            <div className="p-3.5 rounded-2xl bg-[#F5F0E6] border border-cream-300 flex items-center gap-3 sm:gap-4 mb-4">
              <img
                src={primaryProduct.image || '/assets/purefix-bottle-transparent.png'}
                alt="Tibra Natural Joint Oil 30ML"
                className="w-12 h-16 sm:w-14 sm:h-18 object-contain shrink-0 drop-shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-botanical-950 leading-tight">
                    {primaryProduct.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-bold text-[#748C48] whitespace-nowrap shrink-0">
                    Rs. {unitPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-botanical-700 mt-0.5 truncate">
                  100% Pure Botanical Formulation • 30 ML
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream-300/70 gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-botanical-800">
                      Qty:
                    </span>
                    <div className="inline-flex items-center border border-cream-300 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-0.5 text-xs font-bold text-botanical-800 hover:bg-cream-100 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-botanical-950 font-mono">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-botanical-800 hover:bg-cream-100 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-right whitespace-nowrap shrink-0">
                    <span className="text-[11px] text-botanical-600 font-medium">Total:</span>
                    <span className="text-sm font-bold text-botanical-950 font-mono">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-botanical-900 uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5 text-botanical-600" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-botanical-500 text-sm bg-cream-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-botanical-900 uppercase tracking-wider mb-1">
                    <Phone className="w-3.5 h-3.5 text-botanical-600" />
                    <span>Phone / WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-botanical-500 text-sm bg-cream-50/50"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-botanical-900 uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-botanical-600" />
                    <span>City / Delivery Area *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore / Karachi / Islamabad"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-botanical-500 text-sm bg-cream-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-botanical-900 uppercase tracking-wider mb-1">
                  <FileText className="w-3.5 h-3.5 text-botanical-600" />
                  <span>Delivery Instructions or Notes (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Street address, nearest landmark, or preferred delivery timing..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-botanical-500 text-sm bg-cream-50/50"
                />
              </div>

              {/* Main Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-5 rounded-full bg-[#748C48] hover:bg-[#5F7339] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-[#748C48]/30 hover:-translate-y-0.5 border border-[#62773C] cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Confirm Order (Cash on Delivery)</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0 border border-white/20"
                  title="Direct WhatsApp Order"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-center text-botanical-700 pt-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pay securely in cash when package arrives at your doorstep.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation Screen */
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                Order #{createdOrder?.orderNumber}
              </div>
              <h3 className="font-serif font-bold text-xl text-botanical-950">
                Order Confirmed!
              </h3>
              <p className="text-sm text-botanical-800 max-w-sm mx-auto">
                Thank you, <strong className="text-botanical-950">{name}</strong>. Your order for <strong className="text-botanical-950">{quantity} bottle(s)</strong> (Rs. {totalPrice.toLocaleString()}) has been booked successfully via Cash on Delivery.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-100 text-xs text-botanical-800 text-left space-y-1.5 border border-cream-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-botanical-600" />
                <span><strong>Contact Phone:</strong> {phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-botanical-600" />
                <span><strong>Destination:</strong> {address}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-botanical-600" />
                <span><strong>Status:</strong> Order dispatched to warehouse. Rider will call before delivery.</span>
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#20ba59] transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Confirmation</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-botanical-900 text-cream-50 text-xs font-bold uppercase tracking-wider hover:bg-botanical-950 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
