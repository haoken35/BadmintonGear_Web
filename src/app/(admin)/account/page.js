"use client"
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import Image from 'next/image';

export default function Account() {
    const [user, setUser] = useState({
        name: "John Doe",
        username: "johndoe",
        position: "admin",
        email: "john@example.com",
        phone: "123-456-7890",
        image: "/images/user1.png",
    });

    // useEffect(() => {
    //     const storedUser = Cookies.get("user"); // Lấy thông tin người dùng từ cookie
    //     if (storedUser) {
    //         setUser(storedUser); // Nếu có dữ liệu, cập nhật state `user`
    //     }
    // }, []);
    return (
        <div className='px-2 py-5'>
            <div>
                <h1 className='text-3xl font-bold'>Account</h1>
                <div id="roadmap" className="flex items-center mt-2">
                    <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                    <label className="ml-3 mr-3">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                        </svg>
                    </label>
                    <a className="text-[#667085]" href="/account">Account</a>
                </div>
            </div>
            <div className='grid grid-cols-[20%_1fr] gap-5 mt-10'>
                <div className='flex flex-col gap-3 font-medium' >
                    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full p-1">
                        <div className="bg-[#ff8200] h-35 w-full rounded-sm"></div>
                        <div className="flex flex-col items-center -mt-20">
                            <Image src={user.image} alt="user" width={150} height={150} className="rounded-full border-4 border-white" />
                            <h2 className="mt-2 text-lg font-semibold text-gray-800">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.position}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full bg-white pb-10'>
                    <div className='mt-10 mx-auto w-4/5'>
                        <p className='text-[#ff8200] text-xl'>Edit Your Profile</p>
                        <div className='flex flex-col gap-1 mt-5'>
                            <label className='text-gray-500'>Name</label>
                            <input type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.name : ""} />
                        </div>
                        <div className='flex w-full gap-5 mt-5 justify-between'>
                            <div className='flex flex-col gap-1 w-3/7'>
                                <label className='text-gray-500 '>Email</label>
                                <input type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.email : ""} />
                            </div>
                            <div className='flex flex-col gap-1 w-3/7'>
                                <label className='text-gray-500'>Phone Number</label>
                                <input type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.phone : ""} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 mt-5'>
                            <label className='text-gray-500'>Password Change</label>
                            <input type="password" className='bg-gray-100 rounded-xs p-2' placeholder='Current Password' />
                            <input type="text" className='bg-gray-100 rounded-xs p-2' placeholder='New Password' />
                            <input type="text" className='bg-gray-100 rounded-xs p-2' placeholder='Confirm New Password' />
                        </div>
                        <div className='flex justify-end gap-5 items-center mt-5 mr-5'>
                            <button className='px-4 py-2 rounded-xs'>Cancel</button>
                            <button className='bg-[#ff8200] text-white px-4 py-2 rounded-xs'>Save Changes</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}