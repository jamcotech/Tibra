import React from 'react';
import { ShieldAlert, CheckCircle2, ChevronRight, HeartPulse } from 'lucide-react';
import { SeoHead } from '../SeoHead';

export const HowToUsePage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Warm the Skin & Prepare',
      desc: 'Wash and thoroughly dry the targeted joint or muscle area. Applying after a warm shower or bath opens pores for enhanced botanical absorption.',
      tip: 'Ensure the area is clean and free of heavy chemical lotions.'
    },
    {
      num: '02',
      title: 'Dispense 3 to 5 Drops',
      desc: 'Using the gold precision dropper, dispense 3 to 5 warm drops directly onto the knee, shoulder, lower back, neck, or elbow.',
      tip: 'Do not squeeze excessively; our concentrated formula spreads smoothly.'
    },
    {
      num: '03',
      title: 'Slow Circular Massage (2-3 Mins)',
      desc: 'Gently massage the oil into the skin using firm, circular fingertip strokes. Allow the natural warming ginger and soothing turmeric to activate.',
      tip: 'Massage in clockwise circles until the oil fully absorbs into the joint area.'
    },
    {
      num: '04',
      title: 'Twice Daily Ritual',
      desc: 'Apply once in the morning to prepare joints for active daytime mobility, and once in the evening before sleep for overnight restorative comfort.',
      tip: 'Consistency over 3 to 4 weeks delivers maximum mobility benefits.'
    }
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'How to Use', item: 'https://www.tibranaturals.com/how-to-use/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="How to Use Herbal Massage Oil | TIBRA NATURALS Daily Ritual"
        description="Learn how to properly apply TIBRA NATURALS Pain Relief Oil. Step-by-step 30 ML dropper dosage, circular massage instructions, and precautions for best joint relief."
        canonicalPath="/how-to-use/"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">How to Use</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Application Ritual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            A Mindful Daily Ritual.
            <span className="block italic text-[#748C48] font-normal font-serif">Directions for Optimal Comfort.</span>
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            Follow our certified application steps to unlock the soothing therapeutic potential of <strong>TIBRA NATURALS Pain Relief Oil</strong> for your knees, lower back, neck, and shoulders.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map(step => (
            <div key={step.num} className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-luxury space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-[#748C48]">
                  {step.num}
                </span>
                <span className="p-2 rounded-xl bg-botanical-50 text-botanical-700">
                  <CheckCircle2 className="w-4 h-4 text-[#748C48]" />
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg text-botanical-950">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
                {step.desc}
              </p>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-cream-200 text-xs text-botanical-800">
                <strong>Pro-Tip:</strong> {step.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Important Precautions */}
        <div className="mt-12 bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3 text-amber-950">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="font-serif font-bold text-base text-amber-950">Safety Instructions & Precautions</h3>
          </div>
          <ul className="text-xs sm:text-sm text-amber-900/90 space-y-1.5 list-disc pl-5">
            <li>For external topical massage use only. Do not ingest or consume.</li>
            <li>Do not apply to open cuts, irritated skin, wounds, or mucous membranes.</li>
            <li>Perform a 24-hour patch test on the inner forearm prior to full application if you have sensitive skin.</li>
            <li>Store upright with the gold dropper cap tightly sealed in a cool, dry place away from direct heat.</li>
            <li>Keep out of reach of children.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage;
