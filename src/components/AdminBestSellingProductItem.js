import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { getProductById } from '@/service/productService';

export default function BestSellingProductItem(product) {
    const [currentPrice, setCurrentPrice] = useState(0);
    const [pro, setPro] = useState(product);

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getProductById(product.productid);
            setCurrentPrice(productData.price);
            setPro(productData);
        };
        fetchProduct();
    }, [product.productid]);

    return (
        <tr className='bg-white shadow-md border-b border-[#F0F1F3]'>
            <td>
                <div className='flex gap-2 items-center py-4 px-2'>
                    <Image src={pro.ImagesProducts && pro.ImagesProducts[0] ? pro.ImagesProducts[0].url : "/images/unimage.png"} alt="product" height={50} width={50} className="rounded-md" />
                    <div>{product.Product?.name}</div>
                </div>
            </td>
            <td>{product.totalSold}</td>
            <td>
                <div className='flex gap-4 items-center'>
                     <div>{Number(currentPrice).toLocaleString()} VND</div>
                    {product.Product?.discount > 0 && (
                        <div className='line-through rounded-lg  text-gray-500 text-sm'>{Number(product.Product.price).toLocaleString()} VND</div>
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
                    <div className='w-fit px-2 py-1 font-medium text-[#ff8200] bg-[#FDF1E8] rounded-full'>
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