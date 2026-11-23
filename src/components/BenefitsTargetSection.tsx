import React, { useState } from 'react';
import {
  Activity,
  ChevronRight,
  ChevronDown,
  Check,
  ShoppingCart,
  Pipette
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';

export const BenefitsTargetSection: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('Knee');
  const [mobileOpenZone, setMobileOpenZone] = useState<string | null>(null);
  const { quickBuyNow, products } = useShop();
  const primaryProduct = products[0] || storeService.getProducts()[0];

  const targetZones = [
    {
      name: 'Knee',
      category: 'Weight-Bearing Joint',
      cutout: '/assets/pain-cutouts/knee-cutout.png',
      tip: 'Take 3 to 4 warm drops and massage gently around the knee cap in slow circles.',
      details: 'Helps loosen up morning knee stiffness, makes bending comfortable, and gives fast relief after climbing stairs, walking, or standing for long hours.',
      highlight: 'Restores natural cushioning feeling and fluid knee bend without cracking or soreness.'
    },
    {
      name: 'Shoulder',
      category: 'Rotator Cuff & Deltoid',
      cutout: '/assets/pain-cutouts/shoulder-cutout.png',
      tip: 'Rub 4 drops between your palms and smooth over the front, top, and back of the shoulder.',
      details: 'Calms heavy, tired shoulder muscles caused by computer desk work, driving, or sleeping in an awkward position. Helps you lift your arm freely.',
      highlight: 'Eases tight rotator cuff tension and neck-to-shoulder strain within minutes.'
    },
    {
      name: 'Lower Back',
      category: 'Lumbar & Spine',
      cutout: '/assets/pain-cutouts/back-cutout.png',
      tip: 'Warm 4 to 5 drops and apply along both sides of your lower back and spine with gentle pressure.',
      details: 'Deep botanical warmth sinks directly into stiff lumbar muscles. Ideal after sitting all day, lifting heavy weights, or feeling sharp bending stiffness.',
      highlight: 'Soothes deep muscular knots and brings flexibility back to your lower back.'
    },
    {
      name: 'Neck',
      category: 'Cervical & Trapezius',
      cutout: '/assets/pain-cutouts/neck-cutout.png',
      tip: 'Massage 3 drops upwards from the base of the neck towards the skull using your fingertips.',
      details: 'Relieves tech-neck tightness caused by looking down at mobile phones and screens. Relaxes the stiff neck cords so you can turn your head with ease.',
      highlight: 'Clears painful neck stiffness and heavy tension headaches around the base of the head.'
    },
    {
      name: 'Elbow',
      category: 'Joint & Tendons',
      cutout: '/assets/pain-cutouts/elbow-cutout.png',
      tip: 'Gently work 2 to 3 drops into the inner fold and outer bone of the elbow.',
      details: 'Provides soothing comfort for overused forearm tendons, tennis elbow strain, carrying heavy bags, or repetitive gym workouts.',
      highlight: 'Keeps the elbow joint moving smoothly without pulling or sharp tendon discomfort.'
    },
    {
      name: 'Ankle & Foot',
      category: 'Tendon & Malleolus',
      cutout: '/assets/pain-cutouts/ankle-cutout.png',
      tip: 'Massage 3 to 4 drops thoroughly around the ankle bones and back heel tendon.',
      details: 'Revives swollen, exhausted feet and stiff ankles after long walks, sports, running, or standing shifts on hard floors.',
      highlight: 'Calms aching heel cords and restores light, comfortable footsteps every morning.'
    },
    {
      name: 'Hip',
      category: 'Ball & Socket Joint',
      cutout: '/assets/pain-cutouts/hip-cutout.png',
      tip: 'Massage 4 drops firmly in circular motions directly into the outer hip and pelvic joint area.',
      details: 'Releases deep hip tightness caused by prolonged car driving, desk sitting, or side-sleeping pressure. Helps you stand up straight without sharp catching.',
      highlight: 'Supports smooth hip socket rotation for confident, pain-free daily walking.'
    },
    {
      name: 'Upper Back',
      category: 'Thoracic & Blade',
      cutout: '/assets/pain-cutouts/upper-back-cutout.png',
      tip: 'Smooth 4 drops between and across both shoulder blades and the upper spine.',
      details: 'Releases the burning tightness and stubborn knots between the shoulder blades caused by poor posture, stress, and hunching over work desks.',
      highlight: 'Relaxes tight posture muscles so you can breathe deeply and feel light.'
    }
  ];

  const verifiedBenefits = [
    {
      title: 'Helps Reduce Joint Discomfort',
      desc: 'Herbal actives help comfort stiff, achy joints after physical exercise, heavy chores, or cold mornings.',
      iconImg: '/assets/benefits-icons/c1_joint_discomfort.png',
      tag: 'Joint Comfort',
      color: 'from-botanical-500/10 to-botanical-700/5',
    },
    {
      title: 'Relaxes Stiff Muscles',
      desc: 'Warming botanical formulation eases muscular knots, tight fibers, and tension caused by overexertion.',
      iconImg: '/assets/benefits-icons/c2_muscle_ease.png',
      tag: 'Muscle Ease',
      color: 'from-amber-400/10 to-gold/10',
    },
    {
      title: 'Improves Daily Mobility',
      desc: 'Facilitates smoother, fluid motion in everyday movements like climbing stairs, walking, and bending.',
      iconImg: '/assets/benefits-icons/c3_daily_mobility.png',
      tag: 'Fluid Movement',
      color: 'from-botanical-600/10 to-botanical-800/5',
    },
    {
      title: 'Supports Joint Function',
      desc: 'Nourishing herbal oils deliver topical nourishment to maintain healthy active joint lubrication.',
      iconImg: '/assets/benefits-icons/c4_joint_support.png',
      tag: 'Vitality Support',
      color: 'from-gold/10 to-amber-300/10',
    },
    {
      title: 'Soothes Inflammation Sensation',
      desc: 'Plant extracts provide calming, balancing relief to localized warm, irritated areas.',
      iconImg: '/assets/benefits-icons/c5_inflammation.png',
      tag: 'Calming Balance',
      color: 'from-amber-500/10 to-gold/10',
    },
    {
      title: 'Promotes Flexibility & Active Living',
      desc: 'Supports your daily yoga, walking, gym, or gardening routine without stiffness holding you back.',
      iconImg: '/assets/benefits-icons/c6_flexibility.png',
      tag: 'Active Lifestyle',
      color: 'from-botanical-500/10 to-botanical-900/5',
    },
  ];

  const currentZone = targetZones.find((z) => z.name === selectedZone) || targetZones[0];

  return (
    <section id="targets" className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#F5F0E6]/50 border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider border border-cream-300/80 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-botanical-600 stroke-[1.75]" />
            <span>Target Areas &amp; Verified Benefits</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-botanical-950">
            Works on Multiple Areas.
            <span className="block text-botanical-600 font-serif italic font-normal">
              For All Kinds of Body Discomfort.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-botanical-800/80 leading-relaxed">
            Formulated as a multi-action topical oil to soothe joints, muscles, tendons, sprains, and daily physical strains.
          </p>
        </div>

        {/* Interactive Target Areas Explorer Card */}
        <div className="mb-10 sm:mb-16 md:mb-20 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 border border-cream-200/90 shadow-luxury">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-cream-200">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-botanical-950">
                Where do you feel stiffness or discomfort?
              </h3>
            </div>
            <span className="text-xs text-botanical-700 bg-cream-100 px-3.5 py-1.5 rounded-full font-medium self-start md:self-auto border border-cream-200">
              Select an area below to view dedicated anatomical illustration
            </span>
          </div>

          {/* ── DESKTOP / LAPTOP VIEW (ORIGINAL SHOWCASE LAYOUT) ── */}
          <div className="hidden lg:block">
            {/* Zones Grid */}
            <div className="grid grid-cols-4 gap-3.5 pt-6">
              {targetZones.map((z) => {
                const isSelected = selectedZone === z.name;
                return (
                  <button
                    key={z.name}
                    type="button"
                    onClick={() => setSelectedZone(z.name)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-300 flex items-center gap-3 border group cursor-pointer ${
                      isSelected
                        ? 'bg-[#748C48]/15 text-botanical-950 border-[#748C48] shadow-md scale-102 ring-2 ring-[#748C48]/30'
                        : 'bg-[#FAF8F5] text-botanical-900 border-cream-200/80 hover:border-[#748C48]/40 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 p-1.5 transition-all ${
                        isSelected
                          ? 'bg-white border border-botanical-300 shadow-xs ring-1 ring-botanical-400/30'
                          : 'bg-white border border-cream-200 shadow-xs group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={z.cutout}
                        alt={z.name}
                        className="w-full h-full object-contain filter drop-shadow-xs"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm truncate ${isSelected ? 'text-botanical-950' : 'text-botanical-900'}`}>{z.name}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? 'text-botanical-700 translate-x-0.5' : 'text-botanical-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[9px] font-mono tracking-wider uppercase block truncate ${
                          isSelected ? 'text-botanical-700 font-semibold' : 'text-botanical-600'
                        }`}
                      >
                        {z.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Zone Detail Showcase Card */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cream-100/90 via-cream-50 to-white border border-botanical-200/80 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              {/* Cutout Display */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border border-cream-300 shadow-sm flex items-center justify-center p-3 shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-botanical-500/10 rounded-3xl pointer-events-none" />
                <img
                  src={currentZone.cutout}
                  alt={currentZone.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Information and Application Guidance */}
              <div className="flex-1 space-y-3 text-left">
                <div className="flex flex-wrap items-center justify-start gap-2.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
                    Target Relief:
                  </span>
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-botanical-950">
                    {currentZone.name} Area Care
                  </h4>
                  <span className="text-[11px] font-mono text-botanical-700 bg-botanical-100 px-3 py-1 rounded-full font-semibold border border-botanical-200">
                    {currentZone.category}
                  </span>
                </div>

                {/* How to use */}
                <div className="bg-white/80 rounded-2xl p-4 border border-cream-200/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-botanical-900 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-gold-dark" />
                    <span>How to Apply</span>
                  </div>
                  <p className="text-xs sm:text-sm text-botanical-950 font-medium leading-relaxed">
                    {currentZone.tip}
                  </p>
                </div>

                {/* Comprehensive Relief Details */}
                <div className="space-y-1.5 text-xs sm:text-sm text-botanical-800 leading-relaxed">
                  <p className="font-medium text-botanical-900">
                    {currentZone.details}
                  </p>
                  <p className="text-botanical-700 italic">
                    💡 {currentZone.highlight}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-botanical-800 text-cream-50 text-xs font-semibold shadow-xs">
                      <Pipette className="w-3.5 h-3.5 text-gold-light" />
                      <span>3 to 5 Concentrated Drops</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream-200/80 text-botanical-800 text-xs font-medium border border-cream-300">
                      <Check className="w-3.5 h-3.5 text-botanical-600" />
                      <span>Apply Morning &amp; Night</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => quickBuyNow(primaryProduct)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 transition-all active:scale-98 border border-[#62773C] cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-white" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE VIEW (ACCORDION STYLE WITH ALL ITEMS CLOSED BY DEFAULT) ── */}
          <div className="block lg:hidden pt-4 space-y-3">
            {targetZones.map((z) => {
              const isExpanded = mobileOpenZone === z.name;
              return (
                <div
                  key={z.name}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-botanical-500 shadow-md ring-2 ring-gold/40'
                      : 'bg-[#FAF8F5] border-cream-200/80 hover:border-botanical-300 hover:bg-white'
                  }`}
                >
                  {/* Clickable Header Button */}
                  <button
                    type="button"
                    onClick={() => setMobileOpenZone(isExpanded ? null : z.name)}
                    className="w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 p-1.5 transition-all ${
                          isExpanded
                            ? 'bg-botanical-50 border border-botanical-300 shadow-2xs'
                            : 'bg-white border border-cream-200 shadow-2xs'
                        }`}
                      >
                        <img
                          src={z.cutout}
                          alt={z.name}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                        />
                      </div>

                      <div className="min-w-0">
                        <span className={`font-bold text-sm block truncate ${isExpanded ? 'text-botanical-950' : 'text-botanical-900'}`}>
                          {z.name}
                        </span>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-botanical-600 block truncate">
                          {z.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExpanded && (
                        <span className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800">
                          Active
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-botanical-700 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Inline Compact Relief Details Box - DIRECTLY UNDER THE SELECTED ITEM */}
                  {isExpanded && (
                    <div className="p-3.5 bg-gradient-to-b from-cream-100/60 to-white border-t border-cream-200 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border border-cream-300 shadow-2xs flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={z.cutout}
                            alt={z.name}
                            className="w-full h-full object-contain filter drop-shadow-xs"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif font-bold text-sm text-botanical-950">
                              {z.name} Area Care
                            </h4>
                            <span className="text-[9px] font-mono uppercase bg-botanical-100 text-botanical-800 px-2 py-0.5 rounded-full font-semibold shrink-0">
                              {z.category}
                            </span>
                          </div>
                          <p className="text-xs text-botanical-800 leading-relaxed font-normal">
                            {z.details}
                          </p>
                        </div>
                      </div>

                      {/* Compact "How to Apply" Box */}
                      <div className="bg-white rounded-xl p-2.5 border border-cream-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-botanical-900 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                          <span>How to Apply</span>
                        </div>
                        <p className="text-xs text-botanical-950 font-medium leading-relaxed">
                          {z.tip}
                        </p>
                      </div>

                      <p className="text-[11px] text-botanical-700 italic">
                        💡 {z.highlight}
                      </p>

                      {/* Action Bar with Buy Now Button directly to checkout */}
                      <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-botanical-700">
                          <Pipette className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          <span>3 to 5 drops</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => quickBuyNow(primaryProduct)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-sm transition-all active:scale-98 border border-[#62773C] cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-white" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 Verified Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedBenefits.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-cream-200/90 shadow-xs hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  {/* Glossy icon — perfectly centered and fitted without any clipping */}
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${b.color} border border-cream-200/80 shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2.5`}>
                    <img
                      src={b.iconImg}
                      alt={b.tag}
                      className="w-full h-full object-contain filter drop-shadow-sm select-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-botanical-700 bg-cream-100 px-2.5 py-1 rounded-full font-semibold border border-cream-200 mt-1">
                    {b.tag}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-botanical-950 mb-1.5 group-hover:text-botanical-700 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-botanical-800/80 leading-relaxed font-normal">
                  {b.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cream-100 flex items-center gap-1.5 text-[11px] font-medium text-botanical-600">
                <Check className="w-3.5 h-3.5 text-botanical-600 shrink-0" />
                <span>Verified Packaging Claim</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
