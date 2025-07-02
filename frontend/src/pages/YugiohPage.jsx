import React, { useState, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';
import CardSearchBar from '../components/CardSearchBar';
import DeckListDisplay from '../components/DeckListDisplay';
import PricingSummary from '../components/PricingSummary';
import styles from './YugiohPage.module.css';

export default function DeckPriceLookup() {
    const [deck, setDeck] = useState({ main: [], extra: [], side: [] });
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [region, setRegion] = useState('GB');

    const [jobId, setJobId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [downloadReady, setDownloadReady] = useState(false);
    const [generationError, setGenerationError] = useState('');
    const pollingRef = useRef(null);

    const parseYdk = (text) => {
        const lines = text.split(/\r?\n/);
        const result = { main: [], extra: [], side: [] };
        let currentSection = null;

        for (const line of lines) {
            const trimmed = line.trim().toLowerCase();
            if (trimmed.startsWith('#') || trimmed.startsWith('!')) {
                if (trimmed === '#main' || trimmed === '!main') currentSection = 'main';
                else if (trimmed === '#extra' || trimmed === '!extra') currentSection = 'extra';
                else if (trimmed === '#side' || trimmed === '!side') currentSection = 'side';
                else currentSection = null;
            } else if (trimmed && currentSection) {
                result[currentSection].push(trimmed);
            }
        }

        return result;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !file.name.endsWith('.ydk')) {
            setError('Please upload a valid .ydk file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const rawDeck = parseYdk(content);
                const allIds = [...rawDeck.main, ...rawDeck.extra, ...rawDeck.side];

                fetch('/api/yugioh/cards', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: allIds })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.data) throw new Error('No card data returned');
                        const lookup = Object.fromEntries(data.data.map(c => [c.id.toString(), c]));

                        const fullDeck = {
                            main: rawDeck.main.map(id => lookup[id]).filter(Boolean),
                            extra: rawDeck.extra.map(id => lookup[id]).filter(Boolean),
                            side: rawDeck.side.map(id => lookup[id]).filter(Boolean),
                        };

                        setDeck(fullDeck);
                        setFileName(file.name);
                        setError('');
                    })
                    .catch(() => {
                        setError('Failed to load card data from server.');
                    });
            } catch {
                setError('Failed to parse YDK file.');
            }
        };
        reader.readAsText(file);
    };

    const handleAddCard = (card) => {
        if (deck.main.length >= 60) {
            alert("Main deck is full (60 card limit)");
            return;
        }
        setDeck(prev => ({ ...prev, main: [...prev.main, card] }));
    };


    const handleRemoveCard = (zone, index) => {
        setDeck(prev => ({
            ...prev,
            [zone]: prev[zone].filter((_, i) => i !== index)
        }));
    };

    const handleMoveCard = (from, to, index) => {
        setDeck(prev => {
            const card = prev[from][index];
            if (!card) return prev;
            return {
                ...prev,
                [from]: prev[from].filter((_, i) => i !== index),
                [to]: [...prev[to], card],
            };
        });
    };

    const handleDownloadSample = () => {
        const content = [
            '#main',
            '20938824',
            '96676583',
            '32061192',
            '30118811',
            '#extra',
            '8264361',
            '95454996',
            '#side',
            '34267821',
            '94145021',
            '84192580'
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sample.ydk';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 200);
    };

    const handleGenerateXLSX = async () => {
        const currency = region === 'GB' ? 'GBP' : 'USD';
        setJobId(null);
        setProgress(0);
        setDownloadReady(false);
        setGenerationError('');
        try {
            const res = await fetch('/api/yugioh/ebay-xlsx/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deck, currency }),
            });
            if (!res.ok) throw new Error('Failed to start XLSX generation.');
            const data = await res.json();
            setJobId(data.job_id);
            pollProgress(data.job_id);
        } catch (e) {
            setGenerationError('Failed to start price spreadsheet generation.');
        }
    };

    const pollProgress = (job_id) => {
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/yugioh/ebay-xlsx/progress?job_id=${job_id}`);
                if (!res.ok) throw new Error('Failed to fetch progress.');
                const data = await res.json();
                setProgress(data.progress || 0);

                if (data.error) {
                    setGenerationError(data.error);
                    setJobId(null);
                    clearInterval(pollingRef.current);
                }

                if (data.ready) {
                    setDownloadReady(true);
                    clearInterval(pollingRef.current);
                }
            } catch (e) {
                setGenerationError('Failed to fetch job progress.');
                setJobId(null);
                clearInterval(pollingRef.current);
            }
        }, 800);
    };

    const handleDownloadXLSX = () => {
        if (!jobId) return;
        fetch(`/api/yugioh/ebay-xlsx/download?job_id=${jobId}`)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ebay_prices.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => window.URL.revokeObjectURL(url), 500);
            });
        setDownloadReady(false);
        setJobId(null);
        setProgress(0);
    };

    const renderXLSXButton = () => {
        if (jobId && !downloadReady) {
            return (
                <div style={{ marginTop: '1.6rem', textAlign: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', background: '#eee', borderRadius: 8, height: 18 }}>
                        <div style={{
                            width: `${progress}%`, height: '100%',
                            background: 'linear-gradient(90deg,#a788f5,#A6CAF0)',
                            borderRadius: 8, transition: 'width 0.3s'
                        }} />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 6, color: '#666' }}>
                        Generating Spreadsheet… {progress}%
                    </div>
                    {generationError && (
                        <div style={{ color: "#ff4c4c", marginTop: 8 }}>{generationError}</div>
                    )}
                </div>
            );
        }
        if (downloadReady && jobId) {
            return (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        className={styles.uploadLabel}
                        onClick={handleDownloadXLSX}
                        style={{ minWidth: 200 }}
                    >
                        Download Price Spreadsheet
                    </button>
                </div>
            );
        }
        return (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    className={styles.uploadLabel}
                    style={{ minWidth: 200 }}
                    onClick={handleGenerateXLSX}
                    disabled={!!jobId}
                >
                    Generate Latest Prices
                </button>
                <p style={{ color: '#aaa', fontSize: '0.97rem', marginTop: 12 }}>
                    This may take a few minutes to generate.
                </p>
                {generationError && (
                    <div style={{ color: "#ff4c4c", marginTop: 8 }}>{generationError}</div>
                )}
            </div>
        );
    };

    return (
        <PageWrapper>
            <PageTitle>Yu-Gi-Oh! Deck Price Lookup</PageTitle>
            <div className={styles.container}>
                <div className={styles.uploadBox}>
                    <label htmlFor="ydkUpload" className={styles.uploadLabel}>
                        {fileName || 'Upload .ydk File'}
                    </label>
                    <input
                        type="file"
                        id="ydkUpload"
                        accept=".ydk"
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleDownloadSample}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#a788f5',
                                textDecoration: 'underline',
                                fontWeight: 500,
                                fontSize: '0.96rem',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            Download Sample .ydk File
                        </button>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <CardSearchBar onAddCard={handleAddCard} />

                <DeckListDisplay
                    deck={deck}
                    onRemove={handleRemoveCard}
                    onMoveCard={handleMoveCard}
                />

                <PricingSummary
                    deck={deck}
                    region={region}
                    setRegion={setRegion}
                >
                    {() => (
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            {renderXLSXButton()}
                        </div>
                    )}
                </PricingSummary>
            </div>
        </PageWrapper>
    );
}
