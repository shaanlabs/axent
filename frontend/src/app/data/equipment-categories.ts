import type { UserRole } from '../auth/auth-context';

/**
 * Equipment Categories organized by User Role
 * This structure defines what equipment each role can see
 */

export interface EquipmentCategory {
    id: string;
    name: string;
    description: string;
    visibleToRoles: UserRole[];
    equipmentCount: number;
}

// ORGANIZATION-ONLY CATEGORIES (Heavy Industrial)
export const ORGANIZATION_CATEGORIES: EquipmentCategory[] = [
    {
        id: 'mining-extraction',
        name: 'Mining & Heavy Extraction Equipment',
        description: 'Industrial-grade mining machinery for large-scale operations',
        visibleToRoles: ['organization', 'provider', 'admin'],
        equipmentCount: 12,
    },
    {
        id: 'oil-gas-industrial',
        name: 'Oil, Gas & Mega Industrial Equipment',
        description: 'Offshore drilling, pipeline laying, and mega industrial machinery',
        visibleToRoles: ['organization', 'provider', 'admin'],
        equipmentCount: 12,
    },
    {
        id: 'mega-infrastructure',
        name: 'Mega Infrastructure & Construction',
        description: 'Tower cranes, crawler cranes, and heavy-duty construction equipment',
        visibleToRoles: ['organization', 'provider', 'admin'],
        equipmentCount: 12,
    },
];

// CUSTOMER-ONLY CATEGORIES (Practical Use)
export const CUSTOMER_CATEGORIES: EquipmentCategory[] = [
    {
        id: 'small-construction',
        name: 'Small Construction & Daily Need',
        description: 'Mini excavators, JCBs, concrete mixers for small projects',
        visibleToRoles: ['customer', 'provider', 'admin'],
        equipmentCount: 12,
    },
    {
        id: 'agriculture',
        name: 'Agriculture Equipment',
        description: 'Tractors, harvesters, rotavators for farming operations',
        visibleToRoles: ['customer', 'provider', 'admin'],
        equipmentCount: 12,
    },
    {
        id: 'project-based',
        name: 'Project-Based Need Equipment',
        description: 'Demolition, JCB, borewell drilling for specific projects',
        visibleToRoles: ['customer', 'provider', 'admin'],
        equipmentCount: 10,
    },
];

// Helper function to get categories by role
export function getCategoriesByRole(role: UserRole): EquipmentCategory[] {
    const allCategories = [...ORGANIZATION_CATEGORIES, ...CUSTOMER_CATEGORIES];
    return allCategories.filter((cat) => cat.visibleToRoles.includes(role));
}

// Helper to check if a category is visible to a role
export function isCategoryVisibleToRole(categoryId: string, role: UserRole): boolean {
    const allCategories = [...ORGANIZATION_CATEGORIES, ...CUSTOMER_CATEGORIES];
    const category = allCategories.find((cat) => cat.id === categoryId);
    return category ? category.visibleToRoles.includes(role) : false;
}
