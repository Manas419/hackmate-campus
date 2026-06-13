'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import {
    Menu, User, LogOut, ChevronDown, Bell, Settings,
    Trophy, Users, Zap, LayoutDashboard, Shield, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function Topbar() {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/feed', label: 'College Feed', icon: Bell },
        { href: '/hackathons', label: 'Hackathons', icon: Trophy },
        { href: '/teams', label: 'Explore Teams', icon: Users },
        { href: '/my-teams', label: 'My Teams', icon: Zap },
        { href: '/profile', label: 'My Profile', icon: User },
    ];

    const adminLinks = [
        { href: '/admin/hackathons', label: 'Manage Hackathons', icon: Shield },
        { href: '/admin/teams', label: 'Manage Teams', icon: Users },
        { href: '/admin/announcements', label: 'Announcements', icon: Bell },
        { href: '/admin/feedback', label: 'Student Issues', icon: MessageSquare },
    ];

    return (
        <header className="topbar" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Context Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold"
                    style={{ background: 'var(--gradient-brand)', fontSize: 14 }}
                >
                    H
                </div>
                <div style={{ display: 'none' }} className="md:block">
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        HackMate Campus
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {pathname === '/dashboard' ? 'Overview' :
                            pathname.startsWith('/teams') ? 'Teams' :
                                pathname.startsWith('/hackathons') ? 'Hackathons' :
                                    pathname.startsWith('/profile') ? 'Profile' :
                                        pathname.startsWith('/admin') ? 'Administration' : 'App'}
                    </p>
                </div>
            </div>

            {/* Right Side Options Dropdown */}
            <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '0.5rem 0.75rem',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                    onMouseLeave={e => !open && (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem', overflow: 'hidden' }}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            getInitials(user?.name || '')
                        )}
                    </div>
                    <div style={{ textAlign: 'left', display: 'none' }} className="sm:block">
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user?.role === 'admin' ? 'Campus Admin' : 'Student'}</p>
                    </div>
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {open && (
                    <div
                        className="glass animate-fade-in"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            width: 240,
                            borderRadius: 16,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            padding: '0.5rem',
                            zIndex: 1000,
                            border: '1px solid var(--border-primary)'
                        }}
                    >
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUICK MENU</p>
                        </div>

                        {/* Nav Sections */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '0.625rem 0.875rem',
                                        borderRadius: 8,
                                        color: pathname === link.href ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        background: pathname === link.href ? 'rgba(99,102,241,0.08)' : 'transparent'
                                    }}
                                    className="menu-item-hover"
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {user?.role === 'admin' && (
                            <>
                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', margin: '0.5rem 0' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ADMIN OPTIONS</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {adminLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '0.625rem 0.875rem',
                                                borderRadius: 8,
                                                color: 'var(--text-secondary)',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem'
                                            }}
                                            className="menu-item-hover"
                                        >
                                            <link.icon size={16} />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                            <button
                                onClick={() => { logout(); setOpen(false); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '0.75rem 1rem',
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--accent-rose)',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .menu-item-hover:hover { 
                    background: rgba(255,255,255,0.05) !important; 
                    color: var(--text-primary) !important;
                }
            `}</style>
        </header>
    );
}
