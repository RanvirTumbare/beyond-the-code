# Beyond the Code

> A personal portfolio and digital diary for Ranvir, a Computer Engineering student specializing in **Cybersecurity**, **SAP/ERP**, **Data Analytics**, and **Web Engineering**.

Designed with an editorial, magazine-like restraint: generous whitespace, high-contrast serif typography (*Playfair Display* headings, *Inter* body), muted botanical green accents (`#43866A`), and subtle 400ms scroll transitions.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 18 with TypeScript, Vite
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Routing**: React Router v6 with lazy-loaded route splitting and scroll restoration
- **Animation**: Framer Motion (restrained fade-ups respecting `prefers-reduced-motion`)
- **Icons**: Lucide React
- **Markdown & Typography**: `react-markdown`, `remark-gfm`
- **SEO & Social Sharing**: `react-helmet-async`, Open Graph tags, `sitemap.xml`, `robots.txt`
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Storage)
- **Deployment**: Vercel SPA-ready (`vercel.json` rewrites)

---

## 📂 Project Architecture

```
d:/port fil stie/
├── public/
│   ├── favicon.svg              # Minimalist editorial monogram
│   ├── robots.txt               # SEO indexing directives
│   └── sitemap.xml              # Search engine XML sitemap
├── src/
│   ├── admin/                   # Full-featured Editorial CMS Studio
│   │   ├── components/          # Reusable admin UI (DataTable, ImageUploader, ConfirmDialog, etc.)
│   │   ├── AdminLayout.tsx      # Collapsible responsive admin shell
│   │   ├── AdminOverview.tsx    # Live statistics & quick actions
│   │   ├── AdminHomepage.tsx    # Hero, focus status & section visibility
│   │   ├── AdminAbout.tsx       # Bio, education timeline & skills CRUD
│   │   ├── AdminJourney.tsx     # Chronological milestones & hackathons
│   │   ├── AdminProjects.tsx    # Deep-dive case studies & screenshots
│   │   ├── AdminCertificates.tsx# Verified & in-progress credentials
│   │   ├── AdminDiary.tsx       # Markdown essays & future-self epistles
│   │   ├── AdminGallery.tsx     # Bulk photo upload & event captions
│   │   ├── AdminMessages.tsx    # Contact inquiries inbox
│   │   ├── AdminProfile.tsx     # Resume PDF & social links
│   │   └── AdminSettings.tsx    # Dynamic accent color, SEO & brand
│   ├── components/
│   │   ├── auth/                # ProtectedRoute guard
│   │   ├── layout/              # Navbar, Footer, PageTransition, ScrollToTop
│   │   └── ui/                  # Button, Card, Section, Badge, Input, Modal, etc.
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Supabase Auth + admin verification
│   │   └── ToastContext.tsx     # Toast notifications provider
│   ├── hooks/                   # Typed hooks for each Supabase table
│   ├── lib/
│   │   ├── mockData.ts          # High-fidelity fallback dataset
│   │   ├── storage.ts           # Client-side 1920px image resize & storage upload
│   │   ├── supabase.ts          # Supabase client instantiation
│   │   └── types.ts             # Complete TypeScript data model
│   ├── pages/                   # Public-facing editorial pages
│   │   ├── Home.tsx             # Hero, explore cards, featured studies, reflections
│   │   ├── About.tsx            # Philosophy, education timeline, skills
│   │   ├── Journey.tsx          # Vertical milestone timeline & detail modal
│   │   ├── Projects.tsx         # Filterable engineering case studies
│   │   ├── ProjectDetail.tsx    # In-depth case study with side-index & gallery
│   │   ├── Certificates.tsx     # Completed vs in-progress credentials
│   │   ├── Diary.tsx            # Field notes & letters to future self
│   │   ├── DiaryDetail.tsx      # ~700px reading column with progress bar
│   │   ├── Gallery.tsx          # Responsive masonry grid with lightbox
│   │   ├── Contact.tsx          # Honeypot-protected inquiry form
│   │   ├── Login.tsx            # Private admin authentication card
│   │   ├── ResetPassword.tsx    # Supabase password recovery handler
│   │   └── NotFound.tsx         # Editorial 404 screen
│   ├── App.tsx                  # Lazy route routing setup
│   ├── index.css                # Tailwind directives & CSS variables
│   └── main.tsx                 # Root bootstrapping
├── supabase/
│   └── migrations/
│       └── 20250101000000_beyond_the_code_schema.sql  # Complete SQL migration
├── vercel.json                  # SPA routing rules for Vercel
├── .env.example                 # Environment variable templates
└── ADMIN_GUIDE.md               # Owner guide for content curation
```

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "beyond-the-code"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If you leave these empty or as placeholders, the application automatically runs in local development mode using the pre-seeded mock dataset so you can inspect all pages and test the admin dashboard immediately.)*

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```
Verify the production build artifacts generated in `dist/`.

---

## 🔒 Security & Row Level Security (RLS)

Security is strictly enforced in the database layer:
1. **Public Anonymous Access**:
   - `SELECT` access is restricted to rows where `status = 'published'` and `visible = true`. Private drafts are blocked at the database query level.
   - `INSERT` is only permitted on `contact_messages` with strict string length constraints (`char_length(name) <= 100`, `char_length(email) <= 150`, `char_length(message) <= 4000`).
2. **Administrator Access**:
   - Only accounts whose `auth.uid()` exists in the `admin_users` table can run `INSERT`, `UPDATE`, or `DELETE` on content tables, or upload to the `media` storage bucket.
   - Evaluated using PostgreSQL security definer function `public.is_admin()`.

---

## 📄 License
Designed and maintained by Ranvir for **Beyond the Code**. All rights reserved.

