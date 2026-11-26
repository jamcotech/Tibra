import type { CourierAdapter, CourierBookingResult, CourierTrackingResult } from './types';
import type { OrderRecord, TrackingStatus } from '../types';
import { formatPKTDateTime } from '../security';

export class ManualAdapter implements CourierAdapter {
  providerId = 'manual' as const;
  displayName = 'Direct / Custom Courier (Manual Dispatch)';

  isConfigured(): boolean {
    return true; // Always available
  }

  getTrackingUrl(trackingNumber: string): string {
    if (trackingNumber.startsWith('http://') || trackingNumber.startsWith('https://')) {
      return trackingNumber;
    }
    return '';
  }

  normalizeStatus(rawStatus: string): TrackingStatus {
    const s = (rawStatus || '').toLowerCase().trim();
    if (s.includes('deliver')) return 'delivered';
    if (s.includes('out') || s.includes('rider')) return 'out_for_delivery';
    if (s.includes('hub')) return 'arrived_at_hub';
    if (s.includes('transit') || s.includes('dispatched')) return 'in_transit';
    if (s.includes('picked')) return 'courier_picked_up';
    if (s.includes('booked')) return 'shipment_booked';
    if (s.includes('ready')) return 'ready_for_dispatch';
    if (s.includes('packed')) return 'packed';
    if (s.includes('process')) return 'processing';
    if (s.includes('confirm')) return 'order_confirmed';
    if (s.includes('attempt')) return 'delivery_attempted';
    if (s.includes('delay')) return 'delayed';
    if (s.includes('address')) return 'address_issue';
    if (s.includes('return') || s.includes('rto')) return 'returned';
    if (s.includes('cancel')) return 'cancelled';
    return 'in_transit';
  }

  async createShipment(order: OrderRecord, options?: Record<string, any>): Promise<CourierBookingResult> {
    const trackingNumber = options?.trackingNumber || `TN-MAN-${Date.now().toString().slice(-6)}`;
    const trackingUrl = options?.trackingUrl || '';
    return {
      success: true,
      trackingNumber,
      trackingUrl,
      rawResponse: { mode: 'manual_admin_entry', notes: options?.notes || '' }
    };
  }

  async getTrackingStatus(trackingNumber: string, _orderId?: string): Promise<CourierTrackingResult> {
    const nowPkt = formatPKTDateTime();
    return {
      success: true,
      status: 'in_transit',
      rawStatus: 'Manual Courier Status',
      courierStatusText: 'Status updated by fulfillment team',
      events: [],
      lastSyncAt: nowPkt
    };
  }
}
