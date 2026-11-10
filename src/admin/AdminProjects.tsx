import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  ExternalLink,
  Github,
  Clock,
  CheckCircle2,
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
import { Project, PublishStatus } from '@/lib/types';

export const AdminProjects: React.FC = () => {
  const { projects, loading, saveProject, deleteProject } = useProjects(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Cybersecurity');
  const [summary, setSummary] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [features, setFeatures] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>('published');

  // Delete State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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
    setTitle('');
    setSlug('');
    setCategory('Cybersecurity');
    setSummary('');
    setTechStackInput('');
    setCoverImageUrl(null);
    setProblem('');
    setSolution('');
    setFeatures('');
    setGithubUrl('');
    setLiveUrl('');
    setInProgress(false);
    setFeatured(false);
    setStatus('published');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setCategory(project.category);
    setSummary(project.summary);
    setTechStackInput(project.tech_stack ? project.tech_stack.join(', ') : '');
    setCoverImageUrl(project.cover_image_url || null);
    setProblem(project.problem || '');
    setSolution(project.solution || '');
    setFeatures(project.features || '');
    setGithubUrl(project.github_url || '');
    setLiveUrl(project.live_url || '');
    setInProgress(Boolean(project.in_progress));
    setFeatured(Boolean(project.featured));
    setStatus(project.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      toastError('Please fill in title and summary.');
      return;
    }

    setIsSaving(true);
    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<Project> = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      summary: summary.trim(),
      tech_stack: techStack,
      cover_image_url: coverImageUrl,
      problem: problem.trim(),
      solution: solution.trim(),
      features: features.trim(),
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      in_progress: inProgress,
      featured,
      status,
      screenshots: [],
      team: [],
      why_selected: '',
      my_contribution: '',
      challenges: '',
      learnings: '',
      demo_video_url: null,
      seo_title: `${title.trim()} — Ranvir`,
      seo_description: summary.trim(),
    };

    const res = await saveProject(payload, editingId);
    setIsSaving(false);

    if (res.success) {
      success(editingId ? 'Project updated.' : 'Project created.');
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
      success('Project deleted.');
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
      header: 'Phase',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            row.in_progress
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {row.in_progress ? (
            <>
              <Clock className="w-3 h-3" /> Ongoing
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3" /> Completed
            </>
          )}
        </span>
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
          {row.tech_stack?.slice(0, 3).join(', ')}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Portfolio Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Manage completed and ongoing engineering projects.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={projects}
        columns={columns}
        searchPlaceholder="Search projects..."
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={(p) => setProjectToDelete(p)}
        onCreateNew={handleOpenCreate}
        createLabel="New Project"
      />

      {/* Minimal, Compact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project' : 'New Project'}
        subtitle="Fill in project details below."
        maxWidth="2xl"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="project-modal-form"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Save Project
            </Button>
          </>
        }
      >
        <form id="project-modal-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Phase & Status Settings */}
          <div className="p-3 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial flex flex-wrap items-center justify-between gap-3">
            <DraftPublishedToggle status={status} onChange={setStatus} />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#202520] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inProgress}
                  onChange={(e) => setInProgress(e.target.checked)}
                  className="w-4 h-4 accent-[#43866A]"
                />
                <span>Ongoing (In Progress)</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-medium text-[#202520] cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#43866A]"
                />
                <span>Featured</span>
              </label>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <Input
                label="Project Title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="SentinelAudit: Role Access Analyzer"
                required
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-[#202520] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-xs px-3 py-2 border border-[#E8ECE9] rounded-editorial focus:outline-none focus:ring-1 focus:ring-[#43866A]"
              >
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web Development">Web Development</option>
                <option value="SAP / ERP">SAP / ERP</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Slug */}
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="sentinelaudit-analyzer"
            required
          />

          {/* Summary */}
          <Textarea
            label="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A concise 2-sentence summary of the project."
            rows={2}
            required
          />

          {/* Tech Stack */}
          <Input
            label="Tech Stack (Comma-separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="TypeScript, React, PostgreSQL, Docker"
          />

          {/* Cover Image */}
          <ImageUploader
            label="Cover Image"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            aspectRatio="video"
            folder="projects"
          />

          {/* Case Study Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="Problem & Context (Optional)"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="What problem does this project solve?"
              rows={3}
            />
            <Textarea
              label="Engineered Solution (Optional)"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="How was it implemented?"
              rows={3}
            />
          </div>

          <Textarea
            label="Key Features (Optional, one per line)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="- Real-time audit checks&#10;- Graph topology export"
            rows={2}
          />

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="GitHub Repository URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
            <Input
              label="Live Application URL"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://app.example.com"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
