export interface Product {
  id: string;
  name: string;
  subtitle: string;
  size: string;
  price: number;
  originalPrice: number;
  costPrice?: number;
  sku?: string;
  status?: 'active' | 'draft' | 'archived';
  rating?: number;
  reviewsCount?: number;
  stock: number;
  image: string;
  description: string;
  badge?: string;
  bundleOffer?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedBundle?: string;
}

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'packed'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'confirmed' // legacy alias for approved
  | 'order_placed'
  | 'order_confirmed'
  | 'shipment_booked'
  | 'courier_picked_up'
  | 'in_transit'
  | 'arrived_at_hub'
  | 'out_for_delivery'
  | 'delivery_attempted'
  | 'delayed'
  | 'address_issue'
  | 'customer_unavailable'
  | 'held_at_hub'
  | 'returned_to_sender';

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
  originalUnitPrice?: number;
  subtotal?: number;
  image: string;
}

export interface OrderStatusHistoryEntry {
  id: string;
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
  previousStatus?: OrderStatus;
}

export interface OrderPricingSnapshot {
  packageId?: string;
  packageName?: string;
  bottleQuantity?: number;
  unitPrice: number;
  packagePrice?: number;
  subtotal?: number;
  deliveryCharges: number;
  isDeliveryIncluded: boolean;
  freeDelivery?: boolean;
  deliveryFee?: number;
  discount?: number;
  tax?: number;
  grandTotal?: number;
  amountPaid?: number;
  outstandingBalance?: number;
  codCollection?: number;
  packageType: 'single' | 'combo' | 'family' | 'custom';
  calculatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingAccessToken?: string;
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
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  tax?: number;
  total: number;
  amountPaid?: number;
  outstandingBalance?: number;
  codCollection?: number;
  status: OrderStatus;
  deliveryCourier?: string;
  trackingNumber?: string;
  notes?: string;
  adminNotes?: string;
  dispatchedAt?: string;
  estimatedDeliveryDate?: string;
  shipmentId?: string;
  statusHistory?: OrderStatusHistoryEntry[];
  pricingSnapshot?: OrderPricingSnapshot;
}

export interface PackagePricingItem {
  id: string;
  name: string;
  sku: string;
  bottleQuantity: number;
  unitPrice?: number;
  packagePrice: number;
  originalPrice: number;
  deliveryCharges: number;
  isDeliveryIncluded: boolean;
  freeDelivery: boolean;
  deliveryFee: number;
  enabled: boolean;
}

export interface PricingConfig {
  singleBottle: PackagePricingItem & { unitPrice: number };
  twoBottleCombo: PackagePricingItem;
  threeBottleFamily: PackagePricingItem;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  updatedAt?: string;
}

export interface SenderSettings {
  businessName: string;
  senderAddress: string;
  officialPhone: string;
  whatsappNumber: string;
  website: string;
  facebookUrl: string;
  instagramUrl: string;
  socialHandle: string;
  logoUrl: string;
  taxRatePercent?: number;
}

export interface StoreInventory {
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  threshold: number;
  lastRestocked: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

export interface StoreSettings {
  storeName: string;
  legalBusinessName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  standardShippingFee: number;
  freeDeliveryThreshold: number;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  autoFulfill: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  conversionRate: number;
  pendingCount: number;
  approvedCount?: number;
  processingCount?: number;
  packedCount?: number;
  readyForDispatchCount?: number;
  dispatchedCount: number;
  deliveredCount: number;
  cancelledCount?: number;
  returnedCount?: number;
}
