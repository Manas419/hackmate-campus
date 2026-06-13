-- ─── HackMate Campus — PostgreSQL Schema ─────────────────────────────────────
-- Optimized for 500-2000+ students with proper indexing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM Types ───────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('student', 'team_leader', 'admin');
CREATE TYPE team_status AS ENUM ('OPEN', 'LOCKED');
CREATE TYPE application_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'open_to_offers');

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,         -- Enforce @college.edu in app
  password_hash VARCHAR(255),                          -- NULL for OAuth users
  role          user_role NOT NULL DEFAULT 'student',
  department    VARCHAR(100),
  year          SMALLINT CHECK (year BETWEEN 1 AND 6),
  bio           TEXT,
  skills        TEXT[] DEFAULT '{}',                   -- Array of skill strings
  portfolio_links TEXT[] DEFAULT '{}',
  availability  availability_status NOT NULL DEFAULT 'available',
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for users
CREATE UNIQUE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_department ON users (department);
CREATE INDEX idx_users_skills ON users USING GIN (skills);   -- GIN for array search

-- ─── Hackathons ───────────────────────────────────────────────────────────────
CREATE TABLE hackathons (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                 VARCHAR(200) NOT NULL,
  description           TEXT NOT NULL,
  rules                 TEXT NOT NULL,
  prize_details         TEXT,
  registration_deadline TIMESTAMPTZ NOT NULL,
  event_date            TIMESTAMPTZ,
  theme                 VARCHAR(200),
  banner_url            VARCHAR(500),
  min_team_size         SMALLINT NOT NULL DEFAULT 2,
  max_team_size         SMALLINT NOT NULL DEFAULT 4,
  created_by_admin_id   UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hackathons_deadline ON hackathons (registration_deadline);
CREATE INDEX idx_hackathons_admin ON hackathons (created_by_admin_id);

-- ─── Teams ────────────────────────────────────────────────────────────────────
CREATE TABLE teams (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hackathon_id   UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
  leader_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(100) NOT NULL,
  description    TEXT,
  required_roles JSONB NOT NULL DEFAULT '[]',   -- [{role, skills[], count, filled}]
  max_members    SMALLINT NOT NULL DEFAULT 4,
  status         team_status NOT NULL DEFAULT 'OPEN',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(hackathon_id, name)                    -- Each team name unique per hackathon
);

CREATE INDEX idx_teams_hackathon ON teams (hackathon_id);
CREATE INDEX idx_teams_leader ON teams (leader_id);
CREATE INDEX idx_teams_status ON teams (status);

-- ─── Team Members ─────────────────────────────────────────────────────────────
CREATE TABLE team_members (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       VARCHAR(100) NOT NULL,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)                      -- One user per team
);

CREATE INDEX idx_team_members_team ON team_members (team_id);
CREATE INDEX idx_team_members_user ON team_members (user_id);

-- ─── Applications ─────────────────────────────────────────────────────────────
CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id      UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  applied_role VARCHAR(100),
  status       application_status NOT NULL DEFAULT 'PENDING',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)                       -- One application per team per user
);

CREATE INDEX idx_applications_team ON applications (team_id);
CREATE INDEX idx_applications_user ON applications (user_id);
CREATE INDEX idx_applications_status ON applications (status);

-- ─── Messages (Team Chat) ─────────────────────────────────────────────────────
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  type       VARCHAR(20) NOT NULL DEFAULT 'text',  -- text | file | system
  file_url   VARCHAR(500),
  timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_team ON messages (team_id);
CREATE INDEX idx_messages_team_ts ON messages (team_id, timestamp DESC);  -- For pagination
CREATE INDEX idx_messages_sender ON messages (sender_id);

-- ─── Announcements ────────────────────────────────────────────────────────────
CREATE TABLE announcements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hackathon_id  UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  admin_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(300) NOT NULL,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_hackathon ON announcements (hackathon_id);
CREATE INDEX idx_announcements_created ON announcements (created_at DESC);

-- ─── Triggers: auto-update updated_at ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hackathons_updated_at BEFORE UPDATE ON hackathons FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Business Logic: Prevent joining locked teams ─────────────────────────────
CREATE OR REPLACE FUNCTION prevent_join_locked_team()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT status FROM teams WHERE id = NEW.team_id) = 'LOCKED' THEN
    RAISE EXCEPTION 'Cannot join a locked team';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_team_lock
  BEFORE INSERT ON team_members
  FOR EACH ROW EXECUTE FUNCTION prevent_join_locked_team();

-- ─── Business Logic: Prevent duplicate finalized team per hackathon ───────────
-- This is enforced at the application layer, but here's a view to help detect conflicts
CREATE VIEW team_membership_view AS
SELECT
  tm.user_id,
  tm.team_id,
  t.hackathon_id,
  t.name AS team_name,
  t.status AS team_status,
  h.title AS hackathon_title
FROM team_members tm
JOIN teams t ON t.id = tm.team_id
JOIN hackathons h ON h.id = t.hackathon_id;

-- ─── Sample Admin User (change password in production!) ───────────────────────
-- Password hash is for 'admin@college.edu' / 'changeme123'
-- INSERT INTO users (name, email, password_hash, role) VALUES
--   ('Admin', 'admin@college.edu', '$2b$12$EXAMPLE_BCRYPT_HASH', 'admin');
