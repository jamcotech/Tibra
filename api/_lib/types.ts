export interface ApiRequest {
  query: Record<string, any>;
  body: any;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  socket: { remoteAddress?: string };
  url?: string;
}

export interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  json: (data: any) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  end: () => void;
}

export type StandardTrackingStage =
  | 'order_placed'
  | 'order_confirmed'
  | 'processing'
  | 'packed'
  | 'ready_for_dispatch'
  | 'shipment_booked'
  | 'courier_picked_up'
  | 'in_transit'
  | 'arrived_at_hub'
  | 'out_for_delivery'
  | 'delivered';

export type TrackingExceptionStatus =
  | 'delivery_attempted'
  | 'delayed'
  | 'address_issue'
  | 'customer_unavailable'
  | 'held_at_hub'
  | 'returned_to_sender'
  | 'returned'
  | 'cancelled';

export type TrackingStatus = StandardTrackingStage | TrackingExceptionStatus;

export interface TrackingStageMeta {
  key: TrackingStatus;
  label: string;
  stepIndex: number; // 1 to 11 for standard stages, -1 for exceptions
  isException?: boolean;
  badgeColor: string; // tailwind color classes
  description: string;
}

export const TRACKING_STAGE_DEFINITIONS: Record<TrackingStatus, TrackingStageMeta> = {
  order_placed: {
    key: 'order_placed',
    label: 'Order Placed',
    stepIndex: 1,
    badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    description: 'We have received your order details and payment preference.'
  },
  order_confirmed: {
    key: 'order_confirmed',
    label: 'Order Confirmed',
    stepIndex: 2,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    description: 'Your order has been verified and confirmed by our customer care team.'
  },
  processing: {
    key: 'processing',
    label: 'Processing',
    stepIndex: 3,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
    description: 'Fresh botanical oils are being allocated from temperature-controlled storage.'
  },
  packed: {
    key: 'packed',
    label: 'Packed',
    stepIndex: 4,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    description: 'Carefully sealed in protective outer carton with tamper-evident seal.'
  },
  ready_for_dispatch: {
    key: 'ready_for_dispatch',
    label: 'Ready for Dispatch',
    stepIndex: 5,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
    description: 'Package manifests printed and staged at our Lahore fulfillment hub.'
  },
  shipment_booked: {
    key: 'shipment_booked',
    label: 'Shipment Booked',
    stepIndex: 6,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
    description: 'Consignment number generated and courier electronic booking completed.'
  },
  courier_picked_up: {
    key: 'courier_picked_up',
    label: 'Courier Picked Up',
    stepIndex: 7,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
    description: 'Courier rider scanned and collected parcel from our fulfillment warehouse.'
  },
  in_transit: {
    key: 'in_transit',
    label: 'In Transit',
    stepIndex: 8,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Parcel is travelling via courier regional logistics line-haul network.'
  },
  arrived_at_hub: {
    key: 'arrived_at_hub',
    label: 'Arrived at Destination Hub',
    stepIndex: 9,
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-300',
    description: 'Arrived at the local courier delivery station in your destination city.'
  },
  out_for_delivery: {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    stepIndex: 10,
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
    description: 'Courier delivery rider is out on route with your parcel. Please keep phone reachable.'
  },
  delivered: {
    key: 'delivered',
    label: 'Delivered',
    stepIndex: 11,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    description: 'Successfully delivered and Cash on Delivery collected. Thank you for choosing TIBRA NATURALS.'
  },
  delivery_attempted: {
    key: 'delivery_attempted',
    label: 'Delivery Attempted',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    description: 'Courier attempted delivery but customer was unreachable. Re-delivery scheduled for next business day.'
  },
  delayed: {
    key: 'delayed',
    label: 'Delayed',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-400',
    description: 'Shipment delayed due to transit or weather conditions. In transit to destination.'
  },
  address_issue: {
    key: 'address_issue',
    label: 'Address Issue',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-red-50 text-red-800 border-red-300',
    description: 'Delivery rider requires address landmark or clarification. Our team will contact you.'
  },
  customer_unavailable: {
    key: 'customer_unavailable',
    label: 'Customer Unavailable',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-400',
    description: 'Customer was not available at location. Delivery will be reattempted.'
  },
  held_at_hub: {
    key: 'held_at_hub',
    label: 'Held at Hub',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
    description: 'Parcel safely stored at local courier station awaiting collection or dispatch.'
  },
  returned_to_sender: {
    key: 'returned_to_sender',
    label: 'Returned to Sender',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-400',
    description: 'Parcel is being returned to TIBRA NATURALS warehouse.'
  },
  returned: {
    key: 'returned',
    label: 'Returned (RTO)',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-red-100 text-red-900 border-red-400',
    description: 'Package returned to warehouse.'
  },
  cancelled: {
    key: 'cancelled',
    label: 'Cancelled',
    stepIndex: -1,
    isException: true,
    badgeColor: 'bg-zinc-200 text-zinc-900 border-zinc-400',
    description: 'Order cancelled upon request.'
  }
};

export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface TrackingEventRecord {
  id: string;
  orderId: string;
  status: TrackingStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string; // ISO 8601 string or PKT representation
  source: 'courier_api' | 'webhook' | 'system' | 'admin';
  courierCode?: string;
  rawStatus?: string;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  courier: 'TCS' | 'PostEx' | 'Leopards' | 'Manual';
  courierServiceName?: string; // e.g. "Overnight Express", "Standard COD"
  trackingNumber: string;
  bookingDate: string;
  status: TrackingStatus;
  courierStatusText?: string;
  lastSyncAt: string;
  originCity: string;
  destinationCity: string;
  weightKg: number;
  pieces: number;
  codAmount: number;
  trackingUrl: string;
  events: TrackingEventRecord[];
}

export interface AdminAuditLogRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  action: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  adminUser: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  trackingAccessToken: string;
  date: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  paymentMethod: 'COD' | 'Direct Transfer' | 'Online';
  paymentStatus: 'pending' | 'paid';
  items: OrderItemRecord[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  tax?: number;
  total: number;
  amountPaid?: number;
  outstandingBalance?: number;
  codCollection?: number;
  status: TrackingStatus;
  deliveryCourier?: 'TCS' | 'PostEx' | 'Leopards' | 'Manual' | string;
  trackingNumber?: string;
  notes?: string;
  adminNotes?: string;
  dispatchedAt?: string;
  estimatedDeliveryDate?: string;
  shipmentId?: string;
  statusHistory?: any[];
  pricingSnapshot?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTrackingResponse {
  success: boolean;
  orderNumber: string;
  trackingAccessToken?: string;
  orderDate: string;
  status: TrackingStatus;
  statusMeta: TrackingStageMeta;
  estimatedDeliveryDate?: string;
  customerName: string;
  maskedPhone: string;
  maskedAddress: string;
  city: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  courier?: {
    name: string;
    trackingNumber: string;
    trackingUrl: string;
    lastSyncAt: string;
    originCity: string;
    destinationCity: string;
  };
  events: Array<{
    id: string;
    status: TrackingStatus;
    title: string;
    description: string;
    location?: string;
    timestamp: string;
    source: string;
  }>;
  lastUpdatedPkt: string;
  error?: string;
}
