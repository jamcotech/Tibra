/**
 * TIBRA NATURALS — Meta Pixel Service
 *
 * Centralized, privacy-compliant, consent-gated Meta Pixel client service.
 *
 * Features & Privacy Guarantees:
 * - Direct application integration (bypasses Google Tag Manager).
 * - Strict integration with website Cookie Consent system (Google Consent Mode v2 / tibra_consent_state).
 * - Defaults to DENIED: No script loading or event tracking occurs without explicit marketing consent.
 * - Dynamic consent management: Supports Accept All, Essential Only, Custom Preferences, and Footer Revocation.
 * - Single base script initialization with automatic duplicate prevention.
 * - Base script automatic PageView is DISABLED; PageView is dispatched manually per SPA route transition.
 * - Meta Business Tools Terms Compliance:
 *   - Strictly ZERO customer Personally Identifiable Information (PII) transmitted.
 *   - Strictly ZERO sensitive medical or health condition parameters transmitted.
 *   - Automatic Advanced Matching is disabled.
 *   - Standard e-commerce parameters only (content_ids, content_type: 'product', currency: 'PKR', value, num_items).
 * - Stable order-level deduplication on Purchase events.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export interface MetaItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

const STORAGE_KEY = 'tibra_consent_state';

class MetaPixelService {
  private isInitialized = false;
  private hasMarketingConsent = false;
  private lastTrackedPath: string | null = null;
  private lastTrackedTime = 0;
  private trackedOrders = new Set<string>();

  /**
   * Retrieves the Meta Pixel ID from environment variables.
   */
  getPixelId(): string | undefined {
    const rawId = typeof import.meta !== 'undefined' && import.meta.env?.VITE_META_PIXEL_ID;
    return typeof rawId === 'string' && rawId.trim() ? rawId.trim() : undefined;
  }

  /**
   * Validates if a string conforms to a valid numeric Meta Pixel ID.
   * Rejects placeholders, empty values, or non-numeric tokens.
   */
  isValidPixelId(id?: string): boolean {
    if (!id) return false;
    const cleanId = id.trim();
    if (cleanId === '' || cleanId.includes('X') || cleanId.toLowerCase().includes('placeholder')) {
      return false;
    }
    // Meta Pixel IDs are typically 14 to 17 numeric digits
    return /^\d{10,20}$/.test(cleanId);
  }

  /**
   * Checks whether the user has stored marketing consent in localStorage.
   */
  private checkStoredMarketingConsent(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed && parsed.marketing === true;
      }
    } catch {
      // In restricted storage environments, default to denied
    }
    return false;
  }

  /**
   * Safe wrapper for window.fbq calls.
   */
  private callFbq(...args: any[]): void {
    if (typeof window === 'undefined') return;
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq(...args);
    }
  }

  /**
   * Injects the official Meta Pixel base loader script asynchronously.
   * Does NOT fire automatic PageView (managed manually via trackPageView).
   */
  private loadScript(pixelId: string): void {
    if (typeof window === 'undefined') return;
    if ((window as any).fbq) return;

    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    // Disable automatic configuration and automatic matching for health/privacy compliance
    this.callFbq('set', 'autoConfig', false, pixelId);

    // Grant consent before initializing if user already consented
    if (this.hasMarketingConsent) {
      this.callFbq('consent', 'grant');
    }

    // Initialize Pixel with explicit ID
    this.callFbq('init', pixelId);

    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.info(`[MetaPixel] Initialized Meta Pixel with ID: ${pixelId}`);
    }
  }

  /**
   * Initializes Meta Pixel service if marketing consent and valid Pixel ID exist.
   * Safe to call on application mount.
   */
  init(): void {
    if (typeof window === 'undefined') return;
    if (this.isInitialized) return;

    this.hasMarketingConsent = this.checkStoredMarketingConsent();
    const pixelId = this.getPixelId();

    if (!this.isValidPixelId(pixelId)) {
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.info('[MetaPixel] VITE_META_PIXEL_ID is not configured or placeholder. Meta Pixel inactive.');
      }
      return;
    }

    if (this.hasMarketingConsent) {
      this.loadScript(pixelId!);
      this.isInitialized = true;
    }
  }

  /**
   * Called when user explicitly grants marketing consent (e.g. Accept All or Custom save).
   */
  grantConsent(): void {
    this.hasMarketingConsent = true;
    const pixelId = this.getPixelId();

    if (!this.isValidPixelId(pixelId)) return;

    if (!this.isInitialized) {
      this.loadScript(pixelId!);
      this.isInitialized = true;
    } else {
      this.callFbq('consent', 'grant');
    }

    // Fire initial PageView for the current route after consent grant
    this.trackPageView(window.location.pathname);
  }

  /**
   * Called when user revokes marketing consent (e.g. Essential Only or Custom deselect).
   */
  revokeConsent(): void {
    this.hasMarketingConsent = false;
    this.callFbq('consent', 'revoke');
  }

  /**
   * Tracks SPA route changes and page loads as Meta 'PageView'.
   * Deduplicated within a 600ms window.
   */
  trackPageView(path?: string): void {
    if (typeof window === 'undefined') return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    const currentPath = path || window.location.pathname;
    const now = Date.now();

    if (this.lastTrackedPath === currentPath && now - this.lastTrackedTime < 600) {
      return;
    }

    this.lastTrackedPath = currentPath;
    this.lastTrackedTime = now;

    this.callFbq('track', 'PageView');
  }

  /**
   * Tracks viewing an individual product detail as Meta 'ViewContent'.
   * Contains strictly allowed ecommerce fields with zero health/medical claims.
   */
  trackViewContent(item: MetaItem): void {
    if (typeof window === 'undefined') return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    this.callFbq('track', 'ViewContent', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'PKR',
    });
  }

  /**
   * Tracks adding an item to the shopping cart as Meta 'AddToCart'.
   * Fires only after cart state update succeeds.
   */
  trackAddToCart(item: MetaItem): void {
    if (typeof window === 'undefined') return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    const qty = item.quantity || 1;

    this.callFbq('track', 'AddToCart', {
      content_ids: [item.id],
      contents: [
        {
          id: item.id,
          quantity: qty,
          item_price: item.price,
        },
      ],
      content_name: item.name,
      content_type: 'product',
      value: item.price * qty,
      currency: 'PKR',
    });
  }

  /**
   * Tracks starting the checkout flow as Meta 'InitiateCheckout'.
   * Calculated strictly from actual cart items.
   */
  trackInitiateCheckout(items: MetaItem[], subtotal: number): void {
    if (typeof window === 'undefined') return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    const totalQty = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    this.callFbq('track', 'InitiateCheckout', {
      content_ids: items.map((i) => i.id),
      contents: items.map((i) => ({
        id: i.id,
        quantity: i.quantity || 1,
        item_price: i.price,
      })),
      content_type: 'product',
      value: subtotal,
      currency: 'PKR',
      num_items: totalQty,
    });
  }

  /**
   * Tracks a successfully completed order as Meta 'Purchase'.
   *
   * Safeguards:
   * - Fires strictly on genuine order completion.
   * - Deduplicated by orderNumber in memory and sessionStorage.
   * - Value strictly represents merchandise subtotal (excluding shipping).
   * - Zero customer PII transmitted.
   */
  trackPurchase(orderNumber: string, items: MetaItem[], subtotal: number): void {
    if (typeof window === 'undefined' || !orderNumber) return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    // In-memory deduplication check
    if (this.trackedOrders.has(orderNumber)) {
      return;
    }

    // SessionStorage deduplication check (prevents repeat fires on reload)
    try {
      const storageKey = `tibra_meta_order_${orderNumber}`;
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Fallback if sessionStorage is unavailable
    }

    this.trackedOrders.add(orderNumber);

    const totalQty = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    this.callFbq('track', 'Purchase', {
      content_ids: items.map((i) => i.id),
      contents: items.map((i) => ({
        id: i.id,
        quantity: i.quantity || 1,
        item_price: i.price,
      })),
      content_type: 'product',
      value: subtotal,
      currency: 'PKR',
      num_items: totalQty,
    });
  }

  /**
   * Tracks contact form submission as Meta 'Lead'.
   * Contains strictly controlled non-PII form identifier.
   */
  trackLead(formId = 'contact_form'): void {
    if (typeof window === 'undefined') return;
    if (!this.hasMarketingConsent || !this.isInitialized) return;

    this.callFbq('track', 'Lead', {
      content_name: formId,
      currency: 'PKR',
    });
  }
}

export const metaPixelService = new MetaPixelService();
export default metaPixelService;
