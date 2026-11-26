import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateItemPrice, calculateCartTotal, storeService } from '../services/storeService';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    addToCart,
    navigate
  } = useShop();

  const pricing = storeService.getPricingConfig();
  const cartSummary = calculateCartTotal(cart, pricing);
  const shippingFee = cartSummary.shippingFee;
  const estimatedTotal = cartSummary.grandTotal;

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-cream-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-botanical-950">
                  Your TIBRA NATURALS Cart
                </h3>
                <p className="text-xs text-botanical-600 font-medium">
                  {cart.length} unique item{cart.length !== 1 ? 's' : ''} in cart
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full text-botanical-600 hover:text-botanical-950 hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nationwide Courier Banner */}
          <div className="bg-[#252E15] text-cream-50 px-4 py-2.5 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span>Fast Doorstep Delivery Across Pakistan</span>
            </span>
            <span className="font-mono text-[10px] text-cream-200 bg-white/10 px-2 py-0.5 rounded">
              {shippingFee === 0 ? 'FREE DELIVERY' : `Rs. ${shippingFee}`}
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-cream-100 text-botanical-400 flex items-center justify-center border border-cream-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-botanical-950">Your cart is empty</h4>
                  <p className="text-xs text-botanical-700/80 max-w-xs mt-1">
                    Discover TIBRA NATURALS Pain Relief Oil 100% natural herbal relief for joints, back, and active living.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-botanical-900 text-cream-50 hover:bg-botanical-950 shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-4 border border-cream-200/90 shadow-2xs flex gap-3.5 items-center"
                >
                  <div className="w-20 h-20 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    {item.quantity === 1 && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    )}
                    {item.quantity === 2 && (
                      <div className="flex items-end justify-center gap-1">
                        <img src={item.product.image} alt="Bottle 1" width={40} height={56} loading="lazy" className="h-14 object-contain" />
                        <img src={item.product.image} alt="Bottle 2" width={40} height={56} loading="lazy" className="h-14 object-contain" />
                      </div>
                    )}
                    {item.quantity >= 3 && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-end justify-center gap-1">
                          <img src={item.product.image} alt="Bottle 1" width={32} height={44} loading="lazy" className="h-11 object-contain" />
                          <img src={item.product.image} alt="Bottle 2" width={32} height={44} loading="lazy" className="h-11 object-contain" />
                        </div>
                        <span className="text-[10px] font-bold font-mono text-[#748C48] bg-[#748C48]/15 px-2 py-0.5 rounded-full leading-none mt-1 border border-[#748C48]/25">
                          +{item.quantity - 2}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-sm text-botanical-950 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-botanical-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-botanical-600 bg-cream-100 px-2 py-0.5 rounded">
                        {item.product.size}
                      </span>
                      {item.product.bundleOffer && (
                        <span className="text-[10px] font-semibold text-gold-dark">
                          {item.product.bundleOffer}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-cream-200 text-botanical-800 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono text-botanical-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-cream-200 text-botanical-800 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price with Automatic Duo Calculation */}
                      {(() => {
                        const calc = calculateItemPrice(item.product, item.quantity);
                        return (
                          <div className="text-right">
                            <div className="text-sm font-bold text-botanical-950">
                              Rs. {calc.total.toLocaleString()}
                            </div>
                            {calc.regularTotal > calc.total && (
                              <div className="space-y-0.5 mt-0.5">
                                <div className="text-[10px] text-stone-400 line-through font-mono">
                                  Rs. {calc.regularTotal.toLocaleString()}
                                </div>
                                <span className="text-[9px] font-bold text-[#748C48] bg-[#748C48]/10 px-1.5 py-0.5 rounded-full inline-block">
                                  {calc.isDuoApplied
                                    ? `Save ${calc.percentOff}% (Flat Rs. ${calc.discount.toLocaleString()} OFF)`
                                    : 'Save 25% (Flat Rs. 490 OFF)'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Duo Bundle Suggestion Banner if cart does not have duo pack */}
          {cart.length > 0 && !cart.some(i => i.product.id.includes('bundle')) && (
            <div className="mx-4 mt-2 p-3 rounded-2xl bg-gradient-to-r from-[#748C48]/15 via-gold/15 to-[#748C48]/15 border border-[#748C48]/40 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <span className="text-base">🔥</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#748C48] text-white px-2 py-0.5 rounded-full">Duo Offer</span>
                    <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">Save 35%</span>
                  </div>
                  <p className="text-xs font-bold text-botanical-950 mt-1">Buy 2 Bottles for Rs. {pricing.twoBottleCombo.packagePrice.toLocaleString()} Only!</p>
                  <p className="text-[10px] text-botanical-700">Regular: <span className="line-through text-stone-400 font-mono">Rs. {pricing.twoBottleCombo.originalPrice.toLocaleString()}</span></p>
                  <button
                    type="button"
                    onClick={() => {
                      const duo = {
                        id: 'tibra-natural-joint-oil-bundle-2',
                        name: 'TIBRA NATURALS Joint Oil (Duo Pack of 2)',
                        price: pricing.twoBottleCombo.packagePrice,
                        originalPrice: pricing.twoBottleCombo.originalPrice,
                        image: '/assets/tibra-naturals-pain-relief-oil-duo-pack.webp'
                      };
                      removeFromCart(cart[0].product.id);
                      addToCart(duo as any, 1);
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-xs cursor-pointer"
                  >
                    <span>Upgrade to 2-Pack (Rs. {pricing.twoBottleCombo.packagePrice.toLocaleString()})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-cream-200 space-y-3 sm:space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-botanical-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-botanical-950">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-botanical-700">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-botanical-950 font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-[#748C48] font-bold">FREE (Delivery Included)</span>
                    ) : (
                      `Rs. ${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-botanical-950 pt-2 border-t border-cream-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-botanical-900 font-mono font-bold">
                    Rs. {estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-md shadow-[#748C48]/30 hover:shadow-xl border border-[#62773C] group cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('cart');
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-botanical-700 hover:text-botanical-950"
                >
                  View Full Cart Page
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-botanical-600/80 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-botanical-600" />
                <span>100% Secure Checkout • Cash on Delivery Available</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
