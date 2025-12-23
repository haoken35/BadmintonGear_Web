"use client"
import React, { useState, useEffect, use } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { addPromotion, getPromotionById, updatePromotion } from '@/service/promotionService';

export default function PromotionDetail(id) {
    //   start, end, status
    const searchParams = useSearchParams();
    const promotionId = searchParams.get('id');
    const [mode, setMode] = useState(searchParams.get('mode'));
    const [promotion, setPromotion] = useState(null);
    const [inputPromotion, setInputPromotion] = useState(null);

    const handleInputChange = () => {
        const code = document.getElementById('code').value;
        const description = document.getElementById('description').value;
        const quantity = document.getElementById('quantity').value;
        const value = document.getElementById('value').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        let status = 0; // Default status is Expired
        if (new Date(end) < new Date() || new Date(start) > new Date()) {
            status = 0; // Expired
        } else if (new Date(start) <= new Date() && new Date(end) >= new Date()) {
            if (quantity > 0) {
                status = 3; // Active
            } else if (quantity <= 0) {
                status = 2; // Out of turn
            } else {
                status = 1; // Disabled
            }
        }

        setInputPromotion({
            code: code,
            description: description,
            quantity: quantity,
            value: value,
            start: start ? new Date(start).toISOString() : null,
            end: end ? new Date(end).toISOString() : null,
            status: status
        });
    }

    const handleCancel = () => {
        if (mode === 'add') {
            window.location.href = "/promotion";
        }
        else {
            document.getElementById('code').value = promotion.code;
            document.getElementById('description').value = promotion.description;
            document.getElementById('quantity').value = promotion.quantity;
            document.getElementById('value').value = promotion.value;
            document.getElementById('start').value = new Date(promotion.start).toISOString().slice(0, 16);
            document.getElementById('end').value = new Date(promotion.end).toISOString().slice(0, 16);
            setInputPromotion(null);
            setMode('view');
        }
    }

    const updatePromotionDetails = async () => {
        if (!inputPromotion || !inputPromotion.code || !inputPromotion.quantity || !inputPromotion.value || !inputPromotion.start || !inputPromotion.end) {
            alert('Please fill in all fields before saving.');
            return;
        }
        try {
            const response = await updatePromotion(promotionId, inputPromotion);
            if (response) {
                setPromotion(response);
                setMode('view');
            }
        } catch (error) {
            alert('Error updating promotion');
            console.error('Error updating promotion:', error);
        }
    }

    const addNewPromotion = async () => {
        if (!inputPromotion || !inputPromotion.code || !inputPromotion.quantity || !inputPromotion.value || !inputPromotion.start || !inputPromotion.end) {
            alert('Please fill in all fields before saving.');
            return;
        }
        try {
            const response = await addPromotion(inputPromotion);
            if (response) {
                window.location.href = "/promotion";
            }
        } catch (error) {
            alert('Error adding promotion');
            console.error('Error adding promotion:', error);
        }
    }

    const handleSave = () => {
        if (mode === 'add') {
            addNewPromotion();
        } else if (mode === 'edit' && inputPromotion) {
            updatePromotionDetails();
        }
    }

    const handleDisabled = () => {
        const updatedPromotion = {
            code: promotion.code,
            description: promotion.description,
            quantity: promotion.quantity,
            value: promotion.value,
            start: promotion.start,
            end: promotion.end,
            status: 1 // Set status to Disabled
        };
        setInputPromotion(updatedPromotion);
        console.log('Promotion disabled:', updatedPromotion);
        updatePromotionDetails();
    }

    const fetchPromotionById = async (id) => {
        try {
            const response = await getPromotionById(id);
            setPromotion(response);
        }
        catch (error) {
            console.error('Error fetching promotion:', error);
        }
    }
    useEffect(() => {
        if (mode !== 'add' && promotionId) {
            fetchPromotionById(promotionId);
        }
    }, []);

    return (

        <div className='px-2 py-5'>
            {/* {setImagePreviews(product.image)} */}
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Promotion Details</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#ff8200]" href="/promotion">Promotion List</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href={promotionId ? `/promotiondetail?id=${promotionId}&&mode=${mode}` : '/promotiondetail?mode=add'}>Promotion Details</a>
                    </div>

                </div>
                {mode === 'view' && promotion && promotion.status !== 1 && (
                    <div>
                        <button className={`bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center cursor-pointer`}
                            onClick={() => setMode('edit')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.3047 6.81991C18.281 5.8436 18.281 4.26069 17.3047 3.28438L16.7155 2.69512C15.7391 1.71881 14.1562 1.71881 13.1799 2.69512L3.69097 12.1841C3.34624 12.5288 3.10982 12.9668 3.01082 13.4442L2.34111 16.6735C2.21932 17.2607 2.73906 17.7805 3.32629 17.6587L6.55565 16.989C7.03302 16.89 7.47103 16.6536 7.81577 16.3089L17.3047 6.81991ZM16.1262 4.46289L15.5369 3.87363C15.2115 3.5482 14.6839 3.5482 14.3584 3.87363L13.4745 4.75755L15.2423 6.52531L16.1262 5.6414C16.4516 5.31596 16.4516 4.78833 16.1262 4.46289ZM14.0638 7.70382L12.296 5.93606L4.86948 13.3626C4.75457 13.4775 4.67577 13.6235 4.64277 13.7826L4.23082 15.769L6.21721 15.3571C6.37634 15.3241 6.52234 15.2453 6.63726 15.1303L14.0638 7.70382Z" fill="#ffffff" />
                            </svg>
                            Edit Promotion
                        </button>
                    </div>)}
                {mode !== 'view' && (
                    <div className='flex gap-3'>
                        <button className='border border-[#858D9D] text-[#858D9D] px-4 py-2 rounded-md flex gap-2 items-center'
                            onClick={handleCancel}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1728 13.9941C15.4982 14.3195 15.4982 14.8472 15.1728 15.1726C14.8473 15.498 14.3197 15.498 13.9942 15.1726L10.0002 11.1786L6.00626 15.1726C5.68082 15.4981 5.15318 15.4981 4.82774 15.1726C4.5023 14.8472 4.5023 14.3195 4.82773 13.9941L8.82167 10.0001L4.82758 6.00607C4.50214 5.68064 4.50214 5.15301 4.82758 4.82757C5.15302 4.50214 5.68066 4.50214 6.0061 4.82757L10.0002 8.82158L13.9941 4.82759C14.3195 4.50215 14.8472 4.50214 15.1726 4.82758C15.498 5.15301 15.4981 5.68065 15.1726 6.00609L11.1787 10.0001L15.1728 13.9941Z" fill="#858D9D" />
                            </svg>
                            Cancel</button>
                        <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center disabled:opacity-65'
                            disabled={!inputPromotion || !inputPromotion.code || !inputPromotion.quantity || !inputPromotion.value || !inputPromotion.start
                                || !inputPromotion.end || (inputPromotion.code === promotion?.code && inputPromotion.description === promotion?.description &&
                                    inputPromotion.quantity === promotion?.quantity && inputPromotion.value === promotion?.value && inputPromotion.start === promotion?.start
                                    && inputPromotion.end === promotion?.end)}
                            onClick={handleSave}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5 2.5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V7.47072C17.5 6.80768 17.2366 6.17179 16.7678 5.70295L14.297 3.23223C13.8282 2.76339 13.1923 2.5 12.5293 2.5H5ZM12.5293 4.16667H12.5V5.83333C12.5 6.75381 11.7538 7.5 10.8333 7.5H7.5C6.57953 7.5 5.83333 6.75381 5.83333 5.83333V4.16667H5C4.53976 4.16667 4.16667 4.53976 4.16667 5V15C4.16667 15.4602 4.53976 15.8333 5 15.8333H5.83333V10.8333C5.83333 9.91286 6.57953 9.16667 7.5 9.16667H12.5C13.4205 9.16667 14.1667 9.91286 14.1667 10.8333V15.8333H15C15.4602 15.8333 15.8333 15.4602 15.8333 15V7.47072C15.8333 7.24971 15.7455 7.03774 15.5893 6.88146L13.1185 4.41074C12.9623 4.25446 12.7503 4.16667 12.5293 4.16667ZM12.5 15.8333V10.8333H7.5V15.8333H12.5ZM7.5 4.16667H10.8333V5.83333H7.5V4.16667Z" fill="white" />
                            </svg>
                            Save Promotion
                        </button>
                        {mode === 'edit' && promotion && promotion.status !== 1 && (
                            <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                                onClick={handleDisabled}>
                                Disabled
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className='mt-5 flex justify-center items-center gap-5'>
                <div className='w-2/3 '>
                    <div className='bg-white shadow-md rounded-lg p-5'>
                        <h2 className='text-xl font-semibold'>General Information</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Promotion Code</label>
                            <input id='code' type="text" className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                placeholder='Type promotion code here...'
                                defaultValue={promotion ? promotion.code : ""}
                                onChange={handleInputChange} />
                        </div>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Description</label>
                            <textarea id='description' className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 resize-none  outline-none'
                                placeholder='Type promotion description here...' rows="6" defaultValue={promotion ? promotion.description : ""}
                                onChange={handleInputChange} />
                        </div>
                        {mode !== 'add' && promotion && (
                            <div className='mt-2 gap-2 flex items-center'>
                                <label className='text-sm font-medium ml-2'>Promotion Status</label>
                                <div className={`py-1 px-2 rounded-full ${promotion.status === 3 ? 'text-[#0D894F] bg-[#E7F4EE]' : 'text-[#F04438] bg-[#FEEDEC]'}`}>{promotion.status === 0 ? "Expired" :
                                    (promotion.status === 1 ? "Disabled" : (promotion.status === 2 ? "Out of turn" : "Active"))}</div>
                            </div>
                        )}
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-5 mt-5'>
                        <h2 className='text-xl font-semibold'>Value</h2>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Quantity</label>
                            <input id='quantity' type="number" className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 flex items-center gap-2 outline-none'
                                placeholder='Type promotion quantity here...'
                                defaultValue={promotion ? promotion.quantity : 0} min={0}
                                onChange={handleInputChange} />
                        </div>
                        <div className='mt-2 gap-1'>
                            <label className='text-sm font-medium ml-2'>Promotion Value (%)</label>
                            <input id='value' type="number" className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                placeholder='Type promotion value. . .' min={0} max={100}
                                defaultValue={promotion ? promotion.value : 0}
                                onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-5 mt-5'>
                        <h2 className='text-xl font-semibold'>Time</h2>
                        <div className='flex justify-start gap-10 items-center w-full'>
                            <div className='mt-2 gap-1 flex flex-col w-full'>
                                <label className='text-sm font-medium ml-2'>Start Time</label>
                                <input id='start' type="datetime-local" className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2 outline-none'
                                    placeholder='Enter start time...'
                                    defaultValue={promotion && promotion.start ? new Date(promotion.start).toISOString().slice(0, 16) : ""}
                                    onChange={handleInputChange} />
                            </div>
                            <div className='mt-2 gap-1 flex flex-col w-full'>
                                <label className='text-sm font-medium ml-2'>End Time</label>
                                <input id='end' type="datetime-local" className='border border-[#E0E2E7] bg-[#F9F9FC] rounded-md w-full px-3 py-2  outline-none'
                                    placeholder='Enter end time. . .'
                                    defaultValue={promotion && promotion.end ? new Date(promotion.end).toISOString().slice(0, 16) : ""}
                                    onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}