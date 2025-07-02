import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import styles from './ServicesPage.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';
import HorizontalScroller from '../components/HorizontalScroller';

function getTypeFromSection(section) {
    if (section === 'modules') return 'module';
    if (section === 'gameServers') return 'gameServer';
    return null;
}

function ServiceCard({ item, section }) {
    const {
        label,
        price,
        desc,
        fullDesc,
        buttonLabel = "Purchase",
        buttonLink = "/shop-unavailable"
    } = item;

    const isStripeProduct = (
        (section === 'modules' || section === 'gameServers') &&
        buttonLabel.toLowerCase().includes('purchase')
    );

    const [showFull, setShowFull] = useState(false);

    const handleStripeCheckout = async () => {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: getTypeFromSection(section),
                    label,
                    price,
                    desc,
                    productId: item.productId
                })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to create checkout session.');
            }
        } catch (err) {
            alert('Checkout failed.');
        }
    };

    return (
        <div className={styles.carouselCard} style={{ position: 'relative' }}>
            <h3 className={styles.cardTitle}>{label}</h3>
            <div className={styles.price}>{price}</div>
            <div className={styles.desc}>
                <ReactMarkdown>{desc}</ReactMarkdown>
            </div>
            {fullDesc && (
                <div className={styles.fullDescLinkWrapper}>
                    <span
                        className={styles.fullDescLink}
                        onClick={() => setShowFull(true)}
                    >
                        Full Description
                    </span>
                </div>
            )}
            <div className={styles.purchaseBtnWrapper}>
                {isStripeProduct ? (
                    <button
                        className={styles.purchaseBtn}
                        onClick={handleStripeCheckout}
                        type="button"
                    >
                        {buttonLabel}
                    </button>
                ) : (
                    buttonLink.startsWith('http') ? (
                        <a
                            href={buttonLink}
                            className={styles.purchaseBtn}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {buttonLabel}
                        </a>
                    ) : (
                        <Link to={buttonLink} className={styles.purchaseBtn}>
                            {buttonLabel}
                        </Link>
                    )
                )}
            </div>
            {showFull && (
                <div className={styles.fullDescOverlay}>
                    <div className={styles.fullDescBox}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowFull(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h3 className={styles.cardTitle}>{label}</h3>
                        <div className={styles.price}>{price}</div>
                        <div className={styles.fullDescMarkdown}>
                            <ReactMarkdown>{fullDesc}</ReactMarkdown>
                        </div>
                        <div className={styles.purchaseBtnWrapper}>
                            {isStripeProduct ? (
                                <button
                                    className={styles.purchaseBtn}
                                    onClick={handleStripeCheckout}
                                    type="button"
                                >
                                    {buttonLabel}
                                </button>
                            ) : (
                                buttonLink.startsWith('http') ? (
                                    <a
                                        href={buttonLink}
                                        className={styles.purchaseBtn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {buttonLabel}
                                    </a>
                                ) : (
                                    <Link to={buttonLink} className={styles.purchaseBtn}>
                                        {buttonLabel}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ScrollerWithSection({ data, section }) {
    return (
        <HorizontalScroller
            data={data}
            renderCard={(item) => <ServiceCard item={item} section={section} />}
        />
    );
}

export default function ServicesPage() {
    const [services, setServices] = useState({ customBots: [], gameServers: [], modules: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/services.json')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(() => {
                setServices({ customBots: [], gameServers: [], modules: [] });
                setLoading(false);
            });
    }, []);

    return (
        <PageWrapper>
            <div className={styles.pageContainer}>
                <h2 className={styles.sectionHeader}>Discord Bots</h2>
                <p className={styles.sectionDesc}>
                    Feature-rich, custom Discord bots tailored for your community and their needs.
                    All bots include support and 1 month hosting at no extra charge!
                </p>
                {loading ? (
                    <div style={{ textAlign: 'center', marginBottom: "2.5rem" }}>Loading...</div>
                ) : (
                    <ScrollerWithSection data={services.customBots} section="customBots" />
                )}

                <h2 className={styles.sectionHeader}>Modules</h2>
                <p className={styles.sectionDesc}>
                    Plug-and-play modules and features for your own bots, tools, or community projects.<br />
                    Great for quickly adding moderation, games, logging, or APIs to your stack.
                </p>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : (
                    <ScrollerWithSection data={services.modules || []} section="modules" />
                )}

                <h2 className={styles.sectionHeader}>Game Servers</h2>
                <p className={styles.sectionDesc}>
                    Reliable server hosting for your favorite games with automated setup, backups, and easy management.
                </p>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : (
                    <ScrollerWithSection data={services.gameServers} section="gameServers" />
                )}
            </div>
        </PageWrapper>
    );
}
