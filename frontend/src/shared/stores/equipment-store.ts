import { create } from 'zustand';

export interface Equipment {
    id: string;
    name: string;
    category: string;
    type: string;
    price: number;
    priceUnit: 'hour' | 'day' | 'week' | 'month';
    description: string;
    specifications: Record<string, string>;
    images: string[];
    location: {
        city: string;
        coordinates: { lat: number; lng: number };
    };
    provider: {
        id: string;
        name: string;
        rating: number;
    };
    availability: boolean;
    equipmentClass: 'customer' | 'agriculture' | 'industrial';
    visibleToRoles: ('customer' | 'organization' | 'provider' | 'admin')[];
    verificationStatus: 'verified' | 'unverified' | 'flagged';
    lastVerifiedAt?: string;
    reliabilityScore: number;
}

interface EquipmentStore {
    equipment: Equipment[];
    filteredEquipment: Equipment[];
    selectedCategory: string | null;
    selectedEquipment: Equipment | null;
    searchQuery: string;

    // Actions
    setEquipment: (equipment: Equipment[]) => void;
    filterByCategory: (category: string | null) => void;
    filterByRole: (role: 'customer' | 'organization' | 'provider' | 'admin') => void;
    searchEquipment: (query: string) => void;
    selectEquipment: (id: string) => void;
    clearSelection: () => void;
}

export const useEquipmentStore = create<EquipmentStore>((set, get) => ({
    equipment: [],
    filteredEquipment: [],
    selectedCategory: null,
    selectedEquipment: null,
    searchQuery: '',

    setEquipment: (equipment) => set({ equipment, filteredEquipment: equipment }),

    filterByCategory: (category) => {
        const { equipment } = get();
        if (!category) {
            set({ filteredEquipment: equipment, selectedCategory: null });
        } else {
            set({
                filteredEquipment: equipment.filter((eq) => eq.category === category),
                selectedCategory: category,
            });
        }
    },

    filterByRole: (role) => {
        const { equipment } = get();
        const filtered = equipment.filter((eq) => eq.visibleToRoles.includes(role));
        set({ filteredEquipment: filtered });
    },

    searchEquipment: (query) => {
        const { equipment } = get();
        const lowercaseQuery = query.toLowerCase();

        if (!query) {
            set({ filteredEquipment: equipment, searchQuery: '' });
        } else {
            set({
                filteredEquipment: equipment.filter(
                    (eq) =>
                        eq.name.toLowerCase().includes(lowercaseQuery) ||
                        eq.description.toLowerCase().includes(lowercaseQuery) ||
                        eq.category.toLowerCase().includes(lowercaseQuery)
                ),
                searchQuery: query,
            });
        }
    },

    selectEquipment: (id) => {
        const { equipment } = get();
        const selected = equipment.find((eq) => eq.id === id);
        set({ selectedEquipment: selected || null });
    },

    clearSelection: () => set({ selectedEquipment: null }),
}));
