import React from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, setCurrentView, clearCart } = useShop();

  const freeDeliveryThreshold = 3000;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;
  const shippingFee = isFreeDelivery || cart.length === 0 ? 0 : 150;
  const grandTotal = cartSubtotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-20">
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
              <h2 className="font-serif font-bold text-2xl text-botanical-950">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-botanical-700/80 mt-2">
                Experience Tibra Natural Joint Oil — time-tested herbal relief for joints, back, and active living.
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
                  <h1 className="font-serif font-bold text-2xl text-botanical-950">
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
                        <div className="w-24 h-24 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-center p-2 shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
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
                          <h3 className="font-serif font-bold text-lg text-botanical-950">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-botanical-700/80 max-w-md">
                            {item.product.subtitle}
                          </p>
                          <div className="text-sm font-bold text-botanical-900 pt-1">
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

                        {/* Line Total */}
                        <div className="text-right min-w-[100px]">
                          <div className="font-serif font-bold text-lg text-botanical-950">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-botanical-400 hover:text-red-600 transition-colors mt-1 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
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
            <div className="lg:col-span-4 bg-white rounded-3xl border border-cream-200/90 shadow-luxury p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-serif font-bold text-xl text-botanical-950 pb-4 border-b border-cream-200">
                Cart Total
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-botanical-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-botanical-950">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-botanical-700">
                  <span>Nationwide Shipping</span>
                  <span className={isFreeDelivery ? 'text-botanical-700 font-bold' : 'font-medium'}>
                    {isFreeDelivery ? 'FREE (Orders over Rs. 3,000)' : 'Rs. 150'}
                  </span>
                </div>

                <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-lg text-botanical-950">Grand Total</span>
                  <span className="font-serif font-bold text-2xl text-botanical-950">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('checkout')}
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
        )}

      </div>
    </div>
  );
};
