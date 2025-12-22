"use client"
import Image from "next/image"
import { useState } from "react"
import { createUser } from "@/service/userService"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [inputUser, setInputUser] = useState("");

    const handleInputChange = (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        setInputUser({
            username,
            email,
            phonenumber: phone,
            password,
            roleid: 1,
        })
    }
    const saveUser = async (e) => {
        e.preventDefault();
        if (!inputUser || !inputUser.username || !inputUser.email || !inputUser.phonenumber || !inputUser.password) {
            setError("Please fill in information.");
            return
        }
        const response = await createUser(inputUser);
        if (response) {
            router.push("/login");
        }
        else {
            setError("Error creating user. Please try again.")
        }
    }
    return (
        <div>
            <div className="flex items-stretch my-20 mx-auto bg-[#FFFFF6] rounded-xl text-montserrat w-fit">
                <div className="flex">
                    <Image
                        src="/images/loginimage.jpg"
                        alt="image"
                        width={400}
                        height={400}
                        className="rounded-xl object-cover h-full"
                        style={{ height: "100%" }}
                    />
                </div>
                <div className="ml-10 mr-10 flex flex-col justify-center">
                    <form
                        id="login-form"
                        className="flex flex-col items-center py-10 h-full"
                        style={{ minHeight: "400px" }}
                    >
                        <h1 className="font-montserrat font-bold text-3xl">Create an account</h1>
                        <p className="font-montserrat text-xs mt-3">Enter your account info below</p>
                        <input id="username" type="text" placeholder="Username" className="w-120 p-2 mt-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required onChange={handleInputChange} />
                        <input id="phone" type="text" placeholder="Phone Number" className="w-120 p-2 mt-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required onChange={handleInputChange} />
                        <input id="email" type="text" placeholder="Email " className="w-120 p-2 mt-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required onChange={handleInputChange} />
                        <input id="password" type="password" placeholder="Password" className="w-120 p-2 mt-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required onChange={handleInputChange} />
                        <div className="text-red text-sm">{error}</div>
                        <button type="submit" className="pl-10 pr-10 pt-2 pb-2 w-120 mt-10 rounded-xs bg-[#FF8200] text-white font-montserrat" onClick={saveUser}>Create Account</button>
                        <button className="pl-10 pr-10 pt-2 pb-2 w-120 rounded-xs mt-5 border border-gray-400 font-montserrat flex items-center justify-center">
                            <Image src="/icons/googleic.png" alt="google" width={25} height={25} className="mr-6" />
                            Sign Up With Google
                        </button>
                    </form>
                    <div className="text-center mt-10 w-120 mb-10">
                        Already have account?
                        <a href="/login" className="text-[#ff8200] font-bold ml-2">Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}