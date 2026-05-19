'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Shield, ShieldAlert, Search, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE;

type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1. Fetch data from backend inside layout passes safely
  useEffect(() => {
    const fetchCustomersOnMount = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('CAMX_TOKEN');
        const response = await axios.get(`${API}/users/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load registered customer matrix.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersOnMount();
  }, []);

  const handleManualRefresh = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('CAMX_TOKEN');
      const response = await axios.get(`${API}/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(Array.isArray(response.data) ? response.data : []);
      toast.success('Customer directory refreshed.');
    } catch (error) {
      console.error('Error manual refresh customer list:', error);
      toast.error('Failed to reload registered customer matrix.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Modify individual client account access parameters
  const handleToggleBlock = async (email: string, currentBlockStatus: boolean) => {
    setUpdatingId(email);
    const nextStatus = !currentBlockStatus;
    
    try {
      const token = localStorage.getItem('CAMX_TOKEN');
      await axios.put(
        `${API}/users/status/${email}`,
        { isBlocked: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(nextStatus ? 'Customer has been blocked' : 'Customer account unblocked');
      setCustomers(prev => prev.map(c => c.email === email ? { ...c, isBlocked: nextStatus } : c));
    } catch (error) {
      console.error('Error updating status:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to toggle status.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // 3. Search parameters validation node filtering
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const matchesName = fullName.includes(search.toLowerCase());
    const matchesEmail = customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesName || matchesEmail;
  });

  return (
    <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto w-full transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Customer <span className="text-secondary">Directory</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">
            Monitor registered platform users, audit profile parameters, and manage access restrictions.
          </p>
        </div>
        <button 
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border border-border bg-white dark:bg-card rounded-xl hover:bg-neutral-50 dark:hover:bg-background transition cursor-pointer text-neutral-800 dark:text-white shrink-0 self-start sm:self-center"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* SEARCH CONTAINER INPUT BAR */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email account..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-card border border-neutral-200 dark:border-border text-neutral-900 dark:text-white text-sm placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
        />
      </div>

      {/* RENDER CONDITIONS MAP LAYOUT PANELS */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-100 dark:bg-card border border-neutral-200 dark:border-border rounded-2xl" />
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-card border border-border rounded-3xl p-8">
          <Users size={48} className="text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">No customers found</h2>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">No registered client matches your current filter parameter node.</p>
        </div>
      ) : (
        /* CUSTOMERS GRID CONTAINER MAP VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.map((customer) => {
            const isTargetAdmin = customer.role === 'admin';
            return (
              <div 
                key={customer._id}
                className={`p-5 rounded-2xl border bg-white dark:bg-card flex flex-col justify-between gap-4 shadow-sm transition-all duration-300 ${customer.isBlocked ? 'border-red-500/30 bg-red-500/1' : 'border-neutral-200 dark:border-border'}`}
              >
                {/* PROFILE BASIC BLOCK */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-lg ${isTargetAdmin ? 'bg-amber-500/10 text-amber-500' : customer.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-secondary/10 text-secondary'}`}>
                    {(customer.firstName || 'C').charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-900 dark:text-white text-base truncate max-w-40 sm:max-w-none">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      {isTargetAdmin && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Admin</span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-neutral-500 dark:text-gray-400 font-medium">
                      <p className="flex items-center gap-1.5 truncate"><Mail size={12} /> {customer.email}</p>
                      {customer.phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {customer.phone}</p>}
                      <p className="flex items-center gap-1.5 text-neutral-400 dark:text-gray-500"><Calendar size={12} /> Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* ACCESS CONTROLLER BOTTOM ROW */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-border/40 mt-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${customer.isBlocked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                    {customer.isBlocked ? 'Account Restricted' : 'Active Status'}
                  </span>

                  {!isTargetAdmin && (
                    <button
                      disabled={updatingId === customer.email}
                      onClick={() => handleToggleBlock(customer.email, customer.isBlocked)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold border rounded-xl transition cursor-pointer disabled:opacity-40 ${customer.isBlocked ? 'bg-green-500 text-white border-green-500 hover:bg-opacity-90' : 'bg-white dark:bg-background border-border text-red-500 hover:bg-red-500/10'}`}
                    >
                      {customer.isBlocked ? (
                        <>
                          <Shield size={12} />
                          <span>Unblock Access</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={12} />
                          <span>Restrict User</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
