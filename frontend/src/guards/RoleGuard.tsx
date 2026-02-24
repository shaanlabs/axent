import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../app/auth/auth-context';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: ReactNode;
    redirectTo?: string;
}

export function RoleGuard({ allowedRoles, children, redirectTo = '/' }: RoleGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Show nothing while loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/sign-in" replace />;
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their appropriate module
        const roleRedirects: Record<UserRole, string> = {
            customer: '/customer/dashboard',
            organization: '/organization/dashboard',
            provider: '/provider/dashboard',
            admin: '/admin/dashboard',
        };

        return <Navigate to={roleRedirects[user.role] || redirectTo} replace />;
    }

    // Allow access
    return <>{children}</>;
}
