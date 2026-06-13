'use client';

import { useState } from 'react';
import { mockHackathons } from '@/lib/mockData';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { Team } from '@/lib/types';
import { getInitials, timeAgo } from '@/lib/utils';
import { Users, Search, Filter, ArrowRight, Lock, Unlock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CustomSelect from '@/components/CustomSelect';

function TeamsContent() {
    const { user } = useAuthStore();
    const { teams } = useTeamStore();
    const searchParams = useSearchParams();
    const hackathonFilter = searchParams.get('hackathon') || 'all';

    const [search, setSearch] = useState('');
    const [roleSearch, setRoleSearch] = useState('');
    const [hackathonId, setHackathonId] = useState(hackathonFilter);
    const [statusFilter, setStatusFilter] = useState<'all' | 'OPEN' | 'LOCKED'>('all');

    const filtered = teams.filter((t) => {
        const matchSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase());

        const matchRole = !roleSearch || t.requiredRoles.some(r =>
            r.role.toLowerCase().includes(roleSearch.toLowerCase()) && r.filled < r.count
        );

        const matchHackathon = hackathonId === 'all' || t.hackathonId === hackathonId;
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;

        return matchSearch && matchRole && matchHackathon && matchStatus;
    });

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>👥 Explore Teams</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Find open teams looking for your skills and apply!</p>
                </div>
                <Link href="/teams/create" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                    + Create Team
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search team or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Users size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search interested roles (e.g. Frontend)..."
                        value={roleSearch}
                        onChange={(e) => setRoleSearch(e.target.value)}
                    />
                </div>
                <select
                    className="input-field"
                    style={{ width: 'auto', minWidth: 160 }}
                    value={hackathonId}
                    onChange={(e) => setHackathonId(e.target.value)}
                >
                    <option value="all">All Hackathons</option>
                    {mockHackathons.map((h) => (
                        <option key={h.id} value={h.id}>{h.title}</option>
                    ))}
                </select>
                <div style={{ minWidth: 140 }}>
                    <CustomSelect
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as any)}
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'OPEN', label: '🟢 Open' },
                            { value: 'LOCKED', label: '🔒 Locked' }
                        ]}
                    />
                </div>
            </div>

            {/* Results count */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {roleSearch ? (
                    <>Teams seeking <strong style={{ color: 'var(--accent-cyan)' }}>{roleSearch}</strong>: </>
                ) : (
                    <>Showing </>
                )}
                <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> teams
            </p>

            {/* Teams Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <p className="empty-state-title">No teams found</p>
                    <p className="empty-state-desc">{roleSearch ? `No open teams are currently seeking a "${roleSearch}".` : 'Try adjusting your filters or be the first to create one!'}</p>
                    {roleSearch && (
                        <button onClick={() => setRoleSearch('')} className="btn-ghost" style={{ marginTop: '0.5rem' }}>Clear role search</button>
                    )}
                </div>
            ) : (
                <div className="grid-auto">
                    {filtered.map((team) => (
                        <TeamCard key={team.id} team={team} currentUserId={user?.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TeamCard({ team, currentUserId }: { team: Team; currentUserId?: string }) {
    const isLeader = team.leaderId === currentUserId;
    const isMember = team.members?.some((m) => m.userId === currentUserId);
    const openRoles = team.requiredRoles.filter((r) => r.filled < r.count);
    const fillPercent = Math.round((team.currentMembers / team.maxMembers) * 100);

    return (
        <Link href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Team Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                        <div
                            style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}
                        >
                            {getInitials(team.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    fontSize: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {useAuthStore.getState().getUserById(team.leaderId)?.avatar ? (
                                        <img src={useAuthStore.getState().getUserById(team.leaderId)?.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(team.leaderName || 'Unknown')
                                    )}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {team.leaderName}</p>
                            </div>
                        </div>
                    </div>
                    <span className={team.status === 'OPEN' ? 'status-open' : 'status-locked'}>
                        {team.status === 'OPEN' ? <><Unlock size={10} /> Open</> : <><Lock size={10} /> Locked</>}
                    </span>
                </div>

                {/* Hackathon tag */}
                <span className="badge badge-indigo" style={{ width: 'fit-content', marginBottom: '0.75rem', fontSize: '0.7rem' }}>
                    🏆 {team.hackathonTitle}
                </span>

                {/* Description */}
                <p className="truncate-3" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                    {team.description}
                </p>

                {/* Member progress */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Members</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {team.currentMembers}/{team.maxMembers}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${fillPercent}%` }} />
                    </div>
                </div>

                {/* Open Roles */}
                {openRoles.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seeking</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {openRoles.slice(0, 3).map((r) => (
                                <span key={r.role} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{r.role}</span>
                            ))}
                            {openRoles.length > 3 && (
                                <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>+{openRoles.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {isLeader && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>👑 Leader</span>}
                        {isMember && !isLeader && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>✅ Member</span>}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        View <ChevronRight size={13} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function TeamsPage() {
    return (
        <Suspense fallback={<div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading teams...</div>}>
            <TeamsContent />
        </Suspense>
    );
}
