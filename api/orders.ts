import type { ApiRequest, ApiResponse } from './_lib/types';
import { db } from './_lib/db';
import { formatPKTDateTime } from './_lib/security';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { id, orderNumber } = req.query;
      if (id && typeof id === 'string') {
        const order = await db.getOrderById(id);
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        return res.status(200).json({ success: true, order });
      }
      if (orderNumber && typeof orderNumber === 'string') {
        const order = await db.getOrderByNumber(orderNumber);
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        return res.status(200).json({ success: true, order });
      }

      // Return list of all orders
      const orders = await db.getOrders();
      return res.status(200).json({ success: true, count: orders.length, orders });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body.customerName || !body.customerPhone || !body.items || !body.items.length) {
        return res.status(400).json({
          success: false,
          error: 'Missing required order fields (customerName, customerPhone, items)'
        });
      }

      const order = await db.createOrder(body);

      // Audit log
      await db.addAuditLog({
        orderId: order.id,
        orderNumber: order.orderNumber,
        action: 'ORDER_CREATED',
        previousStatus: 'none',
        newStatus: order.status,
        reason: 'Customer placed order via website checkout',
        adminUser: 'Store System',
        timestamp: formatPKTDateTime()
      });

      return res.status(201).json({ success: true, order });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = body.id || req.query.id;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Order ID is required' });
      }

      const existing = await db.getOrderById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const updated = await db.updateOrder(id, body);

      // If status changed, record tracking event and audit log
      if (body.status && body.status !== existing.status) {
        await db.addTrackingEvent({
          orderId: id,
          status: body.status,
          title: body.statusTitle || `Status updated to ${body.status}`,
          description: body.statusDescription || `Order status updated to ${body.status}`,
          location: body.location || 'Fulfillment Center, Lahore',
          timestamp: formatPKTDateTime(),
          source: body.source || 'admin'
        });

        await db.addAuditLog({
          orderId: id,
          orderNumber: existing.orderNumber,
          action: 'STATUS_UPDATE',
          previousStatus: existing.status,
          newStatus: body.status,
          reason: body.reason || 'Manual status update by Admin',
          adminUser: body.adminUser || 'Store Administrator',
          timestamp: formatPKTDateTime()
        });
      }

      return res.status(200).json({ success: true, order: updated });
    }

    if (req.method === 'DELETE') {
      const id = (req.query.id || req.body?.id) as string;
      if (!id) return res.status(400).json({ success: false, error: 'Order ID required' });
      const ok = await db.deleteOrder(id);
      return res.status(200).json({ success: ok });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[API /api/orders] Error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
