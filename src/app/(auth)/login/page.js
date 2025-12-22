"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/service/authenticationService";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "@/service/userService";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer"

export default function Login() {
    const [error, setError] = useState(null); // State để lưu thông báo lỗi
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await login(username, password);
            if (response.message === "Login successfully") {
                localStorage.setItem("loginToken", response.token); // Store the token in local storage
                localStorage.setItem("password", password); // Store the password in local storage
                const decoded = jwtDecode(response.token);
                Cookies.set("token", response.token, { expires: 7 }); // Store the token in cookies for 7 days
                Cookies.set("role", decoded.roleid, { expires: 7 }); // Store the user role in cookies for 7 days
                await getUserById(decoded.userid).then((userData) => {
                    localStorage.setItem("userData", JSON.stringify(userData));
                });
                if (decoded.roleid === 2) {
                    router.push("/dashboard");
                }
                else {
                    router.push("/");
                }

            } else {
                setError("Username or password is incorrect. Please try again.");
                console.log("Username or password is incorrect. Please try again.");
            }
            // Handle successful login (e.g., redirect to dashboard)
        } catch (error) {
            setError("Login failed. Please try again.");
            console.log("Login failed:", error);
            // Handle login failure (e.g., show error message)
        }
    }
    return (
        <div className="w-full h-full">
            {/* <Header /> */}
            <div className="flex items-center my-20 mx-auto h-auto w-fit bg-[#FFFFF6] rounded-xl text-montserrat">
                <Image src="/images/loginimage.jpg" alt="image" width={350} height={400} className="rounded-xl" />
                <div className="ml-10 mr-10 w-fit gap-5 ">
                    <form id="login-form" className="w-fit">
                        <h1 className="font-montserrat font-bold text-3xl w-fit">Log in to BadmintonGear</h1>
                        <p className="font-montserrat text-xs mt-3 w-fit">Welcome back! Please enter your details.</p>
                        <input id="username" type="text" placeholder="Username" className="w-4/5 p-2 mt-5 mr-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required />
                        <input id="password" type="password" placeholder="Password" className="w-4/5 p-2 mt-5 mr-5 border-b border-gray-400 focus:border-[#FF8200] outline-none" required />
                        {error && (<div className="text-red-500 text-sm mt-5">{error}</div>)}
                        <div className="flex items-center mt-10 w-4/5 relative">
                            <button type="submit" onClick={handleLogin} className="pl-10 pr-10 pt-2 pb-2 rounded-xs bg-[#FF8200] text-white font-montserrat" >Log in</button>
                            <a className="absolute right-0 text-[#ff8200] text-xs" href="/forgotpassword">Forget Password?</a>
                        </div>
                    </form>
                    <div className="text-center mt-10 w-3/4">Don't you have an account?
                        <a href="/register" className="text-[#ff8200] font-bold ml-2">Register</a>
                    </div>

                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}