import { UserRole } from '../app/auth/auth-context';

// Route permission configuration
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    // Public routes (no auth required)
    '/': ['customer', 'organization', 'provider', 'admin'],
    '/sign-in': ['customer', 'organization', 'provider', 'admin'],
    '/sign-up': ['customer', 'organization', 'provider', 'admin'],
    '/role-selection': ['customer', 'organization', 'provider', 'admin'],

    // Customer module
    '/customer/*': ['customer', 'admin'],

    // Organization module
    '/organization/*': ['organization', 'admin'],

    // Provider module
    '/provider/*': ['provider', 'admin'],

    // Admin module (admin only)
    '/admin/*': ['admin'],
};

// Check if user has permission to access a route
export function hasPermission(userRole: UserRole | null, routePath: string): boolean {
    if (!userRole) return false;

    // Check exact match first
    if (ROUTE_PERMISSIONS[routePath]) {
        return ROUTE_PERMISSIONS[routePath].includes(userRole);
    }

    // Check wildcard patterns
    for (const [pattern, roles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pattern.endsWith('/*')) {
            const basePattern = pattern.replace('/*', '');
            if (routePath.startsWith(basePattern) && roles.includes(userRole)) {
                return true;
            }
        }
    }

    // Default deny
    return false;
}

// Get redirect path for user role
export function getRoleHomePath(role: UserRole): string {
    const redirects: Record<UserRole, string> = {
        customer: '/customer/dashboard',
        organization: '/organization/dashboard',
        provider: '/provider/dashboard',
        admin: '/admin/dashboard',
    };

    return redirects[role] || '/';
}
