'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

// ── Emails that have admin access ────────────────────────────────────────────
const ADMIN_EMAILS = ['manas@admin.com', 'rounak@admin.com', 'rounaksute@gmail.com'];

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    // Registry of every user who has ever logged in or signed up — persisted
    // so profile edits survive logout, refresh, and re-login.
    userRegistry: Record<string, User>; // keyed by email
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    getUserById: (id: string) => User | null;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    department: string;
    year: number;
    role?: UserRole;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            userRegistry: {},

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 800));

                if (password.length < 6) {
                    set({ isLoading: false });
                    return { success: false, error: 'Invalid credentials' };
                }

                const { userRegistry } = get();

                // 1) Check the persisted registry first — has the most up-to-date profile edits
                let user: User | undefined = userRegistry[email];

                // 2) Fall back to built-in mock users (base data)
                if (!user) user = mockUsers.find((u) => u.email === email);

                // 3) Auto-create a stable demo profile for any unknown email
                if (!user) {
                    user = {
                        id: `user-${email.replace(/[^a-z0-9]/gi, '-')}`,
                        name: email.split('@')[0].replace(/[._]/g, ' '),
                        email,
                        role: ADMIN_EMAILS.includes(email) ? 'admin' : 'student',
                        department: 'Computer Science',
                        year: 2,
                        bio: '',
                        skills: [],
                        portfolioLinks: [],
                        availability: 'available',
                        createdAt: new Date().toISOString(),
                    };
                }

                // Enforce admin whitelist
                if (ADMIN_EMAILS.includes(email) && user.role !== 'admin') {
                    user = { ...user, role: 'admin' };
                } else if (!ADMIN_EMAILS.includes(email) && user.role === 'admin') {
                    user = { ...user, role: 'student' };
                }

                // Save/update this user in the registry so future logins get the same data
                set({
                    user,
                    token: `mock-jwt-token-${user.id}`,
                    isAuthenticated: true,
                    isLoading: false,
                    userRegistry: { ...userRegistry, [email]: user },
                });
                return { success: true };
            },

            signup: async (data: SignupData) => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 1000));

                const { userRegistry } = get();

                // Prevent duplicate signups
                const existsInRegistry = !!userRegistry[data.email];
                const existsInMock = mockUsers.some((u) => u.email === data.email);
                if (existsInRegistry || existsInMock) {
                    set({ isLoading: false });
                    return { success: false, error: 'An account with this email already exists. Please log in.' };
                }

                const newUser: User = {
                    id: `user-${Date.now()}`,
                    name: data.name,
                    email: data.email,
                    role: ADMIN_EMAILS.includes(data.email) ? 'admin' : (data.role || 'student'),
                    department: data.department,
                    year: data.year,
                    bio: '',
                    skills: [],
                    portfolioLinks: [],
                    availability: 'available',
                    createdAt: new Date().toISOString(),
                };

                // Save to registry immediately
                set({
                    user: newUser,
                    token: `mock-jwt-token-${newUser.id}`,
                    isAuthenticated: true,
                    isLoading: false,
                    userRegistry: { ...userRegistry, [data.email]: newUser },
                });
                return { success: true };
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                // userRegistry is intentionally kept so next login restores profile
            },

            updateProfile: (data: Partial<User>) => {
                const current = get().user;
                if (!current) return;

                const updated: User = { ...current, ...data };

                // Persist the updated profile into the registry keyed by email
                set({
                    user: updated,
                    userRegistry: {
                        ...get().userRegistry,
                        [updated.email]: updated,
                    },
                });
            },

            getUserById: (id: string) => {
                const { userRegistry } = get();
                // 1) Search in registry (updated profiles)
                const registeredUser = Object.values(userRegistry).find(u => u.id === id);
                if (registeredUser) return registeredUser;

                // 2) Search in mock defaults
                const mockUser = mockUsers.find(u => u.id === id);
                if (mockUser) return mockUser;

                return null;
            }
        }),
        {
            name: 'hackmate-auth',
            skipHydration: true,
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                userRegistry: state.userRegistry, // ← persist all user profiles
            }),
        }
    )
);
