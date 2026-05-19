'use client';

import axios from 'axios';

import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';

const API =
  process.env.NEXT_PUBLIC_API_BASE;

export default function ProductAddPage() {

  // =========================
  // STATES
  // =========================

  const [name, setName] =
    useState('');

  const [altName, setAltName] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [price, setPrice] =
    useState<number>(0);

  const [labelPrice, setLabelPrice] =
    useState<number>(0);

  const [files, setFiles] =
    useState<File[]>([]);

  const [category, setCategory] =
    useState('');

  const [brand, setBrand] =
    useState('');

  const [model, setModel] =
    useState('');

  const [stock, setStock] =
    useState<number>(0);

  const [isAvailable, setIsAvailable] =
    useState<boolean>(true);

  // SPECIFICATIONS
  const [resolution, setResolution] =
    useState('');

  const [connectivity, setConnectivity] =
    useState('');

  const [nightVision, setNightVision] =
    useState('');

  const [storage, setStorage] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    if (e.target.files) {

      setFiles(
        Array.from(e.target.files)
      );
    }
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setMessage('');

    try {

      // =========================
      // UPLOAD IMAGES
      // =========================

      const uploadedImages: string[] =
        [];

      for (const file of files) {

        const formData =
          new FormData();

        formData.append(
          'file',
          file
        );

        formData.append(
          'upload_preset',
          process.env
            .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
            ''
        );

        const cloudName =
          process.env
            .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        const uploadResponse =
          await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );

        uploadedImages.push(
          uploadResponse.data.secure_url
        );
      }

      // =========================
      // PRODUCT OBJECT
      // =========================

      const productData = {

        name,

        altName:
          altName
            .split(',')
            .map(
              (
                item
              ) =>
                item.trim()
            ),

        description,

        price,

        labelPrice,

        images: uploadedImages,

        category,

        brand,

        model,

        stock,

        isAvailable,

        specifications: {

          Resolution:
            resolution,

          Connectivity:
            connectivity,

          "Night Vision":
            nightVision,

          Storage:
            storage,
        },
      };

      console.log(
        productData
      );

      // =========================
      // SEND TO BACKEND
      // =========================

      await axios.post(
        `${API}/products`,
        productData,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem(
                'CAMX_TOKEN'
              )}`,
          },
        }
      );

      // SUCCESS
      setMessage(
        '✅ Product added successfully'
      );

      // RESET
      setName('');
      setAltName('');
      setDescription('');
      setPrice(0);
      setLabelPrice(0);
      setFiles([]);
      setCategory('');
      setBrand('');
      setModel('');
      setStock(0);
      setIsAvailable(true);

      setResolution('');
      setConnectivity('');
      setNightVision('');
      setStorage('');

    } catch (error) {

      console.log(error);

      setMessage(
        '❌ Failed to add product'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-20 px-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-black">

            Add

            <span className="text-cyan-400">
              {' '}Product
            </span>
          </h1>

          <p className="text-gray-400 mt-4">
            Add CCTV and security products
            to your CAMX store.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleAddProduct}
          className="bg-[#111827] border border-gray-800 rounded-3xl p-8 space-y-6"
        >

          {/* NAME */}
          <input
            type="text"
            required
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
          />

          {/* ALT NAME */}
          <input
            type="text"
            placeholder="Alternative Names"
            value={altName}
            onChange={(e) =>
              setAltName(
                e.target.value
              )
            }
            className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
          />

          {/* DESCRIPTION */}
          <textarea
            rows={6}
            required
            placeholder="Product Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full p-5 rounded-2xl bg-[#050816] border border-gray-700 resize-none"
          />

          {/* PRICE */}
          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="number"
              required
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />

            <input
              type="number"
              placeholder="Label Price"
              value={labelPrice}
              onChange={(e) =>
                setLabelPrice(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />
          </div>

          {/* CATEGORY */}
          <input
            type="text"
            required
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
          />

          {/* BRAND + MODEL */}
          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) =>
                setBrand(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />

            <input
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) =>
                setModel(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />
          </div>

          {/* SPECIFICATIONS */}
          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Resolution"
              value={resolution}
              onChange={(e) =>
                setResolution(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />

            <input
              type="text"
              placeholder="Connectivity"
              value={connectivity}
              onChange={(e) =>
                setConnectivity(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />

            <input
              type="text"
              placeholder="Night Vision"
              value={nightVision}
              onChange={(e) =>
                setNightVision(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />

            <input
              type="text"
              placeholder="Storage"
              value={storage}
              onChange={(e) =>
                setStorage(
                  e.target.value
                )
              }
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
            />
          </div>

          {/* STOCK */}
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) =>
              setStock(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700"
          />

          {/* FILES */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={
              handleFileChange
            }
            className="w-full bg-[#050816] border border-gray-700 rounded-2xl p-4"
          />

          {/* AVAILABLE */}
          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) =>
                setIsAvailable(
                  e.target.checked
                )
              }
              className="w-5 h-5 accent-cyan-400"
            />

            <label>
              Product Available
            </label>
          </div>

          {/* MESSAGE */}
          {message && (

            <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-2xl p-4">

              {message}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-cyan-400 text-black font-black text-lg hover:bg-cyan-300 transition"
          >

            {loading
              ? 'Adding Product...'
              : 'Add Product'}
          </button>
        </form>
      </div>
    </main>
  );
}