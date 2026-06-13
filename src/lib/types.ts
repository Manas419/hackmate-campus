export type UserRole = 'student' | 'team_leader' | 'admin';
export type TeamStatus = 'OPEN' | 'LOCKED';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type AvailabilityStatus = 'available' | 'busy' | 'open_to_offers';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    year: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    year: number;
    bio: string;
    skills: string[];
    portfolioLinks: string[];
    availability: AvailabilityStatus;
    createdAt: string;
    avatar?: string;
    achievements?: Achievement[];
}

export interface Hackathon {
    id: string;
    title: string;
    description: string;
    rules: string;
    prizeDetails: string;
    registrationDeadline: string;
    eventDate?: string;
    createdByAdminId: string;
    createdAt: string;
    officialLink?: string;
    banner?: string;
    theme?: string;
    maxTeamSize?: number;
    minTeamSize?: number;
    teamsCount?: number;
}

export interface RequiredRole {
    role: string;
    skills: string[];
    count: number;
    filled: number;
}

export interface Team {
    id: string;
    hackathonId: string;
    hackathonTitle?: string;
    leaderId: string;
    leaderName?: string;
    name: string;
    description: string;
    requiredRoles: RequiredRole[];
    maxMembers: number;
    currentMembers: number;
    status: TeamStatus;
    createdAt: string;
    members?: TeamMember[];
}

export interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    userName: string;
    userEmail?: string;
    userDepartment?: string;
    userSkills?: string[];
    role: string;
    joinedAt: string;
    avatar?: string;
}

export interface Application {
    id: string;
    teamId: string;
    teamName?: string;
    hackathonTitle?: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    userDepartment?: string;
    userSkills?: string[];
    userYear?: number;
    message: string;
    status: ApplicationStatus;
    appliedRole?: string;
    createdAt: string;
    existingTeam?: string | null;
}

export interface Message {
    id: string;
    teamId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string;
    type?: 'text' | 'file' | 'system';
}

export interface Announcement {
    id: string;
    hackathonId: string;
    hackathonTitle?: string;
    adminId: string;
    adminName?: string;
    title: string;
    content: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface DashboardStats {
    activeHackathons: number;
    myTeams: number;
    pendingApplications: number;
    totalStudents: number;
}
