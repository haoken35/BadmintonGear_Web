"use client"
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import Image from 'next/image';
import { changePassword, updateUser } from '@/service/userService';
import { useRouter } from 'next/navigation';

export default function Account() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [updatedUser, setUpdatedUser] = useState(null);
    const [password, setPassword] = useState("");
    const route = useRouter();

    function isValidEmail(email) {
        // Regex kiểm tra định dạng email cơ bản
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const checkValidInput = () => {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const phonenumber = document.getElementById('phonenumber').value;
        setUpdatedUser({
            name: name,
            email: email,
            phonenumber: phonenumber
        })
        if (name === "" || phonenumber === "") {
            setError('Please fill in all fields');
        }
        else if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
        } else {
            setError('');
        }
    }

    const handleChangePassword = async () => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const password = document.getElementById('password').value;
        setPassword(newPassword);
        if (password !== "" && password !== localStorage.getItem("password")) {
            setError('Current password is incorrect');
        }
        else if (newPassword.length < 6 && newPassword !== "") {
            setError('New password must be at least 6 characters long');
        }
        else if (confirmPassword !== newPassword) {
            setError('Confirm password does not match new password');
        }
        else {
            setError('')
        }
    }

    const handleCancel = () => {
        setUser(user);
        document.getElementById('newPassword').value = "";
        document.getElementById('confirmPassword').value = "";
        document.getElementById('password').value = "";
        setUpdatedUser(null);
        setError("");
    }
    
    const handleSaveChanges = async () => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const password = document.getElementById('password').value;
        let response = null;
        if (password !== "" && newPassword !== "" && confirmPassword !== "" && error === "") {
            const passwordData = {
                oldpass: password,
                newpass: newPassword,
                passagain: confirmPassword
            }
            try {
                response = await changePassword(passwordData);
                console.log(response);
                if (response === "Password changed successfully") {
                    alert("Password changed successfully");
                    localStorage.setItem("password", newPassword); // Cập nhật mật khẩu trong localStorage
                    window.location.reload(); // Tải lại trang để cập nhật thông tin người dùng
                }
                else alert("Failed to change password. Please try again.");
            }
            catch (err) {
                console.error("Error changing password:", err);
                alert("Failed to change password", err);
                return;
            }
        }
        if (updatedUser !== null && (updatedUser.name !== user.name || updatedUser.email !== user.email || updatedUser.phonenumber !== user.phonenumber)) {
            try {
                response = await updateUser(user.id, updatedUser);
                if (response.success) {
                    let update = JSON.parse(localStorage.getItem("userData"));
                    update.name = response.name; // Cập nhật tên người dùng
                    update.email = response.email; // Cập nhật email người dùng
                    update.phonenumber = response.phonenumber; // Cập nhật số điện thoại người dùng
                    update.updatedAt = response.updatedAt; // Cập nhật thời gian cập nhật
                    setUser(update);
                    localStorage.setItem("userData", JSON.stringify(update)); // Cập nhật dữ liệu người dùng trong localStorage
                    localStorage.setItem("password", newPassword); // Cập nhật mật khẩu trong localStorage
                    setUpdatedUser(null); // Đặt lại state `updatedUser` sau khi lưu thay đổi
                    window.location.reload(); // Tải lại trang để cập nhật thông tin người dùng

                }
                else console.error("Failed to change password: No response received");
            }
            catch (err) {
                alert("Failed to update user information. Please try again.");
                console.error("Error updating user:", err);
                setError("Failed to update user information. Please try again.");
                return;
            }
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Nếu có dữ liệu, cập nhật state `user`
        }
    }, []);
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
                        <div className="flex flex-col items-center -mt-20 gap-5 mb-10">
                            <Image src={"/images/user1.png"} alt="user" width={150} height={150} className="rounded-full border-4 border-white" />
                            <h2 className="mt-2 text-xl font-semibold text-gray-800">{user ? user.name : ""}</h2>
                            <p className="text-md text-gray-500">{user ? user.username : ""}</p>
                            <p className="text-md text-gray-500">{user && user.Role ? user.Role.name : ""}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full bg-white pb-10'>
                    <div className='mt-10 mx-auto w-4/5'>
                        <p className='text-[#ff8200] text-xl'>Edit Your Profile</p>
                        <div className='flex flex-col gap-1 mt-5'>
                            <label className='text-gray-500'>Name</label>
                            <input id='name' type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.name : ""} onChange={checkValidInput} />
                        </div>
                        <div className='flex w-full gap-5 mt-5 justify-between'>
                            <div className='flex flex-col gap-1 w-3/7'>
                                <label className='text-gray-500 '>Email</label>
                                <input id='email' type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.email : ""} onChange={checkValidInput} />
                            </div>
                            <div className='flex flex-col gap-1 w-3/7'>
                                <label className='text-gray-500'>Phone Number</label>
                                <input id='phonenumber' type="text" className='bg-gray-100 rounded-xs p-2' defaultValue={user ? user.phonenumber : ""} onChange={checkValidInput} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 mt-5'>
                            <label className='text-gray-500'>Password Change</label>
                            <input id='password' type="password" className='bg-gray-100 rounded-xs p-2' placeholder='Current Password' onChange={handleChangePassword} />
                            <input id='newPassword' type="password" className='bg-gray-100 rounded-xs p-2' placeholder='New Password' onChange={handleChangePassword} />
                            <input id='confirmPassword' type="password" className='bg-gray-100 rounded-xs p-2' placeholder='Confirm New Password' onChange={handleChangePassword} />
                            <div>{error}</div>
                        </div>
                        <div className='flex justify-end gap-5 items-center mt-5 mr-5'>
                            <button className='px-4 py-2 rounded-xs cursor-pointer' onClick={handleCancel}>Cancel</button>
                            <button className={`bg-[#ff8200] text-white px-4 py-2 rounded-xs cursor-pointer ${(error !== "" || (!updatedUser && password === "") || (updatedUser && updatedUser.name === user.name &&
                                updatedUser.email === user.email && updatedUser.phonenumber === user.phonenumber)) ? "disabled bg-gray-700" : ""}`}
                                onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}