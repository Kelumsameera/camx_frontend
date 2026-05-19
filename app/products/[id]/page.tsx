'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
  FaCheckCircle,
  FaShieldAlt,
  FaTruck,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaHeart,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { CgChevronRight } from 'react-icons/cg';

import ProductCard from '@/app/components/ProductCard';

const API = process.env.NEXT_PUBLIC_API_BASE;

type SpecItem = {
  title: string;
  value: string;
  image?: string;
};

type Product = {
  _id: string;
  productId?: string;
  name: string;
  description?: string;
  price?: number;
  labelPrice?: number;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
  model?: string;
  specifications?: {
    featureData?: string;
  };
};

type CartItem = {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
};

export default function ProductOverviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [parsedSpecs, setParsedSpecs] = useState<SpecItem[]>([]);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const productRes = await axios.get(`${API}/products/${id}`);
        const current = productRes.data;

        if (current) {
          setProduct(current);
          setSelectedImage(current.images?.[0] || '/placeholder.jpg');

          if (current.specifications?.featureData) {
            try {
              const parsed = JSON.parse(current.specifications.featureData);
              setParsedSpecs(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              console.error(e);
              setParsedSpecs([]);
            }
          }

          const relatedRes = await axios.get(`${API}/products`);
          const filtered = relatedRes.data.filter(
            (item: Product) =>
              item._id !== current._id && item.category === current.category
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  // ==========================================
  // ADD TO CART STORAGE HANDLER FUNCTION
  // ==========================================
  const handleAddToCart = () => {
    if (!product) return;

    try {
      // 1. Fetch current items from localStorage
      const storedCart = localStorage.getItem('CAMX_CART');
      const currentCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      // 2. Check if item already exists in cart structure
      const existingItemIndex = currentCart.findIndex((item) => item._id === product._id);

      if (existingItemIndex > -1) {
        // Increment quantity if product is present
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Append a clean new CartItem payload if not present
        const newItem: CartItem = {
          _id: product._id,
          productId: product.productId,
          name: product.name,
          price: product.price || 0,
          image: product.images?.[0] || '/placeholder.jpg',
          quantity: quantity,
          stock: product.stock,
        };
        currentCart.push(newItem);
      }

      // 3. Commit back to localStorage storage node
      localStorage.setItem('CAMX_CART', JSON.stringify(currentCart));

      // 4. Fire storage sync event so the Header icon badge reads live values
      window.dispatchEvent(new Event('storage'));

      // 5. Show visual layout success alert state
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    } catch (error) {
      console.error('Failed to commit cart update transaction:', error);
    }
  };

  const safeImage = (image?: string) => {
    if (image && !image.includes('example.com')) {
      return image;
    }
    return '/placeholder.jpg';
  };

  const currentPrice = Number(product?.price || 0);
  const oldPrice = Number(product?.labelPrice || 0);
  const hasDiscount = oldPrice > currentPrice;
  const discount = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="mt-6 text-neutral-900 dark:text-white text-xl font-bold">
            Loading Premium Product Experience...
          </h2>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-neutral-900 dark:text-white transition-colors duration-300">
        <h1 className="text-4xl font-black">Product Not Found</h1>
        <Link href="/products" className="mt-5 px-6 py-3 rounded-2xl bg-secondary text-white font-bold hover:bg-opacity-90 transition">
          Back To Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-secondary/5 dark:bg-secondary/10 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-blue-500/5 dark:bg-blue-500/10 blur-[160px]" />
      </div>

      <div className="w-full pt-28 pb-28">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-gray-400 mb-10 px-2">
            <Link href="/" className="hover:text-secondary">Home</Link>
            <CgChevronRight />
            <Link href="/products" className="hover:text-secondary">Products</Link>
            <CgChevronRight />
            <span className="text-neutral-800 dark:text-white font-semibold">{product.category}</span>
          </div>

          {/* MAIN PRODUCT VIEW */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* LEFT: IMAGES */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="px-2"
            >
              <div className="relative overflow-hidden rounded-4xl border border-neutral-200 dark:border-border bg-neutral-50 dark:bg-white/5 backdrop-blur-xl transition-colors">
                {hasDiscount && (
                  <div className="absolute top-5 right-5 z-20 bg-red-500 text-white px-4 py-2 rounded-2xl font-black shadow-2xl rotate-6">
                    SAVE {discount}%
                  </div>
                )}
                <div className="relative h-100 md:h-150 w-full group">
                  <Image
                    src={safeImage(selectedImage)}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-4 md:p-8 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3 mt-5 overflow-x-auto no-scrollbar">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border transition-all duration-300 shrink-0 ${
                      selectedImage === image
                        ? 'border-secondary scale-95 shadow-md'
                        : 'border-neutral-200 dark:border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={safeImage(image)} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: DETAILS */}
            <motion.div
              className="lg:sticky lg:top-24 h-fit px-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {product.brand && (
                <div className="inline-flex px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
                  {product.brand}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white mb-3">
                {product.name}
              </h1>

              {product.model && (
                <p className="text-sm text-neutral-500 dark:text-gray-400 mb-6">
                  Model Reference: <span className="text-neutral-800 dark:text-white font-medium">{product.model}</span>
                </p>
              )}

              {/* PRICE TRACK LAYER */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-card border border-neutral-200 dark:border-border mb-8 transition-colors">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl font-black text-secondary">
                    LKR {currentPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-neutral-400 dark:text-gray-500 line-through">
                      LKR {oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-border/60 flex items-center gap-3">
                  <FaCheckCircle className={product.stock && product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
                  <span className="text-sm font-medium text-neutral-700 dark:text-gray-300">
                    {product.stock && product.stock > 0 ? `${product.stock} Units Available in Stock` : 'Out of Stock / Available on Order'}
                  </span>
                </div>
              </div>

              {/* OVERVIEW */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">Overview</h3>
                  <p className="text-neutral-600 dark:text-gray-300 leading-relaxed text-base">{product.description}</p>
                </div>
              )}

              {/* QUANTITY AND INTERACTIVE ACTIVE ACTIONS TRIGGER */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center h-14 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition cursor-pointer"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-12 text-center font-bold text-neutral-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition cursor-pointer"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  {/* CONNECTED INTERACTIVE CART ACTION BUTTON TRIGGER */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 min-w-50 h-14 rounded-2xl bg-secondary text-white font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 hover:scale-[1.02] transition duration-300 shadow-xl shadow-secondary/10 cursor-pointer"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>

                  <button className="w-14 h-14 rounded-2xl border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-50 dark:hover:bg-white/5 transition duration-300 cursor-pointer">
                    <FaHeart size={18} />
                  </button>
                </div>

                {/* SUCCESS NOTIFICATION MINI BANNER */}
                {addedMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold p-4 rounded-xl flex items-center gap-2"
                  >
                    <span>✓</span> {quantity} x Item{quantity > 1 ? 's' : ''} added to your basket layout successfully!
                  </motion.div>
                )}
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-200 dark:border-border">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-secondary" size={20} />
                  <span className="text-xs font-semibold text-neutral-600 dark:text-gray-400">Official Company Warranty Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaTruck className="text-secondary" size={20} />
                  <span className="text-xs font-semibold text-neutral-600 dark:text-gray-400">Islandwide Secure Delivery</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FULL WIDTH SPECIFICATIONS PANEL */}
          {parsedSpecs.length > 0 && (
            <div className="mt-24 pt-16 border-t border-neutral-200 dark:border-border px-2">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white mb-8">
                Technical Specifications
              </h2>
              
              <div className="flex flex-col gap-10">
                {parsedSpecs.map((spec, i) => (
                  <div 
                    key={i} 
                    className="w-full flex flex-col rounded-3xl overflow-hidden bg-neutral-50 dark:bg-card border border-neutral-200 dark:border-border transition-all duration-300 shadow-sm"
                  >
                    {/* FULL WIDTH IMAGE SLOT */}
                    {spec.image && (
                      <div className="relative w-full h-100 sm:h-125 md:h-162.5 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-border overflow-hidden">
                        <Image
                          src={safeImage(spec.image)}
                          alt={spec.title || "Specification diagram"}
                          fill
                          priority
                          sizes="100vw"
                          className="object-contain p-2 sm:p-4 md:p-6"
                        />
                      </div>
                    )}

                    {/* CONTENT DETAILS SLOT */}
                    <div className="p-6 md:p-10 flex flex-col gap-4">
                      <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-secondary">
                        {spec.title}
                      </span>
                      <div className="text-sm md:text-lg text-neutral-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-medium">
                        {spec.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELATED RECOMMENDATIONS */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-neutral-200 dark:border-border px-2">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-black text-neutral-900 dark:text-white">Related Systems</h2>
                  <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">More choices in the {product.category} category</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
