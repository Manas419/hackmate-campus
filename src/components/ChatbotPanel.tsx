'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const BOT_KNOWLEDGE = [
    {
        category: 'registration',
        keywords: ['registration', 'signup', 'account', 'login', 'email', 'sign up', 'register', 'password', 'credentials'],
        response: "📋 Registration Issue Help: \n• Always use your @college.edu email.\n• Password must be at least 6 characters.\n• If you're stuck on the signup page, ensure all mandatory fields are filled.\n• If login fails, double check your credentials or contact Innovation Cell for a reset."
    },
    {
        category: 'team',
        keywords: ['team', 'joining', 'member', 'leader', 'apply', 'acceptance', 'reject', 'application', 'pending', 'create'],
        response: "👥 Team Problem Support: \n• Joining: Use 'Explore Teams' and click 'Apply'. Choose your role carefully.\n• Managing: Leaders can accept/reject members on their 'Team Detail' page.\n• Creation: Use '+ Create Team' on the Dashboard.\n• Issues: Ensure you're not already in a team if you're trying to join a new one!"
    },
    {
        category: 'hackathon',
        keywords: ['hackathon', 'event', 'deadline', 'rules', 'prizes', 'eligibility', 'theme', 'schedule', 'date'],
        response: "🏆 Hackathon Query Info: \n• All active hackathons are listed on your Dashboard.\n• Click any card to see full rules, themes, and prize details.\n• Deadlines: Registration dates are strict. Check the 'Days Left' indicator!"
    },
    {
        category: 'technical',
        keywords: ['technical', 'bug', 'crash', 'broken', 'error', 'slow', 'dropdown', 'not working', 'display', 'screen'],
        response: "🐛 Technical Bug Fixes: \n• Dropdown Visibility: We recently fixed a styling bug in dark mode. \n• Blank Pages: Try a hard refresh (Ctrl/Cmd + R).\n• Persistent Bugs: If a feature is broken, please switch to 'Raise a Ticket' and provide the page URL!"
    },
    {
        category: 'general',
        keywords: ['feedback', 'suggestion', 'improve', 'comment', 'review', 'like', 'request'],
        response: "💬 General Feedback: \nWe value your input! Many features (like this chatbot) were added based on student feedback. Feel free to share your thoughts on how we can make HackMate better for our campus."
    },
    {
        category: 'other',
        keywords: ['other', 'different', 'query', 'question', 'help', 'miscellaneous', 'forgot'],
        response: "📌 Other Queries: \nIf your issue doesn't fit the categories above, I'll do my best to help. You can ask about the Innovation Cell, faculty roles, or general campus tech news."
    },
    {
        category: 'helper',
        keywords: ['hello', 'hi', 'hey', 'start', 'assistant', 'who are you'],
        response: "👋 Hi! I'm the HackMate AI.\n\nI can help you with:\n1. Registration Problems 📋\n2. Team Management 👥\n3. Hackathon Details 🏆\n4. Technical Bug Fixes 🐛\n5. General Feedback 💬\n\nWhat can I assist you with?"
    }
];

export default function ChatbotPanel() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hi! I'm your HackMate Assistant. Having trouble joining a team or registering? Ask me anything!", sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        await new Promise(r => setTimeout(r, 1200));

        const lowerInput = userMsg.text.toLowerCase();

        // Scoring system to find the BEST match instead of the first match
        let bestMatch = { response: "", score: 0 };

        for (const k of BOT_KNOWLEDGE) {
            let currentScore = 0;
            k.keywords.forEach(kw => {
                if (lowerInput.includes(kw)) {
                    // Give more points for longer/more specific keyword matches
                    currentScore += kw.length;
                }
            });

            if (currentScore > bestMatch.score) {
                bestMatch = { response: k.response, score: currentScore };
            }
        }

        let botResponse = bestMatch.score > 0
            ? bestMatch.response
            : "I'm still learning! 🧠 I couldn't find a perfect match for that. \n\nCould you try rephrasing? Or, if you're stuck, you can switch to 'Raise a Ticket' at the top to talk to our human admin team directly.";

        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    return (
        <div className="card-static" style={{ height: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, border: '1px solid var(--accent-indigo)', boxShadow: '0 0 20px rgba(99,102,241,0.1)' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} color="white" />
                </div>
                <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>HackMate AI Assistant</h3>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Online · Resolves issues instantly</p>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                className="custom-scrollbar"
            >
                {messages.map((m) => (
                    <div
                        key={m.id}
                        style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            gap: 8,
                            flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: m.sender === 'user' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 4
                        }}>
                            {m.sender === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="var(--accent-indigo)" />}
                        </div>
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 16,
                            background: m.sender === 'user' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.05)',
                            border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                            color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            borderTopRightRadius: m.sender === 'user' ? 2 : 16,
                            borderTopLeftRadius: m.sender === 'bot' ? 2 : 16,
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={14} color="var(--accent-indigo)" />
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}>
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="text"
                        className="input-field"
                        style={{ borderRadius: 20, paddingLeft: 16, marginBottom: 0 }}
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="btn-primary"
                        style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                }
                .typing-indicator span {
                    width: 6px;
                    height: 6px;
                    background: var(--text-muted);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
