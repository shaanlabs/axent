/**
 * Customer Agriculture Equipment Page
 * Features: Equipment browsing, AI price estimation, smart recommendations
 */
import { useState } from 'react';
import { usePriceEstimate, useRecommendations } from '../../shared/hooks/useAI';

export default function AgriculturePage() {
    const [showEstimator, setShowEstimator] = useState(false);
    const { data: priceData, loading: priceLoading, estimate } = usePriceEstimate();
    const { data: recommendations, loading: recLoading, getRecommendations } = useRecommendations();

    const handleEstimate = async () => {
        try {
            await estimate({
                equipment_type: 'tractor',
                equipment_category: 'agriculture',
                condition: 'good',
                age_years: 3,
                location: 'Iowa',
                season: 'spring',
                duration_hours: 48,
            });
        } catch (err) {
            console.error('Price estimation failed:', err);
        }
    };

    const handleRecommendations = async () => {
        try {
            await getRecommendations({
                user_id: 'user_123',
                user_role: 'customer',
                location: 'Iowa',
                limit: 5,
            });
        } catch (err) {
            console.error('Recommendations failed:', err);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Agriculture Equipment</h1>
                    <p className="text-gray-600">Browse and rent equipment powered by AI recommendations</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <button
                        onClick={() => setShowEstimator(!showEstimator)}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition text-left"
                    >
                        <div className="text-3xl mb-2">🤖</div>
                        <h3 className="text-xl font-semibold mb-1">AI Price Estimator</h3>
                        <p className="text-gray-600 text-sm">
                            Get instant price estimates using advanced AI
                        </p>
                    </button>

                    <button
                        onClick={handleRecommendations}
                        disabled={recLoading}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition text-left disabled:opacity-50"
                    >
                        <div className="text-3xl mb-2">✨</div>
                        <h3 className="text-xl font-semibold mb-1">Smart Recommendations</h3>
                        <p className="text-gray-600 text-sm">
                            {recLoading ? 'Loading...' : 'Discover equipment perfect for you'}
                        </p>
                    </button>
                </div>

                {/* AI Price Estimator Demo */}
                {showEstimator && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4">🎯 AI Price Estimator</h2>
                        <p className="text-gray-600 mb-6">
                            Estimate rental prices for equipment based on multiple factors using machine learning.
                        </p>

                        <button
                            onClick={handleEstimate}
                            disabled={priceLoading}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#c4a027] transition disabled:opacity-50"
                        >
                            {priceLoading ? 'Estimating...' : 'Estimate Tractor Price (Demo)'}
                        </button>

                        {priceData && (
                            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-4">Price Estimate</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Estimated Price/Hour:</span>
                                                <span className="font-bold text-green-600">
                                                    ${priceData.estimated_price_per_hour.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Price Range:</span>
                                                <span className="font-semibold">
                                                    ${priceData.price_range_min.toFixed(2)} - $
                                                    {priceData.price_range_max.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Confidence:</span>
                                                <span className="font-semibold">
                                                    {(priceData.confidence_score * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Market Trend:</span>
                                                <span className="font-semibold capitalize">{priceData.market_trend}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-4">Pricing Factors</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Condition Impact:</span>
                                                <span className="font-semibold">
                                                    {(priceData.factors.condition_impact * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Age Impact:</span>
                                                <span className="font-semibold">
                                                    {(priceData.factors.age_impact * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Location Demand:</span>
                                                <span className="font-semibold">
                                                    {(priceData.factors.location_demand * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Seasonal Factor:</span>
                                                <span className="font-semibold">
                                                    {(priceData.factors.seasonal_factor * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* AI Recommendations */}
                {recommendations && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6">🎯 Recommended for You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recommendations.recommendations.slice(0, 6).map((item) => (
                                <div key={item.equipment_id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                                {(item.score * 100).toFixed(0)}% Match
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm capitalize">{item.type}</p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Price/Hour:</span>
                                            <span className="font-bold text-green-600">${item.price_per_hour.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Location:</span>
                                            <span className="font-semibold">{item.location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={item.available ? 'text-green-600' : 'text-red-600'}>
                                                {item.available ? '✓ Available' : '✗ Unavailable'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 italic mb-4">{item.reason}</p>

                                    <button
                                        disabled={!item.available}
                                        className="w-full py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#c4a027] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {item.available ? 'View Details' : 'Not Available'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Equipment (Mock) */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">All Agriculture Equipment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {['Tractor', 'Harvester', 'Planter', 'Sprayer'].map((name, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <div className="text-4xl mb-3">🚜</div>
                                <h3 className="font-semibold mb-2">{name}</h3>
                                <p className="text-gray-600 text-sm mb-4">Professional grade equipment</p>
                                <button className=" w-full py-2 bg-gray-100 font-semibold rounded hover:bg-gray-200 transition">
                                    Browse
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
