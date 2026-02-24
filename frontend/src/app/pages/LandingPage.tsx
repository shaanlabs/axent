/**
 * AXENT Landing Page - macOS Style
 * Beautiful, modern landing page showcasing AI-powered equipment rental platform
 */
import { Sparkles, TrendingUp, Brain, Image, MessageSquare, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'AI Price Estimation',
            description: 'Get instant, ML-powered price predictions based on equipment type, condition, age, location, and market trends.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: 'Smart Recommendations',
            description: 'Personalized equipment suggestions using hybrid collaborative filtering tailored to your role and location.',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Demand Forecasting',
            description: 'Predict equipment demand with time-series analysis, seasonal patterns, and regional trend insights.',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: <Image className="w-8 h-8" />,
            title: 'Image Recognition',
            description: 'Automatically detect equipment type, assess condition, and identify brands from uploaded images.',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'NLP Chatbot',
            description: 'Conversational AI assistant for inquiries, recommendations, and booking help available 24/7.',
            gradient: 'from-indigo-500 to-blue-500'
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'Advanced Analytics',
            description: 'Real-time insights, revenue optimization, and fleet management powered by machine learning.',
            gradient: 'from-yellow-500 to-orange-500'
        }
    ];

    const stats = [
        { label: 'AI Accuracy', value: '95%' },
        { label: 'Active Users', value: '10K+' },
        { label: 'Equipment Listed', value: '50K+' },
        { label: 'Avg. Response Time', value: '<200ms' }
    ];

    const benefits = [
        'Real-time price optimization with ML algorithms',
        'Automated equipment matching and recommendations',
        'Predictive maintenance and demand forecasting',
        'Smart inventory management across regions',
        '24/7 AI-powered customer support',
        'Advanced analytics and reporting dashboards'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="inline-flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-black" />
                            </div>
                            <h1 className="text-5xl font-bold">
                                <span className="text-white">AX</span>
                                <span className="text-[#D4AF37]">E</span>
                                <span className="text-white">NT</span>
                            </h1>
                        </div>

                        {/* Headline */}
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            AI-Powered Equipment
                            <br />
                            <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-transparent bg-clip-text">
                                Rental Intelligence
                            </span>
                        </h2>

                        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Transform your equipment rental business with cutting-edge artificial intelligence.
                            Get instant price estimates, smart recommendations, demand forecasting, and more.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/auth/signin')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => navigate('/auth/signin')}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                View Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-transparent bg-clip-text mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative py-24 bg-black/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">
                            Powered by Advanced AI
                        </h3>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Five cutting-edge AI services working together to revolutionize equipment rental
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105"
                            >
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-3">{feature.title}</h4>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-4xl font-bold text-white mb-6">
                                Everything you need to succeed
                            </h3>
                            <p className="text-xl text-gray-300 mb-8">
                                AXENT combines powerful AI with intuitive design to give you the competitive edge in equipment rental.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                                        <span className="text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Price Estimation</div>
                                            <div className="text-sm text-gray-400">ML-powered accuracy</div>
                                        </div>
                                        <div className="ml-auto text-2xl font-bold text-green-400">95%</div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Recommendations</div>
                                            <div className="text-sm text-gray-400">Personalized matches</div>
                                        </div>
                                        <div className="ml-auto text-2xl font-bold text-green-400">90%</div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Demand Forecasting</div>
                                            <div className="text-sm text-gray-400">Predictive analytics</div>
                                        </div>
                                        <div className="ml-auto text-2xl font-bold text-green-400">88%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-r from-[#D4AF37]/20 via-[#FFD700]/20 to-[#D4AF37]/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold text-white mb-6">
                        Ready to transform your rental business?
                    </h3>
                    <p className="text-xl text-gray-300 mb-10">
                        Join thousands of companies already using AXENT's AI-powered platform
                    </p>
                    <button
                        onClick={() => navigate('/auth/signin')}
                        className="group px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105"
                    >
                        <span className="flex items-center gap-2">
                            Start Your Free Trial
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-2xl font-bold text-white">AXENT</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2026 AXENT. AI-Powered Equipment Rental Intelligence Platform.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
