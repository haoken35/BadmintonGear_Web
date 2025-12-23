import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const roleRaw = request.cookies.get("role")?.value;
    const token = request.cookies.get("token")?.value;
    const role = Number(roleRaw);
    console.log("[MIDDLEWARE] Path:", pathname, "| roleRaw:", roleRaw, "| role:", role, "| token:", token);

    //1. Nếu không có token thì redirect về /login (trừ khi đã ở trang login/register)
    if (!token && pathname !== "/login" && pathname !== "/register") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Chỉ admin mới vào được /admin
    if (pathname.startsWith("/admin") && role !== 2 && token) {
        alert("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản quản trị.");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Đã đăng nhập thì không vào được /login, /register
    if (
        (pathname === "/login" || pathname === "/register") &&
        token
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/login",
        "/register",
    ],
};