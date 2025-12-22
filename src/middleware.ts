import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const role = Number(request.cookies.get("role")?.value);
    const token = request.cookies.get("loginToken")?.value;

    // 1. Chỉ admin mới vào được /admin
    if (pathname.startsWith("/admin") && role !== 2 && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && role !== 2 && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Admin không vào được các trang user
    if (
        (pathname.startsWith("/account") || pathname.startsWith("/order") || pathname.startsWith("/address")
            || pathname.startsWith("/cancellation") || pathname.startsWith("/cart") || pathname.startsWith("/category")
            || pathname.startsWith("/checkout") || pathname.startsWith("/completion") || pathname.startsWith("/orderdetail")
            || pathname.startsWith("/product") || pathname.startsWith("/promotion") || pathname.startsWith("/wishlist")
            || pathname === "/") && role === 2) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // 3. Các trang cần đăng nhập, nếu chưa đăng nhập thì redirect về /login
    if (
        (pathname.startsWith("/account") || pathname.startsWith("/order") || pathname.startsWith("/address")
            || pathname.startsWith("/cancellation") || pathname.startsWith("/cart") || pathname.startsWith("/category")
            || pathname.startsWith("/checkout") || pathname.startsWith("/completion") || pathname.startsWith("/orderdetail")
            || pathname.startsWith("/product") || pathname.startsWith("/promotion") || pathname.startsWith("/wishlist")) &&
        !token
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Đã đăng nhập thì không vào được /login, /register
    if (
        (pathname === "/login" || pathname === "/register") &&
        token
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/login",
        "/register",
        "/account/:path*",
        "/order/:path*",
        "/checkout/:path*",
        "/address/:path*",
        "/cancellation/:path*",
        "/cart",
        "/category/:path*",
        "/completion/:path*",
        "/orderdetail/:path*",
        "/product/:path*",
        "/promotion/:path*",
        "/wishlist/:path*",
        "/", // trang chủ
    ],
};