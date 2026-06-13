'use client';

import { useState } from 'react';
import { mockAnnouncements, mockHackathons } from '@/lib/mockData';
import { timeAgo, getDaysUntil } from '@/lib/utils';
import { Bell, Search, Trophy, ChevronRight, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
    const [search, setSearch] = useState('');

    const filtered = mockAnnouncements.filter(
        (a) =>
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase()) ||
            (a.hackathonTitle || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={20} style={{ color: 'var(--accent-indigo)' }} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>College Feed</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Official hackathon announcements from admin</p>
                    </div>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginTop: '1rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Pinned Active Hackathons */}
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>📌 Active Hackathons</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
                    {mockHackathons.map((h) => {
                        const days = getDaysUntil(h.registrationDeadline);
                        return (
                            <Link key={h.id} href={`/hackathons/${h.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '1rem 1.25rem',
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 100%)',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                    borderRadius: 14,
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>{h.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🎯 {h.theme}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: days <= 7 ? 'var(--accent-rose)' : days <= 14 ? 'var(--accent-amber)' : 'var(--accent-emerald)', background: days <= 7 ? 'rgba(244,63,94,0.1)' : days <= 14 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
                                                {days > 0 ? `${days}d left` : 'Closed'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👥 {h.teamsCount} teams</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💰 {h.prizeDetails.split('|')[0].trim()}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Announcements */}
            <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
                    📢 All Announcements ({filtered.length})
                </p>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <p className="empty-state-title">No announcements found</p>
                        <p className="empty-state-desc">Try a different search term.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filtered.map((ann) => (
                            <AnnouncementCard key={ann.id} announcement={ann} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AnnouncementCard({ announcement: ann }: { announcement: typeof mockAnnouncements[0] }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Megaphone size={20} style={{ color: 'var(--accent-indigo)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{ann.title}</h3>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <span className="badge badge-indigo">
                                    <Trophy size={10} /> {ann.hackathonTitle}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(ann.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '0.75rem' }}
                        className={expanded ? '' : 'truncate-3'}>
                        {ann.content}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem', flexWrap: 'wrap', gap: 8 }}>
                        <button
                            className="btn-ghost"
                            style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? 'Show less' : 'Read more'}
                            <ChevronRight size={12} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                        </button>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Posted by <strong style={{ color: 'var(--text-secondary)' }}>{ann.adminName}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
