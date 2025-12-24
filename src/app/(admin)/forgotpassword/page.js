"use client"
import Image from "next/image"
import { useState } from "react"
import { forgotPassword } from "@/service/userService"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState('');
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const submit = async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        if (email === "") {
            setError("Please fill in information.");
            return
        }
        if (!isValidEmail(email)) {
            setError("Please enter email in correct format");
            return;
        }
        try {
            const response = await forgotPassword({ email });
            if (response === "Password reset link sent to your email") {
                router.push("/login");
            }
            else {
                setError("Error sending email. Please try again.")
            }
        }
        catch (error) {
            setError("Error sending email. Please try again.")
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
                <div className="ml-10 mr-10 flex flex-col justify-center items-center">
                    <form
                        id="login-form"
                        className="flex flex-col items-center py-10 h-full"
                        style={{ minHeight: "400px" }}
                    >
                        <h1 className="font-montserrat font-bold text-3xl">Forgot Password</h1>
                        <p className="font-montserrat text-xs mt-3">Enter your email</p>
                        <input id="email" type="text" placeholder="Email " className="w-120 p-2 mt-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required />
                        <div className='w-full text-left mt-5 text-sm text-red-500'>{error}</div>
                        <div className="w-full flex gap-5">
                            <button type="submit" className="pl-10 pr-10 pt-2 pb-2 w-full  mt-10 rounded-xs bg-white text-[#FF8200] border border-[#FF8200] font-montserrat" onClick={() => { router.push("/login") }}>Cancel</button>
                            <button type="submit" className="pl-10 pr-10 pt-2 pb-2 w-full mt-10 rounded-xs bg-[#FF8200] text-white font-montserrat" onClick={submit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}