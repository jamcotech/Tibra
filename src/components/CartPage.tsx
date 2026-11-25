import React from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateItemPrice } from '../services/storeService';

export const CartPage: React.FC = () => {
  const { cart, cartSubtotal, cartDiscount, updateQuantity, removeFromCart, setCurrentView, clearCart, addToCart, navigate } = useShop();

  const shippingFee = cart.length === 0 ? 0 : 200;
  const grandTotal = cartSubtotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 sm:pt-28 pb-12 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-botanical-700 hover:text-botanical-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <span className="text-xs font-mono text-botanical-600 bg-cream-100 px-3 py-1 rounded-full border border-cream-200">
            Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 border border-cream-200 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-20 h-20 rounded-full bg-cream-100 text-botanical-400 flex items-center justify-center mx-auto border border-cream-200">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-botanical-950">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-botanical-700/80 mt-2">
                Experience TIBRA NATURALS Pain Relief Oil — time-tested herbal relief for joints, back, and active living.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase bg-botanical-900 text-cream-50 hover:bg-botanical-950 shadow-md hover:shadow-xl transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="flex items-center justify-between pb-6 border-b border-cream-200">
                  <h1 className="font-serif font-bold text-xl text-botanical-950">
                    Order Summary
                  </h1>
                  <button
                    onClick={clearCart}
                    className="text-xs text-botanical-600 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-cream-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start justify-between">
                      <div className="flex gap-4 items-center sm:items-start w-full sm:w-auto">
                        <div className="w-24 h-24 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {item.quantity === 1 && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          )}
                          {item.quantity === 2 && (
                            <div className="flex items-end justify-center gap-1.5">
                              <img src={item.product.image} alt="Bottle 1" className="h-18 object-contain" />
                              <img src={item.product.image} alt="Bottle 2" className="h-18 object-contain" />
                            </div>
                          )}
                          {item.quantity >= 3 && (
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-end justify-center gap-1.5">
                                <img src={item.product.image} alt="Bottle 1" className="h-14 object-contain" />
                                <img src={item.product.image} alt="Bottle 2" className="h-14 object-contain" />
                              </div>
                              <span className="text-xs font-bold font-mono text-[#748C48] bg-[#748C48]/15 px-2.5 py-0.5 rounded-full leading-none mt-1 border border-[#748C48]/25">
                                +{item.quantity - 2}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tracking-wider uppercase bg-botanical-100 text-botanical-800 px-2.5 py-0.5 rounded font-bold">
                              {item.product.size}
                            </span>
                            {item.product.badge && (
                              <span className="text-[10px] font-mono tracking-wider uppercase bg-gold/15 text-gold-dark px-2.5 py-0.5 rounded font-bold">
                                {item.product.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-botanical-950 leading-snug">
                            {item.product.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-botanical-700/80 max-w-md">
                            {item.product.subtitle}
                          </p>
                          <div className="text-xs sm:text-sm font-bold text-botanical-900 pt-0.5">
                            Rs. {item.product.price.toLocaleString()} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-cream-200 text-botanical-800 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 text-sm font-bold font-mono text-botanical-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-cream-200 text-botanical-800 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Line Total with automatic duo pricing */}
                        {(() => {
                          const calc = calculateItemPrice(item.product, item.quantity);
                          return (
                            <div className="text-right min-w-[110px]">
                              <div className="font-serif font-bold text-base sm:text-lg text-botanical-950">
                                Rs. {calc.total.toLocaleString()}
                              </div>
                              {calc.regularTotal > calc.total && (
                                <div className="space-y-0.5 mt-0.5">
                                  <span className="text-[11px] text-stone-400 line-through font-mono block">
                                    Rs. {calc.regularTotal.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#748C48] bg-[#748C48]/10 border border-[#748C48]/30 px-1.5 py-0.5 rounded-full inline-block">
                                    {calc.isDuoApplied
                                      ? `Save ${calc.percentOff}% (Flat Rs. ${calc.discount.toLocaleString()} OFF)`
                                      : 'Save 25% (Flat Rs. 490 OFF)'}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-xs text-botanical-400 hover:text-red-600 transition-colors mt-1 inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Trust Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-cream-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-botanical-600 shrink-0" />
                  <span className="text-xs text-botanical-900 font-semibold">100% Herbal Authentic</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-cream-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-botanical-600 shrink-0" />
                  <span className="text-xs text-botanical-900 font-semibold">Cash On Delivery (COD)</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-cream-200 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-xs text-botanical-900 font-semibold">Fast Nationwide Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 space-y-4 sticky top-28">

              {/* Special Duo Offer Card (Buy 2 for Rs. 2,600) */}
              {!cart.some(i => i.product.id.includes('bundle')) && (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-[#748C48]/15 via-gold/15 to-[#748C48]/15 border border-[#748C48]/40 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🔥</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#748C48] text-white px-2 py-0.5 rounded-full">Duo Offer</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">Save 35%</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-botanical-950 mt-1">Buy 2 Bottles for Rs. 2,600 Only!</h4>
                      <p className="text-xs text-botanical-700 mt-0.5">Regular: <span className="line-through text-stone-400 font-mono">Rs. 3,980</span> (Flat Rs. 1,380 Discount)</p>
                      <button
                        type="button"
                        onClick={() => {
                          const duo = {
                            id: 'tibra-natural-joint-oil-bundle-2',
                            name: 'TIBRA NATURALS Joint Oil (Duo Pack of 2)',
                            price: 2600,
                            originalPrice: 3980,
                            image: '/assets/purefix-bottle-box-showcase.jpg'
                          };
                          clearCart();
                          addToCart(duo as any, 1);
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-xs cursor-pointer"
                      >
                        <span>Upgrade to 2-Bottle Pack (Rs. 2,600)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-6 sm:p-8 space-y-6">
              <h2 className="font-serif font-bold text-lg text-botanical-950 pb-4 border-b border-cream-200">
                Cart Total
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-botanical-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-botanical-950">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-botanical-700">
                  <span>Nationwide Shipping</span>
                  <span className="font-bold text-botanical-950 font-mono">
                    Rs. 200
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#748C48] font-bold text-xs bg-[#748C48]/10 px-3 py-2 rounded-xl border border-[#748C48]/30">
                    <span>Total Savings Applied</span>
                    <span className="font-mono">Save Rs. {cartDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-lg text-botanical-950">Grand Total</span>
                  <span className="font-serif font-bold text-2xl text-botanical-950">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-lg shadow-[#748C48]/30 hover:shadow-xl border border-[#62773C] group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[11px] text-botanical-600/80">
                Taxes and verified packaging included. Official dispatch guarantee.
              </p>
            </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
