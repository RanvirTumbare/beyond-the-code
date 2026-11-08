import {
  SiteSettings,
  HomeContent,
  ExploreCard,
  AboutContent,
  Skill,
  JourneyEvent,
  Project,
  Certificate,
  DiaryPost,
  GalleryItem,
} from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'settings-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  site_title: 'Beyond the Code',
  tagline: 'A personal portfolio and digital diary exploring Cybersecurity, SAP/ERP, Data Analytics and Web Engineering.',
  logo_url: null,
  accent_color: '#43866A',
  seo_default_title: 'Beyond the Code — Ranvir | Portfolio & Digital Diary',
  seo_default_description: 'Portfolio and digital diary of Ranvir, Computer Engineering student passionate about Cybersecurity, SAP/ERP, Data Analytics and Web Engineering.',
  og_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  linkedin_url: 'https://www.linkedin.com/in/ranvir-placeholder',
  github_url: 'https://github.com/ranvir-placeholder',
  email: 'ranvir.connect.placeholder@gmail.com',
  other_links: [
    { label: 'Kaggle', url: 'https://kaggle.com/placeholder' },
    { label: 'LeetCode', url: 'https://leetcode.com/placeholder' },
  ],
  resume_url: null,
};

export const INITIAL_HOME_CONTENT: HomeContent = {
  id: 'home-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  hero_greeting: 'Hello, I am Ranvir',
  hero_heading: 'Exploring Technology. Building My Journey.',
  hero_intro:
    'A Computer Engineering student fascinated by how secure code and enterprise data architectures shape resilient real-world systems. Here I document my technical explorations, college journey, and thoughts on technology.',
  hero_image_url:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  status_text: 'Exploring SAP Security & Full-Stack Systems',
  location_label: 'Mumbai, India',
  closing_quote:
    '"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."',
  show_explore: true,
  show_projects: true,
  show_recent: true,
  show_certificates: true,
};

export const INITIAL_EXPLORE_CARDS: ExploreCard[] = [
  {
    id: 'explore-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Cybersecurity',
    description:
      'Exploring network defense, ethical hacking fundamentals, cryptography, and application security audits.',
    icon: 'Shield',
    sort_order: 1,
    visible: true,
  },
  {
    id: 'explore-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'SAP & Enterprise ERP',
    description:
      'Understanding business process integration, ERP architectures, and role-based access security models.',
    icon: 'Layers',
    sort_order: 2,
    visible: true,
  },
  {
    id: 'explore-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Data Analytics',
    description:
      'Uncovering patterns through Python, SQL, statistical modeling, and actionable business intelligence dashboards.',
    icon: 'BarChart3',
    sort_order: 3,
    visible: true,
  },
  {
    id: 'explore-4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Full-Stack Web Dev',
    description:
      'Engineering resilient, accessible web applications with modern frontend frameworks and distributed backends.',
    icon: 'Code2',
    sort_order: 4,
    visible: true,
  },
];

export const INITIAL_ABOUT_CONTENT: AboutContent = {
  id: 'about-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  intro:
    'I am Ranvir, a Computer Engineering undergraduate with an insatiable curiosity for how complex systems stay secure, efficient, and user-centric. My focus lies at the intersection of Cybersecurity, Enterprise ERP platforms like SAP, Data Analytics, and Web Engineering.',
  education: [
    {
      degree: 'Bachelor of Technology in Computer Engineering',
      institution: 'University Institute of Technology (Placeholder)',
      period: '2022 — Present (Expected 2026)',
      details:
        'Coursework in Data Structures, Database Systems, Computer Networks, Operating Systems, Cryptography, and Software Engineering.',
      score: 'Current GPA: 8.8 / 10.0',
    },
    {
      degree: 'Higher Secondary Certificate (HSC) — Science & Mathematics',
      institution: 'Junior College of Science (Placeholder)',
      period: '2020 — 2022',
      details:
        'Major subjects: Physics, Chemistry, Mathematics, and Computer Science fundamentals.',
    },
  ],
  interests:
    'Passionate about vulnerability assessment, SAP security authorizations, ETL pipelines, full-stack architectural design, and open-source intelligence.',
  personality:
    'Analytical and calm under pressure. I value quiet persistence, clear documentation, asking deep questions, and intellectual humility.',
  approach:
    'I believe software is not just about writing lines of code, but about constructing reliable bridges between human needs and machine precision. I approach problems by first understanding the domain mechanics before jumping to syntax.',
  aspirations:
    'To lead engineering teams building mission-critical enterprise systems where safety, security, and data integrity cannot be compromised.',
  beyond_technology:
    'Outside the terminal, I enjoy documentary photography, reading non-fiction essays on technological history, long distance running, and mentoring junior peers in foundational programming.',
  photo_url:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
};

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 's-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Network Security & Wireshark',
    category: 'Cybersecurity',
    level: 'Working Knowledge',
    sort_order: 1,
  },
  {
    id: 's-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Web Application Pentesting (OWASP Top 10)',
    category: 'Cybersecurity',
    level: 'Working Knowledge',
    sort_order: 2,
  },
  {
    id: 's-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Cryptography Fundamentals',
    category: 'Cybersecurity',
    level: 'Familiar',
    sort_order: 3,
  },
  {
    id: 's-4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Identity & Access Management (IAM)',
    category: 'Cybersecurity',
    level: 'Familiar',
    sort_order: 4,
  },

  {
    id: 's-5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'SAP ERP Fundamentals & Architecture',
    category: 'SAP / ERP',
    level: 'Working Knowledge',
    sort_order: 1,
  },
  {
    id: 's-6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'SAP Security & Authorizations Concept',
    category: 'SAP / ERP',
    level: 'Working Knowledge',
    sort_order: 2,
  },
  {
    id: 's-7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Business Process Integration (BPI)',
    category: 'SAP / ERP',
    level: 'Familiar',
    sort_order: 3,
  },

  {
    id: 's-8',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Python (Pandas, NumPy, Matplotlib)',
    category: 'Data Analytics',
    level: 'Core Proficient',
    sort_order: 1,
  },
  {
    id: 's-9',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Advanced SQL & Relational Modeling',
    category: 'Data Analytics',
    level: 'Core Proficient',
    sort_order: 2,
  },
  {
    id: 's-10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Exploratory Data Analysis (EDA)',
    category: 'Data Analytics',
    level: 'Working Knowledge',
    sort_order: 3,
  },
  {
    id: 's-11',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Power BI / Tableau Basics',
    category: 'Data Analytics',
    level: 'Familiar',
    sort_order: 4,
  },

  {
    id: 's-12',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'TypeScript & Modern JavaScript',
    category: 'Web Development',
    level: 'Core Proficient',
    sort_order: 1,
  },
  {
    id: 's-13',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'React & Next.js Ecosystem',
    category: 'Web Development',
    level: 'Core Proficient',
    sort_order: 2,
  },
  {
    id: 's-14',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Tailwind CSS & Responsive UI',
    category: 'Web Development',
    level: 'Core Proficient',
    sort_order: 3,
  },
  {
    id: 's-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Node.js & Express REST APIs',
    category: 'Web Development',
    level: 'Working Knowledge',
    sort_order: 4,
  },
  {
    id: 's-16',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Supabase & PostgreSQL',
    category: 'Web Development',
    level: 'Working Knowledge',
    sort_order: 5,
  },

  {
    id: 's-17',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Git & Collaborative GitHub Flow',
    category: 'Programming & Tools',
    level: 'Core Proficient',
    sort_order: 1,
  },
  {
    id: 's-18',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Linux / Bash CLI',
    category: 'Programming & Tools',
    level: 'Working Knowledge',
    sort_order: 2,
  },
  {
    id: 's-19',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Docker Container Basics',
    category: 'Programming & Tools',
    level: 'Familiar',
    sort_order: 3,
  },
  {
    id: 's-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: 'Postman API Testing',
    category: 'Programming & Tools',
    level: 'Working Knowledge',
    sort_order: 4,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'SentinelAudit: Enterprise Role-Based Access Analyzer',
    slug: 'sentinelaudit-access-analyzer',
    category: 'Cybersecurity',
    summary:
      'A compliance simulation engine that audits user-role permissions against segregation-of-duties (SoD) policies to eliminate privilege creep in simulated enterprise environments.',
    cover_image_url:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    problem:
      'In expanding enterprise organizations and university lab management systems, users frequently accumulate unrevoked permissions across departments. This creates dangerous toxic combinations and segregation-of-duties violations that go unnoticed until security reviews or audits.',
    why_selected:
      'I wanted to bridge my interests in SAP role-authorization concepts and web-based security analytics. Studying compliance frameworks inspired me to write an automated rule-verification engine instead of checking permissions manually.',
    solution:
      'Engineered an automated rule evaluation parser that ingests simulated role matrices in JSON/CSV, constructs a directed permission graph, detects conflicting privilege assignments (e.g. Purchase Order Creator AND Approver), and produces an actionable remediation report with severity scoring.',
    tech_stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Lucide Icons'],
    features:
      '- Ingestion engine for multi-tier role matrices\n- Real-time Segregation of Duties (SoD) matrix violation detection\n- Role-overlap score and privilege creep visualization\n- Exportable compliance assessment PDF and CSV reports\n- Role simulation sandbox for prospective promotions',
    screenshots: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        caption: 'SentinelAudit Interactive Compliance Dashboard Overview',
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Detailed Conflict Matrix showing high-risk role combinations',
      },
    ],
    team: [
      { name: 'Ranvir', role: 'Lead Architect & Security Logic Designer (Placeholder)' },
      { name: 'College Peer', role: 'Frontend Co-Developer (Placeholder)' },
    ],
    my_contribution:
      'Designed the core conflict detection algorithms, modeled the relational database schema in PostgreSQL, and developed the interactive matrix filtering components in React.',
    challenges:
      'Handling circular role-inheritance trees without running into exponential stack exhaustion required implementing a cycle-detection memoization algorithm.',
    learnings:
      'Deepened my understanding of enterprise security principles (least privilege, separation of duties) and taught me how to present dense technical compliance data into clear editorial charts.',
    demo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    github_url: 'https://github.com/ranvir-placeholder/sentinelaudit',
    live_url: 'https://sentinelaudit-demo.placeholder.app',
    featured: true,
    status: 'published',
    sort_order: 1,
    seo_title: 'SentinelAudit Case Study — Ranvir',
    seo_description:
      'In-depth engineering case study of SentinelAudit: an enterprise role-based access auditor built by Ranvir.',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Google Cybersecurity Professional Certificate (Sample Placeholder)',
    issuer: 'Coursera / Google Career Certificates',
    completion_date: '2024-03-15',
    category: 'Cybersecurity',
    skills: ['SIEM Tools', 'Python Automation', 'Packet Analysis', 'Linux CLI', 'Incident Response'],
    file_url:
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80',
    file_type: 'image',
    verification_url: 'https://coursera.org/verify/SAMPLE_PLACEHOLDER_ID',
    in_progress: false,
    status: 'published',
  },
  {
    id: 'cert-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'SAP Certified Associate — Business Process Integration (In Progress)',
    issuer: 'SAP SE',
    completion_date: null,
    category: 'SAP / ERP',
    skills: ['SAP S/4HANA', 'Enterprise Management', 'Sales & Distribution (SD)', 'Financial Accounting (FI)'],
    file_url: null,
    file_type: 'pdf',
    verification_url: null,
    in_progress: true,
    status: 'published',
  },
];

export const INITIAL_JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: 'je-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Commenced Computer Engineering Degree',
    event_date: '2022-08-16',
    type: 'Education',
    summary:
      'Began undergraduate studies in Computer Engineering, establishing foundational roots in computational logic and programming.',
    content:
      'Entering university opened the door to structured computer science: memory architectures, algorithm complexity, and collaborative team sprints. This milestone marked the shift from viewing computers as mere tools to understanding them as layered systems of hardware, operating kernels, and software abstractions.',
    cover_image_url:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    media: [],
    tags: ['University', 'Computer Engineering', 'Freshman Year'],
    featured: true,
    status: 'published',
    project_id: null,
  },
  {
    id: 'je-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'First 36-Hour Hackathon: Building Under Pressure',
    event_date: '2023-09-22',
    type: 'Hackathon',
    summary:
      'Participated in my first inter-college hackathon, collaborating on a rapid disaster-response resource dispatch tool.',
    content:
      'Thirty-six hours of non-stop collaboration, rapid prototyping, and coffee-fueled debugging. Our team designed a lightweight SMS-and-web sync tool for emergency relief squads. While we did not secure the grand trophy, presenting our working prototype to industry judges fundamentally transformed how I manage time and scope software under rigid constraints.',
    cover_image_url:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    media: [],
    tags: ['Hackathon', 'Teamwork', 'Rapid Prototyping', 'Web Dev'],
    featured: true,
    status: 'published',
    project_id: null,
  },
  {
    id: 'je-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Diving into Enterprise SAP & Security Paradigms',
    event_date: '2024-02-10',
    type: 'Milestone',
    summary:
      'Began focused self-study and certified coursework exploring ERP structures and role authorization matrices.',
    content:
      'Recognized that large scale enterprises rely on interconnected workflows where security cannot simply be an afterthought. Began analyzing standard SAP authorization objects, user master records, and how corporate compliance frameworks mandate segregation of duties.',
    cover_image_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    media: [],
    tags: ['SAP', 'Security', 'Enterprise Systems', 'Self-Learning'],
    featured: false,
    status: 'published',
    project_id: null,
  },
];

export const INITIAL_DIARY_POSTS: DiaryPost[] = [
  {
    id: 'dp-1',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    title: 'Why Every Engineer Needs to Understand Enterprise Security Early',
    slug: 'why-engineers-need-security-early',
    category: 'Technology',
    cover_image_url:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Reflections on why security should not be treated as a separate department, but as a fundamental mindset integrated into every architectural decision.',
    content: `### The Illusion of "It Works"

When we first learn to program in university, success is defined almost entirely by functional correctness: does the algorithm return the expected output? Does the page render without errors?

However, in production environments—especially within enterprise platforms handling financial or patient data—"working" is only the first step. A system that works but leaks authentication state or grants redundant write permissions is more dangerous than a system that fails to boot entirely.

\`\`\`ts
// Example: The subtle difference between functional logic and secure authorization
interface UserSession {
  userId: string;
  roles: string[];
}

function canAuthorizeTransaction(user: UserSession, amount: number): boolean {
  // A naive check checks only role existence:
  const isFinance = user.roles.includes("FINANCE_OPERATOR");
  
  // Real security mandates Segregation of Duties (SoD) & monetary threshold:
  const hasLimitApproval = amount <= 50000;
  const isNotCreator = !user.roles.includes("TRANSACTION_INITIATOR");
  
  return isFinance && hasLimitApproval && isNotCreator;
}
\`\`\`

### What I Learned

1. **Least Privilege is a Design Principle**: Never grant a role broader permissions than its strictest daily task requires.
2. **Audit Trails Matter**: If an action occurs without a verifiable, non-repudiable log, it cannot be validated during an incident response.
3. **Simplicity Drives Resilience**: Complex authorization trees inevitably spawn security blind spots.

As I continue my studies in Computer Engineering and explore SAP authorization concepts, my goal is to keep security at the foundation of everything I build.`,
    reading_time: 4,
    published_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'published',
    is_future_note: false,
    seo_title: 'Why Every Engineer Needs Security Early — Ranvir Diary',
    seo_description:
      'Ranvir reflects on enterprise cybersecurity and segregation of duties in software architecture.',
  },
  {
    id: 'dp-2',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    title: 'A Note to My Future Self: On Graduating & Keeping the Curiosity Alive',
    slug: 'note-to-my-future-self-curiosity',
    category: 'Personal Growth',
    cover_image_url:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'A personal reflection written during my college journey to remind myself what truly mattered when deadlines felt overwhelming.',
    content: `### Dear Future Ranvir,

If you are reading this after completing your degree or several years into your engineering career, take a breath.

Remember the late nights at your desk in Mumbai, piecing together your first socket network scripts, wrestling with SQL query plans, and feeling that electric spark of satisfaction when a tricky bug finally surrendered.

### Promises to Keep

- **Never lose the beginner mind**: Technology will pivot, frameworks will change, and enterprise architectures will evolve. The best engineers are not the ones who memorized an API, but those who are never too proud to admit they do not know something and are eager to learn it.
- **Value depth over vanity metrics**: Do not chase empty badges or percentages. Write software that solves real pain points and stands the test of audit scrutiny.
- **Help those who are a few steps behind**: Just as mentors and senior peers took time to explain tricky concepts to you, make sure you pay it forward to the next student entering engineering.

Stay humble, keep building, and stay curious.`,
    reading_time: 3,
    published_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    status: 'published',
    is_future_note: true,
    seo_title: 'A Note to My Future Self — Ranvir',
    seo_description:
      'A digital letter to the future from Ranvir, reflecting on engineering humility and persistent learning.',
  },
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    caption: 'Late night collaborative session tuning database schemas for our hackathon entry.',
    album: 'Hackathons',
    category: 'Hackathons',
    event_name: 'Inter-College Innovation Sprint',
    event_date: '2023-09-23',
    media_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    video_embed_url: null,
    sort_order: 1,
    status: 'published',
  },
  {
    id: 'g-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    caption: 'Keynote session on Cloud Enterprise Architectures & Distributed Data.',
    album: 'Workshops',
    category: 'Workshops',
    event_name: 'Annual Tech Symposium',
    event_date: '2024-01-18',
    media_url:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    video_embed_url: null,
    sort_order: 2,
    status: 'published',
  },
  {
    id: 'g-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    caption: 'Hands-on network analysis lab inspecting TCP packets with Wireshark.',
    album: 'College Memories',
    category: 'College Memories',
    event_name: 'Computer Networks Laboratory',
    event_date: '2023-11-05',
    media_url:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    video_embed_url: null,
    sort_order: 3,
    status: 'published',
  },
];
