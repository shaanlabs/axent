import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase, setSupabaseToken } from '../../lib/supabase';

export type UserRole = 'customer' | 'organization' | 'provider' | 'admin';

export interface User {
    id: string; // This will now be the Clerk User ID
    email: string;
    name: string;
    role: UserRole;
    location?: {
        city: string;
        coordinates: { lat: number; lng: number };
    };
    avatar?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
    updateUserRole: (role: UserRole) => Promise<void>;
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
    const { signOut: clerkSignOut, getToken } = useClerkAuth();

    const [appUser, setAppUser] = useState<User | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (isClerkLoaded) {
                if (isSignedIn && clerkUser) {
                    try {
                        const token = await getToken({ template: 'supabase' });
                        setSupabaseToken(token);
                    } catch (e) {
                        console.error("Failed to fetch Supabase token from Clerk", e);
                    }
                    await syncUserProfile(clerkUser);
                } else {
                    setSupabaseToken(null);
                    setAppUser(null);
                    setIsProfileLoading(false);
                }
            }
        };
        initAuth();
    }, [isClerkLoaded, isSignedIn, clerkUser, getToken]);

    const syncUserProfile = async (cUser: any) => {
        try {
            setIsProfileLoading(true);
            const email = cUser.primaryEmailAddress?.emailAddress || '';
            const name = cUser.fullName || `${cUser.firstName || ''} ${cUser.lastName || ''}`.trim() || 'User';
            const avatar = cUser.imageUrl;

            // Check if profile exists in Supabase
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', cUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                // Not a "Row not found" error
                console.error('Error fetching Supabase profile:', error);
            }

            if (data) {
                // Profile exists
                setAppUser({
                    id: data.id,
                    email: data.email || email,
                    name: data.name || name,
                    role: data.role,
                    location: data.location,
                    avatar: data.avatar_url || avatar,
                    phone: data.phone || undefined,
                });
            } else {
                // Create new profile for first-time Clerk sign-ins
                const { error: insertError } = await supabase.from('profiles').insert({
                    id: cUser.id,
                    email: email,
                    name: name,
                    role: 'customer', // Default role
                    avatar_url: avatar
                });

                if (insertError) {
                    console.error('Error creating user profile in Supabase:', insertError);
                }

                setAppUser({
                    id: cUser.id,
                    email: email,
                    name: name,
                    role: 'customer',
                    avatar: avatar
                });
            }
        } catch (error) {
            console.error('Unexpected error syncing profile:', error);
        } finally {
            setIsProfileLoading(false);
        }
    };

    const signOut = async () => {
        await clerkSignOut();
        setAppUser(null);
    };

    const updateUserRole = async (role: UserRole) => {
        if (!appUser) throw new Error('No user logged in');

        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', appUser.id);

        if (error) throw error;

        setAppUser({ ...appUser, role });
    };

    const updateUserProfile = async (updates: Partial<User>) => {
        if (!appUser) throw new Error('No user logged in');

        const { error } = await supabase
            .from('profiles')
            .update({
                name: updates.name,
                location: updates.location,
                avatar_url: updates.avatar,
                phone: updates.phone,
            })
            .eq('id', appUser.id);

        if (error) throw error;

        setAppUser({ ...appUser, ...updates });
    };

    const isLoading = !isClerkLoaded || isProfileLoading;

    return (
        <AuthContext.Provider
            value={{
                user: appUser,
                isAuthenticated: !!isSignedIn && !!appUser,
                isLoading,
                signOut,
                updateUserRole,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
