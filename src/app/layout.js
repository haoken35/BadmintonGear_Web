import "../styles/globals.css";
export const metadata = {
    layout: false, // Tắt layout gốc
};

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased bg-black">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-1/6 bg-gray-200 h-screen p-5">
                        <nav className="flex flex-col gap-4">
                            <a href="/admin/dashboard" className="text-black">Dashboard</a>
                            <a href="/admin/users" className="text-black">Users</a>
                            <a href="/admin/orders" className="text-black">Orders</a>
                            <a href="/admin/products" className="text-black">Products</a>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="w-4/5 p-10">
                        {children}
                    </main>
                </div>
            </body>
        </html>

    );
}