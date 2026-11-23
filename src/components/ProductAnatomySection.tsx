import React, { useState } from 'react';
import { Pipette, SunDim, Leaf, Compass, ShieldCheck, Check, Droplets, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const ProductAnatomySection: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<number>(0);
  const { quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];

  const anatomyPoints = [
    {
      id: 0,
      title: 'Precision Gold Dropper Cap',
      tag: 'Controlled Dispense',
      icon: Pipette,
      color: 'from-amber-500/20 to-gold/20 text-gold-dark',
      desc: 'Crafted with a metallic gold screw collar and soft silicone bulb, delivering exact single-drop dispensing without mess or product wastage.',
      detail: 'Allows targeted application directly to knees, shoulders, neck, or lower back.'
    },
    {
      id: 1,
      title: 'Amber UV-Protective Glass',
      tag: 'Extract Preservation',
      icon: SunDim,
      color: 'from-amber-600/20 to-botanical-800/10 text-amber-800',
      desc: 'Heavy-base amber glass shields the delicate botanical phytonutrients and volatile plant oils against harmful light and oxidation.',
      detail: 'Ensures potency and botanical stability throughout the entire 30 ML lifecycle.'
    },
    {
      id: 2,
      title: '100% Natural Herbal Blend',
      tag: 'Verified Formulation',
      icon: Leaf,
      color: 'from-botanical-500/20 to-botanical-800/20 text-botanical-700',
      desc: 'A pure infusion of traditional roots and leaves, formulated without synthetic fragrance, parabens, or artificial mineral fillers.',
      detail: 'Natural golden hue and warming herbal aroma derived solely from pure plant extracts.'
    },
    {
      id: 3,
      title: '30 ML Optimal Volume',
      tag: 'Concentrated Ritual',
      icon: Droplets,
      color: 'from-gold/20 to-botanical-600/20 text-botanical-900',
      desc: 'High concentration formula where just 3 to 5 drops per area deliver soothing warming massage relief.',
      detail: 'Compact bottle fits comfortably into daily routines, work desks, travel bags, and gym kits.'
    }
  ];

  return (
    <section id="anatomy" className="relative py-24 lg:py-32 bg-[#F5F0E6]/60 border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Hidden on mobile per user request */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 hidden md:block">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200 text-botanical-800 text-xs font-semibold uppercase tracking-wider border border-cream-300/80 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-botanical-600 stroke-[1.75]" />
            <span>Product Anatomy & Craftsmanship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-botanical-950">
            Engineered by Nature.
            <span className="block text-[#748C48] font-serif italic font-normal">
              Refined by Design.
            </span>
          </h2>
          <p className="text-base text-botanical-800/80">
            Every element of the Tibra Natural Joint Oil packaging is selected to protect the botanical integrity and make daily application seamless.
          </p>
        </div>

        {/* Interactive Anatomy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Hotspot Selectors (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 space-y-4">
            {anatomyPoints.map((point, index) => {
              const Icon = point.icon;
              const isActive = activeHotspot === index;
              return (
                <div
                  key={point.id}
                  onClick={() => setActiveHotspot(index)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-white shadow-luxury border-[#748C48] ring-1 ring-[#748C48]/30 translate-x-2'
                      : 'bg-white/50 hover:bg-white/80 border-cream-200/80 hover:border-[#748C48]/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Consistent Luxury Icon Container */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#748C48] text-white shadow-sm scale-105'
                          : 'bg-cream-100 text-[#5F7339]'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-base text-botanical-950">
                          {point.title}
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-botanical-600 bg-botanical-50 px-2 py-0.5 rounded-full border border-botanical-100 font-semibold">
                          {point.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-botanical-800/80 mt-1 leading-relaxed">
                        {point.desc}
                      </p>
                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-cream-100 flex items-center gap-2 text-xs text-botanical-700 font-medium animate-fadeIn">
                          <Check className="w-3.5 h-3.5 text-botanical-600 shrink-0" />
                          <span>{point.detail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Product Anatomy Stage */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="w-full max-w-lg relative bg-gradient-to-b from-white/90 to-cream-100/70 p-8 sm:p-12 rounded-3xl border border-white shadow-luxury backdrop-blur-md">
              
              {/* Center Bottle Graphic with Realistic Ground Shadow */}
              <div className="relative flex flex-col justify-center items-center pt-6 pb-2">
                <div className="relative flex justify-center items-center">
                  <img
                    src="/assets/purefix-bottle-004-transparent.png"
                    alt="Tibra Natural Joint Oil Anatomy"
                    className="relative z-10 max-h-[460px] w-auto object-contain drop-shadow-[0_22px_36px_rgba(20,56,35,0.26)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition-transform duration-500 hover:scale-102"
                  />

                  {/* Dynamic Callout based on active tab with Icon (Hidden on mobile per user request) */}
                  <div
                    className={`hidden md:block absolute z-30 transition-all duration-500 ${
                      activeHotspot === 0
                        ? 'top-8 right-2 sm:right-6'
                        : activeHotspot === 1
                        ? 'bottom-20 left-2 sm:left-4'
                        : activeHotspot === 2
                        ? 'bottom-32 right-2 sm:right-6'
                        : 'top-32 left-2 sm:left-4'
                    }`}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.70)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(21, 44, 25, 0.35)',
                        boxShadow: '0 12px 30px -6px rgba(0, 0, 0, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
                      }}
                      className="px-6 py-3.5 rounded-2xl text-xs min-w-[260px] max-w-[340px] flex items-center gap-4 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-xl bg-botanical-900/10 border border-botanical-900/15 flex items-center justify-center text-botanical-950 shrink-0 shadow-xs">
                        {activeHotspot === 0 && <Pipette className="w-5 h-5 stroke-[2]" />}
                        {activeHotspot === 1 && <SunDim className="w-5 h-5 stroke-[2]" />}
                        {activeHotspot === 2 && <Leaf className="w-5 h-5 stroke-[2]" />}
                        {activeHotspot === 3 && <Droplets className="w-5 h-5 stroke-[2]" />}
                      </div>
                      <div className="flex-1 pr-1">
                        <p className="font-bold text-sm text-[#252E15] tracking-tight leading-snug">
                          {anatomyPoints[activeHotspot].title}
                        </p>
                        <p className="text-[11px] text-[#5F7339] font-semibold mt-0.5">
                          {anatomyPoints[activeHotspot].tag}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Natural Multi-layered Ground & Contact Shadow */}
                <div className="w-full flex flex-col items-center pointer-events-none -mt-4 sm:-mt-5 relative z-0">
                  {/* Tight contact shadow directly under glass base */}
                  <div className="w-36 sm:w-44 h-3 rounded-[100%] bg-botanical-950/45 blur-[3px]" />
                  {/* Soft ambient floor shadow spreading outwards */}
                  <div className="w-52 sm:w-64 h-6 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(21,44,25,0.35)_0%,rgba(21,44,25,0.12)_55%,transparent_75%)] blur-md -mt-2" />
                  {/* Outer subtle glow */}
                  <div className="w-68 sm:w-80 h-7 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(61,129,69,0.12)_0%,transparent_70%)] blur-lg -mt-3.5" />
                </div>
              </div>

              {/* Bottom Quick Spec Bar with Icons & Direct Buy Now */}
              <div className="pt-6 border-t border-cream-200/80 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Droplets className="w-4 h-4 text-botanical-600" />
                    <span className="font-mono text-[10px] text-botanical-500 uppercase">Capacity</span>
                    <span className="font-bold text-botanical-950 text-xs sm:text-sm">30 ML / 1.01 FL OZ</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-cream-200">
                    <Pipette className="w-4 h-4 text-gold-dark" />
                    <span className="font-mono text-[10px] text-botanical-500 uppercase">Dispenser</span>
                    <span className="font-bold text-botanical-950 text-xs sm:text-sm">Glass Dropper</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-botanical-600" />
                    <span className="font-mono text-[10px] text-botanical-500 uppercase">Material</span>
                    <span className="font-bold text-botanical-950 text-xs sm:text-sm">Amber UV Glass</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => quickBuyNow(primaryProduct)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 transition-all hover:-translate-y-0.5 active:scale-98 border border-[#62773C] cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-white" />
                    <span>Buy Now — Direct Checkout</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
