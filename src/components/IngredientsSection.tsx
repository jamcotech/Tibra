import React from 'react';
import { Leaf, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

interface Ingredient {
  name: string;
  botanicalName?: string;
  category: 'Key Actives' | 'Herbal Oils' | 'Natural Extracts' | 'Base Oils';
  benefit: string;
  image: string;
  tag: string;
}

export const IngredientsSection: React.FC = () => {
  const { quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];

  const ingredients: Ingredient[] = [
    // Row 1
    {
      name: 'Turmeric',
      botanicalName: 'Curcuma Longa',
      category: 'Key Actives',
      benefit: 'Powerful anti-inflammatory and natural pain relief.',
      image: '/assets/ingredients/turmeric.jpg',
      tag: 'Pain Relief'
    },
    {
      name: 'Ginger',
      botanicalName: 'Zingiber Officinale',
      category: 'Key Actives',
      benefit: 'Provides warming effect, reduces stiffness and improves circulation.',
      image: '/assets/ingredients/ginger.jpg',
      tag: 'Warming Effect'
    },
    {
      name: 'Eucalyptus Oil',
      category: 'Herbal Oils',
      benefit: 'Cooling sensation, relieves muscle tension and joint stiffness.',
      image: '/assets/ingredients/eucalyptus.jpg',
      tag: 'Cooling Relief'
    },
    {
      name: 'Peppermint Oil',
      category: 'Herbal Oils',
      benefit: 'Provides cooling effect, soothes pain and refreshes tired muscles.',
      image: '/assets/ingredients/peppermint.jpg',
      tag: 'Refreshes Muscles'
    },
    {
      name: 'Wintergreen Oil',
      botanicalName: 'Gaultheria Procumbens',
      category: 'Herbal Oils',
      benefit: 'Natural source of methyl salicylate, helps relieve joint and muscle pain.',
      image: '/assets/ingredients/wintergreen.jpg',
      tag: 'Deep Relief'
    },

    // Row 2
    {
      name: 'Boswellia',
      botanicalName: 'Frankincense',
      category: 'Natural Extracts',
      benefit: 'Reduces inflammation and supports long-term joint mobility.',
      image: '/assets/ingredients/boswellia.jpg',
      tag: 'Mobility Support'
    },
    {
      name: 'Methi',
      botanicalName: 'Fenugreek',
      category: 'Natural Extracts',
      benefit: 'Helps reduce joint swelling and improves natural joint flexibility.',
      image: '/assets/ingredients/methi.jpg',
      tag: 'Reduces Swelling'
    },
    {
      name: 'Garlic Oil',
      category: 'Herbal Oils',
      benefit: 'Improves blood circulation and helps reduce muscle stiffness.',
      image: '/assets/ingredients/garlic.jpg',
      tag: 'Circulation'
    },
    {
      name: 'Cinnamon Oil',
      category: 'Herbal Oils',
      benefit: 'Deep warming effect, improves blood flow and eases persistent muscle pain.',
      image: '/assets/ingredients/cinnamon.jpg',
      tag: 'Warming Comfort'
    },
    {
      name: 'Clove Oil',
      category: 'Herbal Oils',
      benefit: 'Natural analgesic, numbs localized pain and provides long-lasting comfort.',
      image: '/assets/ingredients/clove.jpg',
      tag: 'Natural Analgesic'
    },

    // Row 3
    {
      name: 'Black Seed Oil',
      botanicalName: 'Kalonji',
      category: 'Herbal Oils',
      benefit: 'Supports overall joint vitality, cellular recovery and immune health.',
      image: '/assets/ingredients/blackseed.jpg',
      tag: 'Cellular Care'
    },
    {
      name: 'Rosemary Oil',
      category: 'Herbal Oils',
      benefit: 'Stimulates circulation and helps relieve chronic muscle fatigue.',
      image: '/assets/ingredients/rosemary.jpg',
      tag: 'Anti-Fatigue'
    },
    {
      name: 'Camphor',
      category: 'Key Actives',
      benefit: 'Provides rapid cooling relief, reduces localized swelling sensation.',
      image: '/assets/ingredients/camphor.jpg',
      tag: 'Rapid Cooling'
    },
    {
      name: 'Menthol',
      category: 'Key Actives',
      benefit: 'Cooling and soothing effect that refreshes sore, overworked muscle fibers.',
      image: '/assets/ingredients/menthol.jpg',
      tag: 'Instant Refresh'
    },
    {
      name: 'Sesame Oil',
      botanicalName: 'Pure Carrier Base',
      category: 'Base Oils',
      benefit: 'Deep skin penetration, deeply nourishes joints and carries herbal actives.',
      image: '/assets/ingredients/sesame.jpg',
      tag: 'Deep Dermal Base'
    },
    {
      name: 'Olive Oil',
      botanicalName: 'Antioxidant Base',
      category: 'Base Oils',
      benefit: 'Rich in antioxidants, moisturizes the skin and supports tissue health.',
      image: '/assets/ingredients/olive.jpg',
      tag: 'Antioxidant Base'
    }
  ];

  return (
    <section id="ingredients" className="relative py-24 lg:py-32 bg-[#FAF8F5] overflow-hidden border-t border-cream-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-botanical-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider border border-botanical-200/80 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-botanical-600 stroke-[1.75]" />
            <span>Key Natural Ingredients • 100% Herbal Blend</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-botanical-950 tracking-tight">
            Formulated from the Earth.
            <span className="block text-botanical-600 font-serif italic font-normal mt-1">
              16 Time-Tested Herbs &amp; Pure Botanical Oils.
            </span>
          </h2>

          <p className="text-sm text-botanical-800/80 leading-relaxed max-w-2xl mx-auto">
            A synergistic blend of authentic medicinal roots, soothing aromatics, and nourishing natural carrier oils designed for joint care, muscle relief, and active living.
          </p>
        </div>

        {/* 16 Ingredients Compact Circular Apothecary Grid (4 per row on Mobile) */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white/70 backdrop-blur-xs rounded-3xl border border-cream-200/90 shadow-2xs">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-5 gap-x-2 sm:gap-4 md:gap-5 justify-items-center">
            {ingredients.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-1.5 sm:gap-2 group cursor-pointer w-full"
              >
                {/* Circular Picture */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-0.5 sm:p-1 bg-white border-2 border-cream-300/90 shadow-2xs group-hover:border-botanical-500 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full select-none"
                    loading="lazy"
                  />
                </div>

                {/* Only the Ingredient Name (Compact) */}
                <span className="font-semibold text-[10px] sm:text-xs text-botanical-950 group-hover:text-botanical-700 transition-colors tracking-tight leading-tight max-w-[74px] sm:max-w-[95px] truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Bottom Buy Now Action Bar */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-[#252E15] text-cream-50 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 border border-botanical-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B5CC82] font-semibold">
              Pure Ayurvedic Formula • 100% Herbal
            </span>
            <h4 className="font-serif font-bold text-lg sm:text-xl text-white">
              Experience the Power of 16 Botanical Actives
            </h4>
            <p className="text-xs text-cream-200/80 max-w-xl">
              Specially blended to provide long-lasting relief from joint stiffness, muscle aches, and daily mobility discomfort.
            </p>
          </div>
          <button
            type="button"
            onClick={() => quickBuyNow(primaryProduct)}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 border border-[#859F54] shrink-0 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </section>
  );
};
