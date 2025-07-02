import React, { useContext, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ContactSection from '../components/ContactSection';
import BackToTop from '../components/BackToTop';
import { ScrollToSectionContext } from '../context/ScrollToSectionContext';
import styles from './HomePage.module.css';

export default function HomePage() {
    const { pendingSection, scrollToSection } = useContext(ScrollToSectionContext);

    useEffect(() => {
        if (pendingSection.current) {
            setTimeout(() => {
                scrollToSection(pendingSection.current);
                pendingSection.current = null;
            }, 100);
        }
    }, [pendingSection, scrollToSection]);

    return (
        <main className={styles['home-main']}>
            <section className={styles['section-spacing']}>
                <HeroSection />
            </section>
            <section className={`${styles['section-spacing']} ${styles['alt-section']}`}>
                <AboutSection />
            </section>
            <section className={styles['section-spacing']}>
                <SkillsSection />
            </section>
            <section className={`${styles['section-spacing']} ${styles['alt-section']}`}>
                <ProjectsSection />
            </section>
            <section className={`${styles['section-spacing']} ${styles['alt-section']}`}>
                <ContactSection />
            </section>
            <BackToTop />
        </main>

    );
}
