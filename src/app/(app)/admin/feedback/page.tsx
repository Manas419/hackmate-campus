'use client';

import { useState } from 'react';
import { useFeedbackStore, IssueStatus, FeedbackItem } from '@/store/feedbackStore';
import {
    AlertCircle, Clock, CheckCircle2, MessageSquare,
    Trash2, ExternalLink, Filter, Search, User, Mail, Calendar
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/CustomSelect';

export default function AdminFeedbackPage() {
    const { items, updateStatus, deleteItem } = useFeedbackStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
    const [selectedIssue, setSelectedIssue] = useState<FeedbackItem | null>(null);
    const [adminNote, setAdminNote] = useState('');

    const filtered = items.filter((item) => {
        const matchesSearch =
            item.subject.toLowerCase().includes(search.toLowerCase()) ||
            item.userName.toLowerCase().includes(search.toLowerCase()) ||
            item.userEmail.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = (id: string, status: IssueStatus) => {
        updateStatus(id, status, adminNote);
        setAdminNote('');
        setSelectedIssue(null);
        toast.success(`Issue marked as ${status.replace('_', ' ')}!`);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this issue?')) {
            deleteItem(id);
            toast.success('Issue deleted');
        }
    };

    const statusStyle: Record<string, React.CSSProperties> = {
        open: { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' },
        in_progress: { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' },
        resolved: { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' },
        closed: { background: 'rgba(71,85,105,0.2)', color: '#94a3b8', border: '1px solid rgba(71,85,105,0.3)' },
    };

    const priorityColor = (p: string) => {
        if (p === 'urgent') return 'var(--accent-rose)';
        if (p === 'high') return '#f97316';
        if (p === 'medium') return 'var(--accent-amber)';
        return 'var(--accent-emerald)';
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    📬 Manage Student Issues
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                    Review and resolve feedback, technical bugs, and registration issues.
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search by subject, student name, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ width: 180 }}>
                    <CustomSelect
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as any)}
                        options={[
                            { value: 'all', label: 'All Issues' },
                            { value: 'open', label: '🔵 Open' },
                            { value: 'in_progress', label: '🟡 In Progress' },
                            { value: 'resolved', label: '🟢 Resolved' },
                            { value: 'closed', label: '⚪ Closed' }
                        ]}
                    />
                </div>
            </div>

            {/* Issues List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filtered.length === 0 ? (
                    <div className="card-static" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>No issues found matching your filters.</p>
                    </div>
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="card-static" style={{ padding: '1.5rem', transition: 'all 0.25s', borderLeft: `4px solid ${priorityColor(item.priority)}` }}>
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                {/* User Info */}
                                <div style={{ width: 180, flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{getInitials(item.userName)}</div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.userName}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.userDepartment}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Mail size={10} /> {item.userEmail}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Issue Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span className="badge badge-indigo" style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>{item.category}</span>
                                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 700, background: 'rgba(0,0,0,0.2)', color: priorityColor(item.priority) }}>
                                            {item.priority.toUpperCase()}
                                        </span>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.subject}</h3>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                        {item.description}
                                    </p>

                                    {item.adminNote && (
                                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: 4 }}>Admin Note:</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.adminNote}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {item.status !== 'resolved' && item.status !== 'closed' && (
                                            <button
                                                className="btn-primary"
                                                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                                onClick={() => setSelectedIssue(item)}
                                            >
                                                Update / Respond
                                            </button>
                                        )}
                                        <button
                                            className="btn-danger"
                                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Status Tag */}
                                <div style={{ marginLeft: 'auto' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem', borderRadius: 20, fontWeight: 700, ...statusStyle[item.status] }}>
                                        {item.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Response Modal */}
            {selectedIssue && (
                <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                            Update Issue Status
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Update the status for: <strong>{selectedIssue.subject}</strong>
                        </p>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="label">Admin Response / Note (Optional)</label>
                            <textarea
                                className="input-field"
                                placeholder="E.g. 'We are looking into this' or 'Fixed in the latest update'"
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                style={{ minHeight: 100 }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn-secondary" style={{ color: '#fcd34d' }} onClick={() => handleUpdateStatus(selectedIssue.id, 'in_progress')}>
                                <Clock size={14} /> In Progress
                            </button>
                            <button className="btn-success" onClick={() => handleUpdateStatus(selectedIssue.id, 'resolved')}>
                                <CheckCircle2 size={14} /> Resolve
                            </button>
                            <button className="btn-ghost" onClick={() => handleUpdateStatus(selectedIssue.id, 'closed')}>
                                <AlertCircle size={14} /> Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
