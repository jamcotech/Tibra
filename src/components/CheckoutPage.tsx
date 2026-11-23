import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, Truck, CreditCard, Sparkles, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, setCurrentView, setLastCreatedOrder, updateQuantity, removeFromCart } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    paymentMethod: 'COD' as 'COD' | 'Direct Transfer',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const freeDeliveryThreshold = 3000;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;
  const shippingFee = isFreeDelivery ? 0 : 150;
  const total = cartSubtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const order = storeService.createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'Direct Transfer' ? 'pending' : 'pending',
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        subtotal: cartSubtotal,
        shippingFee,
        total,
        status: 'pending',
        notes: formData.notes
      });

      setLastCreatedOrder(order);
      clearCart();

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#748C48', '#D4AF37', '#252E15', '#F5E6A3'],
      });

      setCurrentView('order-success');
    } catch (err) {
      console.error(err);
      alert('Could not process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-xl text-botanical-950">No items to checkout</h2>
          <p className="text-xs text-botanical-700">Please add Tibra Natural Joint Oil to your cart first.</p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase bg-botanical-900 text-cream-50"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('cart')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-botanical-700 hover:text-botanical-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Customer & Shipping Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-6 sm:p-10 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5 text-botanical-600" />
                <span>Express Secure Checkout</span>
              </div>
              <h1 className="font-serif font-bold text-3xl text-botanical-950">
                Delivery Details
              </h1>
              <p className="text-xs text-botanical-700/80 mt-1">
                Enter your genuine delivery information to receive your order within 24-48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                    Email Address <span className="text-botanical-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tariq@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="House / Apartment #, Street name, Sector/Block, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Other City">Other Nationwide City</option>
                </select>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900">
                  Select Payment Method
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'COD'
                        ? 'border-botanical-600 bg-botanical-50/60 ring-2 ring-botanical-400/30'
                        : 'border-cream-300 bg-cream-50/30 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="mt-1 text-botanical-600 focus:ring-botanical-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-botanical-700" />
                        <span className="font-bold text-xs text-botanical-950">Cash On Delivery</span>
                      </div>
                      <p className="text-[11px] text-botanical-700/80 mt-1">
                        Pay cash directly to courier rider upon delivery.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'Direct Transfer'
                        ? 'border-botanical-600 bg-botanical-50/60 ring-2 ring-botanical-400/30'
                        : 'border-cream-300 bg-cream-50/30 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Direct Transfer"
                      checked={formData.paymentMethod === 'Direct Transfer'}
                      onChange={handleChange}
                      className="mt-1 text-botanical-600 focus:ring-botanical-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-botanical-700" />
                        <span className="font-bold text-xs text-botanical-950">Bank / JazzCash / Nayapay</span>
                      </div>
                      <p className="text-[11px] text-botanical-700/80 mt-1">
                        Direct account transfer receipt confirmation.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-botanical-900 mb-2">
                  Special Delivery Instructions <span className="text-botanical-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Call before delivery, deliver in afternoon"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-sm bg-cream-50/50 outline-none transition-all"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-lg shadow-[#748C48]/30 hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 border border-[#62773C] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Confirming Order...' : `Confirm Order • Rs. ${total.toLocaleString()}`}</span>
              </button>
            </form>
          </div>

          {/* Right: Cart Summary Review */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif font-bold text-xl text-botanical-950 pb-4 border-b border-cream-200">
              Order Review ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
            </h2>

            <div className="divide-y divide-cream-100 max-h-72 overflow-y-auto pr-1 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-center p-1 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-botanical-950 truncate">
                      {item.product.name}
                    </h4>

                    {/* Interactive Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="inline-flex items-center border border-cream-300 rounded-lg bg-cream-50/70 p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.product.id, item.quantity - 1);
                            } else {
                              removeFromCart(item.product.id);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white text-botanical-800 hover:text-botanical-950 transition-colors cursor-pointer"
                          title="Decrease Quantity"
                          aria-label="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-botanical-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white text-botanical-800 hover:text-botanical-950 transition-colors cursor-pointer"
                          title="Increase Quantity"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-botanical-600 font-mono">
                        @ Rs. {item.product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-xs text-botanical-950 shrink-0">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-botanical-700">
                <span>Items Subtotal</span>
                <span className="font-bold text-botanical-950">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-botanical-700">
                <span>Shipping Fee</span>
                <span className={isFreeDelivery ? 'text-botanical-700 font-bold' : 'font-semibold'}>
                  {isFreeDelivery ? 'FREE (Over Rs. 3,000)' : 'Rs. 150'}
                </span>
              </div>
              <div className="pt-2 border-t border-cream-200 flex justify-between items-baseline text-sm font-serif font-bold text-botanical-950">
                <span>Total Amount Due</span>
                <span className="text-xl text-botanical-950 font-sans font-bold">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 space-y-2 text-[11px] text-botanical-700">
              <div className="flex items-center gap-2 text-botanical-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-botanical-600" />
                <span>Tibra Natural Authenticity Guarantee</span>
              </div>
              <p>
                Each bottle arrives factory sealed in amber glass with security mark and batch registration.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-botanical-600/80 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-botanical-600" />
              <span>Official Tibra Natural Brand Checkout</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
