import React, { useEffect, useRef } from 'react';
import { ArrowDown, Droplets, Leaf, CheckCircle2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

interface HeroSectionProps {
  onOpenOrderModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToCart, quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];

  /* Feather-light GPU-accelerated video playback at 70% slow-motion with 0% CPU overhead */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const enforcePlaybackRate = () => {
      if (video && video.playbackRate !== 0.7) {
        video.playbackRate = 0.7;
      }
    };

    video.playbackRate = 0.7;
    video.addEventListener('play', enforcePlaybackRate);
    video.addEventListener('ratechange', enforcePlaybackRate);

    return () => {
      video.removeEventListener('play', enforcePlaybackRate);
      video.removeEventListener('ratechange', enforcePlaybackRate);
    };
  }, []);
  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-t1 { animation: fadeSlideUp 0.75s ease-out 0.1s both; }
        .hero-t2 { animation: fadeSlideUp 0.75s ease-out 0.25s both; }
        .hero-t3 { animation: fadeSlideUp 0.75s ease-out 0.40s both; }
        .hero-t4 { animation: fadeSlideUp 0.75s ease-out 0.55s both; }
        .hero-t5 { animation: fadeSlideUp 0.75s ease-out 0.70s both; }
        .hero-t6 { animation: fadeSlideUp 0.75s ease-out 0.85s both; }

        @keyframes orbPulse {
          0%,100% { opacity: 0.18; transform: scale(1); }
          50%     { opacity: 0.32; transform: scale(1.06); }
        }
        .orb-a { animation: orbPulse 5s ease-in-out infinite; }
        .orb-b { animation: orbPulse 6.5s ease-in-out 1.5s infinite; }

        /* Responsive Video Bottle Alignment: Full height starting from top: 0 so video runs directly under the header */
        @media (max-width: 767px) {
          .hero-video-media {
            top: 0 !important;
            left: 50% !important;
            right: auto !important;
            height: 100% !important;
            width: auto !important;
            max-width: none !important;
            transform: translateX(-50%) !important;
            transform-origin: top center !important;
            object-fit: cover !important;
            object-position: top center !important;
            opacity: 0.65 !important;
          }
        }
        @media (min-width: 768px) {
          .hero-video-media {
            right: 0 !important;
            left: auto !important;
            top: 0 !important;
            height: 100% !important;
            width: auto !important;
            max-width: none !important;
            transform: none !important;
            object-fit: cover !important;
            object-position: top right !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* ── FULL-BLEED HARDWARE-ACCELERATED VIDEO (FEATHER-LIGHT) ── */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            className="hero-video-media absolute h-full w-auto max-w-none will-change-transform"
            style={{
              objectFit: 'cover',
            }}
            src="/assets/hero-video-002.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/bottle.png"
          />
        </div>

        {/* ── OVERLAYS — Clean contrast with zero haze, video fully reaches top under navbar ── */}

        {/* 1. Main Gradient: Transparent at top so video flows under header, clean gradient for high text readability */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#FAF8F5]/75 to-[#FAF8F5] md:bg-[linear-gradient(to_right,#FAF8F5_0%,#FAF8F5_28%,rgba(250,248,245,0.80)_50%,rgba(250,248,245,0.15)_72%,transparent_100%)]"
        />

        {/* 2. Soft bottom fade into next section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 80%, rgba(250,248,245,0.95) 100%)',
          }}
        />

        {/* 3. Subtle botanical tint — gives brand warmth */}
        <div className="absolute inset-0 bg-botanical-50/10 pointer-events-none" />

        {/* 4. Fine grain texture */}
        <div className="absolute inset-0 bg-subtle-grain opacity-20 pointer-events-none" />

        {/* ── CONTENT (Fitted & Compact for Screen) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
          <div className="max-w-xl lg:max-w-2xl">

            {/* Badge - Single Line Compact */}
            <div className="hero-t1 mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#748C48]/15 border border-[#748C48]/30 text-[#4B5C2B] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase w-fit max-w-full shadow-xs backdrop-blur-sm whitespace-nowrap overflow-hidden">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#748C48] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#748C48]" />
              </span>
              <span className="shrink-0 font-bold">Tibra Natural — The Herbal Store</span>
              <span className="text-[#748C48] shrink-0">•</span>
              <span className="text-gold-dark font-bold shrink-0">30 ML Bottle</span>
            </div>

            {/* Headline */}
            <div className="hero-t1 mb-4 sm:mb-6 space-y-1">
              <h1 className="text-[22px] xs:text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-botanical-950 tracking-tight leading-[1.12] sm:leading-[1.08]">
                Move Freely.
                <span className="block italic font-normal text-[#748C48] font-serif">
                  Live Better.
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-gold-dark pt-1">
                Natural Relief for Active Living
              </p>
            </div>

            {/* Body copy */}
            <p className="hero-t2 mb-5 text-xs sm:text-sm text-botanical-800/85 max-w-lg leading-relaxed">
              Discover <span className="font-semibold text-botanical-950">Tibra Natural Joint Oil</span> — a 100% natural herbal blend for joint comfort, muscle relaxation, and everyday mobility.
            </p>

            {/* Trust pills */}
            <div className="hero-t3 mb-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 border-t border-cream-200/70">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-botanical-900">
                <CheckCircle2 className="w-4 h-4 text-[#748C48] shrink-0" />
                <span>100% Natural Herbal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-botanical-900">
                <Leaf className="w-4 h-4 text-[#748C48] shrink-0" />
                <span>Botanical Extracts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-botanical-900">
                <Droplets className="w-4 h-4 text-gold shrink-0" />
                <span>30 ML Amber Dropper</span>
              </div>
            </div>

            {/* CTAs: Side-by-side on Mobile, compact, without Rs. */}
            <div className="hero-t4 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-3.5 mb-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => quickBuyNow(primaryProduct)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white transition-all shadow-md shadow-[#748C48]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border border-[#62773C] group w-full sm:w-auto cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => addToCart(primaryProduct)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase bg-white/95 hover:bg-white text-botanical-950 border border-[#748C48]/35 hover:border-[#748C48] shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 backdrop-blur-sm group w-full sm:w-auto cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#748C48] group-hover:scale-110 transition-transform" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] font-medium text-botanical-700/55 pointer-events-none z-20">
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </section>
    </>
  );
};
