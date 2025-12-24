"use client";
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message, opts = {}) => {
        const id = Math.random().toString(36).slice(2);
        const type = opts.type || "info"; // info | success | error | warning
        const duration = opts.duration ?? 3500;
        const title = opts.title || null;

        setToasts((prev) => [
            ...prev,
            { id, message, type, duration, title }
        ]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
        return id;
    }, [removeToast]);

    const api = useMemo(() => ({
        addToast,
        removeToast,
        show: (msg, opts = {}) => addToast(msg, opts),
        success: (msg, opts = {}) => addToast(msg, { ...opts, type: "success" }),
        error: (msg, opts = {}) => addToast(msg, { ...opts, type: "error" }),
        warning: (msg, opts = {}) => addToast(msg, { ...opts, type: "warning" }),
        info: (msg, opts = {}) => addToast(msg, { ...opts, type: "info" }),
    }), [addToast, removeToast]);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}

function ToastContainer({ toasts, onClose }) {
    return (
        <div className="fixed bottom-12 right-20 z-50 flex flex-col items-center gap-3">
            {toasts.map((t) => (
                <Toast key={t.id} toast={t} onClose={() => onClose(t.id)} />
            ))}
        </div>
    );
}

function Toast({ toast, onClose }) {
    const { message, type, title } = toast;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 10);
        return () => clearTimeout(t);
    }, []);

    const cfg = getToastConfig(type);
    const defaultTitle = cfg.defaultTitle;
    const titleText = title || defaultTitle;

    return (
        <div
            className={"min-w-60 max-w-[640px] shadow-lg rounded-xl px-4 py-3 border-l-4 transition-all duration-300"}
            style={{
                borderLeftColor: cfg.borderColor,
                background: "var(--bg, #ffffff)",
                color: "var(--text, #111827)",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(-8px)",
            }}
            role="status"
        >
            <div className="flex items-start gap-3">
                <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 36, height: 36, backgroundColor: cfg.iconBg }}
                >
                    {cfg.icon}
                </div>
                <div className="flex-1 pr-1">
                    <div className="text-sm font-semibold leading-5 mb-1">{titleText}</div>
                    {message ? (
                        <div className="text-sm leading-5 opacity-80">{message}</div>
                    ) : null}
                </div>
                <button onClick={onClose} aria-label="Close" className="p-1 opacity-80 hover:opacity-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function getToastConfig(type) {
    switch (type) {
        case "success":
            return {
                borderColor: "#10b981",
                iconBg: "#10b981",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 11L12 14L22 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                defaultTitle: "Success!",
            };
        case "error":
            return {
                borderColor: "#ef4444",
                iconBg: "#ef4444",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" />
                        <path d="M15 9l-6 6M9 9l6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ),
                defaultTitle: "Error!",
            };
        case "warning":
            return {
                borderColor: "#f59e0b",
                iconBg: "#f59e0b",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 9v4M12 17h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                defaultTitle: "Warning!",
            };
        case "info":
        default:
            return {
                borderColor: "#3b82f6",
                iconBg: "#3b82f6",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" />
                        <path d="M12 16v-4M12 8h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                defaultTitle: "Info",
            };
    }
}
