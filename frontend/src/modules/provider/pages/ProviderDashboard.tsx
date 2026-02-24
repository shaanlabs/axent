import { DollarSign, Package, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../app/auth/auth-context';

export function ProviderDashboard() {
    const { user } = useAuth();

    return (
        <div className="w-full h-full flex flex-col">
            {/* macOS Toolbar */}
            <div className="toolbar">
                <div className="toolbar-title">Provider Dashboard</div>
                <div className="toolbar-actions">
                    <span className="text-sm text-text-secondary">{user?.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="content-header">
                <h1 className="content-title">Provider Dashboard</h1>
                <p className="content-subtitle">Manage your listings and track your revenue</p>
            </div>

            <div className="content-body">
                {/* Quick Stats */}
                <div className="section">
                    <h2 className="section-title">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Business Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Revenue</p>
                                        <p className="text-2xl font-semibold text-white">₹2.4L</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">My Listings</p>
                                        <p className="text-2xl font-semibold text-white">6</p>
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
                                        <p className="text-2xl font-semibold text-white">3</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">This Month</p>
                                        <p className="text-2xl font-semibold text-white">₹45K</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Recent Bookings */}
                <div className="section">
                    <h2 className="section-title">Recent Bookings</h2>
                    <div className="table-macos">
                        <div className="table-macos-row">
                            <p className="text-sm text-text-primary">No bookings yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
