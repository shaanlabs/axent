import { Shield, Users, Package, Activity } from 'lucide-react';
import { useAuth } from '../../../app/auth/auth-context';

export function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="content-main">
            {/* macOS Toolbar */}
            <div className="toolbar">
                <div className="toolbar-title">Admin Dashboard</div>
                <div className="toolbar-actions">
                    <span className="badge-macos badge-macos-primary">
                        <Shield className="w-3 h3 mr-1" />
                        Admin
                    </span>
                    <span className="text-sm text-text-secondary ml-3">{user?.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="content-header">
                <h1 className="content-title">Platform Administration</h1>
                <p className="content-subtitle">Monitor and manage the entire AXENT platform</p>
            </div>

            <div className="content-body">
                {/* Quick Stats */}
                <div className="section">
                    <h2 className="section-title">
                        <Activity className="w-5 h-5 text-primary" />
                        Platform Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Users</p>
                                        <p className="text-2xl font-semibold text-white">1,248</p>
                                    </div>
                                    <Users className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Equipment</p>
                                        <p className="text-2xl font-semibold text-white">842</p>
                                    </div>
                                    <Package className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Active Bookings</p>
                                        <p className="text-2xl font-semibold text-white">156</p>
                                    </div>
                                    <Activity className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Revenue</p>
                                        <p className="text-2xl font-semibold text-white">₹42.8L</p>
                                    </div>
                                    <Activity className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* System Status */}
                <div className="section">
                    <h2 className="section-title">System Status</h2>
                    <div className="table-macos">
                        <div className="table-macos-row">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">Database</p>
                            </div>
                            <span className="badge-macos badge-macos-primary">Healthy</span>
                        </div>
                        <div className="table-macos-row">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">API Services</p>
                            </div>
                            <span className="badge-macos badge-macos-primary">Online</span>
                        </div>
                        <div className="table-macos-row">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">Storage</p>
                            </div>
                            <span className="badge-macos badge-macos-primary">85% Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
