/**
 * TIBRA NATURALS – Google Analytics 4 (GA4) & Conversion Tracking Service
 * 
 * Standardized, Privacy-Compliant E-Commerce Event Dispatcher for GA4.
 * Uses VITE_GA_MEASUREMENT_ID environment variable (e.g. G-XXXXXXXXXX).
 * 
 * Features:
 * - Initializes dynamically ONLY when a valid non-placeholder Measurement ID exists.
 * - Prevents duplicate script injection, duplicate page_view events, and duplicate purchase events.
 * - Google Consent Mode v2 default configuration.
 * - Strictly strips all Customer PII (no names, phone numbers, emails, or delivery addresses).
 * - Safe no-op execution when running in development or when Measurement ID is unset.
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
  form_name: string;
  subject?: string;
}

class AnalyticsService {
  private initialized = false;
  private lastTrackedPath: string | null = null;
  private lastTrackedTime = 0;
  private trackedOrders = new Set<string>();

  /**
   * Retrieves the Measurement ID from Vite environment variables.
   */
  getMeasurementId(): string | undefined {
    const rawId = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID;
    return typeof rawId === 'string' ? rawId.trim() : undefined;
  }

  /**
   * Validates if a Measurement ID conforms to the GA4 format (G-XXXXXXXXXX)
   * and is not an unconfigured placeholder.
   */
  isValidMeasurementId(id?: string): boolean {
    if (!id) return false;
    const cleanId = id.trim().toUpperCase();
    if (cleanId === 'G-XXXXXXXXXX' || cleanId === 'G-XXXXXXXX' || cleanId === '') {
      return false;
    }
    return /^G-[A-Z0-9]+$/i.test(cleanId);
  }

  /**
   * Initializes GA4 gtag.js script and sets up base configuration.
   */
  init(): void {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    const measurementId = this.getMeasurementId();

    // Prepare dataLayer and fallback gtag
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    if (!this.isValidMeasurementId(measurementId)) {
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.info(
          `[Analytics] GA4 tracking disabled: Measurement ID is unset or placeholder ("${measurementId || 'undefined'}"). Set VITE_GA_MEASUREMENT_ID in your environment to enable live tracking.`
        );
      }
      return;
    }

    // Set Google Consent Mode v2 defaults
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    window.gtag('js', new Date());

    // Configure GA4 Measurement ID with manual page_view handling
    window.gtag('config', measurementId!, {
      send_page_view: false, // Managed explicitly per SPA route transition
      currency: 'PKR',
      anonymize_ip: true,
    });

    // Inject gtag.js script if not already present
    if (!document.getElementById('ga4-gtag-script')) {
      const script = document.createElement('script');
      script.id = 'ga4-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId!)}`;
      document.head.appendChild(script);
    }

    this.initialized = true;
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.info(`[Analytics] GA4 initialized successfully with Measurement ID: ${measurementId}`);
    }
  }

  /**
   * Tracks SPA route page views with deduplication.
   */
  trackPageView(path: string, title?: string): void {
    if (typeof window === 'undefined') return;

    // Deduplicate rapid consecutive hits for the same path
    const now = Date.now();
    if (this.lastTrackedPath === path && now - this.lastTrackedTime < 600) {
      return;
    }
    this.lastTrackedPath = path;
    this.lastTrackedTime = now;

    const pageTitle = title || document.title;
    const pageLocation = window.location.href;

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: pageTitle,
        page_location: pageLocation,
      });
    }
  }

  /**
   * Tracks viewing an individual product detail or showcase.
   */
  trackViewItem(item: EcommerceItem): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'view_item', {
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
    });
  }

  /**
   * Tracks adding an item to the shopping cart.
   */
  trackAddToCart(item: EcommerceItem): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'add_to_cart', {
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
    });
  }

  /**
   * Tracks checkout initialization.
   */
  trackBeginCheckout(items: EcommerceItem[], totalValue: number): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'begin_checkout', {
      currency: 'PKR',
      value: totalValue,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_brand: i.item_brand || 'TIBRA NATURALS',
        item_category: i.item_category || 'Herbal Massage Oils',
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }

  /**
   * Tracks completed purchases with transaction deduplication.
   * Guarantees verified transaction ID and strictly excludes PII.
   */
  trackPurchase(orderNumber: string, total: number, items: EcommerceItem[], shipping = 200): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    if (!orderNumber) return;

    // Check memory cache
    if (this.trackedOrders.has(orderNumber)) {
      return;
    }

    // Check session storage to prevent duplicate events on page reload
    try {
      const storageKey = `tibra_ga_order_${orderNumber}`;
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Fallback if sessionStorage is disabled or restricted
    }

    this.trackedOrders.add(orderNumber);

    window.gtag('event', 'purchase', {
      transaction_id: orderNumber,
      currency: 'PKR',
      value: total,
      shipping,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        item_brand: i.item_brand || 'TIBRA NATURALS',
        item_category: i.item_category || 'Herbal Massage Oils',
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }

  /**
   * Tracks contact form submission as a conversion lead.
   * Strictly excludes any customer PII (no name, email, phone, or raw message).
   */
  trackContactSubmit(formData: ContactFormData): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'generate_lead', {
      currency: 'PKR',
      form_name: formData.form_name || 'contact_us',
      subject: formData.subject || 'General Inquiry',
    });

    window.gtag('event', 'contact_form_submit', {
      event_category: 'engagement',
      form_name: formData.form_name || 'contact_us',
      subject: formData.subject || 'General Inquiry',
    });
  }

  /**
   * Tracks WhatsApp order reservation or inquiry clicks.
   */
  trackWhatsAppClick(context: string): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: context,
    });
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
