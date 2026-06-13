'use client';

import { useState } from 'react';
import { mockHackathons } from '@/lib/mockData';
import { formatDate, getDaysUntil, timeAgo } from '@/lib/utils';
import { Plus, Edit2, Trash2, Trophy, Calendar, Users, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/CustomSelect';

interface HackathonForm {
    title: string;
    description: string;
    rules: string;
    prizeDetails: string;
    registrationDeadline: string;
    eventDate: string;
    theme: string;
    maxTeamSize: number;
    minTeamSize: number;
    officialLink: string;
}

const EMPTY_FORM: HackathonForm = {
    title: '',
    description: '',
    rules: '',
    prizeDetails: '',
    registrationDeadline: '',
    eventDate: '',
    theme: '',
    maxTeamSize: 4,
    minTeamSize: 2,
    officialLink: '',
};

export default function AdminHackathonsPage() {
    const [hackathons, setHackathons] = useState(mockHackathons);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<HackathonForm>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const update = (field: keyof HackathonForm, value: string | number) =>
        setForm((f) => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));

        if (editingId) {
            setHackathons(prev => prev.map(h => h.id === editingId ? { ...h, ...form } : h));
            toast.success('Hackathon updated! ✅');
        } else {
            const newHack = {
                id: `hack-${Date.now()}`,
                ...form,
                createdByAdminId: 'admin-1',
                createdAt: new Date().toISOString(),
                teamsCount: 0,
            };
            setHackathons(prev => [newHack, ...prev]);
            toast.success('Hackathon created! 🎉');
        }

        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setSubmitting(false);
    };

    const handleEdit = (h: typeof mockHackathons[0]) => {
        setForm({
            title: h.title,
            description: h.description,
            rules: h.rules,
            prizeDetails: h.prizeDetails,
            registrationDeadline: h.registrationDeadline.substring(0, 16),
            eventDate: (h.eventDate || '').substring(0, 16),
            theme: h.theme || '',
            maxTeamSize: h.maxTeamSize || 4,
            minTeamSize: h.minTeamSize || 2,
            officialLink: h.officialLink || '',
        });
        setEditingId(h.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setHackathons(prev => prev.filter(h => h.id !== id));
        toast.success('Hackathon removed');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>🏆 Manage Hackathons</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Create and manage hackathon posts for your campus.</p>
                </div>
                <button onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }} className="btn-primary" style={{ fontSize: '0.875rem' }}>
                    <Plus size={15} /> Post Hackathon
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                {editingId ? '✏️ Edit Hackathon' : '🏆 Create Hackathon'}
                            </h2>
                            <button className="btn-ghost" onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="label">Hackathon Title *</label>
                                    <input className="input-field" placeholder="e.g. InnovateCS 2026" value={form.title} onChange={e => update('title', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="label">Theme / Track</label>
                                    <input className="input-field" placeholder="e.g. Build for Bharat" value={form.theme} onChange={e => update('theme', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="label">Prize Details *</label>
                                    <input className="input-field" placeholder="🥇 ₹50,000 | 🥈 ₹30,000" value={form.prizeDetails} onChange={e => update('prizeDetails', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="label">Registration Deadline *</label>
                                    <input type="datetime-local" className="input-field" value={form.registrationDeadline} onChange={e => update('registrationDeadline', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="label">Event Date</label>
                                    <input type="datetime-local" className="input-field" value={form.eventDate} onChange={e => update('eventDate', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="label">Min Team Size</label>
                                    <CustomSelect
                                        value={form.minTeamSize.toString()}
                                        onChange={(val) => update('minTeamSize', parseInt(val))}
                                        options={[1, 2, 3].map(n => ({
                                            value: n.toString(),
                                            label: n.toString()
                                        }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Max Team Size</label>
                                    <CustomSelect
                                        value={form.maxTeamSize.toString()}
                                        onChange={(val) => update('maxTeamSize', parseInt(val))}
                                        options={[2, 3, 4, 5, 6].map(n => ({
                                            value: n.toString(),
                                            label: n.toString()
                                        }))}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="label">Official Registration / Event Link <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(optional)</span></label>
                                    <input className="input-field" placeholder="https://hackathon.com/event" value={form.officialLink} onChange={e => update('officialLink', e.target.value)} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="label">Description *</label>
                                    <textarea className="input-field" placeholder="Full description of the hackathon, tracks, and what to expect..." value={form.description} onChange={e => update('description', e.target.value)} required style={{ minHeight: 100 }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="label">Rules *</label>
                                    <textarea className="input-field" placeholder="Team rules, submission format, eligibility criteria..." value={form.rules} onChange={e => update('rules', e.target.value)} required style={{ minHeight: 80 }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : <><Save size={14} /> {editingId ? 'Update' : 'Post Hackathon'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hackathons List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {hackathons.map((h) => {
                    const days = getDaysUntil(h.registrationDeadline);
                    const isOpen = days > 0;
                    return (
                        <div key={h.id} className="card-static" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Trophy size={22} style={{ color: 'var(--accent-amber)' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{h.title}</h3>
                                        <span className={isOpen ? 'status-open' : 'status-locked'} style={{ fontSize: '0.65rem' }}>
                                            {isOpen ? `${days}d left` : 'Closed'}
                                        </span>
                                        {h.theme && <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>🎯 {h.theme}</span>}
                                    </div>
                                    <p className="truncate-2" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 8 }}>{h.description}</p>
                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={12} /> Deadline: {formatDate(h.registrationDeadline)}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Users size={12} /> {h.teamsCount} teams
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            💰 {h.prizeDetails.split('|')[0].trim()}
                                        </span>
                                        {h.officialLink && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                🔗 {h.officialLink}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.875rem' }} onClick={() => handleEdit(h)}>
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button className="btn-danger" style={{ fontSize: '0.8rem', padding: '0.5rem 0.875rem' }} onClick={() => handleDelete(h.id)}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
