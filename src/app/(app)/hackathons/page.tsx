'use client';

import { mockHackathons } from '@/lib/mockData';
import { formatDate, getDaysUntil } from '@/lib/utils';
import { Trophy, Calendar, Clock, Users, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CustomSelect from '@/components/CustomSelect';

export default function HackathonsPage() {
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

    const filtered = mockHackathons.filter((h) => {
        const days = getDaysUntil(h.registrationDeadline);
        if (filter === 'active') return days > 0;
        if (filter === 'upcoming') return getDaysUntil(h.eventDate || h.registrationDeadline) > 14;
        return true;
    });

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>🏆 Hackathons</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Discover all campus hackathons — register your team before the deadline!</p>
            </div>

            {/* Filters */}
            <div style={{ width: 220, marginBottom: '1.5rem' }}>
                <CustomSelect
                    value={filter}
                    onChange={(val) => setFilter(val as any)}
                    options={[
                        { value: 'all', label: 'All Hackathons' },
                        { value: 'active', label: '🔥 Registration Open' },
                        { value: 'upcoming', label: '📅 Upcoming' }
                    ]}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filtered.map((h) => {
                    const days = getDaysUntil(h.registrationDeadline);
                    const isOpen = days > 0;
                    return (
                        <div key={h.id} className="card" style={{ padding: '0' }}>
                            {/* Card Header */}
                            <div style={{
                                padding: '1.5rem 1.75rem 1.25rem',
                                background: isOpen
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)'
                                    : 'transparent',
                                borderRadius: '16px 16px 0 0',
                                borderBottom: '1px solid var(--border-subtle)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 240 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trophy size={20} style={{ color: 'var(--accent-amber)' }} />
                                            </div>
                                            <div>
                                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{h.title}</h2>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 500 }}>🎯 {h.theme}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                        {isOpen ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.25rem 0.75rem', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
                                                Registration Open
                                            </span>
                                        ) : (
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Registration Closed
                                            </span>
                                        )}
                                        {isOpen && (
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, background: days <= 7 ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)', color: days <= 7 ? 'var(--accent-rose)' : 'var(--accent-amber)', fontSize: '0.75rem', fontWeight: 700 }}>
                                                <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                                                {days}d left
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="truncate-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h.description}</p>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '1.25rem 1.75rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Calendar size={14} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Registration Deadline</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{formatDate(h.registrationDeadline)}</p>
                                        </div>
                                    </div>
                                    {h.eventDate && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Trophy size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Event Date</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{formatDate(h.eventDate)}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Users size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Team Size</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{h.minTeamSize}–{h.maxTeamSize} members</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14, flexShrink: 0 }}>💰</span>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prizes</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>{h.prizeDetails.split('|')[0].trim()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👥 {h.teamsCount} teams registered</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <Link href={`/teams?hackathon=${h.id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                            <Users size={13} /> Browse Teams
                                        </Link>
                                        <Link href={`/hackathons/${h.id}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                            View Details <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        </div>
    );
}
