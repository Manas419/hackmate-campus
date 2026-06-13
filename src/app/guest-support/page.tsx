'use client';

import { useState } from 'react';
import { useFeedbackStore, IssueCategory, IssuePriority } from '@/store/feedbackStore';
import { AlertCircle, CheckCircle2, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function GuestSupportPage() {
    const { submitFeedback } = useFeedbackStore();

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { toast.error('Please enter your name'); return; }
        if (!form.email.trim()) { toast.error('Please enter your email'); return; }
        if (!form.subject.trim()) { toast.error('Please enter a subject'); return; }
        if (!form.description.trim() || form.description.length < 20) {
            toast.error('Please describe the issue in at least 20 characters');
            return;
        }

        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));

        submitFeedback({
            category: 'registration',
            priority: 'high',
            subject: `[GUEST] ${form.subject.trim()}`,
            description: form.description.trim(),
            userId: 'guest',
            userName: form.name.trim(),
            userEmail: form.email.trim(),
        });

        setSubmitting(false);
        setSubmitted(true);
        toast.success('Registration issue submitted! We will email you soon 📬');
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 600 }}>
                <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {submitted ? (
                    <div className="card-static" style={{ padding: '3rem', textAlign: 'center' }}>
                        <CheckCircle2 size={48} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1.25rem' }} />
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                            Help Request Sent
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            We have received your request regarding registration issues. Our team will contact you at <strong>{form.email}</strong>.
                        </p>
                        <Link href="/login" className="btn-primary">Return to Login</Link>
                    </div>
                ) : (
                    <div className="card-static" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                Registration Support
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                                Having trouble signing up? Tell us what went wrong.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="label">Your Name</label>
                                    <input
                                        className="input-field"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Contact Email</label>
                                    <input
                                        className="input-field"
                                        type="email"
                                        placeholder="best email to reach you"
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Subject</label>
                                <input
                                    className="input-field"
                                    placeholder="E.g. Cannot find my department, login not working..."
                                    value={form.subject}
                                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Description of Issue</label>
                                <textarea
                                    className="input-field"
                                    placeholder="Describe specifically what is happening. Include any error messages you see."
                                    style={{ minHeight: 120 }}
                                    value={form.description}
                                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                    required
                                />
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Minimum 20 characters: {form.description.length}/20</p>
                            </div>

                            <button type="submit" className="btn-primary" disabled={submitting} style={{ justifyContent: 'center', padding: '0.875rem' }}>
                                {submitting ? 'Sending...' : 'Send Help Request'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
