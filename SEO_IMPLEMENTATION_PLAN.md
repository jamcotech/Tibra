# TIBRA NATURALS – Technical SEO Implementation Plan

**Objective:** Transform `https://www.tibranaturals.com/` into a fully crawlable, search-engine-ready, mobile-first e-commerce powerhouse with complete schema markup, dedicated SEO routes, clean branding, and automated indexation workflows.

---

## 1. Phase Breakdown & Execution Stages

### Stage 1: Brand Standardization & Configuration
- [x] Create `src/config/brandConfig.ts` with canonical constants (`TIBRA NATURALS`, `https://www.tibranaturals.com/`, `en-PK`, `Pakistan`).
- [x] Replace outdated `PureFix` and `Tibra Natural` references across customer-facing UI components (`Navbar`, `Footer`, `HeroSection`, `BrandStorySection`, `PackagingShowcaseSection`, `CartPage`, `CheckoutPage`, `OrderInquiryModal`).

### Stage 2: Technical Crawl Infrastructure
- [x] Deploy `/public/robots.txt` granting full crawl access to public routes while protecting `/admin` and private utility URLs.
- [x] Deploy `/public/sitemap.xml` with real lastmod timestamps covering all indexable URLs.
- [x] Add canonical tag, DNS prefetch, and standardized meta tags in `index.html`.

### Stage 3: Multi-Route SEO Architecture
- [x] Introduce an HTML5 pushState client router supporting direct URLs:
  - `/` (Home)
  - `/about-us/`
  - `/products/pain-relief-oil/`
  - `/ingredients/`
  - `/how-to-use/`
  - `/our-quality/`
  - `/blog/` (Content Hub + 4 educational guides)
  - `/faq/`
  - `/contact-us/`
  - `/shipping-policy/`, `/return-policy/`, `/privacy-policy/`, `/terms-and-conditions/`
- [x] Ensure browser navigation (Back/Forward), direct bookmarking, and link clicks load the respective view with zero page reload glitches.

### Stage 4: Dynamic Head & Structured Data Engine
- [x] Create `SeoHead.tsx` component to dynamically inject route-specific:
  - Document Title
  - Meta Description & Keywords
  - Canonical Link
  - Open Graph & Twitter Cards
  - JSON-LD Structured Data (`Organization`, `WebSite`, `Product`, `BreadcrumbList`, `Article`, `FAQPage`)

### Stage 5: Image Optimization & Web Vitals
- [x] Add descriptive `alt` tags and `loading="lazy"` across images.
- [x] Add high-priority loading for hero assets.
- [x] Enforce aspect-ratio placeholders to eliminate Cumulative Layout Shift (CLS).

### Stage 6: Analytics & Conversion Tracking
- [x] Build `src/services/analyticsService.ts` providing e-commerce GA4 tracking hooks (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `whatsapp_click`).

### Stage 7: Deliverables & Verification
- [x] Generate all 14 required SEO strategy, indexing, and architecture deliverables.
- [x] Run `npm run build` to confirm 100% TypeScript compilation and Vite bundling success.
- [x] Commit and push changes to GitHub repository.
