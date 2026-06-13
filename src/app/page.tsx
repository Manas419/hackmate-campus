'use client';

import Link from 'next/link';
import { ArrowRight, Users, Zap, Trophy, MessageSquare, Shield, Code2, Sparkles, ChevronRight, Star } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Discover Hackathons',
    desc: 'Admin-curated hackathon announcements with prizes, rules, and deadlines — all in one place.',
    color: 'var(--accent-amber)',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    icon: Users,
    title: 'Build Your Dream Team',
    desc: 'Browse teams looking for your exact skill set, or create your own with defined required roles.',
    color: 'var(--accent-indigo)',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    icon: Zap,
    title: 'Smart Team Matching',
    desc: 'Real-time validation checks if applicants are already in another team — no double-joining.',
    color: 'var(--accent-cyan)',
    bg: 'rgba(6,182,212,0.1)',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat Unlocked',
    desc: 'Once your team is finalized and locked, an exclusive team chat activates automatically.',
    color: 'var(--accent-emerald)',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Students, Team Leaders, and Admins each have precisely scoped permissions and views.',
    color: 'var(--accent-purple)',
    bg: 'rgba(139,92,246,0.1)',
  },
  {
    icon: Code2,
    title: 'College-First Design',
    desc: 'Built exclusively for your campus — a closed ecosystem where everyone knows each other.',
    color: 'var(--accent-rose)',
    bg: 'rgba(244,63,94,0.1)',
  },
];

const stats = [
  { value: '500+', label: 'Students' },
  { value: '20+', label: 'Hackathons' },
  { value: '150+', label: 'Teams Formed' },
  { value: '₹5L+', label: 'Prizes Awarded' },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Add your skills, department, year, and portfolio links.' },
  { step: '02', title: 'Explore Hackathons', desc: 'Browse admin-posted hackathon events with full details.' },
  { step: '03', title: 'Join or Lead a Team', desc: 'Apply to open teams or create your own with required roles.' },
  { step: '04', title: 'Build & Win', desc: 'Collaborate via team chat once your team is finalized.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>H</div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>HackMate Campus</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Sign In</Link>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '0.875rem' }}>
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background glows */}
        <div className="glow-indigo animate-float" style={{ top: '10%', left: '15%', opacity: 0.8 }} />
        <div className="glow-purple animate-float" style={{ top: '20%', right: '10%', animationDelay: '2s' }} />
        <div className="glow-cyan" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '0.375rem 1rem', marginBottom: '2rem' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-indigo)' }} />
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500 }}>Your College Hackathon Community</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            fontFamily: 'Space Grotesk, sans-serif',
            color: 'var(--text-primary)',
          }}>
            Find Your Team.
            <span className="gradient-text" style={{ display: 'block' }}>Win Together.</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            HackMate Campus is the all-in-one platform for college hackathons — discover events, form expert teams, communicate, and register. Built exclusively for your campus ecosystem.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Join Your Campus <ArrowRight size={16} />
            </Link>
            <Link href="/feed" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Browse Hackathons
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: -8 }}>
              {['🎓', '👨‍💻', '👩‍💻', '🚀', '⚡'].map((emoji, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginLeft: i > 0 ? -8 : 0 }}>
                  {emoji}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>500+</strong> students already on the platform
            </p>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16 }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }} className="gradient-text">{value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '3rem 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Everything You Need to Hack
          </h2>
          <p className="section-subtitle" style={{ marginTop: 8, fontSize: '1rem' }}>Built specifically for your campus hackathon ecosystem.</p>
        </div>
        <div className="grid-auto">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '3rem 2rem 5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'Space Grotesk, sans-serif' }}>How It Works</h2>
          <p className="section-subtitle" style={{ marginTop: 8 }}>From signup to submission in 4 steps.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {steps.map(({ step, title, desc }, i) => (
            <div key={step} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '0.875rem', fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {step}
              </div>
              <div className="card-static" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 24, padding: '3rem 2rem',
        }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', marginBottom: 12 }}>
            Ready to Build Something Amazing?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join your college's hackathon platform. Create your profile, find your team, and start building.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Sign Up with College Email <ChevronRight size={16} />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Already have an account?
            </Link>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Only @college.edu emails are accepted
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          © 2026 HackMate Campus · Built for college hackathon communities
        </p>
      </footer>
    </div>
  );
}
