import React, { useEffect, useState } from 'react';

// SVGs for UK and US flags
const UK_FLAG = (
    <svg width="28" height="20" viewBox="0 0 28 20" style={{ borderRadius: 4 }}>
        <rect width="28" height="20" fill="#00247D" />
        <path d="M0 0L28 20M28 0L0 20" stroke="#FFF" strokeWidth="4" />
        <path d="M0 0L28 20M28 0L0 20" stroke="#CF142B" strokeWidth="2" />
        <rect x="11" width="6" height="20" fill="#FFF" />
        <rect y="7" width="28" height="6" fill="#FFF" />
        <rect x="12" width="4" height="20" fill="#CF142B" />
        <rect y="8" width="28" height="4" fill="#CF142B" />
    </svg>
);

const US_FLAG = (
    <svg width="28" height="20" viewBox="0 0 28 20" style={{ borderRadius: 4 }}>
        <rect width="28" height="20" fill="#B22234" />
        {[...Array(6)].map((_, i) => (
            <rect key={i} y={i * 2.86} width="28" height="1.43" fill="#FFF" />
        ))}
        <rect width="11.2" height="8.57" fill="#3C3B6E" />
        {[...Array(9)].map((_, r) =>
            [...Array(r % 2 === 0 ? 6 : 5)].map((_, c) => (
                <circle
                    key={c + '-' + r}
                    cx={1.12 + c * 2.24 + (r % 2 === 1 ? 1.12 : 0)}
                    cy={1.07 + r * 0.95}
                    r="0.45"
                    fill="#FFF"
                />
            ))
        )}
    </svg>
);

const regionConfig = {
    GB: { label: "UK", currency: "GBP", flag: UK_FLAG },
    US: { label: "US", currency: "USD", flag: US_FLAG },
};

export default function PricingSummary({ deck, children, region, setRegion }) {
    const [rates, setRates] = useState({
        USD_GBP: 0.79,
        EUR_GBP: 0.85,
        USD_USD: 1.0,
        EUR_USD: 1.09,
    });

    useEffect(() => {
        fetch('/api/exchange-rates')
            .then(res => res.json())
            .then(setRates)
            .catch(() => {});
    }, []);

    const allCards = [...deck.main, ...deck.extra, ...deck.side];
    const currencySymbol = region === 'GB' ? '£' : '$';

    const grouped = allCards.reduce((acc, card) => {
        const id = card.id.toString();
        if (!acc[id]) acc[id] = { ...card, count: 0 };
        acc[id].count += 1;
        return acc;
    }, {});

    const vendors = ['tcgplayer_price', 'cardmarket_price', 'ebay_price'];
    const vendorLabels = {
        tcgplayer_price: 'TCGPlayer',
        cardmarket_price: 'Cardmarket',
        ebay_price: 'eBay'
    };
    const vendorTotals = {};
    const missingCounts = {};
    vendors.forEach(vendor => {
        vendorTotals[vendor] = 0;
        missingCounts[vendor] = 0;
    });

    Object.values(grouped).forEach(({ card_prices, count }) => {
        const priceObj = card_prices?.[0] || {};
        vendors.forEach(vendor => {
            const raw = parseFloat(priceObj[vendor]);
            if (isNaN(raw)) {
                missingCounts[vendor] += count;
                return;
            }

            let converted = raw;
            if (region === 'GB') {
                if (vendor === 'tcgplayer_price' || vendor === 'ebay_price') {
                    converted = raw * rates.USD_GBP;
                } else if (vendor === 'cardmarket_price') {
                    converted = raw * rates.EUR_GBP;
                }
            } else if (region === 'US') {
                if (vendor === 'cardmarket_price') {
                    converted = raw * rates.EUR_USD;
                } // USD prices remain unchanged
            }

            vendorTotals[vendor] += converted * count;
        });
    });

    const flagUI = (
        <div style={{ display: 'flex', gap: 6, justifyContent: "center" }}>
            {Object.entries(regionConfig).map(([code, { flag, label }]) => (
                <button
                    key={code}
                    style={{
                        background: region === code ? "#FFF" : "rgba(255,255,255,0.6)",
                        border: region === code ? "2px solid #A6CAF0" : "1px solid #bbb",
                        borderRadius: 6,
                        cursor: "pointer",
                        boxShadow: region === code ? "0 0 4px #A6CAF0" : "none",
                        padding: 0,
                        width: 28, height: 20,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title={label + " Prices"}
                    onClick={() => setRegion(code)}
                    aria-label={label + " Prices"}
                >
                    {flag}
                </button>
            ))}
        </div>
    );

    return (
        <>
            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'var(--bg-dark)',
                borderRadius: '8px',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: 12, right: 18 }}>{flagUI}</div>
                <h3 style={{ color: 'var(--primary-color)', marginRight: 50 }}>Pricing Summary</h3>
                <p>Total Cards: {allCards.length}</p>
                {vendors.map(vendor => (
                    <div key={vendor}>
                        <p>
                            {vendorLabels[vendor]} Total: ~ {currencySymbol}{vendorTotals[vendor].toFixed(2)}
                        </p>
                        {missingCounts[vendor] > 0 && (
                            <p style={{ color: '#aaa', marginLeft: '1rem' }}>
                                Missing data for {missingCounts[vendor]} card(s)
                            </p>
                        )}
                    </div>
                ))}
                <p style={{ color: '#aaa', fontSize: '0.97rem', marginTop: 12 }}>*these prices are only estimates</p>
            </div>
            {typeof children === "function"
                ? children({ region, setRegion, flagUI })
                : null}
        </>
    );
}
