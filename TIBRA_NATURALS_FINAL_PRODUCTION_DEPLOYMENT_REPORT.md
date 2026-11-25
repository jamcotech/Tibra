# TIBRA NATURALS – ONE-SHOT FINAL PRODUCTION DEPLOYMENT & ANALYTICS AUDIT REPORT

**Target Production Domain:** [https://www.tibranaturals.com/](https://www.tibranaturals.com/)  
**Brand:** TIBRA NATURALS  
**GitHub Repository:** [https://github.com/jamcotech/Tibra](https://github.com/jamcotech/Tibra)  
**Production Branch:** `main`  
**Latest Production Commit Hash:** `25afdecadd6b996ec06a8cf4994fe4ae16391b0f` (short: `25afdec`)  
**GTM Container ID:** `GTM-5Q8BQXJ6`  
**GA4 Measurement ID:** `G-9ZZ9VMPDQ2` (Verified & active in live production client bundle `assets/index-CJdsleaU.js`)  
**Hosting Target:** Vercel Edge Network  
**Live Production Vercel ID:** `bom1::vbn6c-1795587905725-ba415c6cb670`  
**Audit Timestamp:** November 25, 2026, 11:26 AM PKT  
**Status:** **DEPLOYED TO PRODUCTION, TESTED & VERIFIED**

---

## 1. Executive Summary & Verification Matrix

All checks are classified strictly using objective statuses (`PASS`, `FAIL`, or `NOT TESTED`) based on independent runtime evidence.

| Audit Section | Status | Verified Evidence & Test Output |
|---|:---:|---|
| **1. Code Architecture & Build** | **PASS** | `npm run build` executed cleanly (code 0) with `tsc -b`, Vite minification, and prerendering of 1 root + 16 deep routes = 17 static HTML entrypoints. |
| **2. Six Core Events Standardization** | **PASS** | Standardized to `Website -> dataLayer.push() -> GTM Custom Event Trigger -> GA4 Event Tag -> GA4`. Removed all direct `gtag('event', ...)` dispatches for `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, and `generate_lead`. Exactly 1 dataLayer dispatch per action. |
| **3. Preserved Interaction Events** | **PASS** | Dual tracking for `whatsapp_click` and `contact_click` preserved without modification or duplication. |
| **4. Google Consent Mode v2** | **PASS** | `gtag('consent', 'default', ...)` executes in `<head>` *prior* to GTM loader. All 4 parameters (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) default to `'denied'`. Interactive banner supports Accept All, Essential Only, Custom settings, and footer revocation. |
| **5. E-commerce Subtotal & Deduction** | **PASS** | `purchase.value` and `begin_checkout.value` strictly represent merchandise subtotal excluding shipping. Shipping is passed separately as `shipping: 200`. Zero duplicate purchase dispatches (deduplicated via memory Set + sessionStorage). |
| **6. Zero Customer PII in GA4** | **PASS** | Free-text subject field removed. Lead tracking uses controlled programmatic slugs only (`inquiry_type: 'order_status' \| 'product_dosage' \| 'wholesale' \| 'general'`). Zero personal names, emails, phone numbers, or delivery addresses are sent. |
| **7. GitHub Remote Push** | **PASS** | Pushed to `origin/main` ([https://github.com/jamcotech/Tibra.git](https://github.com/jamcotech/Tibra.git)). Remote HEAD confirmed at commit `25afdecadd6b996ec06a8cf4994fe4ae16391b0f`. |
| **8. Vercel Production Deployment** | **PASS** | Vercel production build automatically triggered and served live. Live HTTP response confirmed (`Server: Vercel`, `X-Vercel-Id: bom1::vbn6c-1795587905725-ba415c6cb670`, `Etag: "3e0c716a2362fcc2e925e2c07b127b05"`). |
| **9. Live Production Smoke Test** | **PASS** | All 17 canonical routes return `HTTP 200 OK`. Non-WWW `https://tibranaturals.com/` returns `308 Permanent Redirect` to `https://www.tibranaturals.com/`. `robots.txt` returns `200 OK`, `sitemap.xml` returns `200 OK`. |
| **10. Live GA4 Measurement ID** | **PASS** | Deployed live bundle `/assets/index-CJdsleaU.js` verified to contain `G-9ZZ9VMPDQ2`. |
| **11. GTM Cloud Workspace Publication** | **NOT TESTED** | Browser subagent verified navigation to `https://tagmanager.google.com/` redirects to `accounts.google.com` (requires interactive Google account authentication by the container owner). Complete tag/trigger specifications provided below. |
| **12. GA4 Console Stream Setting** | **NOT TESTED** | Direct inspection of GA4 Admin console requires interactive Google account sign-in. Setting recommendation to disable "Page changes based on browser history events" is detailed below. |

---

## 2. Six Core Events Standardization (Website &rarr; dataLayer &rarr; GTM &rarr; GA4)

In [`src/services/analyticsService.ts`](file:///d:/E/PureFix/Pure%20Fix%20website%20for%20Chat%20GPT/src/services/analyticsService.ts), duplicate direct `window.gtag('event', ...)` calls were removed for all six GTM-managed events:

```text
1. page_view        → dataLayer.push({ event: 'page_view', page_path, page_title, page_location })
2. view_item        → dataLayer.push({ ecommerce: null }); dataLayer.push({ event: 'view_item', ecommerce: {...} })
3. add_to_cart      → dataLayer.push({ ecommerce: null }); dataLayer.push({ event: 'add_to_cart', ecommerce: {...} })
4. begin_checkout   → dataLayer.push({ ecommerce: null }); dataLayer.push({ event: 'begin_checkout', ecommerce: {...} })
5. purchase         → dataLayer.push({ ecommerce: null }); dataLayer.push({ event: 'purchase', ecommerce: {...} })
6. generate_lead    → dataLayer.push({ event: 'generate_lead', form_id, form_name, inquiry_type, currency: 'PKR' })
```

### Direct `gtag('event', ...)` Audit:
- **Core 6 events:** **0** direct `gtag('event')` dispatches (Prevents double counting in GA4).
- **Consent calls:** Preserved (`gtag('consent', 'default', ...)` and `gtag('consent', 'update', ...)`).
- **Engagement clicks:** Preserved (`whatsapp_click` and `contact_click`).

---

## 3. GitHub & Vercel Deployment Verification

### Git Commit Chain on `origin/main`:
```text
25afdec fix(analytics): standardize six core events to dataLayer and configure GA4 ID G-9ZZ9VMPDQ2
435dd36 fix(analytics): remove duplicate direct gtag page_view call and rely on GTM dataLayer
744e5ad docs(deployment): add final production deployment and verification reports
e37e82a fix(gtm): correct ecommerce value calculation, remove free-text PII, and update audit report
```

### Live Vercel Production Headers:
```http
HTTP/1.1 200 OK
Server: Vercel
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=0, must-revalidate
Date: Wed, 25 Nov 2026 06:25:06 GMT
Etag: "3e0c716a2362fcc2e925e2c07b127b05"
Last-Modified: Wed, 25 Nov 2026 06:25:06 GMT
X-Vercel-Id: bom1::vbn6c-1795587905725-ba415c6cb670
```

### Live Production JavaScript Bundle:
```html
<script type="module" crossorigin src="/assets/index-CJdsleaU.js"></script>
```
*Verification:* Evaluated `/assets/index-CJdsleaU.js` on `https://www.tibranaturals.com/` &rarr; confirmed string `G-9ZZ9VMPDQ2` is active.

---

## 4. Live Production Smoke Test: All 17 Canonical Routes

All 17 canonical URLs were queried directly on `https://www.tibranaturals.com/`:

```text
/                                          200 OK
/products/pain-relief-oil/                 200 OK
/ingredients/                              200 OK
/how-to-use/                               200 OK
/our-quality/                              200 OK
/about-us/                                 200 OK
/blog/                                     200 OK
/blog/herbal-massage-oil-guide/            200 OK
/blog/natural-oils-and-personal-care/      200 OK
/blog/understanding-herbal-ingredients/    200 OK
/blog/safe-use-of-topical-oils/            200 OK
/faq/                                      200 OK
/contact-us/                               200 OK
/shipping-policy/                          200 OK
/return-policy/                            200 OK
/privacy-policy/                           200 OK
/terms-and-conditions/                     200 OK
https://www.tibranaturals.com/robots.txt   200 OK
https://www.tibranaturals.com/sitemap.xml  200 OK
https://tibranaturals.com/ (Non-WWW)       308 Permanent Redirect (-> www)
```

---

## 5. Google Tag Manager Cloud Specification (`GTM-5Q8BQXJ6`)

*Note: The browser subagent confirmed that accessing `https://tagmanager.google.com/` redirects to `accounts.google.com` (no active Google account authenticated). Therefore, container publication must be submitted by the container owner using the exact verified configuration below:*

### A. Google Analytics Base Tag
- **Tag Type:** Google tag
- **Tag ID:** `G-9ZZ9VMPDQ2`
- **Firing Trigger:** `Initialization – All Pages`
- **Configuration Parameter:** `send_page_view: false`

### B. Required Data Layer Variables (Data Layer Version 2)
1. `dlv - page_path` &rarr; `page_path`
2. `dlv - page_title` &rarr; `page_title`
3. `dlv - page_location` &rarr; `page_location`
4. `dlv - form_id` &rarr; `form_id`
5. `dlv - form_name` &rarr; `form_name`
6. `dlv - inquiry_type` &rarr; `inquiry_type`

### C. Required GA4 Event Tags
| Tag Name | Event Name | Trigger | Configuration / Parameters |
|---|---|---|---|
| **GA4 - page_view** | `page_view` | Custom Event: `CE - page_view` | `page_path: {{dlv - page_path}}`<br>`page_title: {{dlv - page_title}}`<br>`page_location: {{dlv - page_location}}` |
| **GA4 - view_item** | `view_item` | Custom Event: `CE - view_item` | Send Ecommerce Data: `true` (Data Layer) |
| **GA4 - add_to_cart** | `add_to_cart` | Custom Event: `CE - add_to_cart` | Send Ecommerce Data: `true` (Data Layer) |
| **GA4 - begin_checkout** | `begin_checkout` | Custom Event: `CE - begin_checkout` | Send Ecommerce Data: `true` (Data Layer) |
| **GA4 - purchase** | `purchase` | Custom Event: `CE - purchase` | Send Ecommerce Data: `true` (Data Layer) |
| **GA4 - generate_lead** | `generate_lead` | Custom Event: `CE - generate_lead` | `form_id: {{dlv - form_id}}`<br>`form_name: {{dlv - form_name}}`<br>`inquiry_type: {{dlv - inquiry_type}}` |

### D. Publication Recommendation
In [Google Tag Manager](https://tagmanager.google.com/), click **Submit** &rarr; **Publish** with Version Name:  
`TIBRA NATURALS — Final GA4 Ecommerce & Consent Mode v2 Production Tracking`

---

## 6. GA4 Web Data Stream Recommendation

In the Google Analytics 4 console:
1. Navigate to **Admin** &rarr; **Data Streams** &rarr; select Web Data Stream for `G-9ZZ9VMPDQ2`.
2. Under **Enhanced measurement**, click the settings gear.
3. Under **Page views**, expand Advanced Settings and **uncheck "Page changes based on browser history events"**.
4. *Reason:* The SPA application fires explicit, deduplicated `page_view` events through the dataLayer on every route transition. Disabling browser-history page views guarantees that no secondary automated pageview is triggered.
