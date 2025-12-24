import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getProductById } from '@/service/productService'

export default function OrderDetailItem({ item }) {
    const [product, setProduct] = useState(item.product)

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
        <tr>
            <td className='py-4'>
                <div className='flex items-center gap-2'>
                    <Image
                        src={product && product.ImagesProducts ? product.ImagesProducts[0].url : "/images/unimage.png"}
                        alt={product ? product.name : "Product Image"}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                    <div>{item.Product.name}</div>
                </div>
            </td>
            <td>{item.quantity}</td>
            <td>{Number(item.Product.price).toLocaleString()} VND</td>
            <td>{Number(item.quantity * item.Product.price).toLocaleString()} VND</td>
        </tr>
    )
}