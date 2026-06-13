'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockMessages } from '@/lib/mockData';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { getInitials } from '@/lib/utils';
import { Send, Lock, Paperclip, Smile, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Message } from '@/lib/types';
import Link from 'next/link';

const EMOJI_LIST = ['👍', '🎉', '🚀', '💡', '✅', '❓', '🔥', '😂', '👏', '🙌'];

function ChatContent() {
    const { user } = useAuthStore();
    const { teams } = useTeamStore();
    const searchParams = useSearchParams();
    const teamId = searchParams.get('team');

    // Find the requested team
    const team = teamId ? teams.find((t) => t.id === teamId) : null;

    // Check if the current user is actually a member of this LOCKED team
    const isMember = user && team
        ? team.status === 'LOCKED' &&
        (team.leaderId === user.id || team.members?.some((m) => m.userId === user.id))
        : false;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (team && isMember) {
            setMessages(mockMessages.filter((m) => m.teamId === team.id));
        }
    }, [team?.id, isMember]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Access denied: no valid team ID, team not locked, or user not a member ──
    if (!team || !isMember) {
        const userLockedTeam = user
            ? teams.find(
                (t) =>
                    t.status === 'LOCKED' &&
                    (t.leaderId === user.id || t.members?.some((m) => m.userId === user.id))
            )
            : null;

        return (
            <div style={{
                maxWidth: 520, margin: '6rem auto', textAlign: 'center',
                padding: '3rem 2rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 20,
            }} className="animate-fade-in">
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'rgba(244,63,94,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                }}>
                    <ShieldOff size={32} style={{ color: 'var(--accent-rose)' }} />
                </div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Chat Not Accessible
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {!user
                        ? 'You need to be logged in to access team chat.'
                        : userLockedTeam
                            ? `You have access to the chat for "${userLockedTeam.name}". Use the sidebar link to open it.`
                            : "Team chat is only available once your team leader finalizes and locks the team. You're not currently a member of any locked team."}
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/teams" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                        Browse Teams
                    </Link>
                    <Link href="/dashboard" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const sendMessage = () => {
        if (!input.trim()) return;
        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            teamId: team.id,
            senderId: user!.id,
            senderName: user!.name,
            content: input.trim(),
            timestamp: new Date().toISOString(),
            type: 'text',
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput('');
        inputRef.current?.focus();
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const addEmoji = (emoji: string) => {
        setInput((v) => v + emoji);
        setShowEmoji(false);
        inputRef.current?.focus();
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups: { date: string; msgs: Message[] }[], msg) => {
        const date = new Date(msg.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const existing = groups.find((g) => g.date === date);
        if (existing) existing.msgs.push(msg);
        else groups.push({ date, msgs: [msg] });
        return groups;
    }, []);

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
            {/* Chat Header */}
            <div className="card-static" style={{ padding: '1rem 1.5rem', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                    {getInitials(team.name)}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{team.name}</h1>
                        <span className="status-locked" style={{ fontSize: '0.65rem' }}><Lock size={9} /> Locked</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#10b981' }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
                            {team.currentMembers} members active
                        </span>
                        <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>🏆 {team.hackathonTitle}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '0.25rem 0.625rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>LIVE</span>
                </div>
            </div>

            {/* Chat Body */}
            <div style={{
                flex: 1, overflowY: 'auto',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderTop: 'none',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
            }}>
                {groupedMessages.map(({ date, msgs }) => (
                    <div key={date}>
                        {/* Date separator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.75rem', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                                {date}
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                        </div>

                        {msgs.map((msg, i) => {
                            const isMe = msg.senderId === user!.id;
                            const prevMsg = msgs[i - 1];
                            const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
                            const isSystem = msg.type === 'system';

                            if (isSystem) {
                                return (
                                    <div key={msg.id} style={{ textAlign: 'center', margin: '0.75rem 0' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '0.25rem 0.875rem', borderRadius: 20 }}>
                                            🎉 {msg.content}
                                        </span>
                                    </div>
                                );
                            }

                            const sender = useAuthStore.getState().getUserById(msg.senderId);
                            const avatarUrl = sender?.avatar;

                            return (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '0.625rem', marginBottom: showAvatar ? '0.875rem' : '0.25rem', alignItems: 'flex-end' }}>
                                    {/* Avatar */}
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isMe ? 'var(--gradient-brand)' : 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, opacity: showAvatar ? 1 : 0, overflow: 'hidden' }}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            getInitials(msg.senderName)
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        {showAvatar && (
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 3, paddingLeft: isMe ? 0 : 2, paddingRight: isMe ? 2 : 0 }}>
                                                {isMe ? 'You' : msg.senderName}
                                            </span>
                                        )}
                                        <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}>
                                            {msg.content}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2, paddingLeft: isMe ? 0 : 2, paddingRight: isMe ? 2 : 0 }}>
                                            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Chat Input */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '0.875rem 1.25rem', flexShrink: 0 }}>
                {showEmoji && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                        {EMOJI_LIST.map((e) => (
                            <button key={e} onClick={() => addEmoji(e)} style={{ fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: 6, transition: 'background 0.15s' }}
                                onMouseEnter={(el) => { (el.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={(el) => { (el.target as HTMLElement).style.background = 'none'; }}>
                                {e}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button className="btn-ghost" style={{ padding: '0.5rem', flexShrink: 0 }} onClick={() => toast('File sharing coming soon!')}>
                        <Paperclip size={18} />
                    </button>
                    <button className="btn-ghost" style={{ padding: '0.5rem', flexShrink: 0 }} onClick={() => setShowEmoji(!showEmoji)}>
                        <Smile size={18} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-field"
                        placeholder="Type a message... (Enter to send)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="btn-primary"
                        style={{ padding: '0.625rem 1rem', flexShrink: 0, opacity: input.trim() ? 1 : 0.4 }}
                    >
                        <Send size={17} />
                    </button>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
                    🔒 Only visible to finalized team members · {team.name}
                </p>
            </div>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--accent-indigo)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
