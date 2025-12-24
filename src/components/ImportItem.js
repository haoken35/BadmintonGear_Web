import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { getDetailByImportId } from '@/service/importDetailService';
import { getProductById } from '@/service/productService';
import { getUserById } from '@/service/userService';

export default function ImportItem({ grn }) {
    const [details, setDetails] = useState([]);
    const [product, setProduct] = useState(null);
    const [staff, setStaff] = useState(null);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const importDetails = await getDetailByImportId(grn.id);
                const res = await getProductById(importDetails[0].Product.id);
                setProduct(res);
                setDetails(importDetails);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };
        const fetchStaff = async () => {
            try {
                const userData = await getUserById(grn.userid);
                setStaff(userData);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        }
        fetchDetails();
        fetchStaff();
    }, [grn.id]);

    return (
        <tr className='bg-(--surface) shadow-md border-b border-(--border) cursor-pointer' onClick={() => { window.location.href = `/importdetail?id=${grn.id}` }}>
            <td className='text-(--primary) font-semibold text-center'>#{grn.id}</td>
            <td className='py-4 flex items-center '>
                {
                    details.length > 0 && (
                        <div className="flex items-center gap-3">
                            {/* Hiển thị sản phẩm đầu tiên */}
                            <Image
                                src={product?.ImagesProducts?.[0]?.url || "/images/unimage.png"}
                                alt={details?.[0]?.Product?.translations?.[0]?.name || "Product image"}
                                width={60}
                                height={60}
                                className="rounded-lg"
                            />
                            <div className='flex flex-col items-start'>
                                <div className="font-medium text-(--text)">{details[0].Product?.translations?.[0]?.name}</div>
                                <div className="text-sm text-(--text2)">
                                    {Number(details[0].Product.price).toLocaleString()} VND x {details[0].quantity}
                                </div>
                                {/* Hiển thị số lượng sản phẩm còn lại */}
                                {details.length > 1 && (
                                    <div className="text-sm text-(--text2)">
                                        +{details.length - 1} more items
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </td>
            <td className='text-(--text2) font-medium'>{new Date(grn.createdAt).toLocaleDateString('vi-VN')}</td>
            <td>
                <div className='flex flex-col gap-2'>
                    <div className='font-medium'>{staff?.name || ""}</div>
                    <div className='text-(--text2) text-sm' >{staff?.email || ""}</div>
                </div>
            </td>
            <td className='text-(--text2) font-medium'>{Number(grn.totalprice).toLocaleString()} VND</td>
        </tr>
    )
}