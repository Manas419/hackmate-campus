'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, Application, TeamMember, ApplicationStatus, TeamStatus } from '@/lib/types';
import { mockTeams, mockApplications } from '@/lib/mockData';

interface TeamStore {
    teams: Team[];
    applications: Application[];

    // Actions
    applyToTeam: (application: Omit<Application, 'id' | 'status' | 'createdAt'>) => void;
    updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
    finalizeTeam: (teamId: string) => void;
    createTeam: (team: Team) => void;
    removeMember: (teamId: string, userId: string) => void;

    // For hydration/reset if needed
    setTeams: (teams: Team[]) => void;
    setApplications: (apps: Application[]) => void;
}

export const useTeamStore = create<TeamStore>()(
    persist(
        (set, get) => ({
            teams: mockTeams,
            applications: mockApplications,

            setTeams: (teams) => set({ teams }),
            setApplications: (applications) => set({ applications }),

            applyToTeam: (data) => {
                const newApp: Application = {
                    ...data,
                    id: `app-${Date.now()}`,
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                };
                set({ applications: [newApp, ...get().applications] });
            },

            updateApplicationStatus: (applicationId, status) => {
                const { applications, teams } = get();
                const app = applications.find(a => a.id === applicationId);
                if (!app) return;

                // Update application status
                const updatedApps = applications.map(a =>
                    a.id === applicationId ? { ...a, status } : a
                );

                let updatedTeams = teams;
                if (status === 'ACCEPTED') {
                    const team = teams.find(t => t.id === app.teamId);
                    if (team) {
                        // Create new member record
                        const newMember: TeamMember = {
                            id: `tm-${Date.now()}`,
                            teamId: team.id,
                            userId: app.userId,
                            userName: app.userName || 'Unknown User',
                            userDepartment: app.userDepartment,
                            userSkills: app.userSkills,
                            role: app.appliedRole || 'Member',
                            joinedAt: new Date().toISOString(),
                        };

                        // Update team members and currentMembers count
                        updatedTeams = teams.map(t => {
                            if (t.id === app.teamId) {
                                // Update requiredRoles filled count
                                const updatedRoles = t.requiredRoles.map(r =>
                                    r.role === app.appliedRole ? { ...r, filled: r.filled + 1 } : r
                                );

                                return {
                                    ...t,
                                    members: [...(t.members || []), newMember],
                                    currentMembers: t.currentMembers + 1,
                                    requiredRoles: updatedRoles
                                };
                            }
                            return t;
                        });

                        // Reject all other pending applications for this user if they joined a team
                        // (Optional business logic, keeping it simple for now)
                    }
                }

                set({ applications: updatedApps, teams: updatedTeams });
            },

            finalizeTeam: (teamId) => {
                const { teams } = get();
                const updatedTeams = teams.map(t =>
                    t.id === teamId ? { ...t, status: 'LOCKED' as TeamStatus } : t
                );
                set({ teams: updatedTeams });
            },

            createTeam: (team) => {
                set({ teams: [team, ...get().teams] });
            },

            removeMember: (teamId, userId) => {
                const { teams } = get();
                const updatedTeams = teams.map(t => {
                    if (t.id === teamId) {
                        const memberToRemove = t.members?.find(m => m.userId === userId);
                        if (!memberToRemove) return t;

                        // Find the role the member had and decrement its filled count
                        const updatedRoles = t.requiredRoles.map(r =>
                            r.role === memberToRemove.role ? { ...r, filled: Math.max(0, r.filled - 1) } : r
                        );

                        return {
                            ...t,
                            members: t.members?.filter(m => m.userId !== userId),
                            currentMembers: Math.max(1, t.currentMembers - 1),
                            requiredRoles: updatedRoles,
                            status: 'OPEN' as TeamStatus
                        };
                    }
                    return t;
                });
                set({ teams: updatedTeams });
            }
        }),
        {
            name: 'hackmate-teams',
            skipHydration: true,
        }
    )
);
