import React from 'react';
import { Leaf, ChevronRight, ArrowRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';

export const IngredientsPage: React.FC = () => {
  const ingredients = [
    {
      name: 'Curcuma Longa (Turmeric Root)',
      role: 'Soothes Joint Stiffness & Deep Muscle Ache',
      description: 'Golden rhizome cold-extracted to deliver active curcuminoids that comfort weight-bearing joints and reduce morning stiffness.',
      origin: 'Botanical Rhizome',
    },
    {
      name: 'Zingiber Officinale (Ginger Root)',
      role: 'Natural Warming & Microcirculation Glide',
      description: 'Thermal active compounds (gingerols) create gentle warmth upon skin contact, easing muscle tightness and improving topical blood flow.',
      origin: 'Root Tincture',
    },
    {
      name: 'Gaultheria Procumbens (Wintergreen)',
      role: 'Targeted Cooling & Deep Penetration',
      description: 'Rich in natural methyl salicylate, providing an invigorating cooling counter-sensation followed by prolonged relaxing comfort.',
      origin: 'Foliage Distillate',
    },
    {
      name: 'Eucalyptus Globulus (Blue Gum Leaf)',
      role: 'Aromatic Clarity & Muscle Relaxation',
      description: 'Clean cineole-rich leaf essence that clears heaviness and provides deep botanical relaxation to tight neck and shoulder muscles.',
      origin: 'Steam-Distilled Leaf',
    },
    {
      name: 'Boswellia Serrata (Frankincense Resin)',
      role: 'Cartilage & Joint Cushion Support',
      description: 'Prized ancient aromatic tree resin known for supporting joint ease, flexibility, and fluid movement across aging joints.',
      origin: 'Wild-Harvested Tree Resin',
    },
    {
      name: 'Cold-Pressed Sesame Carrier Base',
      role: 'Non-Greasy Rapid Absorption Medium',
      description: 'Pure botanical carrier that carries active herbal phytochemicals deeply through skin layers without sticky residue.',
      origin: 'Pure Cold-Pressed Seed',
    },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'Ingredients', item: 'https://www.tibranaturals.com/ingredients/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Botanical Ingredients | TIBRA NATURALS Pain Relief Oil"
        description="Discover the 100% natural botanical ingredients in TIBRA NATURALS Pain Relief Oil: Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility."
        canonicalPath="/ingredients/"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">Ingredients</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Purity & Science</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Formulated from the Earth.
            <span className="block italic text-[#748C48] font-normal font-serif">100% Botanical Transparency.</span>
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            Every bottle of <strong>TIBRA NATURALS Pain Relief Oil (30 ML)</strong> is crafted with time-tested roots, leaves, and resins. Zero parabens, zero synthetic perfumes, zero fillers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-cream-200 shadow-luxury space-y-3 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-botanical-600 uppercase tracking-wider bg-cream-100 px-2 py-0.5 rounded-full">
                  {ing.origin}
                </span>
              </div>
              <h2 className="font-serif font-bold text-base text-botanical-950 leading-tight">
                {ing.name}
              </h2>
              <p className="text-xs font-semibold text-[#748C48]">
                {ing.role}
              </p>
              <p className="text-xs text-botanical-700 leading-relaxed">
                {ing.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 bg-[#252E15] text-cream-50 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">Experience the Pure Herbal Blend</h3>
            <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl">
              Available in official 30 ML amber glass droppers with Cash on Delivery across Pakistan.
            </p>
          </div>
          <a
            href="/products/pain-relief-oil/"
            className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>View Pain Relief Oil</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;
