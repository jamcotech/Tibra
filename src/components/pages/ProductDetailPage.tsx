import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Droplets,
  Leaf,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { storeService } from '../../services/storeService';
import BRAND_CONFIG from '../../config/brandConfig';
import { SeoHead } from '../SeoHead';
import { analyticsService } from '../../services/analyticsService';
import { metaPixelService } from '../../services/metaPixelService';

interface ProductDetailPageProps {
  onOpenOrderModal?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = () => {
  const { addToCart, quickBuyNow } = useShop();
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'usage' | 'faq'>('overview');

  const product = BRAND_CONFIG.mainProduct;
  const storeProd = storeService.getProducts().find(p => p.id === 'tibra-natural-joint-oil-30ml') || {
    id: product.id,
    name: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
  };

  const duoProd = storeService.getProducts().find(p => p.id === 'tibra-natural-joint-oil-bundle-2') || {
    id: 'tibra-natural-joint-oil-bundle-2',
    name: 'TIBRA NATURALS Joint Oil (Duo Pack of 2)',
    price: product.duoPrice,
    originalPrice: product.duoOriginalPrice,
    image: product.boxImage,
  };

  const currentPrice = selectedQty === 1 ? product.price : selectedQty * product.unitPricePerBottleInDuo;
  const currentRegular = selectedQty * product.originalPrice;
  const currentDiscount = currentRegular - currentPrice;
  const currentPercent = Math.round((currentDiscount / currentRegular) * 100);

  useEffect(() => {
    analyticsService.trackViewItem({
      item_id: storeProd.id,
      item_name: storeProd.name,
      price: storeProd.price,
      quantity: 1,
      item_brand: BRAND_CONFIG.brandName,
      item_category: 'Herbal Massage Oils',
    });
    metaPixelService.trackViewContent({
      id: storeProd.id,
      name: storeProd.name,
      price: storeProd.price,
    });
  }, [storeProd.id]);

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [
      `https://www.tibranaturals.com${product.boxImage}`,
      `https://www.tibranaturals.com${product.image}`
    ],
    description: 'Authentic 100% natural herbal blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility and soothing joint massage.',
    sku: product.sku,
    mpn: 'TN-30ML',
    brand: {
      '@type': 'Brand',
      name: BRAND_CONFIG.brandName
    },
    category: product.category,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: '1500',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
        seller: {
          '@type': 'Organization',
          name: BRAND_CONFIG.brandName
        }
      },
      {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: '2600',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        name: 'Duo Pack (2 Bottles - 60ml Total)',
        url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
        seller: {
          '@type': 'Organization',
          name: BRAND_CONFIG.brandName
        }
      }
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.tibranaturals.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://www.tibranaturals.com/products/'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Pain Relief Oil',
        item: 'https://www.tibranaturals.com/products/pain-relief-oil/'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="TIBRA NATURALS Pain Relief Oil | Herbal Massage Oil 30ml Pakistan"
        description="Buy authentic TIBRA NATURALS Pain Relief Oil (30ml). 100% natural herbal formula with Turmeric, Ginger & Boswellia. Cash on Delivery across Pakistan. Rs. 1,500."
        canonicalPath="/products/pain-relief-oil/"
        ogType="product"
        schema={[productSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-400">Products</span>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">Pain Relief Oil</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-cream-100/60 border border-cream-200 p-8 flex items-center justify-center shadow-luxury aspect-square min-h-[320px] sm:min-h-[384px]">
              <img
                src={selectedQty >= 2 ? product.boxImage : product.image}
                alt="TIBRA NATURALS Pain Relief Oil 30ml amber glass dropper bottle with green herbal label"
                width={384}
                height={384}
                className="w-full max-w-[384px] h-auto aspect-square object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
                fetchPriority="high"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#748C48] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                {selectedQty >= 2 ? 'Duo Pack (60 ML)' : '100% Natural Herbal'}
              </span>
            </div>

            {/* Thumbnail Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedQty(1)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedQty === 1
                    ? 'border-[#748C48] bg-white shadow-xs'
                    : 'border-cream-200 bg-white/50 hover:bg-white'
                }`}
              >
                <img src={product.image} alt="Single Bottle 30ml" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs font-bold text-botanical-950">1 Bottle (30 ML)</p>
                  <p className="text-[11px] font-mono text-[#748C48] font-bold">Rs. 1,500</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedQty(2)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedQty >= 2
                    ? 'border-[#748C48] bg-white shadow-xs'
                    : 'border-cream-200 bg-white/50 hover:bg-white'
                }`}
              >
                <img src={product.boxImage} alt="Duo Pack Box" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs font-bold text-botanical-950">Duo Pack (2 Bottles)</p>
                  <p className="text-[11px] font-mono text-[#748C48] font-bold">Rs. 2,600 <span className="text-[9px] text-red-600 bg-red-50 px-1 py-0.2 rounded font-sans">Save 35%</span></p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Formulation & Purchasing */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
                <Leaf className="w-3.5 h-3.5 text-[#748C48]" />
                <span>Botanical Wellness Formula</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
                TIBRA NATURALS Pain Relief Oil – 30ml
              </h1>
              
              <p className="text-xs sm:text-sm text-botanical-700 mt-2 leading-relaxed">
                A soothing, 100% natural botanical topical oil specially formulated with pure Turmeric, Ginger, Wintergreen, Eucalyptus and Frankincense to support everyday joint and muscle comfort during active living.
              </p>
            </div>

            {/* Live Pricing Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#748C48]">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                <span className="text-sm font-mono text-stone-400 line-through">
                  Rs. {currentRegular.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  Save {currentPercent}% (Flat Rs. {currentDiscount.toLocaleString()} OFF)
                </span>
              </div>

              {selectedQty >= 2 && (
                <p className="text-xs text-botanical-800 font-medium">
                  🎉 Special Combo Applied: <strong>Rs. 1,300 per bottle</strong> on 2 or more bottles!
                </p>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2 border-t border-cream-100">
                <span className="text-xs font-bold text-botanical-900">Select Quantity:</span>
                <div className="inline-flex items-center border border-cream-300 rounded-lg bg-[#FAF8F5] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-botanical-800 hover:bg-cream-200 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-botanical-950 font-mono">
                    {selectedQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-botanical-800 hover:bg-cream-200 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-botanical-600">
                  Total: <strong className="text-botanical-950 font-mono">Rs. {currentPrice.toLocaleString()}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const chosen = selectedQty === 2 ? duoProd : storeProd;
                    quickBuyNow(chosen as any, selectedQty === 2 ? 1 : selectedQty);
                  }}
                  className="flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-wider uppercase bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md shadow-[#748C48]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Order Now (Cash on Delivery)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const chosen = selectedQty === 2 ? duoProd : storeProd;
                    addToCart(chosen as any, selectedQty === 2 ? 1 : selectedQty);
                  }}
                  className="py-3 px-6 rounded-full text-xs font-bold tracking-wider uppercase bg-white text-botanical-950 border border-[#748C48]/40 hover:border-[#748C48] hover:bg-cream-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#748C48]" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-botanical-800 font-medium pt-2">
              <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#748C48]" />
                <span>Nationwide COD</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#748C48]" />
                <span>100% Authentic Blend</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex flex-col items-center gap-1">
                <Droplets className="w-4 h-4 text-[#748C48]" />
                <span>30 ML Amber Dropper</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16 bg-white rounded-3xl border border-cream-200 shadow-luxury p-6 sm:p-10">
          <h2 className="sr-only">Detailed Product Overview, Ingredients, and Frequently Asked Questions</h2>
          <div className="flex items-center gap-4 border-b border-cream-200 pb-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Product Overview' },
              { id: 'ingredients', label: 'Verified Ingredients' },
              { id: 'usage', label: 'Directions & Ritual' },
              { id: 'faq', label: 'Questions & Answers' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 px-1 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#748C48] text-[#748C48]'
                    : 'border-transparent text-botanical-600 hover:text-botanical-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-6 text-xs sm:text-sm text-botanical-800 leading-relaxed space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif font-bold text-lg text-botanical-950">
                  Targeted Botanical Comfort for Joints and Muscles
                </h3>
                <p>
                  <strong>TIBRA NATURALS Pain Relief Oil</strong> is formulated for those who value natural mobility and plant-based physical care. Engineered through gentle cold-maceration of authentic rhizomes and pure foliage distillations, it delivers quick warmth and effortless glide across weight-bearing joints.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-cream-200">
                    <p className="font-bold text-botanical-950">Key Botanical Actives:</p>
                    <p className="text-xs text-botanical-700 mt-1">Turmeric Root, Ginger Extract, Wintergreen, Eucalyptus, Boswellia Serrata.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-cream-200">
                    <p className="font-bold text-botanical-950">Packaging Specification:</p>
                    <p className="text-xs text-botanical-700 mt-1">30 ML / 1.01 FL OZ pharmaceutical amber glass with sealed dropper collar.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif font-bold text-lg text-botanical-950">
                  100% Herbal Ingredients Transparency
                </h3>
                <p>
                  We believe complete ingredient transparency is essential in wellness. Every bottle of TIBRA NATURALS Pain Relief Oil contains only authentic botanical extracts:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Curcuma Longa (Turmeric Root):</strong> Traditional golden rhizome celebrated for its soothing properties.</li>
                  <li><strong>Zingiber Officinale (Ginger Root):</strong> Natural heating agent that stimulates topical microcirculation.</li>
                  <li><strong>Wintergreen (Gaultheria Procumbens):</strong> Contains natural methyl salicylate for deep cooling sensations.</li>
                  <li><strong>Eucalyptus Globulus Leaf Oil:</strong> Refreshing aromatic oil that relaxes tension.</li>
                  <li><strong>Boswellia Serrata (Frankincense Resin):</strong> Ancient tree resin supporting flexibility and joint cushion feel.</li>
                  <li><strong>Pure Botanical Carrier Base:</strong> Lightweight plant oils that absorb without stickiness.</li>
                </ul>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif font-bold text-lg text-botanical-950">
                  Directions for Daily Ritual
                </h3>
                <ol className="space-y-2 list-decimal pl-5">
                  <li><strong>Dispense:</strong> Place 3 to 5 warm drops directly onto the clean, dry skin of the targeted area (knees, shoulder, neck, or lower back).</li>
                  <li><strong>Massage:</strong> Gently massage in slow, firm circular motions for 2 to 3 minutes until completely absorbed.</li>
                  <li><strong>Frequency:</strong> Apply twice daily — once in the morning before activity and once at bedtime for overnight relaxation.</li>
                </ol>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Precautions:</strong> For external topical use only. Avoid contact with eyes, broken skin, or mucous membranes. Perform a 24-hour patch test before first use.
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-4 max-w-3xl">
                <div className="space-y-2">
                  <h4 className="font-bold text-botanical-950">Is this suitable for everyday use?</h4>
                  <p className="text-xs text-botanical-700">Yes, it is designed for continuous daily mobility rituals for adults of all activity levels.</p>
                </div>
                <div className="space-y-2 border-t border-cream-100 pt-3">
                  <h4 className="font-bold text-botanical-950">How many days does one 30 ML bottle last?</h4>
                  <p className="text-xs text-botanical-700">With 3 to 5 drops used twice daily on a targeted joint or muscle area, one 30 ML bottle lasts approximately 30 days of continuous application.</p>
                </div>
                <div className="space-y-2 border-t border-cream-100 pt-3">
                  <h4 className="font-bold text-botanical-950">Can I use it on multiple joints (e.g. knees and lower back)?</h4>
                  <p className="text-xs text-botanical-700">Yes. Dispense 3 to 4 drops for each joint area. Customers managing multiple stiffness zones often select the Duo Pack (2 Bottles - 60 ML) to maintain a complete 60-day morning and evening routine.</p>
                </div>
                <div className="space-y-2 border-t border-cream-100 pt-3">
                  <h4 className="font-bold text-botanical-950">Does it leave clothes greasy or stained?</h4>
                  <p className="text-xs text-botanical-700">No. The lightweight cold-extracted carrier lipids absorb smoothly within 2 to 3 minutes of circular massage, leaving skin hydrated with a silky, non-sticky finish.</p>
                </div>
                <div className="space-y-2 border-t border-cream-100 pt-3">
                  <h4 className="font-bold text-botanical-950">How is delivery handled in Pakistan?</h4>
                  <p className="text-xs text-botanical-700">We ship via express courier with Cash on Delivery nationwide. Flat shipping is Rs. 200, typically arriving within 2 to 4 business days.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality & Trust Assurance Guarantee */}
        <section className="mt-12 p-8 rounded-3xl bg-white border border-cream-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#748C48] font-bold">Purity Commitment</span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-botanical-950">
              The TIBRA NATURALS Quality Guarantee
            </h2>
            <p className="text-xs text-botanical-700">
              Every drop is created with reverence for botanical authenticity and physical well-being.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-cream-200 space-y-1">
              <span className="font-serif font-bold text-sm text-botanical-950 block">100% Herbal Actives</span>
              <span className="text-[11px] text-botanical-600 block">Pure roots and essential foliage oils</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-cream-200 space-y-1">
              <span className="font-serif font-bold text-sm text-botanical-950 block">Cold-Macerated</span>
              <span className="text-[11px] text-botanical-600 block">Preserves heat-sensitive phytonutrients</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-cream-200 space-y-1">
              <span className="font-serif font-bold text-sm text-botanical-950 block">UV Amber Glass</span>
              <span className="text-[11px] text-botanical-600 block">Shields terpenes from light oxidation</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-cream-200 space-y-1">
              <span className="font-serif font-bold text-sm text-botanical-950 block">Zero Synthetics</span>
              <span className="text-[11px] text-botanical-600 block">No mineral oils, parabens, or artificial dyes</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
