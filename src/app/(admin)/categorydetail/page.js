"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getCategoryById, updateCategory } from '@/service/categoryService'

export default function CategoryDetail() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('id'); // Lấy param 'id' từ URL
    const [mode, setMode] = useState(searchParams.get('mode') || 'view'); // Mặc định là 'add' nếu không có mode
    const [category, setCategory] = useState(null);
    const [updatedCategory, setupdatedCategory] = useState(null);

    const handleInputChange = () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        setupdatedCategory({
            ...updatedCategory,
            name: name,
            description: description
        });
    }

    const handleCancel = () => {
        document.getElementById('name').value = category.name;
        document.getElementById('description').value = category.description;
        setupdatedCategory(null);
        setMode('view');
    }

    const handleSave = async () => {
        try {
            const response = await updateCategory(categoryId, updatedCategory);
            setCategory(response);
            setupdatedCategory(null);
            setMode('view');
        } catch (error) {
            alert('Error updating category');
            console.error('Error updating category:', error);
        }
    }

    const fetchCategory = async () => {
        try {
            const data = await getCategoryById(categoryId);
            setCategory(data);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [])
    // const [isDragging, setIsDragging] = useState(false);
    // const [imagePreview, setImagePreview] = useState(category.image); // Lưu URL của ảnh vào state

    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setImagePreview(reader.result); // Lưu URL của ảnh vào state
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const handleDragOver = (event) => {
    //     event.preventDefault();
    //     setIsDragging(true); // Hiển thị trạng thái kéo
    // };

    // const handleDragLeave = () => {
    //     setIsDragging(false); // Ẩn trạng thái kéo
    // };
    // const handleDrop = (event) => {
    //     event.preventDefault();
    //     setIsDragging(false); // Ẩn trạng thái kéo
    //     const file = event.dataTransfer.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setImagePreview(reader.result); // Lưu URL của ảnh vào state
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const removeImage = () => {
    //     setImagePreview(null); // Xóa ảnh theo chỉ số
    // };

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Add Details</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#ff8200]" href="/productcategory">Product Category</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/categorydetail">Category Details</a>
                    </div>
                </div>
                {mode === 'view' && (
                    <div>
                        <button className={`bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center cursor-pointer`}
                            onClick={() => setMode('edit')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.3047 6.81991C18.281 5.8436 18.281 4.26069 17.3047 3.28438L16.7155 2.69512C15.7391 1.71881 14.1562 1.71881 13.1799 2.69512L3.69097 12.1841C3.34624 12.5288 3.10982 12.9668 3.01082 13.4442L2.34111 16.6735C2.21932 17.2607 2.73906 17.7805 3.32629 17.6587L6.55565 16.989C7.03302 16.89 7.47103 16.6536 7.81577 16.3089L17.3047 6.81991ZM16.1262 4.46289L15.5369 3.87363C15.2115 3.5482 14.6839 3.5482 14.3584 3.87363L13.4745 4.75755L15.2423 6.52531L16.1262 5.6414C16.4516 5.31596 16.4516 4.78833 16.1262 4.46289ZM14.0638 7.70382L12.296 5.93606L4.86948 13.3626C4.75457 13.4775 4.67577 13.6235 4.64277 13.7826L4.23082 15.769L6.21721 15.3571C6.37634 15.3241 6.52234 15.2453 6.63726 15.1303L14.0638 7.70382Z" fill="#ffffff" />
                            </svg>
                            Edit Category
                        </button>
                    </div>)}
                {mode === 'edit' && (
                    <div className={`flex gap-3 `}>
                        <button className='border border-[#858D9D] text-[#858D9D] px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={handleCancel}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1728 13.9941C15.4982 14.3195 15.4982 14.8472 15.1728 15.1726C14.8473 15.498 14.3197 15.498 13.9942 15.1726L10.0002 11.1786L6.00626 15.1726C5.68082 15.4981 5.15318 15.4981 4.82774 15.1726C4.5023 14.8472 4.5023 14.3195 4.82773 13.9941L8.82167 10.0001L4.82758 6.00607C4.50214 5.68064 4.50214 5.15301 4.82758 4.82757C5.15302 4.50214 5.68066 4.50214 6.0061 4.82757L10.0002 8.82158L13.9941 4.82759C14.3195 4.50215 14.8472 4.50214 15.1726 4.82758C15.498 5.15301 15.4981 5.68065 15.1726 6.00609L11.1787 10.0001L15.1728 13.9941Z" fill="#858D9D" />
                            </svg>
                            Cancel</button>
                        <button className={`bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center cursor-pointer disabled:opacity-65 disabled:pointer-events-none`}
                            disabled={!updatedCategory || (updatedCategory.name === category.name && updatedCategory.description === category.description)}
                            onClick={handleSave}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5 2.5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V7.47072C17.5 6.80768 17.2366 6.17179 16.7678 5.70295L14.297 3.23223C13.8282 2.76339 13.1923 2.5 12.5293 2.5H5ZM12.5293 4.16667H12.5V5.83333C12.5 6.75381 11.7538 7.5 10.8333 7.5H7.5C6.57953 7.5 5.83333 6.75381 5.83333 5.83333V4.16667H5C4.53976 4.16667 4.16667 4.53976 4.16667 5V15C4.16667 15.4602 4.53976 15.8333 5 15.8333H5.83333V10.8333C5.83333 9.91286 6.57953 9.16667 7.5 9.16667H12.5C13.4205 9.16667 14.1667 9.91286 14.1667 10.8333V15.8333H15C15.4602 15.8333 15.8333 15.4602 15.8333 15V7.47072C15.8333 7.24971 15.7455 7.03774 15.5893 6.88146L13.1185 4.41074C12.9623 4.25446 12.7503 4.16667 12.5293 4.16667ZM12.5 15.8333V10.8333H7.5V15.8333H12.5ZM7.5 4.16667H10.8333V5.83333H7.5V4.16667Z" fill="white" />
                            </svg>
                            Save Category
                        </button>
                </div>)}
            </div>
            <div className='mt-5 flex justify-center items-center gap-5'>
                {/* <div className='w-4/15'>
                    <div className='bg-white shadow-md rounded-lg p-5'>
                        <h2 className='text-xl font-semibold'>Thumbnail</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Photo</label>
                            <div
                                className={`flex flex-col gap-3 justify-center items-center py-4 bg-[#F9F9FC] rounded-md border border-dashed border-[#E0E2E7]
                                                                ${isDragging ? "border-dashed border-[#ff8200]" : "border-[#E0E2E7]"
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {!imagePreview && (<div className='rounded-full p-2 bg-[#FBE3CA] border-3 border-[#EFEFFD] w-fit'>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.3335 12.2502C10.3 12.2502 11.0835 11.4667 11.0835 10.5002C11.0835 9.53366 10.3 8.75016 9.3335 8.75016C8.367 8.75016 7.5835 9.53366 7.5835 10.5002C7.5835 11.4667 8.367 12.2502 9.3335 12.2502Z" fill="#FF8200" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.7085 3.2085C4.7755 3.2085 3.2085 4.7755 3.2085 6.7085V21.2918C3.2085 23.2248 4.7755 24.7918 6.7085 24.7918H21.2918C23.2248 24.7918 24.7918 23.2248 24.7918 21.2918V6.7085C24.7918 4.7755 23.2248 3.2085 21.2918 3.2085H6.7085ZM21.2918 5.54183H6.7085C6.06416 5.54183 5.54183 6.06416 5.54183 6.7085V15.7713L8.45706 13.9773C8.65107 13.858 8.89682 13.8624 9.08636 13.9888L12.1977 16.063L17.1421 12.2174C17.3527 12.0535 17.6477 12.0535 17.8583 12.2174L22.4585 15.7953V6.7085C22.4585 6.06416 21.9362 5.54183 21.2918 5.54183ZM5.54183 21.2918V18.5111L8.72502 16.5522L12.3027 18.9373L17.5002 14.8948L22.4585 18.7513V21.2918C22.4585 21.9362 21.9362 22.4585 21.2918 22.4585H6.7085C6.06416 22.4585 5.54183 21.9362 5.54183 21.2918Z" fill="#FF8200" />
                                    </svg>
                                </div>)}
                                {imagePreview && (
                                    <div key={imagePreview} className='relative'>
                                        <Image
                                            src={imagePreview}
                                            alt={`Image Preview`}
                                            width={200}
                                            height={200}
                                            className="object-contain rounded-md border border-[#E0E2E7]"
                                        />
                                        <button
                                            onClick={() => removeImage()}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>)}

                                {!imagePreview && (<><label className='text-md font-medium ml-2 text-[#858D9D]'>Drag and drop image here, or click add image</label>
                                    <div className='flex flex-col gap-2 justify-center'>
                                        <label htmlFor='upload-image' className='text-[#ff8200] bg-[#FBE3CA] rounded-lg px-4 py-2 text-center'>Add Image</label>
                                        <input
                                            id='upload-image'
                                            onChange={handleImageUpload}
                                            type="file"
                                            accept="*.png, *.jpg, *.jpeg"
                                            className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 mt-2 hidden'
                                        />
                                    </div>
                                </>)}
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className='w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-5'>
                        <h2 className='text-xl font-semibold'>General Information</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Category Name</label>
                            <input id='name' type="text" className={`border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none`} disabled={mode === 'view'}
                                placeholder='Type category name here...' defaultValue={category ? category.name : ""} onChange={handleInputChange} />
                        </div>

                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Description</label>
                            <textarea id='description' className={`border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 resize-none outline-none`} disabled={mode === 'view'}
                                placeholder='Type category description here...' rows="6" defaultValue={category ? category.description : ""} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}