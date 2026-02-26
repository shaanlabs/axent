import { DollarSign, Package, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../app/auth/auth-context';
import { LogisticsTracker } from '../../../shared/components/LogisticsTracker';

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

                {/* Availability Verification Loop */}
                <div className="section">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">
                            Availability Verification Loop
                        </h2>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">Action Required</span>
                    </div>
                    <div className="bg-white rounded-lg border border-red-200 overflow-hidden shadow-sm">
                        <div className="p-4 bg-red-50 border-b border-red-100 flex items-start gap-4">
                            <div className="bg-red-100 p-2 rounded-full mt-1">
                                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-900">Verify Your Machinery Now</h3>
                                <p className="text-red-700 text-sm mt-1">
                                    Failure to confirm availability within 24 hours will degrade your Reliability Score and hide your listings from buyers.
                                </p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded text-2xl flex items-center justify-center">🚜</div>
                                    <div>
                                        <h4 className="font-semibold">Mahindra 575 DI Tractor</h4>
                                        <p className="text-sm text-gray-500">Last verified: 46 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-sm bg-green-50 text-green-700 font-semibold rounded hover:bg-green-100 transition border border-green-200">
                                        Yes, Available
                                    </button>
                                    <button className="px-4 py-2 text-sm bg-gray-50 text-gray-700 font-semibold rounded hover:bg-gray-100 transition border border-gray-200">
                                        Mark Unavailable
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded text-2xl flex items-center justify-center">🚜</div>
                                    <div>
                                        <h4 className="font-semibold">Swaraj 744 FE</h4>
                                        <p className="text-sm text-gray-500">Last verified: 51 hours ago (Expired)</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-sm bg-green-50 text-green-700 font-semibold rounded hover:bg-green-100 transition border border-green-200">
                                        Yes, Available
                                    </button>
                                    <button className="px-4 py-2 text-sm bg-gray-50 text-gray-700 font-semibold rounded hover:bg-gray-100 transition border border-gray-200">
                                        Mark Unavailable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Trust & Reliability Scorecard */}
                <div className="section">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">
                            Trust & Reliability Scorecard
                        </h2>
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Score: 4.8 / 5.0</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Fulfillment Metrics</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">Successful Bookings</span>
                                        <span className="font-medium text-green-600">94%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">On-Time Delivery</span>
                                        <span className="font-medium text-blue-600">88%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Risk Factors (Penalty impacts)</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm text-gray-600">Last-Minute Cancellations</span>
                                    <span className="text-sm font-bold text-gray-900">1</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm text-gray-600">Condition Disputes</span>
                                    <span className="text-sm font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border-l-2 border-red-400">
                                    <span className="text-sm text-gray-600">Fake Availability Flags</span>
                                    <span className="text-sm font-bold text-red-600">2 Warnings</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Active Bookings & Coordination */}
                <div className="section">
                    <h2 className="section-title">Active Bookings & Coordination</h2>
                    <div className="space-y-6">
                        <LogisticsTracker
                            bookingId="BKG-A0932"
                            machineName="CAT 320 Excavator"
                            status="in_transit"
                            operatorStatus="confirmed"
                            transportStatus="dispatched"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
