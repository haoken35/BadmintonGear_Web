import "./admin.css";
import Sidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { Montserrat,Inter } from "next/font/google";
import ProtectedRoute from "@/components/ProtectedRoute";
export const metadata = {
    layout: false, // Tắt layout gốc
    title: "BadmintonGear",
    description: "BadmintonGear Store",
    icons: {
        icon: "/images/logo.ico",
        shortcut: "/images/logo.ico",
        apple: "/images/logo.ico",
    },
};

// Cấu hình phông chữ Montserrat
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"], // Chọn các trọng lượng cần thiết
    variable: "--font-montserrat", // Tạo biến CSS để sử dụng
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["500", "600"], // Chọn các trọng lượng cần thiết
    variable: "--font-inter", // Tạo biến CSS để sử dụng
});

export default function AdminLayout({ children }) {
    return (
            <>
            <ProtectedRoute requiredRole="2">
                <div className="flex font-inter">
                    {/* Sidebar */}
                    <Sidebar />
                    {/* Main Content */}
                    <main className="w-full ">
                        <AdminHeader />
                        <div className="px-10 py-10">
                            {children}
                        </div>
                    </main>
                </div>
            </ProtectedRoute>
            </>        

    );
}