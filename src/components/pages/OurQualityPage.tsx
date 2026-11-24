import React from 'react';
import { Award, ShieldCheck, SunDim, Sparkles, ChevronRight, Leaf, ArrowRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';

export const OurQualityPage: React.FC = () => {
  const pillars = [
    {
      title: 'Gentle Cold-Maceration',
      desc: 'Our botanical actives are extracted without destructive excessive heat, safeguarding natural curcuminoids, gingerols, and essential aromatic terpenes.',
      icon: Sparkles
    },
    {
      title: 'Pharmaceutical Amber Glass UV Defense',
      desc: 'Every batch is packaged in genuine UV-filtering amber glass bottles to prevent photo-oxidation, preserving botanical potency and aroma across its entire shelf life.',
      icon: SunDim
    },
    {
      title: 'Zero Harsh Synthetics',
      desc: 'Free from artificial parabens, synthetic mineral oils, petroleum byproducts, and aggressive chemical heating agents.',
      icon: Leaf
    },
    {
      title: 'Batch Consistency & Safety Inspection',
      desc: 'Every single packaging unit is sealed with tamper-evident caps and inspected before courier dispatch across Pakistan.',
      icon: ShieldCheck
    }
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'Our Quality', item: 'https://www.tibranaturals.com/our-quality/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Quality & Sourcing Standards | TIBRA NATURALS Pakistan"
        description="Learn how TIBRA NATURALS ensures uncompromised herbal quality. Cold-extraction, pharmaceutical amber glass UV defense, and verified botanical purity."
        canonicalPath="/our-quality/"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">Our Quality</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Integrity & Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Uncompromising Standards.
            <span className="block italic text-[#748C48] font-normal font-serif">From Soil to Dropper.</span>
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            At <strong>TIBRA NATURALS</strong>, quality is not a marketing phrase — it is an uncompromising discipline governing our raw harvest selection, cold extraction, and light-tight packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-8 border border-cream-200 shadow-luxury space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h2 className="font-serif font-bold text-xl text-botanical-950">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-[#252E15] text-cream-50 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-luxury">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">Experience Authentic Botanical Wellness</h3>
          <p className="text-xs sm:text-sm text-cream-200 max-w-xl mx-auto">
            Order your 30 ML amber bottle directly from TIBRA NATURALS with cash on delivery anywhere in Pakistan.
          </p>
          <div className="pt-2">
            <a
              href="/products/pain-relief-oil/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurQualityPage;
