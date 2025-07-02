// src/components/Button.jsx
import React from 'react';
import styles from './Button.module.css';

export default function Button({
                                   children,
                                   variant = 'primary', // 'primary' | 'secondary'
                                   type = 'button',
                                   className = '',
                                   ...props
                               }) {
    const classes = [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        className
    ].join(' ');

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
}
