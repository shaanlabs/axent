/**
 * Provider Listings Management Page
 * Features: Equipment listings with AI pricing suggestions
 */
import { useState } from 'react';
import { usePriceEstimate } from '../../shared/hooks/useAI';

export default function ListingsPage() {
    const { data: priceSuggestion, loading: priceLoading, estimate } = usePriceEstimate();
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const mockListings = [
        { id: '1', name: 'John Deere 6M Series Tractor', type: 'tractor', current_price: 45, condition: 'good', age: 2 },
        { id: '2', name: 'Caterpillar 320 Excavator', type: 'excavator', current_price: 95, condition: 'excellent', age: 1 },
        { id: '3', name: 'Bobcat S650 Skid Steer', type: 'skid_steer', current_price: 55, condition: 'good', age: 3 },
    ];

    const handleGetPriceSuggestion = async (equipment: typeof mockListings[0]) => {
        setSelectedEquipment(equipment.id);
        try {
            await estimate({
                equipment_type: equipment.type,
                equipment_category: 'construction',
                condition: equipment.condition,
                age_years: equipment.age,
                location: 'California',
                season: 'summer',
            });
        } catch (err) {
            console.error('Price suggestion failed:', err);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Equipment Listings</h1>
                    <p className="text-gray-600">Manage your equipment with AI-powered pricing recommendations</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-gray-600 text-sm mb-1">Total Equipment</div>
                        <div className="text-3xl font-bold">{mockListings.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-gray-600 text-sm mb-1">Available</div>
                        <div className="text-3xl font-bold text-green-600">{mockListings.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-gray-600 text-sm mb-1">Avg Price/Hour</div>
                        <div className="text-3xl font-bold">$65</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-gray-600 text-sm mb-1">Monthly Revenue</div>
                        <div className="text-3xl font-bold">$12,450</div>
                    </div>
                </div>

                {/* Listings */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-semibold">Equipment Listings</h2>
                    </div>

                    <div className="divide-y">
                        {mockListings.map((equipment) => (
                            <div key={equipment.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Equipment Info */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-xl font-semibold mb-2">{equipment.name}</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Current Price:</span>
                                                <span className="ml-2 font-semibold text-green-600">
                                                    ${equipment.current_price}/hr
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Condition:</span>
                                                <span className="ml-2 font-semibold capitalize">{equipment.condition}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Age:</span>
                                                <span className="ml-2 font-semibold">{equipment.age} years</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Status:</span>
                                                <span className="ml-2 text-green-600 font-semibold">✓ Available</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Pricing Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleGetPriceSuggestion(equipment)}
                                            disabled={priceLoading && selectedEquipment === equipment.id}
                                            className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#c4a027] transition disabled:opacity-50"
                                        >
                                            {priceLoading && selectedEquipment === equipment.id
                                                ? '🤖 Analyzing...'
                                                : '🤖 Get AI Price Suggestion'}
                                        </button>
                                    </div>
                                </div>

                                {/* AI Price Suggestion */}
                                {priceSuggestion && selectedEquipment === equipment.id && (
                                    <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center">
                                            <span className="mr-2">🤖</span>
                                            AI Pricing Recommendation
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-600 mb-1">Suggested Price</div>
                                                    <div className="text-3xl font-bold text-green-600">
                                                        ${priceSuggestion.estimated_price_per_hour.toFixed(2)}/hr
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Range: ${priceSuggestion.price_range_min.toFixed(2)} - $
                                                        {priceSuggestion.price_range_max.toFixed(2)}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Current Price:</span>
                                                        <span className="font-semibold">${equipment.current_price}/hr</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>AI Suggested:</span>
                                                        <span className="font-semibold">
                                                            ${priceSuggestion.estimated_price_per_hour.toFixed(2)}/hr
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Difference:</span>
                                                        <span
                                                            className={
                                                                priceSuggestion.estimated_price_per_hour > equipment.current_price
                                                                    ? 'text-green-600 font-semibold'
                                                                    : 'text-red-600 font-semibold'
                                                            }
                                                        >
                                                            {priceSuggestion.estimated_price_per_hour > equipment.current_price ? '+' : ''}
                                                            $
                                                            {(priceSuggestion.estimated_price_per_hour - equipment.current_price).toFixed(
                                                                2
                                                            )}
                                                            /hr
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm text-gray-600 mb-2">Market Analysis</div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Confidence:</span>
                                                        <span className="font-semibold">
                                                            {(priceSuggestion.confidence_score * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Market Trend:</span>
                                                        <span className="font-semibold capitalize">{priceSuggestion.market_trend}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Location Demand:</span>
                                                        <span className="font-semibold">
                                                            {(priceSuggestion.factors.location_demand * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Seasonal Factor:</span>
                                                        <span className="font-semibold">
                                                            {(priceSuggestion.factors.seasonal_factor * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <button className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition">
                                                    Apply Suggested Price
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
