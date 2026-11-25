/**
 * TIBRA NATURALS – Google Tag Manager (GTM) & Google Analytics 4 (GA4) Service
 * 
 * Container ID: GTM-5Q8BQXJ6
 * Measurement ID: VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX)
 * 
 * Features:
 * - Dual compatibility: Pushes structured events to GTM `dataLayer` and dispatches via `gtag`.
 * - Strictly distinguishes GTM Container ID (GTM-XXXXXXX) from GA4 Measurement ID (G-XXXXXXXXXX).
 * - Avoids duplicate tracking scripts: GTM container is loaded once in <head>; gtag helper routes to dataLayer.
 * - Prevents duplicate SPA page_view and purchase events.
 * - Supports Google Consent Mode v2.
 * - Zero PII transmission.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export interface ContactFormData {
  form_id: string;
  form_name: string;
  inquiry_type?: string; // Controlled fixed slug only (never free-text)
}

export const GTM_CONTAINER_ID = 'GTM-5Q8BQXJ6';

class AnalyticsService {
  private initialized = false;
  private lastTrackedPath: string | null = null;
  private lastTrackedTime = 0;
  private trackedOrders = new Set<string>();

  /**
   * Retrieves the GA4 Measurement ID from Vite environment variables.
   * Note: This is separate and distinct from the GTM Container ID.
   */
  getMeasurementId(): string | undefined {
    const rawId = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) || 'G-9ZZ9VMPDQ2';
    return typeof rawId === 'string' ? rawId.trim() : 'G-9ZZ9VMPDQ2';
  }

  /**
   * Validates if a string conforms to the GA4 Measurement ID format (G-XXXXXXXXXX).
   * Explicitly rejects GTM Container IDs (GTM-XXXXXXX) and placeholder values.
   */
  isValidMeasurementId(id?: string): boolean {
    if (!id) return false;
    const cleanId = id.trim().toUpperCase();
    if (cleanId === 'G-XXXXXXXXXX' || cleanId === 'G-XXXXXXXX' || cleanId === '') {
      return false;
    }
    // Must start with 'G-' and NOT 'GTM-'
    if (cleanId.startsWith('GTM-')) {
      return false;
    }
    return /^G-[A-Z0-9]+$/i.test(cleanId);
  }

  /**
   * Initializes analytics configuration and Consent Mode v2.
   * GTM container script is embedded in index.html.
   */
  init(): void {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    window.dataLayer = window.dataLayer || [];

    // Ensure gtag function exists and forwards arguments to dataLayer
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    // Sync consent state from storage if available, defaulting to denied for GDPR / privacy compliance
    try {
      const stored = localStorage.getItem('tibra_consent_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        window.gtag('consent', 'update', {
          analytics_storage: parsed.analytics ? 'granted' : 'denied',
          ad_storage: parsed.marketing ? 'granted' : 'denied',
          ad_user_data: parsed.marketing ? 'granted' : 'denied',
          ad_personalization: parsed.marketing ? 'granted' : 'denied',
        });
      }
    } catch {
      // Fallback
    }

    const measurementId = this.getMeasurementId();

    if (this.isValidMeasurementId(measurementId)) {
      // If a valid GA4 Measurement ID is provided, configure it via gtag without auto page_view
      window.gtag('config', measurementId!, {
        send_page_view: false, // Managed manually per SPA route transition
        currency: 'PKR',
        anonymize_ip: true,
      });

      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.info(`[Analytics] GA4 configured with Measurement ID: ${measurementId} (via GTM container ${GTM_CONTAINER_ID})`);
      }
    } else {
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.info(`[Analytics] GTM container ${GTM_CONTAINER_ID} active. GA4 direct config bypassed (Measurement ID unset or placeholder).`);
      }
    }

    this.initialized = true;
  }

  /**
   * Tracks SPA route page views with deduplication.
   * Pushes to dataLayer for the GTM GA4 page_view tag ('CE - page_view' trigger).
   * Note: Direct gtag page_view event dispatch is omitted to prevent duplicate hits.
   */
  trackPageView(path: string, title?: string): void {
    if (typeof window === 'undefined') return;

    // Deduplicate rapid consecutive hits for the identical path
    const now = Date.now();
    if (this.lastTrackedPath === path && now - this.lastTrackedTime < 600) {
      return;
    }
    this.lastTrackedPath = path;
    this.lastTrackedTime = now;

    const pageTitle = title || document.title;
    const pageLocation = window.location.href;

    // Push standard GTM page_view event to dataLayer (captured by GTM Custom Event trigger)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }

  /**
   * Tracks viewing an individual product detail.
   */
  trackViewItem(item: EcommerceItem): void {
    if (typeof window === 'undefined') return;

    const ecommerceData = {
      currency: 'PKR',
      value: item.price * (item.quantity || 1),
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          item_brand: item.item_brand || 'TIBRA NATURALS',
          item_category: item.item_category || 'Herbal Massage Oils',
          price: item.price,
          quantity: item.quantity || 1,
        },
      ],
    };

    // GTM Enhanced Ecommerce push (captured by GTM Custom Event trigger 'CE - view_item')
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: ecommerceData,
    });
  }

  /**
   * Tracks adding an item to the shopping cart.
   */
  trackAddToCart(item: EcommerceItem): void {
    if (typeof window === 'undefined') return;

    const ecommerceData = {
      currency: 'PKR',
      value: item.price * (item.quantity || 1),
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          item_brand: item.item_brand || 'TIBRA NATURALS',
          item_category: item.item_category || 'Herbal Massage Oils',
          price: item.price,
          quantity: item.quantity || 1,
        },
      ],
    };

    // GTM Enhanced Ecommerce push (captured by GTM Custom Event trigger 'CE - add_to_cart')
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: ecommerceData,
    });
  }

  /**
   * Tracks checkout initialization.
   * GA4 event value must strictly represent the item subtotal, excluding shipping.
   */
  trackBeginCheckout(items: EcommerceItem[], itemSubtotal?: number): void {
    if (typeof window === 'undefined') return;

    const calculatedValue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const subtotalValue = typeof itemSubtotal === 'number' && itemSubtotal > 0 ? itemSubtotal : calculatedValue;

    const ecommerceData = {
      currency: 'PKR',
      value: subtotalValue,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_brand: i.item_brand || 'TIBRA NATURALS',
        item_category: i.item_category || 'Herbal Massage Oils',
        price: i.price,
        quantity: i.quantity,
      })),
    };

    // GTM Enhanced Ecommerce push (captured by GTM Custom Event trigger 'CE - begin_checkout')
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: ecommerceData,
    });
  }

  /**
   * Tracks completed purchases with transaction deduplication.
   * GA4 event value must equal the sum of item prices * quantity, EXCLUDING shipping.
   */
  trackPurchase(orderNumber: string, itemSubtotal: number, items: EcommerceItem[], shipping = 200): void {
    if (typeof window === 'undefined' || !orderNumber) return;

    // Check memory cache
    if (this.trackedOrders.has(orderNumber)) {
      return;
    }

    // Check session storage to prevent duplicate events on reload
    try {
      const storageKey = `tibra_gtm_order_${orderNumber}`;
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Fallback if sessionStorage is restricted
    }

    this.trackedOrders.add(orderNumber);

    const calculatedValue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const finalItemSubtotal = typeof itemSubtotal === 'number' && itemSubtotal > 0 ? itemSubtotal : calculatedValue;

    const ecommerceData = {
      transaction_id: orderNumber,
      currency: 'PKR',
      value: finalItemSubtotal, // Strictly item subtotal, excluding shipping
      shipping,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_brand: i.item_brand || 'TIBRA NATURALS',
        item_category: i.item_category || 'Herbal Massage Oils',
        price: i.price,
        quantity: i.quantity,
      })),
    };

    // GTM Enhanced Ecommerce purchase push (captured by GTM Custom Event trigger 'CE - purchase')
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: ecommerceData,
    });
  }

  /**
   * Tracks contact form submission as a conversion lead.
   * Uses fixed controlled identifiers only; strictly excludes free-text and customer PII.
   */
  trackContactSubmit(formData: ContactFormData): void {
    if (typeof window === 'undefined') return;

    const leadData = {
      currency: 'PKR',
      form_id: formData.form_id || 'contact_form',
      form_name: formData.form_name || 'contact_us',
      inquiry_type: formData.inquiry_type || 'general',
    };

    // Standard GTM lead generation push (captured by GTM Custom Event trigger 'CE - generate_lead')
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'generate_lead',
      ...leadData,
    });
  }

  /**
   * Tracks WhatsApp click events.
   */
  trackWhatsAppClick(context: string): void {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      event_category: 'engagement',
      event_label: context,
    });

    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: context,
      });
    }
  }

  /**
   * Tracks contact channel clicks (phone, email, inquiry).
   */
  trackContactClick(channel: 'phone' | 'email' | 'form'): void {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_click',
      event_category: 'engagement',
      event_label: channel,
    });

    if (window.gtag) {
      window.gtag('event', 'contact_click', {
        event_category: 'engagement',
        event_label: channel,
      });
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
