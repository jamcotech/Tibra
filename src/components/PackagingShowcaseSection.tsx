import React from 'react';
import {
  Package,
  ShieldCheck,
  Check,
  CheckCircle2,
  Sparkles,
  Droplets,
  SunDim,
  Pipette,
  Leaf,
  Layers,
  HeartPulse,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const PackagingShowcaseSection: React.FC = () => {
  const { addToCart, quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];

  const specs = [
    { label: 'Brand', value: 'Tibra Natural — The Herbal Store', icon: ShieldCheck },
    { label: 'Product Name', value: 'Tibra Natural Joint Oil', icon: Package },
    { label: 'Net Volume', value: '30 ML (1.01 FL. OZ)', icon: Droplets },
    { label: 'Bottle Type', value: 'Amber Glass with UV Defense', icon: SunDim },
    { label: 'Closure Mechanism', value: 'Gold Collar + Rubber Pipette', icon: Pipette },
    { label: 'Secondary Packaging', value: 'Protective Unit Carton', icon: Layers },
    { label: 'Formulation Origin', value: '100% Natural Herbal Blend', icon: Leaf },
    { label: 'Application Mode', value: 'Topical Massage Oil', icon: HeartPulse },
  ];

  return (
    <section id="packaging" className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider border border-botanical-200/80 shadow-xs">
            <Package className="w-3.5 h-3.5 text-botanical-600 stroke-[1.75]" />
            <span>Bottle & Packaging Showcase</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-botanical-950">
            Uncompromising Presentation.
            <span className="block text-botanical-600 font-serif italic font-normal">
              Official Box & 30 ML Bottle.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-botanical-800/80 leading-relaxed">
            Designed for durability, extract freshness, and effortless daily handling. Studio presentation of the genuine Tibra Natural Joint Oil set.
          </p>
        </div>

        {/* Dual Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Authentic Studio Photography Mockup */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden border border-cream-200 shadow-luxury bg-cream-100/50 group">
              <img
                src="/assets/packaging-showcase-003.png"
                alt="Tibra Natural Joint Oil Official Bottle and Box Packaging Showcase"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
              />
              
              {/* Floating Verified Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-950/85 text-cream-50 backdrop-blur-md border border-white/20 text-[11px] font-medium shadow-lg">
                <ShieldCheck className="w-4 h-4 text-gold-light" />
                <span>Genuine Brand Packaging</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-botanical-950/80 via-botanical-950/40 to-transparent p-6 text-cream-50">
                <p className="font-serif text-base font-bold">Tibra Natural Joint Oil (30 ML)</p>
                <p className="text-xs text-cream-200">Matching unit carton with comprehensive anatomical usage guides</p>
              </div>
            </div>
          </div>

          {/* Right Column: Packaging Details & Specifications */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-dark font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Official Specifications
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-botanical-950">
                Crafted for Botanical Integrity
              </h3>
              <p className="text-xs sm:text-sm text-botanical-800/80 leading-relaxed">
                From the amber bottle wall thickness to the gold-anodized dropper finish, every specification serves to protect the natural herbal blend from degradation.
              </p>
            </div>

            {/* Spec Table with Dedicated Icons */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden divide-y divide-cream-100">
              {specs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-[11px] hover:bg-cream-50/70 transition-colors">
                    <span className="font-mono text-botanical-600 uppercase tracking-wider flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-botanical-500 shrink-0 stroke-[1.75]" />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-semibold text-botanical-950 text-right">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Box Features List with Botanical Icon Bullets */}
            <div className="p-5 rounded-2xl bg-[#F5F0E6] border border-cream-300/80 space-y-3">
              <span className="text-xs font-bold text-botanical-950 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-botanical-600" />
                Verified Carton Inclusions
              </span>
              <ul className="space-y-2 text-xs text-botanical-800">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-botanical-100 flex items-center justify-center text-botanical-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Includes multi-area pain target diagrams on side panel.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-botanical-100 flex items-center justify-center text-botanical-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Clearly prints "Nature's Care For A Stronger You" brand motto.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-botanical-100 flex items-center justify-center text-botanical-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Tamper-evident tuck closure ensures factory freshness.</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-cream-300/80 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => quickBuyNow(primaryProduct)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5 border border-[#62773C]"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white" />
                  <span>Buy Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(primaryProduct)}
                  className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-botanical-950 border border-[#748C48]/40 hover:border-[#748C48] hover:bg-cream-50 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#748C48]" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
