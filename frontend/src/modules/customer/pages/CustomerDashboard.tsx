import { Home, Tractor, Zap, Package } from 'lucide-react';
import { useAuth } from '../../../app/auth/auth-context';

export function CustomerDashboard() {
    const { user } = useAuth();

    return (
        <div className="w-full h-full flex flex-col">
            {/* macOS Toolbar */}
            <div className="toolbar">
                <div className="toolbar-title">Dashboard</div>
                <div className="toolbar-actions">
                    <span className="text-sm text-text-secondary">Welcome, {user?.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="content-header">
                <h1 className="content-title">Customer Dashboard</h1>
                <p className="content-subtitle">Manage your equipment rentals and projects</p>
            </div>

            <div className="content-body">
                {/* Quick Stats */}
                <div className="section">
                    <h2 className="section-title">
                        <Zap className="w-5 h-5 text-primary" />
                        Quick Stats
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Active Rentals</p>
                                        <p className="text-2xl font-semibold text-white">2</p>
                                    </div>
                                    <Package className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Spent</p>
                                        <p className="text-2xl font-semibold text-white">₹45,000</p>
                                    </div>
                                    <Home className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Saved Items</p>
                                        <p className="text-2xl font-semibold text-white">5</p>
                                    </div>
                                    <Tractor className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Recent Activity */}
                <div className="section">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="table-macos">
                        <div className="table-macos-row">
                            <p className="text-sm text-text-primary">No recent activity yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
