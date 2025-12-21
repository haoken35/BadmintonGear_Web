import React from 'react'
import Image from 'next/image'

export default function CustomerItem({customer}) {
    const order = 0; // Placeholder for order count
    const balance = 0;
    return (
        <tr className='bg-white shadow-md border-b border-[#F0F1F3]'>
            <td>
                <div className='flex items-center gap-3 py-4 px-2'>
                    <Image src={customer.image} alt="customer" width={50} height={50} className='rounded-full' />
                    <div>
                        <h1 className='text-[#344054] font-semibold'>{customer.name}</h1>
                        <p className='text-[#667085] text-sm'>{customer.email}</p>
                    </div>
                </div>
            </td>
            <td className='py-4'>{customer.phone}</td>
            <td >{order}</td>
            <td>{balance}</td>
            <td><div className={`w-fit px-2 py-1 rounded-full ${customer.status ? "text-[#0D894F] bg-[#E7F4EE]" : "text-[#F04438] bg-[#FEEDEC]"}`}>
                    {customer.status?"Active":"Blocked"}
                </div></td>
            <td >
                {customer.createdAt}
            </td>
            
        </tr>
    )
}