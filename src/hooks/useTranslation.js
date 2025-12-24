'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function useTranslation() {
    const { language, t } = useLanguage();
    const [, setRefresh] = useState({});

    useEffect(() => {
        const handleLanguageChange = () => {
            // Force re-render when language changes
            setRefresh({});
        };

        window.addEventListener('languageChange', handleLanguageChange);
        return () => window.removeEventListener('languageChange', handleLanguageChange);
    }, []);

    return { language, t };
}
