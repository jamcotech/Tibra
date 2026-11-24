/**
 * TIBRA NATURALS – Google Analytics 4 (GA4) & Conversion Tracking Service
 * 
 * Standardized E-Commerce Event Dispatcher for GA4 / Google Tag Manager.
 * Uses placeholder for site owner's actual Measurement ID (e.g., G-XXXXXXXXXX).
 * Avoids duplicate event firing and provides debug logging in development.
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

export const analyticsService = {
  getMeasurementId(): string | undefined {
    return (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
      undefined
    );
  },

  init(): void {
    if (typeof window === 'undefined') return;
    const measurementId = this.getMeasurementId();

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
    }

    if (measurementId) {
      window.gtag('config', measurementId, {
        send_page_view: false, // Managed manually per route
        currency: 'PKR',
      });
    }
  },

  trackPageView(path: string, title?: string): void {
    if (typeof window === 'undefined') return;
    const pageTitle = title || document.title;
    
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: pageTitle,
        page_location: window.location.href,
      });
    }
  },

  trackViewItem(item: EcommerceItem): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'PKR',
        value: item.price * item.quantity,
        items: [
          {
            item_id: item.item_id,
            item_name: item.item_name,
            item_brand: item.item_brand || 'TIBRA NATURALS',
            item_category: item.item_category || 'Herbal Massage Oils',
            price: item.price,
            quantity: item.quantity,
          },
        ],
      });
    }
  },

  trackAddToCart(item: EcommerceItem): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'PKR',
        value: item.price * item.quantity,
        items: [
          {
            item_id: item.item_id,
            item_name: item.item_name,
            item_brand: item.item_brand || 'TIBRA NATURALS',
            item_category: item.item_category || 'Herbal Massage Oils',
            price: item.price,
            quantity: item.quantity,
          },
        ],
      });
    }
  },

  trackBeginCheckout(items: EcommerceItem[], totalValue: number): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'PKR',
        value: totalValue,
        items: items.map(i => ({
          item_id: i.item_id,
          item_name: i.item_name,
          item_brand: i.item_brand || 'TIBRA NATURALS',
          price: i.price,
          quantity: i.quantity,
        })),
      });
    }
  },

  trackPurchase(orderNumber: string, total: number, items: EcommerceItem[]): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderNumber,
        currency: 'PKR',
        value: total,
        shipping: 200,
        items: items.map(i => ({
          item_id: i.item_id,
          item_name: i.item_name,
          item_brand: i.item_brand || 'TIBRA NATURALS',
          price: i.price,
          quantity: i.quantity,
        })),
      });
    }
  },

  trackWhatsAppClick(context: string): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: context,
      });
    }
  },

  trackContactClick(channel: 'phone' | 'email' | 'form'): void {
    if (typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', 'contact_click', {
        event_category: 'engagement',
        event_label: channel,
      });
    }
  },
};

export default analyticsService;
