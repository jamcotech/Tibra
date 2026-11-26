import type { ApiRequest, ApiResponse } from './_lib/types';
import { db } from './_lib/db';
import { formatPKTDateTime } from './_lib/security';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const pricing = await db.getPricingConfig();
      return res.status(200).json({ success: true, pricing });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updated = await db.updatePricingConfig(body);

      // Audit log the pricing change
      await db.addAuditLog({
        orderId: 'pricing-config',
        orderNumber: 'SYS-PRICING',
        action: 'PRICING_UPDATED',
        previousStatus: 'active',
        newStatus: 'active',
        reason: 'Centralized product and package pricing configuration updated',
        adminUser: body.adminUser || 'Store Administrator',
        timestamp: formatPKTDateTime()
      });

      return res.status(200).json({ success: true, pricing: updated });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[API/pricing] Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
