import React from 'react'
import Image from 'next/image'
import { getUserById } from '@/service/userService';

export default function ReviewItem({ review }) {
    const user = getUserById(review.userid);
    function formatDate(dateString) {
        const date = new Date(dateString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
    return (
        <div key={review.id} className='w-full border-b border-gray-400 py-2 flex items-start justify-between'>
            <div className='flex flex-col gap-2 '>
                <div className='flex items-center gap-2'>
                    <Image src={user && user.Imagesuser ? user.Imagesuser.url : "/images/noavatar.png"} width={50} height={50} alt={user?.name||"user"} className='rounded-full' />
                    <div className='flex flex-col'>
                        <p>{user.name || ""}</p>
                        <div className='flex items-center text-xl'>
                            {Array.from({ length: 5 }, (_, index) => (
                                <span key={index} className={index < review.rating ? 'text-[#FFAD33]' : 'text-gray-300'}>
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
                <p className='text-gray-700'>{review.content}</p>
            </div>
            <p>{formatDate(review.createdAt)}</p>
        </div>
    )
}