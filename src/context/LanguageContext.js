'use client';
import React, { createContext, useContext, useState } from 'react';
import { translations } from '@/translations/translations';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children, initialLanguage = 'en' }) {
    const [language, setLanguage] = useState(initialLanguage);

    // Cập nhật ngôn ngữ và lưu vào localStorage
    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);

        // Sync to cookie for SSR consistency
        try {
            document.cookie = `language=${newLanguage}; path=/; max-age=31536000`;
        } catch {}

        // Phát sự kiện để các component khác lắng nghe
        window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    const value = { language, changeLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Return a default value during hydration instead of throwing
        return {
            language: 'en',
            changeLanguage: () => {},
            t: (key) => key
        };
    }
    return context;
}
