import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getProductById } from '@/service/productService'

export default function ImportDetailItem({ item }) {
    const [product, setProduct] = useState(item.Product)

    useEffect(() => {
        async function fetchProduct() {
            try {
                const productData = await getProductById(item.Product.id)
                setProduct(productData)
            } catch (error) {
                console.error('Error fetching product:', error)
            }
        }
        fetchProduct()
    }, [item.Product.id])

    return (
        <tr className='text-(--text) bg-(--surface)'>
            <td className='py-4'>
                <div className='flex items-center gap-2'>
                    <Image
                        src={product && product.ImagesProducts ? product.ImagesProducts[0].url : "/images/unimage.png"}
                        alt={product ? product.translations?.[0]?.name : "Product Image"}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                    <div>{item.Product.translations?.[0]?.name}</div>
                </div>
            </td>
            <td>{item.quantity}</td>
            <td>{Number(item.price).toLocaleString()} VND</td>
            <td>{Number(item.quantity * item.price).toLocaleString()} VND</td>
        </tr>
    )
}