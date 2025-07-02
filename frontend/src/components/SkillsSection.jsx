// src/components/SkillsSection.jsx
import React from 'react';
import styles from './SkillsSection.module.css';

const SkillsSection = () => {
    const skills = {
        "Core Languages": ["Python", "JavaScript", "C/C++"],
        "Backend Development": ["Flask", "Waitress", "discord.py", "RESTful APIs"],
        Databases: ["PostgreSQL", "Redis", "SQLite"],
        "DevOps & Infrastructure": ["Docker", "Linux Server Administration", "CI/CD (GitHub Actions)"]
    };

    return (
        <section id="skills" className={styles['skills-section']}>
            <div className={styles['skills-content']}>
                <h2>Technical Skills</h2>
                {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className={styles['skills-category']}>
                        <h3 className={styles['skills-subtitle']}>{category}</h3>
                        <div className={styles['skills-tags']}>
                            {items.map(skill => (
                                <span key={skill} className={styles['skill-tag']}>
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
