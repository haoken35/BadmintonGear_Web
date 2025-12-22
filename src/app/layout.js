import { Poppins, Montserrat } from "next/font/google";
import "../styles/globals.css";

// Cấu hình phông chữ Poppins
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700"], // Chọn các trọng lượng cần thiết
    variable: "--font-poppins", // Tạo biến CSS để sử dụng
});

// Cấu hình phông chữ Montserrat
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"], // Chọn các trọng lượng cần thiết
    variable: "--font-montserrat", // Tạo biến CSS để sử dụng
});

export const metadata = {
    title: "BadmintonGear",
    description: "BadmintonGear Store",
    icons: {
        icon: "/images/logo.ico",
        shortcut: "/images/logo.ico",
        apple: "/images/logo.ico",
    },
    layout: false, // Tắt layout gốc

};

export default function RootLayout({ children }) {

    return (
        <html lang="en" >
            <body >
                {children}
            </body>
        </html>
    );
}