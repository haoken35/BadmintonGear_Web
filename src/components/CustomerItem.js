import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getOrderByUserId } from '@/service/orderService'

export default function CustomerItem({ user }) {
    const [orderCount, setOrderCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        const fetchOrder = async () => {
            const order = await getOrderByUserId(user.id);
            console.log(order);
            setOrderCount(order.length);
            setTotalAmount(order.reduce((total, order) => total + order.totalprice, 0));
        }
        fetchOrder();
    }, [])
    return (
        <tr className='bg-(--surface) shadow-md border-b border-(--border) text-(--text2) cursor-pointer hover:bg-(--surface2)'
            onClick={() => window.location.href = `/customerdetail?id=${user.id}`}>
            <td>
                <div className='flex items-center gap-3 py-4 px-2'>
                    <Image src={"/images/user1.png"} alt="customer" width={50} height={50} className='rounded-full' />
                    <div>
                        <h1 className='text-(--text) font-semibold' >{user.name}</h1>
                        <p className='text-(--text2) text-sm'>{user.email}</p>
                    </div>
                </div>
            </td>
            <td className='py-4 text-center'>{user.phonenumber}</td>
            <td className='py-4 text-center'>{user.address}</td>
            <td className='py-4 text-center'>{orderCount}</td>
            <td className='py-4 text-center'>{Number(totalAmount).toLocaleString()} VND</td>
            {/* <td><div className={`w-fit px-2 py-1 rounded-full ${!user.status ? "text-[#0D894F] bg-[#E7F4EE]" : "text-[#F04438] bg-[#FEEDEC]"}`}>
                {!user.status ? "Active" : "Blocked"}
            </div></td> */}
            <td className='py-4 text-center'>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })}
            </td>

        </tr>
    )
}