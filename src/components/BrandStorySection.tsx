import React from 'react';
import { Leaf, Award, HeartHandshake, BookOpen, ShieldCheck } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-[#18210F] text-cream-50 overflow-hidden">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-botanical-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-grain pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Emblem & Manifesto */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#748C48]/25 text-[#D1DBB6] text-xs font-semibold uppercase tracking-wider border border-[#748C48]/40">
              <BookOpen className="w-3.5 h-3.5 text-gold-light" />
              <span>Brand Heritage & Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-cream-50 leading-tight">
              Rooted in Nature.
              <span className="block text-gold-light font-serif italic font-normal">
                Crafted for Modern Living.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-cream-200/90 leading-relaxed font-normal">
              At <strong className="text-white font-semibold">Tibra Natural — The Herbal Store</strong>, we believe genuine wellness starts where synthetic shortcuts end. Our purpose is simple: formulate uncompromised herbal remedies that empower individuals to stay active, resilient, and confident in their everyday movements.
            </p>

            <blockquote className="p-5 rounded-2xl bg-white/5 border-l-2 border-gold text-sm sm:text-base italic text-cream-100">
              "Nature's Care For A Stronger You — Move Freely, Live Better."
            </blockquote>

            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
              Every drop of Tibra Natural Joint Oil represents our uncompromising focus on botanical integrity, authentic plant extracts, and mindful packaging that preserves natural potency.
            </p>

          </div>

          {/* Right Column: Brand Pillars with Consistent Iconography */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#748C48] text-white flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-md">
                <Leaf className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                100% Herbal Purity
              </h3>
              <p className="text-xs text-cream-200/80 leading-relaxed">
                Clean herbal formulations free from parabens, synthetic fillers, or artificial harsh coloring agents.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#748C48] text-white flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-md">
                <Award className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Mindful Extraction
              </h3>
              <p className="text-xs text-cream-200/80 leading-relaxed">
                Traditional botanical wisdom paired with modern purity standards for consistent daily comfort.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 space-y-3 sm:col-span-2 group">
              <div className="w-12 h-12 rounded-2xl bg-[#748C48] text-white flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-md">
                <HeartHandshake className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-white">
                  Transparent Responsibility
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-mono text-gold-light uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-gold" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-cream-200/80 leading-relaxed">
                We believe in honest labeling without inflated medical promises. Tibra Natural Joint Oil is designed as a daily botanical companion for joint flexibility, muscle ease, and active living.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
