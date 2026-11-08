import React, { useState } from 'react';
import { Plus, Milestone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/admin/components/DataTable';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { MarkdownEditor } from '@/admin/components/MarkdownEditor';
import { DraftPublishedToggle } from '@/admin/components/DraftPublishedToggle';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useJourney } from '@/hooks/useJourney';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/contexts/ToastContext';
import { JourneyEvent, JourneyEventType, PublishStatus } from '@/lib/types';

export const AdminJourney: React.FC = () => {
  const { events, loading, saveEvent, deleteEvent } = useJourney(true);
  const { projects } = useProjects(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<JourneyEventType>('Milestone');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>('published');
  const [projectId, setProjectId] = useState<string>('');

  // Delete Confirmation
  const [eventToDelete, setEventToDelete] = useState<JourneyEvent | null>(null);

  const resetForm = () => {
    setEditingId(undefined);
    setTitle('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setType('Milestone');
    setSummary('');
    setContent('');
    setCoverImageUrl(null);
    setTagsInput('');
    setFeatured(false);
    setStatus('published');
    setProjectId('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: JourneyEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setEventDate(event.event_date);
    setType(event.type);
    setSummary(event.summary);
    setContent(event.content);
    setCoverImageUrl(event.cover_image_url);
    setTagsInput(event.tags.join(', '));
    setFeatured(event.featured);
    setStatus(event.status);
    setProjectId(event.project_id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      toastError('Please fill in both the title and summary.');
      return;
    }

    setIsSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<JourneyEvent> = {
      title: title.trim(),
      event_date: eventDate,
      type,
      summary: summary.trim(),
      content: content.trim(),
      cover_image_url: coverImageUrl,
      tags,
      featured,
      status,
      project_id: projectId ? projectId : null,
    };

    const res = await saveEvent(payload, editingId);
    setIsSaving(false);

    if (res.success) {
      success(editingId ? 'Journey event updated.' : 'New journey event created.');
      setIsModalOpen(false);
      resetForm();
    } else {
      toastError(res.error || 'Failed to save event.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    const res = await deleteEvent(eventToDelete.id);
    if (res.success) {
      success('Journey event deleted.');
    } else {
      toastError('Failed to delete event.');
    }
    setEventToDelete(null);
  };

  const columns: Column<JourneyEvent>[] = [
    {
      header: 'Title & Summary',
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
          <p className="text-xs text-[#777F79] line-clamp-1">{row.summary}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: (row) => (
        <span className="font-mono text-xs">{row.event_date}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
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
            Chronicle CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Journey Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Document milestones, hackathons, workshops, and achievements chronologically.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Milestone
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={events}
        columns={columns}
        searchPlaceholder="Search milestones..."
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={(item) => setEventToDelete(item)}
        onCreateNew={handleOpenCreate}
        createLabel="Add Milestone"
      />

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Journey Milestone' : 'Add New Milestone'}
        subtitle="Provide the narrative, date, category tags, and optional project links."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <DraftPublishedToggle status={status} onChange={setStatus} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Milestone Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First 36-Hour Hackathon"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                Event Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JourneyEventType)}
                className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
              >
                <option value="Education">Education</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Achievement">Achievement</option>
                <option value="Workshop">Workshop</option>
                <option value="Event">Event</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />

            <Input
              label="Tags (Comma-separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Hackathon, Teamwork, Web Dev"
            />
          </div>

          <Textarea
            label="Brief Summary (Timeline Card)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            placeholder="A short 1-2 sentence overview shown directly on the timeline card."
            required
          />

          <ImageUploader
            label="Cover / Event Photo"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            folder="journey"
            aspectRatio="wide"
          />

          <MarkdownEditor
            label="Full Markdown Story (Modal Detail View)"
            value={content}
            onChange={setContent}
            rows={8}
            placeholder="Write the detailed reflection, learnings, challenges, and context..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                Link to Associated Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
              >
                <option value="">None (Independent milestone)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer self-end">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#43866A]"
              />
              <span className="text-xs font-medium text-[#202520]">
                Mark as Featured (Green timeline marker)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8ECE9]">
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
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Save Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Milestone"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
};
