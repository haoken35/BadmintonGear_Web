import React from 'react'
import Image from 'next/image'

export default function OrderDetailItem({item}) {
    return (
        <tr>
            <td>
                <div className='flex items-center gap-2'>
                    <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                    <div>{item.product.name}</div>
                </div>
            </td>
            <td>{item.product.sku}</td>
            <td>{item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.quantity * item.price}</td>
        </tr>
    )
}