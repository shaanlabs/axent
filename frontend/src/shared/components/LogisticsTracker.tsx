import React from 'react';
import { Truck, UserCheck, PackageCheck, AlertCircle } from 'lucide-react';

interface LogisticsTrackerProps {
    bookingId: string;
    machineName: string;
    status: 'pending' | 'operator_assigned' | 'in_transit' | 'delivered' | 'issue';
    operatorStatus: 'not_needed' | 'pending' | 'confirmed';
    transportStatus: 'self_pickup' | 'pending' | 'dispatched' | 'arrived';
}

export function LogisticsTracker({
    bookingId,
    machineName,
    status,
    operatorStatus,
    transportStatus
}: LogisticsTrackerProps) {
    // Determine progress percentage
    let progress = 0;
    if (status === 'pending') progress = 10;
    if (status === 'operator_assigned' || (operatorStatus === 'not_needed' && transportStatus === 'pending')) progress = 40;
    if (status === 'in_transit' || transportStatus === 'dispatched') progress = 75;
    if (status === 'delivered' || transportStatus === 'arrived') progress = 100;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 inline-block">Active Coordination Tracker</h3>
                    <p className="font-semibold text-lg text-gray-800">{machineName}</p>
                    <p className="text-sm text-gray-500">Booking #{bookingId}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${status === 'issue' ? 'bg-red-100 text-red-700' :
                        status === 'delivered' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                    }`}>
                    {status === 'issue' && <AlertCircle className="w-4 h-4" />}
                    {status.replace('_', ' ').toUpperCase()}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1 mb-8">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                    <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${status === 'issue' ? 'bg-red-500' : 'bg-primary'}`}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
                    <span>Confirmed</span>
                    <span>Assigning</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                </div>
            </div>

            {/* Variable Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Operator Block */}
                <div className={`p-4 rounded-lg border ${operatorStatus === 'confirmed' ? 'bg-green-50 border-green-200' :
                        operatorStatus === 'not_needed' ? 'bg-gray-50 border-gray-200' :
                            'bg-yellow-50 border-yellow-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${operatorStatus === 'confirmed' ? 'bg-green-100 text-green-600' :
                                operatorStatus === 'not_needed' ? 'bg-gray-200 text-gray-500' :
                                    'bg-yellow-100 text-yellow-600'
                            }`}>
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Operator Status</p>
                            <p className="text-sm text-gray-600">
                                {operatorStatus === 'confirmed' ? 'Assigned: Ramesh K.' :
                                    operatorStatus === 'not_needed' ? 'Customer Provided' :
                                        'Pending Assignment'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transport Block */}
                <div className={`p-4 rounded-lg border ${transportStatus === 'arrived' ? 'bg-green-50 border-green-200' :
                        transportStatus === 'self_pickup' ? 'bg-gray-50 border-gray-200' :
                            transportStatus === 'dispatched' ? 'bg-blue-50 border-blue-200' :
                                'bg-yellow-50 border-yellow-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transportStatus === 'arrived' ? 'bg-green-100 text-green-600' :
                                transportStatus === 'self_pickup' ? 'bg-gray-200 text-gray-500' :
                                    transportStatus === 'dispatched' ? 'bg-blue-100 text-blue-600' :
                                        'bg-yellow-100 text-yellow-600'
                            }`}>
                            {transportStatus === 'arrived' ? <PackageCheck className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Transport Logistics</p>
                            <p className="text-sm text-gray-600">
                                {transportStatus === 'arrived' ? 'Arrived at Site' :
                                    transportStatus === 'self_pickup' ? 'Self-Pickup Scheduled' :
                                        transportStatus === 'dispatched' ? 'In Transit (ETA: 2 hrs)' :
                                            'Awaiting Dispatch'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            {status !== 'delivered' && status !== 'issue' && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        Contact Driver
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition">
                        Report Issue
                    </button>
                </div>
            )}
        </div>
    );
}
