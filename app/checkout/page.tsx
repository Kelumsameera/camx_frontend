'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE;

type CartItem = {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BankTransfer'>('COD');
  const [errorMessage, setErrorMessage] = useState('');

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  // 1. Fetch data from Cart LocalStorage (With string protection validation)
  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const storedCart = localStorage.getItem('CAMX_CART');
        if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
          const parsed = JSON.parse(storedCart);
          setCartItems(parsed);
        }
        
        // SAFE USER CHECK: Prevents the "undefined is not valid JSON" parsing crash
        const storedUser = localStorage.getItem('CAMX_USER');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          const user = JSON.parse(storedUser);
          setName(user?.name || '');
          setEmail(user?.email || '');
          setPhone(user?.phone || '');
        }
      } catch (error) {
        console.error('Error initializing checkout data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutData();
  }, []);

  // 2. Summary Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 450 : 0;
  const total = subtotal + shipping;

  // 3. Handle Order Generation Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setOrderProcessing(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        shippingDetails: {
          name,
          phone,
          email,
          address,
          city,
          district,
        },
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'Pending'
      };

      const token = localStorage.getItem('CAMX_TOKEN');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`${API}/orders`, orderPayload, { headers });

      // Clean local storage cart references
      localStorage.removeItem('CAMX_CART');
      window.dispatchEvent(new Event('storage'));
      
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order submission error details:', error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || 'Failed to initialize order record. Please verify details.'
        );
      } else {
        setErrorMessage('An unexpected validation error occurred during compilation.');
      }
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-background text-neutral-900 dark:text-white pt-32 pb-24 px-6 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-md w-full text-center bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-3xl font-black">Order Placed!</h1>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-3 leading-relaxed">
            Thank you for choosing CAMX.lk. Your order request has been logged successfully. Our dispatch branch will contact you shortly to confirm the shipment profile.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full h-12 rounded-xl bg-secondary text-white font-bold mt-8 hover:bg-opacity-90 transition cursor-pointer shadow-md shadow-secondary/10"
          >
            Return to Homepage
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-background text-neutral-900 dark:text-white pt-28 pb-24 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* TOP PANEL NAVIGATION */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-gray-400 hover:text-secondary transition mb-4">
            <ArrowLeft size={16} />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Secure <span className="text-secondary">Checkout</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-8 text-center shadow-sm">
            <p className="text-neutral-500 dark:text-gray-400 font-medium">No order assets to checkout. Please fill your cart structure first.</p>
            <Link href="/products" className="mt-4 inline-block px-5 py-2.5 bg-secondary text-white font-bold text-sm rounded-xl">Browse Catalog</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-5 gap-8 items-start">
            
            {/* LEFT INPUT COLUMN BLOCK */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* SHIPPING DETAIL FORMS */}
              <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 border-b border-neutral-100 dark:border-border/40 pb-4">
                  <Truck size={20} className="text-secondary" />
                  <span>Shipping Address Details</span>
                </h2>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text" required placeholder="e.g. Sameera Perera" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary transition text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Phone Number *</label>
                    <input
                      type="tel" required placeholder="e.g. 0771234567" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Email Address *</label>
                    <input
                      type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary transition text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Delivery Street Address *</label>
                  <input
                    type="text" required placeholder="House No, Street Name" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary transition text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">City *</label>
                    <input
                      type="text" required placeholder="e.g. Bandaragama" value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">District *</label>
                    <select
                      value={district} onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white outline-none focus:border-secondary cursor-pointer transition text-sm"
                    >
                      {districts.map((d, index) => <option key={index} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* PAYMENT OPTION PICKER */}
              <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 border-b border-neutral-100 dark:border-border/40 pb-4">
                  <CreditCard size={20} className="text-secondary" />
                  <span>Choose Payment Route</span>
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <label className={`flex flex-col p-4 rounded-2xl border transition duration-200 cursor-pointer ${paymentMethod === 'COD' ? 'border-secondary bg-secondary/5' : 'border-neutral-200 dark:border-border'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-secondary focus:ring-secondary" />
                      <span className="font-bold text-sm">Cash On Delivery</span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-gray-400 mt-2">Pay manually at your doorstep upon courier handover.</span>
                  </label>

                  <label className={`flex flex-col p-4 rounded-2xl border transition duration-200 cursor-pointer ${paymentMethod === 'BankTransfer' ? 'border-secondary bg-secondary/5' : 'border-neutral-200 dark:border-border'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'BankTransfer'} onChange={() => setPaymentMethod('BankTransfer')} className="text-secondary focus:ring-secondary" />
                      <span className="font-bold text-sm">Direct Bank Transfer</span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-gray-400 mt-2">Wire transfer your invoice amount to our official corporate account.</span>
                  </label>
                </div>

                {paymentMethod === 'BankTransfer' && (
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border/60 text-xs text-neutral-600 dark:text-gray-400 space-y-1.5 leading-relaxed mt-2">
                    <p className="font-bold text-neutral-800 dark:text-white text-sm mb-1">Corporate Bank Coordinates:</p>
                    <p>Bank Name: Commercial Bank of Ceylon PLC</p>
                    <p>Account Title: CAMX Security Solutions (PVT) LTD</p>
                    <p>Account Number: 100023456789</p>
                    <p>Branch Code: Colombo Corporate Branch</p>
                    <p className="text-secondary font-semibold mt-1">Please email your transfer receipt copy to sales@camx.lk matching your order phone contact index reference.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN BREAKDOWN VIEW */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SHOPPING LIST ITEM RECAP */}
              <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 shadow-sm space-y-4 max-h-100 overflow-y-auto no-scrollbar">
                <h3 className="text-lg font-black border-b border-neutral-100 dark:border-border/40 pb-2">Order Basket</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-neutral-100 dark:bg-white rounded-xl overflow-hidden p-1 shrink-0 border border-neutral-200">
                          <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white line-clamp-1 max-w-37.5 sm:max-w-50">{item.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-neutral-800 dark:text-white text-right shrink-0">LKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL PRICING RECAP GRID */}
              <div className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-black border-b border-neutral-100 dark:border-border/40 pb-2">Checkout Totals</h3>
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between text-neutral-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 dark:text-white">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 dark:text-gray-400">
                    <span>Estimated Shipping</span>
                    <span className="text-neutral-900 dark:text-white">LKR {shipping.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-200 dark:border-border/60 flex justify-between text-base font-black">
                    <span className="text-neutral-900 dark:text-white">Final Due Amount</span>
                    <span className="text-secondary">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs rounded-xl p-3 font-semibold leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit" disabled={orderProcessing}
                  className="w-full h-12 rounded-xl bg-secondary text-white font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition disabled:opacity-50 cursor-pointer shadow-md shadow-secondary/10"
                >
                  {orderProcessing ? 'Confirming Dispatch Fields...' : `Place Order (LKR ${total.toLocaleString()})`}
                </button>
              </div>

            </div>
          </form>
        )}
      </div>
    </main>
  );
}
