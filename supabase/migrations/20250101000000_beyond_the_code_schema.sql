-- ==============================================================================
-- BEYOND THE CODE — COMPLETE SUPABASE DATABASE MIGRATION & RLS SCHEMA
-- Author: Senior Full-Stack Engineer for Ranvir
-- Description: Creates all tables, updated_at triggers, admin helper, strict RLS,
--              storage bucket policies, and high-fidelity seed data.
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. UPDATED_AT TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE & HELPER FUNCTION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users IS 'List of authenticated users authorized with administrative privileges.';

-- Secure definer function to test whether the current request is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
END;
$$;

-- Grant execution to authenticated and anon
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  site_title TEXT NOT NULL DEFAULT 'Beyond the Code',
  tagline TEXT NOT NULL DEFAULT 'Exploring Technology. Building My Journey.',
  logo_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#43866A',
  seo_default_title TEXT NOT NULL DEFAULT 'Beyond the Code — Ranvir | Portfolio & Digital Diary',
  seo_default_description TEXT NOT NULL DEFAULT 'Personal portfolio and digital diary of Ranvir, Computer Engineering student passionate about Cybersecurity, SAP/ERP, Data Analytics and Web Engineering.',
  og_image_url TEXT,
  linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com/in/placeholder',
  github_url TEXT NOT NULL DEFAULT 'https://github.com/placeholder',
  email TEXT NOT NULL DEFAULT 'ranvir.placeholder@example.com',
  other_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  resume_url TEXT
);

CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. HOME CONTENT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hero_greeting TEXT NOT NULL DEFAULT 'Hello, I am Ranvir',
  hero_heading TEXT NOT NULL DEFAULT 'Exploring Technology. Building My Journey.',
  hero_intro TEXT NOT NULL DEFAULT 'Computer Engineering student at the intersection of cybersecurity, enterprise ERP systems, and modern web applications. Documenting learnings, projects, and personal reflections as they happen.',
  hero_image_url TEXT,
  status_text TEXT NOT NULL DEFAULT 'Exploring SAP Security & Full-Stack Systems',
  location_label TEXT NOT NULL DEFAULT 'Mumbai, India',
  closing_quote TEXT NOT NULL DEFAULT '"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."',
  show_explore BOOLEAN NOT NULL DEFAULT true,
  show_projects BOOLEAN NOT NULL DEFAULT true,
  show_recent BOOLEAN NOT NULL DEFAULT true,
  show_certificates BOOLEAN NOT NULL DEFAULT true
);

CREATE TRIGGER trigger_home_content_updated_at
  BEFORE UPDATE ON public.home_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. EXPLORE CARDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.explore_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Shield',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true
);

CREATE TRIGGER trigger_explore_cards_updated_at
  BEFORE UPDATE ON public.explore_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. ABOUT CONTENT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  intro TEXT NOT NULL,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  interests TEXT NOT NULL,
  personality TEXT NOT NULL,
  approach TEXT NOT NULL,
  aspirations TEXT NOT NULL,
  beyond_technology TEXT NOT NULL,
  photo_url TEXT
);

CREATE TRIGGER trigger_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. SKILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL, -- Text label, e.g., 'Core Proficient', 'Working Knowledge', 'Exploring'
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TRIGGER trigger_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. JOURNEY EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Education', 'Hackathon', 'Achievement', 'Workshop', 'Event', 'Milestone')),
  summary TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '', -- Markdown
  cover_image_url TEXT,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  project_id UUID -- Nullable FK reference to projects
);

CREATE TRIGGER trigger_journey_events_updated_at
  BEFORE UPDATE ON public.journey_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image_url TEXT,
  problem TEXT NOT NULL DEFAULT '',
  why_selected TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  features TEXT NOT NULL DEFAULT '',
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  team JSONB NOT NULL DEFAULT '[]'::jsonb,
  my_contribution TEXT NOT NULL DEFAULT '',
  challenges TEXT NOT NULL DEFAULT '',
  learnings TEXT NOT NULL DEFAULT '',
  demo_video_url TEXT,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order INT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT
);

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Foreign key from journey_events to projects
ALTER TABLE public.journey_events
  DROP CONSTRAINT IF EXISTS fk_journey_project;

ALTER TABLE public.journey_events
  ADD CONSTRAINT fk_journey_project
  FOREIGN KEY (project_id) REFERENCES public.projects(id)
  ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 10. CERTIFICATES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  completion_date DATE,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  file_url TEXT,
  file_type TEXT NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'pdf')),
  verification_url TEXT,
  in_progress BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published'))
);

CREATE TRIGGER trigger_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 11. DIARY POSTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diary_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown
  reading_time INT NOT NULL DEFAULT 3,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  is_future_note BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT
);

CREATE TRIGGER trigger_diary_posts_updated_at
  BEFORE UPDATE ON public.diary_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 12. GALLERY ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  caption TEXT NOT NULL,
  album TEXT NOT NULL DEFAULT 'General',
  category TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  video_embed_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published'))
);

CREATE TRIGGER trigger_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  email TEXT NOT NULL CHECK (char_length(email) >= 3 AND char_length(email) <= 150),
  subject TEXT NOT NULL CHECK (char_length(subject) >= 1 AND char_length(subject) <= 200),
  message TEXT NOT NULL CHECK (char_length(message) >= 5 AND char_length(message) <= 4000),
  is_read BOOLEAN NOT NULL DEFAULT false
);

CREATE TRIGGER trigger_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across every single table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- A. admin_users
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can modify admin_users" ON public.admin_users;
CREATE POLICY "Admins can modify admin_users"
  ON public.admin_users FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- B. site_settings, home_content, about_content, skills
-- (Public can read all; Admin can insert/update/delete)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can edit site_settings" ON public.site_settings;
CREATE POLICY "Admins can edit site_settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view home_content" ON public.home_content;
CREATE POLICY "Public can view home_content"
  ON public.home_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can edit home_content" ON public.home_content;
CREATE POLICY "Admins can edit home_content"
  ON public.home_content FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view about_content" ON public.about_content;
CREATE POLICY "Public can view about_content"
  ON public.about_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can edit about_content" ON public.about_content;
CREATE POLICY "Admins can edit about_content"
  ON public.about_content FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view skills" ON public.skills;
CREATE POLICY "Public can view skills"
  ON public.skills FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can edit skills" ON public.skills;
CREATE POLICY "Admins can edit skills"
  ON public.skills FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- C. explore_cards (Public sees visible = true; Admin sees all)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible explore_cards" ON public.explore_cards;
CREATE POLICY "Public can view visible explore_cards"
  ON public.explore_cards FOR SELECT
  USING (visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage explore_cards" ON public.explore_cards;
CREATE POLICY "Admins can manage explore_cards"
  ON public.explore_cards FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- D. journey_events, projects, certificates, diary_posts, gallery_items
-- (Public sees only status = 'published'; Admin sees and manages all)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Public can view published journey_events" ON public.journey_events;
CREATE POLICY "Public can view published journey_events"
  ON public.journey_events FOR SELECT
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage journey_events" ON public.journey_events;
CREATE POLICY "Admins can manage journey_events"
  ON public.journey_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published certificates" ON public.certificates;
CREATE POLICY "Public can view published certificates"
  ON public.certificates FOR SELECT
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published diary_posts" ON public.diary_posts;
CREATE POLICY "Public can view published diary_posts"
  ON public.diary_posts FOR SELECT
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage diary_posts" ON public.diary_posts;
CREATE POLICY "Admins can manage diary_posts"
  ON public.diary_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published gallery_items" ON public.gallery_items;
CREATE POLICY "Public can view published gallery_items"
  ON public.gallery_items FOR SELECT
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage gallery_items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery_items"
  ON public.gallery_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- E. contact_messages
-- (Public can ONLY insert with length constraints; Admin can select/update/delete)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    char_length(name) >= 1 AND char_length(name) <= 100 AND
    char_length(email) >= 3 AND char_length(email) <= 150 AND
    char_length(subject) >= 1 AND char_length(subject) <= 200 AND
    char_length(message) >= 5 AND char_length(message) <= 4000
  );

DROP POLICY IF EXISTS "Admins can read and manage messages" ON public.contact_messages;
CREATE POLICY "Admins can read and manage messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 15. STORAGE BUCKET & STORAGE RLS POLICIES
-- ==============================================================================

-- Create bucket 'media' if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf'];

-- Storage RLS: Public can view media
DROP POLICY IF EXISTS "Public can read media bucket" ON storage.objects;
CREATE POLICY "Public can read media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Storage RLS: Admin can insert media
DROP POLICY IF EXISTS "Admins can upload to media bucket" ON storage.objects;
CREATE POLICY "Admins can upload to media bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

-- Storage RLS: Admin can update media
DROP POLICY IF EXISTS "Admins can update media bucket" ON storage.objects;
CREATE POLICY "Admins can update media bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

-- Storage RLS: Admin can delete media
DROP POLICY IF EXISTS "Admins can delete from media bucket" ON storage.objects;
CREATE POLICY "Admins can delete from media bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());

-- ==============================================================================
-- 16. HIGH-FIDELITY SEED DATA (CLEARLY LABELLED PLACEHOLDERS)
-- ==============================================================================

-- Seed Site Settings
INSERT INTO public.site_settings (
  site_title, tagline, accent_color, seo_default_title, seo_default_description,
  linkedin_url, github_url, email, other_links, resume_url
)
VALUES (
  'Beyond the Code',
  'A personal portfolio and digital diary exploring Cybersecurity, SAP/ERP, Data Analytics and Web Engineering.',
  '#43866A',
  'Beyond the Code — Ranvir | Portfolio & Digital Diary',
  'Portfolio and digital diary of Ranvir, Computer Engineering student passionate about Cybersecurity, SAP/ERP, Data Analytics, and Web Development.',
  'https://www.linkedin.com/in/ranvir-placeholder',
  'https://github.com/ranvir-placeholder',
  'ranvir.connect.placeholder@gmail.com',
  '[{"label": "Kaggle", "url": "https://kaggle.com/placeholder"}, {"label": "LeetCode", "url": "https://leetcode.com/placeholder"}]'::jsonb,
  null
) ON CONFLICT DO NOTHING;

-- Seed Home Content
INSERT INTO public.home_content (
  hero_greeting, hero_heading, hero_intro, hero_image_url,
  status_text, location_label, closing_quote,
  show_explore, show_projects, show_recent, show_certificates
)
VALUES (
  'Hello, I am Ranvir',
  'Exploring Technology. Building My Journey.',
  'A Computer Engineering student fascinated by how secure code and enterprise data architectures shape resilient real-world systems. Here I document my technical explorations, college journey, and thoughts on technology.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'Exploring SAP Security & Full-Stack Systems',
  'Mumbai, India',
  '"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."',
  true, true, true, true
) ON CONFLICT DO NOTHING;

-- Seed Explore Cards
INSERT INTO public.explore_cards (title, description, icon, sort_order, visible) VALUES
('Cybersecurity', 'Exploring network defense, ethical hacking fundamentals, cryptography, and application security audits.', 'Shield', 1, true),
('SAP & Enterprise ERP', 'Understanding business process integration, ERP architectures, and role-based access security models.', 'Layers', 2, true),
('Data Analytics', 'Uncovering patterns through Python, SQL, statistical modeling, and actionable business intelligence dashboards.', 'BarChart3', 3, true),
('Full-Stack Web Dev', 'Engineering resilient, accessible web applications with modern frontend frameworks and distributed backends.', 'Code2', 4, true)
ON CONFLICT DO NOTHING;

-- Seed About Content
INSERT INTO public.about_content (
  intro, education, interests, personality, approach, aspirations, beyond_technology, photo_url
)
VALUES (
  'I am Ranvir, a Computer Engineering undergraduate with an insatiable curiosity for how complex systems stay secure, efficient, and user-centric. My focus lies at the intersection of Cybersecurity, Enterprise ERP platforms like SAP, Data Analytics, and Web Engineering.',
  '[
    {
      "degree": "Bachelor of Technology in Computer Engineering",
      "institution": "University Institute of Technology (Placeholder)",
      "period": "2022 — Present (Expected 2026)",
      "details": "Coursework in Data Structures, Database Systems, Computer Networks, Operating Systems, Cryptography, and Software Engineering.",
      "score": "Current GPA: 8.8 / 10.0"
    },
    {
      "degree": "Higher Secondary Certificate (HSC) — Science & Mathematics",
      "institution": "Junior College of Science (Placeholder)",
      "period": "2020 — 2022",
      "details": "Major subjects: Physics, Chemistry, Mathematics, and Computer Science fundamentals."
    }
  ]'::jsonb,
  'Passionate about vulnerability assessment, SAP security authorizations, ETL pipelines, full-stack architectural design, and open-source intelligence.',
  'Analytical and calm under pressure. I value quiet persistence, clear documentation, asking deep questions, and intellectual humility.',
  'I believe software is not just about writing lines of code, but about constructing reliable bridges between human needs and machine precision. I approach problems by first understanding the domain mechanics before jumping to syntax.',
  'To lead engineering teams building mission-critical enterprise systems where safety, security, and data integrity cannot be compromised.',
  'Outside the terminal, I enjoy documentary photography, reading non-fiction essays on technological history, long distance running, and mentoring junior peers in foundational programming.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, category, level, sort_order) VALUES
('Network Security & Wireshark', 'Cybersecurity', 'Working Knowledge', 1),
('Web Application Pentesting (OWASP Top 10)', 'Cybersecurity', 'Working Knowledge', 2),
('Cryptography Fundamentals', 'Cybersecurity', 'Familiar', 3),
('Identity & Access Management (IAM)', 'Cybersecurity', 'Familiar', 4),

('SAP ERP Fundamentals & Architecture', 'SAP / ERP', 'Working Knowledge', 1),
('SAP Security & Authorizations Concept', 'SAP / ERP', 'Working Knowledge', 2),
('Business Process Integration (BPI)', 'SAP / ERP', 'Familiar', 3),

('Python (Pandas, NumPy, Matplotlib)', 'Data Analytics', 'Core Proficient', 1),
('Advanced SQL & Relational Modeling', 'Data Analytics', 'Core Proficient', 2),
('Exploratory Data Analysis (EDA)', 'Data Analytics', 'Working Knowledge', 3),
('Power BI / Tableau Basics', 'Data Analytics', 'Familiar', 4),

('TypeScript & Modern JavaScript', 'Web Development', 'Core Proficient', 1),
('React & Next.js Ecosystem', 'Web Development', 'Core Proficient', 2),
('Tailwind CSS & Responsive UI', 'Web Development', 'Core Proficient', 3),
('Node.js & Express REST APIs', 'Web Development', 'Working Knowledge', 4),
('Supabase & PostgreSQL', 'Web Development', 'Working Knowledge', 5),

('Git & Collaborative GitHub Flow', 'Programming & Tools', 'Core Proficient', 1),
('Linux / Bash CLI', 'Programming & Tools', 'Working Knowledge', 2),
('Docker Container Basics', 'Programming & Tools', 'Familiar', 3),
('Postman API Testing', 'Programming & Tools', 'Working Knowledge', 4)
ON CONFLICT DO NOTHING;

-- Seed Sample Project (Clearly marked placeholder)
INSERT INTO public.projects (
  title, slug, category, summary, cover_image_url,
  problem, why_selected, solution, tech_stack,
  features, screenshots, team, my_contribution,
  challenges, learnings, demo_video_url, github_url, live_url,
  featured, status, sort_order, seo_title, seo_description
)
VALUES (
  'SentinelAudit: Enterprise Role-Based Access Analyzer',
  'sentinelaudit-access-analyzer',
  'Cybersecurity',
  'A compliance simulation engine that audits user-role permissions against segregation-of-duties (SoD) policies to eliminate privilege creep in simulated enterprise environments.',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  'In expanding enterprise organizations and university lab management systems, users frequently accumulate unrevoked permissions across departments. This creates dangerous toxic combinations and segregation-of-duties violations that go unnoticed until security reviews or audits.',
  'I wanted to bridge my interests in SAP role-authorization concepts and web-based security analytics. Studying compliance frameworks inspired me to write an automated rule-verification engine instead of checking permissions manually.',
  'Engineered an automated rule evaluation parser that ingests simulated role matrices in JSON/CSV, constructs a directed permission graph, detects conflicting privilege assignments (e.g. Purchase Order Creator AND Approver), and produces an actionable remediation report with severity scoring.',
  ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Lucide Icons'],
  '- Ingestion engine for multi-tier role matrices\n- Real-time Segregation of Duties (SoD) matrix violation detection\n- Role-overlap score and privilege creep visualization\n- Exportable compliance assessment PDF and CSV reports\n- Role simulation sandbox for prospective promotions',
  '[
    {
      "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "caption": "SentinelAudit Interactive Compliance Dashboard Overview"
    },
    {
      "url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      "caption": "Detailed Conflict Matrix showing high-risk role combinations"
    }
  ]'::jsonb,
  '[
    {"name": "Ranvir", "role": "Lead Architect & Security Logic Designer (Placeholder)"},
    {"name": "College Peer", "role": "Frontend Co-Developer (Placeholder)"}
  ]'::jsonb,
  'Designed the core conflict detection algorithms, modeled the relational database schema in PostgreSQL, and developed the interactive matrix filtering components in React.',
  'Handling circular role-inheritance trees without running into exponential stack exhaustion required implementing a cycle-detection memoization algorithm.',
  'Deepened my understanding of enterprise security principles (least privilege, separation of duties) and taught me how to present dense technical compliance data into clear editorial charts.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://github.com/ranvir-placeholder/sentinelaudit',
  'https://sentinelaudit-demo.placeholder.app',
  true,
  'published',
  1,
  'SentinelAudit Case Study — Ranvir',
  'In-depth engineering case study of SentinelAudit: an enterprise role-based access auditor built by Ranvir.'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Certificate (Clearly marked placeholder)
INSERT INTO public.certificates (
  title, issuer, completion_date, category, skills,
  file_url, file_type, verification_url, in_progress, status
)
VALUES (
  'Google Cybersecurity Professional Certificate (Sample Placeholder)',
  'Coursera / Google Career Certificates',
  '2024-03-15',
  'Cybersecurity',
  ARRAY['SIEM Tools', 'Python Automation', 'Packet Analysis', 'Linux CLI', 'Incident Response'],
  'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80',
  'image',
  'https://coursera.org/verify/SAMPLE_PLACEHOLDER_ID',
  false,
  'published'
),
(
  'SAP Certified Associate — Business Process Integration (In Progress)',
  'SAP SE',
  null,
  'SAP / ERP',
  ARRAY['SAP S/4HANA', 'Enterprise Management', 'Sales & Distribution (SD)', 'Financial Accounting (FI)'],
  null,
  'pdf',
  null,
  true,
  'published'
) ON CONFLICT DO NOTHING;

-- Seed Sample Journey Events
INSERT INTO public.journey_events (
  title, event_date, type, summary, content, cover_image_url, media, tags, featured, status
)
VALUES (
  'Commenced Computer Engineering Degree',
  '2022-08-16',
  'Education',
  'Began undergraduate studies in Computer Engineering, establishing foundational roots in computational logic and programming.',
  'Entering university opened the door to structured computer science: memory architectures, algorithm complexity, and collaborative team sprints. This milestone marked the shift from viewing computers as mere tools to understanding them as layered systems of hardware, operating kernels, and software abstractions.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  ARRAY['University', 'Computer Engineering', 'Freshman Year'],
  true,
  'published'
),
(
  'First 36-Hour Hackathon: Building Under Pressure',
  '2023-09-22',
  'Hackathon',
  'Participated in my first inter-college hackathon, collaborating on a rapid disaster-response resource dispatch tool.',
  'Thirty-six hours of non-stop collaboration, rapid prototyping, and coffee-fueled debugging. Our team designed a lightweight SMS-and-web sync tool for emergency relief squads. While we did not secure the grand trophy, presenting our working prototype to industry judges fundamentally transformed how I manage time and scope software under rigid constraints.',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  ARRAY['Hackathon', 'Teamwork', 'Rapid Prototyping', 'Web Dev'],
  true,
  'published'
),
(
  'Diving into Enterprise SAP & Security Paradigms',
  '2024-02-10',
  'Milestone',
  'Began focused self-study and certified coursework exploring ERP structures and role authorization matrices.',
  'Recognized that large scale enterprises rely on interconnected workflows where security cannot simply be an afterthought. Began analyzing standard SAP authorization objects, user master records, and how corporate compliance frameworks mandate segregation of duties.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  ARRAY['SAP', 'Security', 'Enterprise Systems', 'Self-Learning'],
  false,
  'published'
) ON CONFLICT DO NOTHING;

-- Seed Sample Diary Posts
INSERT INTO public.diary_posts (
  title, slug, category, cover_image_url, excerpt, content, reading_time, published_at, status, is_future_note
)
VALUES (
  'Why Every Engineer Needs to Understand Enterprise Security Early',
  'why-engineers-need-security-early',
  'Technology',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'Reflections on why security should not be treated as a separate department, but as a fundamental mindset integrated into every architectural decision.',
  '### The Illusion of "It Works"

When we first learn to program in university, success is defined almost entirely by functional correctness: does the algorithm return the expected output? Does the page render without errors?

However, in production environments—especially within enterprise platforms handling financial or patient data—"working" is only the first step. A system that works but leaks authentication state or grants redundant write permissions is more dangerous than a system that fails to boot entirely.

```ts
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
```

### What I Learned

1. **Least Privilege is a Design Principle**: Never grant a role broader permissions than its strictest daily task requires.
2. **Audit Trails Matter**: If an action occurs without a verifiable, non-repudiable log, it cannot be validated during an incident response.
3. **Simplicity Drives Resilience**: Complex authorization trees inevitably spawn security blind spots.

As I continue my studies in Computer Engineering and explore SAP authorization concepts, my goal is to keep security at the foundation of everything I build.',
  4,
  NOW() - INTERVAL '14 days',
  'published',
  false
),
(
  'A Note to My Future Self: On Graduating & Keeping the Curiosity Alive',
  'note-to-my-future-self-curiosity',
  'Personal Growth',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  'A personal reflection written during my college journey to remind myself what truly mattered when deadlines felt overwhelming.',
  '### Dear Future Ranvir,

If you are reading this after completing your degree or several years into your engineering career, take a breath.

Remember the late nights at your desk in Mumbai, piecing together your first socket network scripts, wrestling with SQL query plans, and feeling that electric spark of satisfaction when a tricky bug finally surrendered.

### Promises to Keep

- **Never lose the beginner mind**: Technology will pivot, frameworks will change, and enterprise architectures will evolve. The best engineers are not the ones who memorized an API, but those who are never too proud to admit they do not know something and are eager to learn it.
- **Value depth over vanity metrics**: Do not chase empty badges or percentages. Write software that solves real pain points and stands the test of audit scrutiny.
- **Help those who are a few steps behind**: Just as mentors and senior peers took time to explain tricky concepts to you, make sure you pay it forward to the next student entering engineering.

Stay humble, keep building, and stay curious.',
  3,
  NOW() - INTERVAL '30 days',
  'published',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Gallery Items
INSERT INTO public.gallery_items (
  caption, album, category, event_name, event_date, media_url, media_type, sort_order, status
)
VALUES (
  'Late night collaborative session tuning database schemas for our hackathon entry.',
  'Hackathons',
  'Hackathons',
  'Inter-College Innovation Sprint',
  '2023-09-23',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'image',
  1,
  'published'
),
(
  'Keynote session on Cloud Enterprise Architectures & Distributed Data.',
  'Workshops',
  'Workshops',
  'Annual Tech Symposium',
  '2024-01-18',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'image',
  2,
  'published'
),
(
  'Hands-on network analysis lab inspecting TCP packets with Wireshark.',
  'College Memories',
  'College Memories',
  'Computer Networks Laboratory',
  '2023-11-05',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'image',
  3,
  'published'
) ON CONFLICT DO NOTHING;
