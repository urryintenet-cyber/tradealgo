import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { alertOrchestrator } from '../services/AlertOrchestrator';
import { proactiveMonitor } from '../services/ProactiveMonitor';
import AssetSidebar from '../components/layout/AssetSidebar';
import { Bell, Shield, Zap, Target, Activity, AlertTriangle, ArrowRight, Trash2, Clock, CheckCircle } from 'lucide-react';

/**
 * Institutional Alerts Page (Phase 4)
 * Real-time feed of background-detected signals.
 */
export default function Alerts() {
    const [alerts, setAlerts] = useState(alertOrchestrator.getAlerts());
    const [isMonitoring, setIsMonitoring] = useState(proactiveMonitor.isRunning);
    const [selectedPair, setSelectedPair] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = alertOrchestrator.onUpdate((newAlerts) => {
            setAlerts(newAlerts);
        });
        return unsubscribe;
    }, []);

    const toggleMonitoring = () => {
        if (isMonitoring) {
            proactiveMonitor.stop();
        } else {
            proactiveMonitor.start();
        }
        setIsMonitoring(!isMonitoring);
    };

    const handleAcknowledge = (id) => {
        alertOrchestrator.acknowledgeAlert(id);
    };

    const handleAnalyse = (symbol) => {
        navigate(`/app/markets`, { state: { pair: symbol.replace('/', '') } });
    };

    const filteredAlerts = alerts.filter(alert => {
        if (selectedPair !== 'ALL' && alert.symbol !== selectedPair && alert.symbol !== selectedPair.replace('/', '')) return false;
        return true;
    });

    return (
        <div className="page-with-asset-sidebar">
            <AssetSidebar 
                selectedPair={selectedPair} 
                onSelectPair={setSelectedPair} 
                allowAll={true} 
            />
            <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', marginBottom: '2px', color: 'var(--color-text-primary)' }}>Institutional Alerts</h1>
                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Real-time background scanning for Smart Money fingerprints.</p>
                    </div>

                    <button
                        onClick={toggleMonitoring}
                        className={`btn ${isMonitoring ? 'btn-danger' : 'btn-success'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Activity size={14} className={isMonitoring ? 'animate-pulse' : ''} />
                        {isMonitoring ? 'STOP SCANNER' : 'START MONITORING'}
                    </button>
                </header>

            <div className="alerts-grid">
                {/* Main Alerts Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AnimatePresence mode="popLayout">
                        {alerts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <Bell size={36} style={{ opacity: 0.2, marginBottom: '12px', color: 'var(--color-accent-primary)' }} />
                                <h3 style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)' }}>No active signals detected.</h3>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: '6px' }}>
                                    Enable background monitoring to detect institutional flows.
                                </p>
                            </motion.div>
                        ) : (
                            alerts.map(alert => (
                                <motion.div
                                    key={alert.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`card ${alert.severity === 'HIGH' ? 'card-accent-red' : 'card-accent-blue'}`}
                                    style={{
                                        padding: '12px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        opacity: alert.status === 'ACKNOWLEDGED' ? 0.55 : 1,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: 'var(--radius-md)',
                                            background: alert.severity === 'HIGH' ? 'var(--color-danger-bg)' : 'var(--color-accent-light)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: alert.severity === 'HIGH' ? 'var(--color-danger)' : 'var(--color-accent-primary)',
                                            flexShrink: 0
                                        }}>
                                            {alert.type === 'INSTITUTIONAL_FAKE_OUT' ? <Zap size={16} /> :
                                                alert.type === 'LIQUIDITY_GRAB' ? <Target size={16} /> : <Activity size={16} />}
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                <span style={{ fontSize: 'var(--text-md)', fontWeight: '700', color: 'var(--color-text-primary)' }}>{alert.symbol}</span>
                                                <span className="badge badge-default">
                                                    {alert.type.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>{alert.message}</p>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center' }}>
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <Clock size={10} /> {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                                <span style={{
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: '700',
                                                    color: alert.iqScore >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px'
                                                }}>
                                                    <Shield size={10} /> IQ: {alert.iqScore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        {alert.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleAcknowledge(alert.id)}
                                                className="btn btn-ghost btn-icon"
                                                title="Acknowledge"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleAnalyse(alert.symbol)}
                                            className="btn btn-primary btn-sm"
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            ANALYSE <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title" style={{ fontSize: '10px' }}>SYSTEM HEALTH</span>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="data-row">
                                <span className="data-row-label">Background Loop</span>
                                <span style={{ color: isMonitoring ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 'var(--text-xs)', fontWeight: '700' }}>
                                    {isMonitoring ? 'ACTIVE' : 'IDLE'}
                                </span>
                            </div>
                            <div className="data-row">
                                <span className="data-row-label">Scan Frequency</span>
                                <span className="data-row-value">1min</span>
                            </div>
                            <div className="data-row">
                                <span className="data-row-label">Active Watchlist</span>
                                <span className="data-row-value">{proactiveMonitor.watchlist.length} Assets</span>
                            </div>
                        </div>
                    </div>

                    <div className="subscription-banner">
                        <h4 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-accent-primary)', letterSpacing: '0.05em', marginBottom: '4px' }}>IQ THRESHOLD</h4>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                            Currently ignoring signals below IQ 50. High-conviction alerts (IQ 80+) are automatically saved to Signal Lab.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
