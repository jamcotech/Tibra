import React, { useState } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Droplets,
  Leaf,
  ShoppingCart,
  ShoppingBag,
  Truck,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { storeService } from '../../services/storeService';
import BRAND_CONFIG from '../../config/brandConfig';
import { SeoHead } from '../SeoHead';

interface ProductsPageProps {
  onOpenOrderModal?: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenOrderModal }) => {
  const { addToCart, quickBuyNow, navigate } = useShop();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dynamically load active catalog products
  const allProducts = storeService.getProducts();

  // Distinct primary products (future scalable: each distinct formulation renders as a card)
  // By default, excludes multi-pack bundle aliases so each unique product formulation gets its own card.
  const catalogProducts = allProducts.filter(p => !p.id.includes('bundle') && !p.id.includes('family'));
  const displayProducts = catalogProducts.length > 0 ? catalogProducts : [allProducts[0]];

  const handleAddToCart = (product: typeof displayProducts[0]) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  const breadcrumbSchema = {
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
      }
    ]
  };

  const collectionSchema = {
    '@type': 'CollectionPage',
    name: 'Herbal Products & Natural Formulations | TIBRA NATURALS Pakistan',
    url: 'https://www.tibranaturals.com/products/',
    description: 'Explore authentic botanical wellness formulations from TIBRA NATURALS Pakistan. 100% natural herbal joint comfort and massage oils.',
    provider: {
      '@type': 'Organization',
      name: BRAND_CONFIG.brandName
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: displayProducts.length,
      itemListElement: displayProducts.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        url: 'https://www.tibranaturals.com/products/pain-relief-oil/'
      }))
    }
  };

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbSchema, collectionSchema]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Our Herbal Products | TIBRA NATURALS Pakistan"
        description="Explore authentic botanical wellness formulations from TIBRA NATURALS Pakistan. 100% natural herbal joint comfort and massage oils."
        canonicalPath="/products/"
        schema={pageSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs text-botanical-600 mb-6 sm:mb-8 font-medium"
          aria-label="Breadcrumb"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
            className="hover:text-botanical-950 transition-colors"
          >
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">
            Products
          </span>
        </nav>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Botanical Formulations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Our Herbal Products
            <span className="block italic text-[#748C48] font-normal font-serif text-2xl sm:text-3xl md:text-4xl mt-1">
              Natural Relief for Active Living
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed max-w-2xl">
            Explore authentic botanical massage oils handcrafted with 100% natural extracts. Cold-extracted, sealed in UV-protective amber glass, and delivered with Cash on Delivery across Pakistan.
          </p>
        </div>

        {/* Dynamic Products Grid — Scalable for 1, 2, 3 or more products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => {
            const isSingleOil = product.id.includes('30ml') || product.id.includes('pain-relief');
            const productHref = '/products/pain-relief-oil/';

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-cream-200/80 shadow-sm hover:shadow-xl hover:border-botanical-300 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Product Card Image Showcase */}
                <div className="relative aspect-square sm:aspect-[4/3] bg-gradient-to-b from-[#F7F4EE] to-[#EFEAE1] p-6 flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F2612] text-[#F5E6A3] shadow-xs">
                      {product.badge || '100% Natural'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Cold-Extracted
                    </span>
                  </div>

                  {/* Volume / Size Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/90 text-botanical-900 shadow-xs border border-cream-200">
                      {product.size || '30 ML'}
                    </span>
                  </div>

                  {/* Clickable Image linking to Product Detail */}
                  <a
                    href={productHref}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('product-detail');
                    }}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={`${product.name} herbal joint oil`}
                      width={240}
                      height={256}
                      className="max-h-56 sm:max-h-64 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                      loading="lazy"
                    />
                  </a>
                </div>

                {/* Product Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Star Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs text-botanical-700">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-botanical-900">{product.rating || 4.9}</span>
                      <span className="text-botanical-500">({product.reviewsCount || 384}+ Reviews)</span>
                    </div>

                    {/* Product Title */}
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-botanical-950 group-hover:text-[#748C48] transition-colors leading-snug">
                      <a
                        href={productHref}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('product-detail');
                        }}
                      >
                        {product.name}
                      </a>
                    </h2>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-botanical-700 line-clamp-3 leading-relaxed">
                      {product.description ||
                        '100% natural herbal blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility and soothing joint massage.'}
                    </p>

                    {/* Key Ingredients Pill List */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-botanical-800 border border-cream-200">
                        Turmeric (Curcuma)
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-botanical-800 border border-cream-200">
                        Ginger Root
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-botanical-800 border border-cream-200">
                        Boswellia
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-botanical-800 border border-cream-200">
                        Wintergreen
                      </span>
                    </div>

                    {/* Duo Pack Special Notice (Available Option) */}
                    {isSingleOil && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-amber-900 leading-tight">
                          <strong className="font-bold">Duo Pack Available:</strong> Get 2 Bottles (60 ML) for{' '}
                          <span className="font-bold text-amber-950 font-mono">Rs. 2,600</span>{' '}
                          <span className="text-emerald-700 font-bold">(Save Rs. 1,380)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA Controls */}
                  <div className="pt-4 border-t border-cream-200/80 space-y-3">
                    {/* Price Row */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-2xl font-serif font-bold text-botanical-950">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="line-through text-botanical-500 font-mono">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-emerald-700 font-bold">
                              Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          In Stock (COD)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: View Product + Add to Cart */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={productHref}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('product-detail');
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold border border-botanical-900 text-botanical-900 hover:bg-botanical-900 hover:text-white transition-colors cursor-pointer text-center"
                      >
                        <span>View Product</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          addedId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#748C48] text-white hover:bg-[#5C7036]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{addedId === product.id ? 'Added to Cart!' : 'Add to Cart'}</span>
                      </button>
                    </div>

                    {/* Quick Cash on Delivery Buy Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenOrderModal) {
                          onOpenOrderModal();
                        } else {
                          quickBuyNow(product, 1);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1F2612] text-[#F5E6A3] hover:bg-black transition-colors cursor-pointer shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#F5E6A3]" />
                      <span>Order via Cash on Delivery</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand Assurance / Trust Signals Bar */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-cream-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-cream-200/80 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-botanical-100 text-[#748C48] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-botanical-950">Nationwide COD</h4>
                <p className="text-xs text-botanical-600 mt-0.5">
                  Cash on Delivery to Lahore, Karachi, Islamabad & across Pakistan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-cream-200/80 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-botanical-100 text-[#748C48] shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-botanical-950">100% Herbal Purity</h4>
                <p className="text-xs text-botanical-600 mt-0.5">
                  Natural botanical extracts. Zero mineral oils or synthetic chemicals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-cream-200/80 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-botanical-100 text-[#748C48] shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-botanical-950">UV Defense Amber Glass</h4>
                <p className="text-xs text-botanical-600 mt-0.5">
                  Sealed in 30 ML pharmaceutical glass with precise metered dropper.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-cream-200/80 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-botanical-100 text-[#748C48] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-botanical-950">7-Day Transit Guarantee</h4>
                <p className="text-xs text-botanical-600 mt-0.5">
                  Inspection upon delivery & prompt replacement for damaged transit.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
