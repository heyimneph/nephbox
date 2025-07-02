import React, { useEffect, useState, useRef } from 'react';
import styles from './ProjectsSection.module.css';

const CARD_WIDTH = 340;
const GAP = 32;

const ArrowIcon = ({ direction = "right" }) => (
    <svg width="28" height="28" viewBox="0 0 22 22"
         style={{ transform: direction === "left" ? "scaleX(-1)" : undefined, display: "block" }}>
        <path d="M6 11h10m0 0l-4-4m4 4l-4 4"
              stroke="#8e63f3"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" />
    </svg>
);

function useResponsiveCount() {
    const [count, setCount] = useState(getCount());

    function getCount() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 950) return 2;
        return 3;
    }

    useEffect(() => {
        const handler = () => setCount(getCount());
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return count;
}

export default function ProjectsSection() {
    const [projects, setProjects] = useState([]);
    const listRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const visibleCount = useResponsiveCount();

    useEffect(() => {
        fetch('/projects.json')
            .then(res => res.json())
            .then(setProjects)
            .catch(console.error);
    }, []);

    const updateArrows = () => {
        const el = listRef.current;
        if (!el) return;
        setShowLeft(Math.round(el.scrollLeft) > 0);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        requestAnimationFrame(updateArrows);

        el.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);

        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, [projects.length, visibleCount]);

    // Scroll by full visible width
    const scrollByPage = (dir) => {
        const el = listRef.current;
        if (!el) return;
        const pageWidth = el.offsetWidth;
        el.scrollBy({ left: dir * pageWidth, behavior: 'smooth' });
    };

    return (
        <section id="projects" className={styles['projects-section']}>
            <div className={styles['projects-content']}>
                <h2>Projects</h2>
                <div className={styles['carousel-outer']}>
                    {/* Left Arrow */}
                    {showLeft && (
                        <button
                            className={`${styles['carousel-arrow']} ${styles['left']}`}
                            aria-label="Scroll left"
                            onClick={() => scrollByPage(-1)}
                        >
                            <ArrowIcon direction="left" />
                        </button>
                    )}

                    {/* Scrollable Project Cards */}
                    <div className={styles['projects-list']} ref={listRef}>
                        {projects.map((project, idx) => (
                            <div key={idx} className={styles['project-card']}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className={styles['tech-list']}>
                                    {project.tech?.map((t) => (
                                        <span key={t} className={styles['tech-badge']}>{t}</span>
                                    ))}
                                </div>
                                {project.links && (
                                    <div className={styles['project-links']}>
                                        {project.links.map((link, ldx) => (
                                            <a
                                                key={ldx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles['project-link']}
                                            >
                                                {link.icon && <span>{link.icon}</span>}
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    {showRight && (
                        <button
                            className={`${styles['carousel-arrow']} ${styles['right']}`}
                            aria-label="Scroll right"
                            onClick={() => scrollByPage(1)}
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
