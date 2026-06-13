'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { mockHackathons } from '@/lib/mockData';
import { RequiredRole, Team } from '@/lib/types';
import { Plus, Trash2, ChevronLeft, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/CustomSelect';

interface RoleEntry {
    role: string;
    skills: string;
    count: number;
}

function CreateTeamContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultHackathon = searchParams.get('hackathon') || '';
    const { user } = useAuthStore();
    const { createTeam } = useTeamStore();

    const [form, setForm] = useState({
        name: '',
        hackathonId: defaultHackathon,
        description: '',
        maxMembers: 4,
    });
    const [roles, setRoles] = useState<RoleEntry[]>([
        { role: '', skills: '', count: 1 },
    ]);
    const [submitting, setSubmitting] = useState(false);

    const update = (field: string, value: string | number) =>
        setForm((f) => ({ ...f, [field]: value }));

    const updateRole = (i: number, field: keyof RoleEntry, value: string | number) => {
        setRoles((r) => r.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
    };

    const addRole = () => setRoles((r) => [...r, { role: '', skills: '', count: 1 }]);
    const removeRole = (i: number) => setRoles((r) => r.filter((_, idx) => idx !== i));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.hackathonId) { toast.error('Please select a hackathon'); return; }
        if (roles.some(r => !r.role.trim())) { toast.error('Please fill all role names'); return; }

        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));

        const selectedHackathon = mockHackathons.find(h => h.id === form.hackathonId);

        const newTeam: Team = {
            id: `team-${Date.now()}`,
            name: form.name.trim(),
            description: form.description.trim(),
            hackathonId: form.hackathonId,
            hackathonTitle: selectedHackathon?.title || 'Unknown Hackathon',
            leaderId: user?.id || '',
            leaderName: user?.name,
            maxMembers: form.maxMembers,
            currentMembers: 1,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            requiredRoles: roles.map(r => ({
                role: r.role.trim(),
                skills: r.skills.split(',').map(s => s.trim()).filter(s => !!s),
                count: r.count,
                filled: 0
            })) as RequiredRole[],
            members: [
                {
                    id: `tm-${Date.now()}-leader`,
                    teamId: '', // To be filled/ignored by store logic usually
                    userId: user?.id || '',
                    userName: user?.name || '',
                    userDepartment: user?.department,
                    userSkills: user?.skills,
                    role: 'Team Leader',
                    joinedAt: new Date().toISOString(),
                }
            ]
        };

        createTeam(newTeam);
        toast.success('Team created successfully! 🚀');
        router.push('/teams');
    };

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-fade-in">
            <Link href="/teams" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <ChevronLeft size={16} /> Back to Teams
            </Link>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Create a New Team
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    Set up your team, define required roles, and start recruiting talented teammates!
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="card-static" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={16} /> Team Details
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="label" htmlFor="team-name">Team Name *</label>
                                <input
                                    id="team-name"
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. ByteBuilders"
                                    value={form.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="hackathon">Hackathon *</label>
                                <CustomSelect
                                    value={form.hackathonId}
                                    onChange={(val) => update('hackathonId', val)}
                                    placeholder="Select a hackathon..."
                                    options={mockHackathons.map((h) => ({
                                        value: h.id,
                                        label: h.title
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="description">Team Description *</label>
                            <textarea
                                id="description"
                                className="input-field"
                                placeholder="Describe your project idea, what you're building, and what kind of teammates you're looking for..."
                                value={form.description}
                                onChange={(e) => update('description', e.target.value)}
                                style={{ minHeight: 110 }}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ maxWidth: 200 }}>
                            <label className="label" htmlFor="max-members">Max Team Size</label>
                            <CustomSelect
                                value={form.maxMembers.toString()}
                                onChange={(val) => update('maxMembers', parseInt(val))}
                                options={[2, 3, 4, 5, 6].map((n) => ({
                                    value: n.toString(),
                                    label: `${n} members`
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Required Roles */}
                <div className="card-static" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={16} /> Required Roles
                        </h2>
                        <button type="button" onClick={addRole} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}>
                            <Plus size={13} /> Add Role
                        </button>
                    </div>

                    <div className="alert-info" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                        💡 Define specific roles your team needs. Students will apply to a specific role based on their skills.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {roles.map((role, i) => (
                            <div key={i} style={{ padding: '1.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'end' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="label">Role Title</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g. Backend Developer"
                                            value={role.role}
                                            onChange={(e) => updateRole(i, 'role', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0, minWidth: 100 }}>
                                        <label className="label">Count</label>
                                        <CustomSelect
                                            value={role.count.toString()}
                                            onChange={(val) => updateRole(i, 'count', parseInt(val))}
                                            options={[1, 2, 3].map(n => ({
                                                value: n.toString(),
                                                label: n.toString()
                                            }))}
                                        />
                                    </div>
                                    {roles.length > 1 && (
                                        <button type="button" onClick={() => removeRole(i)} className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.5rem', alignSelf: 'flex-end' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="label">Required Skills <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(comma separated)</span></label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. Node.js, PostgreSQL, REST APIs"
                                        value={role.skills}
                                        onChange={(e) => updateRole(i, 'skills', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <Link href="/teams" className="btn-secondary">Cancel</Link>
                    <button type="submit" className="btn-primary" disabled={submitting} style={{ minWidth: 160, justifyContent: 'center' }}>
                        {submitting ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                Creating...
                            </span>
                        ) : '🚀 Create Team'}
                    </button>
                </div>
            </form>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function CreateTeamPage() {
    return (
        <Suspense fallback={<div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading...</div>}>
            <CreateTeamContent />
        </Suspense>
    );
}
