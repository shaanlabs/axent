import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/auth/auth-context';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    Tractor,
    BrainCircuit,
    PackageSearch,
    User
} from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navItems = [
        { label: 'Dashboard', path: `/${user?.role}/dashboard`, icon: <LayoutDashboard className="list-item-icon" /> },
        ...(user?.role === 'customer' ? [
            { label: 'AI Estimator', path: '/customer/estimator', icon: <BrainCircuit className="list-item-icon" /> },
            { label: 'Agriculture', path: '/customer/agriculture', icon: <Tractor className="list-item-icon" /> },
        ] : []),
        ...(user?.role === 'provider' ? [
            { label: 'My Listings', path: '/provider/listings', icon: <PackageSearch className="list-item-icon" /> },
        ] : []),
        { label: 'Settings', path: `/${user?.role}/settings`, icon: <Settings className="list-item-icon" /> },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar z-50 ${isSidebarOpen ? 'open' : ''}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 px-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                            <span className="text-black font-bold text-lg">A</span>
                        </div>
                        <span className="font-bold text-lg">AXENT</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={toggleSidebar} className="md:hidden text-text-secondary hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Menu</div>
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <div
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsSidebarOpen(false);
                                }}
                                className={`list-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="list-item !h-auto py-3 mb-2 px-3 bg-surface border border-border rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="content-main flex-1 w-full max-w-[100vw] overflow-x-hidden">
                {/* Global Mobile Header */}
                <div className="md:hidden h-14 bg-surface border-b border-border flex items-center px-4 justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                            <span className="text-black font-bold text-xs">A</span>
                        </div>
                        <span className="font-bold text-md">AXENT</span>
                    </div>
                    <button onClick={toggleSidebar} className="text-text-secondary hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Content */}
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
