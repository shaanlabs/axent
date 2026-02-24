import { create } from 'zustand';

export interface Project {
    id: string;
    title: string;
    description: string;
    type: 'Demolition' | 'Construction' | 'Farming' | 'Drilling' | 'Excavation' | 'Other';
    budget: {
        min: number;
        max: number;
    };
    deadline: string; // ISO date string
    location: {
        city: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    images: string[];
    client: {
        id: string;
        name: string;
        rating: number;
    };
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    bidsCount: number;
    createdAt: string;
}

export interface Bid {
    id: string;
    projectId: string;
    vendorId: string;
    vendor: {
        name: string;
        rating: number;
        completedProjects: number;
    };
    amount: number;
    timeline: string;
    proposal: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

interface ProjectStore {
    projects: Project[];
    myProjects: Project[];
    myBids: Bid[];
    addProject: (project: Omit<Project, 'id' | 'bidsCount' | 'createdAt'>) => void;
    addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void;
    acceptBid: (bidId: string) => void;
    reject Bid: (bidId: string) => void;
getProjectById: (id: string) => Project | undefined;
getBidsByProject: (projectId: string) => Bid[];
}

const mockProjects: Project[] = [
    {
        id: '1',
        title: 'Coastal Highway Expansion - NH 66',
        description: 'Excavation and road widening work for National Highway 66 near Bhatkal. Requires heavy-duty excavators and experienced operators for coastal terrain.',
        type: 'Excavation',
        budget: { min: 850000, max: 1200000 }, // ₹8.5L - ₹12L
        deadline: '2026-03-15',
        location: {
            city: 'Bhatkal',
            coordinates: { lat: 13.9857, lng: 74.5567 },
        },
        images: [],
        client: {
            id: 'c1',
            name: 'Karnataka Public Works Department',
            rating: 4.9,
        },
        status: 'open',
        bidsCount: 12,
        createdAt: '2026-02-10',
    },
    {
        id: '2',
        title: 'Commercial Complex Foundation - Mangalore',
        description: 'Foundation work for a new 8-story commercial complex in Mangalore. Looking for reliable contractors with proven track record in coastal construction.',
        type: 'Construction',
        budget: { min: 2500000, max: 3500000 }, // ₹25L - ₹35L
        deadline: '2026-04-01',
        location: {
            city: 'Mangalore',
            coordinates: { lat: 12.9141, lng: 74.8560 },
        },
        images: [],
        client: {
            id: 'c2',
            name: 'Coastal Developers Pvt Ltd',
            rating: 4.7,
        },
        status: 'open',
        bidsCount: 8,
        createdAt: '2026-02-12',
    },
    {
        id: '3',
        title: 'Pipeline Laying - Water Supply Project',
        description: 'Underground water pipeline installation from Bhatkal to Murdeshwar. Requires HDD drilling equipment and pipeline laying machinery.',
        type: 'Drilling',
        budget: { min: 1800000, max: 2500000 }, // ₹18L - ₹25L
        deadline: '2026-03-30',
        location: {
            city: 'Bhatkal',
            coordinates: { lat: 13.9857, lng: 74.5567 },
        },
        images: [],
        client: {
            id: 'c3',
            name: 'Karnataka Water Board',
            rating: 4.8,
        },
        status: 'open',
        bidsCount: 15,
        createdAt: '2026-02-08',
    },
    {
        id: '4',
        title: 'Rice Paddy Cultivation - 25 Acres',
        description: 'Need tractors, rotavators, and harvesters for rice cultivation across 25 acres near Udupi. Season starts in 2 weeks.',
        type: 'Farming',
        budget: { min: 180000, max: 250000 }, // ₹1.8L - ₹2.5L
        deadline: '2026-02-28',
        location: {
            city: 'Udupi',
            coordinates: { lat: 13.3409, lng: 74.7421 },
        },
        images: [],
        client: {
            id: 'c4',
            name: 'Coastal Farmers Cooperative',
            rating: 4.6,
        },
        status: 'open',
        bidsCount: 7,
        createdAt: '2026-02-14',
    },
    {
        id: '5',
        title: 'Temple Demolition & Reconstruction',
        description: 'Controlled demolition of old temple structure in Kundapura followed by site preparation for reconstruction. Requires experienced team with heritage structure expertise.',
        type: 'Demolition',
        budget: { min: 400000, max: 600000 }, // ₹4L - ₹6L
        deadline: '2026-03-10',
        location: {
            city: 'Kundapura',
            coordinates: { lat: 13.6250, lng: 74.6892 },
        },
        images: [],
        client: {
            id: 'c5',
            name: 'Kundapura Temple Trust',
            rating: 4.9,
        },
        status: 'open',
        bidsCount: 5,
        createdAt: '2026-02-13',
    },
];

const mockBids: Bid[] = [
    {
        id: 'b1',
        projectId: '1',
        vendorId: 'v1',
        vendor: {
            name: 'Coastal Heavy Equipment Rentals',
            rating: 4.7,
            completedProjects: 156,
        },
        amount: 950000, // ₹9.5L
        timeline: '18 days',
        proposal: 'We can complete this project efficiently with our Tata Hitachi excavators and experienced team familiar with coastal terrain.',
        status: 'pending',
        createdAt: '2026-02-11',
    },
    {
        id: 'b2',
        projectId: '1',
        vendorId: 'v5',
        vendor: {
            name: 'Bhatkal Construction Equipment',
            rating: 4.8,
            completedProjects: 89,
        },
        amount: 880000, // ₹8.8L
        timeline: '20 days',
        proposal: 'Local team with extensive NH 66 experience. We have all required equipment available immediately.',
        status: 'pending',
        createdAt: '2026-02-12',
    },
    {
        id: 'b3',
        projectId: '2',
        vendorId: 'v1',
        vendor: {
            name: 'Coastal Heavy Equipment Rentals',
            rating: 4.7,
            completedProjects: 156,
        },
        amount: 2800000, // ₹28L
        timeline: '45 days',
        proposal: 'Complete foundation package including excavation, piling, and concrete work. Proven track record in Mangalore.',
        status: 'pending',
        createdAt: '2026-02-13',
    },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: mockProjects,
    myProjects: [],
    myBids: mockBids,

    addProject: (project) =>
        set((state) => ({
            projects: [
                {
                    ...project,
                    id: Date.now().toString(),
                    bidsCount: 0,
                    createdAt: new Date().toISOString(),
                    status: 'open',
                },
                ...state.projects,
            ],
            myProjects: [
                {
                    ...project,
                    id: Date.now().toString(),
                    bidsCount: 0,
                    createdAt: new Date().toISOString(),
                    status: 'open',
                },
                ...state.myProjects,
            ],
        })),

    addBid: (bid) =>
        set((state) => ({
            myBids: [
                {
                    ...bid,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                },
                ...state.myBids,
            ],
        })),

    acceptBid: (bidId) =>
        set((state) => ({
            myBids: state.myBids.map((bid) =>
                bid.id === bidId ? { ...bid, status: 'accepted' as const } : bid
            ),
        })),

    rejectBid: (bidId) =>
        set((state) => ({
            myBids: state.myBids.map((bid) =>
                bid.id === bidId ? { ...bid, status: 'rejected' as const } : bid
            ),
        })),

    getProjectById: (id) => {
        return get().projects.find((project) => project.id === id);
    },

    getBidsByProject: (projectId) => {
        return get().myBids.filter((bid) => bid.projectId === projectId);
    },
}));
