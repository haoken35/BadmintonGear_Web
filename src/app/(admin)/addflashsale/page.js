"use client"
import React, { useState, useEffect } from 'react'
import { addFlashSale } from '@/service/flashsaleService';
import { getAllProducts } from '@/service/productService';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ToastProvider';
import { createFlashSaleDetail } from '@/service/flashSaleDetailsService';

export default function AddFlashSale() {
    // const { t, language } = useLanguage();
    const toast = useToast();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts('vi');
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

    const handleSaveFlashSale = async () => {
        if (!name || !startDate || !endDate) {
            toast.warning('Please fill all required fields');
            return;
        }

        if (selectedProducts.length === 0) {
            toast.warning('Please select at least one product');
            return;
        }

        const hasInvalidDiscount = selectedProducts.some((p) => {
            if (!p.discount || Number(p.discount) <= 0) return true;
            if (p.discountType === 'percentage' && Number(p.discount) > 100) return true;
            return false;
        });
        const hasInvalidQuantity = selectedProducts.some((p) => !p.quantity || Number(p.quantity) <= 0);
        if (hasInvalidDiscount) {
            toast.warning('Please provide valid discount values for all selected products');
            return;
        }
        if (hasInvalidQuantity) {
            toast.warning('Please provide valid quantity values for all selected products');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            toast.error('Start date must be before end date');
            return;
        }

        const inputFlashSale = {
            name: name,
            description: description,
            start: startDate,
            end: endDate,
        };


        selectedProducts.map((p) => ({ productId: p.id, discount: Number(p.discount), quantity: Number(p.quantity) }))
        try {
            const response = await addFlashSale(inputFlashSale);
            if (response) {
                const productsDetails = selectedProducts.map((p) => ({
                    flashsaleid: response.id,
                    productid: p.id,
                    type: p.discountType === "percentage" ? 0 : 1,
                    value: Number(p.discount),
                    max_uses: Number(p.quantity),
                    used_count: 0
                }));
                const results = await Promise.all(productsDetails.map(async (detail) => {
                    const result = await createFlashSaleDetail(detail);
                    return result;
                }));
                const allSuccess = results.every(res => res === true);
                if (allSuccess) {
                    toast.success('Flash sale added successfully');
                    setTimeout(() => {
                        window.location.href = "/flashsale";
                    }, 1500);
                }
            }
        } catch (error) {
            console.error("Error adding flash sale:", error);
            toast.error('Error adding flash sale');
        }
    }

    const toggleProductSelection = (product) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            if (exists) {
                return prev.filter((p) => p.id !== product.id);
            }
            return [...prev, { ...product, discountType: 'percentage', discount: 10, quantity: 1 }];
        });
    }

    const updateProductDiscountType = (productId, type) => {
        setSelectedProducts((prev) => prev.map((p) => {
            if (p.id === productId) {
                // Reset discount value when changing type
                const newDiscount = type === 'percentage' ? 10 : 10000;
                return { ...p, discountType: type, discount: newDiscount };
            }
            return p;
        }));
    }

    const updateProductDiscount = (productId, value) => {
        setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, discount: value } : p)));
    }

    const updateProductQuantity = (productId, value) => {
        setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity: value } : p)));
    }

    const filteredProducts = products.filter(product =>
        product.translations?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Add Flash Sale</h1>
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
                        <a className="text-(--muted)" href="/addflashsale">Add Flash Sale</a>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <button className='border border-(--border) text-(--muted) bg-(--surface) px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={() => window.location.href = "/flashsale"}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.41083 3.57501C9.73627 3.24957 10.2639 3.24957 10.5894 3.57501L16.4227 9.40834C16.7482 9.73378 16.7482 10.2614 16.4227 10.5869L10.5894 16.4202C10.2639 16.7456 9.73627 16.7456 9.41083 16.4202C9.08539 16.0948 9.08539 15.5671 9.41083 15.2417L14.069 10.5835H3.74935C3.28911 10.5835 2.91602 10.2104 2.91602 9.75016C2.91602 9.28992 3.28911 8.91683 3.74935 8.91683H14.069L9.41083 4.25862C9.08539 3.93318 9.08539 3.40545 9.41083 3.08001V3.57501Z" fill="var(--muted)" />
                        </svg>
                        Cancel
                    </button>
                    <button className='bg-(--primary) text-white px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={handleSaveFlashSale}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="white" />
                        </svg>
                        Save
                    </button>
                </div>
            </div>

            <div className='mt-6 bg-(--surface) rounded-lg p-6 border border-(--border)'>
                <h2 className='text-xl font-semibold mb-4'>Flash Sale Information</h2>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Name</label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className='w-full px-3 py-2 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Description</label>
                        <input
                            type='text'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className='w-full px-3 py-2 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Start Date</label>
                        <input
                            type='datetime-local'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='w-full px-3 py-2 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
                        />
                    </div>

                    <div className=''>
                        <label className='block text-sm font-medium mb-2'>End Date</label>
                        <input
                            type='datetime-local'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className='w-full px-3 py-2 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
                        />
                    </div>
                </div>

                <div className='mt-6'>
                    <div className='flex justify-between items-center mb-3'>
                        <label className='block text-sm font-medium'>Select Products ({selectedProducts.length})</label>
                        <button
                            onClick={() => setShowProductModal(true)}
                            className='bg-(--primary) text-white px-4 py-2 rounded-md text-sm'
                        >
                            Add Products
                        </button>
                    </div>

                    <div className='border border-(--border) rounded-md p-4 min-h-[100px]'>
                        {selectedProducts.length === 0 ? (
                            <p className='text-(--muted) text-center'>No products selected</p>
                        ) : (
                            <div className='grid grid-cols-2 gap-3'>
                                {selectedProducts.map(product => (
                                    <div key={product.id} className='relative border border-(--border) rounded-md p-3 flex flex-col gap-2'>
                                        <button
                                            onClick={() => toggleProductSelection(product)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                                        >
                                            ×
                                        </button>
                                        <div className='text-sm font-medium truncate'>{product.translations?.[0]?.name}</div>
                                        <div className='text-xs text-(--muted)'>{product.brand} - {Number(product.price).toLocaleString('vi-VN')} đ</div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs text-(--muted) w-20'>Discount Type</label>
                                                <select
                                                    value={product.discountType || 'percentage'}
                                                    onChange={(e) => updateProductDiscountType(product.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2) text-xs'
                                                >
                                                    <option value='percentage'>Percentage</option>
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
                                                    value={product.discount ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateProductDiscount(product.id, e.target.value)}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs text-(--muted) w-20'>Quantity</label>
                                                <input
                                                    type='number'
                                                    min="1"
                                                    value={product.quantity ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                                    className='flex-1 px-2 py-1 border border-(--border) rounded-md text-(--text) bg-(--surface2)'
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
                                                <div className='font-medium'>{product.translations?.[0]?.name}</div>
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
