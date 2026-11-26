/**
 * TIBRA NATURALS - Central Brand & Domain Configuration
 * 
 * Single source of truth for branding, domains, contacts, and SEO defaults.
 * Official brand name must ALWAYS be: "TIBRA NATURALS" (with final 'S').
 * Official website domain: "https://www.tibranaturals.com/"
 */

export const BRAND_CONFIG = {
  // Official Brand Identity
  brandName: 'TIBRA NATURALS',
  brandShortName: 'TIBRA NATURALS',
  brandLegalName: 'Tibra Naturals Botanical Wellness Ltd.',
  brandDisplayTitle: 'TIBRA NATURALS – Natural Relief for Active Living',
  tagline: 'Move Freely. Live Better.',
  subTagline: '100% Herbal & Botanical Joint & Muscle Wellness Oils',
  
  // Official Domains & Localization
  websiteUrl: 'https://www.tibranaturals.com/',
  canonicalDomain: 'https://www.tibranaturals.com',
  defaultCountry: 'Pakistan',
  defaultCountryCode: 'PK',
  defaultLanguage: 'en-PK',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  
  // Contact & Verification Details
  supportEmail: 'orders@tibranaturals.com',
  infoEmail: 'info@tibranaturals.com',
  supportPhone: '+92 300 1234567',
  whatsappNumber: '+923001234567',
  whatsappDisplay: '+92 300 1234567',
  address: {
    street: 'Tibra Naturals Wellness Complex, Industrial Area',
    city: 'Lahore',
    region: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan'
  },
  
  // Social Profiles
  social: {
    facebook: 'https://www.facebook.com/tibranaturals',
    instagram: 'https://www.instagram.com/tibranaturals',
    tiktok: 'https://www.tiktok.com/@tibranaturals',
    youtube: 'https://www.youtube.com/@tibranaturals',
  },
  
  // Core Product Reference
  mainProduct: {
    id: 'tibra-naturals-pain-relief-oil-30ml',
    sku: 'TN-PRO-030',
    name: 'TIBRA NATURALS Pain Relief Oil',
    title: 'TIBRA NATURALS Pain Relief Oil (30 ML Bottle)',
    shortName: 'Pain Relief Oil',
    size: '30 ML',
    price: 1500,
    originalPrice: 1990,
    duoPrice: 2600,
    duoOriginalPrice: 3980,
    unitPricePerBottleInDuo: 1300,
    category: 'Herbal Massage Oils',
    image: '/assets/purefix-bottle-transparent.webp',
    boxImage: '/assets/purefix-bottle-box-showcase.webp',
    availability: 'https://schema.org/InStock',
    keyIngredients: [
      'Turmeric (Curcuma Longa)',
      'Ginger Root (Zingiber Officinale)',
      'Wintergreen Essential Oil',
      'Eucalyptus Globulus Leaf Oil',
      'Indian Frankincense (Boswellia Serrata)',
      'Pure Sesame Seed Base Oil',
      'Camphor Bark Extract',
      'Clove Bud Oil'
    ]
  },
  
  // Global Meta Defaults
  meta: {
    defaultTitle: 'TIBRA NATURALS | Herbal Oils & Natural Personal Care in Pakistan',
    defaultDescription: 'Discover TIBRA NATURALS, Pakistan’s authentic herbal wellness brand offering natural botanical pain relief massage oils for joints, mobility, and active living.',
    defaultKeywords: 'TIBRA NATURALS, pain relief oil Pakistan, herbal massage oil, joint massage oil, joron ke dard ka oil, natural wellness oils Pakistan',
    defaultOgImage: 'https://www.tibranaturals.com/assets/tibra-logo.png',
  }
} as const;

export default BRAND_CONFIG;
