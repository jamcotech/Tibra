export interface TrackingStatusMeta {
  key: string;
  label: string;
  stepIndex: number;
  isException?: boolean;
  badgeColor: string;
  description: string;
}

export interface TrackingItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  source: string;
}

export interface TrackingDetails {
  success: boolean;
  orderNumber: string;
  trackingAccessToken?: string;
  orderDate: string;
  status: string;
  statusMeta: TrackingStatusMeta;
  estimatedDeliveryDate?: string;
  customerName: string;
  maskedPhone: string;
  maskedAddress: string;
  city: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  items: TrackingItem[];
  courier?: {
    name: string;
    trackingNumber: string;
    trackingUrl: string;
    lastSyncAt: string;
    originCity: string;
    destinationCity: string;
  };
  events: TrackingEvent[];
  lastUpdatedPkt: string;
  error?: string;
}

export const trackingService = {
  /**
   * Look up order tracking details by Order Number + Phone, OR by Tracking Access Token
   */
  async lookupOrder(params: {
    orderNumber?: string;
    phone?: string;
    token?: string;
  }): Promise<TrackingDetails> {
    const { orderNumber, phone, token } = params;

    let url = '/api/track';
    const searchParams = new URLSearchParams();
    if (token) {
      searchParams.set('token', token.trim());
    } else {
      if (orderNumber) searchParams.set('order', orderNumber.trim());
      if (phone) searchParams.set('phone', phone.trim());
    }
    url += `?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error looking up order (${response.status})`);
      }
      return data as TrackingDetails;
    } catch (err: any) {
      // In local dev without live serverless or if fetch fails, attempt local fallback lookup
      console.warn('[trackingService] Network request failed, attempting local fallback:', err);
      return this.localFallbackLookup(params);
    }
  },

  /**
   * Client-side fallback lookup if serverless endpoint is temporarily unreachable
   */
  localFallbackLookup(params: { orderNumber?: string; phone?: string; token?: string }): TrackingDetails {
    try {
      const stored = localStorage.getItem('tibra_orders_v1');
      if (stored) {
        const orders = JSON.parse(stored);
        const cleanOrder = (params.orderNumber || '').toUpperCase().trim();
        const cleanPhone = (params.phone || '').replace(/[^0-9]/g, '');

        const found = orders.find((o: any) => {
          if (params.token && o.trackingAccessToken === params.token) return true;
          if (cleanOrder && o.orderNumber?.toUpperCase().trim() === cleanOrder) {
            if (!cleanPhone) return true;
            const oPhone = (o.customerPhone || '').replace(/[^0-9]/g, '');
            return oPhone.endsWith(cleanPhone.slice(-7)) || cleanPhone.endsWith(oPhone.slice(-7));
          }
          return false;
        });

        if (found) {
          const status = found.status || 'order_placed';
          return {
            success: true,
            orderNumber: found.orderNumber,
            trackingAccessToken: found.trackingAccessToken,
            orderDate: found.date,
            status,
            statusMeta: {
              key: status,
              label: status.replace(/_/g, ' ').toUpperCase(),
              stepIndex: 1,
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
              description: 'Order record loaded from device.'
            },
            customerName: found.customerName,
            maskedPhone: '+92 3** ****' + (found.customerPhone?.slice(-2) || '00'),
            maskedAddress: found.city,
            city: found.city,
            paymentMethod: found.paymentMethod || 'COD',
            paymentStatus: found.paymentStatus || 'pending',
            total: found.total,
            items: (found.items || []).map((i: any) => ({
              productName: i.productName,
              quantity: i.quantity,
              price: i.price,
              image: i.image
            })),
            courier: found.deliveryCourier ? {
              name: found.deliveryCourier,
              trackingNumber: found.trackingNumber || 'PENDING',
              trackingUrl: '',
              lastSyncAt: new Date().toLocaleTimeString(),
              originCity: 'Lahore',
              destinationCity: found.city
            } : undefined,
            events: [
              {
                id: 'evt-loc-1',
                status: 'order_placed',
                title: 'Order Placed',
                description: 'Order placed on TIBRA NATURALS.',
                timestamp: found.date,
                source: 'system'
              }
            ],
            lastUpdatedPkt: new Date().toLocaleTimeString() + ' PKT'
          };
        }
      }
    } catch {
      // Ignore
    }

    throw new Error('Order not found. Please double-check your Order Number (e.g. TN-2026-8941).');
  }
};
