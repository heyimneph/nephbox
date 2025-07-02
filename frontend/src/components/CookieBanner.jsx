import React, { useEffect, useState } from 'react';
import styles from './CookieBanner.module.css';

const COOKIE_KEY = 'cookieConsent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_KEY);
        if (!consent) setVisible(true);
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        setVisible(false);
    };

    const handleEssential = () => {
        localStorage.setItem(COOKIE_KEY, 'essential');
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_KEY, 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.text}>
                This website uses cookies for basic functionality and to enhance your experience.
                See our&nbsp;
                <a href="/privacy-policy" className={styles.link}>Privacy Policy</a>
                .
            </div>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={handleAcceptAll}>
                    Accept All
                </button>
                <button className={styles.buttonEssential} onClick={handleEssential}>
                    Only Essential
                </button>
                <button className={styles.buttonOutline} onClick={handleDecline}>
                    Decline
                </button>
            </div>
        </div>
    );
}
