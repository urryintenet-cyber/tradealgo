import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import OnboardingTour from '../features/OnboardingTour.jsx';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Pages that use the full-bleed "Terminal" view (no padding, fixed height)
    const isTerminalPage = [
        '/app/markets',
        '/app',
        '/app/setups',
        '/app/alerts',
        '/app/lab',
        '/app/scanner',
    ].some(path =>
        location.pathname === path || location.pathname.startsWith('/app/markets')
    );

    const toggleSidebar = () => setIsSidebarOpen(v => !v);

    return (
        <div className="app-shell">
            <OnboardingTour />
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className={`content-area ${isTerminalPage ? 'terminal-mode' : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
