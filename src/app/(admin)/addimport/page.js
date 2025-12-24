"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import ImportDetailItem from '@/components/ImportDetailItem';
import { getAllProducts } from '@/service/productService';
import { createImport } from '@/service/importService';
import { createDetail } from '@/service/importDetailService';

export default function AddImportPage() {
    const searchParams = useSearchParams();
    const product = searchParams.get('idproduct');
    const [grn, setGrn] = useState([]);
    const [products, setProducts] = useState([]);
    const [details, setDetails] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [staff, setStaff] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [count, setCount] = useState(1);
    const [price, setPrice] = useState(1000);
    const [selectedProduct, setSelectedProduct] = useState("");

    const handleAddProduct = () => {
        if (!selectedProduct || count < 1) return;
        const product = products.find(p => p.id == selectedProduct);
        if (!product) return;
        setDetails([
            ...details,
            {
                id: Date.now(), // id tạm thời
                Product: product,
                quantity: count,
                price: price,
                total: price * count
            }
        ]);
        setShowDialog(false);
        setSelectedProduct("");
        setPrice(1000);
        setCount(1);
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getAllProducts();
                setProducts(res);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        if (typeof window !== "undefined") {
            const profile = JSON.parse(localStorage.getItem('userData'));
            setStaff(profile);
        }
        fetchProduct();
        if (product) {
            setShowDialog(true);
            setSelectedProduct(product);
        }
    }, [])

    const handleSaveImport = async () => {
        if (details.length === 0) {
            alert("No product to create import");
            return;
        }
        try {
            const importData = {
                date: new Date().toISOString(),
                totalprice: 0,
                userid: staff.id
            };
            const res = await createImport(importData);
            console.log(res);
            for (const item of details) {
                const detailData = {
                    grnid: res.id,
                    productid: item.Product.id,
                    price: item.price,
                    quantity: item.quantity
                };
                await createDetail(detailData);
            };
            setGrn([]);
            setDetails([]);
            setGrandTotal(0);
            alert("Created import successfully");
            window.location.href = '/import';
        } catch (error) {
            console.error('Error saving import:', error);
            alert("Failed to create import");
        }
    }

    useEffect(() => {
        // Tính tổng tiền
        const total = details.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setGrandTotal(total);
    }, [details]);

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Add Import</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#ff8200]" href="/import">Import List</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href={`/addimport`}>Add Import </a>
                    </div>
                </div>
                <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                    onClick={handleSaveImport}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                    </svg>
                    Add Import
                </button>
            </div>
            <div className='flex gap-10 mt-5'>
                <div className='flex flex-col gap-3 p-5 bg-white rounded-md shadow-md w-2/7 h-fit'>
                    <div className='flex gap-3 items-center'>
                        <h1 className='text-xl font-semibold'>Add New Import</h1>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M24.5 14.5C24.5 16.9853 22.4853 19 20 19C17.5147 19 15.5 16.9853 15.5 14.5C15.5 12.0147 17.5147 10 20 10C22.4853 10 24.5 12.0147 24.5 14.5ZM22.5 14.5C22.5 15.8807 21.3807 17 20 17C18.6193 17 17.5 15.8807 17.5 14.5C17.5 13.1193 18.6193 12 20 12C21.3807 12 22.5 13.1193 22.5 14.5Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11 26.9231C11 23.0996 14.0996 20 17.9231 20H22.0769C25.9004 20 29 23.0996 29 26.9231C29 28.0701 28.0701 29 26.9231 29H13.0769C11.9299 29 11 28.0701 11 26.9231ZM13 26.9231C13 24.2041 15.2041 22 17.9231 22H22.0769C24.7959 22 27 24.2041 27 26.9231C27 26.9656 26.9656 27 26.9231 27H13.0769C13.0344 27 13 26.9656 13 26.9231Z" fill="#667085" />
                            </svg>
                            Staff
                        </div>
                        <div>{staff?.name || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 15C10 13.3431 11.3431 12 13 12H27C28.6569 12 30 13.3431 30 15V25C30 26.6569 28.6569 28 27 28H13C11.3431 28 10 26.6569 10 25V15ZM26.3334 14H13.6667L19.4 18.3C19.7556 18.5667 20.2445 18.5667 20.6 18.3L26.3334 14ZM12 15.25V25C12 25.5523 12.4477 26 13 26H27C27.5523 26 28 25.5523 28 25V15.25L21.8 19.9C20.7334 20.7 19.2667 20.7 18.2 19.9L12 15.25Z" fill="#667085" />
                            </svg>
                            Email
                        </div>
                        <div>{staff?.email || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path d="M18.5 25C17.9477 25 17.5 25.4477 17.5 26C17.5 26.5523 17.9477 27 18.5 27H21.5C22.0523 27 22.5 26.5523 22.5 26C22.5 25.4477 22.0523 25 21.5 25H18.5Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5 13C13.5 11.3431 14.8431 10 16.5 10H23.5C25.1569 10 26.5 11.3431 26.5 13V27C26.5 28.6569 25.1569 30 23.5 30H16.5C14.8431 30 13.5 28.6569 13.5 27V13ZM16.5 12H23.5C24.0523 12 24.5 12.4477 24.5 13V27C24.5 27.5523 24.0523 28 23.5 28H16.5C15.9477 28 15.5 27.5523 15.5 27V13C15.5 12.4477 15.9477 12 16.5 12Z" fill="#667085" />
                            </svg>
                            Phone
                        </div>
                        <div>{staff?.phonenumber || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path d="M23.9666 20.6975C24.3519 20.3017 24.3433 19.6686 23.9475 19.2834C23.5517 18.8982 22.9186 18.9068 22.5334 19.3025L19.2737 22.6517L17.8755 21.5309C17.4446 21.1854 16.8152 21.2547 16.4698 21.6856C16.1244 22.1166 16.1936 22.7459 16.6246 23.0914L19.0857 25.0643C19.2867 25.2254 19.5771 25.2075 19.7567 25.0229L23.9666 20.6975Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 10C16.5523 10 17 10.4477 17 11H23C23 10.4477 23.4477 10 24 10C24.5523 10 25 10.4477 25 11H26C27.6569 11 29 12.3431 29 14V27C29 28.6569 27.6569 30 26 30H14C12.3431 30 11 28.6569 11 27V14C11 12.3431 12.3431 11 14 11H15C15 10.4477 15.4477 10 16 10ZM27 14V15H13V14C13 13.4477 13.4477 13 14 13H15C15 13.5523 15.4477 14 16 14C16.5523 14 17 13.5523 17 13H23C23 13.5523 23.4477 14 24 14C24.5523 14 25 13.5523 25 13H26C26.5523 13 27 13.4477 27 14ZM13 27V17H27V27C27 27.5523 26.5523 28 26 28H14C13.4477 28 13 27.5523 13 27Z" fill="#667085" />
                            </svg>
                            Added
                        </div>
                        <div>{new Date().toLocaleString('vi-VN')}</div>
                    </div>
                </div>
                <div className='flex gap-[7%] w-full '>
                    <div className='w-full p-5 bg-white rounded-md shadow-md h-fit'>
                        <div className='flex justify-between'>
                            <div className='flex w-full gap-4 items-center px-5'>
                                <div className='text-lg font-semibold'>Product List</div>
                                <div className='bg-[#E7F4EE] text-[#0D894F] rounded-full px-2 py-1'>{details.length} Product{details.length > 1 ? "s" : ""}</div>
                            </div>
                            <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                                onClick={() => { setShowDialog(true) }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                                </svg>
                                <span>Add Product</span>
                            </button>
                            {showDialog && (
                                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-60">
                                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
                                        <h3 className="text-lg font-semibold mb-4">Add Product</h3>
                                        <div className="flex flex-col gap-3">
                                            <div className='flex flex-col gap-2'>
                                                <label className='text-md'> Product: </label>
                                                <select
                                                    className="border border-gray-400 rounded px-2 py-1"
                                                    value={selectedProduct}
                                                    onChange={e => setSelectedProduct(e.target.value)}
                                                >
                                                    <option value="" disabled>Select product</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <label>Quantity:</label>
                                                <div className="flex items-center border border-gray-400 rounded w-fit">
                                                    <button
                                                        className="px-4 py-2 border-r border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => setCount(count - 1)}
                                                        disabled={count <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4">{count}</span>
                                                    <button
                                                        className="px-4 py-2 border-l border-gray-400 bg-orange-500 text-white"
                                                        onClick={() => setCount(count + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <label>Price:</label>
                                                <input type='number' value={price} min={1000} step={1000} onChange={e => setPrice(e.target.value)} className="border border-gray-400 rounded px-2 py-1" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                                                onClick={() => setShowDialog(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded bg-[#ff8200] text-white"
                                                onClick={handleAddProduct}
                                                disabled={!selectedProduct || count < 1}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <table className='w-full mt-5'>
                            <thead className='bg-[#F9FAFB] font-medium'>
                                <tr className='text-center bg-[#F9F9FC] font-semibold border-b border-[#E0E2E7]'>
                                    <th className='py-2 px-4'>Product</th>
                                    <th className='py-2 px-4'>Quantity</th>
                                    <th className='py-2 px-4'>Price</th>
                                    <th className='py-2 px-4'>Total</th>
                                </tr>
                            </thead>
                            <tbody className='text-[#344054] font-normal text-center'>
                                {details.map((item) => (
                                    <ImportDetailItem
                                        key={item.id}
                                        item={item} />
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className='py-4 px-4 font-semibold'>Grand Total</td>
                                    <td className='py-2 px-4 font-semibold'>{Number(grandTotal).toLocaleString()} VND</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}