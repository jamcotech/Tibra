import type { ApiRequest, ApiResponse } from './lib/types';
import { db } from './lib/db';
import { checkRateLimit } from './lib/rateLimit';
import { maskPhoneNumber, maskStreetAddress, formatPKTDateTime } from './lib/security';
import { TRACKING_STAGE_DEFINITIONS, type PublicTrackingResponse } from './lib/types';
import { getCourierAdapter } from './lib/couriers';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. IP Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '127.0.0.1');
  const rateLimit = checkRateLimit(clientIp, 20, 60 * 1000); // 20 requests/min

  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimit.resetInSeconds.toString());

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many tracking requests. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`
    });
  }

  // 2. Extract Query / Body parameters
  let orderNumber: string = '';
  let phone: string = '';
  let token: string = '';

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    orderNumber = (body.orderNumber || body.order || '').toString().trim();
    phone = (body.phone || body.mobile || '').toString().trim();
    token = (body.token || '').toString().trim();
  } else {
    orderNumber = (req.query.orderNumber || req.query.order || '').toString().trim();
    phone = (req.query.phone || req.query.mobile || '').toString().trim();
    token = (req.query.token || '').toString().trim();
  }

  try {
    let order = null;

    if (token) {
      // Token-based secure lookup
      order = await db.getOrderByToken(token);
    } else if (orderNumber && phone) {
      // Order Number + Mobile Number lookup
      order = await db.getOrderByNumberAndPhone(orderNumber, phone);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please provide both Order Number and registered Mobile Number (or a valid tracking token).'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found. Please verify your Order Number (e.g. TN-2026-8941) and the registered phone number entered during checkout.'
      });
    }

    // 3. Fetch shipment details and chronological events
    const shipment = await db.getShipmentByOrderId(order.id);
    let events = await db.getEventsForOrder(order.id);

    // If courier tracking exists, check if live status update is available
    if (shipment && shipment.trackingNumber && shipment.courier) {
      const adapter = getCourierAdapter(shipment.courier);
      // Attempt refresh if not recently synced (e.g. > 15 mins)
      if (adapter.isConfigured()) {
        try {
          const liveStatus = await adapter.getTrackingStatus(shipment.trackingNumber, order.id);
          if (liveStatus.success && liveStatus.events.length > 0) {
            // Merge events deduplicated by title and timestamp
            for (const ev of liveStatus.events) {
              const exists = events.some(e => e.title === ev.title && e.timestamp === ev.timestamp);
              if (!exists) {
                await db.addTrackingEvent(ev);
              }
            }
            events = await db.getEventsForOrder(order.id);
          }
        } catch {
          // Fall back gracefully to existing database events
        }
      }
    }

    const currentStatus = order.status || 'order_placed';
    const statusMeta = TRACKING_STAGE_DEFINITIONS[currentStatus] || TRACKING_STAGE_DEFINITIONS.order_placed;
    const nowPkt = formatPKTDateTime();

    const response: PublicTrackingResponse = {
      success: true,
      orderNumber: order.orderNumber,
      trackingAccessToken: order.trackingAccessToken,
      orderDate: order.date,
      status: currentStatus,
      statusMeta,
      estimatedDeliveryDate: order.estimatedDeliveryDate || (shipment?.destinationCity ? 'Estimated within 2-3 business days' : undefined),
      customerName: order.customerName,
      maskedPhone: maskPhoneNumber(order.customerPhone),
      maskedAddress: maskStreetAddress(order.shippingAddress, order.city),
      city: order.city,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      total: order.total,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      courier: shipment ? {
        name: shipment.courier,
        trackingNumber: shipment.trackingNumber,
        trackingUrl: shipment.trackingUrl || getCourierAdapter(shipment.courier).getTrackingUrl(shipment.trackingNumber),
        lastSyncAt: shipment.lastSyncAt,
        originCity: shipment.originCity || 'Lahore',
        destinationCity: shipment.destinationCity || order.city
      } : undefined,
      events: events.map(e => ({
        id: e.id,
        status: e.status,
        title: e.title,
        description: e.description,
        location: e.location,
        timestamp: e.timestamp,
        source: e.source
      })),
      lastUpdatedPkt: nowPkt
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('[API /api/track] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while looking up your order. Please try again shortly.'
    });
  }
}
