import type { OrderRecord, TrackingStatus, TrackingEventRecord } from '../types';

export interface CourierTrackingResult {
  success: boolean;
  status: TrackingStatus;
  rawStatus: string;
  location?: string;
  courierStatusText?: string;
  events: TrackingEventRecord[];
  lastSyncAt: string;
  error?: string;
}

export interface CourierBookingResult {
  success: boolean;
  trackingNumber: string;
  trackingUrl: string;
  labelUrl?: string;
  rawResponse?: any;
  error?: string;
}

export interface CourierAdapter {
  providerId: 'tcs' | 'postex' | 'leopards' | 'manual';
  displayName: string;
  isConfigured(): boolean;
  getTrackingUrl(trackingNumber: string): string;
  normalizeStatus(rawStatus: string): TrackingStatus;
  createShipment(order: OrderRecord, options?: Record<string, any>): Promise<CourierBookingResult>;
  getTrackingStatus(trackingNumber: string, orderId?: string): Promise<CourierTrackingResult>;
  verifyWebhook?(headers: Record<string, string | undefined>, body: any): boolean;
}
