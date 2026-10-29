import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BarChart2, Zap, BookOpen,
    Calculator, User, Settings, FlaskConical,
    Bell, TrendingUp, Activity
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
            { icon: FlaskConical, label: 'Signal Lab',  path: '/app/lab' },
            { icon: BookOpen,     label: 'Education',   path: '/app/education' },
            { icon: Calculator,   label: 'Risk Calc',   path: '/app/risk' },
        ]
    }
];

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-mark">
                        <TrendingUp size={14} color="white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navGroups.map(group => (
                        <React.Fragment key={group.label}>
                            <span className="sidebar-section-label">{group.label[0]}</span>
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
                                    <item.icon size={17} />
                                    <span className="sidebar-tooltip">{item.label}</span>
                                </NavLink>
                            ))}
                            <div className="sidebar-sep" />
                        </React.Fragment>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <NavLink
                        to="/app/account"
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                        onClick={closeSidebar}
                    >
                        <User size={17} />
                        <span className="sidebar-tooltip">Account</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
