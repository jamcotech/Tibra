import React from 'react';
import { BookOpen, Leaf, HeartHandshake, ShieldCheck, ChevronRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';
import BRAND_CONFIG from '../../config/brandConfig';

export const AboutUsPage: React.FC = () => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://www.tibranaturals.com/about-us/' }
    ]
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_CONFIG.brandName,
    url: 'https://www.tibranaturals.com/',
    logo: 'https://www.tibranaturals.com/assets/tibra-logo.png',
    description: 'Pakistan botanical wellness brand producing 100% natural herbal massage oils for joint comfort and active living.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: BRAND_CONFIG.address.city,
      addressRegion: BRAND_CONFIG.address.region,
      addressCountry: BRAND_CONFIG.address.country
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BRAND_CONFIG.supportPhone,
      contactType: 'customer service',
      email: BRAND_CONFIG.supportEmail
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="About Us | TIBRA NATURALS – Botanical Wellness Heritage"
        description="Learn about TIBRA NATURALS, Pakistan's authentic botanical wellness house dedicated to 100% natural herbal joint comfort, mobility rituals, and uncompromised purity."
        canonicalPath="/about-us/"
        schema={[breadcrumbSchema, organizationSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">About Us</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Our Story & Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Rooted in Nature.
            <span className="block italic text-[#748C48] font-normal font-serif">Crafted for Active Living.</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-botanical-700 leading-relaxed">
            At <strong>TIBRA NATURALS</strong>, we believe true physical comfort and long-term joint ease begin where synthetic shortcuts end. Our journey was born from a timeless conviction: the earth provides the most potent, biologically harmonious elements to sustain pain-free human mobility.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-botanical-800 leading-relaxed">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-botanical-950">
              The Philosophy Behind TIBRA NATURALS
            </h2>
            <p>
              In an age dominated by artificial quick-fixes, synthetic gels, and temporary numbing agents, we chose a deliberate path. We revived traditional Eastern botanical wisdom, studying how rhizomes like turmeric (Curcuma Longa) and ginger (Zingiber Officinale) have comforted tired joints for centuries.
            </p>
            <p>
              By combining these heritage extracts with therapeutic foliage oils like Wintergreen and Eucalyptus, and cold-extracted Frankincense resin (Boswellia Serrata), we created <strong>TIBRA NATURALS Pain Relief Oil</strong> — a balanced, warming, deeply nourishing topical formulation that absorbs effortlessly.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm text-botanical-900 font-serif italic text-sm">
              "Nature's Care For A Stronger You — Move Freely, Live Better."
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden bg-cream-100 border border-cream-200 p-8 shadow-luxury text-center space-y-4">
              <img
                src="/assets/purefix-bottle-box-showcase.webp"
                alt="TIBRA NATURALS Botanical Packaging Set"
                width={400}
                height={288}
                loading="lazy"
                className="max-h-72 mx-auto object-contain drop-shadow-md"
              />
              <p className="text-xs font-mono uppercase tracking-wider text-botanical-600 font-bold">
                Official 30 ML Botanical Presentation
              </p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-botanical-950">100% Herbal Purity</h3>
            <p className="text-xs text-botanical-700 leading-relaxed">
              We never compromise with parabens, synthetic fillers, or artificial dyes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-botanical-950">Amber Glass Defense</h3>
            <p className="text-xs text-botanical-700 leading-relaxed">
              Pharmaceutical grade amber glass protects live plant actives against sunlight degradation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-botanical-950">Transparent Care</h3>
            <p className="text-xs text-botanical-700 leading-relaxed">
              Clear formulation labels, nationwide Cash on Delivery, and honest customer guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
