import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Package,
  Leaf,
  Droplets,
  ShieldCheck,
  SunDim,
  ShoppingBag
} from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the net volume and packaging of Tibra Natural Joint Oil?',
      icon: Package,
      a: 'Tibra Natural Joint Oil comes in a premium 30 ML (1.01 FL OZ) amber glass bottle fitted with a precision metallic gold dropper cap and white silicone bulb. The amber glass provides UV protection for the botanical actives, and the matching unit box ensures safe delivery and storage.'
    },
    {
      q: 'Which verified ingredients are used in this formulation?',
      icon: Leaf,
      a: 'The formulation is an authentic 100% natural herbal blend prominently featuring Curcuma Longa (Turmeric root) for soothing care, Zingiber Officinale (Ginger root) for natural warming stimulation, aromatic herbal foliage extracts, and a pure plant carrier oil base that allows smooth massage glide without greasiness.'
    },
    {
      q: 'How many drops should I use and how often?',
      icon: Droplets,
      a: 'Dispense 3 to 5 drops directly onto the targeted joint or muscle area (such as the knees, shoulders, neck, or lower back) and gently massage in circular motions for 2 to 3 minutes until fully absorbed. For best results, use once or twice daily, especially following a warm bath or physical activity.'
    },
    {
      q: 'Is Tibra Natural Joint Oil suitable for all skin types?',
      icon: ShieldCheck,
      a: 'Yes, the formulation consists of natural plant extracts and gentle carrier oils. However, as with all botanical topical products, we recommend performing a small patch test on the inner forearm 24 hours prior to regular use if you have particularly sensitive skin.'
    },
    {
      q: 'What are the recommended storage conditions?',
      icon: SunDim,
      a: 'Keep the bottle securely closed with the golden dropper cap tightened. Store in an upright position in a cool, dry place away from direct sunlight, excess moisture, and out of reach of children.'
    },
    {
      q: 'How do I place an order or inquire about delivery?',
      icon: ShoppingBag,
      a: 'You can submit an order reservation or product inquiry directly through the "Order / Inquire" button on this website. Our customer support team verifies current regional stock, handles payment inquiries, and coordinates prompt delivery.'
    }
  ];

  return (
    <section id="faq" className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-14 space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider border border-botanical-200/80 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-botanical-600 stroke-[1.75]" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-botanical-950">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-botanical-800/80 leading-relaxed">
            Clear, transparent answers regarding Tibra Natural Joint Oil formulation, application, and packaging.
          </p>
        </div>

        {/* Accordion List with Dedicated Category Icons */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-cream-200/90 shadow-xs overflow-hidden transition-all duration-200 hover:border-botanical-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#748C48] text-white shadow-xs' : 'bg-cream-100 text-[#5F7339]'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <span className="font-serif font-semibold text-sm sm:text-base text-botanical-950">
                      {faq.q}
                    </span>
                  </div>

                  <div
                    className={`p-1.5 rounded-full transition-colors shrink-0 ${
                      isOpen ? 'bg-[#748C48] text-white' : 'bg-cream-100 text-botanical-700'
                    }`}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-[13px] text-botanical-800/85 leading-relaxed border-t border-cream-100 animate-in fade-in-50 duration-200 pl-4 sm:pl-16">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
