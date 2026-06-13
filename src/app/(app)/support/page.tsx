'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useFeedbackStore, IssueCategory, IssuePriority } from '@/store/feedbackStore';
import { AlertCircle, CheckCircle2, Send, ChevronDown, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import ChatbotPanel from '@/components/ChatbotPanel';
import toast from 'react-hot-toast';

const CATEGORIES: { value: IssueCategory; label: string; emoji: string; desc: string }[] = [
    { value: 'registration', label: 'Registration Issue', emoji: '📋', desc: 'Problems registering for hackathons or joining teams' },
    { value: 'team', label: 'Team Problem', emoji: '👥', desc: 'Issues with team management, applications, or members' },
    { value: 'hackathon', label: 'Hackathon Query', emoji: '🏆', desc: 'Questions or issues about a specific hackathon' },
    { value: 'technical', label: 'Technical Bug', emoji: '🐛', desc: 'App crash, feature not working, display issue' },
    { value: 'general', label: 'General Feedback', emoji: '💬', desc: 'Suggestions, improvements, or general comments' },
    { value: 'other', label: 'Other', emoji: '📌', desc: 'Anything that doesn\'t fit above' },
];

const PRIORITIES: { value: IssuePriority; label: string; color: string }[] = [
    { value: 'low', label: '🟢 Low — Not blocking me', color: 'var(--accent-emerald)' },
    { value: 'medium', label: '🟡 Medium — Inconvenient', color: 'var(--accent-amber)' },
    { value: 'high', label: '🔴 High — Blocking my progress', color: '#f97316' },
    { value: 'urgent', label: '🚨 Urgent — Deadline approaching', color: 'var(--accent-rose)' },
];

export default function SupportPage() {
    const { user } = useAuthStore();
    const { submitFeedback, items } = useFeedbackStore();

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [supportMode, setSupportMode] = useState<'chat' | 'ticket'>('chat');
    const [form, setForm] = useState({
        category: '' as IssueCategory | '',
        priority: 'medium' as IssuePriority,
        subject: '',
        description: '',
    });

    // User's own past submissions
    const myIssues = items.filter((i) => i.userId === user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.category) { toast.error('Please select a category'); return; }
        if (!form.subject.trim()) { toast.error('Please enter a subject'); return; }
        if (!form.description.trim() || form.description.length < 20) {
            toast.error('Please describe the issue in at least 20 characters');
            return;
        }

        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));

        submitFeedback({
            category: form.category as IssueCategory,
            priority: form.priority,
            subject: form.subject.trim(),
            description: form.description.trim(),
            userId: user?.id || 'guest',
            userName: user?.name || 'Anonymous',
            userEmail: user?.email || '',
            userDepartment: user?.department,
            userYear: user?.year,
        });

        setSubmitting(false);
        setSubmitted(true);
        toast.success('Issue submitted! Our admin team will respond soon 📬');
    };

    const statusStyle: Record<string, React.CSSProperties> = {
        open: { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' },
        in_progress: { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' },
        resolved: { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' },
        closed: { background: 'rgba(71,85,105,0.2)', color: '#94a3b8', border: '1px solid rgba(71,85,105,0.3)' },
    };

    const statusLabel: Record<string, string> = {
        open: '🔵 Open', in_progress: '🟡 In Progress', resolved: '✅ Resolved', closed: '⚫ Closed',
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    🛟 Help & Support
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    Facing an issue or have feedback? Submit it here — our admin team will get back to you.
                </p>
            </div>

            {/* Quick links / Mode Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setSupportMode('chat')}
                    className={supportMode === 'chat' ? 'card-static active-mode' : 'card-static'}
                    style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        border: supportMode === 'chat' ? '2px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                        background: supportMode === 'chat' ? 'rgba(99,102,241,0.08)' : 'var(--bg-card)',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ padding: 10, borderRadius: 12, background: 'rgba(99,102,241,0.15)', color: 'var(--accent-indigo)' }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Assistant</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant help for common issues</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setSupportMode('ticket')}
                    className={supportMode === 'ticket' ? 'card-static active-mode' : 'card-static'}
                    style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        border: supportMode === 'ticket' ? '2px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                        background: supportMode === 'ticket' ? 'rgba(99,102,241,0.08)' : 'var(--bg-card)',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ padding: 10, borderRadius: 12, background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)' }}>
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Raise a Ticket</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get direct help from admins</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Content Area */}
            {supportMode === 'chat' ? (
                <div style={{ marginBottom: '2.5rem' }}>
                    <ChatbotPanel />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        AI Assistant can help with team formation, registration, and more.
                        If you need human help, <span style={{ color: 'var(--accent-indigo)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setSupportMode('ticket')}>Raise a Ticket</span> instead.
                    </p>
                </div>
            ) : null}

            {supportMode === 'ticket' && (
                <>
                    {/* Submission form or success */}
                    {submitted ? (
                        <div className="card-static" style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                <CheckCircle2 size={30} style={{ color: 'var(--accent-emerald)' }} />
                            </div>
                            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                                Issue Submitted!
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                                Your issue has been logged. The admin team will review it and respond as soon as possible.
                            </p>
                            <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ category: '', priority: 'medium', subject: '', description: '' }); }}>
                                Submit Another Issue
                            </button>
                        </div>
                    ) : (
                        <div className="card-static" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertCircle size={18} style={{ color: 'var(--accent-amber)' }} />
                                Raise an Issue / Submit Feedback
                            </h2>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Category */}
                                <div className="form-group">
                                    <label className="label">Issue Category *</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                                                style={{
                                                    padding: '0.75rem 0.5rem',
                                                    borderRadius: 10,
                                                    border: `1px solid ${form.category === cat.value ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
                                                    background: form.category === cat.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{cat.emoji}</div>
                                                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: form.category === cat.value ? 'white' : 'var(--text-secondary)' }}>
                                                    {cat.label}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="form-group">
                                    <label className="label">Priority *</label>
                                    <CustomSelect
                                        value={form.priority}
                                        onChange={(val) => setForm((f) => ({ ...f, priority: val as IssuePriority }))}
                                        options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
                                    />
                                </div>

                                {/* Subject */}
                                <div className="form-group">
                                    <label className="label">Subject *</label>
                                    <input
                                        className="input-field"
                                        placeholder="Brief summary of the problem..."
                                        value={form.subject}
                                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                        maxLength={120}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                        {form.subject.length}/120
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="label">Describe the Issue *</label>
                                    <textarea
                                        className="input-field"
                                        placeholder="Please provide as much detail as possible — what you were trying to do, what happened, and any error messages you saw. This helps us resolve it faster."
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        style={{ minHeight: 140 }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: form.description.length < 20 && form.description.length > 0 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                                        {form.description.length < 20 ? `${20 - form.description.length} more characters needed` : '✓ Looks good'}
                                    </p>
                                </div>

                                {/* User info preview */}
                                <div style={{ padding: '0.875rem 1rem', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <HelpCircle size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                                    Submitting as <strong style={{ color: 'var(--text-secondary)' }}>{user?.name}</strong> ({user?.email}) · {user?.department} · Year {user?.year}
                                </div>

                                <button type="submit" className="btn-primary" disabled={submitting} style={{ justifyContent: 'center', padding: '0.875rem' }}>
                                    {submitting ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                            Submitting...
                                        </span>
                                    ) : (
                                        <><Send size={16} /> Submit Issue</>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Past submissions */}
                    {myIssues.length > 0 && (
                        <div className="card-static" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                📬 My Previous Issues ({myIssues.length})
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {myIssues.map((item) => (
                                    <div key={item.id} style={{ padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.subject}</p>
                                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 20, flexShrink: 0, ...statusStyle[item.status] }}>
                                                {statusLabel[item.status]}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: item.adminNote ? 8 : 0 }}>
                                            {item.description}
                                        </p>
                                        {item.adminNote && (
                                            <div style={{ marginTop: 8, padding: '0.6rem 0.875rem', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: 2 }}>📋 Admin Response:</p>
                                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.adminNote}</p>
                                            </div>
                                        )}
                                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                            Submitted {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
            )}
        </div>
    );
}
