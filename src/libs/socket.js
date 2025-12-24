import { io } from "socket.io-client";

// Defer socket initialization to avoid SSR errors
let socket = null;
let lastAuthToken = null;
let authRejected = false;

const resolveSocketUrl = () => {
    const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (explicit) return explicit;

    const api = process.env.NEXT_PUBLIC_API_URL;
    if (api) {
        try {
            return new URL(api).origin;
        } catch {
            // fallthrough
        }
    }

    return "http://localhost:3000";
};

const readCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[$()*+./?[\\\]^{|}-]/g, "\\$&")}=(.*?)(?:;|$)`));
    return match ? decodeURIComponent(match[1]) : null;
};

const decodeJwtPayload = (jwt) => {
    try {
        const parts = String(jwt).split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = payload + "===".slice((payload.length + 3) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getSocket = () => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem("loginToken") || "";
    if (!token) return null;

    if (socket && lastAuthToken !== token) {
        try {
            socket.disconnect();
        } catch {
            // ignore
        }
        socket = null;
        authRejected = false;
    }

    // If backend rejected auth for this token, stop reconnect loops until token changes
    if (authRejected) return null;

    if (!socket) {
        const url = resolveSocketUrl();
        lastAuthToken = token;

        console.log("[socket] init", {
            url,
            token: token
        });

        socket = io(url, {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token: token
            },
            reconnection: true,
            reconnectionAttempts: 5,
        });

        socket.on("connect", () => {
            console.log("[socket] connected", { id: socket.id, url });
        });

        socket.on("disconnect", (reason) => {
            console.log("[socket] disconnected", { reason });
        });

        socket.on("connect_error", (err) => {
            console.error("[socket] connect_error", err?.message || err, err);

            // If backend rejects auth, allow re-init after token refresh without page reload
            const msg = String(err?.message || "").toLowerCase();
            if (msg.includes("invalid token") || msg.includes("authentication")) {
                authRejected = true;
                try {
                    socket.disconnect();
                } catch {
                    // ignore
                }
                socket = null;
            }
        });

        if (process.env.NEXT_PUBLIC_SOCKET_DEBUG === "1") {
            socket.onAny((eventName, ...args) => {
                console.log("[socket] onAny", eventName, ...args);
            });
        }
    }
    return socket;
};

// For backwards compatibility
export { socket };