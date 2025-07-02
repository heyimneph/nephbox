// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { ScrollToSectionContext } from '../context/ScrollToSectionContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const { pendingSection } = useContext(ScrollToSectionContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSectionNav = (sectionId) => {
        setMenuOpen(false);
        if (location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            pendingSection.current = sectionId;
            navigate('/');
        }
    };

    const handleNavigate = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogoClick = () => {
        setMenuOpen(false);
        if (location.pathname === '/') {
            document.getElementById('root')?.scrollTo?.({ top: 0 });
        } else {
            navigate('/');
        }
    };


    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
                {/* Left: Logo */}
                <div className={styles.logo} onClick={handleLogoClick}>
                    <img
                        src="/logo.png"
                        alt="Nephbox Logo"
                        className={styles.logoImage}
                    />
                </div>

                {/* Right: Nav + toggle + hamburger */}
                <div className={styles.rightGroup}>
                    <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
                        <li>
                            <button className={styles.navButton} onClick={() => handleSectionNav('about')}>About</button>
                        </li>
                        <li>
                            <button className={styles.navButton} onClick={() => handleSectionNav('skills')}>Skills</button>
                        </li>
                        <li>
                            <button className={styles.navButton} onClick={() => handleSectionNav('projects')}>Projects</button>
                        </li>
                        <li>
                            <button className={styles.navButton} onClick={() => handleNavigate('/services')}>Services</button>
                        </li>
                        <li>
                            <button className={styles.navButton} onClick={() => handleSectionNav('contact')}>Contact</button>
                        </li>
                    </ul>


                    {/* Hamburger toggle */}
                    <button
                        className={styles.hamburger}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                    </button>

                    {/* Theme toggle */}
                    <button
                        className={styles.themeToggle}
                        onClick={() => { toggleTheme(); setMenuOpen(false); }}
                        aria-label="Toggle theme"
                    >
                        <span className={`${styles.toggleTrack} ${styles[theme]}`}>
                            <span className={styles.toggleThumb} />
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
