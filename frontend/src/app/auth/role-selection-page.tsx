import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from './auth-context';
import { Building2, User, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export function RoleSelectionPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, updateUserRole } = useAuth();

    const roles = [
        {
            id: 'customer' as UserRole,
            title: 'Customer',
            subtitle: 'Individual / Farmer / Contractor',
            description: 'Rent equipment for personal projects, farming, or small-scale construction work',
            icon: User,
            color: 'from-blue-500 to-cyan-500',
            examples: ['Home construction', 'Farm equipment', 'Small excavation'],
        },
        {
            id: 'organization' as UserRole,
            title: 'Organization',
            subtitle: 'Enterprise / Mining / Infrastructure',
            description: 'Access heavy industrial machinery for large-scale projects and operations',
            icon: Building2,
            color: 'from-purple-500 to-pink-500',
            examples: ['Mining operations', 'Oil & gas projects', 'Mega infrastructure'],
        },
        {
            id: 'provider' as UserRole,
            title: 'Machinery Provider',
            subtitle: 'Equipment Vendor / Supplier',
            description: 'List your equipment, manage rentals, and receive project bids',
            icon: Wrench,
            color: 'from-amber-500 to-orange-500',
            examples: ['Rent out equipment', 'Manage inventory', 'Receive bids'],
        },
        {
            id: 'admin' as UserRole,
            title: 'Administrator',
            subtitle: 'Platform Admin',
            description: 'Full platform access and management',
            icon: ShieldCheck,
            color: 'from-red-500 to-pink-500',
            examples: ['Manage users', 'Platform analytics', 'System settings'],
        },
    ];

    const handleRoleSelection = async () => {
        if (!selectedRole) return;

        setIsLoading(true);
        setError('');

        try {
            await updateUserRole(selectedRole);
            // Navigate to role-specific dashboard
            const roleRoutes: Record<UserRole, string> = {
                customer: '/customer/dashboard',
                organization: '/organization/dashboard',
                provider: '/provider/dashboard',
                admin: '/admin/dashboard',
            };
            navigate(roleRoutes[selectedRole]);
        } catch (err: any) {
            setError(err.message || 'Failed to set role. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 p-4 bg-surface border-b border-border">
                <div className="w-16"></div> {/* Spacer for centering */}
                <div className="text-lg font-bold">
                    A<span className="text-primary">X</span>ENT
                </div>
                <div className="text-sm text-text-secondary w-16 text-right">
                    Welcome, {user?.name}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Choose Your Role</h1>
                    <p className="text-text-secondary text-lg">
                        Select the role that best describes how you'll use AXENT
                    </p>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;

                        return (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`card-macos cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                <div className="card-macos-body p-6">
                                    {/* Icon */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                                            <p className="text-xs text-text-secondary">{role.subtitle}</p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-text-secondary mb-4">{role.description}</p>

                                    {/* Examples */}
                                    <div className="flex flex-wrap gap-2">
                                        {role.examples.map((example, index) => (
                                            <span key={index} className="badge-macos text-xs">
                                                {example}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleRoleSelection}
                        disabled={!selectedRole || isLoading}
                        className="btn-macos btn-macos-primary h-12 px-8 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Setting up...' : 'Continue'}
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
