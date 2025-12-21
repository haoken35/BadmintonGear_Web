import React from 'react'
import Image from 'next/image';

export default function AdminOrderItem({ order, onCheck }) {
    return (
        <tr className='bg-white shadow-md border-b border-[#F0F1F3]'>
            {onCheck && (<td>
                <input
                    type='checkbox'
                    className='w-5 h-5 accent-[#ff8200] ml-5'
                    checked={!!order.isChecked}
                    onChange={onCheck}
                />
            </td>)}
            <td className='text-[#ff8200] font-semibold text-center'>#{order.id}</td>
            <td className='py-4'>
                <div className="flex items-center gap-3">
                    {/* Hiển thị sản phẩm đầu tiên */}
                    <Image
                        src={order.products[0].image}
                        alt={order.products[0].name}
                        className="rounded-lg"
                        width={50}
                        height={50}
                    />
                    <div>
                        <div className="font-medium">{order.products[0].name}</div>
                        <div className="text-sm text-gray-500">
                            ${order.products[0].price} x {order.products[0].quantity}
                        </div>
                        {/* Hiển thị số lượng sản phẩm còn lại */}
                        {order.products.length > 1 && (
                            <div className="text-sm text-gray-400">
                                +{order.products.length - 1} more items
                            </div>
                        )}
                    </div>
                </div>
            </td>
            {onCheck && (
                <td>
                    <div>
                        <div className='font-medium'>{order.customer.username}</div>
                        <div className='text-gray-500 text-sm' >{order.customer.email}</div>
                    </div>
                </td>)}
            <td className='text-gray-500 font-medium'>${order.total}</td>
            {onCheck && ( <td className='text-gray-500 font-medium'>{order.payment}</td>)}
            <td >
                <div className={`py-1 px-2 rounded-full w-fit ${order.state === "Processing" ?
                    "bg-[#FDF1E8] text-[#ff8200]" : (order.state === "Shipped" ?
                        "bg-[#E8F8FD] text-[#13B2E4]" : (order.state === "Cancelled" ?
                            "bg-[#FEEDEC] text-[#F04438]" : "bg-[#E7F4EE] text-[#0D894F]"))}
                `}>
                    {order.state}
                </div>
            </td>
            {onCheck && (
                <td>
                    <div className='flex justify-center items-center gap-3'>
                        <button>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0002 4.1665C15.1085 4.1665 17.5258 7.59147 18.3768 9.19265C18.6477 9.7025 18.6477 10.2972 18.3768 10.807C17.5258 12.4082 15.1085 15.8332 10.0002 15.8332C4.89188 15.8332 2.4746 12.4082 1.62363 10.807C1.35267 10.2972 1.35267 9.7025 1.62363 9.19265C2.4746 7.59147 4.89188 4.1665 10.0002 4.1665ZM5.69716 7.06458C4.31361 7.98129 3.50572 9.20269 3.09536 9.97482C3.09078 9.98345 3.08889 9.98943 3.08807 9.99271C3.08724 9.99605 3.08708 9.99984 3.08708 9.99984C3.08708 9.99984 3.08724 10.0036 3.08807 10.007C3.08889 10.0102 3.09078 10.0162 3.09536 10.0249C3.50572 10.797 4.31361 12.0184 5.69716 12.9351C5.12594 12.0993 4.79188 11.0886 4.79188 9.99984C4.79188 8.91109 5.12594 7.90037 5.69716 7.06458ZM14.3033 12.9351C15.6868 12.0184 16.4947 10.797 16.905 10.0249C16.9096 10.0162 16.9115 10.0103 16.9123 10.007C16.9129 10.0048 16.9133 10.0017 16.9133 10.0017L16.9133 9.99984L16.913 9.99617L16.9123 9.99271C16.9115 9.98942 16.9096 9.98344 16.905 9.97482C16.4947 9.20269 15.6868 7.9813 14.3033 7.06459C14.8745 7.90038 15.2085 8.91109 15.2085 9.99984C15.2085 11.0886 14.8745 12.0993 14.3033 12.9351ZM6.45854 9.99984C6.45854 8.04383 8.0442 6.45817 10.0002 6.45817C11.9562 6.45817 13.5419 8.04383 13.5419 9.99984C13.5419 11.9558 11.9562 13.5415 10.0002 13.5415C8.0442 13.5415 6.45854 11.9558 6.45854 9.99984Z" fill="#667085" />
                            </svg>
                        </button>
                        <button>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.3047 6.81991C18.281 5.8436 18.281 4.26069 17.3047 3.28438L16.7155 2.69512C15.7391 1.71881 14.1562 1.71881 13.1799 2.69512L3.69097 12.1841C3.34624 12.5288 3.10982 12.9668 3.01082 13.4442L2.34111 16.6735C2.21932 17.2607 2.73906 17.7805 3.32629 17.6587L6.55565 16.989C7.03302 16.89 7.47103 16.6536 7.81577 16.3089L17.3047 6.81991ZM16.1262 4.46289L15.5369 3.87363C15.2115 3.5482 14.6839 3.5482 14.3584 3.87363L13.4745 4.75755L15.2423 6.52531L16.1262 5.6414C16.4516 5.31596 16.4516 4.78833 16.1262 4.46289ZM14.0638 7.70382L12.296 5.93606L4.86948 13.3626C4.75457 13.4775 4.67577 13.6235 4.64277 13.7826L4.23082 15.769L6.21721 15.3571C6.37634 15.3241 6.52234 15.2453 6.63726 15.1303L14.0638 7.70382Z" fill="#667085" />
                            </svg>
                        </button>
                    </div>
            </td>)}
        </tr>
    )
}