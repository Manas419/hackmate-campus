'use client';

import { use } from 'react';
import { mockHackathons, mockTeams } from '@/lib/mockData';
import { formatDate, getDaysUntil } from '@/lib/utils';
import { Trophy, Calendar, Users, ArrowRight, ChevronLeft, Clock, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function HackathonDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const hackathon = mockHackathons.find((h) => h.id === id);
    if (!hackathon) return notFound();

    const days = getDaysUntil(hackathon.registrationDeadline);
    const isOpen = days > 0;
    const teams = mockTeams.filter((t) => t.hackathonId === id);
    const openTeams = teams.filter((t) => t.status === 'OPEN');

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
            <Link href="/hackathons" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <ChevronLeft size={16} /> Back to Hackathons
            </Link>

            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div className="glow-indigo" style={{ top: -50, right: -50, width: 200, height: 200, opacity: 0.5 }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Trophy size={28} style={{ color: 'var(--accent-amber)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                            {isOpen ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.625rem', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.7rem', fontWeight: 700 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} /> REGISTRATION OPEN
                                </span>
                            ) : (
                                <span style={{ padding: '0.2rem 0.625rem', borderRadius: 20, background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', fontSize: '0.7rem', fontWeight: 700 }}>CLOSED</span>
                            )}
                            <span className="badge badge-indigo">🎯 {hackathon.theme}</span>
                        </div>
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{hackathon.title}</h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 12 }}>{hackathon.description}</p>

                        {hackathon.officialLink && (
                            <a href={hackathon.officialLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: 'fit-content', fontSize: '0.75rem', padding: '0.4rem 0.8rem', gap: 6, background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)' }}>
                                <ExternalLink size={14} /> Official Event Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Key Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                    {[
                        { icon: Calendar, label: 'Reg. Deadline', value: formatDate(hackathon.registrationDeadline), color: 'var(--accent-indigo)' },
                        { icon: Clock, label: 'Days Left', value: isOpen ? `${days} days` : 'Closed', color: isOpen ? (days <= 7 ? 'var(--accent-rose)' : 'var(--accent-emerald)') : 'var(--text-muted)' },
                        { icon: Users, label: 'Team Size', value: `${hackathon.minTeamSize}–${hackathon.maxTeamSize}`, color: 'var(--accent-cyan)' },
                        { icon: Star, label: 'Teams Joined', value: `${hackathon.teamsCount}+`, color: 'var(--accent-purple)' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <Icon size={18} style={{ color, marginBottom: 4 }} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
                            <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Prizes */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>💰 Prize Details</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>{hackathon.prizeDetails}</p>
                </div>

                {/* Rules */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>📋 Rules</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>{hackathon.rules}</p>
                </div>
            </div>

            {/* Teams */}
            <div className="card-static" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>👥 Registered Teams</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{openTeams.length} open · {teams.filter(t => t.status === 'LOCKED').length} locked</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link href={`/teams?hackathon=${id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                            <Users size={13} /> All Teams
                        </Link>
                        {isOpen && (
                            <Link href={`/teams/create?hackathon=${id}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                Create Team <ArrowRight size={13} />
                            </Link>
                        )}
                    </div>
                </div>

                {teams.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                        <div className="empty-state-icon">👥</div>
                        <p className="empty-state-title">No teams yet</p>
                        <p className="empty-state-desc">Be the first to create a team!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {teams.slice(0, 4).map((team) => (
                            <Link key={team.id} href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{team.name}</p>
                                        <p className="truncate-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{team.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.currentMembers}/{team.maxMembers}</span>
                                        <span className={`status-${team.status.toLowerCase()}`}>{team.status}</span>
                                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
