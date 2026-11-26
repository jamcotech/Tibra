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
  downloadA4TwoUpSlipsPDF,
  downloadBulkOrderSlipsPDF,
  printOrderSlip,
  printA4TwoUpSlip,
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

  // PDF Slip Actions (Single A5 Portrait & A4 Landscape Two-Up)
  const handleDownloadSlipA5 = (order: Order) => {
    downloadOrderSlipPDF(order, senderSettings);
  };

  const handleDownloadSlipA4TwoUp = (order: Order) => {
    downloadA4TwoUpSlipsPDF(order, null, senderSettings);
  };

  const handlePrintSlipA5 = (order: Order) => {
    printOrderSlip(order, senderSettings);
  };

  const handlePrintSlipA4TwoUp = (order: Order) => {
    printA4TwoUpSlip(order, null, senderSettings);
  };

  const handleBulkDownloadSlips = (mode: 'a5-single' | 'a4-two-up' = 'a5-single') => {
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to download slips.');
      return;
    }
    downloadBulkOrderSlipsPDF(selectedOrders, senderSettings, mode);
  };

  const handleBulkPrintSlips = (mode: 'a5-single' | 'a4-two-up' = 'a5-single') => {
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to print slips.');
      return;
    }
    printBulkOrderSlips(selectedOrders, senderSettings, mode);
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
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'approved':
      case 'confirmed':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'processing':
        return 'bg-indigo-50 text-indigo-800 border border-indigo-200';
      case 'packed':
        return 'bg-purple-50 text-purple-800 border border-purple-200';
      case 'ready_for_dispatch':
        return 'bg-cyan-50 text-cyan-800 border border-cyan-200';
      case 'dispatched':
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-teal-50 text-teal-800 border border-teal-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border border-red-200';
      case 'returned':
      case 'returned_to_sender':
        return 'bg-rose-50 text-rose-800 border border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
            Order Management & Dispatch
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Review customer orders, approve, print branded dispatch slips, and track shipments in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedOrderIds.length > 0 && (
            <>
              <button
                onClick={() => handleBulkDownloadSlips('a5-single')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Bulk A5 Slips ({selectedOrderIds.length})</span>
              </button>

              <button
                onClick={() => handleBulkDownloadSlips('a4-two-up')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#252E15] hover:bg-[#323D1D] text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>A4 2-Up Bulk</span>
              </button>

              <button
                onClick={() => handleBulkPrintSlips('a5-single')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#748C48]" />
                <span>Print Selected</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#748C48]" />
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
              ? 'bg-[#748C48]/10 border-[#748C48] shadow-xs'
              : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total Orders</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{statusCounts.all}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('pending')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'pending'
              ? 'bg-amber-100/70 border-amber-400 shadow-xs ring-1 ring-amber-400'
              : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{statusCounts.pending}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('approved')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'approved'
              ? 'bg-blue-100/70 border-blue-400 shadow-xs ring-1 ring-blue-400'
              : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Approved</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{statusCounts.approved}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('processing')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'processing'
              ? 'bg-indigo-100/70 border-indigo-400 shadow-xs ring-1 ring-indigo-400'
              : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
            <PackageOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Processing</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">{statusCounts.processing}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('ready_for_dispatch')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'ready_for_dispatch'
              ? 'bg-cyan-100/70 border-cyan-400 shadow-xs ring-1 ring-cyan-400'
              : 'bg-cyan-50/50 border-cyan-200 hover:border-cyan-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Ready Dispatch</span>
          </div>
          <div className="text-2xl font-bold text-cyan-900 mt-1">{statusCounts.ready_for_dispatch}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('dispatched')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'dispatched'
              ? 'bg-teal-100/70 border-teal-400 shadow-xs ring-1 ring-teal-400'
              : 'bg-teal-50/50 border-teal-200 hover:border-teal-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            <span>Dispatched</span>
          </div>
          <div className="text-2xl font-bold text-teal-900 mt-1">{statusCounts.dispatched}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('delivered')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'delivered'
              ? 'bg-emerald-100/70 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
              : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{statusCounts.delivered}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('cancelled')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'cancelled'
              ? 'bg-red-100/70 border-red-400 shadow-xs ring-1 ring-red-400'
              : 'bg-red-50/50 border-red-200 hover:border-red-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-1">{statusCounts.cancelled}</div>
        </div>

        <div
          onClick={() => setActiveStatusTab('returned')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            activeStatusTab === 'returned'
              ? 'bg-rose-100/70 border-rose-400 shadow-xs ring-1 ring-rose-400'
              : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            <span>Returned / RTO</span>
          </div>
          <div className="text-2xl font-bold text-rose-900 mt-1">{statusCounts.returned}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-xs">
        {/* Horizontal Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStatusTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeStatusTab === 'all'
                ? 'bg-[#748C48] text-white font-semibold shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span>All Orders</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeStatusTab === 'all' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
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
                    ? 'bg-[#748C48] text-white font-semibold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{STATUS_LABELS[statusKey]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Date, Payment and Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, phone, name, city, AWB..."
              className="w-full bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#748C48] focus:ring-1 focus:ring-[#748C48] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Date Preset */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-700">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-800 outline-none cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-700">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-800 outline-none cursor-pointer"
              >
                <option value="all">Payment: All</option>
                <option value="paid">Paid Only</option>
                <option value="pending">COD Pending</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50/80">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-300 text-[#748C48] focus:ring-[#748C48] cursor-pointer"
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
            <tbody className="divide-y divide-zinc-100 text-xs">
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
                      className={`hover:bg-[#FAF8F5] transition ${isSelected ? 'bg-[#748C48]/5' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="rounded border-zinc-300 text-[#748C48] focus:ring-[#748C48] cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-[#252E15]">{order.orderNumber}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{order.date}</div>
                        {order.items.length > 0 && (
                          <div className="text-[10px] text-zinc-600 mt-1 truncate max-w-[140px]">
                            {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-zinc-900">{order.customerName}</div>
                        <div className="text-[11px] text-zinc-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#748C48]" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-zinc-800 font-medium">{order.city}</div>
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
                            <div className="text-zinc-800 font-medium">{order.deliveryCourier}</div>
                            <div className="text-[10px] font-mono text-zinc-500">{order.trackingNumber || 'Pending AWB'}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-bold text-zinc-900">
                        <div>Rs. {order.total.toLocaleString()}</div>
                        <div className="text-[10px] text-zinc-500 font-normal">
                          {order.paymentMethod} • <span className={order.paymentStatus === 'paid' ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>{order.paymentStatus.toUpperCase()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadSlipA5(order)}
                            title="Download A5 Slip PDF"
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-[#748C48] text-zinc-700 hover:text-white transition cursor-pointer shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDownloadSlipA4TwoUp(order)}
                            title="Download A4 Two-Up PDF Slip"
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-[#252E15] text-zinc-700 hover:text-white transition cursor-pointer shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handlePrintSlipA5(order)}
                            title="Print A5 Slip"
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openModal(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#748C48] hover:bg-[#5F7339] text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-zinc-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-bold text-[#252E15]">
                    {detailOrder.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(detailOrder.status)}`}>
                    {STATUS_LABELS[detailOrder.status] || detailOrder.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Placed on {detailOrder.date} (PKT)</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSlipA5(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5F7339] text-white flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>A5 Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSlipA4TwoUp(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#252E15] hover:bg-[#323D1D] text-white flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>A4 Two-Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintSlipA5(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print A5</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintSlipA4TwoUp(detailOrder)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print 2-Up</span>
                </button>

                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
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
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-red-50 border border-red-300 text-red-800'
                }`}
              >
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Workflow Quick Action Bar for Pending Orders */}
            {detailOrder.status === 'pending' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-amber-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Order Pending Approval</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Verify customer address and phone number before approving for dispatch.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRecalculatePricing}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recalculate Pricing</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 transition cursor-pointer"
                  >
                    Reject Order
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#748C48] hover:bg-[#5F7339] text-white transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Order</span>
                  </button>
                </div>
              </div>
            )}

            {/* Customer & Shipping Summary (with Pre-Dispatch Editing) */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Customer & Delivery Address
                </span>
                {detailOrder.status !== 'dispatched' && detailOrder.status !== 'delivered' && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(prev => !prev)}
                    className="text-xs text-[#748C48] hover:underline cursor-pointer font-semibold"
                  >
                    {isEditingCustomer ? 'Cancel Edit' : 'Edit Shipping Details'}
                  </button>
                )}
              </div>

              {!isEditingCustomer ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{detailOrder.customerName}</p>
                    <p className="text-zinc-700 mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#748C48]" />
                      <span>{detailOrder.customerPhone}</span>
                      {detailOrder.alternatePhone && (
                        <span className="text-zinc-500">/ Alt: {detailOrder.alternatePhone}</span>
                      )}
                    </p>
                    {detailOrder.customerEmail && (
                      <p className="text-zinc-600 mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{detailOrder.customerEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-zinc-700 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#748C48] shrink-0 mt-0.5" />
                      <span>{detailOrder.shippingAddress}, {detailOrder.city}</span>
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-2">
                      Payment Mode: <strong className="text-zinc-900">{detailOrder.paymentMethod}</strong> (Status: <span className={detailOrder.paymentStatus === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>{detailOrder.paymentStatus.toUpperCase()}</span>)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editCustomerPhone}
                        onChange={(e) => setEditCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Alternate Phone</label>
                      <input
                        type="text"
                        value={editAlternatePhone}
                        onChange={(e) => setEditAlternatePhone(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Destination City</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Complete Street Address</label>
                    <textarea
                      rows={2}
                      value={editShippingAddress}
                      onChange={(e) => setEditShippingAddress(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingCustomer(false)}
                      className="px-3 py-1 rounded-xl text-xs text-zinc-600 hover:text-zinc-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomerInfo}
                      className="px-4 py-1 rounded-xl text-xs font-semibold bg-[#748C48] text-white hover:bg-[#5F7339] shadow-2xs"
                    >
                      Save Shipping Info
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ordered Line Items with Pricing Breakdown */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center justify-between">
                <span>Ordered Items ({detailOrder.items.length})</span>
                {detailOrder.pricingSnapshot && (
                  <span className="text-[11px] text-[#252E15] font-medium">
                    Package: {detailOrder.pricingSnapshot.packageType.toUpperCase()} (Delivery: {detailOrder.pricingSnapshot.isDeliveryIncluded ? 'Included FREE' : `Rs. ${detailOrder.pricingSnapshot.deliveryCharges}`})
                  </span>
                )}
              </h3>

              <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-2xs">
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.productName} width={40} height={40} loading="lazy" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{item.productName}</p>
                        <p className="text-[11px] text-zinc-500">
                          SKU: <span className="font-mono text-zinc-700">{item.sku || 'TN-PRO-030'}</span> • Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="p-3.5 bg-zinc-50 flex flex-col gap-1.5 text-xs border-t border-zinc-200">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-zinc-900">Rs. {detailOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery Charges</span>
                    <span className="font-medium text-zinc-900">{detailOrder.shippingFee === 0 ? 'Delivery Included (FREE)' : `Rs. ${detailOrder.shippingFee}`}</span>
                  </div>
                  {detailOrder.discount ? (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Package Discount</span>
                      <span>- Rs. {detailOrder.discount.toLocaleString()}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-zinc-900 font-bold text-sm pt-2 border-t border-zinc-200 mt-1">
                    <span>Final COD Collection</span>
                    <span className="text-[#252E15] text-base">Rs. {detailOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Transition, Courier & Dispatch Assignment */}
            <div className="space-y-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#252E15] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#748C48]" />
                <span>Order Status & Courier Dispatch Controls</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Update Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
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
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={editingCourier}
                    onChange={(e) => setEditingCourier(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                  >
                    <option value="">Select Courier...</option>
                    {couriersList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Tracking Number / Consignment #
                  </label>
                  <input
                    type="text"
                    value={editingTracking}
                    onChange={(e) => setEditingTracking(e.target.value)}
                    placeholder="e.g. 773129841"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[#748C48] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Status Change Note / Audit Reason (Optional)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed over to TCS Karachi Hub for same-day departure"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-[#748C48]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(detailOrder.id)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Delete Record
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveOrderStatus}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#748C48] hover:bg-[#5F7339] text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Apply Status & Save'}
                </button>
              </div>
            </div>

            {/* Audit Log / Status History Timeline */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                <span>Status Audit Trail & History</span>
              </h3>

              {(!detailOrder.statusHistory || detailOrder.statusHistory.length === 0) ? (
                <p className="text-xs text-zinc-500 italic">No transition history recorded for this order yet.</p>
              ) : (
                <div className="space-y-2">
                  {detailOrder.statusHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-[#748C48] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 capitalize">
                            {STATUS_LABELS[entry.status] || entry.status}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">{entry.timestamp}</span>
                        </div>
                        {entry.note && (
                          <p className="text-zinc-600 text-[11px] mt-0.5">{entry.note}</p>
                        )}
                        <p className="text-[10px] text-zinc-400 mt-0.5">By: {entry.updatedBy || 'System'}</p>
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
