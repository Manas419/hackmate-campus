'use client';

import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { Team } from '@/lib/types';
import { getInitials, timeAgo } from '@/lib/utils';
import { Lock, Unlock, ArrowRight, Plus, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function MyTeamsPage() {
    const { user } = useAuthStore();
    const { teams } = useTeamStore();

    const myTeams = teams.filter(
        (t) => t.leaderId === user?.id || t.members?.some((m) => m.userId === user?.id)
    );
    const leadingTeams = myTeams.filter((t) => t.leaderId === user?.id);
    const memberTeams = myTeams.filter((t) => t.leaderId !== user?.id);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>⚡ My Teams</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Manage your teams or view the ones you've joined.</p>
                </div>
                <Link href="/teams/create" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                    <Plus size={15} /> Create New Team
                </Link>
            </div>

            {myTeams.length === 0 ? (
                <div className="empty-state" style={{ padding: '5rem 2rem' }}>
                    <div className="empty-state-icon">🚀</div>
                    <p className="empty-state-title">No teams yet</p>
                    <p className="empty-state-desc">Create your first team or browse open teams to join as a member.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: '1.5rem' }}>
                        <Link href="/teams/create" className="btn-primary" style={{ fontSize: '0.875rem' }}>Create Team</Link>
                        <Link href="/teams" className="btn-secondary" style={{ fontSize: '0.875rem' }}>Browse Teams</Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Teams I'm Leading */}
                    {leadingTeams.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                👑 Teams You Lead ({leadingTeams.length})
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {leadingTeams.map((team) => (
                                    <TeamRow key={team.id} team={team} isLeader={true} userId={user?.id} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Teams I'm a Member Of */}
                    {memberTeams.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                🎓 Teams You've Joined ({memberTeams.length})
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {memberTeams.map((team) => (
                                    <TeamRow key={team.id} team={team} isLeader={false} userId={user?.id} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function TeamRow({ team, isLeader, userId }: { team: Team; isLeader: boolean; userId?: string }) {
    const fillPercent = Math.round((team.currentMembers / team.maxMembers) * 100);
    const isLocked = team.status === 'LOCKED';

    return (
        <div className="card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(team.name)}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{team.name}</h3>
                        <span className={isLocked ? 'status-locked' : 'status-open'}>
                            {isLocked ? <><Lock size={10} /> Locked</> : <><Unlock size={10} /> Open</>}
                        </span>
                        {isLeader && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>👑 You Lead</span>}
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem', marginBottom: 8, display: 'inline-flex' }}>🏆 {team.hackathonTitle}</span>
                    <p className="truncate-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{team.description}</p>

                    {/* Member Progress */}
                    <div style={{ marginTop: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Members</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {team.currentMembers}/{team.maxMembers}
                            </span>
                        </div>
                        <div className="progress-bar" style={{ height: 5 }}>
                            <div className="progress-fill" style={{ width: `${fillPercent}%` }} />
                        </div>
                    </div>

                    {/* Required roles unfilled */}
                    {!isLocked && (
                        <div style={{ marginTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {team.requiredRoles.filter(r => r.filled < r.count).map(r => (
                                <span key={r.role} className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                                    Seeking: {r.role}
                                </span>
                            ))}
                            {team.requiredRoles.filter(r => r.filled >= r.count).map(r => (
                                <span key={r.role} className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                                    ✓ {r.role}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    <Link href={`/teams/${team.id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        View Team <ArrowRight size={13} />
                    </Link>
                    {isLocked && (
                        <Link href={`/chat?team=${team.id}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                            <MessageSquare size={13} /> Team Chat
                        </Link>
                    )}
                    {isLeader && !isLocked && (
                        <Link href={`/teams/${team.id}`} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', color: 'var(--accent-amber)' }}>
                            <Lock size={13} /> Finalize
                        </Link>
                    )}
                </div>
            </div>

            {/* Members preview */}
            {team.members && team.members.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: -6 }}>
                        {team.members.slice(0, 5).map((m, i) => {
                            const userAvatar = useAuthStore.getState().getUserById(m.userId)?.avatar;
                            return (
                                <div key={m.id} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-brand)', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 700, marginLeft: i > 0 ? -8 : 0, zIndex: team.members!.length - i, overflow: 'hidden' }}>
                                    {userAvatar ? (
                                        <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(m.userName)
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                        {team.members.map(m => m.userName).join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
}
