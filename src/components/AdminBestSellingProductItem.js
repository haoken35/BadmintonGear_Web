import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { getProductById } from '@/service/productService';

export default function BestSellingProductItem(product) {
    console.log('product', product);
    const [pro, setPro] = useState(product);
    const currentPrice = product.price

    return (
        <tr className='bg-(--surface) hover:bg-(--surface2) shadow-md border-b border-(--border) tex-(--muted)'>
            <td>
                <div className='flex gap-2 items-center py-4 px-2'>
                    <Image src={pro.ImagesProducts && pro.ImagesProducts[0] ? pro.ImagesProducts[0].url : "/images/unimage.png"} alt="product" height={50} width={50} className="rounded-md" />
                    <div className='font-medium text-(--text)'>{pro.translations?.[0]?.name}</div>
                </div>
            </td>
            <td className='text-(--text2) text-center'>{pro.brand}</td>
            <td className='text-(--text2) text-center'>{pro.totalSold}</td>
            <td>
                <div className='flex gap-4 items-center text-(--text2) text-center'>
                    <div>{Number(currentPrice).toLocaleString()} VND</div>
                    {pro.Product?.discount > 0 && (
                        <div className='line-through rounded-lg  text-gray-500 text-sm'>{Number(pro.Product.price).toLocaleString()} VND</div>
                    )}
                </div>
            </td>
            <td>
                {pro.quantity === 0 && (
                    <div className='w-fit px-2 py-1 font-medium text-[#F04438] bg-[#FEEDEC] rounded-full'>
                        Out of stock
                    </div>
                )}
                {pro.quantity > 0 && pro.quantity <= 20 && (
                    <div className='w-fit px-2 py-1 font-medium text-(--primary) bg-(--primary)/30 rounded-full'>
                        Low stock
                    </div>
                )}
                {pro.quantity > 20 && (
                    <div className='w-fit px-2 py-1 font-medium text-[#0D894F] bg-[#E7F4EE] rounded-full'>
                        In stock
                    </div>
                )}
            </td>
        </tr>
    )
}