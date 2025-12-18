import { Inter, Montserrat } from "next/font/google";
import "../styles/globals.css";
import "./admin.css";
import Sidebar from "@/components/AdminSidebar";
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
        <html lang="en">
            <body className="antialiased bg-black font-inter">
                <div className="flex">
                    {/* Sidebar */}
                    <Sidebar />
                    {/* Main Content */}
                    <main className="w-4/5 p-10">
                        {children}
                    </main>
                </div>
            </body>
        </html>

    );
}