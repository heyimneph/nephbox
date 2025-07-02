import React, { useState, useEffect } from 'react';

export default function CardSearchBar({ onAddCard }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.length < 2) return setResults([]);

            setLoading(true);
            fetch(`/api/yugioh/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setResults(data.results || []))
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div style={{ marginTop: '1.5rem', position: 'relative' }}>
            <input
                type="text"
                placeholder="Search for a card..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.6rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-dark)',
                    color: 'var(--text-light)'
                }}
            />
            {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching…</p>}

            {results.length > 0 && (
                <div style={{ display: 'flex', position: 'relative' }}>
                    <ul style={{
                        marginTop: '0.5rem',
                        listStyle: 'none',
                        paddingLeft: 0,
                        width: '100%',
                        maxHeight: '250px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        zIndex: 2
                    }}>
                        {results.map(card => (
                            <li
                                key={card.id}
                                onMouseEnter={() => setHoveredCard(card)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}
                            >
                                <img
                                    src={card.card_images?.[0]?.image_url_small}
                                    alt={card.name}
                                    style={{
                                        width: '40px',
                                        height: '58px',
                                        marginRight: '0.75rem',
                                        borderRadius: '4px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        onAddCard(card);
                                        setQuery('');
                                        setResults([]);
                                    }}
                                    style={{
                                        background: 'none',
                                        color: 'var(--primary-color)',
                                        border: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        padding: 0
                                    }}
                                >
                                    {card.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {hoveredCard?.card_images?.[0]?.image_url && (
                        <div style={{
                            position: 'absolute',
                            left: 'calc(100% + 1rem)',
                            top: 0,
                            width: '180px',
                            zIndex: 1
                        }}>
                            <img
                                src={hoveredCard.card_images[0].image_url}
                                alt={hoveredCard.name}
                                style={{ width: '100%', borderRadius: '6px', boxShadow: '0 0 12px rgba(0,0,0,0.4)' }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
