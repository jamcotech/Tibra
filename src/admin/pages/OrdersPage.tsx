import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Printer,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  RefreshCw,
  PackageCheck,
  PackageOpen,
  Filter,
  ArrowUpDown,
  History,
  AlertCircle
} from 'lucide-react';
import type { Order, OrderStatus } from '../../types/ecommerce';
import { storeService, canTransitionStatus } from '../../services/storeService';
import {
  downloadOrderSlipPDF,
  downloadBulkOrderSlipsPDF,
  printOrderSlip,
  printBulkOrderSlips
} from '../../services/pdfSlipService';

interface OrdersPageProps {
  orders: Order[];
  onRefresh: () => void;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrder?: () => void;
}

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'approved',
  'processing',
  'packed',
  'ready_for_dispatch',
  'dispatched',
  'delivered',
  'cancelled',
  'returned',
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  confirmed: 'Approved',
  processing: 'Processing',
  packed: 'Packed',
  ready_for_dispatch: 'Ready for Dispatch',
  dispatched: 'Dispatched',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned / RTO',
  returned_to_sender: 'Returned to Sender',
};

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onRefresh,
  selectedOrderForModal,
  onClearSelectedOrder
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | 'month'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Modal State
  const [detailOrder, setDetailOrder] = useState<Order | null>(selectedOrderForModal || null);
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('pending');
  const [editingCourier, setEditingCourier] = useState('');
  const [editingTracking, setEditingTracking] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Editable Customer Info in Modal
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editAlternatePhone, setEditAlternatePhone] = useState('');
  const [editShippingAddress, setEditShippingAddress] = useState('');
  const [editCity, setEditCity] = useState('');

  const senderSettings = storeService.getSenderSettings();

  // Sync modal when selectedOrderForModal changes
  React.useEffect(() => {
    if (selectedOrderForModal) {
      openModal(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  const openModal = (order: Order) => {
    setDetailOrder(order);
    setEditingStatus(order.status);
    setEditingCourier(order.deliveryCourier || '');
    setEditingTracking(order.trackingNumber || '');
    setAdminNotes(order.adminNotes || '');
    setStatusNote('');
    setIsEditingCustomer(false);
    setEditCustomerName(order.customerName);
    setEditCustomerPhone(order.customerPhone);
    setEditAlternatePhone(order.alternatePhone || '');
    setEditShippingAddress(order.shippingAddress);
    setEditCity(order.city);
    setActionMessage(null);
  };

  const closeModal = () => {
    setDetailOrder(null);
    setActionMessage(null);
    if (onClearSelectedOrder) onClearSelectedOrder();
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Status Action Handlers
  const handleApprove = () => {
    if (!detailOrder) return;
    try {
      const updated = storeService.approveOrder(detailOrder.id, 'Administrator', 'Order reviewed and approved for fulfillment');
      setDetailOrder(updated);
      setEditingStatus(updated.status);
      onRefresh();
      showFeedback('Order approved successfully!');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to approve order', 'error');
    }
  };

  const handleReject = () => {
    if (!detailOrder) return;
    const reason = window.prompt('Please provide a reason for cancelling this order:', 'Customer requested cancellation');
    if (!reason) return;
    try {
      const updated = storeService.rejectOrder(detailOrder.id, reason, 'Administrator');
      setDetailOrder(updated);
      setEditingStatus(updated.status);
      onRefresh();
      showFeedback('Order marked as Cancelled.', 'success');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to cancel order', 'error');
    }
  };

  const handleRecalculatePricing = () => {
    if (!detailOrder) return;
    if (detailOrder.status !== 'pending') {
      showFeedback('Only Pending orders can be recalculated.', 'error');
      return;
    }
    if (window.confirm(`Recalculate order pricing for ${detailOrder.orderNumber} based on the latest admin product & combo pricing catalog?`)) {
      try {
        const updated = storeService.recalculatePendingOrder(detailOrder.id, 'Administrator');
        setDetailOrder(updated);
        onRefresh();
        showFeedback(`Order recalculated. New Total: Rs. ${updated.total.toLocaleString()}`);
      } catch (err: any) {
        showFeedback(err.message || 'Failed to recalculate', 'error');
      }
    }
  };

  const handleSaveOrderStatus = () => {
    if (!detailOrder) return;
    setIsSaving(true);
    try {
      const updated = storeService.updateOrderStatusWithAudit(
        detailOrder.id,
        editingStatus,
        editingCourier,
        editingTracking,
        statusNote || undefined,
        'Administrator'
      );

      // Also persist admin notes if changed
      if (adminNotes !== (detailOrder.adminNotes || '')) {
        storeService.updateCustomerShippingInfo(detailOrder.id, { adminNotes }, 'Administrator');
      }

      setDetailOrder(updated);
      setStatusNote('');
      onRefresh();
      showFeedback('Order updated with audit log entry.');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update order', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustomerInfo = () => {
    if (!detailOrder) return;
    try {
      const updated = storeService.updateCustomerShippingInfo(
        detailOrder.id,
        {
          customerName: editCustomerName,
          customerPhone: editCustomerPhone,
          alternatePhone: editAlternatePhone,
          shippingAddress: editShippingAddress,
          city: editCity,
        },
        'Administrator'
      );
      setDetailOrder(updated);
      setIsEditingCustomer(false);
      onRefresh();
      showFeedback('Customer shipping info updated.');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update info', 'error');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this order record?')) {
      storeService.deleteOrder(orderId);
      closeModal();
      onRefresh();
    }
  };

  // PDF Slip Actions
  const handleDownloadSlip = (order: Order) => {
    downloadOrderSlipPDF(order, senderSettings);
  };

  const handlePrintSlip = (order: Order) => {
    printOrderSlip(order, senderSettings);
  };

  const handleBulkDownloadSlips = () => {
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to download slips.');
      return;
    }
    downloadBulkOrderSlipsPDF(selectedOrders, senderSettings);
  };

  const handleBulkPrintSlips = () => {
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to print slips.');
      return;
    }
    printBulkOrderSlips(selectedOrders, senderSettings);
  };

  const handleExportCSV = () => {
    const headers = [
      'Order Number',
      'Date',
      'Status',
      'Customer Name',
      'Phone',
      'Alternate Phone',
      'City',
      'Shipping Address',
      'Items',
      'Subtotal (PKR)',
      'Delivery Fee (PKR)',
      'Total Payable (PKR)',
      'Payment Method',
      'Payment Status',
      'Courier',
      'Tracking Number'
    ];

    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.date}"`,
      o.status,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.alternatePhone || ''}"`,
      `"${o.city}"`,
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      `"${o.items.map(i => `${i.productName} (x${i.quantity})`).join('; ')}"`,
      o.subtotal,
      o.shippingFee,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
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

  // Filtered and Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (activeStatusTab !== 'all') {
        if (activeStatusTab === 'approved' && (order.status === 'approved' || order.status === 'confirmed')) {
          // match approved / confirmed
        } else if (activeStatusTab === 'returned' && (order.status === 'returned' || order.status === 'returned_to_sender')) {
          // match returned
        } else if (order.status !== activeStatusTab) {
          return false;
        }
      }

      // Payment filter
      if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.date.replace(' ', 'T'));
        const now = new Date();
        if (dateFilter === 'today') {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === '7days') {
          const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === 'month') {
          if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      const timeA = new Date(a.date.replace(' ', 'T')).getTime();
      const timeB = new Date(b.date.replace(' ', 'T')).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [orders, activeStatusTab, paymentFilter, dateFilter, searchQuery, sortOrder]);

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const couriersList = [
    'Trax Logistics',
    'TCS Express',
    'PostEx',
    'Leopards Courier',
    'Call Courier',
    'M&P Express',
    'Rider Delivery',
    'Direct Dispatch / In-house Rider'
  ];

  // Pipeline Summary Counts
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      approved: orders.filter(o => o.status === 'approved' || o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      packed: orders.filter(o => o.status === 'packed').length,
      ready_for_dispatch: orders.filter(o => o.status === 'ready_for_dispatch').length,
      dispatched: orders.filter(o => o.status === 'dispatched' || o.status === 'in_transit' || o.status === 'out_for_delivery').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      returned: orders.filter(o => o.status === 'returned' || o.status === 'returned_to_sender').length,
    };
  }, [orders]);

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'approved':
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'processing':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'packed':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'ready_for_dispatch':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'dispatched':
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-teal-500/20 text-teal-400 border border-teal-500/30';
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'returned':
      case 'returned_to_sender':
        return 'bg-rose-600/20 text-rose-400 border border-rose-600/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Order Management & Dispatch
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Review customer orders, approve, print branded dispatch slips, and track shipments in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedOrderIds.length > 0 && (
            <>
              <button
                onClick={handleBulkDownloadSlips}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#252E15] hover:bg-[#3E4A28] text-[#F5E6A3] border border-[#748C48]/40 transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Bulk Slips PDF ({selectedOrderIds.length})</span>
              </button>

              <button
                onClick={handleBulkPrintSlips}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Selected</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveStatusTab('all')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'all'
              ? 'bg-zinc-800/90 border-emerald-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Orders</div>
          <div className="text-2xl font-bold text-white mt-1">{statusCounts.all}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('pending')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'pending'
              ? 'bg-amber-950/40 border-amber-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-1">{statusCounts.pending}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('approved')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'approved'
              ? 'bg-blue-950/40 border-blue-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-1">{statusCounts.approved}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('processing')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'processing'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <PackageOpen className="w-3.5 h-3.5" />
            <span>Processing</span>
          </div>
          <div className="text-2xl font-bold text-indigo-300 mt-1">{statusCounts.processing}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('ready_for_dispatch')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'ready_for_dispatch'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Ready Dispatch</span>
          </div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">{statusCounts.ready_for_dispatch}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('dispatched')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'dispatched'
              ? 'bg-teal-950/40 border-teal-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatched</span>
          </div>
          <div className="text-2xl font-bold text-teal-300 mt-1">{statusCounts.dispatched}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('delivered')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'delivered'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{statusCounts.delivered}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('cancelled')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'cancelled'
              ? 'bg-red-950/40 border-red-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </div>
          <div className="text-2xl font-bold text-red-300 mt-1">{statusCounts.cancelled}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('returned')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'returned'
              ? 'bg-rose-950/40 border-rose-500 shadow-md'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Returned / RTO</span>
          </div>
          <div className="text-2xl font-bold text-rose-300 mt-1">{statusCounts.returned}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
        {/* Horizontal Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStatusTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeStatusTab === 'all'
                ? 'bg-[#748C48] text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <span>All Orders</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
              {statusCounts.all}
            </span>
          </button>

          {ALL_STATUSES.map((statusKey) => {
            const count = (statusCounts as any)[statusKey] || 0;
            const isActive = activeStatusTab === statusKey;
            return (
              <button
                key={statusKey}
                onClick={() => setActiveStatusTab(statusKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#748C48] text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span>{STATUS_LABELS[statusKey]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Date, Payment and Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, phone, name, city, AWB..."
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-[#748C48] focus:ring-1 focus:ring-[#748C48] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Date Preset */}
            <div className="flex items-center gap-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-transparent text-xs text-white outline-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900">All Dates</option>
                <option value="today" className="bg-zinc-900">Today</option>
                <option value="7days" className="bg-zinc-900">Last 7 Days</option>
                <option value="month" className="bg-zinc-900">This Month</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="bg-transparent text-xs text-white outline-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900">Payment: All</option>
                <option value="paid" className="bg-zinc-900">Paid Only</option>
                <option value="pending" className="bg-zinc-900">COD Pending</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-950/60">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courier / AWB</th>
                <th className="py-3.5 px-4">Payable Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No orders found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-zinc-800/40 transition ${isSelected ? 'bg-zinc-800/30' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-[#F5E6A3]">{order.orderNumber}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{order.date}</div>
                        {order.items.length > 0 && (
                          <div className="text-[10px] text-zinc-400 mt-1 truncate max-w-[140px]">
                            {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-zinc-200 font-medium">{order.city}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[160px]">
                          {order.shippingAddress}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusBadgeClass(order.status)}`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {order.deliveryCourier ? (
                          <div>
                            <div className="text-zinc-200 font-medium">{order.deliveryCourier}</div>
                            <div className="text-[10px] font-mono text-zinc-500">{order.trackingNumber || 'Pending AWB'}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-bold text-white">
                        <div>Rs. {order.total.toLocaleString()}</div>
                        <div className="text-[10px] text-zinc-400 font-normal">
                          {order.paymentMethod} • <span className={order.paymentStatus === 'paid' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>{order.paymentStatus.toUpperCase()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadSlip(order)}
                            title="Download Branded PDF Slip"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#252E15] text-zinc-300 hover:text-[#F5E6A3] transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handlePrintSlip(order)}
                            title="Print Slip"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openModal(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#748C48] hover:bg-[#5E7238] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-bold text-[#F5E6A3]">
                    {detailOrder.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(detailOrder.status)}`}>
                    {STATUS_LABELS[detailOrder.status] || detailOrder.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Placed on {detailOrder.date} (PKT)</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSlip(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#252E15] hover:bg-[#3E4A28] text-[#F5E6A3] border border-[#748C48]/40 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download PDF Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintSlip(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}
              >
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Workflow Quick Action Bar for Pending Orders */}
            {detailOrder.status === 'pending' && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Order Pending Approval</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Verify customer address and phone number before approving for dispatch.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRecalculatePricing}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recalculate Pricing</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 transition cursor-pointer"
                  >
                    Reject Order
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#748C48] hover:bg-[#5E7238] text-white transition cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Order</span>
                  </button>
                </div>
              </div>
            )}

            {/* Customer & Shipping Summary (with Pre-Dispatch Editing) */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Customer & Delivery Address
                </span>
                {detailOrder.status !== 'dispatched' && detailOrder.status !== 'delivered' && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(prev => !prev)}
                    className="text-xs text-[#748C48] hover:underline cursor-pointer"
                  >
                    {isEditingCustomer ? 'Cancel Edit' : 'Edit Shipping Details'}
                  </button>
                )}
              </div>

              {!isEditingCustomer ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-white text-sm">{detailOrder.customerName}</p>
                    <p className="text-zinc-300 mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{detailOrder.customerPhone}</span>
                      {detailOrder.alternatePhone && (
                        <span className="text-zinc-500">/ Alt: {detailOrder.alternatePhone}</span>
                      )}
                    </p>
                    {detailOrder.customerEmail && (
                      <p className="text-zinc-400 mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{detailOrder.customerEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-zinc-300 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detailOrder.shippingAddress}, {detailOrder.city}</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-2">
                      Payment Mode: <strong className="text-white">{detailOrder.paymentMethod}</strong> (Status: <span className={detailOrder.paymentStatus === 'paid' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{detailOrder.paymentStatus.toUpperCase()}</span>)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editCustomerPhone}
                        onChange={(e) => setEditCustomerPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Alternate Phone</label>
                      <input
                        type="text"
                        value={editAlternatePhone}
                        onChange={(e) => setEditAlternatePhone(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Destination City</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#748C48]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Complete Street Address</label>
                    <textarea
                      rows={2}
                      value={editShippingAddress}
                      onChange={(e) => setEditShippingAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#748C48]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingCustomer(false)}
                      className="px-3 py-1 rounded-xl text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomerInfo}
                      className="px-4 py-1 rounded-xl text-xs font-semibold bg-[#748C48] text-white hover:bg-[#5E7238]"
                    >
                      Save Shipping Info
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ordered Line Items with Pricing Breakdown */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                <span>Ordered Items ({detailOrder.items.length})</span>
                {detailOrder.pricingSnapshot && (
                  <span className="text-[11px] text-[#F5E6A3] font-normal">
                    Package: {detailOrder.pricingSnapshot.packageType.toUpperCase()} (Delivery Included: {detailOrder.pricingSnapshot.isDeliveryIncluded ? 'Yes' : 'No'})
                  </span>
                )}
              </h3>

              <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/40">
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.productName} width={40} height={40} loading="lazy" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <p className="text-[11px] text-zinc-400">
                          SKU: <span className="font-mono text-zinc-300">{item.sku || 'TN-PRO-030'}</span> • Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                        </p>
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
                    <span>Delivery Charges</span>
                    <span>{detailOrder.shippingFee === 0 ? 'Delivery Included (FREE)' : `Rs. ${detailOrder.shippingFee}`}</span>
                  </div>
                  {detailOrder.discount ? (
                    <div className="flex justify-between text-emerald-400">
                      <span>Package Discount</span>
                      <span>- Rs. {detailOrder.discount.toLocaleString()}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800 mt-1">
                    <span>Final COD Payable</span>
                    <span className="text-[#F5E6A3] text-base">Rs. {detailOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Transition, Courier & Dispatch Assignment */}
            <div className="space-y-4 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#748C48] flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Order Status & Courier Dispatch Controls</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Update Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#748C48]"
                  >
                    {ALL_STATUSES.map((status) => {
                      const isValid = canTransitionStatus(detailOrder.status, status);
                      return (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]} {!isValid && status !== detailOrder.status ? '(Guarded)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={editingCourier}
                    onChange={(e) => setEditingCourier(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#748C48]"
                  >
                    <option value="">Select Courier...</option>
                    {couriersList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Tracking Number / Consignment #
                  </label>
                  <input
                    type="text"
                    value={editingTracking}
                    onChange={(e) => setEditingTracking(e.target.value)}
                    placeholder="e.g. 773129841"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#748C48] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Status Change Note / Audit Reason (Optional)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed over to TCS Karachi Hub for same-day departure"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#748C48]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(detailOrder.id)}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Delete Record
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveOrderStatus}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5E7238] text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Apply Status & Save'}
                </button>
              </div>
            </div>

            {/* Audit Log / Status History Timeline */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                <span>Status Audit Trail & History</span>
              </h3>

              {(!detailOrder.statusHistory || detailOrder.statusHistory.length === 0) ? (
                <p className="text-xs text-zinc-500 italic">No transition history recorded for this order yet.</p>
              ) : (
                <div className="space-y-2">
                  {detailOrder.statusHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                      <div className="w-2 h-2 rounded-full bg-[#748C48] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white capitalize">
                            {STATUS_LABELS[entry.status] || entry.status}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{entry.timestamp}</span>
                        </div>
                        {entry.note && (
                          <p className="text-zinc-400 text-[11px] mt-0.5">{entry.note}</p>
                        )}
                        <p className="text-[10px] text-zinc-500 mt-0.5">By: {entry.updatedBy || 'System'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
