'use client';
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { ToastProvider } from "@/components/ToastProvider";
import { Suspense } from "react";

export default function ClientWrapper({ children, initialLanguage = 'en' }) {
    return (
        <LanguageProvider initialLanguage={initialLanguage}>
            <ThemeInitializer />
            <ToastProvider>
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </ToastProvider>
        </LanguageProvider>
    );
}
