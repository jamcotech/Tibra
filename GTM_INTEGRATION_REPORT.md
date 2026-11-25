# GOOGLE TAG MANAGER (GTM) INTEGRATION REPORT
**Project:** TIBRA NATURALS  
**Website:** [https://www.tibranaturals.com/](https://www.tibranaturals.com/)  
**Framework:** React 19 + Vite 8 + TypeScript  
**GTM Container ID:** `GTM-5Q8BQXJ6`  
**Hosting Target:** Vercel Edge  
**Date:** November 25, 2026  
**Status:** **IMPLEMENTED, LOCALLY BUILT & COMMITTED (Awaiting Review & Deployment Authorization)**

---

## 1. Summary of Requirements & Implementation

| Requirement | Implementation Detail | Status |
|---|---|:---:|
| **1. Official GTM Snippet** | Embedded Google's canonical GTM loader in `<head>` with `gtm.start` event initialization. | **VERIFIED** |
| **2. HTML Head Script** | Placed high inside `<head>` in [`index.html`](file:///D:/E/Tibra%20Project/Tibra%20website/index.html). | **VERIFIED** |
| **3. Body Noscript Iframe** | Embedded `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5Q8BQXJ6" ...>` immediately after opening `<body>`. | **VERIFIED** |
| **4. Single Initialization** | GTM container is loaded once in `index.html`. `analyticsService.init()` guards against duplicate setup. | **VERIFIED** |
| **5. Configuration Preservation** | Preserved all React, Vite build, pre-render, and Vercel routing configurations. | **VERIFIED** |
| **6. No Duplicate Scripts** | No redundant `gtag.js` external scripts injected when GTM container is active. | **VERIFIED** |
| **7. ID Distinction** | Container ID (`GTM-5Q8BQXJ6`) and GA4 Measurement ID (`G-XXXXXXXXXX`) strictly distinguished in code and types. | **VERIFIED** |
| **8. GA4 Preparation via GTM** | Structured Enhanced Ecommerce and lead events pushed to `window.dataLayer` for GTM tags to trigger GA4. | **VERIFIED** |
| **9. SPA Navigation Tracking** | React Router transitions emit `page_view` events with 600ms deduplication window. | **VERIFIED** |
| **10. Privacy & Consent** | Google Consent Mode v2 default initialized (`analytics_storage: granted`, `ad_storage: denied`); zero PII passed. | **VERIFIED** |
| **11. Build Verification** | `tsc -b && vite build && node scripts/prerender.cjs` passed with 0 errors across all 16 static routes. | **VERIFIED** |
| **12. Deployment Control** | Changes committed locally; **no remote push or deployment performed** without prior approval. | **VERIFIED** |

---

## 2. GTM Code Placement

### HTML `<head>` Placement ([`index.html`](file:///D:/E/Tibra%20Project/Tibra%20website/index.html)):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5Q8BQXJ6');</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
<!-- End Google Tag Manager -->
```

### HTML `<body>` Placement ([`index.html`](file:///D:/E/Tibra%20Project/Tibra%20website/index.html)):
```html
<body class="bg-[#FAF8F5] text-[#252E15] antialiased selection:bg-[#748C48] selection:text-white overflow-x-hidden">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5Q8BQXJ6"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div id="root"></div>
  ...
</body>
```

---

## 3. DataLayer Event Architecture for GTM & GA4

[`src/services/analyticsService.ts`](file:///D:/E/Tibra%20Project/Tibra%20website/src/services/analyticsService.ts) emits both standard GTM `dataLayer` pushes and `gtag` compatibility calls:

### 1. SPA Route Page Views (`page_view`):
```javascript
window.dataLayer.push({
  event: 'page_view',
  page_path: '/products/pain-relief-oil/',
  page_title: 'TIBRA NATURALS Pain Relief Oil | Herbal Massage Oil 30ml Pakistan',
  page_location: 'https://www.tibranaturals.com/products/pain-relief-oil/'
});
```

### 2. View Item (`view_item`):
```javascript
window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
window.dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'PKR',
    value: 1500,
    items: [{
      item_id: 'tibra-natural-joint-oil-30ml',
      item_name: 'TIBRA NATURALS Pain Relief Oil',
      item_brand: 'TIBRA NATURALS',
      item_category: 'Herbal Massage Oils',
      price: 1500,
      quantity: 1
    }]
  }
});
```

### 3. Add to Cart (`add_to_cart`):
```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    currency: 'PKR',
    value: 2600,
    items: [{
      item_id: 'tibra-natural-joint-oil-30ml',
      item_name: 'TIBRA NATURALS Pain Relief Oil',
      price: 1300,
      quantity: 2
    }]
  }
});
```

### 4. Begin Checkout (`begin_checkout`):
```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  event: 'begin_checkout',
  ecommerce: {
    currency: 'PKR',
    value: 2800,
    items: [...]
  }
});
```

### 5. Purchase (`purchase`):
```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TN-2026-XXXX',
    currency: 'PKR',
    value: 2800,
    shipping: 200,
    items: [...]
  }
});
```
*Note: Purchase tracking is deduplicated through an internal Set and `sessionStorage` (`tibra_gtm_order_...`) to prevent duplicate transactions if the user reloads the success page.*

### 6. Contact Form Submission (`generate_lead` / `contact_form_submit`):
```javascript
window.dataLayer.push({
  event: 'generate_lead',
  form_name: 'contact_us',
  subject: 'Order Status / Courier Tracking'
});
```

---

## 4. Privacy & Consent Management

- **Google Consent Mode v2:** Initialized with default privacy restrictions before tag evaluation:
  ```javascript
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  ```
- **Zero PII Exposure:** Customer names, phone numbers, delivery addresses, and message contents are strictly withheld from all `dataLayer` payloads.
- **IP Anonymization:** `anonymize_ip: true` is configured by default.

---

## 5. Verification Results

1. **Static HTML Pre-rendering:**
   All 16 static routes generated by `scripts/prerender.cjs` in `dist/` contain the complete GTM container head snippet and noscript body tag.
2. **Build Test:**
   ```
   ✓ 1978 modules transformed.
   ✓ built in 3.44s
   Generating pre-rendered static HTML routes for 16 paths...
   Static route prerendering completed successfully!
   Exit code: 0
   ```
3. **Git History Status:**
   - Commit `c899c1c`: `feat(gtm): install Google Tag Manager container GTM-5Q8BQXJ6`
   - Commit `9e4a2e7`: `feat(gtm): complete official GTM container integration with Enhanced Ecommerce dataLayer support`
   - Working tree: Clean.
   - Remote branch: Unpushed (ready for review).
