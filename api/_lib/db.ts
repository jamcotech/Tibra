import fs from 'fs';
import path from 'path';
import type {
  OrderRecord,
  ShipmentRecord,
  TrackingEventRecord,
  AdminAuditLogRecord,
  TrackingStatus
} from './types';
import { TRACKING_STAGE_DEFINITIONS } from './types';
import { generateTrackingToken, phonesMatch, formatPKTDateTime } from './security';
import { getCourierAdapter } from './couriers/index';

interface DatabaseSchema {
  orders: OrderRecord[];
  shipments: ShipmentRecord[];
  trackingEvents: TrackingEventRecord[];
  auditLogs: AdminAuditLogRecord[];
  pricingConfig?: any;
  version: number;
}

export const DEFAULT_SERVER_PRICING = {
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

// Select persistence location based on writable directory
function getStorageFilePath(): string {
  const localDir = path.resolve(process.cwd(), '.data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const testFile = path.join(localDir, '.write-test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return path.join(localDir, 'tibra_store.json');
  } catch {
    // In read-only serverless root, use /tmp
    const tmpDir = '/tmp';
    return path.join(tmpDir, 'tibra_store.json');
  }
}

const STORAGE_PATH = getStorageFilePath();

// In-memory cache for fast read/writes
let memoryDb: DatabaseSchema | null = null;

function generateSeedData(): DatabaseSchema {
  const now = new Date();
  const formatIsoPkt = (d: Date) => formatPKTDateTime(d);

  const t0 = new Date(now.getTime() - 4 * 86400000);
  const t1 = new Date(now.getTime() - 3 * 86400000);
  const t2 = new Date(now.getTime() - 2 * 86400000);
  const t3 = new Date(now.getTime() - 1 * 86400000);
  const tNow = now;

  const orders: OrderRecord[] = [
    {
      id: 'ord-1001',
      orderNumber: 'TN-2026-8941',
      trackingAccessToken: 'tn_trk_8941_a9f1b2c3d4e5f678',
      date: '2026-10-24 18:24',
      customerName: 'Muhammad Tariq',
      customerPhone: '+92 300 8472910',
      customerEmail: 'm.tariq@gmail.com',
      shippingAddress: 'House 42, Block B, DHA Phase 5, Karachi',
      city: 'Karachi',
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      items: [
        {
          productId: 'tibra-natural-joint-oil-bundle-2',
          productName: 'TIBRA NATURALS Joint Oil (Duo Pack of 2)',
          quantity: 1,
          price: 2600,
          image: '/assets/purefix-bottle-box-showcase.webp'
        }
      ],
      subtotal: 2600,
      shippingFee: 0,
      total: 2600,
      status: 'delivered',
      deliveryCourier: 'TCS',
      trackingNumber: 'TCS784910284',
      estimatedDeliveryDate: '2026-10-27',
      shipmentId: 'shp-1001',
      createdAt: t0.toISOString(),
      updatedAt: tNow.toISOString()
    },
    {
      id: 'ord-1002',
      orderNumber: 'TN-2026-8942',
      trackingAccessToken: 'tn_trk_8942_b1c2d3e4f5a6b7c8',
      date: '2026-10-25 11:15',
      customerName: 'Dr. Asim Qureshi',
      customerPhone: '+92 321 4598213',
      customerEmail: 'asim.qureshi@punjab.gov.pk',
      shippingAddress: 'Apartment 402, Askari 11, Bedian Road, Lahore',
      city: 'Lahore',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      items: [
        {
          productId: 'tibra-natural-joint-oil-30ml',
          productName: 'TIBRA NATURALS Pain Relief Joint Oil (30 ML)',
          quantity: 2,
          price: 1300,
          image: '/assets/purefix-bottle-transparent.webp'
        }
      ],
      subtotal: 2600,
      shippingFee: 0,
      total: 2600,
      status: 'out_for_delivery',
      deliveryCourier: 'PostEx',
      trackingNumber: 'PEX982140518',
      estimatedDeliveryDate: formatPKTDateTime(tNow).split(' ')[0],
      shipmentId: 'shp-1002',
      createdAt: t1.toISOString(),
      updatedAt: tNow.toISOString()
    },
    {
      id: 'ord-1003',
      orderNumber: 'TN-2026-8943',
      trackingAccessToken: 'tn_trk_8943_c3d4e5f6a1b2c3d4',
      date: '2026-10-25 15:40',
      customerName: 'Fatima Zahra',
      customerPhone: '+92 333 5192847',
      customerEmail: 'fatima.zahra@hotmail.com',
      shippingAddress: 'House 18-A, Street 44, F-8/1, Islamabad',
      city: 'Islamabad',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      items: [
        {
          productId: 'tibra-natural-joint-oil-family-pack',
          productName: 'TIBRA NATURALS Complete Family Care (Pack of 3)',
          quantity: 1,
          price: 3900,
          image: '/assets/purefix-bottle-box-showcase.webp'
        }
      ],
      subtotal: 3900,
      shippingFee: 0,
      total: 3900,
      status: 'in_transit',
      deliveryCourier: 'Leopards',
      trackingNumber: 'LCS671940129',
      estimatedDeliveryDate: formatPKTDateTime(new Date(now.getTime() + 86400000)).split(' ')[0],
      shipmentId: 'shp-1003',
      createdAt: t2.toISOString(),
      updatedAt: tNow.toISOString()
    },
    {
      id: 'ord-1004',
      orderNumber: 'TN-2026-8944',
      trackingAccessToken: 'tn_trk_8944_d4e5f6a1b2c3d4e5',
      date: '2026-10-26 09:30',
      customerName: 'Bilal Ahmed',
      customerPhone: '+92 345 6789012',
      shippingAddress: 'Office 7, 2nd Floor, ChenOne Tower, Faisalabad',
      city: 'Faisalabad',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      items: [
        {
          productId: 'tibra-natural-joint-oil-30ml',
          productName: 'TIBRA NATURALS Pain Relief Joint Oil (30 ML)',
          quantity: 1,
          price: 1500,
          image: '/assets/purefix-bottle-transparent.webp'
        }
      ],
      subtotal: 1500,
      shippingFee: 200,
      total: 1700,
      status: 'ready_for_dispatch',
      deliveryCourier: 'TCS',
      trackingNumber: 'TCS784910300',
      shipmentId: 'shp-1004',
      createdAt: t3.toISOString(),
      updatedAt: tNow.toISOString()
    },
    {
      id: 'ord-1005',
      orderNumber: 'TN-2026-8945',
      trackingAccessToken: 'tn_trk_8945_e5f6a1b2c3d4e5f6',
      date: '2026-10-26 10:45',
      customerName: 'Zainab Bibi',
      customerPhone: '+92 312 9876543',
      shippingAddress: 'House 88, Satellite Town, Rawalpindi',
      city: 'Rawalpindi',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      items: [
        {
          productId: 'tibra-natural-joint-oil-bundle-2',
          productName: 'TIBRA NATURALS Joint Oil (Duo Pack of 2)',
          quantity: 1,
          price: 2600,
          image: '/assets/purefix-bottle-box-showcase.webp'
        }
      ],
      subtotal: 2600,
      shippingFee: 0,
      total: 2600,
      status: 'order_confirmed',
      createdAt: tNow.toISOString(),
      updatedAt: tNow.toISOString()
    }
  ];

  const trackingEvents: TrackingEventRecord[] = [
    // Events for ord-1001 (Delivered)
    {
      id: 'evt-1001-1',
      orderId: 'ord-1001',
      status: 'order_placed',
      title: 'Order Placed',
      description: 'Customer placed order with Cash on Delivery (COD).',
      location: 'Online Checkout',
      timestamp: formatIsoPkt(t0),
      source: 'system'
    },
    {
      id: 'evt-1001-2',
      orderId: 'ord-1001',
      status: 'order_confirmed',
      title: 'Order Verified & Confirmed',
      description: 'Customer contact verified by TIBRA NATURALS support.',
      location: 'Lahore Headquarters',
      timestamp: formatIsoPkt(new Date(t0.getTime() + 1800000)),
      source: 'admin'
    },
    {
      id: 'evt-1001-3',
      orderId: 'ord-1001',
      status: 'packed',
      title: 'Botanicals Sealed & Packed',
      description: 'Amber glass bottles secured in eco-friendly protective carton.',
      location: 'Lahore Fulfillment Hub',
      timestamp: formatIsoPkt(t1),
      source: 'system'
    },
    {
      id: 'evt-1001-4',
      orderId: 'ord-1001',
      status: 'shipment_booked',
      title: 'Consignment Generated with TCS',
      description: 'Booking registered with TCS Express under Consignment #TCS784910284.',
      location: 'Lahore Express Center',
      timestamp: formatIsoPkt(new Date(t1.getTime() + 3600000)),
      source: 'courier_api',
      courierCode: 'TCS'
    },
    {
      id: 'evt-1001-5',
      orderId: 'ord-1001',
      status: 'courier_picked_up',
      title: 'Courier Picked Up',
      description: 'TCS courier van collected package from warehouse.',
      location: 'Lahore Logistics Depot',
      timestamp: formatIsoPkt(new Date(t1.getTime() + 7200000)),
      source: 'courier_api',
      courierCode: 'TCS'
    },
    {
      id: 'evt-1001-6',
      orderId: 'ord-1001',
      status: 'in_transit',
      title: 'Departed via Regional Linehaul',
      description: 'Departed Lahore Transit Hub en route to Karachi Regional Gateway.',
      location: 'Linehaul Transit Network',
      timestamp: formatIsoPkt(t2),
      source: 'courier_api',
      courierCode: 'TCS'
    },
    {
      id: 'evt-1001-7',
      orderId: 'ord-1001',
      status: 'arrived_at_hub',
      title: 'Arrived at Destination Hub',
      description: 'Consignment arrived at TCS Korangi Delivery Station, Karachi.',
      location: 'Karachi Korangi Hub',
      timestamp: formatIsoPkt(t3),
      source: 'courier_api',
      courierCode: 'TCS'
    },
    {
      id: 'evt-1001-8',
      orderId: 'ord-1001',
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Rider assigned. Out on delivery route to DHA Phase 5.',
      location: 'Karachi South Zone',
      timestamp: formatIsoPkt(new Date(t3.getTime() + 7200000)),
      source: 'courier_api',
      courierCode: 'TCS'
    },
    {
      id: 'evt-1001-9',
      orderId: 'ord-1001',
      status: 'delivered',
      title: 'Delivered Successfully',
      description: 'Parcel delivered to Muhammad Tariq. COD amount Rs. 2,600 collected.',
      location: 'Karachi DHA Phase 5',
      timestamp: formatIsoPkt(new Date(t3.getTime() + 14400000)),
      source: 'courier_api',
      courierCode: 'TCS'
    },

    // Events for ord-1002 (Out for Delivery - PostEx)
    {
      id: 'evt-1002-1',
      orderId: 'ord-1002',
      status: 'order_placed',
      title: 'Order Placed',
      description: 'Order placed online.',
      location: 'Online Checkout',
      timestamp: formatIsoPkt(t1),
      source: 'system'
    },
    {
      id: 'evt-1002-2',
      orderId: 'ord-1002',
      status: 'shipment_booked',
      title: 'Booked with PostEx',
      description: 'Tracking #PEX982140518 assigned via PostEx Merchant API.',
      location: 'Lahore Logistics Hub',
      timestamp: formatIsoPkt(t2),
      source: 'courier_api',
      courierCode: 'PostEx'
    },
    {
      id: 'evt-1002-3',
      orderId: 'ord-1002',
      status: 'arrived_at_hub',
      title: 'Arrived at Local Station',
      description: 'Sorted at PostEx Cantt Delivery Station.',
      location: 'Lahore Cantt Hub',
      timestamp: formatIsoPkt(t3),
      source: 'courier_api',
      courierCode: 'PostEx'
    },
    {
      id: 'evt-1002-4',
      orderId: 'ord-1002',
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Rider is on the way to Askari 11, Bedian Road.',
      location: 'Lahore Cantt',
      timestamp: formatIsoPkt(tNow),
      source: 'courier_api',
      courierCode: 'PostEx'
    },

    // Events for ord-1003 (In Transit - Leopards)
    {
      id: 'evt-1003-1',
      orderId: 'ord-1003',
      status: 'order_placed',
      title: 'Order Placed',
      description: 'Order placed online.',
      location: 'Online Checkout',
      timestamp: formatIsoPkt(t2),
      source: 'system'
    },
    {
      id: 'evt-1003-2',
      orderId: 'ord-1003',
      status: 'shipment_booked',
      title: 'Booked with Leopards Courier',
      description: 'Consignment #LCS671940129 booked.',
      location: 'Lahore Station',
      timestamp: formatIsoPkt(t3),
      source: 'courier_api',
      courierCode: 'Leopards'
    },
    {
      id: 'evt-1003-3',
      orderId: 'ord-1003',
      status: 'in_transit',
      title: 'In Transit to Islamabad',
      description: 'Linehaul vehicle dispatched towards Islamabad Sort Facility.',
      location: 'M-2 Motorway Transit',
      timestamp: formatIsoPkt(tNow),
      source: 'courier_api',
      courierCode: 'Leopards'
    }
  ];

  const shipments: ShipmentRecord[] = [
    {
      id: 'shp-1001',
      orderId: 'ord-1001',
      orderNumber: 'TN-2026-8941',
      courier: 'TCS',
      courierServiceName: 'TCS Express COD',
      trackingNumber: 'TCS784910284',
      bookingDate: formatIsoPkt(t1),
      status: 'delivered',
      courierStatusText: 'Delivered - Cash Collected',
      lastSyncAt: formatIsoPkt(tNow),
      originCity: 'Lahore',
      destinationCity: 'Karachi',
      weightKg: 0.5,
      pieces: 1,
      codAmount: 2600,
      trackingUrl: 'https://www.tcsexpress.com/tracking?consignmentNo=TCS784910284',
      events: trackingEvents.filter(e => e.orderId === 'ord-1001')
    },
    {
      id: 'shp-1002',
      orderId: 'ord-1002',
      orderNumber: 'TN-2026-8942',
      courier: 'PostEx',
      courierServiceName: 'PostEx Same City Delivery',
      trackingNumber: 'PEX982140518',
      bookingDate: formatIsoPkt(t2),
      status: 'out_for_delivery',
      courierStatusText: 'Out for Delivery with Rider',
      lastSyncAt: formatIsoPkt(tNow),
      originCity: 'Lahore',
      destinationCity: 'Lahore',
      weightKg: 0.5,
      pieces: 2,
      codAmount: 2600,
      trackingUrl: 'https://postex.pk/tracking?trackingNumber=PEX982140518',
      events: trackingEvents.filter(e => e.orderId === 'ord-1002')
    },
    {
      id: 'shp-1003',
      orderId: 'ord-1003',
      orderNumber: 'TN-2026-8943',
      courier: 'Leopards',
      courierServiceName: 'Leopards Overland Express',
      trackingNumber: 'LCS671940129',
      bookingDate: formatIsoPkt(t3),
      status: 'in_transit',
      courierStatusText: 'In Transit to Islamabad',
      lastSyncAt: formatIsoPkt(tNow),
      originCity: 'Lahore',
      destinationCity: 'Islamabad',
      weightKg: 0.7,
      pieces: 1,
      codAmount: 3900,
      trackingUrl: 'https://www.leopardscourier.com/leopards-tracking?track_numbers=LCS671940129',
      events: trackingEvents.filter(e => e.orderId === 'ord-1003')
    }
  ];

  const auditLogs: AdminAuditLogRecord[] = [
    {
      id: 'aud-1',
      orderId: 'ord-1001',
      orderNumber: 'TN-2026-8941',
      action: 'ORDER_CONFIRMED',
      previousStatus: 'order_placed',
      newStatus: 'order_confirmed',
      reason: 'Confirmed via WhatsApp phone verification',
      adminUser: 'Store Administrator',
      timestamp: formatIsoPkt(t0)
    },
    {
      id: 'aud-2',
      orderId: 'ord-1001',
      orderNumber: 'TN-2026-8941',
      action: 'COURIER_ASSIGNED',
      previousStatus: 'packed',
      newStatus: 'shipment_booked',
      reason: 'Assigned TCS Express Consignment TCS784910284',
      adminUser: 'Store Administrator',
      timestamp: formatIsoPkt(t1)
    }
  ];

  return {
    orders,
    shipments,
    trackingEvents,
    auditLogs,
    pricingConfig: { ...DEFAULT_SERVER_PRICING },
    version: 1
  };
}

function loadDatabase(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf-8');
      memoryDb = JSON.parse(data);
      if (memoryDb && Array.isArray(memoryDb.orders)) {
        if (!memoryDb.pricingConfig) {
          memoryDb.pricingConfig = { ...DEFAULT_SERVER_PRICING };
        }
        return memoryDb;
      }
    }
  } catch (err) {
    console.warn('[DB] Failed reading disk store, initializing seed:', err);
  }

  memoryDb = generateSeedData();
  saveDatabase(memoryDb);
  return memoryDb;
}

function saveDatabase(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    const serialized = JSON.stringify(data, null, 2);
    // Write atomically
    const tempPath = `${STORAGE_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, serialized, 'utf-8');
    fs.renameSync(tempPath, STORAGE_PATH);
  } catch (err) {
    // In serverless without write access, memoryDb stays active in memory for container lifetime
    console.warn('[DB] Could not persist to disk, keeping in memory:', err);
  }
}

export const db = {
  async getOrders(): Promise<OrderRecord[]> {
    const d = loadDatabase();
    return [...d.orders].sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const d = loadDatabase();
    return d.orders.find(o => o.id === id) || null;
  },

  async getOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
    const d = loadDatabase();
    const clean = orderNumber.trim().toUpperCase();
    return d.orders.find(o => o.orderNumber.trim().toUpperCase() === clean) || null;
  },

  async getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<OrderRecord | null> {
    const order = await this.getOrderByNumber(orderNumber);
    if (!order) return null;
    if (phonesMatch(order.customerPhone, phone)) {
      return order;
    }
    return null;
  },

  async getOrderByToken(token: string): Promise<OrderRecord | null> {
    const d = loadDatabase();
    const cleanToken = token.trim();
    if (!cleanToken) return null;
    return d.orders.find(o => o.trackingAccessToken === cleanToken) || null;
  },

  async createOrder(data: Partial<OrderRecord>): Promise<OrderRecord> {
    const d = loadDatabase();
    const now = new Date();
    const nowPkt = formatPKTDateTime(now);
    const orderYear = now.getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = data.orderNumber || `TN-${orderYear}-${randomSuffix}`;
    const id = data.id || `ord-${Date.now()}`;
    const trackingAccessToken = data.trackingAccessToken || generateTrackingToken();

    // Exact financial calculations according to requirements
    const subtotal = data.subtotal ?? (data.items || []).reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const shippingFee = data.shippingFee ?? 0;
    const discount = data.discount ?? 0;
    const tax = data.tax ?? 0;
    // Formula: Grand Total = Package Price - Discount + Applicable Delivery Charges + Applicable Taxes
    const total = data.total ?? Math.max(0, subtotal - discount + shippingFee + tax);
    const paymentStatus = data.paymentStatus || 'pending';
    const amountPaid = paymentStatus === 'paid' ? total : (data.amountPaid ?? 0);
    const outstandingBalance = Math.max(0, total - amountPaid);
    // For unpaid COD order: COD Collection = Grand Total - Amount Already Paid. For fully prepaid order: COD Collection = Rs. 0
    const codCollection = (data.paymentMethod === 'COD' || !data.paymentMethod)
      ? (paymentStatus === 'paid' ? 0 : outstandingBalance)
      : 0;

    const newOrder: OrderRecord = {
      id,
      orderNumber,
      trackingAccessToken,
      date: data.date || nowPkt,
      customerName: data.customerName || 'Valued Customer',
      customerPhone: data.customerPhone || '',
      customerEmail: data.customerEmail || '',
      shippingAddress: data.shippingAddress || '',
      city: data.city || 'Lahore',
      paymentMethod: data.paymentMethod || 'COD',
      paymentStatus,
      items: data.items || [],
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      amountPaid,
      outstandingBalance,
      codCollection,
      status: data.status || 'order_placed',
      deliveryCourier: data.deliveryCourier,
      trackingNumber: data.trackingNumber,
      notes: data.notes || '',
      estimatedDeliveryDate: data.estimatedDeliveryDate,
      shipmentId: data.shipmentId,
      pricingSnapshot: data.pricingSnapshot || {
        subtotal,
        shippingFee,
        freeDelivery: shippingFee === 0,
        discount,
        tax,
        grandTotal: total,
        amountPaid,
        outstandingBalance,
        codCollection,
        calculatedAt: nowPkt
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    d.orders.unshift(newOrder);

    // Automatically create initial tracking event
    const initialEvent: TrackingEventRecord = {
      id: `evt-${Date.now()}-init`,
      orderId: newOrder.id,
      status: 'order_placed',
      title: 'Order Placed Successfully',
      description: `Order registered for ${newOrder.customerName}. Payment method: ${newOrder.paymentMethod}.`,
      location: 'TIBRA NATURALS Online Store',
      timestamp: nowPkt,
      source: 'system'
    };
    d.trackingEvents.push(initialEvent);

    saveDatabase(d);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const d = loadDatabase();
    const idx = d.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;

    const current = d.orders[idx];
    const updated: OrderRecord = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    d.orders[idx] = updated;
    saveDatabase(d);
    return updated;
  },

  async deleteOrder(id: string): Promise<boolean> {
    const d = loadDatabase();
    const initialLen = d.orders.length;
    d.orders = d.orders.filter(o => o.id !== id);
    d.shipments = d.shipments.filter(s => s.orderId !== id);
    d.trackingEvents = d.trackingEvents.filter(e => e.orderId !== id);
    saveDatabase(d);
    return d.orders.length < initialLen;
  },

  async getShipments(): Promise<ShipmentRecord[]> {
    const d = loadDatabase();
    return d.shipments;
  },

  async getShipmentByOrderId(orderId: string): Promise<ShipmentRecord | null> {
    const d = loadDatabase();
    return d.shipments.find(s => s.orderId === orderId) || null;
  },

  async getShipmentByTracking(trackingNumber: string): Promise<ShipmentRecord | null> {
    const d = loadDatabase();
    const clean = trackingNumber.trim().toUpperCase();
    return d.shipments.find(s => s.trackingNumber.trim().toUpperCase() === clean) || null;
  },

  async createShipment(shipment: ShipmentRecord): Promise<ShipmentRecord> {
    const d = loadDatabase();
    d.shipments.push(shipment);
    saveDatabase(d);
    return shipment;
  },

  async updateShipment(id: string, updates: Partial<ShipmentRecord>): Promise<ShipmentRecord | null> {
    const d = loadDatabase();
    const idx = d.shipments.findIndex(s => s.id === id);
    if (idx === -1) return null;
    d.shipments[idx] = { ...d.shipments[idx], ...updates };
    saveDatabase(d);
    return d.shipments[idx];
  },

  async addTrackingEvent(eventData: Omit<TrackingEventRecord, 'id'>): Promise<TrackingEventRecord> {
    const d = loadDatabase();
    const event: TrackingEventRecord = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    d.trackingEvents.push(event);

    // Also update order status if latest
    const orderIdx = d.orders.findIndex(o => o.id === event.orderId);
    if (orderIdx > -1) {
      d.orders[orderIdx].status = event.status;
      d.orders[orderIdx].updatedAt = new Date().toISOString();
      if (event.status === 'delivered') {
        d.orders[orderIdx].paymentStatus = 'paid';
      }
    }

    saveDatabase(d);
    return event;
  },

  async getEventsForOrder(orderId: string): Promise<TrackingEventRecord[]> {
    const d = loadDatabase();
    return d.trackingEvents
      .filter(e => e.orderId === orderId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async addAuditLog(logData: Omit<AdminAuditLogRecord, 'id'>): Promise<AdminAuditLogRecord> {
    const d = loadDatabase();
    const log: AdminAuditLogRecord = {
      ...logData,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    d.auditLogs.unshift(log);
    saveDatabase(d);
    return log;
  },

  async getAuditLogs(orderId?: string): Promise<AdminAuditLogRecord[]> {
    const d = loadDatabase();
    if (!orderId) return d.auditLogs;
    return d.auditLogs.filter(a => a.orderId === orderId);
  },

  async getPricingConfig(): Promise<any> {
    const d = loadDatabase();
    if (!d.pricingConfig) {
      d.pricingConfig = { ...DEFAULT_SERVER_PRICING };
      saveDatabase(d);
    }
    return d.pricingConfig;
  },

  async updatePricingConfig(updates: any): Promise<any> {
    const d = loadDatabase();
    const current = d.pricingConfig || { ...DEFAULT_SERVER_PRICING };
    const updated = {
      ...current,
      ...updates,
      singleBottle: updates.singleBottle ? { ...current.singleBottle, ...updates.singleBottle } : current.singleBottle,
      twoBottleCombo: updates.twoBottleCombo ? { ...current.twoBottleCombo, ...updates.twoBottleCombo } : current.twoBottleCombo,
      threeBottleFamily: updates.threeBottleFamily ? { ...current.threeBottleFamily, ...updates.threeBottleFamily } : current.threeBottleFamily,
      updatedAt: new Date().toISOString()
    };
    d.pricingConfig = updated;
    saveDatabase(d);
    return updated;
  }
};
