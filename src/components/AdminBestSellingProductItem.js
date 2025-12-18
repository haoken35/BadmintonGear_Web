import React from 'react'
import Image from "next/image";

export default function BestSellingProductItem(product) {
    const currentPrice = product.price * (1 - product.discount / 100);
    return (
        <tr className='shadow-xs hover:bg-gray-50'>
            <td>
                <div className='flex gap-2 items-center py-4 px-2'>
                    <Image src={product.image} alt="product" height={50} width={50} className="rounded-md" />
                    <div>{product.name}</div>
                </div>
            </td>
            <td>{product.quantity}</td>
            <td>
                <div className='flex gap-4 items-center'>
                    <div>${currentPrice}</div>
                    {product.discount > 0 && (
                        <div className='line-through rounded-lg  text-gray-500 text-sm'>${product.price}</div>
                    )}
                </div>
            </td>
            <td>
                {product.stock === 0 && (
                    <div className='w-fit px-2 py-1 font-medium text-[#F04438] bg-[#FEEDEC] rounded-full'>
                        Out of stock
                    </div>
                )}
                {product.stock > 0 && product.stock <= 20 && (
                    <div className='w-fit px-2 py-1 font-medium text-[#ff8200] bg-[#FDF1E8] rounded-full'>
                        Low stock
                    </div>
                )}
                {product.stock > 20 && (
                    <div className='w-fit px-2 py-1 font-medium text-[#0D894F] bg-[#E7F4EE] rounded-full'>
                        In stock
                    </div>
                )}
            </td>
        </tr>
    )
}