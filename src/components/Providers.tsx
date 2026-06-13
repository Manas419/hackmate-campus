'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Migrate old localStorage format if needed (removes stale registeredUsers[] array)
        try {
            const raw = localStorage.getItem('hackmate-auth');
            if (raw) {
                const parsed = JSON.parse(raw);
                // If old format had registeredUsers array instead of userRegistry object, reset it
                if (parsed?.state?.registeredUsers && !parsed?.state?.userRegistry) {
                    const oldUsers: Array<{ email: string }> = parsed.state.registeredUsers;
                    const registry: Record<string, unknown> = {};
                    oldUsers.forEach((u) => { registry[u.email] = u; });
                    parsed.state.userRegistry = registry;
                    delete parsed.state.registeredUsers;
                    localStorage.setItem('hackmate-auth', JSON.stringify(parsed));
                }
            }
        } catch {
            // If anything goes wrong with migration, just let rehydrate handle it
        }

        // Rehydrate the zustand persist store on client mount.
        // We use skipHydration:true to avoid accessing localStorage during SSR.
        useAuthStore.persist.rehydrate();
        useTeamStore.persist.rehydrate();
    }, []);

    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#111827',
                        color: '#f1f5f9',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#111827' },
                    },
                    error: {
                        iconTheme: { primary: '#f43f5e', secondary: '#111827' },
                    },
                }}
            />
        </>
    );
}
