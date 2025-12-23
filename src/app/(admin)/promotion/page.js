"use client"
import React, { useState, useEffect } from 'react'
import AdminPromotionItem from '@/components/AdminPromotionItem';
import { getPromotions, deletePromotion } from '@/service/promotionService';

export default function PromotionPage() {
    const [promotions, setPromotions] = useState([]);
    const [displayPromotions, setDisplayPromotions] = useState([]);

    const fetchPromotions = async () => {
        try {
            const response = await getPromotions();
            if (response && response.length > 0) {
                setPromotions(response);
                setDisplayPromotions(response);
            } else {
                alert('No promotions found');
            }
        }
        catch (error) {
            console.error('Error fetching promotions:', error);
            alert('Error fetching promotions');
        }
    }

    const handleDeletePromotion = async (id) => {
        if (!window.confirm('Are you sure you want to delete this promotion?')) {
            return;
        }
        try {
            const response = await deletePromotion(id);
            if (response === "Promotion deleted successfully") {
                alert('Promotion deleted successfully');
                fetchPromotions(); // Refresh the list after deletion
            } else {
                alert('Error deleting promotion');
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            alert('Error deleting promotion');
        }
    }

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleSearch = () => {
        const searchInput = document.getElementById('search');
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPromotions = promotions.filter(promotion =>
            promotion.code.toLowerCase().includes(searchTerm) ||
            promotion.id.toString().includes(searchTerm)
        );
        setDisplayPromotions(filteredPromotions);
    }

    return (
        <div className='font-inter'>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className='text-3xl font-bold'>Promotion</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/admin/promotion">Promotion List</a>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <button className='bg-[#FBE3CA] text-[#ff8200] px-4 py-2 rounded-md flex gap-2 items-center'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                            <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                        </svg>
                        Export</button>
                    <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={() => window.location.href = '/admin/promotiondetail?mode=add'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                        </svg>
                        Add Promotion
                    </button>
                </div>
            </div>
            <div className='mt-5 flex justify-between items-center'>
                <div className='flex gap-1 items-center bg-white rounded-md px-4 border border-[#E0E2E7]'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.7844 16.1991C11.646 18.6416 7.10629 18.4205 4.22156 15.5358C1.09737 12.4116 1.09737 7.34625 4.22156 4.22205C7.34576 1.09786 12.4111 1.09786 15.5353 4.22205C18.42 7.10677 18.6411 11.6464 16.1986 14.7849L20.4851 19.0713C20.8756 19.4618 20.8756 20.095 20.4851 20.4855C20.0945 20.876 19.4614 20.876 19.0708 20.4855L14.7844 16.1991ZM5.63578 14.1215C7.97892 16.4647 11.7779 16.4647 14.1211 14.1215C16.4642 11.7784 16.4642 7.97941 14.1211 5.63627C11.7779 3.29312 7.97892 3.29312 5.63578 5.63627C3.29263 7.97941 3.29263 11.7784 5.63578 14.1215Z" fill="#667085" />
                    </svg>
                    <input id='search' type='text' placeholder='Search promotion...' className='px-2 py-2 outline-none' onChange={handleSearch} />
                </div>
                <button className='text-[#667085] border border-[#E0E2E7] bg-white rounded-md px-4 py-2 flex items-center gap-2'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8333 6.66667C10.8333 7.1269 11.2064 7.5 11.6667 7.5C12.1269 7.5 12.5 7.1269 12.5 6.66667V5.83333H16.6667C17.1269 5.83333 17.5 5.46024 17.5 5C17.5 4.53976 17.1269 4.16667 16.6667 4.16667H12.5V3.33333C12.5 2.8731 12.1269 2.5 11.6667 2.5C11.2064 2.5 10.8333 2.8731 10.8333 3.33333V6.66667Z" fill="#667085" />
                        <path d="M2.5 10C2.5 9.53976 2.8731 9.16667 3.33333 9.16667H4.58333C4.81345 9.16667 5 9.35321 5 9.58333V10.4167C5 10.6468 4.81345 10.8333 4.58333 10.8333H3.33333C2.8731 10.8333 2.5 10.4602 2.5 10Z" fill="#667085" />
                        <path d="M7.5 7.5C7.03976 7.5 6.66667 7.8731 6.66667 8.33333V11.6667C6.66667 12.1269 7.03976 12.5 7.5 12.5C7.96024 12.5 8.33333 12.1269 8.33333 11.6667V10.8333H16.6667C17.1269 10.8333 17.5 10.4602 17.5 10C17.5 9.53976 17.1269 9.16667 16.6667 9.16667H8.33333V8.33333C8.33333 7.8731 7.96024 7.5 7.5 7.5Z" fill="#667085" />
                        <path d="M2.5 5C2.5 4.53976 2.8731 4.16667 3.33333 4.16667H8.75C8.98012 4.16667 9.16667 4.35321 9.16667 4.58333V5.41667C9.16667 5.64679 8.98012 5.83333 8.75 5.83333H3.33333C2.8731 5.83333 2.5 5.46024 2.5 5Z" fill="#667085" />
                        <path d="M12.5 13.3333C12.5 12.8731 12.8731 12.5 13.3333 12.5C13.7936 12.5 14.1667 12.8731 14.1667 13.3333V14.1667H16.6667C17.1269 14.1667 17.5 14.5398 17.5 15C17.5 15.4602 17.1269 15.8333 16.6667 15.8333H14.1667V16.6667C14.1667 17.1269 13.7936 17.5 13.3333 17.5C12.8731 17.5 12.5 17.1269 12.5 16.6667V13.3333Z" fill="#667085" />
                        <path d="M2.5 15C2.5 14.5398 2.8731 14.1667 3.33333 14.1667H10.4167C10.6468 14.1667 10.8333 14.3532 10.8333 14.5833V15.4167C10.8333 15.6468 10.6468 15.8333 10.4167 15.8333H3.33333C2.8731 15.8333 2.5 15.4602 2.5 15Z" fill="#667085" />
                    </svg>
                    Filters
                </button>
            </div>
            <div className="shadow-md rounded-md border border-[#E0E2E7] mt-5">
                <table className='w-full py-2 rounded-md overflow-hidden '>
                    <thead className='bg-[#F9F9FC] font-medium border-b border-[#F0F1F3]'>
                        <tr className='text-center text-[#344054] font-semibold rounded-md'>
                            <th className='py-2 px-4 text-center'>Promotion ID</th>
                            <th className='py-2 px-4 text-center'>Code</th>
                            <th className='py-2 px-4 text-center'>Discount</th>
                            <th className='py-2 px-4 text-center'>Quantity</th>
                            <th className='py-2 px-4 text-center'>Start Date</th>
                            <th className='py-2 px-4 text-center'>End Date</th>
                            <th className='py-2 px-4 text-center'>Status</th>
                            <th className='py-2 px-4 text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-[#344054] font-normal'>
                        {promotions.map((promotion) => (
                            <AdminPromotionItem
                                key={promotion.id}
                                promotion={promotion}
                                onDelete={() => handleDeletePromotion(promotion.id)} />
                        ))}
                    </tbody>
                </table>
                {/* Pagination*/}
            </div>
        </div>
    )
}