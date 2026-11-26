import React from 'react';
import { Pipette, Sparkles, RotateCw, AlertCircle, Check, ArrowRight, ShieldCheck, Clock, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const RitualUsageSection: React.FC = () => {
  const { quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];
  const steps = [
    {
      num: '01',
      title: 'Precision Dispense',
      tagline: '3 to 5 Concentrated Drops',
      duration: 'Step 1',
      image: '/assets/ritual/step1-dispense-3d-transparent.webp',
      icon: Pipette,
      color: 'from-amber-500/10 to-gold/10 text-gold-dark',
      badgeBg: 'bg-gold/15 text-botanical-900 border-gold/30',
      instruction: 'Squeeze the soft rubber bulb and dispense 3 to 5 drops directly onto the targeted joint, muscle area, or palm.',
      benefit: 'Controlled single-drop delivery prevents spilling and product waste.'
    },
    {
      num: '02',
      title: 'Warm & Activate',
      tagline: '5 Seconds Palm Rub',
      duration: 'Step 2',
      image: '/assets/ritual/step2-warm-3d-transparent.webp',
      icon: Sparkles,
      color: 'from-gold/10 to-botanical-500/10 text-botanical-700',
      badgeBg: 'bg-cream-200 text-botanical-900 border-cream-300',
      instruction: 'Gently rub the oil between your fingertips or palms for a few seconds to warm the botanical extracts.',
      benefit: 'Natural warmth releases active turmeric and ginger aromatics.'
    },
    {
      num: '03',
      title: 'Circular Massage',
      tagline: '2 to 3 Minutes Absorption',
      duration: 'Step 3',
      image: '/assets/ritual/step3-massage-3d-transparent.webp',
      icon: RotateCw,
      color: 'from-botanical-500/10 to-botanical-800/10 text-botanical-800',
      badgeBg: 'bg-botanical-100 text-botanical-900 border-botanical-200',
      instruction: 'Massage in firm, circular strokes over knees, shoulders, neck, or lower back until fully absorbed.',
      benefit: 'Silky, non-greasy finish allows effortless movement right after.'
    }
  ];

  return (
    <section id="ritual" className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#F5F0E6]/50 border-t border-cream-200 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold-light/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-botanical-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/90 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider border border-cream-300/80 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-botanical-600" />
            <span>The Daily Ritual • How to Use</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-botanical-950">
            A Mindful Daily Ritual.
            <span className="block text-botanical-600 font-serif italic font-normal">
              3 Simple Steps to Active Living.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-botanical-800/80 leading-relaxed">
            Take two minutes morning or evening to restore comfort to your joints and soothe tired muscles with traditional herbal care.
          </p>
        </div>

        {/* Connected Step-by-Step Sequence */}
        <div className="relative mb-16">
          
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] -translate-y-8 h-0.5 border-t-2 border-dashed border-botanical-300/60 -z-0" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              return (
                <div
                  key={idx}
                  className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 border border-cream-200/90 shadow-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Header Row with High Quality 3D Icon & Step Badge */}
                    <div className="flex items-center justify-between mb-6">
                      
                      {/* Luxury 3D Visual Artwork Container */}
                      <div className="relative">
                        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr ${step.color} p-2 flex items-center justify-center border border-cream-200/60 shadow-md group-hover:scale-105 transition-all duration-300`}>
                          <img
                            src={step.image}
                            alt={`${step.title} application ritual step`}
                            width={112}
                            height={112}
                            className="w-full h-full object-contain filter drop-shadow-md select-none"
                            loading="lazy"
                          />
                        </div>
                        {/* Glow accent */}
                        <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg -z-10 group-hover:opacity-100 opacity-30 transition-opacity" />
                      </div>

                      {/* Step Number & Time Badge */}
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xs font-bold text-botanical-500 uppercase tracking-wider">
                          {step.duration}
                        </span>
                        <span className={`text-[10px] font-mono tracking-wider uppercase px-3 py-1 rounded-full border mt-1 font-semibold ${step.badgeBg}`}>
                          {step.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Step Title & Concise Description */}
                    <div className="space-y-2.5">
                      <h3 className="font-serif font-bold text-base sm:text-lg md:text-xl text-botanical-950 group-hover:text-botanical-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-botanical-800/80 leading-relaxed font-normal">
                        {step.instruction}
                      </p>
                    </div>
                  </div>

                  {/* Benefit Pill */}
                  <div className="pt-5 mt-6 border-t border-cream-100 flex items-center gap-2 text-[11px] text-botanical-700 font-medium">
                    <Check className="w-4 h-4 text-botanical-600 shrink-0" />
                    <span>{step.benefit}</span>
                  </div>

                  {/* Flow Arrow for Desktop */}
                  {idx < 2 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-8 w-8 h-8 rounded-full bg-white border border-cream-300 shadow-sm items-center justify-center text-botanical-500 z-20 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Safety & Precautions Banner with Icons */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center text-botanical-800 shrink-0">
              <AlertCircle className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-botanical-950 text-sm flex items-center gap-2">
                <span>Application Guidance & Topical Safety</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold">
                  Verified
                </span>
              </h4>
              <p className="text-xs text-botanical-700 leading-relaxed max-w-2xl">
                For external topical use only. Apply to clean, unbroken skin. Avoid direct contact with eyes or open wounds. Perform a routine skin patch test if you have sensitive skin. Store bottle upright in a cool, shaded environment.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-stretch sm:self-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-botanical-900 bg-cream-100/70 px-4 py-2.5 rounded-xl border border-cream-200">
              <ShieldCheck className="w-4 h-4 text-botanical-600" />
              <span>100% Herbal Blend</span>
            </div>
            <button
              type="button"
              onClick={() => quickBuyNow(primaryProduct)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 transition-all active:scale-98 border border-[#62773C] cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
