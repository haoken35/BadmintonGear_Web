'use client';
import { useEffect } from 'react';

/**
 * ThemeInitializer runs ONCE when the app first loads
 * It sets up the theme before any components render
 * This prevents theme reload when navigating between pages
 */
export function ThemeInitializer() {
    useEffect(() => {
        // This effect only runs ONCE on app load (mounted from root layout)
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            // First time - use system preference
            if (prefersDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }, []); // Empty dependency - runs only once

    return null; // Component doesn't render anything
}
