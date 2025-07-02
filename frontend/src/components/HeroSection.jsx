// src/components/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <motion.section
            id="hero"
            className={styles['hero-section']}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles['hero-content']}>
                <h1>
                    Hello, I'm <span className={styles.highlight}>Luke</span>
                </h1>
                <h2>Software Developer | Problem Solver</h2>
                <p>
                    Self-taught programmer who enjoys breaking down complex problems
                    and projects into more manageable chunks. Proficient in API design,
                    database architecture, automation. I’m always
                    excited to learn new tools and explore new technologies.
                </p>
                <div className={styles['hero-buttons']}>
                    <a href="#projects" className={styles['cta-button']}>
                        View My Work
                    </a>
                    <a href="#contact" className={styles['cta-button-outline']}>
                        Contact Me
                    </a>
                </div>
            </div>
        </motion.section>
    );
}
