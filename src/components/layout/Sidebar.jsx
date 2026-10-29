import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BarChart2, Zap, BookOpen,
    Calculator, User, Activity, Bell, TrendingUp, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navGroups = [
    {
        label: 'Trading',
        items: [
            { icon: LayoutDashboard, label: 'Overview',     path: '/app' },
            { icon: BarChart2,       label: 'Markets',      path: '/app/markets' },
            { icon: Zap,             label: 'Trade Setups', path: '/app/setups' },
            { icon: Bell,            label: 'Alerts',       path: '/app/alerts' },
            { icon: Activity,        label: 'Scanner',      path: '/app/scanner' },
        ]
    },
    {
        label: 'Tools',
        items: [
            { icon: Activity,        label: 'Signal Lab',  path: '/app/lab' },
            { icon: BookOpen,        label: 'Education',   path: '/app/education' },
            { icon: Calculator,      label: 'Risk Calc',   path: '/app/risk' },
        ]
    }
];

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header / Logo */}
                <div className="sidebar-logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="sidebar-logo-mark">
                            <TrendingUp size={13} color="white" strokeWidth={2.5} />
                        </div>
                        <span className="sidebar-brand-text">TRADEALGO</span>
                    </div>
                    <button
                        className="btn btn-ghost btn-icon btn-sm sidebar-close-btn"
                        onClick={closeSidebar}
                        aria-label="Close Navigation Menu"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    {navGroups.map(group => (
                        <React.Fragment key={group.label}>
                            <span className="sidebar-section-label" title={group.label}>
                                {group.label[0]}
                            </span>
                            {group.items.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/app'}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item ${isActive ? 'active' : ''}`
                                    }
                                    onClick={closeSidebar}
                                    title=""
                                >
                                    <item.icon size={15} />
                                    <span className="sidebar-label">{item.label}</span>
                                    <span className="sidebar-tooltip">{item.label}</span>
                                </NavLink>
                            ))}
                            <div className="sidebar-sep" />
                        </React.Fragment>
                    ))}
                </nav>

                {/* Footer / Account */}
                <div className="sidebar-footer">
                    <NavLink
                        to="/app/account"
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                        onClick={closeSidebar}
                    >
                        <User size={15} />
                        <span className="sidebar-label">Account</span>
                        <span className="sidebar-tooltip">Account</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
