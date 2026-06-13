'use client';

import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { mockHackathons, mockAnnouncements } from '@/lib/mockData';
import { getDaysUntil, formatDate, timeAgo } from '@/lib/utils';
import { Trophy, Users, Bell, Zap, Clock, ArrowRight, TrendingUp, Calendar, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { teams, applications } = useTeamStore();

    const activeHackathons = mockHackathons.filter(
        (h) => getDaysUntil(h.registrationDeadline) > 0
    );
    const myTeams = teams.filter(
        (t) => t.leaderId === user?.id || t.members?.some((m) => m.userId === user?.id)
    );
    const myApplications = applications.filter((a) => a.userId === user?.id);
    const recentAnnouncements = mockAnnouncements.slice(0, 3);
    const openTeams = teams.filter((t) => t.status === 'OPEN');

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Here's what's happening in your campus hackathon ecosystem.</p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: Trophy, label: 'Active Hackathons', value: activeHackathons.length, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
                    { icon: Users, label: 'My Teams', value: myTeams.length, color: 'var(--accent-indigo)', bg: 'rgba(99,102,241,0.1)' },
                    { icon: Zap, label: 'Open Teams', value: openTeams.length, color: 'var(--accent-cyan)', bg: 'rgba(6,182,212,0.1)' },
                    { icon: Bell, label: 'My Applications', value: myApplications.length, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="stat-card">
                        <div className="stat-icon" style={{ background: bg }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Active Hackathons */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>🏆 Active Hackathons</h2>
                        <Link href="/hackathons" style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {activeHackathons.slice(0, 3).map((h) => {
                            const days = getDaysUntil(h.registrationDeadline);
                            const targetHref = h.officialLink || `/hackathons/${h.id}`;
                            const isExternal = !!h.officialLink;

                            return (
                                <Link key={h.id} href={targetHref} target={isExternal ? "_blank" : "_self"} style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                {h.title} {isExternal && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{h.teamsCount} teams · {h.theme}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: days <= 7 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{days}d left</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>to register</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Announcements */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>📢 Announcements</h2>
                        <Link href="/feed" style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {recentAnnouncements.map((ann) => (
                            <div key={ann.id} style={{ padding: '0.875rem', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 4 }}>{ann.title}</p>
                                <p className="truncate-2" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ann.content}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>by {ann.adminName} · {timeAgo(ann.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Applications */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>📋 My Applications</h2>
                    </div>
                    {myApplications.length === 0 ? (
                        <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                            <div className="empty-state-icon">📭</div>
                            <p className="empty-state-title">No applications yet</p>
                            <p className="empty-state-desc">Browse open teams and apply!</p>
                            <Link href="/teams" className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>Explore Teams</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {myApplications.map((app) => (
                                <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{app.teamName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.hackathonTitle} · {app.appliedRole}</p>
                                    </div>
                                    <span className={`status-${app.status.toLowerCase()}`}>{app.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.25rem' }}>⚡ Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { href: '/teams', label: 'Explore Open Teams', icon: Users, color: 'var(--accent-indigo)', bg: 'rgba(99,102,241,0.1)' },
                            { href: '/teams/create', label: 'Create a New Team', icon: Zap, color: 'var(--accent-cyan)', bg: 'rgba(6,182,212,0.1)' },
                            { href: '/hackathons', label: 'View All Hackathons', icon: Trophy, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
                            { href: '/profile', label: 'Complete Your Profile', icon: CheckCircle2, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
                        ].map(({ href, label, icon: Icon, color, bg }) => (
                            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={16} style={{ color }} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
                                    <ArrowRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const { teams } = useTeamStore();
    const totalStudents = 423;
    const totalTeams = teams.length;
    const activeHackathons = mockHackathons.length;
    const announcements = mockAnnouncements.length;

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '0.25rem 0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>🛡️ ADMIN PANEL</span>
                </div>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage hackathons, teams, and campus activity.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: '🎓', label: 'Registered Students', value: totalStudents, color: 'rgba(99,102,241,0.1)' },
                    { icon: '🏆', label: 'Active Hackathons', value: activeHackathons, color: 'rgba(245,158,11,0.1)' },
                    { icon: '👥', label: 'Total Teams', value: totalTeams, color: 'rgba(6,182,212,0.1)' },
                    { icon: '📢', label: 'Announcements', value: announcements, color: 'rgba(16,185,129,0.1)' },
                ].map(({ icon, label, value, color }) => (
                    <div key={label} className="stat-card">
                        <div className="stat-icon" style={{ background: color, fontSize: 20 }}>{icon}</div>
                        <div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.25rem' }}>⚡ Admin Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { href: '/admin/hackathons', label: 'Create Hackathon Post', icon: '🏆' },
                            { href: '/admin/announcements', label: 'Post Announcement', icon: '📢' },
                            { href: '/admin/teams', label: 'Review Teams', icon: '👥' },
                            { href: '/admin/students', label: 'Manage Students', icon: '🎓' },
                        ].map(({ href, label, icon }) => (
                            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-indigo)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                                    <span style={{ fontSize: 20 }}>{icon}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
                                    <ArrowRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.25rem' }}>📊 Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { text: 'ByteBuilders team created', sub: '2 hours ago', icon: '👥' },
                            { text: 'New student registered: Rohit V.', sub: '4 hours ago', icon: '🎓' },
                            { text: 'DataMinds team finalized', sub: '1 day ago', icon: '🔒' },
                            { text: 'DataQuest dataset published', sub: '3 days ago', icon: '📊' },
                        ].map(({ text, sub, icon }) => (
                            <div key={text} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{text}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
