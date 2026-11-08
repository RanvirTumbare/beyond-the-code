# Beyond the Code — Administrator Guide

A step-by-step practical guide for Ranvir to curate, author, and manage content on **Beyond the Code** using the custom Editorial CMS Dashboard without touching code.

---

## 1. Accessing the Dashboard

1. Navigate to `/login` or click the subtle **Login** link in the top-right corner of the navigation bar.
2. Enter your administrator email and password created in Supabase Auth.
3. Upon authentication, you will be redirected to `/admin` (Overview Studio).
4. When logged in, the public navigation bar automatically updates the "Login" button to an accented **Dashboard** pill.

---

## 2. Publishing a New Diary Entry

1. Go to **Diary** in the sidebar (`/admin/diary`).
2. Click **New Diary Entry**.
3. Fill in the details:
   - **Title**: Enter your essay or reflection title. The URL slug is auto-generated (e.g. `exploring-sap-security-authorizations`).
   - **Category**: Select from *Technology, Learning Logs, College Life, Hackathons, Personal Growth,* or *Experiences*.
   - **Publication Date**: Select today's date or backdate to match when the reflection occurred.
   - **"Note to My Future Self"**: Check this box if this article is an epistle or letter to your future self. It will automatically be featured in the prominent *A Note to My Future Self* section on `/diary`.
   - **Excerpt**: Write a 1-2 sentence lead paragraph that introduces the reflection.
   - **Cover Image**: Upload a high-resolution photo or select an existing asset from the Media Library.
   - **Full Markdown Essay**: Use the tabbed Markdown editor. You can format with bold, italic, H2/H3 headings, code blocks (` ```ts `), blockquotes (`>`), and bulleted lists. Toggle the **Preview** tab anytime to inspect the typography.
   - **Publication Status**: Switch between **Draft** (private, hidden from public) and **Published**.
4. Click **Save Diary Entry**. The post will appear immediately on `/diary` and your homepage.

---

## 3. Adding a New Project Case Study

1. Go to **Projects** in the sidebar (`/admin/projects`).
2. Click **New Case Study**.
3. Use the tabbed editor:
   - **Tab 1: Basics & Metadata**: Title, slug, category (*Cybersecurity, Web Development, Data Analytics, SAP / ERP, IoT, Other*), sort order, executive summary, tech stack tags (comma-separated, e.g. `TypeScript, React, PostgreSQL, Docker`), and homepage featured flag.
   - **Tab 2: Technical Story & Architecture**:
     - *The Problem & Context*: Describe the real-world vulnerability or manual challenge.
     - *Why Selected*: Why you tackled this specific architecture.
     - *Engineered Solution*: The design choices, data flow, algorithms, and security policies.
     - *Key Features*: Bulleted list of functionality (one per line).
     - *Obstacles Overcome & Key Learnings*: Post-mortem insights into tricky edge cases.
     - *My Contribution*: Exactly what parts of the software you architected and wrote.
   - **Tab 3: Media & Screenshots**:
     - Upload the main cover banner.
     - Enter an optional YouTube or Vimeo demo link.
     - Click **Add Screenshot** to attach multiple screenshots with descriptive captions for the interactive lightbox gallery.
   - **Tab 4: External Links & SEO**:
     - GitHub repository link.
     - Live application URL.
     - Custom SEO title and description for search engines.
4. Click **Save Case Study**. The comprehensive study will be live at `/projects/:slug`.

---

## 4. Documenting a Certificate or In-Progress Course

1. Go to **Certificates** in the sidebar (`/admin/certificates`).
2. Click **Add Certificate**.
3. Fill in:
   - **Title**: Official certification name (e.g. *Google Cybersecurity Professional Certificate*).
   - **Issuing Organization**: Issuer (e.g. *Google / Coursera, SAP SE*).
   - **Category**: Select the domain category.
   - **Validated Skills**: List specific tools and skills acquired (e.g. *SIEM, Wireshark, Linux CLI*).
   - **Document File**: Upload the image or PDF certificate. The system auto-detects the format and provides an embedded viewer or high-res image modal.
   - **Online Verification URL**: Direct URL to Credly, Coursera, or issuer verification portal.
   - **"Course In Progress"**: Check this if you are actively studying this track. The completion date will be hidden, and the credential will be tagged with a clean *In progress* pill without fake completion percentages.
4. Click **Save Certificate**.

---

## 5. Curating the Visual Gallery

1. Go to **Gallery** in the sidebar (`/admin/gallery`).
2. Click **Bulk Upload Photos** to pick multiple event photos directly from your computer.
3. Uploaded photos are automatically resized to max 1920px client-side to ensure blistering fast load times.
4. Click the **Edit** icon on any photo card to assign an Event Name, Event Date, Category, and descriptive Caption.

---

## 6. Reviewing Contact Inquiries

1. Go to **Messages** in the sidebar (`/admin/messages`).
2. Unread messages are marked with a green indicator.
3. Click any message row to read the full inquiry in a clean modal dialog.
4. Click **Reply via Email** to open your default mail client with the subject line pre-filled.
5. Use the trash icon to permanently remove resolved messages.

---

## 7. Replacing Your Resume PDF & Social Links

1. Go to **Resume & Profile** in the sidebar (`/admin/profile`).
2. Click **Upload PDF** or **Replace PDF** to upload your latest curriculum vitae.
3. Update your LinkedIn, GitHub, or add profile links to Kaggle, LeetCode, or personal blogs.
4. Click **Save Profile & Resume**. The "Download Resume" buttons across the public website will immediately distribute the new document.
