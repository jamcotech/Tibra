import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  ShoppingCart,
  ShoppingBag,
  Search,
  User
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  onOpenOrderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrderModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    cartCount,
    setIsCartDrawerOpen,
    currentView,
    setCurrentView,
    setIsAdminOpen
  } = useShop();

  const navLinks = [
    { label: 'Overview', href: '#hero', id: 'hero' },
    { label: 'Formula', href: '#ingredients', id: 'ingredients' },
    { label: 'Targets', href: '#targets', id: 'targets' },
    { label: 'How to Use', href: '#ritual', id: 'ritual' },
    { label: 'Packaging', href: '#packaging', id: 'packaging' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      const sectionIds = ['hero', 'ingredients', 'targets', 'ritual', 'packaging', 'faq'];
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (currentView !== 'home') {
      setCurrentView('home');
    }

    const q = searchQuery.toLowerCase();
    setIsSearchOpen(false);

    setTimeout(() => {
      if (q.includes('price') || q.includes('pack') || q.includes('bottle') || q.includes('buy')) {
        document.querySelector('#packaging')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('faq') || q.includes('delivery') || q.includes('help')) {
        document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('pain') || q.includes('knee') || q.includes('back')) {
        document.querySelector('#targets')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('use') || q.includes('ritual') || q.includes('massage')) {
        document.querySelector('#ritual')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.querySelector('#ingredients')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  // Translucent Dark Olive-Green Glassmorphism:
  // Harmonized warm olive frosted glass matching logo palette #748C48
  const headerBgStyle: React.CSSProperties = {
    backgroundColor: isScrolled ? 'rgba(116, 140, 72, 0.94)' : 'rgba(116, 140, 72, 0.88)',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    border: '1.5px solid rgba(255, 255, 255, 0.40)',
    boxShadow: isScrolled
      ? '0 16px 36px -8px rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)'
      : '0 8px 24px -6px rgba(0, 0, 0, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      <div
        style={headerBgStyle}
        className="max-w-7xl mx-auto rounded-full transition-all duration-300 pointer-events-auto px-4 sm:px-6 py-2.5 sm:py-3"
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Tag — in Actual Brand Color with Whitish Outer Glow */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 group focus:outline-none rounded-full py-1 pr-2 text-left cursor-pointer"
          >
            <div className="relative flex items-center">
              {/* Soft ambient white backing aura to lift logo off dark olive */}
              <div className="absolute inset-0 -m-1 rounded-full bg-white/25 blur-md pointer-events-none" />
              <img
                src="/assets/tibra-logo.png"
                alt="TIBRA"
                style={{
                  filter:
                    'drop-shadow(0 0 1px #ffffff) drop-shadow(0 0 2px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 7px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.50)) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))',
                }}
                className="relative h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              />
            </div>
            <div className="hidden sm:flex flex-col border-l border-white/30 pl-3">
              <span className="text-[11px] font-bold tracking-widest uppercase text-white leading-none drop-shadow-sm">
                Tibra Natural
              </span>
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#F5E6A3] leading-tight mt-0.5 font-medium drop-shadow-sm">
                The Herbal Store
              </span>
            </div>
          </button>

          {/* Desktop Floating Pill Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 sm:gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-xs shrink-0">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#748C48] text-white font-bold shadow-xs'
                      : 'text-[#252E15] hover:text-[#141A0B] hover:bg-black/[0.04] font-semibold'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action Controls: Search, Cart, Account & Buy Now CTA */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${
                isSearchOpen
                  ? 'bg-white text-botanical-950 border-white shadow-sm'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/35 hover:text-white shadow-2xs backdrop-blur-md'
              }`}
              aria-label="Search Products and Ingredients"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full bg-white/20 text-white border border-white/30 hover:bg-white/35 transition-colors shadow-2xs group cursor-pointer backdrop-blur-md shrink-0"
              aria-label="Open Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#252E15] text-white text-[10px] font-bold font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Admin Portal Quick Switch */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-full bg-white/20 text-white border border-white/30 hover:bg-white/35 transition-colors shadow-2xs cursor-pointer backdrop-blur-md shrink-0"
              aria-label="Store Admin Portal & CRM"
              title="Account / Admin CRM"
            >
              <User className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Quick Buy Now Button with Shopping Cart Icon - Solid White on Olive Bar */}
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase bg-white text-[#252E15] hover:bg-[#F5F0E6] transition-all hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#748C48] group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap font-bold text-[#252E15]">Buy Now</span>
              <ArrowRight className="w-3 h-3 text-[#748C48] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full bg-white/20 text-white border border-white/30"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full bg-white/20 text-white border border-white/30"
              aria-label="Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F3CD64] text-[#0F311E] text-[9px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-botanical-900 text-cream-50 sm:hidden shadow-xs flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
              <span>Buy</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#F5E6A3]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Search Bar Dropdown Overlay */}
        {isSearchOpen && (
          <div className="mt-3 pt-3 pb-1 border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-botanical-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal formula, joints, ingredients (Turmeric, Ginger, Boswellia)..."
                className="w-full bg-white/95 border border-white focus:border-botanical-600 rounded-full pl-10 pr-24 py-2 text-xs text-botanical-950 placeholder-botanical-600/60 outline-none backdrop-blur-xl shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-botanical-900 text-cream-50 text-[11px] font-bold hover:bg-botanical-950 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer / Panel — matching PC header theme with explicit Cross [X] button */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 pointer-events-auto flex items-start justify-center pt-4 px-3 sm:px-6 animate-in fade-in duration-200">
          {/* Backdrop overlay — tap anywhere to close */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Card with exact PC header frosted glass styling */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(75, 79, 48, 0.94), rgba(39, 65, 39, 0.96), rgba(15, 49, 30, 0.96))',
              backdropFilter: 'blur(25px) saturate(160%)',
              WebkitBackdropFilter: 'blur(25px) saturate(160%)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              boxShadow:
                '0 24px 48px -12px rgba(0, 0, 0, 0.50), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
            }}
            className="w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 my-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Header row: Brand & Cross (X) Close button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/20">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/tibra-logo.png"
                  alt="TIBRA"
                  className="h-8 w-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))',
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Tibra Natural
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#F5E6A3]">
                    The Herbal Store
                  </span>
                </div>
              </div>

              {/* Explicit Cross (X) Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center border border-white/35 transition-colors cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Menu Links with sober luxury styling */}
            <nav className="py-1 space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      handleNavClick(link.href, link.id);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/20 text-[#F5E6A3] font-bold border-l-4 border-[#F5E6A3]'
                        : 'text-white/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 text-white" />
                  </a>
                );
              })}
            </nav>

            {/* Action Button: Confirm Order */}
            <div className="pt-2 border-t border-white/20">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-[#252E15] hover:bg-[#F5F0E6] shadow-md transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#748C48]" />
                <span>Buy Tibra Natural (Cash on Delivery)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
