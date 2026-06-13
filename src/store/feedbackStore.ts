'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IssueCategory = 'registration' | 'team' | 'technical' | 'hackathon' | 'general' | 'other';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface FeedbackItem {
    id: string;
    category: IssueCategory;
    priority: IssuePriority;
    status: IssueStatus;
    subject: string;
    description: string;
    userId: string;
    userName: string;
    userEmail: string;
    userDepartment?: string;
    userYear?: number;
    adminNote?: string;
    createdAt: string;
    updatedAt: string;
}

interface FeedbackStore {
    items: FeedbackItem[];
    submitFeedback: (data: Omit<FeedbackItem, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'adminNote'>) => void;
    updateStatus: (id: string, status: IssueStatus, adminNote?: string) => void;
    deleteItem: (id: string) => void;
}

// Seed some realistic mock issues so the admin panel isn't empty
const SEED_ITEMS: FeedbackItem[] = [
    {
        id: 'fb-1',
        category: 'registration',
        priority: 'high',
        status: 'open',
        subject: 'Unable to register for InnovateCS 2026',
        description: 'I keep getting a "team already registered" error but I am not part of any team. Please help before the deadline.',
        userId: 'user-11',
        userName: 'Meera Joshi',
        userEmail: 'meera@college.edu',
        userDepartment: 'Computer Science',
        userYear: 1,
        createdAt: '2026-02-20T09:30:00Z',
        updatedAt: '2026-02-20T09:30:00Z',
    },
    {
        id: 'fb-2',
        category: 'team',
        priority: 'medium',
        status: 'in_progress',
        subject: 'Team leader not responding to application',
        description: 'I applied to ByteBuilders 4 days ago and the leader has not accepted or rejected. Can an admin intervene?',
        userId: 'user-17',
        userName: 'Tanvi Kulkarni',
        userEmail: 'tanvi@college.edu',
        userDepartment: 'Computer Science',
        userYear: 2,
        adminNote: 'Contacted team leader. Will resolve by Feb 23.',
        createdAt: '2026-02-19T14:00:00Z',
        updatedAt: '2026-02-20T11:00:00Z',
    },
    {
        id: 'fb-3',
        category: 'technical',
        priority: 'urgent',
        status: 'resolved',
        subject: 'Chat page crashing on mobile',
        description: 'The team chat page crashes immediately on my phone (Android, Chrome). It works fine on desktop.',
        userId: 'user-10',
        userName: 'Rohan Gupta',
        userEmail: 'rohan@college.edu',
        userDepartment: 'Information Technology',
        userYear: 2,
        adminNote: 'Fixed in latest deployment. Please clear browser cache.',
        createdAt: '2026-02-18T16:00:00Z',
        updatedAt: '2026-02-21T10:00:00Z',
    },
];

export const useFeedbackStore = create<FeedbackStore>()(
    persist(
        (set, get) => ({
            items: SEED_ITEMS,

            submitFeedback: (data) => {
                const newItem: FeedbackItem = {
                    ...data,
                    id: `fb-${Date.now()}`,
                    status: 'open',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set({ items: [newItem, ...get().items] });
            },

            updateStatus: (id, status, adminNote) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id
                            ? { ...item, status, adminNote: adminNote ?? item.adminNote, updatedAt: new Date().toISOString() }
                            : item
                    ),
                });
            },

            deleteItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
        }),
        { name: 'hackmate-feedback' }
    )
);
