# TIBRA NATURALS – Google Search Console & Indexing Setup Guide

**Domain Property:** `tibranaturals.com`  
**Primary URL-Prefix Property:** `https://www.tibranaturals.com/`  
**Sitemap Destination:** `https://www.tibranaturals.com/sitemap.xml`  

---

## 1. Domain Ownership Verification via DNS TXT Method

> [!IMPORTANT]
> The site owner must log into their DNS management console (e.g. Cloudflare, Namecheap, GoDaddy) and add the following verification TXT record.

### Required DNS Record
- **Type:** `TXT`
- **Host / Name:** `@` (or leave empty depending on DNS provider)
- **Value:** `google-site-verification=YOUR_ACTUAL_GSC_VERIFICATION_TOKEN_HERE`
- **TTL:** Auto or 300 seconds

*Note: Do not invent placeholder verification tokens. Once generated inside Google Search Console, paste the exact token provided by Google.*

---

## 2. Setting Up Google Search Console Properties

### Step 1: Add Domain Property
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select the left **Domain** option.
3. Enter: `tibranaturals.com` (covers all subdomains: www, non-www, http, https).
4. Complete the DNS TXT verification.

### Step 2: Add Preferred URL-Prefix Property
1. Also add a **URL-prefix** property for: `https://www.tibranaturals.com/`
2. This ensures access to specialized URL inspection tools, robots.txt testing, and sitemap tracking.

---

## 3. Submitting the XML Sitemap

1. In the left navigation of Search Console, go to **Index** ➔ **Sitemaps**.
2. Under "Add a new sitemap", enter: `sitemap.xml`
3. Full URL submitted: `https://www.tibranaturals.com/sitemap.xml`
4. Click **Submit**.
5. Verify status returns **Success** with 17 discovered URLs.

---

## 4. URL Inspection & Priority Indexing Request

Once verified and the production domain is live, execute URL Inspection for the priority seed pages:
1. `https://www.tibranaturals.com/` (Homepage)
2. `https://www.tibranaturals.com/products/pain-relief-oil/` (Main Product Page)
3. `https://www.tibranaturals.com/ingredients/` (Ingredients Hub)
4. `https://www.tibranaturals.com/how-to-use/` (Application Ritual)
5. `https://www.tibranaturals.com/about-us/` (About Us)
6. `https://www.tibranaturals.com/blog/` (Blog Hub)

Click **Test Live URL** ➔ Confirm HTTP 200 and mobile render ➔ Click **Request Indexing**.

---

## 5. Indexing Realities & Ongoing Monitoring

- **Submission vs. Indexing:** Submitting a sitemap announces URLs to Googlebot; Google crawls and evaluates quality, mobile responsiveness, and uniqueness before indexing.
- **Weekly Check:** Monitor **Page Indexing** report to ensure zero 404, redirect loop, or canonical mismatch errors.
- **Core Web Vitals:** Check the **Experience** ➔ **Core Web Vitals** report to confirm Good status on mobile.
