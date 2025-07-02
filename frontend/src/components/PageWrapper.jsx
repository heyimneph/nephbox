// PageWrapper.jsx
import React from 'react';
import styles from './PageWrapper.module.css';

export default function PageWrapper({ children }) {
    return (
        <div className={styles.wrapper}>
            <div style={{ paddingTop: '80px' }}>
                {children}
            </div>
        </div>
    );
}
