import { Poppins, Montserrat } from "next/font/google";
import "../styles/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import { cookies } from "next/headers";

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

export default async function RootLayout({ children }) {
    let initialLanguage = 'en';
    try {
        const cookieStore = await cookies();
        const getter = cookieStore && typeof cookieStore.get === 'function' ? cookieStore.get : undefined;
        const langCookie = getter ? getter('language') : undefined;
        if (langCookie && langCookie.value) {
            initialLanguage = langCookie.value;
        }
    } catch {}

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                const savedTheme = localStorage.getItem('theme');
                                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                const isDark = (savedTheme === 'dark') || (!savedTheme && prefersDark);
                                
                                if (isDark) {
                                    document.documentElement.classList.add('dark');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                }
                            } catch (e) {}
                        })();
                    `
                }} />
            </head>
            <body >
                <ClientWrapper initialLanguage={initialLanguage}>
                    {children}
                </ClientWrapper>
            </body>
        </html>
    );
}