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
  | 'confirmed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
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
  | 'delivery_attempted'
  | 'delayed'
  | 'address_issue'
  | 'customer_unavailable'
  | 'held_at_hub'
  | 'returned_to_sender'
  | 'returned';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingAccessToken?: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  paymentMethod: 'COD' | 'Direct Transfer' | 'Online';
  paymentStatus: 'pending' | 'paid';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  deliveryCourier?: string;
  trackingNumber?: string;
  notes?: string;
  estimatedDeliveryDate?: string;
  shipmentId?: string;
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
  dispatchedCount: number;
  deliveredCount: number;
}
