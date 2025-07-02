import React, { useState } from 'react';
import styles from './UrlShortener.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';

export default function UrlShortener() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShortUrl('');

        if (!url.trim()) {
            setError('Please enter a valid URL.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!res.ok) throw new Error('Failed to shorten URL');

            const data = await res.json();
            setShortUrl(`${window.location.origin}/s/${data.code}`);
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        }

        setLoading(false);
    };

    return (
        <PageWrapper>
            <PageTitle>URL Shortener</PageTitle>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="url"
                    value={url}
                    placeholder="Enter a long URL..."
                    onChange={(e) => setUrl(e.target.value)}
                    className={styles.input}
                    disabled={loading}
                />
                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? 'Shortening…' : 'Shorten'}
                </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {shortUrl && (
                <div className={styles.shortUrlBox}>
                    <input
                        className={styles.shortUrlInput}
                        type="text"
                        value={shortUrl}
                        readOnly
                        onClick={e => e.target.select()}
                        aria-label="Short URL"
                    />
                    <button
                        className={styles.copyButton}
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(shortUrl);
                        }}
                    >
                        Copy
                    </button>
                </div>
            )}
        </PageWrapper>
    );
}
