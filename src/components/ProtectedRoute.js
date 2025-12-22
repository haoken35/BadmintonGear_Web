"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, requiredRole }) {
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("loginToken");
        const roleid = sessionStorage.getItem("role");
        if (!token) {
            setIsAllowed(false);
            alert("Please login to access this page!");
            router.replace("/login");
        } else if (requiredRole && roleid !== requiredRole) {
            setIsAllowed(false);
            alert("You do not have permission to access this page!");
            router.replace("/");

        } else {
            setIsAllowed(true);
        }
    }, [requiredRole, router]);

    // Chỉ render children khi đã xác định quyền truy cập
    if (isAllowed === null) return null; // hoặc loading...

    if (!isAllowed) return null; // Không render gì khi không đủ quyền

    return children;
}