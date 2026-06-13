'use client';

import { useState } from 'react';
import { mockUsers } from '@/lib/mockData';
import { getInitials, formatDate } from '@/lib/utils';
import { Search, UserX, Shield, GraduationCap, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { User } from '@/lib/types';
import CustomSelect from '@/components/CustomSelect';

export default function AdminStudentsPage() {
    const [users, setUsers] = useState<User[]>(mockUsers.filter(u => u.role !== 'admin'));
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');

    const departments = ['all', ...Array.from(new Set(users.map(u => u.department).filter(Boolean)))];

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.department.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === 'all' || u.department === deptFilter;
        return matchSearch && matchDept;
    });

    const promoteToLeader = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'team_leader' } : u));
        toast.success('Promoted to Team Leader 👑');
    };

    const removeUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success('Student removed from platform');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>🎓 Students</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Manage registered students on the platform.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Students', value: users.length, icon: '🎓' },
                    { label: 'Team Leaders', value: users.filter(u => u.role === 'team_leader').length, icon: '👑' },
                    { label: 'Available Now', value: users.filter(u => u.availability === 'available').length, icon: '🟢' },
                ].map(({ label, value, icon }) => (
                    <div key={label} className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.1)', fontSize: 20 }}>{icon}</div>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>{value}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name, email, or department..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                    <div style={{ minWidth: 200 }}>
                        <CustomSelect
                            value={deptFilter}
                            onChange={(val) => setDeptFilter(val)}
                            options={departments.map(d => ({
                                value: d,
                                label: d === 'all' ? 'All Departments' : d
                            }))}
                        />
                    </div>
                </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Showing <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> students
            </p>

            {/* Table */}
            <div className="card-static" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                {['Student', 'Department', 'Year', 'Skills', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, i) => (
                                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.75rem', flexShrink: 0, overflow: 'hidden' }}>
                                                {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(u.name)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{u.name}</p>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{u.department}</p>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Year {u.year}</p>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                            {u.skills.slice(0, 2).map(s => (
                                                <span key={s} className="skill-chip" style={{ fontSize: '0.6rem' }}>{s}</span>
                                            ))}
                                            {u.skills.length > 2 && <span className="badge badge-indigo" style={{ fontSize: '0.6rem' }}>+{u.skills.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <span className={`badge ${u.role === 'team_leader' ? 'badge-amber' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                            {u.role === 'team_leader' ? '👑 Leader' : '🎓 Student'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {u.role !== 'team_leader' && (
                                                <button className="btn-ghost" style={{ fontSize: '0.7rem', padding: '0.35rem 0.625rem', color: 'var(--accent-amber)' }} onClick={() => promoteToLeader(u.id)} title="Promote to Leader">
                                                    <Shield size={12} />
                                                </button>
                                            )}
                                            <button className="btn-danger" style={{ fontSize: '0.7rem', padding: '0.35rem 0.625rem' }} onClick={() => removeUser(u.id)} title="Remove Student">
                                                <UserX size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="empty-state" style={{ padding: '3rem' }}>
                            <div className="empty-state-icon">🔍</div>
                            <p className="empty-state-title">No students found</p>
                            <p className="empty-state-desc">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
