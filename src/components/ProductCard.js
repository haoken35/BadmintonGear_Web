import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getReviewByProductID } from '@/service/reviewService';
import { addCart } from '@/service/cartService';
import { getProductById } from '@/service/productService';

export const ProductCard = ({ product }) => {
    const [rating, setRating] = useState(0);
    const [countReview, setCountReview] = useState(0);
    const [showAddToCart, setShowAddToCart] = useState(false);
    const currentPrice = product.price;

    const fetchReview = async () => {
        const response = await getReviewByProductID(product.id);
        setCountReview(response.length);
        let totalRating = 0;
        response.forEach(review => {
            totalRating += review.rating;
        });
        if (response.length > 0) {
            setRating(totalRating / response.length);
        }
    }

    const handleAddToCart = async () => {
        const profile = localStorage.getItem("userData");
        const userid = JSON.parse(profile).id;
        const item = {
            userid: userid,
            productid: product.id,
            quantity: 1,
            notes: ""
        };
        try {
            const response = await addCart(item);
            if (response) {
                console.log("Item added to cart successfully:", response);
            } else {
                console.error("Failed to add item to cart");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    }

    const handleMouseEnter = () => {
        setShowAddToCart(true);
    };

    const handleMouseLeave = () => {
        setShowAddToCart(false);
    };

    useEffect(() => {
        fetchReview();
        console.log("ProductCard mounted with product:", product);
    }, [])

    return (
        <div className='min-w-[240px] h-[400px] relative bg-white w-[18%] p-3 rounded-xl text-poppins flex flex-col justify-between cursor-pointer'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => window.location.href = `/product?id=${product.id}`} >
            {product.discount > 0 && (
                <div className='absolute top-4 left-4 bg-[#FF8200] text-white text-xs px-2 py-1 rounded'>
                    -{product.discount}%
                </div>
            )}
            <div className='absolute top-4 right-4 bg-[#F5F5F5] p-2 rounded-full'>
                <Image src={"/icons/blwishlistic.png"} alt={"wish"} width={30} height={30} />
            </div>
            <Image src={product?.Imagesproducts?.[0]?.url
                ? product.Imagesproducts[0].url
                : "/images/unimage.png"}
                alt={"Product"}
                width={240}
                height={240}
                className='w-full h-auto object-contain rounded-t-lg mx-auto' />
            {showAddToCart && (
                <button className='w-[100%] absolute bottom-35 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-lg text-center cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent click event
                        handleAddToCart();
                    }}>
                    Add To Cart
                </button>
            )}
            <h3 className='font-semibold text-xl'>{product.name}</h3>
            <div className='flex items-center mt-2'>
                <p className='text-[#FF8200] text-xl'>{Number(currentPrice).toLocaleString()} VND</p>
                {/* <p className='ml-3 text-black opacity-50 text-sm line-through'>${product.price}</p> */}
            </div>
            <div className='flex items-center mt-2 text-xl'>
                {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={index < rating ? 'text-[#FFAD33]' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
                <div className='text-black opacity-50 ml-4'>({countReview})</div>
            </div>

        </div>
    )
}