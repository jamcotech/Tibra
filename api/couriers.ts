import type { ApiRequest, ApiResponse } from './_lib/types';
import { listCourierAdapters } from './_lib/couriers';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const list = listCourierAdapters().map(c => {
      let webhookUrl = `https://www.tibranaturals.com/api/webhooks/courier?provider=${c.providerId}`;
      let requiredEnv = '';
      if (c.providerId === 'tcs') requiredEnv = 'TCS_API_KEY, TCS_CLIENT_ID, TCS_COST_CENTER';
      if (c.providerId === 'postex') requiredEnv = 'POSTEX_API_TOKEN, POSTEX_PICKUP_CODE';
      if (c.providerId === 'leopards') requiredEnv = 'LEOPARDS_API_KEY, LEOPARDS_PASSWORD';
      if (c.providerId === 'manual') requiredEnv = 'None (Standard direct entry mode)';

      return {
        ...c,
        webhookUrl,
        requiredEnv,
        mode: c.isConfigured ? 'Live API Connected' : 'Manual / Fallback Dispatch Mode'
      };
    });

    return res.status(200).json({
      success: true,
      couriers: list
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
