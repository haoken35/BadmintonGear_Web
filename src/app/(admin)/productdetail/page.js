"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getProductById, updateProduct, deleteImage, uploadImage } from '@/service/productService';
import { getAllCategories } from '@/service/categoryService';

export default function ProductDetail() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [mode, setMode] = useState(searchParams.get('mode') || 'view');
    const [isDragging, setIsDragging] = useState(false);
    
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("0");

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files); 
        const newPreviews = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ url: reader.result });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newPreviews).then((results) => {
            setImagePreviews((prev) => [...prev, ...results]);
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files); 
        const newPreviews = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ url: reader.result });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newPreviews).then((results) => {
            setImagePreviews((prev) => [...prev, ...results]); 
        });
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (file, id) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('productid', id);
        try {
            await uploadImage(formData);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    }

    const handleSaveProduct = async () => {
        const updatedProduct = {
            id: productId,
            name,
            description,
            brand,
            price,
            quantity,
            categoriesid: selectedCategory,
        };

        if (imagePreviews !== product.ImagesProducts) {
            const removedImages = (product.ImagesProducts || []).filter(
                img => !imagePreviews.some(preview => preview.url === img.url)
            );
            for (const img of removedImages) {
                await deleteImage(img.id);
            }
            const newImages = imagePreviews.filter(
                preview =>
                    !(product.ImagesProducts || []).some(img => img.url === preview.url)
            );
            for (const img of newImages) {
                const file = await fetch(img.url).then(res => res.blob());
                await handleUpload(file, productId);
            }
        }
        const response = await updateProduct(productId, updatedProduct);
        setProduct(response);
        setMode('view');
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(productId);
                setProduct(productData);
                setImagePreviews(productData.Imagesproducts || []);
                setName(productData.name || '');
                setDescription(productData.description || '');
                setBrand(productData.brand || '');
                setPrice(productData.price || '');
                setQuantity(productData.quantity || '');
                setSelectedCategory(productData.categoriesid || "0");
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories();
                setCategory(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [productId]);

    if (!product || !product.id) {
        return <div>Loading...</div>;
    }

    return (
        
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Product Details</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#ff8200]" href="/productlist">Product List</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/addproduct">Product Details</a>
                    </div>

                </div>
                {mode === 'view' && (
                    <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center disabled:opacity-65'
                        onClick={() => setMode('edit')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.3047 6.81991C18.281 5.8436 18.281 4.26069 17.3047 3.28438L16.7155 2.69512C15.7391 1.71881 14.1562 1.71881 13.1799 2.69512L3.69097 12.1841C3.34624 12.5288 3.10982 12.9668 3.01082 13.4442L2.34111 16.6735C2.21932 17.2607 2.73906 17.7805 3.32629 17.6587L6.55565 16.989C7.03302 16.89 7.47103 16.6536 7.81577 16.3089L17.3047 6.81991ZM16.1262 4.46289L15.5369 3.87363C15.2115 3.5482 14.6839 3.5482 14.3584 3.87363L13.4745 4.75755L15.2423 6.52531L16.1262 5.6414C16.4516 5.31596 16.4516 4.78833 16.1262 4.46289ZM14.0638 7.70382L12.296 5.93606L4.86948 13.3626C4.75457 13.4775 4.67577 13.6235 4.64277 13.7826L4.23082 15.769L6.21721 15.3571C6.37634 15.3241 6.52234 15.2453 6.63726 15.1303L14.0638 7.70382Z" fill="#ffffff" />
                        </svg>
                        Edit Product
                    </button>
                )}
                {mode === 'edit' && (
                    <div className='flex gap-3'>
                        <button className='border border-[#858D9D] text-[#858D9D] px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={() => setMode('view')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1728 13.9941C15.4982 14.3195 15.4982 14.8472 15.1728 15.1726C14.8473 15.498 14.3197 15.498 13.9942 15.1726L10.0002 11.1786L6.00626 15.1726C5.68082 15.4981 5.15318 15.4981 4.82774 15.1726C4.5023 14.8472 4.5023 14.3195 4.82773 13.9941L8.82167 10.0001L4.82758 6.00607C4.50214 5.68064 4.50214 5.15301 4.82758 4.82757C5.15302 4.50214 5.68066 4.50214 6.0061 4.82757L10.0002 8.82158L13.9941 4.82759C14.3195 4.50215 14.8472 4.50214 15.1726 4.82758C15.498 5.15301 15.4981 5.68065 15.1726 6.00609L11.1787 10.0001L15.1728 13.9941Z" fill="#858D9D" />
                            </svg>
                            Cancel</button>
                        <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center disabled:opacity-65'
                            disabled={
                                name === product.name &&
                                description === product.description &&
                                brand === product.brand &&
                                price === product.price &&
                                quantity === product.quantity &&
                                selectedCategory === product.categoriesid &&
                                imagePreviews === product.ImagesProducts
                            }
                            onClick={handleSaveProduct}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5 2.5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V7.47072C17.5 6.80768 17.2366 6.17179 16.7678 5.70295L14.297 3.23223C13.8282 2.76339 13.1923 2.5 12.5293 2.5H5ZM12.5293 4.16667H12.5V5.83333C12.5 6.75381 11.7538 7.5 10.8333 7.5H7.5C6.57953 7.5 5.83333 6.75381 5.83333 5.83333V4.16667H5C4.53976 4.16667 4.16667 4.53976 4.16667 5V15C4.16667 15.4602 4.53976 15.8333 5 15.8333H5.83333V10.8333C5.83333 9.91286 6.57953 9.16667 7.5 9.16667H12.5C13.4205 9.16667 14.1667 9.91286 14.1667 10.8333V15.8333H15C15.4602 15.8333 15.8333 15.4602 15.8333 15V7.47072C15.8333 7.24971 15.7455 7.03774 15.5893 6.88146L13.1185 4.41074C12.9623 4.25446 12.7503 4.16667 12.5293 4.16667ZM12.5 15.8333V10.8333H7.5V15.8333H12.5ZM7.5 4.16667H10.8333V5.83333H7.5V4.16667Z" fill="white" />
                            </svg>
                            Save Product
                        </button>
                    </div>
                )}
            </div>
            <div className='mt-5 flex justify-between '>
                <div className='w-2/3 '>
                    <div className='bg-white shadow-md rounded-lg p-5'>
                        <h2 className='text-xl font-semibold'>General Information</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Product Name</label>
                            <input
                                type="text"
                                className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                placeholder='Type product name here...'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Description</label>
                            <textarea
                                className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 resize-none  outline-none'
                                placeholder='Type product description here...' rows="6"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Product Brand</label>
                            <input
                                type="text"
                                className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                placeholder='Type product brand here...'
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                disabled={mode === 'view'}
                            />
                        </div>
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-5 mt-5'>
                        <h2 className='text-xl font-semibold'>Photo</h2>
                        <div
                            className={`flex flex-col gap-3 justify-center items-center py-4 bg-[#F9F9FC] rounded-md border border-dashed border-[#E0E2E7]
                                    ${isDragging ? "border-dashed border-[#ff8200]" : "border-[#E0E2E7]"
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragLeave={() => setIsDragging(false)}
                        >   
                            {imagePreviews.length === 0 && (<div className='rounded-full p-2 bg-[#FBE3CA] border-3 border-[#EFEFFD] w-fit'>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.3335 12.2502C10.3 12.2502 11.0835 11.4667 11.0835 10.5002C11.0835 9.53366 10.3 8.75016 9.3335 8.75016C8.367 8.75016 7.5835 9.53366 7.5835 10.5002C7.5835 11.4667 8.367 12.2502 9.3335 12.2502Z" fill="#FF8200" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.7085 3.2085C4.7755 3.2085 3.2085 4.7755 3.2085 6.7085V21.2918C3.2085 23.2248 4.7755 24.7918 6.7085 24.7918H21.2918C23.2248 24.7918 24.7918 23.2248 24.7918 21.2918V6.7085C24.7918 4.7755 23.2248 3.2085 21.2918 3.2085H6.7085ZM21.2918 5.54183H6.7085C6.06416 5.54183 5.54183 6.06416 5.54183 6.7085V15.7713L8.45706 13.9773C8.65107 13.858 8.89682 13.8624 9.08636 13.9888L12.1977 16.063L17.1421 12.2174C17.3527 12.0535 17.6477 12.0535 17.8583 12.2174L22.4585 15.7953V6.7085C22.4585 6.06416 21.9362 5.54183 21.2918 5.54183ZM5.54183 21.2918V18.5111L8.72502 16.5522L12.3027 18.9373L17.5002 14.8948L22.4585 18.7513V21.2918C22.4585 21.9362 21.9362 22.4585 21.2918 22.4585H6.7085C6.06416 22.4585 5.54183 21.9362 5.54183 21.2918Z" fill="#FF8200" />
                                </svg>
                            </div>)}
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={preview.url || "/images/placeholder.png"}
                                            alt={`Preview ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="object-contain rounded-md border border-[#E0E2E7]"
                                        />
                                        {mode === 'edit' && (
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                ✕
                                            </button>)}
                                    </div>
                                ))}
                            </div>

                            {mode === 'edit' && (
                                <div className='flex flex-col items-center mt-4 gap-5 mb-5'>
                                    <label className='text-md font-medium ml-2 text-[#858D9D]'>Drag and drop image here, or click add image</label>
                                    <div>
                                        <label htmlFor='upload-image' className='text-[#ff8200] bg-[#FBE3CA] rounded-lg px-4 py-2'>Add Image</label>
                                        <input
                                            id='upload-image'
                                            onChange={handleImageUpload}
                                            type="file"
                                            accept="image/*"
                                            className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 mt-2 hidden'
                                            multiple
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-5 mt-5'>
                        <h2 className='text-xl font-semibold'>Pricing</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Base Price</label>
                            <div className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 flex items-center gap-2'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V19.7465C15.5014 19.651 17.5 17.593 17.5 15.0682C17.5 12.8214 15.6786 11 13.4318 11H13V6.27392C13.797 6.37092 14.5238 6.75823 15.0475 7.34945C15.4137 7.76288 15.9953 8.00555 16.5 7.78125C17.0047 7.55695 17.2392 6.95834 16.9237 6.50507C16.0259 5.21544 14.5875 4.38385 13 4.26478V4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4V4.25347C8.49857 4.34898 6.5 6.40701 6.5 8.93182C6.5 11.1786 8.32139 13 10.5682 13H11V17.7261C10.203 17.6291 9.4762 17.2418 8.95253 16.6505C8.58633 16.2371 8.00468 15.9944 7.5 16.2188C6.99532 16.4431 6.76079 17.0417 7.07633 17.4949C7.97411 18.7846 9.41252 19.6161 11 19.7352V20ZM13 17.7439C14.3963 17.6505 15.5 16.4882 15.5 15.0682C15.5 13.926 14.574 13 13.4318 13H13V17.7439ZM11 11V6.25607C9.60366 6.34955 8.5 7.5118 8.5 8.93182C8.5 10.074 9.42596 11 10.5682 11H11Z" fill="#667085" />
                                </svg>
                                <input
                                    type="number"
                                    className='w-full outline-none'
                                    placeholder='Type product base price here...'
                                    step={1000}
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    min={0}
                                    disabled={mode === 'view'}
                                />
                            </div>
                        </div>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Discount Precentage (%)</label>
                            <input
                                type="number"
                                className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                placeholder='Type discount precentage. . .'
                                value={product.discount || 0}
                                min={0}
                                disabled={mode === 'view'}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-5 mt-5'>
                        <h2 className='text-xl font-semibold'>Inventory</h2>
                        <div className='mt-2 justify-between flex'>
                            <div className=' gap-1 w-full'>
                                <label className='text-sm font-medium ml-2'>Quantity</label>
                                <input
                                    type="number"
                                    className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                    placeholder='Type product quantity here. . .'
                                    value={quantity}
                                    min={0}
                                    onChange={e => setQuantity(e.target.value)}
                                    disabled={mode === 'view'}
                                />
                            </div>
                        </div>

                    
                            <div className='gap-1 w-1/5'>
                                <label className='text-sm font-medium ml-2'>Weight</label>
                                <input
                                    type="text"
                                    className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 outline-none'
                                    placeholder='Product weight (g). . .'
                                    // value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className=' gap-1 w-1/5'>
                                <label className='text-sm font-medium ml-2'>Height</label>
                                <input
                                    type="text"
                                    className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 outline-none'
                                    placeholder='Height (cm). . .'
                                    // value={height}
                                    onChange={e => setHeight(e.target.value)}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className='gap-1 w-1/5'>
                                <label className='text-sm font-medium ml-2'>Length</label>
                                <input
                                    type="text"
                                    className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                    placeholder='Length (cm). . .'
                                    value={length}
                                    onChange={e => setLength(e.target.value)}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className=' gap-1 w-1/5'>
                                <label className='text-sm font-medium ml-2'>Width</label>
                                <input
                                    type="text"
                                    className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 outline-none'
                                    placeholder='Width (cm). . .'
                                    // value={width}
                                    onChange={e => setWidth(e.target.value)}
                                    disabled={mode === 'view'}
                                />
                            </div>
                    </div>
                </div>
                <div className='w-4/15'>
                    <div className='bg-white shadow-md rounded-lg p-5 w-full'>
                        <h2 className='text-xl font-semibold'>Category</h2>
                        <div className=' gap-1 mt-2'>
                            <label className='text-sm font-medium ml-2'>Product Category</label>
                            <select
                                className='w-full border border-[#E0E2E7] bg-[#F9F9FC] rounded-md px-4 py-2 outline-none '
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                disabled={mode === 'view'}
                            >
                                <option value="0" disabled>Select Category</option>
                                {category.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </select>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}