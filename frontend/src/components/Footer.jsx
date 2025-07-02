import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="page-footer" className={styles.footer}>
            <div className={styles['footer-content']}>
                <p>© {new Date().getFullYear()} Nephbox. All rights reserved.</p>
                <div className={styles['footer-links']}>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
