import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
    );
}

// Keep a reference to the latest Clerk token
let currentClerkToken = '';

export const setSupabaseToken = (token: string | null) => {
    currentClerkToken = token || '';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: async (url, options = {}) => {
            const headers = new Headers(options?.headers);
            if (currentClerkToken) {
                headers.set('Authorization', `Bearer ${currentClerkToken}`);
            }
            return fetch(url, { ...options, headers });
        }
    }
});
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    role: 'customer' | 'organization' | 'provider' | 'admin';
                    location: any | null;
                    avatar_url: string | null;
                    phone: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    name?: string | null;
                    role: 'customer' | 'organization' | 'provider' | 'admin';
                    location?: any | null;
                    avatar_url?: string | null;
                    phone?: string | null;
                };
                Update: {
                    name?: string | null;
                    role?: 'customer' | 'organization' | 'provider' | 'admin';
                    location?: any | null;
                    avatar_url?: string | null;
                    phone?: string | null;
                };
            };
        };
    };
}
