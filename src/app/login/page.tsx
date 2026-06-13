'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back! 🎉');
            router.push('/dashboard');
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    const quickLogin = (type: 'student' | 'admin') => {
        if (type === 'admin') {
            setEmail('admin@college.edu');
        } else {
            setEmail('aarav@college.edu');
        }
        setPassword('password123');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            {/* Background glows */}
            <div className="glow-indigo" style={{ top: '20%', left: '20%', opacity: 0.5 }} />
            <div className="glow-purple" style={{ bottom: '20%', right: '20%', opacity: 0.4 }} />

            <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24, color: 'white', fontWeight: 800 }}>H</div>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>Sign in to your HackMate Campus account</p>
                </div>

                <div className="card-static" style={{ padding: '2rem' }}>
                    {/* Quick Login Buttons */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>Quick Demo Login</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <button onClick={() => quickLogin('student')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                                <GraduationCap size={14} /> Student Demo
                            </button>
                            <button onClick={() => quickLogin('admin')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                                🛡️ Admin Demo
                            </button>
                        </div>
                    </div>

                    <div className="divider" style={{ margin: '1rem 0' }} />

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label" htmlFor="email">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: 8, justifyContent: 'center', padding: '0.875rem' }}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                    Signing In...
                                </span>
                            ) : (
                                <>Sign In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link href="/signup" style={{ color: 'var(--accent-indigo)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.825rem' }}>
                        <Link href="/guest-support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Facing registration issues? <span style={{ color: 'var(--accent-amber)' }}>Get help</span></Link>
                    </p>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Use any email address to sign in
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
