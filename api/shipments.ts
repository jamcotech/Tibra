import type { ApiRequest, ApiResponse } from './lib/types';
import { db } from './lib/db';
import { getCourierAdapter } from './lib/couriers';
import { formatPKTDateTime } from './lib/security';
import type { ShipmentRecord, TrackingStatus } from './lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { orderId, trackingNumber, sync } = req.query;

      if (orderId && typeof orderId === 'string') {
        const shipment = await db.getShipmentByOrderId(orderId);
        if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });

        if (sync === 'true' && shipment.courier && shipment.trackingNumber) {
          const adapter = getCourierAdapter(shipment.courier);
          const live = await adapter.getTrackingStatus(shipment.trackingNumber, orderId);
          if (live.success) {
            await db.updateShipment(shipment.id, {
              status: live.status,
              courierStatusText: live.courierStatusText,
              lastSyncAt: live.lastSyncAt
            });
            await db.updateOrder(orderId, { status: live.status });
          }
        }

        const events = await db.getEventsForOrder(orderId);
        return res.status(200).json({ success: true, shipment, events });
      }

      const shipments = await db.getShipments();
      return res.status(200).json({ success: true, count: shipments.length, shipments });
    }

    if (req.method === 'POST') {
      // Create or book shipment
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { orderId, courier, trackingNumber: manualTracking, notes, adminUser } = body;

      if (!orderId || !courier) {
        return res.status(400).json({ success: false, error: 'orderId and courier are required' });
      }

      const order = await db.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const adapter = getCourierAdapter(courier);
      let trackingNumber = manualTracking;
      let trackingUrl = '';

      if (!trackingNumber) {
        // Book with courier adapter
        const booking = await adapter.createShipment(order, { notes });
        if (!booking.success) {
          return res.status(502).json({ success: false, error: booking.error || 'Failed to book with courier' });
        }
        trackingNumber = booking.trackingNumber;
        trackingUrl = booking.trackingUrl;
      } else {
        trackingUrl = adapter.getTrackingUrl(trackingNumber);
      }

      const nowPkt = formatPKTDateTime();
      const shipmentId = `shp-${Date.now()}`;

      const shipment: ShipmentRecord = {
        id: shipmentId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        courier: courier as any,
        courierServiceName: `${courier} Express Delivery`,
        trackingNumber,
        bookingDate: nowPkt,
        status: 'shipment_booked',
        courierStatusText: 'Shipment Booked',
        lastSyncAt: nowPkt,
        originCity: 'Lahore',
        destinationCity: order.city,
        weightKg: 0.3 * order.items.reduce((s, i) => s + i.quantity, 0),
        pieces: order.items.reduce((s, i) => s + i.quantity, 0),
        codAmount: order.paymentMethod === 'COD' ? order.total : 0,
        trackingUrl,
        events: []
      };

      await db.createShipment(shipment);

      // Update order status
      await db.updateOrder(order.id, {
        status: 'shipment_booked',
        deliveryCourier: courier,
        trackingNumber,
        shipmentId
      });

      // Add tracking event
      await db.addTrackingEvent({
        orderId: order.id,
        status: 'shipment_booked',
        title: `Shipment Booked with ${courier}`,
        description: `Consignment #${trackingNumber} generated and assigned to courier.`,
        location: 'Lahore Fulfillment Station',
        timestamp: nowPkt,
        source: 'courier_api',
        courierCode: courier
      });

      // Audit log
      await db.addAuditLog({
        orderId: order.id,
        orderNumber: order.orderNumber,
        action: 'SHIPMENT_BOOKED',
        previousStatus: order.status,
        newStatus: 'shipment_booked',
        reason: `Assigned courier ${courier} with tracking #${trackingNumber}`,
        adminUser: adminUser || 'Store Administrator',
        timestamp: nowPkt
      });

      return res.status(201).json({ success: true, shipment });
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { shipmentId, status, location, notes, adminUser, reason } = body;

      if (!shipmentId || !status) {
        return res.status(400).json({ success: false, error: 'shipmentId and status required' });
      }

      const shipments = await db.getShipments();
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }

      const prevStatus = shipment.status;
      const nowPkt = formatPKTDateTime();

      await db.updateShipment(shipmentId, {
        status: status as TrackingStatus,
        lastSyncAt: nowPkt,
        courierStatusText: notes || `Status updated to ${status}`
      });

      await db.updateOrder(shipment.orderId, {
        status: status as TrackingStatus
      });

      await db.addTrackingEvent({
        orderId: shipment.orderId,
        status: status as TrackingStatus,
        title: `Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        description: notes || `Shipment status updated to ${status}.`,
        location: location || `${shipment.destinationCity} Delivery Hub`,
        timestamp: nowPkt,
        source: 'admin'
      });

      await db.addAuditLog({
        orderId: shipment.orderId,
        orderNumber: shipment.orderNumber,
        action: 'SHIPMENT_STATUS_UPDATE',
        previousStatus: prevStatus,
        newStatus: status,
        reason: reason || notes || 'Manual status update',
        adminUser: adminUser || 'Store Administrator',
        timestamp: nowPkt
      });

      return res.status(200).json({ success: true, status });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[API /api/shipments] Error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
