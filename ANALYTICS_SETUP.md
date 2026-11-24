# TIBRA NATURALS – Google Analytics 4 (GA4) & Tracking Setup

**Target Measurement Setup:** Google Analytics 4 (GA4)  
**Currency:** PKR (Pakistani Rupees)  
**Tracking Service:** `src/services/analyticsService.ts`  

---

## 1. Site Owner Setup Instructions

### Step 1: Create GA4 Property
1. Log into [Google Analytics](https://analytics.google.com/).
2. Create an Account named **TIBRA NATURALS**.
3. Create a Property named **TIBRA NATURALS Official Web Store**.
4. Set Reporting Time Zone to: `Pakistan (Karachi - GMT+05:00)`.
5. Set Currency to: `Pakistani Rupee (PKR)`.

### Step 2: Create Web Data Stream
1. In Property settings, click **Data Streams** ➔ **Web**.
2. Stream URL: `https://www.tibranaturals.com`
3. Stream Name: `TIBRA NATURALS Storefront`
4. Copy the generated **Measurement ID** (format: `G-XXXXXXXXXX`).

### Step 3: Configure Environment Variable
In your deployment environment (or local `.env.production` file), add:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
*Note: Replace `G-XXXXXXXXXX` with your real Measurement ID provided by Google Analytics.*

---

## 2. Integrated Event Architecture

The site code is pre-instrumented with standardized GA4 e-commerce events:

| Event Name | Trigger Point in Code | Parameters Passed |
| :--- | :--- | :--- |
| `page_view` | Every route change via `navigate()` in `ShopContext.tsx` | `page_path`, `page_title`, `page_location` |
| `view_item` | Product detail page view (`ProductDetailPage.tsx`) | `item_id`, `item_name`, `price`, `currency: "PKR"` |
| `add_to_cart` | Clicking "Add to Cart" or "Buy Now" | `item_id`, `item_name`, `price`, `quantity`, `currency: "PKR"` |
| `begin_checkout` | Entering checkout review (`CheckoutPage.tsx`) | `items[]`, `value`, `currency: "PKR"` |
| `purchase` | Order submission & confirmation (`CheckoutPage.tsx`) | `transaction_id` (Order Number), `value`, `shipping: 200`, `items[]` |
| `whatsapp_click` | Clicking floating WhatsApp or order inquiry buttons | `event_category: "engagement"`, `event_label: "context"` |
| `contact_click` | Submitting message on Contact Us page | `event_category: "engagement"`, `event_label: "channel"` |
