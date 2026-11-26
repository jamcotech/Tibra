import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Search,
  RefreshCw,
  Download,
  ExternalLink,
  Edit
} from 'lucide-react';
import type { Order } from '../../types/ecommerce';

interface ShipmentTrackingPageProps {
  orders: Order[];
  onRefresh: () => void;
}

interface CourierSettings {
  providerId: string;
  displayName: string;
  isConfigured: boolean;
  mode: string;
  webhookUrl: string;
  requiredEnv: string;
}

export const ShipmentTrackingPage: React.FC<ShipmentTrackingPageProps> = ({ orders, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'couriers'>('tracking');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [courierFilter, setCourierFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [assignCourier, setAssignCourier] = useState('TCS');
  const [assignTrackingNo, setAssignTrackingNo] = useState('');
  const [updateStatus, setUpdateStatus] = useState('in_transit');
  const [updateLocation, setUpdateLocation] = useState('Lahore Central Hub');
  const [updateReason, setUpdateReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Courier providers
  const [courierSettings, setCourierSettings] = useState<CourierSettings[]>([]);
  const [shipmentsData, setShipmentsData] = useState<any[]>([]);

  // Fetch API shipments and couriers
  const fetchApiData = async () => {
    try {
      const cRes = await fetch('/api/couriers');
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData.couriers) setCourierSettings(cData.couriers);
      }

      const sRes = await fetch('/api/shipments');
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.shipments) setShipmentsData(sData.shipments);
      }
    } catch (err) {
      console.warn('[ShipmentTrackingPage] Could not load API shipments:', err);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  // Merge local orders with shipment records
  const mergedRecords = useMemo(() => {
    return orders.map(order => {
      const match = shipmentsData.find(s => s.orderId === order.id || s.orderNumber === order.orderNumber);
      return {
        ...order,
        shipmentCourier: match?.courier || order.deliveryCourier || 'Unassigned',
        shipmentTracking: match?.trackingNumber || order.trackingNumber || '',
        shipmentStatus: match?.status || order.status || 'order_placed',
        lastSync: match?.lastSyncAt || order.date
      };
    });
  }, [orders, shipmentsData]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let awaiting = 0;
    let processing = 0;
    let readyDispatch = 0;
    let booked = 0;
    let inTransit = 0;
    let outDelivery = 0;
    let delivered = 0;
    let exceptions = 0;

    mergedRecords.forEach(r => {
      const s = (r.shipmentStatus || '').toLowerCase();
      if (s === 'order_placed' || s === 'pending') awaiting++;
      else if (s === 'order_confirmed' || s === 'processing' || s === 'packed') processing++;
      else if (s === 'ready_for_dispatch') readyDispatch++;
      else if (s === 'shipment_booked' || s === 'courier_picked_up') booked++;
      else if (s === 'in_transit' || s === 'arrived_at_hub' || s === 'dispatched') inTransit++;
      else if (s === 'out_for_delivery') outDelivery++;
      else if (s === 'delivered') delivered++;
      else if (s.includes('attempt') || s.includes('delay') || s.includes('address') || s.includes('unavailable') || s.includes('held') || s.includes('return')) exceptions++;
    });

    return {
      total: mergedRecords.length,
      awaiting,
      processing,
      readyDispatch,
      booked,
      inTransit,
      outDelivery,
      delivered,
      exceptions
    };
  }, [mergedRecords]);

  // Filtered orders
  const filteredRecords = useMemo(() => {
    return mergedRecords.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q) ||
        r.shipmentTracking.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'in_transit' && (r.shipmentStatus === 'in_transit' || r.shipmentStatus === 'arrived_at_hub')) ||
        (statusFilter === 'exceptions' && (r.shipmentStatus.includes('attempt') || r.shipmentStatus.includes('delay') || r.shipmentStatus.includes('return'))) ||
        r.shipmentStatus === statusFilter;

      const matchCourier =
        courierFilter === 'ALL' ||
        r.shipmentCourier.toLowerCase().includes(courierFilter.toLowerCase());

      return matchQuery && matchStatus && matchCourier;
    });
  }, [mergedRecords, searchQuery, statusFilter, courierFilter]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Courier', 'Tracking #', 'Status', 'Payment Method', 'Total'];
    const rows = filteredRecords.map(r => [
      `"${r.orderNumber}"`,
      `"${r.date}"`,
      `"${r.customerName}"`,
      `"${r.customerPhone}"`,
      `"${r.city}"`,
      `"${r.shipmentCourier}"`,
      `"${r.shipmentTracking}"`,
      `"${r.shipmentStatus}"`,
      `"${r.paymentMethod}"`,
      r.total
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TIBRA_Shipment_Tracking_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Assign Courier Action
  const handleAssignCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsActionLoading(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          courier: assignCourier,
          trackingNumber: assignTrackingNo || undefined,
          adminUser: 'Store Administrator'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign courier');

      setActionMessage(`Success: Assigned ${assignCourier} #${data.shipment?.trackingNumber || assignTrackingNo}`);
      setIsAssignModalOpen(false);
      setAssignTrackingNo('');
      onRefresh();
      fetchApiData();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Update Status Action
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsActionLoading(true);
    setActionMessage(null);

    try {
      // Find shipment ID
      const shipment = shipmentsData.find(s => s.orderId === selectedOrder.id);
      if (shipment) {
        await fetch('/api/shipments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shipmentId: shipment.id,
            status: updateStatus,
            location: updateLocation,
            reason: updateReason || 'Manual dispatch status update',
            adminUser: 'Store Administrator'
          })
        });
      } else {
        await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedOrder.id,
            status: updateStatus,
            location: updateLocation,
            reason: updateReason || 'Manual status update',
            adminUser: 'Store Administrator'
          })
        });
      }

      setActionMessage(`Success: Updated status to ${updateStatus}`);
      setIsStatusModalOpen(false);
      setUpdateReason('');
      onRefresh();
      fetchApiData();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Sync with live courier
  const handleSyncCourier = async (order: Order) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/shipments?orderId=${order.id}&sync=true`);
      if (res.ok) {
        const data = await res.json();
        setActionMessage(`Synced with ${data.shipment?.courier || 'courier'}: ${data.shipment?.status}`);
        onRefresh();
        fetchApiData();
      }
    } catch (err: any) {
      setActionMessage(`Sync failed: ${err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Order & Shipment Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Logistics Engine
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage, dispatch, track, and monitor customer orders across TCS, PostEx, Leopards, and manual couriers in Pakistan.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'tracking' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Shipments & Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('couriers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'couriers' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Courier Settings
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => {
              onRefresh();
              fetchApiData();
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-3.5 rounded-xl text-xs font-medium border ${
          actionMessage.startsWith('Error')
            ? 'bg-red-950/40 border-red-800/60 text-red-300'
            : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
        }`}>
          {actionMessage}
        </div>
      )}

      {activeTab === 'tracking' ? (
        <>
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Total Orders</span>
              <span className="text-xl font-bold text-white mt-1 block">{metrics.total}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Awaiting Conf.</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">{metrics.awaiting}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Processing</span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">{metrics.processing}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Ready Dispatch</span>
              <span className="text-xl font-bold text-purple-400 mt-1 block">{metrics.readyDispatch}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Booked / Picked</span>
              <span className="text-xl font-bold text-sky-400 mt-1 block">{metrics.booked}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">In Transit</span>
              <span className="text-xl font-bold text-amber-300 mt-1 block">{metrics.inTransit}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Out for Deliv.</span>
              <span className="text-xl font-bold text-orange-400 mt-1 block">{metrics.outDelivery}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Delivered</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">{metrics.delivered}</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order #, Consignment, Customer Name, City..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="order_placed">Awaiting Confirmation</option>
                <option value="order_confirmed">Confirmed</option>
                <option value="processing">Processing / Packing</option>
                <option value="ready_for_dispatch">Ready for Dispatch</option>
                <option value="shipment_booked">Shipment Booked</option>
                <option value="in_transit">In Transit / Hub</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="exceptions">Exceptions / Delayed</option>
              </select>

              <select
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Couriers</option>
                <option value="TCS">TCS Express</option>
                <option value="PostEx">PostEx</option>
                <option value="Leopards">Leopards</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          {/* Orders & Shipments Table */}
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Order #</th>
                    <th className="px-4 py-3.5">Customer & City</th>
                    <th className="px-4 py-3.5">Courier & Consignment</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">COD Amount</th>
                    <th className="px-4 py-3.5">Last Sync</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                        No orders matching the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const isDelivered = r.shipmentStatus === 'delivered';
                      const isOut = r.shipmentStatus === 'out_for_delivery';
                      const isTransit = r.shipmentStatus === 'in_transit' || r.shipmentStatus === 'arrived_at_hub';
                      const isException = r.shipmentStatus.includes('attempt') || r.shipmentStatus.includes('delay') || r.shipmentStatus.includes('return');

                      return (
                        <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                          <td className="px-4 py-3 font-mono font-bold text-white">
                            {r.orderNumber}
                            <span className="block text-[10px] font-sans font-normal text-zinc-500 mt-0.5">
                              {r.date}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-zinc-200 block">{r.customerName}</span>
                            <span className="text-[11px] text-zinc-400">{r.customerPhone} • {r.city}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-zinc-200 block">{r.shipmentCourier}</span>
                            {r.shipmentTracking ? (
                              <span className="text-[11px] font-mono text-emerald-400">{r.shipmentTracking}</span>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-medium">Unbooked</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                isDelivered
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : isOut
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                  : isTransit
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : isException
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              {r.shipmentStatus.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-medium text-zinc-200">
                            Rs. {r.total.toLocaleString()}
                            <span className="block text-[10px] text-zinc-500">{r.paymentMethod}</span>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-zinc-400 font-mono">
                            {r.lastSync}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(r)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(r);
                                  setIsAssignModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition cursor-pointer"
                                title="Assign / Book Courier"
                              >
                                <Truck className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(r);
                                  setIsStatusModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition cursor-pointer"
                                title="Update Status & Audit Log"
                              >
                                <Edit className="w-3.5 h-3.5" />
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
        </>
      ) : (
        /* Courier Settings View */
        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Pakistan Courier Provider Integrations</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Verify credentials status, webhook callback URLs, and automated electronic booking for top couriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courierSettings.map(c => (
              <div key={c.providerId} className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{c.displayName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    c.isConfigured
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {c.mode}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-zinc-400">
                  <p><strong>Required Env Variables:</strong> <span className="font-mono text-zinc-300">{c.requiredEnv}</span></p>
                  <p><strong>Webhook Endpoint:</strong></p>
                  <div className="p-2 rounded bg-zinc-900 font-mono text-[11px] text-zinc-300 break-all border border-zinc-800">
                    {c.webhookUrl}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
                  {c.isConfigured
                    ? '✓ Live API authenticated and ready to issue tracking consignments.'
                    : 'ℹ️ Live API credentials not detected. Operating in verified Manual / Fallback Mode. Admin can manually enter consignment numbers.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && !isAssignModalOpen && !isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-white">Order Details: {selectedOrder.orderNumber}</h3>
                <span className="text-xs text-zinc-400">{selectedOrder.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
              <div>
                <p className="text-zinc-500 uppercase font-semibold text-[10px]">Customer Details</p>
                <p className="text-sm font-bold text-white mt-1">{selectedOrder.customerName}</p>
                <p className="text-zinc-300">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p className="text-zinc-400">{selectedOrder.customerEmail}</p>}
              </div>
              <div>
                <p className="text-zinc-500 uppercase font-semibold text-[10px]">Shipping Destination</p>
                <p className="text-sm font-bold text-white mt-1">{selectedOrder.city}</p>
                <p className="text-zinc-300">{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Courier & Tracking Info */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 uppercase font-semibold text-[10px]">Assigned Courier</p>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedOrder.deliveryCourier || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase font-semibold text-[10px]">Consignment Number</p>
                  <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                    {selectedOrder.trackingNumber || 'Pending'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSyncCourier(selectedOrder)}
                  disabled={isActionLoading || !selectedOrder.trackingNumber}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isActionLoading ? 'animate-spin' : ''}`} />
                  Sync Courier API
                </button>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-xs">
                  <a
                    href={`/track-order/?order=${selectedOrder.orderNumber}&phone=${encodeURIComponent(selectedOrder.customerPhone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Open Public Customer Tracking View <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Ordered Items</p>
              <div className="divide-y divide-zinc-800 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-mono font-semibold text-white">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-bold text-sm text-white border-t border-zinc-800">
                <span>Total Amount:</span>
                <span>Rs. {selectedOrder.total.toLocaleString()} ({selectedOrder.paymentMethod})</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Assign / Book Courier
              </button>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Courier Modal */}
      {isAssignModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAssignCourier} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Assign Courier & Generate Consignment</h3>
            <p className="text-xs text-zinc-400">Order: {selectedOrder.orderNumber} • Destination: {selectedOrder.city}</p>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Select Courier Partner
              </label>
              <select
                value={assignCourier}
                onChange={(e) => setAssignCourier(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="TCS">TCS Express (COD & Standard)</option>
                <option value="PostEx">PostEx Pakistan</option>
                <option value="Leopards">Leopards Courier</option>
                <option value="Manual">Manual / Custom Rider</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Tracking / Consignment Number (Optional)
              </label>
              <input
                type="text"
                value={assignTrackingNo}
                onChange={(e) => setAssignTrackingNo(e.target.value)}
                placeholder="Leave blank to auto-generate from API"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                If credentials are configured, the system books via API. Otherwise generates verified tracking number.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {isActionLoading ? 'Booking...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Status Modal with Audit Logging */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateStatus} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Manual Status Update & Audit Log</h3>
            <p className="text-xs text-zinc-400">Order: {selectedOrder.orderNumber} • Current: {selectedOrder.status}</p>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                New Milestone Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <optgroup label="Standard Milestones">
                  <option value="order_confirmed">Order Confirmed</option>
                  <option value="processing">Processing (Stock Allocated)</option>
                  <option value="packed">Packed</option>
                  <option value="ready_for_dispatch">Ready for Dispatch</option>
                  <option value="shipment_booked">Shipment Booked</option>
                  <option value="courier_picked_up">Courier Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="arrived_at_hub">Arrived at Destination Hub</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered (Cash Collected)</option>
                </optgroup>
                <optgroup label="Exceptions">
                  <option value="delivery_attempted">Delivery Attempted</option>
                  <option value="delayed">Delayed</option>
                  <option value="address_issue">Address Issue</option>
                  <option value="customer_unavailable">Customer Unavailable</option>
                  <option value="held_at_hub">Held at Hub</option>
                  <option value="returned">Returned / RTO</option>
                  <option value="cancelled">Cancelled</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Current Location / Facility
              </label>
              <input
                type="text"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
                placeholder="e.g. Lahore Central Hub, Karachi Korangi Hub"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Reason / Internal Notes (Logged for Audit)
              </label>
              <textarea
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                rows={2}
                placeholder="e.g. Handed over to courier driver, verified delivery call"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {isActionLoading ? 'Saving...' : 'Update & Audit Log'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
