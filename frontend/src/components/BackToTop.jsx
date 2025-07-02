import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggle = () => {
            const container = document.querySelector('.home-main');
            const scrollTop = container ? container.scrollTop : window.scrollY;
            setVisible(scrollTop > 300);
        };
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    const scrollToTop = () => {
        const container = document.querySelector('.home-main');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!visible) return null;

    return (
        <button
            className={styles.backToTop}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            ↑ Top
        </button>
    );
}
