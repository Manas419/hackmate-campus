'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/mockData';
import CustomSelect from '@/components/CustomSelect';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const { signup, isLoading } = useAuthStore();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        year: '2',
    });
    const [showPass, setShowPass] = useState(false);

    const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        const result = await signup({
            name: form.name,
            email: form.email,
            password: form.password,
            department: form.department,
            year: parseInt(form.year),
        });
        if (result.success) {
            toast.success('Welcome to HackMate Campus! 🚀');
            router.push('/dashboard');
        } else {
            toast.error(result.error || 'Signup failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            <div className="glow-indigo" style={{ top: '10%', right: '20%', opacity: 0.5 }} />
            <div className="glow-cyan" style={{ bottom: '20%', left: '15%', opacity: 0.4 }} />

            <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24, color: 'white', fontWeight: 800 }}>H</div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Join HackMate</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>Create your campus hackathon profile</p>
                </div>

                <div className="card-static" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="label" htmlFor="name">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="name" type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Aarav Sharma" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="label" htmlFor="signup-email">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="signup-email" type="email" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="department">Department / Branch</label>
                                <CustomSelect
                                    id="department"
                                    value={form.department}
                                    onChange={(val) => update('department', val)}
                                    placeholder="Select department..."
                                    options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="year">Year / Class</label>
                                <CustomSelect
                                    id="year"
                                    value={form.year}
                                    onChange={(val) => update('year', val)}
                                    options={[
                                        { value: '1', label: '1st Year' },
                                        { value: '2', label: '2nd Year' },
                                        { value: '3', label: '3rd Year' },
                                        { value: '4', label: '4th Year' },
                                    ]}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="signup-password">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="signup-password" type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} placeholder="Min. 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} required />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="confirm-password">Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="confirm-password" type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: 8, justifyContent: 'center', padding: '0.875rem' }}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                    Creating Account...
                                </span>
                            ) : (
                                <>Create Account <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.825rem' }}>
                        <Link href="/guest-support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Facing issues with registration? <span style={{ color: 'var(--accent-amber)' }}>Contact Support</span></Link>
                    </p>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
