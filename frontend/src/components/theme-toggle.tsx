"use client"

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const theme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setIsDark(theme === 'dark');
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    if (!mounted) {
        return (
            <div className="w-14 h-8 bg-glass-light dark:bg-glass-dark rounded-full border border-glass-light-hover dark:border-glass-dark-hover"></div>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 bg-glass-light dark:bg-glass-dark border border-glass-light-hover dark:border-glass-dark-hover rounded-full p-1 transition-all duration-300 hover:border-bright-blue dark:hover:border-neon-green focus:outline-none focus:ring-2 focus:ring-bright-blue dark:focus:ring-neon-green focus:ring-opacity-50"
            aria-label="Toggle theme"
        >
            <div
                className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${isDark
                        ? 'translate-x-6 bg-neon-gradient shadow-neon'
                        : 'translate-x-0 bg-gradient-to-r from-bright-blue to-vibrant-pink shadow-lg'
                    }`}
            >
                {isDark ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </div>
        </button>
    );
}
