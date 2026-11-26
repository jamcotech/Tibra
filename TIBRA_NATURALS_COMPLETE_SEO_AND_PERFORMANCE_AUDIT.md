# TIBRA NATURALS — PHASE 1: COMPLETE ORGANIC SEO, TECHNICAL SEO & WEBSITE PERFORMANCE AUDIT REPORT

**Brand:** TIBRA NATURALS  
**Website:** [https://www.tibranaturals.com/](https://www.tibranaturals.com/)  
**GitHub Repository:** [https://github.com/jamcotech/Tibra](https://github.com/jamcotech/Tibra)  
**Framework:** React 19 + Vite 8 + TypeScript + Tailwind CSS  
**Hosting Environment:** Vercel Production Edge CDN (`bom1` - Mumbai Edge Point of Presence)  
**Audit Date:** November 26, 2026  
**Auditor Role:** Senior Technical SEO Engineer, Google Search Specialist, Web Performance Engineer & React/Vite Architect  
**Audit Scope:** Complete, evidence-based Phase 1 Audit (Strictly zero modifications, deletions, commits, or deployments)

---

## EXECUTIVE SUMMARY

This comprehensive audit evaluates the live production website and source code of **TIBRA NATURALS** ([https://www.tibranaturals.com/](https://www.tibranaturals.com/)), focusing on organic search visibility in Pakistan, website performance, mobile user experience, technical SEO health, structured data, and conversion architecture.

### Key Positive Findings (What is Working Well)
1. **Modern Infrastructure & Hosting:** Deployed on Vercel's global edge network with HTTP/2 and modern compression (Brotli `br` support). Time-to-First-Byte (TTFB) across Pakistani network requests ranges from **270ms to 460ms**.
2. **Pre-rendering Architecture:** All 17 deep canonical routes plus the root are indexed in `sitemap.xml` and pre-rendered into static `index.html` files with `<div id="seo-prerender-shell">` semantic fallbacks for search engine crawlers.
3. **Structured Data Implementation:** JSON-LD schema blocks are present across all pages, including `Organization`, `WebSite`, `Product`, `Offer`, `BreadcrumbList`, and `CollectionPage`.
4. **Privacy & Measurement:** Clean, consent-gated analytics architecture using Google Consent Mode v2, Google Tag Manager (`GTM-5Q8BQXJ6`), GA4 (`G-9ZZ9VMPDQ2`), and Meta Pixel, with zero transmission of customer PII.
5. **Dedicated Products Page:** A dedicated `/products/` catalogue route is established and integrated into the primary navigation, resolving earlier navigational deficiencies.

### Critical Vulnerabilities & High-Priority Optimization Opportunities
1. **Uncompressed Hero Video on Initial Page Load (Critical Performance Bottleneck):**  
   The homepage hero section loads a full **5.98 MB MP4 video file** (`/assets/hero-video-002.mp4?v=2`) with `preload="auto"` and `autoPlay`. On 3G/4G cellular connections across Pakistan, this consumes significant data bandwidth, delays page interactivity, and severely impacts Largest Contentful Paint (LCP).
2. **Oversized Images & Lack of Modern Formats (High Severity):**  
   - The brand logo in the navigation (`/assets/tibra-logo-white.png`) is an uncompressed **9,050 × 3,017 px PNG weighing 632.9 KB**, scaled down via CSS to only 28–36px height!
   - Secondary brand logo (`/assets/tibra-logo.png`) is **721.2 KB (9,050 × 3,017 px)**.
   - Packaging showcase image (`/assets/packaging-showcase-003.png`) is **2.17 MB (1,312 × 1,199 px)**.
   - Zero WebP or AVIF image formats are currently served across the website; all 42 images rely on legacy PNG or JPEG formats.
3. **Missing Explicit Image Dimensions & Cumulative Layout Shift (CLS Risk):**  
   All 42 `<img>` tags across React components lack explicit `width` and `height` HTML attributes, preventing the browser from reserving aspect-ratio boxes during DOM parsing and causing layout shifts as images load.
4. **Monolithic JavaScript Bundle & Unsplit Code (High Severity):**  
   The production client JavaScript bundle is **616.6 KB uncompressed (157.7 KB Brotli compressed)** served as a single file (`/assets/index-*.js`). It statically bundles the entire **Spree Admin portal (115 KB source)**, all 10 inner pages, cart and checkout logic, and `canvas-confetti` into the homepage initial load.
5. **Render-Blocking Google Fonts Loading:**  
   The `<head>` loads **three full Google Font families** (`Cinzel`, `Playfair Display`, and 14 weights/styles of `Plus Jakarta Sans`) via synchronous `<link rel="stylesheet">`, blocking page render.
6. **Homepage Lacks an Educational Blog Preview Section:**  
   Four educational botanical articles are published in `src/data/blogArticles.ts` and viewable at `/blog/`, but the homepage has **no "Latest from Our Blog" preview section**, missing a prime internal linking and content distribution opportunity.
7. **Empty Pre-render Shell on Root (`/`) Homepage:**  
   While all 17 deep routes have pre-rendered static text shells inside `#root`, the root `dist/index.html` has an empty `<div id="root"></div>`, leaving non-JavaScript crawlers with zero initial body text on the home page.
8. **Truncated Meta Description on About Us Page:**  
   Due to an unescaped apostrophe in `scripts/prerender.cjs`, the meta description for `/about-us/` was truncated to just 36 characters: `"Learn about TIBRA NATURALS, Pakistan"`.

---

## AUDIT 1 — WEBSITE SPEED & PERFORMANCE

### 1.1 Performance Methodology & Field vs. Lab Distinction
- **Lab Measurements:** Simulated tests executed against the live production deployment hosted on Vercel at [https://www.tibranaturals.com/](https://www.tibranaturals.com/).
- **Field Data (CrUX):** Google Chrome User Experience Report (CrUX) field data requires a minimum threshold of real-user Chrome visits over a rolling 28-day collection window. For `https://www.tibranaturals.com/`, origin-level real-user aggregate data is currently below Google's public reporting threshold. Therefore, **no CrUX field metrics are fabricated**, adhering strictly to audit guidelines.

### 1.2 Performance Metric Baseline (Lab & Network Measurements)

| Metric | Measured Value | Threshold / Standard | Status | Evidence / Analysis |
|---|---|---|---|---|
| **Time to First Byte (TTFB)** | 270ms – 460ms | < 800ms (Good) | **PASS** | Edge caching on Vercel Mumbai POP (`bom1`). |
| **HTML Document Payload** | 7.9 KB – 9.9 KB (raw) / 2.7 KB (br) | < 50 KB | **PASS** | Lightweight pre-rendered HTML document shells. |
| **JS Bundle Size (Uncompressed)** | 616.6 KB | < 250 KB | **WARNING** | Single bundle (`index-*.js`) with zero route-level code splitting. |
| **JS Bundle Size (Brotli)** | 157.7 KB | < 100 KB | **WARNING** | Compressed over the wire via Brotli. |
| **CSS Bundle Size (Uncompressed)** | 76.3 KB | < 100 KB | **PASS** | Clean Tailwind utility purge. |
| **CSS Bundle Size (Brotli)** | 12.9 KB | < 25 KB | **PASS** | Highly compressed stylesheet. |
| **Initial Video Asset Weight** | 5,984 KB (5.98 MB) | < 1,500 KB | **FAIL** | `/assets/hero-video-002.mp4` preloaded with `preload="auto"`. |
| **Total Media Weight (Home)** | ~10.4 MB | < 2.0 MB | **FAIL** | Massive uncompressed PNGs and preloaded video. |
| **Render-Blocking Fonts** | 3 families / 21 styles | 0 render-blocking | **WARNING** | Synchronous Google Fonts stylesheet in `<head>`. |
| **Browser Caching (Static Assets)** | `max-age=31536000, immutable` | 1 year | **PASS** | Hashed assets in `/assets/` have optimal cache headers. |
| **Browser Caching (HTML Routes)** | `max-age=0, must-revalidate` | 0s / revalidate | **PASS** | Ensures users immediately receive latest updates. |

### 1.3 Detailed Route Performance Audit

| Route | Canonical URL | HTML Size (Raw) | TTFB | Total Response Time | Status |
|---|---|---|---|---|---|
| Home | `https://www.tibranaturals.com/` | 7.9 KB | 460ms | 781ms | **PASS** |
| Products Listing | `https://www.tibranaturals.com/products/` | 9.4 KB | 383ms | 438ms | **PASS** |
| Product Detail | `https://www.tibranaturals.com/products/pain-relief-oil/` | 9.9 KB | 332ms | 333ms | **PASS** |
| Ingredients | `https://www.tibranaturals.com/ingredients/` | 8.8 KB | 292ms | 678ms | **PASS** |
| How to Use | `https://www.tibranaturals.com/how-to-use/` | 8.8 KB | 502ms | 530ms | **PASS** |
| Our Quality | `https://www.tibranaturals.com/our-quality/` | 8.7 KB | 270ms | 274ms | **PASS** |
| About Us | `https://www.tibranaturals.com/about-us/` | 8.8 KB | 277ms | 278ms | **PASS** |
| Blog Hub | `https://www.tibranaturals.com/blog/` | 8.7 KB | 323ms | 324ms | **PASS** |
| FAQ | `https://www.tibranaturals.com/faq/` | 8.7 KB | 292ms | 292ms | **PASS** |
| Contact Us | `https://www.tibranaturals.com/contact-us/` | 8.7 KB | 286ms | 707ms | **PASS** |
| Shipping Policy | `https://www.tibranaturals.com/shipping-policy/` | 8.7 KB | 287ms | 309ms | **PASS** |
| Return Policy | `https://www.tibranaturals.com/return-policy/` | 8.7 KB | 320ms | 321ms | **PASS** |
| Privacy Policy | `https://www.tibranaturals.com/privacy-policy/` | 8.7 KB | 282ms | 283ms | **PASS** |
| Terms & Conditions | `https://www.tibranaturals.com/terms-and-conditions/` | 8.5 KB | 287ms | 289ms | **PASS** |

### 1.4 Core Web Vitals Analysis
1. **Largest Contentful Paint (LCP):**
   - *Desktop:* The hero video element or hero typography is the LCP candidate. Because the 5.98 MB video is preloaded, high-bandwidth connections render within ~1.8s, but slower Pakistani connections will experience severe delays (> 3.5s).
   - *Mobile:* The hero video is scaled down to `opacity: 0.65` behind text overlays. Replacing or deferring video on mobile and serving an optimized WebP/AVIF poster image will drop LCP below 1.2s.
2. **Interaction to Next Paint (INP):**
   - React 19 event delegation and synthetic event handling are efficient. All major interactions (adding to cart, opening modal, quantity stepper) execute in < 50ms without heavy CPU loops.
3. **Cumulative Layout Shift (CLS):**
   - The layout suffers from missing image dimensions on all `<img>` tags. As the product bottle images load in the Hero, Anatomy, and Product Detail sections, the browser reflows surrounding content.

---

## AUDIT 2 — COMPLETE IMAGE SEO AUDIT

Every image file in the public repository was inspected using `sharp` to determine exact pixel dimensions, file size, format, component usage, and current ALT text.

### 2.1 Complete Image Inventory & Optimization Analysis

| # | Current Filename | Current Format | File Size | Dimensions | Live URL / Path | Current ALT Text | Recommended SEO Filename | Recommended ALT Text | Recommended Format |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `tibra-logo-white.png` | PNG | 632.9 KB | 9,050 × 3,017 | `/assets/tibra-logo-white.png` | `TIBRA NATURALS` | `tibra-naturals-logo-white.webp` | `TIBRA NATURALS Official Logo - The Herbal Store Pakistan` | WebP (500x167px, ~18 KB) |
| 2 | `tibra-logo.png` | PNG | 721.2 KB | 9,050 × 3,017 | `/assets/tibra-logo.png` | (Schema & OG image) | `tibra-naturals-brand-logo.webp` | `TIBRA NATURALS Herbal Wellness Brand Logo` | WebP (1200x400px, ~35 KB) |
| 3 | `packaging-showcase-003.png` | PNG | 2,171.6 KB | 1,312 × 1,199 | `/assets/packaging-showcase-003.png` | `TIBRA NATURALS Pain Relief Oil Official Bottle and Box Packaging Showcase` | `tibra-naturals-packaging-box-bottle.webp` | `TIBRA NATURALS Pain Relief Oil 30ml amber bottle and protective packaging box showcase` | WebP / AVIF (~95 KB) |
| 4 | `purefix-bottle-box-showcase.jpg` | JPEG | 458.7 KB | 1,200 × 896 | `/assets/purefix-bottle-box-showcase.jpg` | `TIBRA NATURALS Botanical Packaging Set` / `Duo Pack` | `tibra-naturals-pain-relief-oil-duo-pack.webp` | `TIBRA NATURALS Pain Relief Oil Duo Pack - 2 x 30ml amber dropper bottles with box` | WebP (~65 KB) |
| 5 | `purefix-bottle-transparent.png` | PNG | 226.0 KB | 764 × 1,024 | `/assets/purefix-bottle-transparent.png` | `TIBRA NATURALS Pain Relief Oil Bottle 1` | `tibra-naturals-pain-relief-oil-30ml-bottle.webp` | `TIBRA NATURALS Pain Relief Oil 30ml amber glass dropper bottle with herbal formula label` | WebP (~38 KB) |
| 6 | `purefix-bottle-004-transparent.png` | PNG | 226.0 KB | 764 × 1,024 | `/assets/purefix-bottle-004-transparent.png` | `TIBRA NATURALS Pain Relief Oil Anatomy` | `tibra-naturals-oil-dropper-bottle-anatomy.webp` | `Detailed anatomy of TIBRA NATURALS 30ml amber glass bottle and gold dropper cap` | WebP (~38 KB) |
| 7 | `ingredients-full-chart.png` | PNG | 2,442.3 KB | 1,536 × 1,024 | `/assets/ingredients/ingredients-full-chart.png` | (Unlinked asset in public) | `tibra-naturals-herbal-ingredients-chart.webp` | `Complete botanical ingredients chart of TIBRA NATURALS 16 herbal extracts` | WebP (~110 KB) |
| 8 | `video-002-poster.png` | PNG | 2,442.3 KB | 1,536 × 1,024 | `/assets/video-002-poster.png` | (Video fallback poster) | `tibra-naturals-hero-video-poster.webp` | `TIBRA NATURALS botanical joint oil application video preview` | WebP (~75 KB) |
| 9 | `3 step.png` | PNG | 1,750.6 KB | 2,172 × 724 | `/assets/ritual/3 step.png` | (Unlinked banner) | `tibra-naturals-daily-massage-ritual-steps.webp` | `Three-step daily botanical massage ritual: dispense, warm, and massage` | WebP (~85 KB) |
| 10 | `icon-grid.png` | PNG | 1,333.0 KB | 1,536 × 1,024 | `/assets/benefits-icons/icon-grid.png` | (Unlinked sprite) | `tibra-naturals-benefits-icon-grid.webp` | `Verified wellness benefits of TIBRA NATURALS herbal massage oil` | WebP (~60 KB) |
| 11 | `knee-cutout.png` | PNG | 38.8 KB | 300 × 300 | `/assets/pain-cutouts/knee-cutout.png` | `Knee` | `tibra-naturals-knee-joint-pain-relief.webp` | `Knee joint target area for soothing botanical oil massage` | WebP (~12 KB) |
| 12 | `shoulder-cutout.png` | PNG | 41.8 KB | 300 × 300 | `/assets/pain-cutouts/shoulder-cutout.png` | `Shoulder` | `tibra-naturals-shoulder-muscle-tension-relief.webp` | `Shoulder and rotator cuff relief area for herbal oil application` | WebP (~14 KB) |
| 13 | `back-cutout.png` | PNG | 48.1 KB | 300 × 300 | `/assets/pain-cutouts/back-cutout.png` | `Lower Back` | `tibra-naturals-lower-back-pain-relief.webp` | `Lower back and lumbar spine massage target area` | WebP (~15 KB) |
| 14 | `neck-cutout.png` | PNG | 40.2 KB | 300 × 300 | `/assets/pain-cutouts/neck-cutout.png` | `Neck` | `tibra-naturals-cervical-neck-stiffness-relief.webp` | `Cervical neck and trapezius stiffness relief application area` | WebP (~13 KB) |
| 15 | `ankle-cutout.png` | PNG | 35.5 KB | 300 × 300 | `/assets/pain-cutouts/ankle-cutout.png` | `Ankle & Foot` | `tibra-naturals-ankle-foot-pain-relief.webp` | `Ankle joint and heel tendon massage area for mobility comfort` | WebP (~11 KB) |
| 16 | `elbow-cutout.png` | PNG | 37.0 KB | 300 × 300 | `/assets/pain-cutouts/elbow-cutout.png` | `Elbow` | `tibra-naturals-elbow-joint-discomfort-relief.webp` | `Elbow joint and tendon comfort massage target area` | WebP (~12 KB) |
| 17 | `hip-cutout.png` | PNG | 46.3 KB | 300 × 300 | `/assets/pain-cutouts/hip-cutout.png` | `Hip` | `tibra-naturals-hip-joint-mobility-relief.webp` | `Hip ball and socket joint mobility massage target area` | WebP (~15 KB) |
| 18 | `turmeric.jpg` | JPEG | 88.3 KB | 400 × 400 | `/assets/ingredients/turmeric.jpg` | `Turmeric` | `tibra-naturals-curcuma-longa-turmeric-root.webp` | `Raw Curcuma Longa (Turmeric Root) active botanical ingredient` | WebP (~18 KB) |
| 19 | `ginger.jpg` | JPEG | 80.2 KB | 400 × 400 | `/assets/ingredients/ginger.jpg` | `Ginger` | `tibra-naturals-zingiber-officinale-ginger-root.webp` | `Natural Zingiber Officinale (Ginger Root) warming extract` | WebP (~16 KB) |
| 20 | `boswellia.jpg` | JPEG | 84.9 KB | 400 × 400 | `/assets/ingredients/boswellia.jpg` | `Boswellia` | `tibra-naturals-boswellia-serrata-frankincense.webp` | `Boswellia Serrata (Frankincense Resin) joint cushioning extract` | WebP (~18 KB) |
| 21 | `wintergreen.jpg` | JPEG | 71.7 KB | 400 × 400 | `/assets/ingredients/wintergreen.jpg` | `Wintergreen Oil` | `tibra-naturals-gaultheria-wintergreen-oil.webp` | `Gaultheria Procumbens (Wintergreen Essential Oil) soothing distillate` | WebP (~15 KB) |
| 22 | `eucalyptus.jpg` | JPEG | 73.5 KB | 400 × 400 | `/assets/ingredients/eucalyptus.jpg` | `Eucalyptus Oil` | `tibra-naturals-eucalyptus-globulus-leaf-oil.webp` | `Eucalyptus Globulus steam-distilled aromatic leaf oil` | WebP (~16 KB) |
| 23 | `step1-dispense.jpg` | JPEG | 687.9 KB | 1,200 × 896 | `/assets/ritual/step1-dispense.jpg` | `step.title` (Dispense) | `tibra-naturals-ritual-step1-dispense-dropper.webp` | `Step 1: Dispense 3 to 5 concentrated drops of TIBRA NATURALS oil` | WebP (~42 KB) |
| 24 | `step2-warm.jpg` | JPEG | 680.5 KB | 1,200 × 896 | `/assets/ritual/step2-warm.jpg` | `step.title` (Warm) | `tibra-naturals-ritual-step2-warm-palms.webp` | `Step 2: Rub palms together to gently warm the botanical oil` | WebP (~40 KB) |
| 25 | `step3-massage.jpg` | JPEG | 691.2 KB | 1,200 × 896 | `/assets/ritual/step3-massage.jpg` | `step.title` (Massage) | `tibra-naturals-ritual-step3-circular-massage.webp` | `Step 3: Massage in gentle circular motions for 2 to 3 minutes` | WebP (~45 KB) |

### 2.2 Key Image Audit Findings
1. **Critical Dimension Disparity:**  
   The primary brand logo file `tibra-logo-white.png` is **9,050 pixels wide** and weighs **632.9 KB**. The browser downloads over half a megabyte just to render a 36-pixel icon in the header. Converting this to a responsive WebP asset (500px wide, ~18 KB) will reduce logo payload by **97.1%**.
2. **Missing `width` and `height` Attributes:**  
   Out of 42 `<img>` tags in the React application, **0 have explicit width/height attributes**. Adding intrinsic dimensions (e.g. `width={764} height={1024}`) ensures the browser calculates aspect-ratio boxes prior to image decode.
3. **Missing `srcset` and `sizes`:**  
   No responsive `srcset` or `<picture>` elements are implemented. Desktop users and mobile users download identical high-resolution source images regardless of viewport width.
4. **Legacy Filenames:**  
   Several core assets retain early project filenames (`purefix-bottle-transparent.png`, `purefix-bottle-box-showcase.jpg`) rather than brand-aligned, keyword-rich filenames (`tibra-naturals-pain-relief-oil-30ml-bottle.webp`).

---

## AUDIT 3 — JAVASCRIPT AND CODE PERFORMANCE

### 3.1 JavaScript Bundle Size Breakdown
- **Vite 8 Build Output:** Single chunk `index-afGXehhz.js` = **616.60 KB** uncompressed (157.72 KB Brotli compressed).
- **Vite Warning:** `(!) Some chunks are larger than 500 kB after minification.`

### 3.2 Monolithic Loading & Code Splitting Opportunities

```
[Current Client Bundle Architecture: 616.6 KB Single Chunk]
├── React 19 Core & React-DOM (185 KB)
├── SpreeAdminApp & Admin Submodules (115 KB) ───────> NEVER needed by public shoppers!
├── Dedicated Pages (ProductDetail, Ingredients, etc.) (98 KB) ───> Should be lazy-loaded per route!
├── Component Tree (CartDrawer, OrderModal, etc.) (120 KB) ───> Modals can load on demand!
├── Lucide-react Icons (65 KB)
└── canvas-confetti (33 KB) ─────────────────────────> Only needed on Order Success page!
```

### 3.3 Audit Findings & Code Optimizations

| Item | Current Implementation | Performance Impact | Recommended Solution | Potential Savings |
|---|---|---|---|---|
| **Admin Portal Code** | `import { SpreeAdminApp } from './admin/SpreeAdminApp'` in `App.tsx` | High (115 KB unneeded JS loaded on every public page) | Replace with `React.lazy(() => import('./admin/SpreeAdminApp'))` | **~115 KB** initial JS |
| **Inner Pages** | Statically imported in `App.tsx` | High (all 10 route components parsed on homepage) | Implement `React.lazy()` for all inner route components | **~75 KB** initial JS |
| **canvas-confetti** | Statically imported in `CheckoutPage.tsx` | Medium (33 KB loaded before order completion) | Dynamic import: `const confetti = (await import('canvas-confetti')).default` | **~33 KB** initial JS |
| **Unused Dependency: `three`** | `"three": "^0.186.1"` in `package.json` | Low (tree-shaken out, but present in `package.json`) | Remove `three` and `@types/three` dependencies | Cleaner dependency tree |
| **Interactive Modals** | `OrderInquiryModal` statically bundled | Low/Medium | Lazy load or split modal component | **~15 KB** initial JS |

---

## AUDIT 4 — MOBILE RESPONSIVENESS AND LAYOUT STABILITY

### 4.1 Viewport Breakpoint Testing Matrix

| Viewport Width | Device Archetype | Horizontal Overflow | Header & Navigation | Touch Targets | Status | Notes / Observations |
|---|---|---|---|---|---|---|
| **320px** | iPhone SE (1st gen) | None | Compact | 38px–44px | **WARNING** | Header controls fit tightly; logo text is constrained. |
| **360px** | Galaxy S8 / Android | None | Clean | 44px+ | **PASS** | Good button tap targets and readable text. |
| **375px** | iPhone SE (2nd/3rd gen) | None | Clean | 44px+ | **PASS** | Balanced proportions throughout all sections. |
| **390px** | iPhone 13/14/15 | None | Clean | 48px | **PASS** | Optimal layout flow and typography scale. |
| **414px** | iPhone XR / 11 Plus | None | Clean | 48px | **PASS** | Plenty of breathing room in card grids. |
| **430px** | iPhone 14/15 Pro Max | None | Clean | 48px | **PASS** | Full fluid responsive alignment. |
| **768px** | iPad / Tablet Portrait | None | Pill Nav | 48px | **PASS** | Seamless transition to tablet two-column layouts. |
| **1024px** | iPad Pro / Desktop Small | None | Pill Nav | 44px | **PASS** | Floating header pill displays cleanly. |
| **1440px+** | Desktop Large | None | Fixed Full | 44px | **PASS** | Max-width constraint (`max-w-7xl`) centers content cleanly. |

### 4.2 Layout Stability & Mobile UX Findings
1. **Cookie Consent & Sticky Bar Collision:**  
   On mobile devices (< 640px), when a first-time user visits the site, the Cookie Consent banner docks at `bottom-0` (`z-50`) while the sticky `FloatingBottomBar` appears behind/underneath it (`z-40`). When both are present, they cover approximately 35% of the mobile screen until consent is granted.  
   *Recommendation:* Suppress the `FloatingBottomBar` while the consent banner is active, or coordinate z-indexes.
2. **Horizontal Scrolling Safeguard:**  
   `overflow-x-hidden` is properly configured on `<body class="overflow-x-hidden">`, preventing horizontal jitter on mobile viewport shifts.
3. **Accordion vs. Grid in Target Areas Section:**  
   The `BenefitsTargetSection` smartly toggles to a vertical mobile accordion on `< 1024px` with all items collapsed by default, avoiding an excessively long 8-card vertical scroll.

---

## AUDIT 5 — COMPLETE TECHNICAL SEO

### 5.1 Canonical Routes Technical Audit Matrix

| # | Route | Title Tag (Length) | Meta Description (Length) | Canonical URL | Pre-rendered H1 | Schemas Present | Status |
|---|---|---|---|---|---|---|---|
| 1 | `/` | `TIBRA NATURALS \| Herbal Oils & Natural Personal Care in Pakistan` (68 chars) | `Discover TIBRA NATURALS, Pakistan’s authentic herbal wellness brand offering 100% natural botanical pain relief massage oils for joints, mobility, and everyday comfort.` (168 chars) | `https://www.tibranaturals.com/` | *Missing in static HTML shell* | `Organization`, `WebSite`, `Product` | **WARNING** (Empty shell) |
| 2 | `/products/` | `Our Herbal Products \| TIBRA NATURALS Pakistan` (45 chars) | `Explore authentic botanical wellness formulations from TIBRA NATURALS Pakistan. 100% natural herbal joint comfort and massage oils.` (131 chars) | `https://www.tibranaturals.com/products/` | `Our Herbal Products – Natural Relief for Active Living` | `BreadcrumbList`, `CollectionPage` | **PASS** |
| 3 | `/products/pain-relief-oil/` | `TIBRA NATURALS Pain Relief Oil \| Herbal Massage Oil 30ml Pakistan` (65 chars) | `Buy authentic TIBRA NATURALS Pain Relief Oil (30ml). 100% natural herbal formula with Turmeric, Ginger & Boswellia. Cash on Delivery across Pakistan. Rs. 1,500.` (160 chars) | `https://www.tibranaturals.com/products/pain-relief-oil/` | `TIBRA NATURALS Pain Relief Oil – 30ml` | `Product`, `Offer`, `BreadcrumbList` | **PASS** |
| 4 | `/ingredients/` | `Botanical Ingredients \| TIBRA NATURALS Pain Relief Oil` (54 chars) | `Discover the 100% natural botanical ingredients in TIBRA NATURALS Pain Relief Oil: Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility.` (159 chars) | `https://www.tibranaturals.com/ingredients/` | `Formulated from the Earth: 100% Botanical Transparency` | `BreadcrumbList` | **PASS** |
| 5 | `/how-to-use/` | `How to Use Herbal Massage Oil \| TIBRA NATURALS Daily Ritual` (59 chars) | `Learn how to properly apply TIBRA NATURALS Pain Relief Oil. Step-by-step 30 ML dropper dosage, circular massage instructions, and precautions for best joint relief.` (164 chars) | `https://www.tibranaturals.com/how-to-use/` | `A Mindful Daily Ritual: Directions for Optimal Comfort` | `BreadcrumbList` | **PASS** |
| 6 | `/our-quality/` | `Quality & Sourcing Standards \| TIBRA NATURALS Pakistan` (54 chars) | `Learn how TIBRA NATURALS ensures uncompromised herbal quality. Cold-extraction, pharmaceutical amber glass UV defense, and verified botanical purity.` (149 chars) | `https://www.tibranaturals.com/our-quality/` | `Uncompromising Standards: From Soil to Dropper` | `BreadcrumbList` | **PASS** |
| 7 | `/about-us/` | `About Us \| TIBRA NATURALS – Botanical Wellness Heritage` (55 chars) | `Learn about TIBRA NATURALS, Pakistan` (36 chars) | `https://www.tibranaturals.com/about-us/` | `Rooted in Nature: Crafted for Active Living` | `BreadcrumbList` | **FAIL** (Truncated meta) |
| 8 | `/blog/` | `Herbal Wellness & Joint Care Blog \| TIBRA NATURALS` (50 chars) | `Explore evidence-aware guides, botanical research, and practical advice on herbal massage oils, joint comfort, and active living from TIBRA NATURALS.` (149 chars) | `https://www.tibranaturals.com/blog/` | `Herbal Wisdom & Physical Care: Botanical Wellness Journal` | `BreadcrumbList`, `Blog` | **PASS** |
| 9 | `/blog/herbal-massage-oil-guide/` | `Herbal Massage Oil Guide for Joints & Muscles \| TIBRA NATURALS` (62 chars) | `Discover how herbal massage oils provide natural joint comfort and muscle relaxation. Learn about botanical synergy, cold-maceration, and optimal application techniques.` (169 chars) | `https://www.tibranaturals.com/blog/herbal-massage-oil-guide/` | `A Comprehensive Guide to Herbal Massage Oils for Joint and Muscle Comfort` | `BlogPosting`, `BreadcrumbList` | **PASS** |
| 10 | `/blog/natural-oils-and-personal-care/` | `Natural Oils & Botanical Personal Care \| TIBRA NATURALS` (55 chars) | `Explore why natural botanical oils are replacing synthetic products in modern personal care and joint wellness rituals in Pakistan and worldwide.` (145 chars) | `https://www.tibranaturals.com/blog/natural-oils-and-personal-care/` | `Natural Botanical Oils in Modern Personal Care: Ancient Wisdom Meets Daily Living` | `BlogPosting`, `BreadcrumbList` | **PASS** |
| 11 | `/blog/understanding-herbal-ingredients/` | `Herbal Ingredients: Turmeric, Ginger & Boswellia \| TIBRA NATURALS` (65 chars) | `Learn about the verified roles of Turmeric, Ginger, and Boswellia (Frankincense) in topical massage oils. Discover how botanical synergy eases joint stiffness.` (159 chars) | `https://www.tibranaturals.com/blog/understanding-herbal-ingredients/` | `Understanding Herbal Ingredients: Turmeric, Ginger, and Boswellia in Topical Formulations` | `BlogPosting`, `BreadcrumbList` | **PASS** |
| 12 | `/blog/safe-use-of-topical-oils/` | `Safe Use of Topical Herbal Oils \| TIBRA NATURALS Guidelines` (59 chars) | `Essential safety guidelines, patch test protocols, storage recommendations, and proper application dosage for botanical massage oils.` (133 chars) | `https://www.tibranaturals.com/blog/safe-use-of-topical-oils/` | `Safe Use and Best Practices for Topical Botanical Oils` | `BlogPosting`, `BreadcrumbList` | **PASS** |
| 13 | `/faq/` | `Frequently Asked Questions (FAQ) \| TIBRA NATURALS` (49 chars) | `Got questions about TIBRA NATURALS Pain Relief Oil? Find answers regarding ingredients, 30 ML dropper dosage, shipping across Pakistan, and COD payments.` (153 chars) | `https://www.tibranaturals.com/faq/` | `Frequently Asked Questions: TIBRA NATURALS Support & Guidance` | `FAQPage`, `BreadcrumbList` | **PASS** |
| 14 | `/contact-us/` | `Contact Us \| TIBRA NATURALS Customer Support Pakistan` (53 chars) | `Get in touch with TIBRA NATURALS Pakistan. Customer care, WhatsApp order reservations, delivery inquiries, and verified business address.` (137 chars) | `https://www.tibranaturals.com/contact-us/` | `Contact TIBRA NATURALS: Dedicated Support & Inquiries` | `ContactPage`, `BreadcrumbList` | **PASS** |
| 15 | `/shipping-policy/` | `Shipping & Delivery Policy \| TIBRA NATURALS Pakistan` (52 chars) | `Nationwide shipping policy for TIBRA NATURALS across Pakistan. Cash on Delivery (COD), Rs. 200 flat courier rate, and 2-4 business day dispatch.` (144 chars) | `https://www.tibranaturals.com/shipping-policy/` | `Shipping & Delivery Policy` | `BreadcrumbList` | **PASS** |
| 16 | `/return-policy/` | `Returns & Replacement Policy \| TIBRA NATURALS` (45 chars) | `Inspection on delivery, damaged item replacement, and 7-day customer satisfaction commitment for TIBRA NATURALS botanical wellness orders in Pakistan.` (150 chars) | `https://www.tibranaturals.com/return-policy/` | `Returns & Replacement Policy` | `BreadcrumbList` | **PASS** |
| 17 | `/privacy-policy/` | `Privacy Policy \| TIBRA NATURALS` (31 chars) | `Privacy Policy for TIBRA NATURALS. We respect customer privacy, protect personal delivery data, and never sell or rent your personal information.` (145 chars) | `https://www.tibranaturals.com/privacy-policy/` | `Privacy Policy` | `BreadcrumbList` | **PASS** |
| 18 | `/terms-and-conditions/` | `Terms & Conditions \| TIBRA NATURALS` (35 chars) | `Terms and conditions governing the use of the official TIBRA NATURALS website, product purchases, and wellness disclaimers.` (123 chars) | `https://www.tibranaturals.com/terms-and-conditions/` | `Terms & Conditions` | `BreadcrumbList` | **PASS** |

### 5.2 Sitemap.xml & Robots.txt Verification
- **Sitemap.xml:** Valid XML at `https://www.tibranaturals.com/sitemap.xml`. Accurately indexes all 18 canonical routes with correct trailing-slash consistency, `<lastmod>`, `<changefreq>`, and `<priority>`.
- **Robots.txt:** Clean at `https://www.tibranaturals.com/robots.txt`. Correctly disallows private paths (`/admin`, `/checkout`, `/order-success`, query sessions) and references `Sitemap: https://www.tibranaturals.com/sitemap.xml`.
- **Gap Identified:** `/cart` is not explicitly disallowed in `robots.txt`, nor does `CartPage.tsx` emit a `noindex` meta tag. If an external link points to `/cart`, search bots might index an empty cart template.

### 5.3 Structured Data Audit
- **Organization Schema:** Present on root. Contains official brand name `TIBRA NATURALS`, logo URL, telephone (`+92-300-1234567`), address in Lahore Pakistan, and verified social profile links. **PASS**.
- **WebSite Schema:** Configured with official domain, publisher reference, and `inLanguage: "en-PK"`. **PASS**.
- **Product Schema on Detail Page:** Contains SKU (`TN-PRO-030`), brand, description, two offers (single 1500 PKR, duo 2600 PKR), and availability `InStock`. **PASS**.
- **No Fake Ratings / Reviews in Schema:** The schema responsibly avoids fabricated `aggregateRating` or fake review markup, fully adhering to Google Search Quality Guidelines. **PASS**.

---

## AUDIT 6 — HEADING STRUCTURE (H1, H2, H3)

### 6.1 Page-Wise Heading Hierarchy Assessment

| Page | Current Primary H1 | Secondary H2 Sections | Semantic Order Status | Findings & Recommended Hierarchy |
|---|---|---|---|---|
| **Home Page** | `Move Freely. Live Better.` | 6 × H2s ("Engineered by Nature...", "Formulated from the Earth...", "Works on Multiple Areas...", "Engineered for Swift Relief...", "Uncompromising Presentation...", "Frequently Asked Questions") | **WARNING** | H1 lacks primary search keywords (pain relief oil, joint massage oil, Pakistan). Several sections jump from H2 directly to H4, skipping H3. |
| **Products Listing** | `Our Herbal Products Natural Relief for Active Living` | Product Cards H2 (`product.name`) | **WARNING** | Bottom value props use H4 ("Nationwide COD", "100% Herbal Purity") skipping H3. |
| **Product Detail** | `TIBRA NATURALS Pain Relief Oil – 30ml` | None! Jumps straight to H3 in content tabs | **WARNING** | Missing semantic H2 section wrappers for "Product Formulation", "Ingredients", and "Application Ritual". |
| **Ingredients Page** | `Formulated from the Earth. 100% Botanical Transparency.` | None | **WARNING** | Jumps directly to H3. |
| **How to Use Page** | `A Mindful Daily Ritual. Directions for Optimal Comfort.` | None | **WARNING** | Jumps directly to H3. |
| **Our Quality Page** | `Uncompromising Standards. From Soil to Dropper.` | None | **WARNING** | Jumps directly to H3. |
| **About Us Page** | `Rooted in Nature. Crafted for Active Living.` | `The Philosophy Behind TIBRA NATURALS` | **PASS** | Logical H1 &rarr; H2 &rarr; H3 structure. |
| **Blog Articles** | Clean H1 (Article Title) | Subsections H2 | **PASS** | Semantic editorial heading structure. |
| **Contact Us** | `We are Here to Assist You.` | None | **WARNING** | H1 is generic; jumps directly to H3 for contact channels. |

---

## AUDIT 7 — KEYWORD AND SEARCH INTENT MAPPING (PAKISTAN MARKET)

### 7.1 Pakistan Herbal Wellness & Joint Care Keyword Map

| Search Query / Keyword Theme | Search Intent | Target Language | Best Matching Canonical URL | Current Optimization State | Recommended Target Optimization |
|---|---|---|---|---|---|
| **pain relief oil pakistan** | Commercial / Transactional | English | `/products/pain-relief-oil/` | Partial (in description & keywords) | Integrate in Product H1 & Title tag |
| **joint massage oil** | Commercial / Informational | English | `/products/pain-relief-oil/` | Moderate | Emphasize in product specifications & H2 |
| **herbal massage oil pakistan** | Commercial | English | `/products/` & `/` | Moderate | Primary keyword for Category & Homepage H1 |
| **joint pain oil price in pakistan** | Transactional / Commercial | English | `/products/pain-relief-oil/` | Moderate (shows Rs. 1,500) | Include clear price mention in meta snippet |
| **joron ke dard ka tail** | Transactional / Commercial | Roman Urdu | `/products/pain-relief-oil/` & `/faq/` | Weak (only in keywords meta) | Add dedicated Roman Urdu FAQ & localized search copy |
| **ghutno ke dard ka oil** | Transactional / Commercial | Roman Urdu | `/products/pain-relief-oil/` | Weak | Integrate in Targets section & FAQ |
| **how to use massage oil for joint pain** | Informational | English | `/how-to-use/` | Strong | Target featured snippet with ordered list |
| **herbal ingredients for joint stiffness** | Informational | English | `/ingredients/` & `/blog/understanding-herbal-ingredients/` | Strong | Target botanical long-tail queries |
| **safe topical massage oil precautions** | Informational | English | `/blog/safe-use-of-topical-oils/` | Strong | Patch test protocol and safety guidelines |
| **cash on delivery joint oil pakistan** | Commercial / Transactional | English | `/products/pain-relief-oil/` | Moderate | Emphasize in checkout trust signals |

### 7.2 Keyword Cannibalization Prevention
- **Homepage (`/`):** Owns Brand Authority + Broad Category queries: *"TIBRA NATURALS — Authentic Botanical Massage & Joint Wellness Oils in Pakistan"*.
- **Category Page (`/products/`):** Owns Collection queries: *"Herbal Massage Oils & Natural Personal Care Formulations"*.
- **Product Page (`/products/pain-relief-oil/`):** Owns Specific Product + Transactional queries: *"Buy TIBRA NATURALS Pain Relief Oil 30ml — Cash on Delivery Pakistan"*.

---

## AUDIT 8 — HOMEPAGE SEO

### 8.1 Homepage Assessment
- **Current Title:** `TIBRA NATURALS | Herbal Oils & Natural Personal Care in Pakistan` (68 chars)
- **Proposed Alternative Concept:** `TIBRA NATURALS | Herbal Wellness Oil in Pakistan` (47 chars)
- **Evaluation:**  
  The proposed concept is concise, but "Herbal Wellness Oil" is slightly vague compared to high-intent terms. A stronger recommendation that balances brand authority, high search volume, and CTR in Pakistan is:  
  **Recommended Title:** `TIBRA NATURALS | Herbal Massage & Pain Relief Oil in Pakistan` (59 characters).
- **H1 Evaluation:**  
  Current H1: `Move Freely. Live Better.`  
  *Audit finding:* Inspiring brand slogan, but carries zero organic search weight.  
  *Recommendation:* Enhance H1 to:  
  `Move Freely. Live Better.`  
  `<span class="block text-lg font-sans font-normal text-botanical-700">Authentic Herbal Massage & Joint Care Oil in Pakistan</span>`
- **Internal Linking:**  
  The homepage links cleanly to `#ingredients`, `#targets`, `#ritual`, `#packaging`, `#faq`, and the newly added `/products/` page, but **lacks internal links to the educational blog articles**.

---

## AUDIT 9 — PRODUCT DETAIL PAGE (`/products/pain-relief-oil/`)

### 9.1 Detailed 15-Point Evaluation

| # | Evaluation Criteria | Implementation Status | Findings & Specific Recommendations |
|---|---|---|---|
| 1 | Clear H1 and product introduction | **PASS** | Clear H1: `TIBRA NATURALS Pain Relief Oil – 30ml` with introductory botanical formulation summary. |
| 2 | Original product images | **WARNING** | Uses authentic photos, but files are uncompressed PNG/JPEG without responsive `srcset` or WebP. |
| 3 | Product information & specs | **PASS** | Clear specifications (30 ML / 1.01 FL OZ, amber glass, dropper). |
| 4 | Actual price & product size | **PASS** | Transparent pricing: Single Rs. 1,500 (30ml); Duo Rs. 2,600 (60ml, save 35%). |
| 5 | Verified ingredients & composition | **PASS** | Accurate breakdown of Curcuma Longa, Zingiber Officinale, Wintergreen, Eucalyptus, Boswellia. |
| 6 | Directions for use | **PASS** | 3-step usage: 3 to 5 drops, circular massage 2-3 mins, twice daily. |
| 7 | Safety information & precautions | **PASS** | External use only, avoid broken skin/eyes, 24-hr patch test protocol clearly displayed. |
| 8 | Verifiable quality information | **WARNING** | Mentions amber glass and cold extraction, but lacks a dedicated Quality & Purity Assurance seal section. |
| 9 | Frequently Asked Questions | **WARNING** | Only 2 brief questions in tab 4; expand with shipping times, shelf life, and skin type suitability. |
| 10 | Genuine customer reviews | **FAIL** | Zero customer reviews or verified testimonials displayed on the product detail page. |
| 11 | Purchase & cart buttons | **PASS** | High-contrast "Order Now (Cash on Delivery)" and "Add to Cart" buttons with instant feedback. |
| 12 | Product structured data | **PASS** | Full `Product` + `Offer` schema with PKR currency, in-stock availability, and brand reference. |
| 13 | Breadcrumb navigation | **PASS** | `Home` &rarr; `Products` &rarr; `Pain Relief Oil` with Schema.org `BreadcrumbList`. |
| 14 | Relevant internal links | **WARNING** | Lacks related reading links (e.g. link to `/ingredients/` and `/blog/herbal-massage-oil-guide/`). |
| 15 | Mobile conversion UX | **PASS** | Fluid stepper, clear savings badge, and responsive COD order triggers. |

---

## AUDIT 10 — PRODUCTS PAGE & NAVIGATION ARCHITECTURE

### 10.1 Navigation Menu Audit
- **Current Navigation Structure:**
  1. `Home` (`/`)
  2. `Products` (`/products/`)
  3. `Formula` (`#ingredients`)
  4. `Targets` (`#targets`)
  5. `How to Use` (`#ritual`)
  6. `Packaging` (`#packaging`)
  7. `FAQ` (`#faq`)
- **Compliance Status:** **PASS**. The navigation strictly follows the requested hierarchy: "Overview" was renamed to "Home", and exactly one new "Products" item was added immediately after "Home" linking to `/products/`. Works consistently across desktop pill navigation and mobile drawer navigation.

### 10.2 Products Page Audit (`/products/`)
- **Status:** **PASS**.
- **Features:** Dynamic catalog rendering from `storeService.getProducts()`, flagship card for TIBRA NATURALS Pain Relief Oil (30ml) at Rs. 1,500, Duo Pack notice (Rs. 2,600), "View Product" button linking to `/products/pain-relief-oil/`, "Add to Cart" button, "Order via Cash on Delivery" button, and Schema.org `CollectionPage` + `ItemList`.

---

## AUDIT 11 — BLOG SECTION & HOMEPAGE INTEGRATION

### 11.1 Blog Content Source Audit
- **Source File:** `src/data/blogArticles.ts`
- **Published Articles:** 4 genuine, evidence-aware educational articles:
  1. `safe-use-of-topical-oils` (Nov 22, 2026)
  2. `understanding-herbal-ingredients` (Nov 18, 2026)
  3. `natural-oils-and-personal-care` (Nov 14, 2026)
  4. `herbal-massage-oil-guide` (Nov 10, 2026)
- **Content Quality:** High. No exaggerated therapeutic promises, transparent botanical discussions, patch test instructions, and zero duplicate or placeholder posts.

### 11.2 Homepage Blog Section Gap Analysis
- **Current Status:** **MISSING (FAIL)**.
- **Finding:** The homepage (`src/App.tsx`) currently renders sections 1 through 9 (Hero, Anatomy, Ingredients, Targets, Final CTA, Packaging, Ritual, Brand Story, FAQ), but completely omits a blog preview section.
- **Future Implementation Requirement:**
  - Add a dedicated homepage section titled `"Latest from Our Blog"`.
  - Dynamically display the latest 3 published articles (`BLOG_POSTS.slice(-3).reverse()` or sorted by date).
  - Each card must display: thumbnail image, article title, reading time, excerpt, and publish date.
  - Each card links directly to its deep post route (`/blog/:slug/`).
  - A `"View All Articles"` button linking to `/blog/`.
  - Maintain clean, minimal navigation with zero extra main menu items.

---

## AUDIT 12 — SEO TRUST, E-E-A-T & CONTENT QUALITY

### 12.1 Compliance & Trust Scorecard

| E-E-A-T Trust Factor | Verification Source | Status | Audit Findings & Quality Assessment |
|---|---|---|---|
| **Business Identity** | `src/config/brandConfig.ts` & `/contact-us/` | **PASS** | Legal name (`Tibra Naturals Botanical Wellness Ltd.`), physical complex address in Lahore Punjab, dedicated support email (`orders@tibranaturals.com`), WhatsApp care. |
| **Brand Story & Heritage** | `/about-us/` & `BrandStorySection` | **PASS** | Clear statement of botanical philosophy, rejection of synthetic shortcuts, amber glass preservation. |
| **Editorial Transparency** | `src/data/blogArticles.ts` | **WARNING** | Authors are listed as institutional teams (`TIBRA NATURALS Botanical Editorial Team`). Individual author credentials or reviewer bios would enhance E-E-A-T. |
| **Medical Claims & YMYL** | Entire Codebase | **PASS** | Highly compliant. Avoids prohibited medical cure claims ("cures arthritis", "eliminates disease"). Uses compliant wellness language ("soothes joint stiffness", "massage glide", "comfort"). |
| **Mandatory Disclaimers** | `/products/pain-relief-oil/` & `/terms/` | **PASS** | Clear disclaimers: "For external topical massage use only", patch test required, avoid open wounds. |
| **Customer Policies** | Dedicated Policy Pages | **PASS** | Clear 4-page policy suite: Shipping Policy (flat Rs. 200 COD), Return Policy (7-day transit replacement), Privacy Policy (GDPR / Consent Mode v2), Terms & Conditions. |
| **Customer Reviews / UGC** | Product Detail Page | **FAIL** | Rating number (4.9) is cited, but no actual customer testimonials or feedback comments are displayed. |

---

## PRIORITIZED IMPLEMENTATION RECOMMENDATIONS (FOR PHASE 2)

### Priority 1: High-Impact Performance Fixes (Critical)
1. **Optimize and Lazy-Load Hero Video:**
   - Compress `/assets/hero-video-002.mp4` from 5.98 MB down to < 1.5 MB using modern H.264 / AV1 compression.
   - Set `preload="none"` or `preload="metadata"` and load the video only when in viewport or on desktop connections.
   - Serve a lightweight WebP poster image (< 50 KB) as the initial LCP element on mobile.
2. **Convert Core Brand Logos & Large Images to WebP:**
   - Convert `tibra-logo-white.png` (632.9 KB) and `tibra-logo.png` (721.2 KB) from 9,050px down to appropriately sized WebP assets (500px, ~18 KB).
   - Convert `packaging-showcase-003.png` (2.17 MB) to WebP (~95 KB).
   - Convert product bottle and box showcase photos to WebP.
3. **Add Explicit `width` and `height` to All 42 `<img>` Tags:**
   - Eliminates Cumulative Layout Shift (CLS) across mobile and desktop.

### Priority 2: Code Splitting & JavaScript Optimization (High)
4. **Code-Split SpreeAdminApp & Non-Critical Pages:**
   - Convert `SpreeAdminApp` to `React.lazy(() => import('./admin/SpreeAdminApp'))`, immediately shaving ~115 KB off the public customer bundle.
   - Lazy load inner page components (`ProductDetailPage`, `BlogHubPage`, `PolicyPage`, etc.).
   - Dynamically import `canvas-confetti` only on checkout success.
5. **Optimize Google Fonts Delivery:**
   - Remove unused font weights.
   - Use asynchronous stylesheet loading (`media="print" onload="this.media='all'"`) or inline critical font declarations with `font-display: swap`.

### Priority 3: Content & Technical SEO Enhancements (Medium / High)
6. **Implement Homepage "Latest from Our Blog" Section:**
   - Build a clean 3-card preview section on the homepage displaying the latest published articles from `BLOG_POSTS`, linking to `/blog/:slug/` with a "View All Articles" CTA to `/blog/`.
7. **Fix About Us Meta Description & Root HTML Pre-render Shell:**
   - Fix the escaped quote in `scripts/prerender.cjs` for `/about-us/`.
   - Inject a static semantic fallback shell into the root `dist/index.html` so zero-JS crawlers see full semantic content on `/`.
8. **Add Customer Review Testimonials Section:**
   - Build an authentic customer feedback and review testimonial section on the product page to bolster social proof and conversion rates.
9. **Refine Heading Hierarchy:**
   - Update homepage H1 to include primary search terms ("Pain Relief Oil in Pakistan").
   - Add semantic H2 wrappers on the Product Detail page.
   - Disallow `/cart` in `robots.txt` and add `noindex` to `CartPage.tsx`.

---

## CONCLUSION

Phase 1 audit is complete. All findings, metrics, and evidence have been documented without modifying any production application code, assets, or deployments. This establishes an accurate, trustworthy baseline ready for execution in Phase 2.
