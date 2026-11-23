import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, Truck, CreditCard, Sparkles, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { storeService, calculateItemPrice } from '../services/storeService';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, cartDiscount, clearCart, setCurrentView, setLastCreatedOrder, updateQuantity, removeFromCart, addToCart } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
  const shippingFee = isFreeDelivery ? 0 : 200;
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
        items: cart.map(item => {
          const calc = calculateItemPrice(item.product, item.quantity);
          return {
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: Math.round(calc.total / item.quantity),
            image: item.product.image
          };
        }),
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
    <div className="min-h-screen bg-[#FAF8F5] pt-20 sm:pt-28 pb-12 sm:pb-24">
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
              <h1 className="font-serif font-bold text-2xl text-botanical-950">
                Delivery Details
              </h1>
              <p className="text-xs text-botanical-700/80 mt-1">
                Enter your genuine delivery information to receive your order within 24-48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                    Email Address <span className="text-botanical-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tariq@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="House / Apartment #, Street name, Sector/Block, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all shadow-2xs"
                >
                  <optgroup label="Federal Capital">
                    <option value="Islamabad">Islamabad</option>
                  </optgroup>
                  <optgroup label="Punjab">
                    <option value="Lahore">Lahore</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Multan">Multan</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Sargodha">Sargodha</option>
                    <option value="Bahawalpur">Bahawalpur</option>
                    <option value="Sahiwal">Sahiwal</option>
                    <option value="Gujrat">Gujrat</option>
                    <option value="Kasur">Kasur</option>
                    <option value="Jhelum">Jhelum</option>
                    <option value="Sheikhupura">Sheikhupura</option>
                    <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                    <option value="Okara">Okara</option>
                    <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                    <option value="Mianwali">Mianwali</option>
                    <option value="Attock">Attock</option>
                    <option value="Chakwal">Chakwal</option>
                    <option value="Jhang">Jhang</option>
                    <option value="Toba Tek Singh">Toba Tek Singh</option>
                    <option value="Hafizabad">Hafizabad</option>
                    <option value="Khanewal">Khanewal</option>
                    <option value="Vehari">Vehari</option>
                    <option value="Muzaffargarh">Muzaffargarh</option>
                    <option value="Mandi Bahauddin">Mandi Bahauddin</option>
                    <option value="Bahawalnagar">Bahawalnagar</option>
                    <option value="Murree">Murree</option>
                  </optgroup>
                  <optgroup label="Sindh">
                    <option value="Karachi">Karachi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Sukkur">Sukkur</option>
                    <option value="Larkana">Larkana</option>
                    <option value="Nawabshah">Nawabshah (Shaheed Benazirabad)</option>
                    <option value="Mirpur Khas">Mirpur Khas</option>
                    <option value="Jacobabad">Jacobabad</option>
                    <option value="Shikarpur">Shikarpur</option>
                    <option value="Khairpur">Khairpur</option>
                    <option value="Thatta">Thatta</option>
                    <option value="Badin">Badin</option>
                    <option value="Dadu">Dadu</option>
                    <option value="Tando Adam">Tando Adam</option>
                    <option value="Ghotki">Ghotki</option>
                    <option value="Kotri">Kotri</option>
                  </optgroup>
                  <optgroup label="Khyber Pakhtunkhwa (Sarhad)">
                    <option value="Peshawar">Peshawar</option>
                    <option value="Mardan">Mardan</option>
                    <option value="Abbottabad">Abbottabad</option>
                    <option value="Swat">Swat / Mingora</option>
                    <option value="Kohat">Kohat</option>
                    <option value="Dera Ismail Khan">Dera Ismail Khan</option>
                    <option value="Haripur">Haripur</option>
                    <option value="Bannu">Bannu</option>
                    <option value="Nowshera">Nowshera</option>
                    <option value="Charsadda">Charsadda</option>
                    <option value="Mansehra">Mansehra</option>
                    <option value="Swabi">Swabi</option>
                    <option value="Malakand">Malakand</option>
                    <option value="Chitral">Chitral</option>
                  </optgroup>
                  <optgroup label="Balochistan">
                    <option value="Quetta">Quetta</option>
                    <option value="Gwadar">Gwadar</option>
                    <option value="Turbat">Turbat</option>
                    <option value="Khuzdar">Khuzdar</option>
                    <option value="Sibi">Sibi</option>
                    <option value="Hub">Hub</option>
                    <option value="Chaman">Chaman</option>
                    <option value="Zhob">Zhob</option>
                    <option value="Loralai">Loralai</option>
                    <option value="Dera Murad Jamali">Dera Murad Jamali</option>
                    <option value="Kalat">Kalat</option>
                  </optgroup>
                  <optgroup label="Gilgit-Baltistan">
                    <option value="Gilgit">Gilgit</option>
                    <option value="Skardu">Skardu</option>
                    <option value="Hunza">Hunza</option>
                    <option value="Diamer">Diamer</option>
                    <option value="Ghizer">Ghizer</option>
                    <option value="Astore">Astore</option>
                  </optgroup>
                  <optgroup label="Azad Jammu & Kashmir (AJK)">
                    <option value="Muzaffarabad">Muzaffarabad</option>
                    <option value="Mirpur AJK">Mirpur (AJK)</option>
                    <option value="Rawalakot">Rawalakot</option>
                    <option value="Kotli">Kotli</option>
                    <option value="Bhimber">Bhimber</option>
                    <option value="Bagh">Bagh</option>
                  </optgroup>
                  <optgroup label="Other Locations">
                    <option value="Other City">Other Nationwide City</option>
                  </optgroup>
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-botanical-900 mb-1">
                  Special Delivery Instructions <span className="text-botanical-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Call before delivery, deliver in afternoon"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-cream-300 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 text-xs sm:text-sm bg-cream-50/50 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                />
              </div>

              {/* Submit CTA — Compact and Refined */}
              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-md shadow-[#748C48]/25 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 border border-[#62773C] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>{isSubmitting ? 'Confirming Order...' : `Confirm Order • Rs. ${total.toLocaleString()}`}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Cart Summary Review */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-5 sm:p-7 space-y-5 sticky top-28">
            
            {/* Special Duo Offer Card (Buy 2 for Rs. 2,500) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#748C48]/15 via-gold/15 to-[#748C48]/15 border border-[#748C48]/40 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#748C48] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#F5E6A3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#748C48] text-white px-2 py-0.5 rounded-full">
                      🔥 Special Duo Offer
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded-full">
                      Save 37% (Flat Rs. 1,480 OFF)
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-botanical-950 mt-1">
                    Buy 2 Bottles for Rs. 2,500 Only!
                  </h4>
                  <p className="text-[11px] text-botanical-800/85 mt-0.5 leading-snug">
                    Regular: <span className="line-through text-stone-400 font-mono">Rs. 3,980</span> • Continuous 60-Day Mobility Relief.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const duoProduct = storeService.getProducts().find(p => p.id === 'tibra-natural-joint-oil-bundle-2') || {
                        id: 'tibra-natural-joint-oil-bundle-2',
                        name: 'Tibra Natural Joint Oil (Duo Pack of 2)',
                        price: 2500,
                        originalPrice: 3980,
                        image: '/assets/purefix-bottle-box-showcase.jpg'
                      };
                      clearCart();
                      addToCart(duoProduct as any, 1);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Upgrade to 2-Bottle Pack (Rs. 2,500)</span>
                  </button>
                </div>
              </div>
            </div>

            <h2 className="font-serif font-bold text-base sm:text-lg text-botanical-950 pb-3 border-b border-cream-200">
              Order Review ({cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''})
            </h2>

            <div className="divide-y divide-cream-100 max-h-72 overflow-y-auto pr-1 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-center p-1 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Full Name without cut-off */}
                    <h4 className="font-serif font-bold text-xs text-botanical-950 break-words leading-snug">
                      {item.product.name}
                    </h4>

                    {/* Quantity Stepper — collision free */}
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
                        <span className="w-5 text-center font-mono font-bold text-xs text-botanical-950">
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
                    </div>
                  </div>

                  {/* Clean Price on Right with Automatic Duo Calculation */}
                  {(() => {
                    const calc = calculateItemPrice(item.product, item.quantity);
                    return (
                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs text-botanical-950">
                          Rs. {calc.total.toLocaleString()}
                        </div>
                        {calc.isDuoApplied ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-stone-400 line-through font-mono block">
                              Rs. {calc.regularTotal.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-bold text-[#748C48] bg-[#748C48]/10 px-1 py-0.2 rounded inline-block">
                              Duo Offer Applied!
                            </span>
                          </div>
                        ) : item.product.originalPrice ? (
                          <div className="text-[10px] text-stone-400 line-through font-mono">
                            Rs. {(item.product.originalPrice * item.quantity).toLocaleString()}
                          </div>
                        ) : null}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-botanical-700">
                <span>Items Subtotal</span>
                <span className="font-bold text-botanical-950">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Duo Offer Savings</span>
                  <span className="font-bold">-Rs. {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-botanical-700">
                <span>Shipping Fee</span>
                <span className={isFreeDelivery ? 'text-botanical-700 font-bold' : 'font-semibold'}>
                  {isFreeDelivery ? 'FREE (Over Rs. 3,000)' : 'Rs. 200'}
                </span>
              </div>
              <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs sm:text-sm font-serif font-bold text-botanical-950">
                <span>Total Amount Due</span>
                <span className="text-sm sm:text-base text-botanical-950 font-sans font-bold">
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
