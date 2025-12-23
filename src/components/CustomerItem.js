import React from 'react'
import Image from 'next/image'

export default function CustomerItem({ user }) {
    const order = 0; // Placeholder for order count
    const balance = 0;
    return (
        <tr className='bg-white shadow-md border-b border-[#F0F1F3]'>
            <td>
                <div className='flex items-center gap-3 py-4 px-2'>
                    <Image src={"/images/user1.png"} alt="customer" width={50} height={50} className='rounded-full' />
                    <div>
                        <h1 className='text-[#344054] font-semibold' >{user.name}</h1>
                        <p className='text-[#667085] text-sm'>{user.email}</p>
                    </div>
                </div>
            </td>
            <td className='py-4'>{user.phonenumber}</td>
            <td className='py-4'>{user.address}</td>
            <td className='text-center'>{order}</td>
            <td className='text-center'>{balance}</td>
            <td>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })}
            </td>

        </tr>
    )
}