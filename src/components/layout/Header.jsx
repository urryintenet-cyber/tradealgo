import { Search, Bell, Menu, Sun, Moon, User, ChevronDown, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { alertOrchestrator } from '../../services/AlertOrchestrator';
import { useState, useEffect, useRef } from 'react';

export default function Header({ toggleSidebar }) {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, subscriptionStatus, logout } = useAuth();
    const navigate = useNavigate();
    const [alertCount, setAlertCount] = useState(
        alertOrchestrator.getAlerts().filter(a => a.status === 'ACTIVE').length
    );
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const unsubscribe = alertOrchestrator.onUpdate((alerts) => {
            setAlertCount(alerts.filter(a => a.status === 'ACTIVE').length);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = currentUser?.name || currentUser?.displayName || 'Trader';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const planLabel = subscriptionStatus?.isSubscriptionActive
        ? 'Pro'
        : subscriptionStatus?.isTrialActive
            ? 'Trial'
            : 'Expired';

    const planColor = subscriptionStatus?.isSubscriptionActive
        ? 'var(--color-success)'
        : subscriptionStatus?.isTrialActive
            ? 'var(--color-warning)'
            : 'var(--color-danger)';

    return (
        <header className="topbar">
            {/* Left: mobile hamburger + brand name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <button
                    className="btn btn-ghost btn-icon mobile-menu-btn"
                    onClick={toggleSidebar}
                    aria-label="Open Navigation Menu"
                >
                    <Menu size={16} />
                </button>

                {/* Brand name — visible on mobile since sidebar is hidden */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                     className="hide-desktop-brand">
                    <div style={{
                        width: '24px', height: '24px',
                        background: 'var(--color-accent-primary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <TrendingUp size={12} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                        TRADEALGO
                    </span>
                </div>

                {/* Search bar */}
                <div className="input-group hide-mobile" style={{ maxWidth: '280px', width: '100%' }}>
                    <Search size={14} className="input-group-icon" />
                    <input
                        type="text"
                        placeholder="Search markets, setups..."
                        className="input"
                        style={{ fontSize: 'var(--text-sm)', height: '30px', paddingLeft: '30px', background: 'var(--color-bg-primary)' }}
                    />
                </div>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                {/* Theme toggle */}
                <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    style={{ color: 'var(--color-text-tertiary)' }}
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Alerts */}
                <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => navigate('/app/alerts')}
                    title="Alerts"
                    style={{ position: 'relative', color: 'var(--color-text-tertiary)' }}
                >
                    <Bell size={16} />
                    {alertCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '5px', right: '5px',
                            width: '6px', height: '6px',
                            background: 'var(--color-danger)',
                            borderRadius: '50%',
                            border: '1.5px solid var(--color-bg-secondary)',
                        }} />
                    )}
                </button>

                {/* Divider */}
                <div style={{ width: '1px', height: '18px', background: 'var(--border-color)', margin: '0 4px' }} className="hide-mobile" />

                {/* User dropdown */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setUserMenuOpen(v => !v)}
                        style={{
                            padding: '4px 8px',
                            gap: '8px',
                            height: '34px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: userMenuOpen ? 'var(--color-bg-tertiary)' : 'transparent',
                        }}
                    >
                        {/* Avatar */}
                        <div style={{
                            width: '24px', height: '24px',
                            background: 'linear-gradient(135deg, var(--color-accent-primary), #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, color: '#fff',
                            flexShrink: 0,
                        }}>
                            {initials}
                        </div>

                        <div className="hide-mobile" style={{ textAlign: 'left', lineHeight: 1.2 }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                {displayName.split(' ')[0]}
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: planColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {planLabel}
                            </div>
                        </div>

                        <ChevronDown size={12} className="hide-mobile" style={{
                            color: 'var(--color-text-tertiary)',
                            transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease'
                        }} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                        <div className="dropdown-menu" style={{ minWidth: '160px', right: 0 }}>
                            <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    {displayName}
                                </div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                                    {currentUser?.email}
                                </div>
                            </div>
                            <button className="dropdown-item" onClick={() => { navigate('/app/account'); setUserMenuOpen(false); }}>
                                <User size={14} /> Account
                            </button>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item danger" onClick={() => { logout(); navigate('/login'); }}>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
