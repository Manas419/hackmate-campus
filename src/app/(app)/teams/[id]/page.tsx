'use client';

import { use, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { getInitials, timeAgo } from '@/lib/utils';
import { Users, Lock, Unlock, ChevronLeft, CheckCircle2, XCircle, Clock, Send, AlertTriangle, UserMinus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import UserModal from '@/components/UserModal';
import CustomSelect from '@/components/CustomSelect';
import { User } from '@/lib/types';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, getUserById } = useAuthStore();
    const { teams, applications, applyToTeam, updateApplicationStatus, finalizeTeam, removeMember } = useTeamStore();

    const [selectedViewUser, setSelectedViewUser] = useState<User | null>(null);

    const team = teams.find((t) => t.id === id);
    if (!team) return notFound();

    const isLeader = team.leaderId === user?.id;
    const isMember = team.members?.some((m) => m.userId === user?.id);
    const myApp = applications.find((a) => a.teamId === id && a.userId === user?.id);
    const teamApplicants = applications.filter((a) => a.teamId === id && a.status === 'PENDING');
    const fillPercent = Math.round((team.currentMembers / team.maxMembers) * 100);

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyRole, setApplyRole] = useState('');
    const [applyCustomRole, setApplyCustomRole] = useState('');
    const [applyMsg, setApplyMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Open roles = slots not yet filled
    const openRoles = team.requiredRoles.filter((r) => r.filled < r.count);

    const viewUserProfile = (userId: string) => {
        const fullUser = getUserById(userId);
        if (fullUser) {
            setSelectedViewUser(fullUser);
        } else {
            toast.error('Could not load user profile');
        }
    };

    const handleApply = async () => {
        const finalRole = applyRole === 'other' ? applyCustomRole.trim() : applyRole;
        if (!finalRole) { toast.error('Please select or enter a role'); return; }
        if (applyRole === 'other' && !applyCustomRole.trim()) { toast.error('Please describe the role you want'); return; }
        if (!applyMsg.trim()) { toast.error('Please write a message'); return; }
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));

        applyToTeam({
            teamId: team.id,
            teamName: team.name,
            hackathonTitle: team.hackathonTitle,
            userId: user?.id || '',
            userName: user?.name || '',
            userEmail: user?.email || '',
            userDepartment: user?.department,
            userSkills: user?.skills,
            userYear: user?.year,
            message: applyMsg.trim(),
            appliedRole: finalRole,
        });

        toast.success(`Application for "${finalRole}" submitted! 🎉`);
        setShowApplyModal(false);
        setApplyRole('');
        setApplyCustomRole('');
        setApplyMsg('');
        setSubmitting(false);
    };

    const handleFinalize = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 600));
        finalizeTeam(team.id);
        setSubmitting(false);
        toast.success('Team finalized! Chat is now active 🔒');
    };

    const handleAppAction = async (appId: string, status: 'ACCEPTED' | 'REJECTED') => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 600));
        updateApplicationStatus(appId, status);
        setSubmitting(false);
        if (status === 'ACCEPTED') toast.success('Member accepted! 🎊');
        else toast.error('Application rejected.');
    };

    const handleRemoveMember = async (userId: string, userName: string) => {
        if (!window.confirm(`Are you sure you want to remove ${userName} from the team?`)) return;

        setSubmitting(true);
        await new Promise(r => setTimeout(r, 600));
        removeMember(team.id, userId);
        setSubmitting(false);
        toast.success(`${userName} removed from the team.`);
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
            <Link href="/teams" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <ChevronLeft size={16} /> Back to Teams
            </Link>

            {/* Team Hero */}
            <div className="card-static" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem', flexShrink: 0 }}>
                        {getInitials(team.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{team.name}</h1>
                            <span className={team.status === 'OPEN' ? 'status-open' : 'status-locked'}>
                                {team.status === 'OPEN' ? <><Unlock size={10} /> Open</> : <><Lock size={10} /> Locked</>}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
                            <span className="badge badge-indigo">🏆 {team.hackathonTitle}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {getUserById(team.leaderId)?.avatar ? (
                                        <img src={getUserById(team.leaderId)?.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(team.leaderName || 'Unknown')
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Led by <button onClick={() => viewUserProfile(team.leaderId)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent-indigo)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>{team.leaderName}</button></span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{team.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {isLeader && team.status === 'OPEN' && (
                            <button onClick={handleFinalize} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                                <Lock size={14} /> Finalize Team
                            </button>
                        )}
                        {isLeader && team.status === 'LOCKED' && (
                            <Link href="/chat" className="btn-primary" style={{ fontSize: '0.8rem' }}>
                                💬 Open Chat
                            </Link>
                        )}
                        {!isLeader && !isMember && team.status === 'OPEN' && !myApp && (
                            <button onClick={() => setShowApplyModal(true)} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                                <Send size={14} /> Apply to Join
                            </button>
                        )}
                        {myApp && (
                            <span className={`status-${myApp.status.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                Application: {myApp.status}
                            </span>
                        )}
                        {isMember && !isLeader && (
                            <span className="badge badge-emerald">✅ You're a Member</span>
                        )}
                    </div>
                </div>

                {/* Member Progress */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Team Capacity</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>{team.currentMembers}/{team.maxMembers} members</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${fillPercent}%` }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Required Roles */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>🎯 Required Roles</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {team.requiredRoles.map((role) => {
                            const filled = role.filled >= role.count;
                            return (
                                <div key={role.role} style={{ padding: '0.875rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${filled ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{role.role}</p>
                                        <span className={filled ? 'badge badge-emerald' : 'badge badge-rose'} style={{ fontSize: '0.65rem' }}>
                                            {filled ? '✓ Filled' : `${role.count - role.filled} needed`}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {role.skills.map((s) => (
                                            <span key={s} className="skill-chip" style={{ fontSize: '0.65rem' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current Members */}
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        <Users size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Current Members
                    </h2>
                    {team.members && team.members.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {team.members
                                .filter(m => isMember || isLeader || m.userId === team.leaderId)
                                .map((member) => (
                                    <div
                                        key={member.id}
                                        onClick={() => viewUserProfile(member.userId)}
                                        style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'transparent'; }}
                                    >
                                        <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.75rem', flexShrink: 0, overflow: 'hidden' }}>
                                            {member.avatar ? <img src={member.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(member.userName)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{member.userName}</p>
                                                {member.userId === team.leaderId && <span style={{ fontSize: '0.6rem', color: 'var(--accent-amber)' }}>👑 Leader</span>}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role} · {member.userDepartment}</p>
                                        </div>
                                        {isLeader && member.userId !== team.leaderId && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveMember(member.userId, member.userName);
                                                }}
                                                className="btn-danger"
                                                style={{ padding: '0.4rem', borderRadius: 8, opacity: 0.6 }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                                                title="Remove member"
                                            >
                                                <UserMinus size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {!isMember && !isLeader && team.currentMembers > 1 && (
                                <div style={{ padding: '1rem', textAlign: 'center', borderRadius: 10, background: 'rgba(255,255,255,0.01)', border: '1px dotted var(--border-subtle)' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        🔒 {team.currentMembers - 1} other member{team.currentMembers - 1 !== 1 ? 's are' : ' is'} hidden until your application is accepted.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '1.5rem' }}>
                            <p className="empty-state-title" style={{ fontSize: '0.875rem' }}>No members yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pending Applications (Leader Only) */}
            {isLeader && teamApplicants.length > 0 && (
                <div className="card-static" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        📋 Pending Applications ({teamApplicants.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {teamApplicants.map((app) => (
                            <div key={app.id} style={{ padding: '1.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div
                                        className="avatar clickable"
                                        style={{ width: 40, height: 40, fontSize: '0.8rem', flexShrink: 0, overflow: 'hidden' }}
                                        onClick={() => viewUserProfile(app.userId)}
                                    >
                                        {getUserById(app.userId)?.avatar ? (
                                            <img src={getUserById(app.userId)?.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            getInitials(app.userName || 'U')
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 180 }}>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                                            <button
                                                onClick={() => viewUserProfile(app.userId)}
                                                style={{ background: 'none', border: 'none', padding: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {app.userName}
                                            </button>
                                            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Year {app.userYear}</span>
                                            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{app.userDepartment}</span>
                                            {app.existingTeam && (
                                                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                                                    <AlertTriangle size={9} /> In: {app.existingTeam}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                                            Applied for: <strong style={{ color: 'var(--accent-cyan)' }}>{app.appliedRole}</strong>
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{app.message}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                                            {app.userSkills?.map(s => <span key={s} className="skill-chip" style={{ fontSize: '0.65rem' }}>{s}</span>)}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                className="btn-success"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleAppAction(app.id, 'ACCEPTED')}
                                                disabled={submitting}
                                            >
                                                <CheckCircle2 size={13} /> {submitting ? '...' : 'Accept'}
                                            </button>
                                            <button
                                                className="btn-danger"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleAppAction(app.id, 'REJECTED')}
                                                disabled={submitting}
                                            >
                                                <XCircle size={13} /> {submitting ? '...' : 'Reject'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Profile Modal */}
            {selectedViewUser && (
                <UserModal
                    user={selectedViewUser}
                    onClose={() => setSelectedViewUser(null)}
                />
            )}

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            Apply to {team.name}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Select the role you want and write a compelling message!</p>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="label">Role You're Applying For</label>
                            <CustomSelect
                                value={applyRole}
                                onChange={(val) => { setApplyRole(val); setApplyCustomRole(''); }}
                                placeholder="Select a role..."
                                options={[
                                    ...openRoles.map(r => ({
                                        value: r.role,
                                        label: `${r.role} (${r.count - r.filled} spot${r.count - r.filled !== 1 ? 's' : ''} left)`
                                    })),
                                    { value: 'other', label: 'Other / General Member' }
                                ]}
                            />

                            {/* Show text input when Other is selected */}
                            {applyRole === 'other' && (
                                <input
                                    className="input-field"
                                    style={{ marginTop: 8 }}
                                    placeholder="Describe your role / what you bring to the team..."
                                    value={applyCustomRole}
                                    onChange={e => setApplyCustomRole(e.target.value)}
                                />
                            )}

                            {/* Info banner when all named roles are filled */}
                            {openRoles.length === 0 && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: 8, background: 'rgba(245,158,11,0.08)', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
                                    ⚠️ All listed roles are filled — you can still apply as a General Member and let the leader decide.
                                </p>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Your Message</label>
                            <textarea
                                className="input-field"
                                placeholder="Tell the team leader why you're a great fit. Mention relevant skills, projects, or experience..."
                                value={applyMsg}
                                onChange={e => setApplyMsg(e.target.value)}
                                style={{ minHeight: 120 }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn-ghost" onClick={() => setShowApplyModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleApply} disabled={submitting}>
                                {submitting ? 'Submitting...' : <><Send size={14} /> Submit Application</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
