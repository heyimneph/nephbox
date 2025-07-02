// src/components/AboutSection.jsx
import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
    return (
        <section id="about" className={styles['about-section']}>
            <div className={styles['about-content']}>
                <h2>About Me</h2>
                <div className={styles['about-grid']}>
                    <div className={styles['about-text']}>
                        <p>
                            I'm a self-taught backend developer specialising in Python and
                            bot development. I build scalable, maintainable systems with clean
                            architecture and thorough documentation.
                        </p>
                        <p>My expertise includes:</p>
                        <ul className={styles['skills-list']}>
                            <li>Discord bot development (discord.py)</li>
                            <li>Database design and optimization (PostgreSQL, Redis)</li>
                            <li>API integration and automation (Plex, VirusTotal, Flask)</li>
                            <li>Server deployment and CI/CD pipelines (Docker, GitHub Actions)</li>
                        </ul>
                        <p>
                            Beyond development, I maintain gaming servers (Minecraft, Project
                            Zomboid, Valheim), providing hands-on experience with Linux
                            administration, performance optimization, and managing live
                            services.
                        </p>
                    </div>
                    <div className={styles['about-image']}>
                        <div className={styles['code-snippet']}>
              <pre>{`async def main():
    await client.load_extension("core.initialisation")

    print("Loading Extensions...")
    for filename in os.listdir("./core"):
        if filename.endswith(".py"):
            await client.load_extension(f"core.{filename[:-3]}")

    print("Starting Bot...")

    await client.start(DISCORD_TOKEN)

if __name__ == "__main__":
    asyncio.run(main())`}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
