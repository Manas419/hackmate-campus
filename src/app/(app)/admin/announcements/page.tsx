'use client';

import { useState } from 'react';
import { mockAnnouncements, mockHackathons } from '@/lib/mockData';
import { timeAgo } from '@/lib/utils';
import { Plus, Trash2, Megaphone, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Announcement } from '@/lib/types';

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ hackathonId: '', title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);

    const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 700));
        const hackathon = mockHackathons.find(h => h.id === form.hackathonId);
        const newAnn: Announcement = {
            id: `ann-${Date.now()}`,
            hackathonId: form.hackathonId,
            hackathonTitle: hackathon?.title,
            adminId: 'admin-1',
            adminName: 'Dr. Kavita Rao',
            title: form.title,
            content: form.content,
            createdAt: new Date().toISOString(),
        };
        setAnnouncements(prev => [newAnn, ...prev]);
        setForm({ hackathonId: '', title: '', content: '' });
        setShowForm(false);
        setSubmitting(false);
        toast.success('Announcement posted! 📢');
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>📢 Announcements</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Post campus-wide hackathon announcements.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary" style={{ fontSize: '0.875rem' }}>
                    <Plus size={15} /> New Announcement
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>📢 Post Announcement</h2>
                            <button className="btn-ghost" onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="label">Related Hackathon</label>
                                <select className="input-field" value={form.hackathonId} onChange={e => update('hackathonId', e.target.value)} required>
                                    <option value="">Select a hackathon...</option>
                                    {mockHackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">Announcement Title *</label>
                                <input className="input-field" placeholder="🚀 Registration Now Open!" value={form.title} onChange={e => update('title', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="label">Content *</label>
                                <textarea className="input-field" placeholder="Full announcement text..." value={form.content} onChange={e => update('content', e.target.value)} required style={{ minHeight: 140 }} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Posting...' : <><Save size={14} /> Post Announcement</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map(ann => (
                    <div key={ann.id} className="card-static" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Megaphone size={20} style={{ color: 'var(--accent-indigo)' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 4 }}>{ann.title}</h3>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                    {ann.hackathonTitle && <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>🏆 {ann.hackathonTitle}</span>}
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(ann.createdAt)}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }} className="truncate-3">{ann.content}</p>
                            </div>
                            <button className="btn-danger" style={{ padding: '0.5rem', flexShrink: 0 }} onClick={() => { setAnnouncements(prev => prev.filter(a => a.id !== ann.id)); toast.success('Removed'); }}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
