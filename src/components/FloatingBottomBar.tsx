import React, { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const FloatingBottomBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { quickBuyNow, addToCart, products, currentView } = useShop();

  const primaryProduct = products[0] || storeService.getProducts()[0];

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once user scrolls past hero section (~320px)
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show on home view to avoid overlapping checkout or cart pages
  if (currentView !== 'home') {
    return null;
  }

  // Exact frosted glass effect matching Navbar (harmonized logo olive gradient #748C48 + blur)
  const barBgStyle: React.CSSProperties = {
    background:
      'linear-gradient(110deg, rgba(82, 98, 48, 0.70), rgba(58, 71, 35, 0.75), rgba(37, 46, 21, 0.70))',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    border: '1.5px solid rgba(255, 255, 255, 0.45)',
    boxShadow:
      '0 16px 36px -8px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)',
  };

  const handleWhatsAppClick = () => {
    const totalPrice = (primaryProduct ? primaryProduct.price : 1500) * quantity;
    const text = encodeURIComponent(
      `Hello Tibra Natural Team! I want to order Tibra Natural Joint Oil (30 ML Bottle).\n` +
      `Quantity: ${quantity} bottle(s)\n` +
      `Total: Rs. ${totalPrice.toLocaleString()}\n` +
      `Please confirm my order with Cash on Delivery.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      className={`fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none flex justify-center transition-all duration-400 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-24 opacity-0'
      }`}
    >
      <div
        style={barBgStyle}
        className="pointer-events-auto rounded-full p-1 sm:p-1.5 flex items-center gap-1.5 sm:gap-2 max-w-full shadow-2xl transition-all select-none"
      >
        {/* Quantity Stepper ([-] 1 [+]) — Compact size */}
        <div className="flex items-center bg-white/95 rounded-full px-1 py-0.5 border border-white/80 shadow-xs shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-botanical-900 hover:bg-cream-200/80 disabled:opacity-30 transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
          </button>
          <span className="w-4 sm:w-5 text-center text-[11px] sm:text-xs font-bold text-botanical-950 font-mono">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-botanical-900 hover:bg-cream-200/80 transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Add to Cart Button — Pure Icon Only */}
        <button
          type="button"
          onClick={() => addToCart(primaryProduct, quantity)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/95 hover:bg-white text-botanical-950 border border-white/80 shadow-xs hover:shadow transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
          aria-label="Add to cart"
          title="Add to Cart"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-botanical-800" />
        </button>

        {/* Buy Now Button with Soft White Blurred Aura Backdrop */}
        <div className="relative flex items-center shrink-0">
          <div className="absolute inset-0 -m-0.5 rounded-full bg-white/35 blur-[3px] pointer-events-none" />
          <button
            type="button"
            onClick={() => quickBuyNow(primaryProduct, quantity)}
            className="relative z-10 inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 transition-all duration-200 active:scale-95 border border-[#62773C] cursor-pointer whitespace-nowrap"
          >
            <span>Buy Now</span>
          </button>
        </div>

        {/* WhatsApp Circular Button — Aligned directly alongside in same row */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] hover:bg-[#20BA5C] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer border border-white/30"
          aria-label="Order on WhatsApp"
          title="Direct WhatsApp Order"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
