import React, { useState } from 'react';
import {
  Search,
  Download,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Printer
} from 'lucide-react';
import type { Order, OrderStatus } from '../../types/ecommerce';
import { storeService } from '../../services/storeService';

interface OrdersPageProps {
  orders: Order[];
  onRefresh: () => void;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrder?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onRefresh,
  selectedOrderForModal,
  onClearSelectedOrder
}) => {
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOrder, setDetailOrder] = useState<Order | null>(selectedOrderForModal || null);

  // Editable fields in modal
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('pending');
  const [editingCourier, setEditingCourier] = useState('');
  const [editingTracking, setEditingTracking] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync modal when selectedOrderForModal changes
  React.useEffect(() => {
    if (selectedOrderForModal) {
      setDetailOrder(selectedOrderForModal);
      setEditingStatus(selectedOrderForModal.status);
      setEditingCourier(selectedOrderForModal.deliveryCourier || '');
      setEditingTracking(selectedOrderForModal.trackingNumber || '');
    }
  }, [selectedOrderForModal]);

  const openModal = (order: Order) => {
    setDetailOrder(order);
    setEditingStatus(order.status);
    setEditingCourier(order.deliveryCourier || '');
    setEditingTracking(order.trackingNumber || '');
  };

  const closeModal = () => {
    setDetailOrder(null);
    if (onClearSelectedOrder) onClearSelectedOrder();
  };

  const handleSaveOrderStatus = () => {
    if (!detailOrder) return;
    setIsSaving(true);
    storeService.updateOrderStatus(detailOrder.id, editingStatus, editingCourier, editingTracking);

    setTimeout(() => {
      setIsSaving(false);
      onRefresh();
      // Update local modal data
      setDetailOrder(prev => prev ? {
        ...prev,
        status: editingStatus,
        deliveryCourier: editingCourier,
        trackingNumber: editingTracking,
        paymentStatus: editingStatus === 'delivered' ? 'paid' : prev.paymentStatus
      } : null);
    }, 200);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to remove this order from records?')) {
      storeService.deleteOrder(orderId);
      closeModal();
      onRefresh();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Address', 'Items', 'Total (PKR)', 'Status', 'Courier', 'Tracking'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.date}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.city}"`,
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      `"${o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}"`,
      o.total,
      o.status,
      `"${o.deliveryCourier || ''}"`,
      `"${o.trackingNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tibra_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const couriersList = ['Trax Logistics', 'TCS Express', 'Leopards Courier', 'PostEx', 'Call Courier', 'M&P'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Orders Pipeline
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage customer shipments, verify payment, assign couriers & print dispatch slips.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {(['all', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'] as const).map((tab) => {
            const count = tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-zinc-800 text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, phone, name..."
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/50">
                <th className="py-3.5 px-6">Order</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Fulfillment</th>
                <th className="py-3.5 px-6">Courier / Tracking</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No orders found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="font-mono font-semibold text-emerald-400">{order.orderNumber}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{order.date}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-zinc-200 font-medium">{order.city}</div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">{order.shippingAddress}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.paymentMethod} • {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'dispatched'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : order.status === 'confirmed'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {order.deliveryCourier ? (
                        <div>
                          <div className="text-zinc-200 font-medium">{order.deliveryCourier}</div>
                          <div className="text-[10px] font-mono text-zinc-500">{order.trackingNumber || 'Pending AWB'}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-semibold text-white">
                      Rs. {order.total.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openModal(order)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-emerald-400">
                    {detailOrder.orderNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      detailOrder.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : detailOrder.status === 'dispatched'
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : detailOrder.status === 'confirmed'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : detailOrder.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {detailOrder.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Placed on {detailOrder.date}</span>
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Customer Information
                </span>
                <p className="font-semibold text-white text-sm">{detailOrder.customerName}</p>
                <p className="text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{detailOrder.customerPhone}</span>
                </p>
                {detailOrder.customerEmail && (
                  <p className="text-zinc-400 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{detailOrder.customerEmail}</span>
                  </p>
                )}
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Shipping Destination
                </span>
                <p className="text-zinc-300 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{detailOrder.shippingAddress}, {detailOrder.city}</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Payment: <strong className="text-zinc-300">{detailOrder.paymentMethod}</strong> ({detailOrder.paymentStatus.toUpperCase()})
                </p>
              </div>
            </div>

            {/* Ordered Line Items */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Order Items ({detailOrder.items.length})
              </h3>
              <div className="divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/40">
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/60 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.productName} width={40} height={40} loading="lazy" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <p className="text-[11px] text-zinc-400">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-white">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="p-3.5 bg-zinc-900/60 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>Rs. {detailOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery Charge</span>
                    <span>{detailOrder.shippingFee === 0 ? 'FREE' : `Rs. ${detailOrder.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-zinc-800 mt-1">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">Rs. {detailOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fulfillment & Courier Assignment Controls */}
            <div className="space-y-4 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Dispatch & Status Management</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Order Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="pending">Pending (Review)</option>
                    <option value="confirmed">Confirmed (Ready)</option>
                    <option value="dispatched">Dispatched (In Transit)</option>
                    <option value="delivered">Delivered (Completed)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={editingCourier}
                    onChange={(e) => setEditingCourier(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Courier...</option>
                    {couriersList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Tracking Number (AWB)
                  </label>
                  <input
                    type="text"
                    value={editingTracking}
                    onChange={(e) => setEditingTracking(e.target.value)}
                    placeholder="e.g. TRX-904128"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(detailOrder.id)}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Delete Order
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveOrderStatus}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                  >
                    {isSaving ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
