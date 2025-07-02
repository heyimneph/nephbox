import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    // On mount: read from localStorage (or default to dark)
    useEffect(() => {
        const saved = localStorage.getItem('theme') || 'dark';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
