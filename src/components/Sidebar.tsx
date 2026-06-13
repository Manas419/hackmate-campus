'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { getInitials } from '@/lib/utils';
import {
    LayoutDashboard, Zap, Users, PlusSquare, MessageSquare,
    User, LogOut, Bell, Shield, ChevronRight, Trophy, LifeBuoy, HelpCircle
} from 'lucide-react';

const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/feed', label: 'College Feed', icon: Bell },
    { href: '/hackathons', label: 'Hackathons', icon: Trophy },
    { href: '/teams', label: 'Explore Teams', icon: Users },
    { href: '/my-teams', label: 'My Teams', icon: Zap },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/support', label: 'Support', icon: LifeBuoy },
];

const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/hackathons', label: 'Manage Hackathons', icon: Trophy },
    { href: '/admin/teams', label: 'Manage Teams', icon: Users },
    { href: '/admin/students', label: 'Students', icon: User },
    { href: '/admin/announcements', label: 'Announcements', icon: Bell },
    { href: '/admin/feedback', label: 'Student Issues', icon: MessageSquare },
    { href: '/profile', label: 'My Profile', icon: Shield },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { teams } = useTeamStore();

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    // Find the user's LOCKED team (if any) — only members of locked teams get chat access
    const lockedTeam = user
        ? teams.find(
            (t) =>
                t.status === 'LOCKED' &&
                (t.leaderId === user.id || t.members?.some((m) => m.userId === user.id))
        )
        : null;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-lg"
                            style={{ background: 'var(--gradient-brand)' }}
                        >
                            H
                        </div>
                        <div>
                            <p className="font-bold text-base" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
                                HackMate
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Campus Edition</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                    {links.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto" />}
                            </Link>
                        );
                    })}

                    {/* Chat link — ONLY visible if user is a member of a LOCKED team */}
                    {lockedTeam ? (
                        <Link
                            href={`/chat?team=${lockedTeam.id}`}
                            className={`sidebar-link ${pathname === '/chat' ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <MessageSquare size={18} />
                            <span>Team Chat</span>
                            <span
                                style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 4 }}
                            >
                                LIVE
                            </span>
                        </Link>
                    ) : (
                        <div
                            className="sidebar-link"
                            style={{ opacity: 0.35, cursor: 'not-allowed' }}
                            title="Only available once your team is finalized & locked"
                        >
                            <MessageSquare size={18} />
                            <span>Team Chat</span>
                            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>🔒</span>
                        </div>
                    )}

                    {/* Create Team — only for non-admin */}
                    {user?.role !== 'admin' && (
                        <Link
                            href="/teams/create"
                            className={`sidebar-link ${pathname === '/teams/create' ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <PlusSquare size={18} />
                            <span>Create Team</span>
                        </Link>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    {user ? (
                        <div>
                            <div className="flex items-center gap-3 mb-3 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="avatar w-9 h-9 text-sm flex-shrink-0" style={{ width: 36, height: 36, fontSize: '12px', overflow: 'hidden' }}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                        {user.role === 'admin' ? '🛡️ Admin' : user.role === 'team_leader' ? '👑 Leader' : '🎓 Student'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="btn-ghost w-full justify-center text-sm"
                                style={{ color: 'var(--accent-rose)' }}
                            >
                                <LogOut size={15} />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn-primary w-full justify-center">
                            Sign In
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
