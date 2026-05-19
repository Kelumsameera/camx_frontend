'use client';

import axios from 'axios';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE;

type Specification = {
  title: string;
  value: string;
  image: string;
};

export default function ProductAddPage() {
  // =========================
  // STATES
  // =========================
  const [name, setName] = useState('');
  const [altName, setAltName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [labelPrice, setLabelPrice] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [isAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // =========================
  // SPECIFICATIONS STATE
  // =========================
  const [specifications, setSpecifications] = useState<Specification[]>([
    { title: '', value: '', image: '' },
  ]);

  // =========================
  // FILE CHANGE + PREVIEW
  // =========================
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // =========================
  // SPECIFICATION HANDLERS
  // =========================
  const addSpecification = () => {
    setSpecifications([...specifications, { title: '', value: '', image: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    setSpecifications((prevSpecs) =>
      prevSpecs.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  // =========================
  // UPLOAD SPEC IMAGE
  // =========================
  const uploadSpecImage = async (file: File, index: number) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      updateSpecification(index, 'image', response.data.secure_url);
    } catch (error) {
      console.error('Spec image upload error:', error);
      alert('Failed to upload specification image.');
    }
  };

  // =========================
  // ADD PRODUCT (SUBMIT)
  // =========================
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const uploadedImages: string[] = [];
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        uploadedImages.push(uploadResponse.data.secure_url);
      }

      const productData = {
        name,
        altName: altName ? altName.split(',').map((item) => item.trim()) : [],
        description,
        price,
        labelPrice: labelPrice || price,
        images: uploadedImages,
        category,
        brand,
        model,
        stock,
        isAvailable,
        specifications: {
          featureData: JSON.stringify(specifications.filter(s => s.title || s.value)),
        },
      };

      await axios.post(`${API}/products`, productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('CAMX_TOKEN')}`,
        },
      });

      setMessage('✅ Product added successfully!');

      setName('');
      setAltName('');
      setDescription('');
      setPrice(0);
      setLabelPrice(0);
      setFiles([]);
      setImagePreviews([]);
      setCategory('');
      setBrand('');
      setModel('');
      setStock(0);
      setSpecifications([{ title: '', value: '', image: '' }]);
    } catch (error) {
      console.error('Product add failed:', error);
      setMessage('❌ Failed to add product. Please check backend or token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-12 max-w-4xl mx-auto w-full transition-colors duration-300">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
          Add <span className="text-secondary">Product</span>
        </h1>
        <p className="text-neutral-500 dark:text-gray-400 mt-2 text-sm">
          Add CCTV and security products to CAMX.lk store database.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleAddProduct} className="bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors duration-300">
        
        {/* NAME */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. EZVIZ H8c 2K Smart Camera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
          />
        </div>

        {/* ALT NAME */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Alternative Names (Comma Separated)</label>
          <input
            type="text"
            placeholder="CCTV, wifi camera, ezviz smart"
            value={altName}
            onChange={(e) => setAltName(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Product Description *</label>
          <textarea
            rows={5}
            required
            placeholder="Enter comprehensive product features, warranty information..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 resize-none outline-none focus:border-secondary transition"
          />
        </div>

        {/* PRICES */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Selling Price (LKR) *</label>
            <input
              type="number"
              required
              placeholder="32500"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Original Label Price (LKR)</label>
            <input
              type="number"
              placeholder="35000"
              value={labelPrice || ''}
              onChange={(e) => setLabelPrice(Number(e.target.value))}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
        </div>

        {/* INVENTORY TRACK SHEET */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Category *</label>
            <input
              type="text"
              required
              placeholder="e.g. Wi-Fi Cameras"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. EZVIZ"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Model Reference</label>
            <input
              type="text"
              placeholder="e.g. CS-H8c"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Initial Stock Units *</label>
            <input
              type="number"
              required
              placeholder="12"
              value={stock || ''}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full h-14 px-5 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition"
            />
          </div>
        </div>

        {/* MAIN IMAGES UPLOAD BUTTON */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">Product Store Images *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-neutral-100 file:dark:bg-background file:text-neutral-700 file:dark:text-white hover:file:bg-opacity-80 file:cursor-pointer"
          />
          {/* PREVIEWS CONTAINER GRID */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-border">
                  <Image src={url} alt="product preview" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TECHNICAL SPECIFICATIONS INJECT PANEL */}
        <div className="pt-6 border-t border-neutral-200 dark:border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Technical Specifications Sheet</h3>
            <button
              type="button"
              onClick={addSpecification}
              className="px-4 py-2 text-xs font-bold bg-secondary text-white rounded-xl hover:bg-opacity-90 transition cursor-pointer"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-4">
            {specifications.map((spec, index) => (
              <div key={index} className="p-4 rounded-2xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border space-y-3 relative">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Specification Title (e.g., Resolution)"
                    value={spec.title}
                    onChange={(e) => updateSpecification(index, 'title', e.target.value)}
                    className="h-11 px-4 rounded-xl bg-white dark:bg-card border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none text-sm focus:border-secondary transition"
                  />
                  <input
                    type="text"
                    placeholder="Specification Value (e.g., 2K / 4MP)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="h-11 px-4 rounded-xl bg-white dark:bg-card border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none text-sm focus:border-secondary transition"
                  />
                </div>

                {/* SINGLE SPEC DIAGRAM IMAGE CHOOSE FLUID */}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadSpecImage(e.target.files[0], index)}
                    className="block text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:dark:bg-card file:border-neutral-200 file:dark:border-border file:text-neutral-700 file:dark:text-white file:cursor-pointer"
                  />
                  {spec.image && (
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1">✓ Diagram Uploaded</span>
                  )}
                </div>

                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-opacity-80 transition cursor-pointer text-sm font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COMPREHENSIVE STATUS NOTIFICATION ERROR */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-semibold border ${
            message.includes('✅') 
              ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* SUBMIT PROGRESS CONSOLE */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-secondary text-white font-bold text-lg hover:bg-opacity-90 shadow-md shadow-secondary/10 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Processing Database Actions...' : 'Save Product Asset'}
        </button>

      </form>
    </div>
  );
}
