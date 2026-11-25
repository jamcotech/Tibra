import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

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
                alt="TIBRA NATURALS"
                className="h-8 sm:h-9 w-auto object-contain"
                style={{
                  filter:
                    'drop-shadow(0 0 1px rgba(0, 0, 0, 0.85)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.70)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.40))',
                }}
              />
              <span className="text-xs uppercase tracking-widest text-[#F5E6A3] font-bold border-l border-white/30 pl-3">
                The Herbal Store
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-white/90 max-w-sm leading-relaxed">
              Dedicated to authentic botanical wellness. TIBRA NATURALS Pain Relief Oil brings the time-tested synergy of pure turmeric, ginger, and botanical extracts into an elegant 30 ML dropper ritual for everyday mobility.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#F5E6A3] font-semibold">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Official 30 ML Botanical Presentation</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5E6A3] font-bold">
              Explore & Learn
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <ul className="space-y-1.5">
                <li><a href="/" className="text-white/90 hover:text-white transition-colors">Home</a></li>
                <li><a href="/products/pain-relief-oil/" className="text-white/90 hover:text-white transition-colors">Pain Relief Oil</a></li>
                <li><a href="/ingredients/" className="text-white/90 hover:text-white transition-colors">Botanical Ingredients</a></li>
                <li><a href="/how-to-use/" className="text-white/90 hover:text-white transition-colors">How to Use</a></li>
                <li><a href="/our-quality/" className="text-white/90 hover:text-white transition-colors">Our Quality Standard</a></li>
              </ul>
              <ul className="space-y-1.5">
                <li><a href="/about-us/" className="text-white/90 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/blog/" className="text-white/90 hover:text-white transition-colors">Herbal Wellness Blog</a></li>
                <li><a href="/faq/" className="text-white/90 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="/contact-us/" className="text-white/90 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/shipping-policy/" className="text-white/90 hover:text-white transition-colors">Shipping & Delivery</a></li>
              </ul>
            </div>
          </div>

          {/* Brand Promise & Customer Care */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5E6A3] font-bold">
              Customer Support
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              Nationwide Cash on Delivery (COD) across Pakistan. Fast dispatch from Lahore.
            </p>
            <div className="p-3 rounded-xl bg-black/15 border border-white/20 text-[11px] text-white/90 space-y-1">
              <p><strong>Official Product:</strong> 30 ML Amber Glass</p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:orders@tibranaturals.com"
                  onClick={() => analyticsService.trackContactClick('email')}
                  className="hover:underline hover:text-white"
                >
                  orders@tibranaturals.com
                </a>
              </p>
              <p>
                <strong>Support:</strong>{' '}
                <a
                  href="tel:+923001234567"
                  onClick={() => analyticsService.trackContactClick('phone')}
                  className="hover:underline hover:text-white"
                >
                  +92 300 1234567
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Regulatory & Wellness Disclaimer */}
        <div className="py-6 border-b border-white/20 text-[11px] text-white/85 leading-relaxed">
          <p>
            <strong>Wellness Disclaimer:</strong> TIBRA NATURALS Pain Relief Oil is a topical herbal wellness formulation intended to soothe muscles and joints during active living and daily massage rituals. It is not formulated to diagnose, treat, cure, or prevent any medical condition or disease. Individual sensations may vary. For external topical use only. Discontinue use if irritation occurs.
          </p>
        </div>

        {/* Legal Links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/90">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} TIBRA NATURALS. All rights reserved.</p>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="flex items-center gap-3 text-[11px] text-white/80">
              <a href="/privacy-policy/" className="hover:text-white transition-colors">Privacy</a>
              <a href="/return-policy/" className="hover:text-white transition-colors">Returns</a>
              <a href="/terms-and-conditions/" className="hover:text-white transition-colors">Terms</a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('tibra_open_cookie_preferences'))}
                className="hover:text-white transition-colors underline cursor-pointer"
              >
                Cookie Preferences
              </button>
            </div>
          </div>

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
