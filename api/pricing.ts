export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DEFAULT_PRICING = {
    singleBottle: {
      id: 'tibra-natural-joint-oil-30ml',
      name: 'TIBRA NATURALS Pain Relief Oil',
      sku: 'TN-PRO-030',
      bottleQuantity: 1,
      unitPrice: 1500,
      packagePrice: 1500,
      originalPrice: 1990,
      deliveryCharges: 200,
      isDeliveryIncluded: false,
      freeDelivery: false,
      deliveryFee: 200,
      enabled: true
    },
    twoBottleCombo: {
      id: 'tibra-natural-joint-oil-bundle-2',
      name: 'TIBRA NATURALS Two-Bottle Combo',
      sku: 'TN-PRO-060-DUO',
      bottleQuantity: 2,
      packagePrice: 2600,
      originalPrice: 3980,
      deliveryCharges: 0,
      isDeliveryIncluded: true,
      freeDelivery: true,
      deliveryFee: 0,
      enabled: true
    },
    threeBottleFamily: {
      id: 'tibra-natural-joint-oil-family-pack',
      name: 'TIBRA NATURALS Complete Family Care (Pack of 3)',
      sku: 'TN-PRO-090-TRI',
      bottleQuantity: 3,
      packagePrice: 3600,
      originalPrice: 5970,
      deliveryCharges: 0,
      isDeliveryIncluded: true,
      freeDelivery: true,
      deliveryFee: 0,
      enabled: true
    },
    standardDeliveryFee: 200,
    freeDeliveryThreshold: 2600,
    updatedAt: new Date().toISOString()
  };

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, pricing: DEFAULT_PRICING });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      return res.status(200).json({ success: true, pricing: { ...DEFAULT_PRICING, ...body } });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
}
