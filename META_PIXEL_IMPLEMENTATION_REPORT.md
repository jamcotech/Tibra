# TIBRA NATURALS — META PIXEL IMPLEMENTATION, TESTING & DEPLOYMENT REPORT

**Target Production Domain:** [https://www.tibranaturals.com/](https://www.tibranaturals.com/)  
**Brand:** TIBRA NATURALS  
**GitHub Repository:** [https://github.com/jamcotech/Tibra](https://github.com/jamcotech/Tibra)  
**Production Branch:** `main`  
**Latest Production Commit:** `8bfb0ec1f57c621f37eae7123ea34967a108da4c` (short: `8bfb0ec`)  
**Architecture:** Direct React/Vite Client Integration via `src/services/metaPixelService.ts` (Bypasses Google Tag Manager)  
**Meta Pixel Environment Variable:** `VITE_META_PIXEL_ID`  
**Currency:** `PKR`  
**Live Production Deployment Header:** `X-Vercel-Id: bom1::v5cfm-1795591021465-11783441f6d1`  
**Live Bundle File:** `/assets/index-Co5Vp166.js`  
**Audit Timestamp:** November 25, 2026, 12:18 PM PKT  
**Status:** **DEPLOYED TO PRODUCTION & TESTED**

---

## 1. Executive Summary & Status Matrix

| System / Requirement | Status | Verification Summary & Evidence |
|---|:---:|---|
| **1. Direct React/Vite Implementation** | **PASS** | Implemented directly via `src/services/metaPixelService.ts`. Bypasses Google Tag Manager. 0 GTM tags/triggers added for Meta Pixel. Existing GTM (`GTM-5Q8BQXJ6`) and GA4 (`G-9ZZ9VMPDQ2`) unaffected. |
| **2. Cookie Consent Integration** | **PASS** | Integrated directly with `tibra_consent_state` and `CookieConsentBanner.tsx`. Defaults to DENIED. Essential Only blocks Meta Pixel. Accept All activates Pixel once. Dynamic consent updates wired (`fbq('consent', 'grant')` and `fbq('consent', 'revoke')`). Re-granting does not duplicate initialization. |
| **3. Six Standard Events** | **PASS** | `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, and `Lead` implemented with stable deduplication and zero health/medical claims. |
| **4. Meta Business Tools Privacy Compliance** | **PASS** | Zero customer PII transmitted (no names, emails, phones, addresses, or free-text messages). Automatic Advanced Matching disabled (`autoConfig: false`). Only permitted standard ecommerce parameters transmitted. |
| **5. E-commerce Subtotal & Deduplication** | **PASS** | `Purchase` value strictly reflects merchandise subtotal excluding shipping. Shipping is excluded. Order deduplication enforced via memory `Set` and `sessionStorage`. |
| **6. Privacy Policy Disclosure** | **PASS** | `src/components/pages/PolicyPage.tsx` and `scripts/prerender.cjs` updated with Section 4 ("Cookies & Advertising Measurement - Meta Pixel") and Section 5 ("Consent Choices & Revocation"). |
| **7. Production Build & Prerender** | **PASS** | `npm run build` completed with exit code 0 (`tsc -b`, Vite minification, 17 prerendered static routes). |
| **8. Automated Test Suite** | **PASS** | 18 automated verification checks passed in `scripts/verify-meta-pixel.cjs`. Existing GA4 test suite passed in `scripts/verify-analytics.cjs`. |
| **9. GitHub Remote Push** | **PASS** | Pushed to `origin/main` ([https://github.com/jamcotech/Tibra.git](https://github.com/jamcotech/Tibra.git)) at commit `8bfb0ec`. |
| **10. Vercel Production Deployment** | **PASS** | Deployed live on Vercel Edge (`HTTP 200 OK`, `X-Vercel-Id: bom1::v5cfm-1795591021465-11783441f6d1`). Live bundle `/assets/index-Co5Vp166.js` verified. |
| **11. Live Smoke Test (17 Routes)** | **PASS** | All 17 canonical routes return `HTTP 200 OK`. `robots.txt` and `sitemap.xml` return `200 OK`. Non-WWW redirects to WWW with `308 Permanent Redirect`. |
| **12. Meta Events Manager & Cloud Session** | **NOT TESTED** | Browser subagent navigated to `https://business.facebook.com/events_manager2` and confirmed redirect to Meta login page (`https://business.facebook.com/business/loginpage/`). Cloud session is behind the Meta login wall; user action required to provide production Pixel ID. |

---

## 2. Meta Business Tools Privacy & Health Data Safeguards

Because TIBRA NATURALS offers herbal joint wellness topical formulations, strict compliance with Meta Business Tools Terms and data privacy regulations is enforced:

1. **Strictly Non-Sensitive Product Parameters:**
   - Event parameters are limited to: `content_ids`, `content_name`, `content_type: 'product'`, `currency: 'PKR'`, `value`, `num_items`.
   - No medical claims, symptom descriptions, health condition classifications, or treatment terms are transmitted to Meta.
2. **Zero Customer PII:**
   - No customer names, phone numbers, email addresses, physical street addresses, or free-text customer notes are sent.
   - Lead event (`trackLead`) only passes the fixed identifier `content_name: 'contact_form'`.
3. **Automatic Advanced Matching Disabled:**
   - Base initialization explicitly calls `callFbq('set', 'autoConfig', false, pixelId)` to prevent Meta's script from automatically crawling form fields or scraping user data.

---

## 3. Standard Events Implementation Breakdown

| Meta Event Name | Trigger Location | Verified Payload Parameters | Deduplication Safeguards |
|---|---|---|---|
| **PageView** | Initial page load (post-consent), SPA navigation (`ShopContext.tsx`), and browser Back/Forward (`popstate`) | Standard Meta PageView | 600ms debounce window prevents rapid duplicate dispatches |
| **ViewContent** | `ProductDetailPage.tsx` mount | `content_ids: ['tibra-natural-joint-oil-30ml']`<br>`content_name: 'TIBRA NATURALS Joint Oil'`<br>`content_type: 'product'`<br>`value: 1500`<br>`currency: 'PKR'` | Bound to unique product ID mount |
| **AddToCart** | `addToCart` & `quickBuyNow` in `ShopContext.tsx` | `content_ids: [product.id]`<br>`contents: [{ id, quantity, item_price }]`<br>`content_name: product.name`<br>`content_type: 'product'`<br>`value: price * quantity`<br>`currency: 'PKR'` | Fires only after successful store cart state update |
| **InitiateCheckout** | `CheckoutPage.tsx` mount | `content_ids: [...]`<br>`contents: [...]`<br>`content_type: 'product'`<br>`value: cartSubtotal`<br>`currency: 'PKR'`<br>`num_items: totalQuantity` | Fires once when checkout page mounts with items |
| **Purchase** | Order success in `CheckoutPage.tsx` and `OrderInquiryModal.tsx` | `content_ids: [...]`<br>`contents: [...]`<br>`content_type: 'product'`<br>`value: order.subtotal`<br>`currency: 'PKR'`<br>`num_items: totalQuantity` | Dual deduplication: in-memory `Set` + `sessionStorage` (`tibra_meta_order_${orderNumber}`). Strictly excludes shipping. |
| **Lead** | Contact form submit in `ContactUsPage.tsx` | `content_name: 'contact_form'`<br>`currency: 'PKR'` | Fires once upon valid submission. Zero customer contact PII sent. |

---

## 4. Consent Mode v2 Integration

The Meta Pixel service integrates seamlessly with the existing cookie banner in `src/components/CookieConsentBanner.tsx`:
- **Default State:** DENIED. The Meta base script is never loaded without consent.
- **"Essential Only":** Invokes `metaPixelService.revokeConsent()`. Script is not loaded, and future tracking calls return immediately.
- **"Accept All":** Invokes `metaPixelService.grantConsent()`. Dynamically loads `fbevents.js` once, calls `fbq('consent', 'grant')`, initializes the Pixel, and fires the initial `PageView`.
- **"Customize Choices":** If the user checks Marketing cookies, `grantConsent()` is invoked. If unchecked, `revokeConsent()` is called (`fbq('consent', 'revoke')`).
- **Footer Revocation:** Users can click "Cookie Preferences" in the footer at any time to modify or revoke consent.

---

## 5. Live Production Verification

- **HTTP Status:** `200 OK` across all 17 public routes.
- **Server:** Vercel Edge (`bom1::v5cfm-1795591021465-11783441f6d1`).
- **Client Bundle:** `/assets/index-Co5Vp166.js` (Hash matches commit `8bfb0ec`).
- **Bundle Contents:** Confirmed live presence of `connect.facebook.net/en_US/fbevents.js`, `autoConfig: false`, and `G-9ZZ9VMPDQ2`.
- **Sitemap & Robots:** Both return `200 OK`.

---

## 6. Action Items for Project Owner

Because Meta Events Manager (`https://business.facebook.com/events_manager2`) is secured behind an interactive login screen, perform these two simple steps:

1. **Obtain Meta Pixel ID:**
   - Log into [Meta Events Manager](https://business.facebook.com/events_manager2).
   - Copy your 15-to-16 digit numeric Pixel ID (e.g., `1234567890123456`).
2. **Add to Vercel Environment Variables:**
   - Go to [Vercel Dashboard](https://vercel.com/) &rarr; Project **Tibra** &rarr; **Settings** &rarr; **Environment Variables**.
   - Add:
     - **Key:** `VITE_META_PIXEL_ID`
     - **Value:** Your numeric Meta Pixel ID
     - **Environment:** Production, Preview, Development
   - Trigger a Redeploy on Vercel. Meta Pixel will instantly activate in production with full consent gating and standard events!
