import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ThankYouPage.module.css";

function getQueryParam(name, search) {
    return new URLSearchParams(search).get(name);
}

export default function ThankYouPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [productType, setProductType] = useState("");
    const [label, setLabel] = useState("");
    const [productId, setProductId] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [sessionCreated, setSessionCreated] = useState(null);
    const [sessionId, setSessionId] = useState("");
    const location = useLocation();

    useEffect(() => {
        const session_id = getQueryParam("session_id", location.search);
        setSessionId(session_id || "");
        if (!session_id) {
            setError("Invalid or missing session ID.");
            setLoading(false);
            return;
        }

        fetch(`/api/stripe/session-info?session_id=${session_id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setProductType(data.product_type);
                    setProductId(data.product_id);
                    setLabel(data.label);
                    setCustomerEmail(data.customer_email || "");
                    setSessionCreated(data.created || null);
                    // Auto-download for modules (if not expired)
                    if (data.product_type === "module" && data.product_id && data.created) {
                        if (Date.now() / 1000 - data.created <= 3600) {
                            setTimeout(() => {
                                window.location = `/download/${encodeURIComponent(data.product_id)}?session_id=${encodeURIComponent(session_id)}`;
                            }, 1500);
                        }
                    }
                }
            })
            .catch(() => setError("Failed to load order info."))
            .finally(() => setLoading(false));
    }, [location.search]);

    // Expired if more than 3600 seconds (1 hour) since session creation
    const expired = sessionCreated && (Date.now() / 1000 - sessionCreated > 3600);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h1 className={styles.title}>Thank you for your purchase!</h1>
                {loading && <p>Loading your order...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && (
                    <>
                        {label && <h2 className={styles.subtitle}>{label}</h2>}
                        {productType === "module" && productId && (
                            expired ? (
                                <div style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
                                    <b>This download link has expired.</b><br />
                                    Please <a
                                    className={styles.highlightLink}
                                    href="https://discord.gg/u6GqqWxqRN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >open a support ticket</a> to get your file.
                                </div>
                            ) : (
                                <p>
                                    Your download will begin shortly.<br />
                                    If your download doesn't start,&nbsp;
                                    <a
                                        className={styles.highlightLink}
                                        href={`/download/${encodeURIComponent(productId)}?session_id=${encodeURIComponent(sessionId)}`}
                                        download
                                    >
                                        click here
                                    </a>.
                                    <br /><br />
                                    <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                                        Need help?&nbsp;
                                        <a
                                            className={styles.highlightLink}
                                            href="https://discord.gg/u6GqqWxqRN"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >Open a support ticket</a>
                                    </span>
                                </p>
                            )
                        )}
                        {productType === "gameServer" && (
                            <>
                                <p>
                                    <b>Setup instructions have been sent to your email.</b><br />
                                    Please check your inbox (and spam folder).<br /><br />
                                    <b>What to do next?</b><br />
                                    1. Follow the steps in the email to set up your server.<br />
                                    2. If you don't see the email within 10 minutes,&nbsp;
                                    <a
                                        className={styles.highlightLink}
                                        href="https://discord.gg/u6GqqWxqRN"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >contact us on Discord</a>.<br />
                                    <br />
                                    Thank you for your order!
                                </p>
                                <a href="/" className={styles.button}>Return Home</a>
                            </>
                        )}
                            {customerEmail && (
                                <p style={{ fontSize: "0.96rem", color: "var(--text-secondary)" }}>
                                    (Confirmation sent to <b>{customerEmail}</b>)
                                </p>
                            )}
                    </>
                )}
            </div>
        </div>
    );
}
