# HackMate Campus 🚀

> A full-stack college hackathon community & team formation platform.

**Live Demo**: Use the quick login buttons on the login page to explore as:
- **Student**: `aarav@college.edu` / any 6+ char password
- **Admin**: `admin@college.edu` / any 6+ char password

---

## 📁 Project Structure

```
hackmate-campus/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Protected routes (require auth)
│   │   │   ├── layout.tsx            # Auth guard + sidebar shell
│   │   │   ├── dashboard/            # Role-based dashboard
│   │   │   ├── feed/                 # College feed & announcements
│   │   │   ├── hackathons/           # Hackathon list + detail [id]
│   │   │   ├── teams/                # Explore + create + detail [id]
│   │   │   ├── my-teams/             # My teams (led + joined)
│   │   │   ├── chat/                 # Locked-teams-only chat
│   │   │   ├── profile/              # Profile editor
│   │   │   └── admin/
│   │   │       ├── hackathons/       # Admin: manage hackathons
│   │   │       ├── announcements/    # Admin: post announcements
│   │   │       ├── teams/            # Admin: review teams
│   │   │       └── students/         # Admin: manage students
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Design system CSS
│   ├── components/
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── AppShell.tsx              # Layout wrapper
│   │   └── Providers.tsx             # Toast/context providers
│   ├── lib/
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── utils.ts                  # Utility functions
│   │   └── mockData.ts               # Mock data (replace with API)
│   └── store/
│       └── authStore.ts              # Zustand auth store
├── database/
│   └── schema.sql                    # PostgreSQL schema + indexes
├── .env.template                     # Environment variables template
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.template .env.local
# Edit .env.local with your values
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15 (App Router) |
| Styling | TailwindCSS + Custom CSS Design System |
| State Management | Zustand (with localStorage persistence) |
| Real-time Chat | Socket.io (client-side setup ready) |
| Database | PostgreSQL (Neon / Supabase) |
| Auth | JWT + bcrypt + Google OAuth |
| Deployment | Vercel (frontend) + Railway/Render (backend) |

---

## 🗄️ Database Setup

### Using Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Run `database/schema.sql` in the SQL editor
4. Copy your connection string to `DATABASE_URL` in `.env.local`

### Using Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor → New Query → paste `database/schema.sql`
4. Copy `Project URL` and `anon key` to your `.env.local`

---

## 🔐 Authentication

The platform uses college email restriction (`@college.edu` domain — change `NEXT_PUBLIC_COLLEGE_DOMAIN`).

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Student | `aarav@college.edu` | `password123` |
| Team Leader | `priya@college.edu` | `password123` |
| Admin | `admin@college.edu` | `password123` |

---

## 💬 Real-time Chat (Production Setup)

The chat UI is fully built. To enable real WebSockets:

1. Create a Socket.io server (Node.js):
```js
const { Server } = require('socket.io');
const io = new Server(3001, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('join-team', (teamId) => socket.join(teamId));
  socket.on('send-message', (msg) => io.to(msg.teamId).emit('new-message', msg));
});
```

2. Deploy to Railway/Render
3. Set `NEXT_PUBLIC_SOCKET_URL` in `.env.local`

---

## 🛡️ Security Rules Implemented

| Rule | Implementation |
|------|---------------|
| College email only | Domain validation in auth store |
| No multiple finalized teams | DB trigger + app-layer check |
| Chat locked-team only | `team.status === 'LOCKED'` gate |
| Role-based navigation | Sidebar shows role-appropriate links |
| Applicant team conflict | `existingTeam` field shown to leaders |
| Input validation | Required fields + format checks on all forms |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
npm run build          # Test build locally first
vercel deploy          # Deploy to Vercel
```

### Backend / Database
- **Database**: [Neon](https://neon.tech) or [Supabase](https://supabase.com) — free tier supports 500+ users
- **Socket.io Server**: [Railway](https://railway.app) or [Render](https://render.com)

### Environment Variables on Vercel
Set all variables from `.env.template` in **Vercel → Project → Settings → Environment Variables**.

---

## 📊 Database Indexing Strategy

Optimized for 500–2000+ users:

| Table | Indexed Fields | Index Type |
|-------|---------------|-----------|
| users | email, role, department, skills | B-tree + GIN |
| teams | hackathon_id, leader_id, status | B-tree |
| team_members | team_id, user_id | B-tree |
| applications | team_id, user_id, status | B-tree |
| messages | team_id + timestamp | Composite B-tree |
| announcements | hackathon_id, created_at | B-tree |

---

## 🎨 Design System

The design uses a dark-mode-first system with:
- **Colors**: Indigo/Purple/Cyan gradient palette
- **Glassmorphism**: `backdrop-filter: blur` cards
- **Typography**: Inter + Space Grotesk
- **Components**: All reusable CSS classes in `globals.css`

---

## 📋 Connecting to Real Backend

To replace mock data with a real API:

1. Install Axios or use `fetch`:
```bash
npm install axios
```

2. Replace mock data imports in each page with API calls:
```typescript
// Instead of: import { mockTeams } from '@/lib/mockData';
const res = await fetch('/api/teams');
const teams = await res.json();
```

3. Create API routes in `src/app/api/` (Next.js Route Handlers)

---

Built with ❤️ for campus hackathon communities.
