import type { ApiRequest, ApiResponse } from '../_lib/types';
import { db } from '../_lib/db';
import { getCourierAdapter } from '../_lib/couriers';
import { formatPKTDateTime } from '../_lib/security';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const provider = (req.query.provider as string) || 'manual';
    const adapter = getCourierAdapter(provider);

    // Verify webhook signature if adapter supports it
    if (adapter.verifyWebhook) {
      const isValid = adapter.verifyWebhook(req.headers as any, req.body);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const trackingNumber = body.trackingNumber || body.consignmentNo || body.distrCode || body.track_number;

    if (!trackingNumber) {
      return res.status(400).json({ error: 'Missing tracking number' });
    }

    const shipment = await db.getShipmentByTracking(trackingNumber);
    if (!shipment) {
      // Return 200 to acknowledge webhook even if shipment not found to prevent retries
      return res.status(200).json({ received: true, note: 'Shipment not found in local store' });
    }

    const rawStatus = body.status || body.activity || body.transactionStatus || 'IN TRANSIT';
    const normalized = adapter.normalizeStatus(rawStatus);
    const location = body.location || body.station || body.cityName || 'In Transit';
    const nowPkt = formatPKTDateTime();

    await db.updateShipment(shipment.id, {
      status: normalized,
      courierStatusText: rawStatus,
      lastSyncAt: nowPkt
    });

    await db.updateOrder(shipment.orderId, {
      status: normalized
    });

    await db.addTrackingEvent({
      orderId: shipment.orderId,
      status: normalized,
      title: `Courier Update: ${rawStatus}`,
      description: body.message || body.remarks || `Status updated via ${adapter.displayName} webhook.`,
      location,
      timestamp: nowPkt,
      source: 'webhook',
      courierCode: adapter.displayName,
      rawStatus
    });

    return res.status(200).json({ received: true, status: normalized });
  } catch (err: any) {
    console.error('[API /api/webhooks/courier] Error:', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
