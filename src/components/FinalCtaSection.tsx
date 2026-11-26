import React, { useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Leaf, Pipette, Flame, Droplets, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

interface FinalCtaSectionProps {
  onOpenOrderModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = () => {
  const { addToCart, quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Defer video loading until section is scrolled into proximity (saves 3.5MB on initial load)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '300px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.playbackRate = 0.85;
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoadVideo]);

  const commitments = [
    { text: '100% Natural Herbal Blend', icon: Leaf },
    { text: 'Precision Glass Dropper Bottle', icon: Pipette },
    { text: 'Turmeric & Ginger Active Extracts', icon: Flame },
    { text: 'Fast, Non-Greasy Dermal Absorption', icon: Droplets },
  ];

  return (
    <section ref={containerRef} className="relative py-20 lg:py-28 bg-[#F5F0E6] overflow-hidden border-t border-cream-300/80">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-botanical-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-grain pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-cream-200/90 shadow-luxury p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Lightweight Video Showcase with Feathered / Blurred Edges */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-square flex items-center justify-center overflow-hidden rounded-3xl bg-cream-50/50">
                {/* Ambient backing glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-botanical-500/20 via-gold/15 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Hardware-Accelerated Native Video (Lazy loaded on scroll) */}
                {shouldLoadVideo ? (
                  <video
                    ref={videoRef}
                    src="/assets/video-for-knee.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
                    style={{
                      WebkitMaskImage:
                        'radial-gradient(ellipse 84% 84% at 50% 50%, black 50%, rgba(0,0,0,0.85) 70%, transparent 100%)',
                      maskImage:
                        'radial-gradient(ellipse 84% 84% at 50% 50%, black 50%, rgba(0,0,0,0.85) 70%, transparent 100%)',
                    }}
                  />
                ) : (
                  <img
                    src="/assets/purefix-bottle-box-showcase.webp"
                    alt="TIBRA NATURALS Pain Relief Oil Botanical Formulation"
                    width={400}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover select-none pointer-events-none opacity-85"
                  />
                )}

                {/* Soft Edge Blur Vignette Overlays — completely melts edges into white card */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 55px 30px #ffffff',
                  }}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/70 via-transparent to-white/75" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/60 via-transparent to-white/60" />
              </div>
            </div>

            {/* Right Column: Narrative & Order Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100 text-botanical-900 text-[11px] font-semibold uppercase tracking-wider border border-botanical-200/80 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-botanical-700" />
                <span>Pure Botanical Potency</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
                  Engineered for Swift Relief.
                  <span className="block text-botanical-600 font-serif italic font-normal">
                    Pure Botanicals in Motion.
                  </span>
                </h2>
                <p className="text-xs font-semibold tracking-widest uppercase text-gold-dark">
                  TIBRA NATURALS Pain Relief Oil • 100% Herbal Active Formulation
                </p>
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] text-botanical-800/80 leading-relaxed font-normal">
                Experience the transformative power of nature. TIBRA NATURALS combines time-tested cold-extracted herbal botanicals specifically calibrated to absorb fast, soothe stiff joints, and restore effortless daily mobility in Pakistan.
              </p>

              {/* Verified Key Commitments with Luxury Icon Container Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {commitments.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] text-botanical-900 font-medium p-2 rounded-xl bg-cream-50/70 border border-cream-200/60">
                      <div className="w-7 h-7 rounded-lg bg-botanical-100 text-botanical-800 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                      </div>
                      <span>{c.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Primary Call to Action Button */}
              <div className="pt-3 flex flex-row flex-wrap items-center gap-2 sm:gap-3 w-full">
                <button
                  type="button"
                  onClick={() => quickBuyNow(primaryProduct)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/25 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 border border-[#62773C] group cursor-pointer whitespace-nowrap"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                  <span>Buy Now</span>
                  <ArrowRight className="hidden sm:inline w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => addToCart(primaryProduct)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-white text-botanical-950 border border-[#748C48]/40 hover:border-[#748C48] hover:bg-cream-50 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#748C48] shrink-0" />
                  <span>Add to Cart</span>
                </button>

                <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 text-xs text-botanical-700 font-medium sm:pl-1 pt-1 sm:pt-0">
                  <ShieldCheck className="w-4 h-4 text-botanical-600" />
                  <span>Cash on Delivery (COD) Available</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
