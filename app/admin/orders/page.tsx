'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingBag, Clock, Eye, RefreshCw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE;

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

type OrderItem = {
  product: {
    name: string;
    images?: string[];
  };
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  shippingDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1. Fetch orders data block
  useEffect(() => {
    const fetchOrdersOnMount = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('CAMX_TOKEN');
        const response = await axios.get(`${API}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(() => {
          const freshData = Array.isArray(response.data) ? response.data.reverse() : [];
          return freshData;
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load system orders log.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersOnMount();
  }, []);

  const handleManualRefresh = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('CAMX_TOKEN');
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(response.data) ? response.data.reverse() : []);
      toast.success('Orders log refreshed.');
    } catch (error) {
      console.error('Error updating order log:', error);
      toast.error('Failed to update system orders log.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Modify individual system order status metrics
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('CAMX_TOKEN');
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Order status updated to ${newStatus}`);
      
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update status workflow node.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto w-full transition-colors duration-300">
      
      {/* HEADER NODES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Order <span className="text-secondary">Management</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">
            Track invoices, modify dispatch workflows, and process hardware distributions across Sri Lanka.
          </p>
        </div>
        <button 
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border border-border bg-white dark:bg-card rounded-xl hover:bg-neutral-50 dark:hover:bg-background transition cursor-pointer text-neutral-800 dark:text-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {loading ? (
        /* LOADING SKELETON PLACEHOLDER */
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-neutral-100 dark:bg-card border border-neutral-200 dark:border-border rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* EMPTY STATE VIEW */
        <div className="text-center py-20 bg-white dark:bg-card border border-border rounded-3xl p-8">
          <ShoppingBag size={48} className="text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">No orders found</h2>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">There are no client invoices recorded inside the system database cache yet.</p>
        </div>
      ) : (
        /* MAIN CONTENT MATRIX GRID */
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT TABLE: INVOICES GRID CONTROL */}
          <div className="lg:col-span-2 space-y-4 overflow-x-auto">
            <div className="min-w-150 lg:min-w-0 space-y-3">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border border-solid bg-white dark:bg-card hover:border-secondary transition cursor-pointer flex items-center justify-between shadow-sm ${selectedOrder?._id === order._id ? 'border-secondary ring-2 ring-secondary/10' : 'border-neutral-200 dark:border-border'}`}
                >
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400 dark:text-gray-500 font-semibold">
                      ID: #{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                      {order.shippingDetails.name}
                    </h3>
                    <p className="text-xs font-medium text-neutral-500 dark:text-gray-400">
                      {order.items.length} Item{order.items.length > 1 ? 's' : ''} • <span className="font-black text-secondary">LKR {order.totalAmount.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {/* STATUS DROPDOWN CONTROLLER */}
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition ${getStatusStyle(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 border border-border hover:border-secondary hover:text-secondary rounded-xl text-neutral-400 transition cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT VIEW PANEL: INVOICE SPECIFIC SHEET OVERVIEW */}
          <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 shadow-sm space-y-6 transition-colors">
            {selectedOrder ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-neutral-100 dark:border-border/40 pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white">Invoice Details</h3>
                    <p className="text-xs text-neutral-400 mt-1">ID: #{selectedOrder._id.toUpperCase()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* SHIPPING ADDR SHEET METRICS */}
                <div className="space-y-2 text-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Client Info</h4>
                  <p className="font-bold text-neutral-900 dark:text-white">{selectedOrder.shippingDetails.name}</p>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs">{selectedOrder.shippingDetails.phone} • {selectedOrder.shippingDetails.email}</p>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                    {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.district} District
                  </p>
                </div>

                {/* BASKET ITEMS RENDER */}
                <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-border/40">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">Systems Basket</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs gap-4 p-2 bg-neutral-50 dark:bg-background rounded-xl border border-border/40">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">{item.product?.name || 'Security Asset'}</p>
                        <p className="text-neutral-400 mt-0.5">Qty: {item.quantity} x LKR {item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-black text-neutral-800 dark:text-white">LKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* FINANCIAL STATEMENT CHECKS */}
                <div className="pt-4 border-t border-neutral-100 dark:border-border/40 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between text-neutral-400">
                    <span>Payment Method</span>
                    <span className="text-neutral-800 dark:text-white uppercase font-black">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-neutral-800 dark:text-white">LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Islandwide Courier Fee</span>
                    <span className="text-neutral-800 dark:text-white">LKR {selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 dark:border-border/40 flex justify-between text-sm font-black">
                    <span className="text-neutral-900 dark:text-white">Total Amount Due</span>
                    <span className="text-secondary">LKR {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400 dark:text-gray-600">
                <Clock className="mx-auto mb-3 opacity-60" size={32} />
                <p className="text-sm font-medium">Select an order row node from the left log grid to view comprehensive shipping paths and invoice item lists.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
