'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SKILLS_LIST, DEPARTMENTS } from '@/lib/mockData';
import { getInitials, formatDate } from '@/lib/utils';
import { Edit2, Save, X, ExternalLink, Plus, Trash2, Github, Globe, Camera } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, updateProfile } = useAuthStore();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        department: user?.department || '',
        year: user?.year?.toString() || '1',
        skills: user?.skills || [],
        avatar: user?.avatar || '',
        portfolioLinks: user?.portfolioLinks || [],
        availability: user?.availability || 'available',
        achievements: user?.achievements || [],
    });
    const [newLink, setNewLink] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [saving, setSaving] = useState(false);

    // Achievement form states
    const [showAchForm, setShowAchForm] = useState(false);
    const [achForm, setAchForm] = useState({ title: '', year: '', description: '' });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image too large. Max 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(f => ({ ...f, avatar: reader.result as string }));
            toast.success('Photo uploaded locally!');
        };
        reader.readAsDataURL(file);
    };

    const toggleSkill = (skill: string) => {
        setForm((f) => ({
            ...f,
            skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
        }));
    };

    const addCustomSkill = () => {
        const trimmed = customSkillInput.trim();
        if (!trimmed) return;
        if (form.skills.includes(trimmed)) {
            setCustomSkillInput('');
            return;
        }
        setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }));
        setCustomSkillInput('');
    };

    const addLink = () => {
        if (!newLink.trim()) return;
        setForm((f) => ({ ...f, portfolioLinks: [...f.portfolioLinks, newLink.trim()] }));
        setNewLink('');
    };

    const removeLink = (i: number) => {
        setForm((f) => ({ ...f, portfolioLinks: f.portfolioLinks.filter((_, idx) => idx !== i) }));
    };

    const addAchievement = () => {
        if (!achForm.title || !achForm.year) return;
        const newAch = {
            id: `ach-${Date.now()}`,
            ...achForm
        };
        setForm(f => ({ ...f, achievements: [newAch, ...f.achievements] }));
        setAchForm({ title: '', year: '', description: '' });
        setShowAchForm(false);
    };

    const removeAchievement = (id: string) => {
        setForm(f => ({ ...f, achievements: f.achievements.filter(a => a.id !== id) }));
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 700));
        updateProfile({
            name: form.name,
            bio: form.bio,
            department: form.department,
            year: parseInt(form.year),
            skills: form.skills,
            avatar: form.avatar,
            portfolioLinks: form.portfolioLinks,
            availability: form.availability as any,
            achievements: form.achievements,
        });
        setSaving(false);
        setEditing(false);
        toast.success('Profile updated! ✨');
    };

    if (!user) return null;

    const filteredSkills = SKILLS_LIST.filter(
        (s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !form.skills.includes(s)
    );

    const availabilityOptions = [
        { value: 'available', label: '🟢 Available', desc: 'Open to joining hackathon teams' },
        { value: 'open_to_offers', label: '🟡 Open to Offers', desc: 'Selectively considering opportunities' },
        { value: 'busy', label: '🔴 Busy', desc: 'Not looking for new teams right now' },
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>👤 My Profile</h1>
                {editing ? (
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => setEditing(false)} className="btn-ghost">
                            <X size={15} /> Cancel
                        </button>
                        <button onClick={handleSave} className="btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : <><Save size={15} /> Save Changes</>}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="btn-secondary">
                        <Edit2 size={15} /> Edit Profile
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', alignItems: 'start' }}>
                {/* Left: Identity Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Avatar + Name */}
                    <div className="card-static" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div
                            className="avatar"
                            style={{
                                width: 100,
                                height: 100,
                                fontSize: '2rem',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 0 0 4px rgba(99,102,241,0.25)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {form.avatar ? (
                                <img src={form.avatar} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                getInitials(form.name)
                            )}

                            {editing && (
                                <label style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    transition: 'opacity 0.2s',
                                    opacity: 0,
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                                >
                                    <Camera size={24} />
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>

                        {editing ? (
                            <div className="form-group">
                                <label className="label">Full Name</label>
                                <input className="input-field" style={{ textAlign: 'center', fontWeight: 700 }} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            </div>
                        ) : (
                            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</h2>
                        )}

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>{user.email}</p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span className={`badge ${user.role === 'admin' ? 'badge-purple' : user.role === 'team_leader' ? 'badge-amber' : 'badge-indigo'}`}>
                                {user.role === 'admin' ? '🛡️ Admin' : user.role === 'team_leader' ? '👑 Leader' : '🎓 Student'}
                            </span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="card-static" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Academic Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>Department</p>
                                {editing ? (
                                    <CustomSelect
                                        value={form.department}
                                        onChange={(val) => setForm((f) => ({ ...f, department: val }))}
                                        options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                                        placeholder="Select department..."
                                    />
                                ) : (
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.department || '—'}</p>
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>Year</p>
                                {editing ? (
                                    <CustomSelect
                                        value={form.year}
                                        onChange={(val) => setForm((f) => ({ ...f, year: val }))}
                                        options={[
                                            { value: '1', label: '1st Year' },
                                            { value: '2', label: '2nd Year' },
                                            { value: '3', label: '3rd Year' },
                                            { value: '4', label: '4th Year' },
                                        ]}
                                    />
                                ) : (
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.year ? `${user.year}${['st', 'nd', 'rd', 'th'][user.year - 1]} Year` : '—'}</p>
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>Member Since</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="card-static" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>Availability</h3>
                        {editing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {availabilityOptions.map(({ value, label, desc }) => (
                                    <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.625rem', borderRadius: 8, cursor: 'pointer', background: form.availability === value ? 'rgba(99,102,241,0.1)' : 'transparent', border: `1px solid ${form.availability === value ? 'rgba(99,102,241,0.3)' : 'var(--border-subtle)'}` }}>
                                        <input type="radio" name="availability" value={value} checked={form.availability === value} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value as 'available' | 'busy' | 'open_to_offers' }))} style={{ accentColor: 'var(--accent-indigo)' }} />
                                        <div>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <span className={`badge ${user.availability === 'available' ? 'badge-emerald' : user.availability === 'open_to_offers' ? 'badge-amber' : 'badge-rose'}`}>
                                {user.availability === 'available' ? '🟢 Available' : user.availability === 'open_to_offers' ? '🟡 Open to Offers' : '🔴 Busy'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Bio */}
                    <div className="card-static" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.875rem' }}>📝 Bio</h3>
                        {editing ? (
                            <textarea
                                className="input-field"
                                placeholder="Tell teams about yourself — your passion, what you build, and what makes you a great teammate..."
                                value={form.bio}
                                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                style={{ minHeight: 100 }}
                            />
                        ) : (
                            <p style={{ color: user.bio ? 'var(--text-secondary)' : 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                {user.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                            </p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="card-static" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.875rem' }}>
                            ⚡ Skills ({(editing ? form.skills : user.skills).length})
                        </h3>

                        {editing ? (
                            <>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.875rem' }}>
                                    {form.skills.map((s) => (
                                        <button key={s} onClick={() => toggleSkill(s)} className="skill-chip selected clickable" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {s} <X size={10} />
                                        </button>
                                    ))}
                                    {form.skills.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No skills selected yet.</p>}
                                </div>
                                <input
                                    className="input-field"
                                    placeholder="Search skills..."
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    style={{ marginBottom: '0.625rem' }}
                                />
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 140, overflowY: 'auto', marginBottom: '0.75rem' }}>
                                    {filteredSkills.slice(0, 30).map((s) => (
                                        <button key={s} onClick={() => toggleSkill(s)} className="skill-chip clickable">
                                            <Plus size={10} /> {s}
                                        </button>
                                    ))}
                                    {filteredSkills.length === 0 && skillSearch && (
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No match — add it as custom ↓</p>
                                    )}
                                </div>
                                {/* Custom skill input */}
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <input
                                        className="input-field"
                                        placeholder="Add your own skill (e.g. Blender, Rust, Figma...)  then press Enter"
                                        value={customSkillInput}
                                        onChange={(e) => setCustomSkillInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                                        style={{ fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={addCustomSkill}
                                        disabled={!customSkillInput.trim()}
                                        style={{ flexShrink: 0, padding: '0.625rem 0.875rem', opacity: customSkillInput.trim() ? 1 : 0.4 }}
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {user.skills.length > 0
                                    ? user.skills.map((s) => <span key={s} className="skill-chip">{s}</span>)
                                    : <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills added yet.</p>}
                            </div>
                        )}
                    </div>

                    {/* Portfolio Links */}
                    <div className="card-static" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.875rem' }}>🔗 Portfolio & Links</h3>

                        {editing ? (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
                                    {form.portfolioLinks.map((link, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <div className="input-field" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--accent-indigo)' }}>
                                                <Globe size={13} /> {link}
                                            </div>
                                            <button className="btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeLink(i)}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input className="input-field" placeholder="https://github.com/yourusername" value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLink()} />
                                    <button className="btn-secondary" onClick={addLink} style={{ flexShrink: 0 }}>
                                        <Plus size={15} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {user.portfolioLinks.length > 0 ? user.portfolioLinks.map((link, i) => (
                                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem 0.875rem', background: 'rgba(99,102,241,0.08)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)', textDecoration: 'none', color: '#a5b4fc', fontSize: '0.875rem', transition: 'all 0.15s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}>
                                        {link.includes('github') ? <Github size={14} /> : <Globe size={14} />}
                                        {link}
                                        <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                                    </a>
                                )) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No links added yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="card-static" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>🏆 Achievements</h3>
                            {editing && !showAchForm && (
                                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} onClick={() => setShowAchForm(true)}>
                                    <Plus size={13} /> Add New
                                </button>
                            )}
                        </div>

                        {editing && showAchForm && (
                            <div style={{ padding: '1.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="label">Achievement Title *</label>
                                        <input className="input-field" placeholder="e.g. Winner, InnovateCS 2025" value={achForm.title} onChange={e => setAchForm(f => ({ ...f, title: e.target.value }))} />
                                    </div>
                                    <div style={{ width: 100 }}>
                                        <label className="label">Year *</label>
                                        <input className="input-field" placeholder="2025" value={achForm.year} onChange={e => setAchForm(f => ({ ...f, year: e.target.value }))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Brief Description</label>
                                    <textarea className="input-field" placeholder="Describe your achievement..." value={achForm.description} onChange={e => setAchForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 60 }} />
                                </div>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button className="btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setShowAchForm(false)}>Cancel</button>
                                    <button className="btn-primary" style={{ fontSize: '0.8rem' }} onClick={addAchievement} disabled={!achForm.title || !achForm.year}>Add Achievement</button>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(editing ? form.achievements : (user.achievements || [])).length > 0 ? (
                                (editing ? form.achievements : (user.achievements || [])).map((ach) => (
                                    <div key={ach.id} style={{ padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ach.title}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 600, marginTop: 2 }}>{ach.year}</p>
                                            </div>
                                            {editing && (
                                                <button className="btn-danger" style={{ padding: '0.4rem', borderRadius: 8 }} onClick={() => removeAchievement(ach.id)}>
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                        {ach.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{ach.description}</p>}
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No achievements added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
