"use client"
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [user, setUser] = useState(null); // State để lưu thông tin người dùng
    const router = useRouter();

    const visibleMennu = () => {
        setMenuVisible(!menuVisible);
    };

    const logout = () => {
        localStorage.removeItem("loginToken");
        Cookies.remove("token");
        Cookies.remove("role");
        localStorage.removeItem("userData");
        localStorage.removeItem("password");
        setUser(null);
        router.push("/login");
    }

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('userData'));
        if (profile) {
            setUser(profile);
        }
    }, []);

    return (
        <div className='fixed top-0 right-0 z-50 bg-white w-full'>
            <div className='flex items-center justify-end w-full h-fit py-2 gap-5 px-10 bg-white'>
                <div className='flex items-center gap-5 border-r border-gray-200 px-5'>
                    <button>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V3.57088C7.60769 4.0561 4.99997 6.97352 4.99997 10.5V15.5L4.28237 16.7558C3.71095 17.7558 4.433 19 5.58474 19H8.12602C8.57006 20.7252 10.1362 22 12 22C13.8638 22 15.4299 20.7252 15.874 19H18.4152C19.5669 19 20.289 17.7558 19.7176 16.7558L19 15.5V10.5C19 6.97354 16.3923 4.05614 13 3.57089V3ZM6.99997 16.0311L6.44633 17H17.5536L17 16.0311V10.5C17 7.73858 14.7614 5.5 12 5.5C9.23854 5.5 6.99997 7.73858 6.99997 10.5V16.0311ZM12 20C11.2597 20 10.6134 19.5978 10.2676 19H13.7324C13.3866 19.5978 12.7403 20 12 20Z" fill="#667085" />
                        </svg>
                    </button>
                    <button onClick={() => router.push('/chat')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 7C2 5.34315 3.34315 4 5 4H19C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7ZM18.3334 6H5.6667L11.4 10.3C11.7556 10.5667 12.2445 10.5667 12.6 10.3L18.3334 6ZM4 7.24998V17C4 17.5523 4.44772 18 5 18H19C19.5523 18 20 17.5523 20 17V7.25002L13.8 11.9C12.7334 12.7 11.2667 12.7 10.2 11.9L4 7.24998Z" fill="#667085" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-3 ">
                    {
                        user ? (<div className="flex items-center gap-2"
                            onClick={visibleMennu}>
                            <Image src={user && user.Imagesuser ? user.Imagesuser.url : "/images/noavatar.png"} alt="account" height={40} width={40} className='rounded-full' />
                            <div className='flex flex-col gap-1'>
                                <a id="account" href="/admin/account">{user.username}</a>
                                <span className="text-sm text-gray-500">Admin</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform duration-300 ${menuVisible ? "rotate-180" : ""}`}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.5891 6.91058C15.2637 6.58514 14.736 6.58514 14.4106 6.91058L9.99984 11.3213L5.58909 6.91058C5.26366 6.58514 4.73602 6.58514 4.41058 6.91058C4.08514 7.23602 4.08514 7.76366 4.41058 8.08909L9.70521 13.3837C9.86793 13.5464 10.1317 13.5464 10.2945 13.3837L15.5891 8.08909C15.9145 7.76366 15.9145 7.23602 15.5891 6.91058Z" fill="#667085" />
                            </svg>
                        </div>) : (<div className="flex items-center gap-2">

                            <a id="login" href="/login">Register / Login</a>
                        </div>)
                    }
                </div>
                {menuVisible && (
                    <div className="absolute right-8 top-15 px-5 py-5 bg-[#000000ee] rounded-md text-[#FF8200] cursor-pointer" onClick={visibleMennu}>
                        <div className="mb-5 flex items-center gap-2" onClick={() => router.push("/admin/account")}>
                            <Image src="/icons/accountic.png" alt="account" height={25} width={25} />
                            <span>Manage My Account</span>
                        </div>
                        <div className="flex items-center gap-2"
                            onClick={logout}>
                            <Image src="/icons/logoutic.png" alt="logout" height={25} width={25} />
                            <span>Log out</span>
                        </div>
                    </div>)}
            </div>
        </div>
    )
}