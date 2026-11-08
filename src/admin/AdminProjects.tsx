import React, { useState } from 'react';
import {
  Plus,
  Briefcase,
  Sparkles,
  ExternalLink,
  Github,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/admin/components/DataTable';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { DraftPublishedToggle } from '@/admin/components/DraftPublishedToggle';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/contexts/ToastContext';
import { Project, ProjectScreenshot, ProjectTeamMember, PublishStatus } from '@/lib/types';

export const AdminProjects: React.FC = () => {
  const { projects, loading, saveProject, deleteProject } = useProjects(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'basics' | 'story' | 'media' | 'links'>('basics');
  const [isSaving, setIsSaving] = useState(false);

  // Tab 1: Basics
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Cybersecurity');
  const [summary, setSummary] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>('published');

  // Tab 2: Story
  const [problem, setProblem] = useState('');
  const [whySelected, setWhySelected] = useState('');
  const [solution, setSolution] = useState('');
  const [features, setFeatures] = useState('');
  const [myContribution, setMyContribution] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learnings, setLearnings] = useState('');
  const [team, setTeam] = useState<ProjectTeamMember[]>([]);

  // Tab 3: Media & Screenshots
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([]);

  // Tab 4: Links & SEO
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Auto slug generator helper
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const resetForm = () => {
    setEditingId(undefined);
    setActiveTab('basics');
    setTitle('');
    setSlug('');
    setCategory('Cybersecurity');
    setSummary('');
    setTechStackInput('');
    setSortOrder(projects.length + 1);
    setFeatured(false);
    setStatus('published');
    setProblem('');
    setWhySelected('');
    setSolution('');
    setFeatures('');
    setMyContribution('');
    setChallenges('');
    setLearnings('');
    setTeam([]);
    setCoverImageUrl(null);
    setDemoVideoUrl('');
    setScreenshots([]);
    setGithubUrl('');
    setLiveUrl('');
    setSeoTitle('');
    setSeoDescription('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingId(p.id);
    setActiveTab('basics');
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setSummary(p.summary);
    setTechStackInput(p.tech_stack.join(', '));
    setSortOrder(p.sort_order);
    setFeatured(p.featured);
    setStatus(p.status);
    setProblem(p.problem);
    setWhySelected(p.why_selected);
    setSolution(p.solution);
    setFeatures(p.features);
    setMyContribution(p.my_contribution);
    setChallenges(p.challenges);
    setLearnings(p.learnings);
    setTeam(p.team || []);
    setCoverImageUrl(p.cover_image_url);
    setDemoVideoUrl(p.demo_video_url || '');
    setScreenshots(p.screenshots || []);
    setGithubUrl(p.github_url || '');
    setLiveUrl(p.live_url || '');
    setSeoTitle(p.seo_title || '');
    setSeoDescription(p.seo_description || '');
    setIsModalOpen(true);
  };

  // Screenshots management
  const handleAddScreenshot = () => {
    setScreenshots([
      ...screenshots,
      { url: '', caption: '', sort_order: screenshots.length + 1 },
    ]);
  };

  const handleRemoveScreenshot = (idx: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx));
  };

  const handleScreenshotChange = (idx: number, key: keyof ProjectScreenshot, val: string) => {
    setScreenshots(
      screenshots.map((item, i) => (i === idx ? { ...item, [key]: val } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !summary.trim()) {
      toastError('Please fill in title, slug, and summary.');
      return;
    }

    setIsSaving(true);
    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<Project> = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      summary: summary.trim(),
      tech_stack: techStack,
      sort_order: Number(sortOrder) || 1,
      featured,
      status,
      problem: problem.trim(),
      why_selected: whySelected.trim(),
      solution: solution.trim(),
      features: features.trim(),
      my_contribution: myContribution.trim(),
      challenges: challenges.trim(),
      learnings: learnings.trim(),
      team,
      cover_image_url: coverImageUrl,
      demo_video_url: demoVideoUrl.trim() || null,
      screenshots: screenshots.filter((s) => Boolean(s.url)),
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    const res = await saveProject(payload, editingId);
    setIsSaving(false);

    if (res.success) {
      success(editingId ? 'Project case study updated.' : 'New project case study published.');
      setIsModalOpen(false);
      resetForm();
    } else {
      toastError(res.error || 'Failed to save project.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    const res = await deleteProject(projectToDelete.id);
    if (res.success) {
      success('Project case study deleted.');
    } else {
      toastError('Failed to delete project.');
    }
    setProjectToDelete(null);
  };

  const columns: Column<Project>[] = [
    {
      header: 'Project Title',
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#202520]">{row.title}</span>
            {row.featured && (
              <span className="text-[10px] bg-[#EBF3EF] text-[#43866A] px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
          <span className="text-xs text-[#777F79] font-mono">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Tech Stack',
      accessor: (row) => (
        <span className="text-xs text-[#585F5A] line-clamp-1">
          {row.tech_stack.slice(0, 3).join(', ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Portfolio Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Project Studies
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Author and manage deep-dive engineering case studies and technical solutions.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Case Study
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={projects}
        columns={columns}
        searchPlaceholder="Search case studies..."
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={(p) => setProjectToDelete(p)}
        onCreateNew={handleOpenCreate}
        createLabel="New Case Study"
      />

      {/* Tabbed Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project Study' : 'Create Project Case Study'}
        subtitle="Provide project details across Basics, Story, Media, and Links."
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#E8ECE9] gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('basics')}
              className={`pb-2.5 transition-colors ${
                activeTab === 'basics'
                  ? 'border-b-2 border-[#43866A] text-[#43866A] font-semibold'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              1. Basics & Metadata
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`pb-2.5 transition-colors ${
                activeTab === 'story'
                  ? 'border-b-2 border-[#43866A] text-[#43866A] font-semibold'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              2. Technical Story & Architecture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`pb-2.5 transition-colors ${
                activeTab === 'media'
                  ? 'border-b-2 border-[#43866A] text-[#43866A] font-semibold'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              3. Media & Screenshots
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`pb-2.5 transition-colors ${
                activeTab === 'links'
                  ? 'border-b-2 border-[#43866A] text-[#43866A] font-semibold'
                  : 'text-[#777F79] hover:text-[#202520]'
              }`}
            >
              4. External Links & SEO
            </button>
          </div>

          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-fade-in">
              <DraftPublishedToggle status={status} onChange={setStatus} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Project Title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. SentinelAudit: Enterprise SoD Analyzer"
                  required
                />
                <Input
                  label="URL Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sentinelaudit-analyzer"
                  helperText="Unique URL identifier for this case study."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="SAP / ERP">SAP / ERP</option>
                    <option value="IoT">IoT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input
                  label="Sort Order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />

                <label className="flex items-center gap-2 p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer self-end">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#43866A]"
                  />
                  <span className="text-xs font-medium text-[#202520]">
                    Featured on Homepage
                  </span>
                </label>
              </div>

              <Textarea
                label="Executive Summary (Card & Header)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="A concise 2-3 sentence overview of the project's purpose and impact."
                required
              />

              <Input
                label="Tech Stack (Comma-separated)"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="TypeScript, React, PostgreSQL, Tailwind CSS, Docker"
                helperText="Separate tools and libraries with commas."
              />
            </div>
          )}

          {/* TAB 2: STORY */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-fade-in">
              <Textarea
                label="The Problem & Context"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                placeholder="What real-world pain point or security vulnerability prompted this solution?"
              />

              <Textarea
                label="Why I Selected This Project"
                value={whySelected}
                onChange={(e) => setWhySelected(e.target.value)}
                rows={3}
                placeholder="What personal curiosity or curriculum goal inspired you to undertake this?"
              />

              <Textarea
                label="Engineered Solution & Architecture"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={4}
                placeholder="Describe the architectural patterns, database schemas, and algorithms implemented."
              />

              <Textarea
                label="Key Features & Capabilities (One per line)"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={4}
                placeholder="- Ingestion engine for role matrices&#10;- Real-time Segregation of Duties detection&#10;- Exportable compliance reports"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Engineering Challenges Overcome"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  rows={3}
                  placeholder="What unexpected roadblocks or algorithmic limits were addressed?"
                />

                <Textarea
                  label="Key Learnings & Takeaways"
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  rows={3}
                  placeholder="What insights did this provide into enterprise security and production software?"
                />
              </div>

              <Textarea
                label="My Specific Contribution"
                value={myContribution}
                onChange={(e) => setMyContribution(e.target.value)}
                rows={2}
                placeholder="Detail your personal role in design, coding, testing, or deployment."
              />
            </div>
          )}

          {/* TAB 3: MEDIA & SCREENSHOTS */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUploader
                  label="Project Cover Image"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  folder="projects"
                  aspectRatio="video"
                />

                <div className="space-y-4">
                  <Input
                    label="Demo Video URL (YouTube or Vimeo)"
                    value={demoVideoUrl}
                    onChange={(e) => setDemoVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    helperText="Embeds directly into the case study page."
                  />
                </div>
              </div>

              {/* Multi-Screenshot Manager */}
              <div className="space-y-3 pt-4 border-t border-[#E8ECE9]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
                      Project Screenshots & UI Captions
                    </h3>
                    <p className="text-[11px] text-[#777F79]">
                      Add screenshots that illustrate key workflows. Lightbox modal enabled.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddScreenshot}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Screenshot
                  </Button>
                </div>

                <div className="space-y-3">
                  {screenshots.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-[#777F79] w-6">
                        #{idx + 1}
                      </span>
                      <div className="flex-1 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Image URL or upload asset..."
                          value={s.url}
                          onChange={(e) => handleScreenshotChange(idx, 'url', e.target.value)}
                          className="w-full bg-white text-xs p-2 border border-[#E8ECE9] rounded"
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Caption describing interface..."
                          value={s.caption || ''}
                          onChange={(e) =>
                            handleScreenshotChange(idx, 'caption', e.target.value)
                          }
                          className="w-full bg-white text-xs p-2 border border-[#E8ECE9] rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="text-rose-600 p-1.5 hover:bg-rose-50 rounded"
                        title="Remove screenshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {screenshots.length === 0 && (
                    <p className="text-xs text-[#9CA39E] italic py-3 text-center">
                      No screenshots attached. Click "Add Screenshot" to include UI views.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LINKS & SEO */}
          {activeTab === 'links' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Repository URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />

                <Input
                  label="Live Application Demo URL"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://app.example.com"
                />
              </div>

              <div className="pt-4 border-t border-[#E8ECE9] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
                  SEO & Social Sharing Overrides
                </h3>

                <Input
                  label="Custom SEO Title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SentinelAudit Case Study — Ranvir"
                />

                <Textarea
                  label="Custom Meta Description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder="In-depth engineering study of SentinelAudit: an enterprise role-based access auditor..."
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-[#E8ECE9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {activeTab !== 'links' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === 'basics') setActiveTab('story');
                    else if (activeTab === 'story') setActiveTab('media');
                    else if (activeTab === 'media') setActiveTab('links');
                  }}
                >
                  Next Tab
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Case Study
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project Study"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? All case study data and screenshots will be permanently removed.`}
      />
    </div>
  );
};
