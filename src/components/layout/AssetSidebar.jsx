import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const ASSET_REGISTRY = {
    'Crypto': ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'DOT/USDT', 'MATIC/USDT', 'AVAX/USDT', 'LINK/USDT', 'OP/USDT', 'ARB/USDT'],
    'Forex': ['EUR/USD', 'GBP/USD', 'GBP/JPY', 'AUD/USD', 'NZD/USD', 'USD/TRY', 'USD/ZAR', 'USD/MXN', 'USD/BRL', 'USD/RUB'],
    'Metals': ['XAU/USD']
};

export default function AssetSidebar({ selectedPair, onSelectPair, allowAll = false }) {
    const [isSearching, setIsSearching] = useState(false);
    
    const recentPairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'EUR/USD'];

    return (
        <nav className="asset-sidebar">
            {/* SEARCH TRIGGER */}
            <button
                type="button"
                className={`asset-btn ${isSearching ? 'active' : ''}`}
                onClick={() => setIsSearching(!isSearching)}
                title="Search Assets"
                aria-label="Search Assets"
            >
                <Search size={14} />
            </button>

            {allowAll && (
                <button
                    type="button"
                    onClick={() => onSelectPair('ALL')}
                    title="All Assets"
                    className={`asset-btn ${selectedPair === 'ALL' ? 'active' : ''}`}
                >
                    ALL
                </button>
            )}

            {/* RECENT PAIRS */}
            {!allowAll && (
                <div className="asset-group">
                    <span className="asset-group-label">REC</span>
                    {recentPairs.slice(0, 4).map(pair => (
                        <button
                            type="button"
                            key={pair}
                            onClick={() => onSelectPair(pair)}
                            title={pair}
                            className={`asset-btn ${selectedPair === pair ? 'active' : ''}`}
                        >
                            {pair.split('/')[0].substring(0, 3)}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ width: '24px', height: '1px', background: 'var(--border-color)', margin: '2px 0', flexShrink: 0 }} />

            {Object.keys(ASSET_REGISTRY).map(cat => (
                <div key={cat} className="asset-group">
                    <span className="asset-group-label">
                        {cat.substring(0, 3).toUpperCase()}
                    </span>
                    {ASSET_REGISTRY[cat].map(pair => (
                        <button
                            type="button"
                            key={pair}
                            onClick={() => onSelectPair(pair)}
                            title={pair}
                            className={`asset-btn ${selectedPair === pair ? 'active' : ''}`}
                        >
                            {pair.split('/')[0].substring(0, 3)}
                        </button>
                    ))}
                </div>
            ))}
        </nav>
    );
}
