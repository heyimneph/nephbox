import React, { useState } from 'react';

export default function DeckListDisplay({ deck, onRemove, onMoveCard }) {
    const [viewMode, setViewMode] = useState('image');
    const [dragData, setDragData] = useState(null);
    const [hoveredSection, setHoveredSection] = useState(null);

    const sectionLabels = {
        main: 'Main Deck',
        extra: 'Extra Deck',
        side: 'Side Deck'
    };

    const sectionLimits = {
        main: 60,
        extra: 15,
        side: 15
    };

    const groupCards = (cards) => {
        const map = new Map();
        for (const card of cards) {
            const key = card.id.toString();
            if (map.has(key)) {
                map.get(key).count += 1;
            } else {
                map.set(key, { ...card, count: 1 });
            }
        }
        return [...map.values()];
    };

    const isOverLimit = (section) => {
        return (deck[section]?.length || 0) >= sectionLimits[section];
    };

    return (
        <div>
            <div style={{ textAlign: 'right', margin: '0.5rem 0' }}>
                <button onClick={() => setViewMode(v => v === 'image' ? 'text' : 'image')}>
                    Toggle to {viewMode === 'image' ? 'Text' : 'Image'} View
                </button>
            </div>

            {['main', 'extra', 'side'].map((section) => {
                const cards = deck[section] || [];
                const grouped = groupCards(cards);
                const overLimit = isOverLimit(section);
                const isDropTarget = hoveredSection === section;

                return (
                    <div
                        key={section}
                        style={{
                            marginTop: '1.5rem',
                            border: isDropTarget ? '2px dashed #A6CAF0' : 'none',
                            padding: isDropTarget ? '0.5rem' : '0',
                            borderRadius: 8
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (!overLimit) setHoveredSection(section);
                        }}
                        onDragLeave={() => setHoveredSection(null)}
                        onDrop={() => {
                            if (dragData && dragData.section !== section && !overLimit) {
                                onMoveCard(dragData.section, section, dragData.index);
                            }
                            setDragData(null);
                            setHoveredSection(null);
                        }}
                    >
                        <h3 style={{ color: 'var(--primary-color)' }}>
                            {sectionLabels[section]} ({cards.length}/
                            {sectionLimits[section]})
                        </h3>

                        {overLimit && (
                            <p style={{ color: '#f66', fontSize: '0.9rem' }}>
                                Limit exceeded! This deck section is full.
                            </p>
                        )}

                        {viewMode === 'image' ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {cards.map((card, idx) => (
                                    <div key={`${card.id}-${idx}`} style={{ width: '90px' }}>
                                        <img
                                            src={card.card_images?.[0]?.image_url || ''}
                                            alt={card.name}
                                            title="Click to remove"
                                            style={{ width: '100%', borderRadius: '6px', cursor: 'pointer' }}
                                            draggable
                                            onClick={() => onRemove(section, idx)}
                                            onDragStart={() => setDragData({ section, index: idx })}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ul>
                                {grouped.map(card => (
                                    <li
                                        key={card.id}
                                        draggable
                                        onDragStart={() => {
                                            const i = deck[section].findIndex(c => c.id === card.id);
                                            if (i !== -1) setDragData({ section, index: i });
                                        }}
                                    >
                                        {card.count}x {card.name}
                                        <button
                                            onClick={() => {
                                                const i = cards.findIndex(c => c.id === card.id);
                                                if (i !== -1) onRemove(section, i);
                                            }}
                                            style={{ marginLeft: '1rem', color: 'red' }}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
