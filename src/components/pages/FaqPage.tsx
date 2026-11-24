import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Package, Leaf, Droplets, ShieldCheck, SunDim, ShoppingBag, ChevronRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the net volume and packaging of TIBRA NATURALS Pain Relief Oil?',
      icon: Package,
      a: 'TIBRA NATURALS Pain Relief Oil comes in a premium 30 ML (1.01 FL OZ) pharmaceutical amber glass bottle fitted with a precision metallic gold dropper cap and white silicone bulb. The amber glass provides UV defense for sensitive plant actives, accompanied by a protective unit box.'
    },
    {
      q: 'Which verified botanical ingredients are used in this formulation?',
      icon: Leaf,
      a: 'The formulation is an authentic 100% natural herbal blend featuring Curcuma Longa (Turmeric Root), Zingiber Officinale (Ginger Root), Gaultheria Procumbens (Wintergreen), Eucalyptus Globulus Leaf Oil, Boswellia Serrata (Frankincense Resin), and pure cold-pressed plant carrier oils.'
    },
    {
      q: 'How many drops should I apply and what is the recommended frequency?',
      icon: Droplets,
      a: 'Dispense 3 to 5 warm drops directly onto the targeted joint or muscle area (such as the knees, shoulders, neck, or lower back) and gently massage in slow circular motions for 2 to 3 minutes until fully absorbed. For best results, use twice daily — once in the morning and once before bedtime.'
    },
    {
      q: 'Is TIBRA NATURALS Pain Relief Oil suitable for all skin types?',
      icon: ShieldCheck,
      a: 'Yes, our formula consists of gentle botanical extracts and pure carrier oils. However, as with all topical botanical products, we recommend performing a small patch test on your inner forearm 24 hours prior to regular use if you have sensitive skin.'
    },
    {
      q: 'What are the recommended storage conditions?',
      icon: SunDim,
      a: 'Keep the bottle securely closed with the golden dropper cap tightened. Store upright in a cool, dry place away from direct sunlight, excess moisture, and out of reach of children.'
    },
    {
      q: 'How does Cash on Delivery (COD) and nationwide shipping work in Pakistan?',
      icon: ShoppingBag,
      a: 'We provide nationwide express courier delivery with Cash on Delivery (COD) across Pakistan. Standard shipping is a flat Rs. 200 fee, with typical delivery arriving within 2 to 4 business days to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and all surrounding cities.'
    },
    {
      q: 'What is the pricing for single and duo combo packs?',
      icon: Package,
      a: 'Single 30 ML Bottle: Rs. 1,500 (Save 25% from original Rs. 1,990). Special Duo 2-Bottle Pack: Rs. 2,600 (Save 35% from regular Rs. 3,980), which breaks down to only Rs. 1,300 per bottle. Any quantity of 2 or more bottles receives the Rs. 1,300 per bottle combo rate.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.tibranaturals.com/faq/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Frequently Asked Questions (FAQ) | TIBRA NATURALS"
        description="Got questions about TIBRA NATURALS Pain Relief Oil? Find answers regarding ingredients, 30 ML dropper dosage, shipping across Pakistan, and COD payments."
        canonicalPath="/faq/"
        schema={[breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">FAQ</span>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Support & Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            Everything you need to know about our authentic botanical formulations, packaging, daily rituals, and delivery across Pakistan.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-cream-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div className="w-8 h-8 rounded-xl bg-botanical-100 text-[#748C48] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-serif font-bold text-xs sm:text-sm text-botanical-950">
                      {faq.q}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-cream-100 flex items-center justify-center text-botanical-700 shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-botanical-700/90 leading-relaxed border-t border-cream-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
