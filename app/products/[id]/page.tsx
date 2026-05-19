'use client';

import axios from 'axios';

import Image from 'next/image';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaTruck,
} from 'react-icons/fa';

import {
  CgChevronRight,
} from 'react-icons/cg';

import {
  CiSquareChevLeft,
  CiSquareChevRight,
} from 'react-icons/ci';

const API =
  process.env
    .NEXT_PUBLIC_API_BASE;

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
};

export default function ProductOverviewPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const id =
    params?.id as string;

  // =========================
  // STATES
  // =========================

  const [product,
    setProduct] =
    useState<Product | null>(
      null
    );

  const [selectedImage,
    setSelectedImage] =
    useState('');

  const [quantity,
    setQuantity] =
    useState(1);

  const [loading,
    setLoading] =
    useState(true);

  const [relatedProducts,
    setRelatedProducts] =
    useState<Product[]>([]);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    async function loadData() {

      try {

        // PRODUCT
        const productRes =
          await axios.get(
            `${API}/products/${id}`
          );

        const current =
          productRes.data;

        setProduct(current);

        setSelectedImage(
          current.images?.[0] ||
            '/placeholder.jpg'
        );

        // RELATED PRODUCTS
        const allProducts =
          await axios.get(
            `${API}/products`
          );

        const filtered =
          allProducts.data.filter(
            (
              item: Product
            ) =>
              item._id !==
              current._id
          );

        setRelatedProducts(
          filtered.slice(0, 4)
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    if (id) {

      loadData();
    }

  }, [id]);

  // =========================
  // SAFE IMAGE
  // =========================

  const safeImage = (
    image?: string
  ) => {

    if (
      image &&
      !image.includes(
        'example.com'
      )
    ) {

      return image;
    }

    return '/placeholder.jpg';
  };

  // =========================
  // PRICE
  // =========================

  const currentPrice =
    Number(
      product?.price || 0
    );

  const oldPrice =
    Number(
      product?.labelPrice || 0
    );

  const hasDiscount =
    oldPrice >
    currentPrice;

  const discount =
    hasDiscount
      ? Math.round(
          (
            (
              oldPrice -
              currentPrice
            ) /
            oldPrice
          ) * 100
        )
      : 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">

        <h1 className="text-4xl font-black text-gray-900">

          Loading...
        </h1>
      </main>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {

    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">

        <h1 className="text-4xl font-black text-gray-900">

          Product Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] pt-28 pb-20">

      <div className="max-w-7xl mx-auto px-4">

        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-2 gap-16">

          {/* LEFT */}
          <div>

            {/* MAIN IMAGE */}
            <div className="relative h-150 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">

              <Image
                src={safeImage(
                  selectedImage
                )}
                alt={
                  product.name ||
                  'product'
                }
                fill
                sizes="800px"
                className="object-contain"
                priority
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-4 mt-5 overflow-x-auto pb-2">

              {product.images?.map(
                (
                  image,
                  index
                ) => (

                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                    className={`relative min-w-25 h-25 rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage ===
                      image
                        ? 'border-cyan-500'
                        : 'border-gray-200'
                    }`}
                  >

                    <Image
                      src={safeImage(
                        image
                      )}
                      alt="thumb"
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>

            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

              <Link
                href="/"
                className="hover:text-cyan-600"
              >
                Home
              </Link>

              <CgChevronRight />

              <Link
                href="/products"
                className="hover:text-cyan-600"
              >
                Products
              </Link>

              <CgChevronRight />

              <span>
                {
                  product.category
                }
              </span>
            </div>

            {/* BRAND */}
            {product.brand && (

              <p className="text-cyan-600 font-bold uppercase tracking-widest text-sm mb-3">

                {product.brand}
              </p>
            )}

            {/* TITLE */}
            <h1 className="text-5xl font-black text-gray-900 leading-tight">

              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-4 mt-6">

              <div className="flex items-center gap-1">

                {[...Array(5)].map(
                  (
                    _,
                    i
                  ) => (

                    <FaStar
                      key={i}
                      size={18}
                      color={
                        i < 4
                          ? '#f59e0b'
                          : '#d1d5db'
                      }
                    />
                  )
                )}
              </div>

              <span className="font-semibold text-gray-700">

                4.8
              </span>

              <span className="text-gray-500">

                (24 reviews)
              </span>
            </div>

            {/* STOCK */}
            <div className="mt-6">

              {Number(
                product.stock || 0
              ) > 0 ? (

                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">

                  <FaCheckCircle />

                  In Stock
                </div>

              ) : (

                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">

                  Out of Stock
                </div>
              )}
            </div>

            {/* PRICE */}
            <div className="bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-3xl p-6 mt-8">

              {hasDiscount && (

                <div className="flex items-center gap-4 mb-4">

                  <span className="text-2xl text-gray-400 line-through font-semibold">

                    LKR{' '}
                    {oldPrice.toLocaleString()}
                  </span>

                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-black">

                    SAVE {discount}%
                  </span>
                </div>
              )}

              <h2 className="text-6xl font-black text-cyan-600">

                LKR{' '}
                {currentPrice.toLocaleString()}
              </h2>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">

                <FaShieldAlt className="text-cyan-600 text-3xl" />

                <div>
                  <h3 className="font-bold text-gray-900">
                    Warranty
                  </h3>

                  <p className="text-sm text-gray-500">
                    Genuine Product
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">

                <FaTruck className="text-cyan-600 text-3xl" />

                <div>
                  <h3 className="font-bold text-gray-900">
                    Delivery
                  </h3>

                  <p className="text-sm text-gray-500">
                    Islandwide Shipping
                  </p>
                </div>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-8 shadow-sm">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold text-gray-900">

                  Quantity
                </h3>

                <div className="flex items-center gap-5">

                  <button
                    onClick={() =>
                      setQuantity(
                        (
                          q
                        ) =>
                          Math.max(
                            1,
                            q - 1
                          )
                      )
                    }
                    className="text-5xl text-gray-500 hover:text-black transition"
                  >

                    <CiSquareChevLeft />
                  </button>

                  <span className="text-3xl font-black text-gray-900">

                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(
                        (
                          q
                        ) =>
                          Math.min(
                            Number(
                              product.stock || 1
                            ),
                            q + 1
                          )
                      )
                    }
                    className="text-5xl text-gray-500 hover:text-black transition"
                  >

                    <CiSquareChevRight />
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-5 mt-8">

              <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg shadow-cyan-500/20">

                Add To Cart
              </button>

              <button
                onClick={() =>
                  router.push(
                    '/checkout'
                  )
                }
                className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white py-5 rounded-2xl font-black text-lg transition-all duration-300"
              >

                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-8">

          <h2 className="text-4xl font-black text-gray-900 mb-8">

            Product Description
          </h2>

          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">

            {product.description}
          </p>
        </div>

        {/* SPECIFICATIONS */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-8">

          <h2 className="text-4xl font-black text-gray-900 mb-8">

            Specifications
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <tbody>

                <tr className="border-b border-gray-200">
                  <td className="py-5 font-bold text-gray-900">
                    Brand
                  </td>

                  <td className="py-5 text-gray-600">
                    {product.brand}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-5 font-bold text-gray-900">
                    Category
                  </td>

                  <td className="py-5 text-gray-600">
                    {product.category}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-5 font-bold text-gray-900">
                    Model
                  </td>

                  <td className="py-5 text-gray-600">
                    {product.model || 'N/A'}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-5 font-bold text-gray-900">
                    Stock
                  </td>

                  <td className="py-5 text-gray-600">
                    {product.stock}
                  </td>
                </tr>

                <tr>
                  <td className="py-5 font-bold text-gray-900">
                    Connectivity
                  </td>

                  <td className="py-5 text-gray-600">
                    WiFi
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-8">

          <h2 className="text-4xl font-black text-gray-900 mb-8">

            Frequently Asked Questions
          </h2>

          <div className="space-y-8">

            <div>

              <h3 className="text-xl font-bold text-gray-900">

                Does this support mobile viewing?
              </h3>

              <p className="text-gray-600 mt-2">
                Yes. You can monitor remotely using the mobile application.
              </p>
            </div>

            <div>

              <h3 className="text-xl font-bold text-gray-900">

                Does it support night vision?
              </h3>

              <p className="text-gray-600 mt-2">
                Yes. This camera supports smart infrared night vision.
              </p>
            </div>

            <div>

              <h3 className="text-xl font-bold text-gray-900">

                Is installation available?
              </h3>

              <p className="text-gray-600 mt-2">
                Yes. Islandwide installation services are available.
              </p>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">

          <h2 className="text-4xl font-black text-gray-900 mb-10">

            Related Products
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {relatedProducts.map(
              (
                item
              ) => (

                <Link
                  key={item._id}
                  href={`/products/${
                    item.productId ||
                    item._id
                  }`}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition"
                >

                  <div className="relative h-65">

                    <Image
                      src={safeImage(
                        item.images?.[0]
                      )}
                      alt={
                        item.name
                      }
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">

                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-15">

                      {item.name}
                    </h3>

                    <p className="text-cyan-600 text-2xl font-black mt-4">

                      LKR{' '}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}