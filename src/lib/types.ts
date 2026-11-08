export type PublishStatus = 'draft' | 'published';

export interface SiteSettings {
  id: string;
  created_at: string;
  updated_at: string;
  site_title: string;
  tagline: string;
  logo_url: string | null;
  accent_color: string;
  seo_default_title: string;
  seo_default_description: string;
  og_image_url: string | null;
  linkedin_url: string;
  github_url: string;
  email: string;
  other_links: Array<{ label: string; url: string }>;
  resume_url: string | null;
}

export interface HomeContent {
  id: string;
  created_at: string;
  updated_at: string;
  hero_greeting: string;
  hero_heading: string;
  hero_intro: string;
  hero_image_url: string | null;
  status_text: string;
  location_label: string;
  closing_quote: string;
  show_explore: boolean;
  show_projects: boolean;
  show_recent: boolean;
  show_certificates: boolean;
}

export interface ExploreCard {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  visible: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details: string;
  score?: string;
}

export interface AboutContent {
  id: string;
  created_at: string;
  updated_at: string;
  intro: string;
  education: EducationItem[];
  interests: string;
  personality: string;
  approach: string;
  aspirations: string;
  beyond_technology: string;
  photo_url: string | null;
}

export interface Skill {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: 'Cybersecurity' | 'SAP / ERP' | 'Data Analytics' | 'Web Development' | 'Programming & Tools';
  level: string; // Text label: e.g. "Proficient", "Working Knowledge", "Exploring" - NO PERCENTAGES
  sort_order: number;
}

export type JourneyEventType = 'Education' | 'Hackathon' | 'Achievement' | 'Workshop' | 'Event' | 'Milestone';

export interface MediaItem {
  url: string;
  caption?: string;
  type?: 'image' | 'video';
}

export interface JourneyEvent {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  event_date: string;
  type: JourneyEventType;
  summary: string;
  content: string; // Markdown
  cover_image_url: string | null;
  media: MediaItem[];
  tags: string[];
  featured: boolean;
  status: PublishStatus;
  project_id: string | null;
}

export interface ProjectScreenshot {
  url: string;
  caption?: string;
  sort_order?: number;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: string; // 'Cybersecurity' | 'Web Development' | 'IoT' | 'Data Analytics' | 'SAP / ERP' | 'Other'
  summary: string;
  cover_image_url: string | null;
  problem: string;
  why_selected: string;
  solution: string;
  tech_stack: string[];
  features: string; // bullet points or text
  screenshots: ProjectScreenshot[];
  team: ProjectTeamMember[];
  my_contribution: string;
  challenges: string;
  learnings: string;
  demo_video_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: PublishStatus;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface Certificate {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  issuer: string;
  completion_date: string | null;
  category: string;
  skills: string[];
  file_url: string | null;
  file_type: 'image' | 'pdf';
  verification_url: string | null;
  in_progress: boolean;
  status: PublishStatus;
}

export interface DiaryPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: string; // 'Learning Logs' | 'College Life' | 'Hackathons' | 'Technology' | 'Personal Growth' | 'Experiences'
  cover_image_url: string | null;
  excerpt: string;
  content: string; // Markdown
  reading_time: number; // minutes
  published_at: string;
  status: PublishStatus;
  is_future_note: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

export interface GalleryItem {
  id: string;
  created_at: string;
  updated_at: string;
  caption: string;
  album: string;
  category: string; // 'Hackathons' | 'Technical Events' | 'College Memories' | 'Workshops' | 'Project Demos' | 'Team Moments' | 'Awards' | 'Personal'
  event_name: string;
  event_date: string;
  media_url: string;
  media_type: 'image' | 'video';
  video_embed_url: string | null;
  sort_order: number;
  status: PublishStatus;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
}

export interface AdminUser {
  user_id: string;
  created_at: string;
}
