# TIBRA NATURALS – Official Branding Audit & Standardization Guide

**Official Brand Name:** TIBRA NATURALS  
**Exact Casing:** TIBRA NATURALS (All Caps in Primary Badges/Headings, Title Case in Body: Tibra Naturals)  
**Strict Rule:** Always with terminal "S" (`NATURALS`). Never "TIBRA NATURAL" or "TIBRA".  
**Official Domain:** `https://www.tibranaturals.com/`  
**Official Tagline:** *Natural Relief for Active Living*  

---

## 1. Outdated Branding Elements Identified

| Legacy Element | Where Found in Codebase | Required Official Replacement |
| :--- | :--- | :--- |
| `PureFix` / `Pure Fix` | Legacy filenames, event triggers, comments, CSS fallback classes | `TIBRA NATURALS` in UI; clean modern naming |
| `Tibra Natural` | Page titles, product titles, schema, footer, checkout text, modals | `TIBRA NATURALS` / `Tibra Naturals` |
| `admin@tibranatural.com` | Login page default placeholder, admin user record | `admin@tibranaturals.com` |
| `orders@tibranatural.pk` | Settings defaults in storeService | `orders@tibranaturals.com` |
| `purefix_products_updated` | Custom window events in admin CRM | Kept as internal backward-compat listener or upgraded to `tibra_products_updated` |
| `bottle.png` (956KB legacy) | Public assets directory | Modern optimized web assets with descriptive filenames (`tibra-naturals-pain-relief-oil-30ml.png`) |

---

## 2. Central Brand Identity Configuration

To eliminate fragmentation, all components must consume one central configuration file located at:  
`src/config/brandConfig.ts`

```typescript
export const BRAND_CONFIG = {
  brandName: 'TIBRA NATURALS',
  brandShortName: 'TIBRA NATURALS',
  tagline: 'Natural Relief for Active Living',
  websiteUrl: 'https://www.tibranaturals.com/',
  canonicalDomain: 'https://www.tibranaturals.com',
  defaultCountry: 'Pakistan',
  defaultLanguage: 'en-PK',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  supportEmail: 'orders@tibranaturals.com',
  supportPhone: '+92 300 1234567',
  whatsappNumber: '+92 300 1234567',
  social: {
    facebook: 'https://www.facebook.com/tibranaturals',
    instagram: 'https://www.instagram.com/tibranaturals',
    tiktok: 'https://www.tiktok.com/@tibranaturals',
    youtube: 'https://www.youtube.com/@tibranaturals',
  },
  meta: {
    defaultTitle: 'TIBRA NATURALS | Herbal Oils & Natural Personal Care in Pakistan',
    defaultDescription: 'Discover TIBRA NATURALS, Pakistan’s premium herbal wellness brand offering natural botanical pain relief oils for active living and everyday mobility.',
    defaultOgImage: 'https://www.tibranaturals.com/assets/tibra-logo.png',
  }
} as const;
```

---

## 3. Visual Assets & Favicon Architecture

1. **Logo Standardization:**
   - Display typography: **TIBRA NATURALS** (with clear subtext *THE HERBAL STORE* or *BOTANICAL WELLNESS*).
   - Desktop and Mobile headers must load `tibra-logo-white.png` or `tibra-logo.png` with standard crawlable `alt="TIBRA NATURALS Official Logo"`.
2. **Favicon Set:**
   - `favicon.ico` (multi-resolution 16x16, 32x32)
   - `favicon.svg` (scalable vector icon with green botanical leaf)
   - `apple-touch-icon.png` (180x180 for iOS Safari home screen)
   - `manifest.json` / web app manifest declaration
