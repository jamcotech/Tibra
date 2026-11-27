import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateItemPrice, calculateCartTotal, storeService } from '../services/storeService';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    addToCart,
    navigate
  } = useShop();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pricing = storeService.getPricingConfig();
  const cartSummary = calculateCartTotal(cart, pricing);
  const shippingFee = cartSummary.shippingFee;
  const estimatedTotal = cartSummary.grandTotal;

  // Background Scroll Lock & Keyboard Escape Support
  useEffect(() => {
    if (!isCartDrawerOpen) return;

    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // Keyboard support: Escape closes cart drawer
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const showComboOffer =
    cart.length > 0 &&
    !cart.some(
      (i) =>
        i.product.id.includes('bundle') ||
        i.product.id.includes('combo') ||
        i.product.id.includes('family')
    );

  const handleUpgradeToCombo = () => {
    const duo = storeService.getProductById('tibra-natural-joint-oil-bundle-2') || {
      id: 'tibra-natural-joint-oil-bundle-2',
      name: pricing.twoBottleCombo.name,
      subtitle: 'Two-Bottle Combo Pack (2x 30ML)',
      size: '30ml x 2',
      price: pricing.twoBottleCombo.packagePrice,
      originalPrice: pricing.twoBottleCombo.originalPrice,
      stock: 100,
      image: '/assets/tibra-naturals-pain-relief-oil-duo-pack.webp',
      description: 'Double strength authentic botanical care',
      sku: pricing.twoBottleCombo.sku || 'TN-PRO-060-DUO'
    };
    // Remove existing single items
    cart.forEach((item) => {
      if (!item.product.id.includes('bundle') && !item.product.id.includes('family')) {
        removeFromCart(item.product.id);
      }
    });
    // Add combo package
    addToCart(duo as any, 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={() => setIsCartDrawerOpen(false)}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* Main Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your TIBRA NATURALS Shopping Cart"
        className="fixed top-0 right-0 z-51 flex flex-col w-full max-w-md sm:max-w-[450px] bg-[#FAF8F5] border-l border-cream-200 shadow-2xl h-screen h-[100dvh] max-h-[100dvh] overflow-hidden"
        style={{
          height: '100dvh',
          maxHeight: '100dvh',
        }}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-5 bg-white border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-botanical-950 leading-tight">
                Your TIBRA NATURALS Cart
              </h2>
              <p className="text-xs text-botanical-600 font-medium">
                {cart.length} unique item{cart.length !== 1 ? 's' : ''} in cart ({cartCount} bottle{cartCount !== 1 ? 's' : ''})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-full text-botanical-600 hover:text-botanical-950 hover:bg-cream-100 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Independently Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-3.5 focus:outline-none"
          style={{
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
          tabIndex={0}
        >
          {/* Nationwide Courier Banner */}
          <div className="bg-[#252E15] text-cream-50 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold-light shrink-0" />
              <span>Fast Doorstep Delivery Across Pakistan</span>
            </span>
            <span className="font-mono text-[10px] text-cream-200 bg-white/10 px-2 py-0.5 rounded font-bold shrink-0">
              {shippingFee === 0 ? 'FREE DELIVERY' : `Rs. ${shippingFee}`}
            </span>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-cream-100 text-botanical-400 flex items-center justify-center border border-cream-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-botanical-950">Your cart is empty</h3>
                <p className="text-xs text-botanical-700/80 max-w-xs mt-1 leading-relaxed">
                  Discover TIBRA NATURALS Pain Relief Oil — 100% natural herbal relief for joints, back, and active living.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#748C48] text-white hover:bg-[#5F7339] shadow-sm cursor-pointer transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const calc = calculateItemPrice(item.product, item.quantity, pricing);

                return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-cream-200/90 shadow-2xs flex gap-3 sm:gap-3.5 items-start transition-all"
                  >
                    {/* Product Image Container */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-cream-50 border border-cream-200/90 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        width={88}
                        height={88}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute bottom-1 right-1 bg-[#252E15] text-cream-50 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs leading-none">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>

                    {/* Product Details Container */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <h3 className="font-serif font-bold text-sm text-botanical-950 leading-snug line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-botanical-400 hover:text-red-600 transition-colors p-1 -mt-0.5 -mr-1 rounded-lg hover:bg-red-50 shrink-0 cursor-pointer"
                            title="Remove item"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[11px] font-mono text-botanical-600 bg-cream-100/90 px-2 py-0.5 rounded font-medium">
                            {item.product.size || '30 ML'}
                          </span>
                          {item.product.bundleOffer && (
                            <span className="text-[10px] font-semibold text-gold-dark bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {item.product.bundleOffer}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="flex items-end justify-between gap-2 mt-3 pt-2 border-t border-cream-100">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50 overflow-hidden shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 sm:p-1.5 hover:bg-cream-200 text-botanical-800 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono text-botanical-950 min-w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 sm:p-1.5 hover:bg-cream-200 text-botanical-800 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-bold font-mono text-botanical-950">
                            Rs. {calc.total.toLocaleString()}
                          </div>
                          {calc.regularTotal > calc.total && (
                            <div className="flex flex-col items-end gap-0.5 mt-0.5">
                              <span className="text-[10px] text-stone-400 line-through font-mono">
                                Rs. {calc.regularTotal.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-bold text-[#748C48] bg-[#748C48]/10 px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
                                Save {calc.percentOff}% (Rs. {calc.discount.toLocaleString()} OFF)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Duo Bundle Suggestion Banner (Inside the scrollable area) */}
          {showComboOffer && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white via-cream-50 to-emerald-50/40 border border-[#748C48]/35 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#748C48]/15 text-[#252E15] flex items-center justify-center shrink-0 text-lg">
                  🔥
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#748C48] text-white px-2 py-0.5 rounded-full">
                      Duo Offer
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-200">
                      Save {pricing.twoBottleCombo.originalPrice > pricing.twoBottleCombo.packagePrice ? Math.round(((pricing.twoBottleCombo.originalPrice - pricing.twoBottleCombo.packagePrice) / pricing.twoBottleCombo.originalPrice) * 100) : 35}%
                    </span>
                    <span className="text-[10px] font-bold text-[#748C48] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Free Delivery
                    </span>
                  </div>
                  <p className="text-xs font-bold text-botanical-950 mt-1.5 leading-snug">
                    Upgrade to 2 Bottles for Rs. {pricing.twoBottleCombo.packagePrice.toLocaleString()} Only!
                  </p>
                  <p className="text-[11px] text-botanical-700 mt-0.5">
                    Regular: <span className="line-through text-stone-400 font-mono">Rs. {pricing.twoBottleCombo.originalPrice.toLocaleString()}</span> • Flat Rs. {(pricing.twoBottleCombo.originalPrice - pricing.twoBottleCombo.packagePrice).toLocaleString()} OFF
                  </p>
                  <button
                    type="button"
                    onClick={handleUpgradeToCombo}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <span>Upgrade to 2-Pack (Rs. {pricing.twoBottleCombo.packagePrice.toLocaleString()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 bg-white border-t border-cream-200 p-4 sm:p-5 space-y-3 shadow-[0_-4px_16px_rgba(37,46,21,0.06)]">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-botanical-700">
                <span>Subtotal</span>
                <span className="font-bold text-botanical-950 font-mono">Rs. {cartSubtotal.toLocaleString()}</span>
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

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('checkout');
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-md shadow-[#748C48]/30 hover:shadow-xl border border-[#62773C] group cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('cart');
                }}
                className="w-full text-center py-1.5 text-xs font-semibold text-botanical-700 hover:text-botanical-950 cursor-pointer"
              >
                View Full Cart Page
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-botanical-600/80 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-botanical-600 shrink-0" />
              <span>100% Secure Checkout • Cash on Delivery Available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
