import { BarChart3, Building2, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../app/auth/auth-context';

export function OrganizationDashboard() {
    const { user } = useAuth();

    return (
        <div className="w-full h-full flex flex-col">
            {/* macOS Toolbar */}
            <div className="toolbar">
                <div className="toolbar-title">Organization Dashboard</div>
                <div className="toolbar-actions">
                    <span className="text-sm text-text-secondary">{user?.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="content-header">
                <h1 className="content-title">Organization Dashboard</h1>
                <p className="content-subtitle">Fleet management and analytics for your organization</p>
            </div>

            <div className="content-body">
                {/* Quick Stats */}
                <div className="section">
                    <h2 className="section-title">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Fleet Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Equipment</p>
                                        <p className="text-2xl font-semibold text-white">24</p>
                                    </div>
                                    <Building2 className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Active Projects</p>
                                        <p className="text-2xl font-semibold text-white">8</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Team Members</p>
                                        <p className="text-2xl font-semibold text-white">12</p>
                                    </div>
                                    <Users className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="card-macos">
                            <div className="card-macos-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Monthly Spend</p>
                                        <p className="text-2xl font-semibold text-white">₹8.5L</p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-primary opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Recent Projects */}
                <div className="section">
                    <h2 className="section-title">Active Projects</h2>
                    <div className="table-macos">
                        <div className="table-macos-row">
                            <p className="text-sm text-text-primary">No active projects</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
