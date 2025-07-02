import React, { useState, useMemo } from 'react';
import styles from './FileConverter.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';

const formatOptions = {
    document: ['pdf', 'txt'],
    audio: ['mp3', 'wav', 'ogg']
};

const getFileCategory = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['txt', 'md', 'docx', 'html'].includes(ext)) return 'document';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return null;
};

export default function FileConverter() {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [format, setFormat] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    const outputFormats = useMemo(() => (category ? formatOptions[category] : []), [category]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError('');
        setDownloadUrl('');

        if (selectedFile) {
            const detected = getFileCategory(selectedFile.name);
            setCategory(detected);
            setFormat('');
            if (!detected) {
                setError('Unsupported file type');
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setCategory('');
        setFormat('');
        setError('');
        setDownloadUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !format) {
            setError('Please select a file and output format.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        setLoading(true);
        setError('');
        setDownloadUrl('');

        try {
            const res = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Conversion failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (err) {
            setError(err.message || 'An error occurred');
        }

        setLoading(false);
    };

    return (
        <PageWrapper>
            <PageTitle>File Converter</PageTitle>

            <p className={styles.subtext}>
                Convert documents and audio files with ease.<br />
                <strong>Supported:</strong> .txt, .md, .docx, .html, .mp3, .wav, .ogg → PDF, TXT, or other audio formats.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.uploadBox}>
                    {file && (
                        <button type="button" className={styles.clearButton} onClick={clearFile}>
                            &times;
                        </button>
                    )}
                    <label htmlFor="file" className={styles.uploadLabel}>
                        {file ? file.name : 'Choose File (Max 512MB)'}
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept=".txt,.md,.docx,.html,.mp3,.wav,.ogg"
                        onChange={handleFileChange}
                        disabled={loading}
                        className={styles.fileInput}
                    />
                </div>

                {category && (
                    <div className={styles.outputSection}>
                        <label htmlFor="format">Output Format:</label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select format</option>
                            {outputFormats.map((opt) => (
                                <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit" disabled={loading || !format}>
                    {loading ? 'Converting…' : 'Convert'}
                </button>

                {error && <p className={styles.error}>{error}</p>}

                {downloadUrl && (
                    <a href={downloadUrl} download className={styles.downloadButton}>
                        Download File
                    </a>
                )}
            </form>

            <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                    <h3>Universal Document Support</h3>
                    <p>
                        Convert your notes, markdown, Word files, and HTML documents into clean, sharable PDFs or plain text.
                        Great for reports, summaries, transcripts, or web content archiving.
                    </p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Streamlined Audio Conversion</h3>
                    <p>
                        Quickly reformat audio files into MP3, WAV, or OGG for use in podcasts, websites, or media players.
                        Just upload and go — no software needed.
                    </p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Fast, Secure, and Private</h3>
                    <p>
                        Your files never leave the server — they're converted in-memory and immediately discarded.
                        All transfers are encrypted and your data is never stored or logged.
                    </p>
                </div>
            </div>
        </PageWrapper>
    );
}
