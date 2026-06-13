'use client';

import { useState } from 'react';
import { mockTeams } from '@/lib/mockData';
import { getInitials, timeAgo } from '@/lib/utils';
import { CheckCircle2, XCircle, Lock, Unlock, Search, Users } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Team } from '@/lib/types';

export default function AdminTeamsPage() {
    const [teams, setTeams] = useState<Team[]>(mockTeams as Team[]);
    const [search, setSearch] = useState('');

    const filtered = teams.filter(
        t => t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.hackathonTitle || '').toLowerCase().includes(search.toLowerCase())
    );

    const approve = (id: string) => {
        toast.success('Team approved ✅');
    };

    const remove = (id: string) => {
        setTeams(prev => prev.filter(t => t.id !== id));
        toast.success('Team removed');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>👥 Manage Teams</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Review, approve, or remove teams across all hackathons.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Teams', value: teams.length, color: 'rgba(99,102,241,0.1)', icon: '👥' },
                    { label: 'Open Teams', value: teams.filter(t => t.status === 'OPEN').length, color: 'rgba(16,185,129,0.1)', icon: '🔓' },
                    { label: 'Locked Teams', value: teams.filter(t => t.status === 'LOCKED').length, color: 'rgba(245,158,11,0.1)', icon: '🔒' },
                ].map(({ label, value, color, icon }) => (
                    <div key={label} className="stat-card">
                        <div className="stat-icon" style={{ background: color, fontSize: 20 }}>{icon}</div>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>{value}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Search teams..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {filtered.map(team => (
                    <div key={team.id} className="card-static" style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                                {getInitials(team.name)}
                            </div>
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{team.name}</h3>
                                    <span className={team.status === 'OPEN' ? 'status-open' : 'status-locked'} style={{ fontSize: '0.65rem' }}>
                                        {team.status === 'OPEN' ? <><Unlock size={9} /> Open</> : <><Lock size={9} /> Locked</>}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>🏆 {team.hackathonTitle}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <Users size={11} style={{ display: 'inline', marginRight: 3 }} />
                                        {team.currentMembers}/{team.maxMembers} members
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Led by {team.leaderName}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <Link href={`/teams/${team.id}`} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                                    View
                                </Link>
                                <button className="btn-success" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} onClick={() => approve(team.id)}>
                                    <CheckCircle2 size={13} /> Approve
                                </button>
                                <button className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} onClick={() => remove(team.id)}>
                                    <XCircle size={13} /> Remove
                                </button>
                            </div>
                        </div>
                        <p className="truncate-2" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginTop: 10, paddingLeft: 56 }}>{team.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
