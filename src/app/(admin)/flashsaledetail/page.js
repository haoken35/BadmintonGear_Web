"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import { getFlashSaleById, updateFlashSale } from '@/service/flashsaleService';
import { getAllProducts } from '@/service/productService';
import { getFlashSaleDetailsByFlashSaleId } from '@/service/flashSaleDetailsService';
import { useToast } from '@/components/ToastProvider';

export default function FlashSaleDetail() {
    const toast = useToast();
    const searchParams = useSearchParams();
    const flashsaleId = searchParams.get('id');
    const [mode, setMode] = useState(searchParams.get('mode') || 'view');
    const [flashsale, setFlashSale] = useState(null);
    const [inputFlashSale, setInputFlashSale] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                if (response) {
                    setProducts(response);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error('Error fetching products');
            }
        }
        fetchProducts();
    }, []);
    useEffect(() => {
        if (flashsaleId) {
            fetchFlashSaleById(flashsaleId);
        }
    }, [flashsaleId]);

    const fetchFlashSaleById = async (id) => {
        try {
            const response = await getFlashSaleById(id);
            if (response) {
                setFlashSale(response);
                const details = await getFlashSaleDetailsByFlashSaleId(id, 'vi');
                if (details && details.length > 0) {
                    const mappedProducts = details.map(detail => ({
                        ...detail.Product,
                        flashsaleid: detail.flashsaleid,
                        discountType: detail.type === 0 ? 'percentage' : 'fixed',
                        discount: detail.value,
                        quantity: detail.max_uses,
                        used_count: detail.used_count || 0,
                        flashSaleDetailId: detail.id
                    }));
                    setSelectedProducts(mappedProducts);
                }
            }
        } catch (error) {
            console.error('Error fetching flash sale:', error);
            toast.error('Error fetching flash sale');
        }
    }

    const handleInputChange = () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        setInputFlashSale({
            name,
            startDate,
            description,
            endDate,
            products: selectedProducts.map(p => ({
                flashsaleid: flashsaleId,
                productid: p.id,
                type: p.discountType === 'percentage' ? 0 : 1,
                value: Number(p.discount),
                max_uses: Number(p.quantity),
                used_count: p.used_count || 0,
            }))
        });
    }

    const handleCancel = () => {
        if (flashsale) {
            document.getElementById('name').value = flashsale.name;
            document.getElementById('startDate').value = new Date(flashsale.start).toISOString().slice(0, 16);
            document.getElementById('endDate').value = new Date(flashsale.end).toISOString().slice(0, 16);

            // Restore original products
            if (flashsale.FlashSaleDetails && flashsale.FlashSaleDetails.length > 0) {
                const mappedProducts = flashsale.FlashSaleDetails.map(detail => ({
                    ...detail.Product,
                    discountType: detail.type === 0 ? 'percentage' : 'fixed',
                    discount: detail.value,
                    quantity: detail.max_uses,
                    flashSaleDetailId: detail.id
                }));
                setSelectedProducts(mappedProducts);
            }

            setInputFlashSale(null);
            setMode('view');
        }
    }

    const handleSave = async () => {
        if (!inputFlashSale || !inputFlashSale.name || !inputFlashSale.startDate || !inputFlashSale.endDate) {
            toast.warning('Please fill all required fields');
            return;
        }

        if (new Date(inputFlashSale.startDate) >= new Date(inputFlashSale.endDate)) {
            toast.error('Start date must be before end date');
            return;
        }

        try {
            const response = await updateFlashSale(flashsaleId, {
                name: inputFlashSale.name,
                description: flashsale.description,
                end: inputFlashSale.endDate,
                start: inputFlashSale.startDate,
            });
            if (response) {
                toast.success('Flash sale updated successfully');
                setFlashSale(response);
                setMode('view');
                fetchFlashSaleById(flashsaleId);
            }
        } catch (error) {
            console.error('Error updating flash sale:', error);
            toast.error('Error updating flash sale details');
        }
    }

    const handleDisable = async () => {
        try {
            const disabledFlashSale = {
                ...inputFlashSale || {
                    name: flashsale.name,
                    startDate: flashsale.start,
                    endDate: flashsale.end,
                    products: selectedProducts.map(p => ({
                        productId: p.id,
                        type: p.discountType === 'percentage' ? 0 : 1,
                        value: Number(p.discount),
                        max_uses: Number(p.quantity)
                    }))
                },
                status: 1 // Disabled status
            };

            const response = await updateFlashSale(flashsaleId, disabledFlashSale);
            if (response) {
                toast.success('Flash sale disabled successfully');
                fetchFlashSaleById(flashsaleId);
            }
        } catch (error) {
            console.error('Error disabling flash sale:', error);
            toast.error('Error disabling flash sale');
        }
    }

    const toggleProductSelection = (product) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            return [...prev, { ...product, discountType: 'percentage', discount: 10, quantity: 1 }];
        });
        handleInputChange();
    }

    const updateProductDiscountType = (productId, type) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newDiscount = type === 'percentage' ? 10 : 10000;
                return { ...p, discountType: type, discount: newDiscount };
            }
            return p;
        }));
        setTimeout(handleInputChange, 0);
    }

    const updateProductDiscount = (productId, value) => {
        setSelectedProducts(prev => prev.map(p => (p.id === productId ? { ...p, discount: value } : p)));
        setTimeout(handleInputChange, 0);
    }

    const updateProductQuantity = (productId, value) => {
        setSelectedProducts(prev => prev.map(p => (p.id === productId ? { ...p, quantity: value } : p)));
        setTimeout(handleInputChange, 0);
    }

    const filteredProducts = products.filter(product =>
        product.translations[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusInfo = (status) => {
        switch (status) {
            case 0: return { text: 'Expired', color: 'text-[#667085] bg-[#F2F4F7]' };
            case 1: return { text: 'Disabled', color: 'text-[#B42318] bg-[#FEF3F2]' };
            case 2: return { text: 'Upcoming', color: 'text-[#F79009] bg-[#FEF0C7]' };
            case 3: return { text: 'Active', color: 'text-[#0D894F] bg-[#E7F4EE]' };
            default: return { text: 'Expired', color: 'text-[#667085] bg-[#F2F4F7]' };
        }
    };

    const currentStatus = flashsale ? (() => {
        const dateNow = new Date();
        return dateNow > new Date(flashsale.end) ? 0 :
            (dateNow < new Date(flashsale.start) ? 2 :
                (dateNow >= new Date(flashsale.start) && dateNow <= new Date(flashsale.end) ? 3 : 1));
    })() : 0;

    const statusInfo = getStatusInfo(currentStatus);

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Flash Sale Details</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-(--primary)" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="var(--muted)" />
                            </svg>
                        </label>
                        <a className="text-(--primary)" href="/flashsale">Flash Sale List</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="var(--muted)" />
                            </svg>
                        </label>
                        <a className="text-(--muted)" href={`/flashsaledetail?id=${flashsaleId}&mode=${mode}`}>Flash Sale Details</a>
                    </div>
                </div>
                {mode === 'view' && flashsale && currentStatus !== 1 && currentStatus !== 0 && (
                    <div>
                        <button className='bg-(--primary) text-white px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={() => setMode('edit')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.3047 6.81991C18.281 5.8436 18.281 4.26069 17.3047 3.28438L16.7155 2.69512C15.7391 1.71881 14.1562 1.71881 13.1799 2.69512L3.69097 12.1841C3.34624 12.5288 3.10982 12.9668 3.01082 13.4442L2.34111 16.6735C2.21932 17.2607 2.73906 17.7805 3.32629 17.6587L6.55565 16.989C7.03302 16.89 7.47103 16.6536 7.81577 16.3089L17.3047 6.81991ZM16.1262 4.46289L15.5369 3.87363C15.2115 3.5482 14.6839 3.5482 14.3584 3.87363L13.4745 4.75755L15.2423 6.52531L16.1262 5.6414C16.4516 5.31596 16.4516 4.78833 16.1262 4.46289ZM14.0638 7.70382L12.296 5.93606L4.86948 13.3626C4.75457 13.4775 4.67577 13.6235 4.64277 13.7826L4.23082 15.769L6.21721 15.3571C6.37634 15.3241 6.52234 15.2453 6.63726 15.1303L14.0638 7.70382Z" fill="#ffffff" />
                            </svg>
                            Edit
                        </button>
                    </div>
                )}
                {mode !== 'view' && (
                    <div className='flex gap-3'>
                        <button className='border border-(--border) text-(--muted) bg-(--surface) px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={handleCancel}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1728 13.9941C15.4982 14.3195 15.4982 14.8472 15.1728 15.1726C14.8473 15.498 14.3197 15.498 13.9942 15.1726L10.0002 11.1786L6.00626 15.1726C5.68082 15.4981 5.15318 15.4981 4.82774 15.1726C4.5023 14.8472 4.5023 14.3195 4.82773 13.9941L8.82167 10.0001L4.82758 6.00607C4.50214 5.68064 4.50214 5.15301 4.82758 4.82757C5.15302 4.50214 5.68066 4.50214 6.0061 4.82757L10.0002 8.82158L13.9941 4.82759C14.3195 4.50215 14.8472 4.50214 15.1726 4.82758C15.498 5.15301 15.4981 5.68065 15.1726 6.00609L11.1787 10.0001L15.1728 13.9941Z" fill="var(--muted)" />
                            </svg>
                            Cancel
                        </button>
                        <button className='bg-(--primary) text-white px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={handleSave}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="white" />
                            </svg>
                            Save
                        </button>
                        {mode === 'edit' && flashsale && currentStatus !== 1 && currentStatus !== 0 && (
                            <button className='bg-red-500 text-white px-4 py-2 rounded-md flex gap-2 items-center'
                                onClick={handleDisable}>
                                Disable
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className='mt-5'>
                <div className='bg-(--surface) shadow-md rounded-lg p-5'>
                    <h2 className='text-xl font-semibold mb-4'>General Information</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium mb-2 text-(--muted)'>Name</label>
                            <input
                                id='name'
                                type='text'
                                disabled={mode === 'view'}
                                className='border border-(--border) bg-(--surface2) text-(--text) rounded-md w-full px-3 py-2 outline-none disabled:opacity-60'
                                placeholder="Enter name"
                                defaultValue={flashsale ? flashsale.name : ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        {mode !== 'add' && flashsale && (
                            <div className='flex items-end gap-2'>
                                <label className='text-sm font-medium text-(--muted)'>Status:</label>
                                <div className={`py-1 px-3 rounded-full ${statusInfo.color}`}>
                                    {statusInfo.text}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className='block text-sm font-medium mb-2 text-(--muted)'>Description</label>
                            <input
                                id='description'
                                type='text'
                                disabled={mode === 'view'}
                                className='border border-(--border) bg-(--surface2) text-(--text) rounded-md w-full px-3 py-2 outline-none disabled:opacity-60'
                                placeholder="Enter description"
                                defaultValue={flashsale ? flashsale.description : ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className='bg-(--surface) shadow-md rounded-lg p-5 mt-5'>
                    <h2 className='text-xl font-semibold mb-4'>Time Range</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium mb-2 text-(--muted)'>Start Date</label>
                            <input
                                id='startDate'
                                type='datetime-local'
                                disabled={mode === 'view'}
                                className='border border-(--border) bg-(--surface2) text-(--text) rounded-md w-full px-3 py-2 outline-none disabled:opacity-60'
                                defaultValue={flashsale && flashsale.start ? new Date(flashsale.start).toISOString().slice(0, 16) : ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-2 text-(--muted)'>End Date</label>
                            <input
                                id='endDate'
                                type='datetime-local'
                                disabled={mode === 'view'}
                                className='border border-(--border) bg-(--surface2) text-(--text) rounded-md w-full px-3 py-2 outline-none disabled:opacity-60'
                                defaultValue={flashsale && flashsale.end ? new Date(flashsale.end).toISOString().slice(0, 16) : ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className='bg-(--surface) shadow-md rounded-lg p-5 mt-5'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Products ({selectedProducts.length})</h2>
                    </div>

                    <div className='border border-(--border) rounded-md p-4 min-h-[100px]'>
                        {selectedProducts.length === 0 ? (
                            <p className='text-(--muted) text-center'>No products selected</p>
                        ) : (
                            <div className='grid grid-cols-2 gap-3'>
                                {selectedProducts.map(product => (
                                    <div key={product.id} className='relative border border-(--border) rounded-md p-3 flex flex-col gap-2'>
                                        <div className='text-sm font-medium truncate'>{product.translations?.[0]?.name || product.name}</div>
                                        <div className='text-xs text-(--muted)'>{product.brand} - {Number(product.price).toLocaleString('vi-VN')} đ</div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs text-(--muted) w-20'>Discount Type</label>
                                                <select
                                                    value={product.discountType || 'percentage'}
                                                    disabled={true}
                                                    onChange={(e) => updateProductDiscountType(product.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2) text-xs disabled:opacity-60'
                                                >
                                                    <option value='percentage'>Percent</option>
                                                    <option value='fixed'>Fixed Amount</option>
                                                </select>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs text-(--muted) w-20'>
                                                    {product.discountType === 'percentage' ? 'Discount (%)' : 'Discount (đ)'}
                                                </label>
                                                <input
                                                    type='number'
                                                    min="1"
                                                    max={product.discountType === 'percentage' ? "100" : undefined}
                                                    disabled={true}
                                                    value={product.discount ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateProductDiscount(product.id, e.target.value)}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2) disabled:opacity-60'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs text-(--muted) w-20'>Quantity</label>
                                                <input
                                                    type='number'
                                                    min="1"
                                                    disabled={true}
                                                    value={product.quantity ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2) disabled:opacity-60'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Selection Modal */}
            {showProductModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-(--surface) rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-xl font-semibold'>Select Products</h3>
                            <button onClick={() => setShowProductModal(false)} className='text-2xl'>×</button>
                        </div>

                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className='w-full px-3 py-2 border border-(--border) rounded-md mb-4 text-(--text) bg-(--surface2)'
                        />

                        <div className='overflow-y-auto flex-1'>
                            <div className='grid grid-cols-1 gap-2'>
                                {filteredProducts.map(product => {
                                    const isSelected = selectedProducts.find(p => p.id === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => toggleProductSelection(product)}
                                            className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${isSelected ? 'border-(--primary) bg-(--primary)/10' : 'border-(--border) hover:bg-(--surface2)'
                                                }`}
                                        >
                                            <input
                                                type='checkbox'
                                                checked={!!isSelected}
                                                onChange={() => { }}
                                                className='w-4 h-4'
                                            />
                                            <div className='flex-1'>
                                                <div className='font-medium'>{product.translations[0]?.name}</div>
                                                <div className='text-sm text-(--muted)'>{product.brand} - {Number(product.price).toLocaleString('vi-VN')} đ</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='mt-4 flex justify-end gap-2'>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className='px-4 py-2 border border-(--border) rounded-md'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className='px-4 py-2 bg-(--primary) text-white rounded-md'
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
