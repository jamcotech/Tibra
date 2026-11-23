import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#748C48] text-white pt-10 sm:pt-16 pb-8 sm:pb-12 border-t border-[#859f54] shadow-inner relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-white/20 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/tibra-logo-white.png"
                alt="TIBRA"
                className="h-8 w-auto object-contain filter drop-shadow-sm"
              />
              <span className="text-xs uppercase tracking-widest text-[#F5E6A3] font-bold border-l border-white/30 pl-3">
                The Herbal Store
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-white/90 max-w-sm leading-relaxed">
              Dedicated to authentic botanical wellness. Tibra Natural Joint Oil brings the time-tested synergy of pure turmeric, ginger, and herbal extracts into an elegant 30 ML dropper ritual.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#F5E6A3] font-semibold">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Official 30 ML Botanical Presentation</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5E6A3] font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="text-white/90 hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <a href="#anatomy" className="text-white/90 hover:text-white transition-colors">3D Product Anatomy</a>
              </li>
              <li>
                <a href="#ingredients" className="text-white/90 hover:text-white transition-colors">Botanical Formulation</a>
              </li>
              <li>
                <a href="#targets" className="text-white/90 hover:text-white transition-colors">Target Pain Areas</a>
              </li>
              <li>
                <a href="#ritual" className="text-white/90 hover:text-white transition-colors">Daily Usage Ritual</a>
              </li>
              <li>
                <a href="#packaging" className="text-white/90 hover:text-white transition-colors">Packaging Showcase</a>
              </li>
              <li>
                <a href="#faq" className="text-white/90 hover:text-white transition-colors">FAQ & Support</a>
              </li>
            </ul>
          </div>

          {/* Brand Promise & Placeholders */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5E6A3] font-bold">
              Product & Inquiries
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              For direct orders, regional distribution, or retailer inquiries, connect with our support desk via our official order inquiry modal.
            </p>
            <div className="p-3.5 rounded-xl bg-black/15 border border-white/20 text-[11px] text-white/90 space-y-1">
              <p><strong>Official Pack:</strong> 30 ML / 1.01 FL. OZ.</p>
              <p><strong>Form:</strong> Topical Herbal Massage Oil</p>
              <p><strong>Inquiry Line:</strong> Direct Customer Reservation</p>
            </div>
          </div>

        </div>

        {/* Regulatory & Wellness Disclaimer */}
        <div className="py-6 border-b border-white/20 text-[11px] text-white/85 leading-relaxed">
          <p>
            <strong>Wellness Disclaimer:</strong> Tibra Natural Joint Oil is a topical herbal wellness formulation intended to soothe muscles and joints during active living and daily massage rituals. It is not formulated to diagnose, treat, cure, or prevent any medical condition or disease. Individual sensations may vary. For external use only. Discontinue use if irritation occurs.
          </p>
        </div>

        {/* Copyright & Scroll Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/90">
          <p>© {new Date().getFullYear()} Tibra Natural — The Herbal Store. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 cursor-pointer text-white font-medium"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
