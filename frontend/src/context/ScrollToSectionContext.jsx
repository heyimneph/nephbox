import React, { createContext, useRef } from 'react';

export const ScrollToSectionContext = createContext();

export function ScrollToSectionProvider({ children }) {
    // Holds the target section id if coming from a non-homepage route
    const pendingSection = useRef(null);

    // Scrolls to a section by id
    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <ScrollToSectionContext.Provider value={{ pendingSection, scrollToSection }}>
            {children}
        </ScrollToSectionContext.Provider>
    );
}
