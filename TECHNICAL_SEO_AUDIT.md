# TIBRA NATURALS – Technical SEO Audit & Infrastructure Specification

**Document Version:** 1.0  
**Domain:** `https://www.tibranaturals.com/`  
**Protocol:** HTTPS (Enforced)  
**Host Target:** Primary WWW (`www.tibranaturals.com`)  

---

## 1. Domain, Host & Canonical Architecture

### Preferred Canonical URL Configuration
- **Primary Canonical Origin:** `https://www.tibranaturals.com/`
- **Host Redirect Rule:** 
  - `http://tibranaturals.com/*` ➔ 301 Permanent Redirect ➔ `https://www.tibranaturals.com/*`
  - `https://tibranaturals.com/*` ➔ 301 Permanent Redirect ➔ `https://www.tibranaturals.com/*`
  - `http://www.tibranaturals.com/*` ➔ 301 Permanent Redirect ➔ `https://www.tibranaturals.com/*`
- **Trailing Slash Policy:** Strict lowercase, trailing slash on directories and informational routes (`/about-us/`, `/products/pain-relief-oil/`), standardizing canonical self-references.

---

## 2. Crawl Directives (`robots.txt`)

### Current State
File `/public/robots.txt` is **MISSING**.

### Required Production Specification
```txt
# robots.txt for https://www.tibranaturals.com/
# Generated for TIBRA NATURALS Botanical Wellness Store

User-agent: *
Allow: /
Allow: /products/
Allow: /ingredients/
Allow: /about-us/
Allow: /how-to-use/
Allow: /our-quality/
Allow: /blog/
Allow: /faq/
Allow: /contact-us/
Allow: /shipping-policy/
Allow: /return-policy/
Allow: /privacy-policy/
Allow: /terms-and-conditions/

# Disallow Private Admin and Utility Routes
Disallow: /admin
Disallow: /admin/
Disallow: /checkout
Disallow: /checkout/
Disallow: /order-success
Disallow: /order-success/
Disallow: /*?*admin=
Disallow: /*?*token=

# Sitemap Declaration
Sitemap: https://www.tibranaturals.com/sitemap.xml
```

---

## 3. XML Sitemap Specification (`sitemap.xml`)

### Current State
File `/public/sitemap.xml` is **MISSING**.

### Required Production Specification
A fully valid XML sitemap formatted under the `http://www.sitemaps.org/schemas/sitemap/0.9` namespace.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.tibranaturals.com/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/products/pain-relief-oil/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/ingredients/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/how-to-use/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/our-quality/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/about-us/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/blog/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/blog/herbal-massage-oil-guide/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/blog/natural-oils-and-personal-care/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/blog/understanding-herbal-ingredients/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/blog/safe-use-of-topical-oils/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/faq/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/contact-us/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/shipping-policy/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/return-policy/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/privacy-policy/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.tibranaturals.com/terms-and-conditions/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>
```

---

## 4. Canonical Tag & HTML Head Standards

Every route rendered by the React application must maintain an active, self-referencing canonical tag:
```html
<link rel="canonical" href="https://www.tibranaturals.com/current-path/" />
```
Rules:
1. Canonical must match the exact protocol (`https`).
2. Canonical must match the preferred subdomain (`www.tibranaturals.com`).
3. Parameters (such as UTM tracking, cart tokens, session IDs) must be stripped from the canonical tag.
4. Utility routes (Cart, Checkout) must use `<meta name="robots" content="noindex, follow" />`.

---

## 5. Mobile & Core Web Vitals Optimization Guidelines

1. **Largest Contentful Paint (LCP) Target: $\le 2.5\text{s}$**
   - The hero background video (`hero-video-002.mp4`) should utilize modern compression or high-priority poster image preloading (`video-002-poster.png`).
   - Bottle packaging hero images must have `fetchpriority="high"` and exact `width` and `height` dimensions.
2. **Cumulative Layout Shift (CLS) Target: $\le 0.1$**
   - Explicit aspect-ratio reservations on image and video wrappers (`aspect-square`, `aspect-[4/5]`, `aspect-video`).
   - Stable system font fallbacks to prevent Flash of Unstyled Text (FOUT).
3. **Interaction to Next Paint (INP) Target: $\le 200\text{ms}$**
   - Smooth event listeners on cart actions and stepper buttons with zero long tasks on main thread.
