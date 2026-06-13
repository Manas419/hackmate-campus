import { User, Hackathon, Team, Application, Announcement, Message, RequiredRole } from './types';

// ─── Mock Users (20 students + 1 admin) ───────────────────────────────────────
export const mockUsers: User[] = [
    {
        id: 'user-1', name: 'Aarav Sharma', email: 'aarav@college.edu', role: 'student', department: 'Computer Science', year: 3,
        bio: 'Full-stack dev passionate about AI and open source.',
        skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Machine Learning'],
        portfolioLinks: ['https://github.com/aarav', 'https://aarav.dev'],
        availability: 'available', createdAt: '2024-08-01T10:00:00Z',
        achievements: [
            { id: 'ach-1', title: 'Winner, Smart India Hackathon', year: '2025', description: 'Led a team of 6 to build a crop monitoring system.' },
            { id: 'ach-2', title: 'Author, "AI in Healthcare" Paper', year: '2024', description: 'Published in the college technical journal.' }
        ]
    },
    {
        id: 'user-2', name: 'Priya Mehta', email: 'priya@college.edu', role: 'team_leader', department: 'Information Technology', year: 4,
        bio: 'UI/UX designer & frontend dev. Won 2 hackathons!',
        skills: ['Figma', 'React', 'TailwindCSS', 'Next.js', 'TypeScript'],
        portfolioLinks: ['https://behance.net/priya'],
        availability: 'open_to_offers', createdAt: '2024-07-15T08:00:00Z',
        achievements: [
            { id: 'ach-3', title: 'Top 100 on Behance', year: '2025', description: 'Design featured in the UX/UI curated gallery.' },
            { id: 'ach-4', title: 'Runner-up, InnovateCS 2024', year: '2024', description: 'Designed the winning fintech dashboard.' }
        ]
    },
    { id: 'user-3', name: 'Rohit Verma', email: 'rohit@college.edu', role: 'student', department: 'Electronics & Comm.', year: 2, bio: 'IoT enthusiast. Hardware meets software!', skills: ['C++', 'Arduino', 'Raspberry Pi', 'Python', 'MQTT'], portfolioLinks: ['https://github.com/rohitv'], availability: 'available', createdAt: '2024-08-10T09:00:00Z' },
    { id: 'user-4', name: 'Sneha Patel', email: 'sneha@college.edu', role: 'team_leader', department: 'Data Science', year: 3, bio: 'ML engineer obsessed with data pipelines.', skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Tableau'], portfolioLinks: ['https://github.com/sneha', 'https://kaggle.com/sneha'], availability: 'busy', createdAt: '2024-08-05T11:00:00Z' },
    { id: 'user-5', name: 'Karan Singh', email: 'karan@college.edu', role: 'student', department: 'Computer Science', year: 3, bio: 'Backend dev who loves clean APIs and fast servers.', skills: ['Python', 'Django', 'MySQL', 'Redis', 'Docker'], portfolioLinks: ['https://github.com/karans'], availability: 'available', createdAt: '2024-08-12T07:00:00Z' },
    { id: 'user-6', name: 'Arjun Dev', email: 'arjun@college.edu', role: 'student', department: 'Data Science', year: 3, bio: 'Data engineer with a love for clean pipelines.', skills: ['Python', 'SQL', 'Airflow', 'Spark', 'GCP'], portfolioLinks: ['https://github.com/arjundev'], availability: 'available', createdAt: '2024-08-08T09:30:00Z' },
    { id: 'user-7', name: 'Aisha Khan', email: 'aisha@college.edu', role: 'student', department: 'Computer Science', year: 2, bio: 'ML researcher passionate about NLP and transformers.', skills: ['Python', 'Scikit-learn', 'NLP', 'Statistics', 'HuggingFace'], portfolioLinks: ['https://github.com/aishak'], availability: 'open_to_offers', createdAt: '2024-09-01T10:00:00Z' },
    { id: 'user-8', name: 'Vikram Nair', email: 'vikram@college.edu', role: 'student', department: 'Computer Science', year: 4, bio: 'Blockchain & Web3 dev. Building decentralized futures.', skills: ['Solidity', 'Web3.js', 'Ethereum', 'React', 'Hardhat'], portfolioLinks: ['https://github.com/vikramnair'], availability: 'available', createdAt: '2024-07-20T08:00:00Z' },
    { id: 'user-9', name: 'Divya Krishnan', email: 'divya@college.edu', role: 'student', department: 'Artificial Intelligence', year: 3, bio: 'Computer vision researcher.', skills: ['Python', 'PyTorch', 'OpenCV', 'YOLO', 'Deep Learning'], portfolioLinks: ['https://github.com/divyak'], availability: 'available', createdAt: '2024-08-14T11:00:00Z' },
    { id: 'user-10', name: 'Rohan Gupta', email: 'rohan@college.edu', role: 'student', department: 'Information Technology', year: 2, bio: 'Mobile app dev & UI enthusiast.', skills: ['Flutter', 'Dart', 'Firebase', 'React Native', 'Kotlin'], portfolioLinks: ['https://github.com/rohang'], availability: 'available', createdAt: '2024-09-05T09:00:00Z' },
    { id: 'user-11', name: 'Meera Joshi', email: 'meera@college.edu', role: 'student', department: 'Computer Science', year: 1, bio: 'Eager first-year with a love for problem solving.', skills: ['Python', 'C', 'HTML/CSS', 'JavaScript'], portfolioLinks: [], availability: 'available', createdAt: '2024-09-10T08:00:00Z' },
    { id: 'user-12', name: 'Siddharth Rao', email: 'sid@college.edu', role: 'team_leader', department: 'Computer Science', year: 4, bio: 'DevOps & cloud architect. CI/CD fanatic.', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'], portfolioLinks: ['https://github.com/sidrao'], availability: 'open_to_offers', createdAt: '2024-07-01T07:00:00Z' },
    { id: 'user-13', name: 'Ananya Bose', email: 'ananya@college.edu', role: 'student', department: 'Electronics & Comm.', year: 3, bio: 'Embedded systems dev who loves RTOS & edge AI.', skills: ['C', 'C++', 'FreeRTOS', 'STM32', 'Edge Computing'], portfolioLinks: ['https://github.com/ananyab'], availability: 'available', createdAt: '2024-08-18T10:00:00Z' },
    { id: 'user-14', name: 'Nikhil Thakur', email: 'nikhil@college.edu', role: 'student', department: 'Cybersecurity', year: 3, bio: 'Ethical hacker & CTF player. Top 10 at HackTheBox.', skills: ['Pentesting', 'Linux', 'Networking', 'Python', 'Kali Linux'], portfolioLinks: ['https://github.com/nikhilt'], availability: 'available', createdAt: '2024-08-21T09:00:00Z' },
    { id: 'user-15', name: 'Pooja Desai', email: 'pooja@college.edu', role: 'student', department: 'Data Science', year: 2, bio: 'Data viz enthusiast who makes dashboards people love.', skills: ['Power BI', 'Tableau', 'SQL', 'Excel', 'Python'], portfolioLinks: ['https://github.com/poojad'], availability: 'open_to_offers', createdAt: '2024-09-03T11:00:00Z' },
    { id: 'user-16', name: 'Akash Reddy', email: 'akash@college.edu', role: 'student', department: 'Electrical Engineering', year: 3, bio: 'Power electronics meets software — building EV systems.', skills: ['MATLAB', 'Python', 'Arduino', 'Power Electronics', 'CAD'], portfolioLinks: [], availability: 'available', createdAt: '2024-08-25T08:00:00Z' },
    { id: 'user-17', name: 'Tanvi Kulkarni', email: 'tanvi@college.edu', role: 'student', department: 'Computer Science', year: 2, bio: 'Competitive programmer and open source contributor.', skills: ['C++', 'Algorithms', 'Data Structures', 'Go', 'Java'], portfolioLinks: ['https://github.com/tanvik', 'https://codeforces.com/profile/tanvi'], availability: 'available', createdAt: '2024-09-08T10:00:00Z' },
    { id: 'user-18', name: 'Harsh Malhotra', email: 'harsh@college.edu', role: 'student', department: 'Information Technology', year: 4, bio: 'Product manager mindset with full-stack skills.', skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Product Management'], portfolioLinks: ['https://github.com/harshm'], availability: 'busy', createdAt: '2024-07-28T09:00:00Z' },
    { id: 'user-19', name: 'Isha Chaudhary', email: 'isha@college.edu', role: 'student', department: 'Artificial Intelligence', year: 3, bio: 'Generative AI researcher building LLM-based applications.', skills: ['Python', 'LangChain', 'OpenAI API', 'FastAPI', 'Pinecone'], portfolioLinks: ['https://github.com/ishac'], availability: 'available', createdAt: '2024-08-30T11:00:00Z' },
    { id: 'user-20', name: 'Raj Patil', email: 'raj@college.edu', role: 'student', department: 'Mechanical Engineering', year: 3, bio: 'Mechatronics + software = robotics lover.', skills: ['ROS', 'Python', 'SolidWorks', 'MATLAB', 'OpenCV'], portfolioLinks: ['https://github.com/rajp'], availability: 'available', createdAt: '2024-09-02T08:30:00Z' },
    // ── Former coordinator (data kept for reference, no longer an admin) ──
    { id: 'admin-1', name: 'Dr. Kavita Rao', email: 'kavita@college.edu', role: 'student', department: 'Administration', year: 0, bio: 'Innovation cell faculty coordinator.', skills: ['Event Management', 'Leadership'], portfolioLinks: [], availability: 'available', createdAt: '2024-01-01T00:00:00Z' },
    // ── Active Admins ──
    { id: 'admin-2', name: 'Manas Patil', email: 'manas@admin.com', role: 'admin', department: 'Computer Science', year: 0, bio: 'Hackathon organizer & tech lead. Building campus innovation culture.', skills: ['Event Management', 'Leadership', 'Full Stack'], portfolioLinks: [], availability: 'available', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'admin-3', name: 'Rounak Sute', email: 'rounak@admin.com', role: 'admin', department: 'Information Technology', year: 0, bio: 'Campus hackathon coordinator. Passionate about student innovation.', skills: ['Event Management', 'Leadership', 'Project Management'], portfolioLinks: [], availability: 'available', createdAt: '2024-01-01T00:00:00Z' },
];

export const currentUser = mockUsers[0];
export const adminUser = mockUsers.find((u) => u.id === 'admin-2')!;

// ─── Mock Hackathons ───────────────────────────────────────────────────────────
export const mockHackathons: Hackathon[] = [
    {
        id: 'hack-1',
        title: 'InnovateCS 2026',
        description: 'The flagship annual hackathon of our college! Build innovative solutions in 36 hours across tracks: AI/ML, Web3, HealthTech, and Sustainability. Open to all students regardless of year or department.',
        rules: 'Teams of 2–4 members. Each member must be enrolled in the college. No pre-built code. Submissions via GitHub. Final presentations on Day 2.',
        prizeDetails: '🥇 ₹50,000 | 🥈 ₹30,000 | 🥉 ₹15,000 + Industry Mentorship',
        registrationDeadline: '2026-03-10T23:59:00Z',
        eventDate: '2026-03-15T09:00:00Z',
        createdByAdminId: 'admin-1',
        createdAt: '2026-02-01T10:00:00Z',
        theme: 'Build for Bharat',
        maxTeamSize: 4, minTeamSize: 2, teamsCount: 24,
    },
    {
        id: 'hack-2',
        title: 'DataQuest 2026',
        description: 'A data science and ML focused hackathon. Analyze real-world datasets provided by industry partners and build predictive models or dashboards that solve genuine problems.',
        rules: 'Solo or teams up to 3. Use of public datasets allowed. Models must be original. Jupyter notebooks or Streamlit apps preferred.',
        prizeDetails: '🥇 ₹25,000 | 🥈 ₹15,000 | Best Visualization: ₹10,000',
        registrationDeadline: '2026-04-01T23:59:00Z',
        eventDate: '2026-04-05T10:00:00Z',
        createdByAdminId: 'admin-1',
        createdAt: '2026-02-10T12:00:00Z',
        theme: 'Data-Driven Decisions',
        maxTeamSize: 3, minTeamSize: 1, teamsCount: 15,
    },
    {
        id: 'hack-3',
        title: 'HardwareHive IoT Hack',
        description: 'Build real IoT solutions using provided hardware kits. From smart city sensors to agricultural monitors — make hardware talk to software!',
        rules: 'Teams of 2–3. Hardware kits provided. Must use provided Arduino/Raspberry Pi kit. Projects must be physical prototypes.',
        prizeDetails: '🥇 ₹20,000 + Hardware Kit | 🥈 ₹12,000 | 🥉 ₹8,000',
        registrationDeadline: '2026-05-01T23:59:00Z',
        eventDate: '2026-05-10T09:00:00Z',
        createdByAdminId: 'admin-1',
        createdAt: '2026-02-15T08:00:00Z',
        theme: 'Smart Campus, Smart India',
        maxTeamSize: 3, minTeamSize: 2, teamsCount: 8,
    },
];

// ─── Mock Teams ────────────────────────────────────────────────────────────────
export const mockTeams: Team[] = [
    {
        id: 'team-1',
        hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        leaderId: 'user-2', leaderName: 'Priya Mehta',
        name: 'ByteBuilders',
        description: 'Building an AI-powered mental health companion for college students. Looking for a backend dev and ML engineer!',
        requiredRoles: [
            { role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], count: 1, filled: 0 },
            { role: 'ML Engineer', skills: ['Python', 'TensorFlow', 'NLP'], count: 1, filled: 0 },
            { role: 'UI/UX Designer', skills: ['Figma', 'React'], count: 1, filled: 1 },
        ] as RequiredRole[],
        maxMembers: 4, currentMembers: 2, status: 'OPEN',
        createdAt: '2026-02-05T10:00:00Z',
        members: [
            { id: 'tm-1', teamId: 'team-1', userId: 'user-2', userName: 'Priya Mehta', userDepartment: 'IT', userSkills: ['React', 'Figma', 'Next.js'], role: 'Team Leader & Frontend', joinedAt: '2026-02-05T10:00:00Z' },
            { id: 'tm-2', teamId: 'team-1', userId: 'user-5', userName: 'Karan Singh', userDepartment: 'CS', userSkills: ['Python', 'Django', 'MySQL'], role: 'Backend Developer', joinedAt: '2026-02-06T14:00:00Z' },
        ],
    },
    {
        id: 'team-2',
        hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        leaderId: 'user-1', leaderName: 'Aarav Sharma',
        name: 'CodeCraft',
        description: 'Building a blockchain-based certificate verification system for universities. Trust and transparency in education.',
        requiredRoles: [
            { role: 'Blockchain Developer', skills: ['Solidity', 'Web3.js'], count: 1, filled: 1 },
            { role: 'Frontend Developer', skills: ['React', 'TypeScript'], count: 1, filled: 1 },
        ] as RequiredRole[],
        maxMembers: 4, currentMembers: 3, status: 'OPEN',
        createdAt: '2026-02-07T09:00:00Z',
        members: [
            { id: 'tm-3', teamId: 'team-2', userId: 'user-1', userName: 'Aarav Sharma', userDepartment: 'CS', userSkills: ['React', 'Node.js', 'Python'], role: 'Team Leader & Full Stack', joinedAt: '2026-02-07T09:00:00Z' },
            { id: 'tm-4', teamId: 'team-2', userId: 'user-8', userName: 'Vikram Nair', userDepartment: 'CS', userSkills: ['Solidity', 'Web3.js', 'Ethereum'], role: 'Blockchain Developer', joinedAt: '2026-02-09T11:00:00Z' },
            { id: 'tm-5', teamId: 'team-2', userId: 'user-10', userName: 'Rohan Gupta', userDepartment: 'IT', userSkills: ['Flutter', 'React', 'Firebase'], role: 'Frontend Developer', joinedAt: '2026-02-10T13:00:00Z' },
        ],
    },
    {
        id: 'team-3',
        hackathonId: 'hack-2', hackathonTitle: 'DataQuest 2026',
        leaderId: 'user-4', leaderName: 'Sneha Patel',
        name: 'DataMinds',
        description: 'Predicting student dropout rates using ML models. Education analytics for better outcomes.',
        requiredRoles: [
            { role: 'Data Engineer', skills: ['Python', 'SQL', 'Airflow'], count: 1, filled: 1 },
            { role: 'ML Researcher', skills: ['Python', 'Scikit-learn', 'Statistics'], count: 1, filled: 1 },
        ] as RequiredRole[],
        maxMembers: 3, currentMembers: 3, status: 'LOCKED',
        createdAt: '2026-02-12T11:00:00Z',
        members: [
            { id: 'tm-6', teamId: 'team-3', userId: 'user-4', userName: 'Sneha Patel', userDepartment: 'Data Science', userSkills: ['Python', 'TensorFlow', 'SQL'], role: 'Team Leader & ML', joinedAt: '2026-02-12T11:00:00Z' },
            { id: 'tm-7', teamId: 'team-3', userId: 'user-6', userName: 'Arjun Dev', userDepartment: 'Data Science', userSkills: ['Python', 'SQL', 'Airflow'], role: 'Data Engineer', joinedAt: '2026-02-13T09:00:00Z' },
            { id: 'tm-8', teamId: 'team-3', userId: 'user-7', userName: 'Aisha Khan', userDepartment: 'CS', userSkills: ['Python', 'Scikit-learn', 'NLP'], role: 'ML Researcher', joinedAt: '2026-02-13T14:00:00Z' },
        ],
    },
    {
        id: 'team-4',
        hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        leaderId: 'user-12', leaderName: 'Siddharth Rao',
        name: 'CloudNine',
        description: 'Deploying a scalable real-time disaster management system on the cloud. Saving lives with technology.',
        requiredRoles: [
            { role: 'Frontend Developer', skills: ['React', 'TypeScript'], count: 1, filled: 0 },
            { role: 'ML Engineer', skills: ['Python', 'TensorFlow'], count: 1, filled: 0 },
        ] as RequiredRole[],
        maxMembers: 4, currentMembers: 2, status: 'OPEN',
        createdAt: '2026-02-18T08:00:00Z',
        members: [
            { id: 'tm-9', teamId: 'team-4', userId: 'user-12', userName: 'Siddharth Rao', userDepartment: 'CS', userSkills: ['Docker', 'Kubernetes', 'AWS'], role: 'Team Leader & DevOps', joinedAt: '2026-02-18T08:00:00Z' },
            { id: 'tm-10', teamId: 'team-4', userId: 'user-14', userName: 'Nikhil Thakur', userDepartment: 'Cybersecurity', userSkills: ['Pentesting', 'Python', 'Networking'], role: 'Security Engineer', joinedAt: '2026-02-19T10:00:00Z' },
        ],
    },
    {
        id: 'team-5',
        hackathonId: 'hack-3', hackathonTitle: 'HardwareHive IoT Hack',
        leaderId: 'user-3', leaderName: 'Rohit Verma',
        name: 'SensorSpark',
        description: 'Smart irrigation system using soil moisture sensors and ML to help farmers save water by 40%.',
        requiredRoles: [
            { role: 'Software Developer', skills: ['Python', 'MQTT', 'FastAPI'], count: 1, filled: 0 },
        ] as RequiredRole[],
        maxMembers: 3, currentMembers: 2, status: 'OPEN',
        createdAt: '2026-02-20T09:00:00Z',
        members: [
            { id: 'tm-11', teamId: 'team-5', userId: 'user-3', userName: 'Rohit Verma', userDepartment: 'Electronics', userSkills: ['Arduino', 'C++', 'Python'], role: 'Team Leader & Hardware', joinedAt: '2026-02-20T09:00:00Z' },
            { id: 'tm-12', teamId: 'team-5', userId: 'user-16', userName: 'Akash Reddy', userDepartment: 'Electrical', userSkills: ['MATLAB', 'Arduino', 'Python'], role: 'Electronics Engineer', joinedAt: '2026-02-20T11:00:00Z' },
        ],
    },
    {
        id: 'team-6',
        hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        leaderId: 'user-19', leaderName: 'Isha Chaudhary',
        name: 'GenAI Squad',
        description: 'Building a personalized AI study assistant using LLMs + RAG. Helping students learn smarter, not harder.',
        requiredRoles: [
            { role: 'Frontend Developer', skills: ['React', 'Next.js'], count: 1, filled: 0 },
            { role: 'Backend Developer', skills: ['FastAPI', 'PostgreSQL'], count: 1, filled: 0 },
        ] as RequiredRole[],
        maxMembers: 4, currentMembers: 2, status: 'OPEN',
        createdAt: '2026-02-19T14:00:00Z',
        members: [
            { id: 'tm-13', teamId: 'team-6', userId: 'user-19', userName: 'Isha Chaudhary', userDepartment: 'AI', userSkills: ['Python', 'LangChain', 'OpenAI API'], role: 'Team Leader & AI Engineer', joinedAt: '2026-02-19T14:00:00Z' },
            { id: 'tm-14', teamId: 'team-6', userId: 'user-9', userName: 'Divya Krishnan', userDepartment: 'AI', userSkills: ['Python', 'PyTorch', 'OpenCV'], role: 'ML Engineer', joinedAt: '2026-02-20T10:00:00Z' },
        ],
    },
];

// ─── Mock Applications ─────────────────────────────────────────────────────────
export const mockApplications: Application[] = [
    {
        id: 'app-1', teamId: 'team-1', teamName: 'ByteBuilders', hackathonTitle: 'InnovateCS 2026',
        userId: 'user-3', userName: 'Rohit Verma', userEmail: 'rohit@college.edu',
        userDepartment: 'Electronics', userSkills: ['C++', 'Python', 'IoT'], userYear: 2,
        message: 'I have experience with Python and TensorFlow from IoT projects. I can contribute to the ML pipeline!',
        status: 'PENDING', appliedRole: 'ML Engineer', createdAt: '2026-02-18T14:30:00Z', existingTeam: null,
    },
    {
        id: 'app-2', teamId: 'team-1', teamName: 'ByteBuilders', hackathonTitle: 'InnovateCS 2026',
        userId: 'user-7', userName: 'Aisha Khan', userEmail: 'aisha@college.edu',
        userDepartment: 'CS', userSkills: ['Python', 'NLP', 'Scikit-learn', 'HuggingFace'], userYear: 2,
        message: 'NLP is my specialization — I have worked on sentiment analysis and chatbot projects. Would love to build the mental health AI!',
        status: 'PENDING', appliedRole: 'ML Engineer', createdAt: '2026-02-19T09:00:00Z', existingTeam: 'DataMinds',
    },
    {
        id: 'app-3', teamId: 'team-4', teamName: 'CloudNine', hackathonTitle: 'InnovateCS 2026',
        userId: 'user-9', userName: 'Divya Krishnan', userEmail: 'divya@college.edu',
        userDepartment: 'AI', userSkills: ['Python', 'PyTorch', 'Computer Vision'], userYear: 3,
        message: 'For the disaster management system I can train object detection models to identify damage from satellite imagery. Strong CV background.',
        status: 'PENDING', appliedRole: 'ML Engineer', createdAt: '2026-02-20T08:00:00Z', existingTeam: null,
    },
    {
        id: 'app-4', teamId: 'team-6', teamName: 'GenAI Squad', hackathonTitle: 'InnovateCS 2026',
        userId: 'user-11', userName: 'Meera Joshi', userEmail: 'meera@college.edu',
        userDepartment: 'CS', userSkills: ['JavaScript', 'HTML/CSS', 'Python'], userYear: 1,
        message: 'First year but very motivated! I have been learning React and building personal projects. Happy to contribute to the frontend.',
        status: 'PENDING', appliedRole: 'Frontend Developer', createdAt: '2026-02-21T10:00:00Z', existingTeam: null,
    },
    {
        id: 'app-5', teamId: 'team-2', teamName: 'CodeCraft', hackathonTitle: 'InnovateCS 2026',
        userId: 'user-17', userName: 'Tanvi Kulkarni', userEmail: 'tanvi@college.edu',
        userDepartment: 'CS', userSkills: ['C++', 'Go', 'Java', 'Algorithms'], userYear: 2,
        message: 'I can quickly learn Solidity — strong programming fundamentals. Placed top 5 in CodeChef Div 2.',
        status: 'REJECTED', appliedRole: 'Blockchain Developer', createdAt: '2026-02-16T10:00:00Z', existingTeam: null,
    },
];

// ─── Mock Announcements ────────────────────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
    {
        id: 'ann-1', hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        adminId: 'admin-1', adminName: 'Dr. Kavita Rao',
        title: '🚀 InnovateCS 2026 Registration Now Open!',
        content: 'Registrations for InnovateCS 2026 are officially open! Theme: "Build for Bharat". Register teams by March 10th. Industry mentors from Google, Microsoft, and Infosys will be present. Workshops on AI/ML, Web3, and Cloud Computing on Day 0.',
        createdAt: '2026-02-01T10:00:00Z',
    },
    {
        id: 'ann-2', hackathonId: 'hack-2', hackathonTitle: 'DataQuest 2026',
        adminId: 'admin-1', adminName: 'Dr. Kavita Rao',
        title: '📊 DataQuest 2026 — Datasets Released!',
        content: 'Official datasets for DataQuest 2026 are live on the portal — anonymized healthcare data from district hospitals and agricultural yield data from Maharashtra. Teams may start EDA now. No pre-trained models before the event.',
        createdAt: '2026-02-10T12:00:00Z',
    },
    {
        id: 'ann-3', hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        adminId: 'admin-1', adminName: 'Dr. Kavita Rao',
        title: '🎓 Pre-Hackathon Workshop Schedule',
        content: 'Feb 28: Intro to LLMs & Prompt Engineering (Lab 3). Mar 2: REST APIs with FastAPI (Lab 1). Mar 5: Smart Contract Development with Solidity (Online). Free for all registered participants.',
        createdAt: '2026-02-20T09:00:00Z',
    },
    {
        id: 'ann-4', hackathonId: 'hack-3', hackathonTitle: 'HardwareHive IoT Hack',
        adminId: 'admin-1', adminName: 'Dr. Kavita Rao',
        title: '🔧 Hardware Kit Distribution — Apr 15–20',
        content: 'Collect kits at Electronics Lab (Room 201). Each team gets: 1x Raspberry Pi 4, 2x Arduino Uno, sensors (DHT22, PIR, Ultrasonic, GPS), jumper wires & breadboards. College ID required.',
        createdAt: '2026-02-15T08:00:00Z',
    },
    {
        id: 'ann-5', hackathonId: 'hack-1', hackathonTitle: 'InnovateCS 2026',
        adminId: 'admin-1', adminName: 'Dr. Kavita Rao',
        title: '⚠️ Important: Team Registration Deadline Reminder',
        content: 'Only 3 days left to register your team for InnovateCS 2026! Teams must be registered and approved before March 10th at 11:59 PM. Unregistered individuals will not be allowed entry. 22 teams registered so far — spots filling fast!',
        createdAt: '2026-02-21T08:00:00Z',
    },
];

// ─── Mock Messages (Team Chat — DataMinds, team-3, LOCKED) ────────────────────
export const mockMessages: Message[] = [
    { id: 'msg-1', teamId: 'team-3', senderId: 'user-4', senderName: 'Sneha Patel', content: 'Team is now finalized! Welcome everyone 🎉 Let\'s win DataQuest 2026!', timestamp: '2026-02-14T10:00:00Z', type: 'system' },
    { id: 'msg-2', teamId: 'team-3', senderId: 'user-6', senderName: 'Arjun Dev', content: 'Excited to work with you all! I\'ve already started exploring the healthcare dataset. The missing value rate is quite high — ~18%.', timestamp: '2026-02-14T10:15:00Z', type: 'text' },
    { id: 'msg-3', teamId: 'team-3', senderId: 'user-4', senderName: 'Sneha Patel', content: 'Good catch! Let\'s divide the EDA. I\'ll take agricultural data, you handle healthcare. Aisha can work on the feature engineering plan.', timestamp: '2026-02-14T10:20:00Z', type: 'text' },
    { id: 'msg-4', teamId: 'team-3', senderId: 'user-7', senderName: 'Aisha Khan', content: 'Sounds good! I\'ll set up the GitHub repo and initial Jupyter notebook structure. Shall we use standardised naming conventions?', timestamp: '2026-02-14T10:35:00Z', type: 'text' },
    { id: 'msg-5', teamId: 'team-3', senderId: 'user-4', senderName: 'Sneha Patel', content: 'Yes! Convention: `01_eda_healthcare.ipynb`, `02_eda_agriculture.ipynb`, `03_feature_engineering.ipynb`. Let\'s keep it clean 🔥', timestamp: '2026-02-14T10:40:00Z', type: 'text' },
    { id: 'msg-6', teamId: 'team-3', senderId: 'user-6', senderName: 'Arjun Dev', content: 'Repo created! https://github.com/dataminds/dataquest2026 — I\'ve added you both as collaborators.', timestamp: '2026-02-14T11:00:00Z', type: 'text' },
    { id: 'msg-7', teamId: 'team-3', senderId: 'user-7', senderName: 'Aisha Khan', content: 'Just pushed the initial structure. Also added a README with our project hypothesis. Let me know if you want changes.', timestamp: '2026-02-15T09:00:00Z', type: 'text' },
    { id: 'msg-8', teamId: 'team-3', senderId: 'user-4', senderName: 'Sneha Patel', content: 'Looks great Aisha! Quick standup tomorrow at 10 AM? We should align on model selection before the event. Thinking XGBoost vs LightGBM.', timestamp: '2026-02-15T09:30:00Z', type: 'text' },
    { id: 'msg-9', teamId: 'team-3', senderId: 'user-6', senderName: 'Arjun Dev', content: 'I vote LightGBM — faster training and better on imbalanced data. But let\'s benchmark both 👍', timestamp: '2026-02-15T09:35:00Z', type: 'text' },
    { id: 'msg-10', teamId: 'team-3', senderId: 'user-7', senderName: 'Aisha Khan', content: '10 AM works! Also should we prepare a slide deck template now so we\'re not rushing on the last day? 😅', timestamp: '2026-02-15T09:40:00Z', type: 'text' },
];

// ─── Skills list ───────────────────────────────────────────────────────────────
export const SKILLS_LIST = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'TailwindCSS',
    'Node.js', 'Express.js', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'Laravel',
    'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift', 'C', 'Dart',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'HuggingFace', 'LangChain', 'OpenAI API',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'DevOps', 'Terraform', 'Linux',
    'Blockchain', 'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'Hardhat',
    'Figma', 'UI/UX Design', 'Adobe XD', 'Photoshop',
    'Arduino', 'Raspberry Pi', 'IoT', 'Embedded Systems', 'MQTT', 'FreeRTOS', 'STM32',
    'Data Analysis', 'Pandas', 'SQL', 'Tableau', 'Power BI', 'Airflow', 'Spark',
    'Git', 'REST APIs', 'GraphQL', 'WebSockets',
    'Flutter', 'React Native', 'Android', 'iOS',
    'ROS', 'MATLAB', 'SolidWorks', 'CAD',
    'Pentesting', 'Networking', 'Kali Linux', 'Cybersecurity',
    'Product Management', 'Algorithms', 'Data Structures',
];

export const DEPARTMENTS = [
    'Computer Science', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Data Science', 'Artificial Intelligence', 'Cybersecurity',
    'Business Administration', 'Other',
];
