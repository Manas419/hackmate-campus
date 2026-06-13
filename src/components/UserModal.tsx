'use client';

import { User } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { X, Globe, Github, ExternalLink, Trophy, Mail, School, Calendar } from 'lucide-react';

interface UserModalProps {
    user: User;
    onClose: () => void;
}

export default function UserModal({ user, onClose }: UserModalProps) {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div
                className="modal-content animate-fade-in"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: 600,
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: 24,
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                {/* Header/Cover Area */}
                <div style={{
                    height: 130,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'rgba(0,0,0,0.3)',
                            border: 'none',
                            color: 'white',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                            zIndex: 10
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Identity Area */}
                <div style={{ padding: '0 2rem 2.5rem', marginTop: -45 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '1.75rem' }}>
                        <div
                            className="avatar"
                            style={{
                                width: 110,
                                height: 110,
                                fontSize: '2.25rem',
                                border: '6px solid var(--bg-card)',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                                background: 'var(--bg-card)',
                                color: 'var(--accent-indigo)',
                                overflow: 'hidden'
                            }}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                getInitials(user.name)
                            )}
                        </div>
                        <div style={{ paddingBottom: 10 }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1 }}>{user.name}</h2>
                            <p style={{ color: 'var(--accent-indigo)', fontWeight: 600, fontSize: '0.95rem', marginTop: 6 }}>{user.department} · Year {user.year}</p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {/* Bio */}
                        {user.bio && (
                            <section>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>{user.bio}</p>
                            </section>
                        )}

                        {/* Skills */}
                        {user.skills.length > 0 && (
                            <section>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {user.skills.map(s => <span key={s} className="skill-chip" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>{s}</span>)}
                                </div>
                            </section>
                        )}

                        {/* Achievements */}
                        {user.achievements && user.achievements.length > 0 && (
                            <section>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>🏆 Achievements</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                    {user.achievements.map(ach => (
                                        <div key={ach.id} style={{
                                            padding: '1.125rem',
                                            borderRadius: 16,
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{ach.title}</p>
                                                    {ach.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>{ach.description}</p>}
                                                </div>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    background: 'var(--accent-indigo)',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: 8,
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: '0 4px 10px rgba(99,102,241,0.3)'
                                                }}>{ach.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Footer Links & Info */}
                        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact</p>
                                <a href={`mailto:${user.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Mail size={15} style={{ color: 'var(--accent-indigo)' }} /> {user.email}
                                </a>
                            </div>

                            {user.portfolioLinks.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Profiles</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                        {user.portfolioLinks.map((link, i) => (
                                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-indigo)'}
                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                                {link.includes('github') ? <Github size={20} /> : <Globe size={20} />}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
