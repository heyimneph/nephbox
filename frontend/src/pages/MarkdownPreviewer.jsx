import React, { useState, useRef, useEffect } from 'react';
import styles from './MarkdownPreviewer.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';

const MARKDOWN_ACTIONS = [
    { label: 'Bold', symbol: '𝐁', tooltip: 'Bold', insert: (sel) => `**${sel || 'bold'}**`, shortcut: 'Ctrl+B' },
    { label: 'Italic', symbol: '𝑖', tooltip: 'Italic', insert: (sel) => `*${sel || 'italic'}*`, shortcut: 'Ctrl+I' },
    { label: 'Link', symbol: '🔗', tooltip: 'Link', insert: (sel) => `[${sel || 'text'}](url)`, shortcut: 'Ctrl+K' },
    { label: 'List', symbol: '•', tooltip: 'List', insert: (sel) => `- ${sel || 'item'}`, shortcut: '' },
    { label: 'Numbered', symbol: '1.', tooltip: 'Numbered List', insert: (sel) => `1. ${sel || 'item'}`, shortcut: '' },
    { label: 'Code', symbol: '</>', tooltip: 'Inline Code', insert: (sel) => `\`${sel || 'code'}\`` },
    { label: 'Block', symbol: '{ }', tooltip: 'Code Block', insert: () => '```\ncode\n```' },
    { label: 'Heading', symbol: '#', tooltip: 'Heading', insert: (sel) => `# ${sel || 'Heading'}` },
    { label: 'Quote', symbol: '❝', tooltip: 'Blockquote', insert: (sel) => `> ${sel || 'quote'}` },
    { label: 'Strike', symbol: 'S̶', tooltip: 'Strikethrough', insert: (sel) => `~~${sel || 'strike'}~~` },
    { label: 'Table', symbol: '≡', tooltip: 'Table', insert: () =>
            `| Header 1 | Header 2 |\n| --- | --- |\n| Row 1 Col 1 | Row 1 Col 2 |\n| Row 2 Col 1 | Row 2 Col 2 |` },
];

const MARKDOWN_OPTIONS = [
    { label: "Tables", value: "tables" },
    { label: "Fenced Code Blocks", value: "fenced-code-blocks" },
    { label: "Strikethrough", value: "strike" },
    { label: "Cuddled Lists", value: "cuddled-lists" },
    { label: "Break on Newline", value: "break-on-newline" },
    { label: "Autolink", value: "autolink" },
    { label: "Header IDs", value: "header-ids" },
    { label: "Safe Links Only", value: "safe-links" },
];

const DEFAULT_OPTIONS = [
    "tables",
    "fenced-code-blocks",
    "strike",
    "break-on-newline",
    "safe-links",
];

export default function MarkdownPreviewer() {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [selectedOptions, setSelectedOptions] = useState(DEFAULT_OPTIONS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const textareaRef = useRef();

    const insertAtCursor = (insertFn) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selectedText = value.substring(start, end);

        const inserted = insertFn(selectedText);
        const newText =
            value.substring(0, start) + inserted + value.substring(end);

        setMarkdown(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + inserted.length;
        }, 0);
    };

    useEffect(() => {
        if (markdown.trim() === '') {
            setHtml('');
            setError('');
            return;
        }
        setLoading(true);
        setError('');
        fetch('/api/markdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdown, options: selectedOptions }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setHtml('');
                } else {
                    setHtml(data.html || '');
                }
            })
            .catch(() => {
                setError('Error rendering markdown');
                setHtml('');
            })
            .finally(() => setLoading(false));
    }, [markdown, selectedOptions]);

    const handleOptionToggle = (value) => {
        setSelectedOptions((opts) =>
            opts.includes(value)
                ? opts.filter((v) => v !== value)
                : [...opts, value]
        );
    };

    return (
        <PageWrapper>
            <PageTitle>Markdown Previewer</PageTitle>
            <div className={styles.container}>
                <div className={styles.toolbar}>
                    {MARKDOWN_ACTIONS.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            className={styles.toolbarButton}
                            title={action.tooltip + (action.shortcut ? ` (${action.shortcut})` : '')}
                            tabIndex={-1}
                            onClick={() => insertAtCursor(action.insert)}
                        >
                            {action.symbol}
                        </button>
                    ))}
                </div>
                <textarea
                    ref={textareaRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Type or paste markdown here..."
                    className={styles.input}
                    spellCheck={false}
                />
                <div className={styles.optionsRow}>
                    {MARKDOWN_OPTIONS.map((opt) => (
                        <label key={opt.value} className={styles.optionLabel}>
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(opt.value)}
                                onChange={() => handleOptionToggle(opt.value)}
                            />
                            <span className={styles.optionText}>{opt.label}</span>
                        </label>
                    ))}
                </div>
                <div className={styles.preview}>
                    <div
                        dangerouslySetInnerHTML={{ __html: loading ? '<em>Rendering…</em>' : html }}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            </div>
        </PageWrapper>
    );
}
