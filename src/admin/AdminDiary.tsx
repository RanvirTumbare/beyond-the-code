import React, { useState } from 'react';
import { Plus, BookOpen, Send, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/admin/components/DataTable';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { MarkdownEditor } from '@/admin/components/MarkdownEditor';
import { DraftPublishedToggle } from '@/admin/components/DraftPublishedToggle';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useDiary } from '@/hooks/useDiary';
import { useToast } from '@/contexts/ToastContext';
import { DiaryPost, PublishStatus } from '@/lib/types';

export const AdminDiary: React.FC = () => {
  const { posts, loading, savePost, deletePost } = useDiary(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<PublishStatus>('published');
  const [isFutureNote, setIsFutureNote] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete State
  const [postToDelete, setPostToDelete] = useState<DiaryPost | null>(null);

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
    setCategory('Technology');
    setCoverImageUrl(null);
    setExcerpt('');
    setContent('');
    setPublishedAt(new Date().toISOString().split('T')[0]);
    setStatus('published');
    setIsFutureNote(false);
    setSeoTitle('');
    setSeoDescription('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: DiaryPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setCoverImageUrl(post.cover_image_url);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setPublishedAt(new Date(post.published_at).toISOString().split('T')[0]);
    setStatus(post.status);
    setIsFutureNote(post.is_future_note);
    setSeoTitle(post.seo_title || '');
    setSeoDescription(post.seo_description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toastError('Please fill in title, slug, and markdown content.');
      return;
    }

    setIsSaving(true);
    const payload: Partial<DiaryPost> = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      cover_image_url: coverImageUrl,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      published_at: new Date(publishedAt).toISOString(),
      status,
      is_future_note: isFutureNote,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    const res = await savePost(payload, editingId);
    setIsSaving(false);

    if (res.success) {
      success(editingId ? 'Diary entry updated.' : 'New diary entry published.');
      setIsModalOpen(false);
      resetForm();
    } else {
      toastError(res.error || 'Failed to save diary post.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    const res = await deletePost(postToDelete.id);
    if (res.success) {
      success('Diary entry removed.');
    } else {
      toastError('Failed to delete post.');
    }
    setPostToDelete(null);
  };

  const columns: Column<DiaryPost>[] = [
    {
      header: 'Entry Title',
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#202520]">{row.title}</span>
            {row.is_future_note && (
              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-semibold border border-amber-200 flex items-center gap-0.5">
                <Send className="w-2.5 h-2.5" /> Future Self
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
      header: 'Published',
      accessor: (row) => (
        <span className="font-mono text-xs">
          {new Date(row.published_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Reading Time',
      accessor: (row) => (
        <span className="text-xs text-[#777F79]">{row.reading_time} min</span>
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
            Editorial Journal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Articles & Digital Diary
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Author and publish technical articles, reflections, learning logs, and letters to your future self.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Article
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={posts}
        columns={columns}
        searchPlaceholder="Search articles..."
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={(p) => setPostToDelete(p)}
        onCreateNew={handleOpenCreate}
        createLabel="New Article"
      />

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Article' : 'Compose New Article'}
        subtitle="Write Markdown content with live preview, set tags, and manage publication."
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <DraftPublishedToggle status={status} onChange={setStatus} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Article Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Why Every Engineer Needs to Understand Enterprise Security Early"
              required
            />
            <Input
              label="URL Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="why-engineers-need-security-early"
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
                <option value="Technology">Technology</option>
                <option value="Learning Logs">Learning Logs</option>
                <option value="College Life">College Life</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Experiences">Experiences</option>
              </select>
            </div>

            <Input
              label="Publication Date"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
            />

            <label className="flex items-center gap-2 p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer self-end">
              <input
                type="checkbox"
                checked={isFutureNote}
                onChange={(e) => setIsFutureNote(e.target.checked)}
                className="w-4 h-4 accent-[#43866A]"
              />
              <span className="text-xs font-medium text-[#202520]">
                "Note to My Future Self"
              </span>
            </label>
          </div>

          <Textarea
            label="Brief Excerpt / Standfirst"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="A compelling 1-2 sentence lead paragraph shown on the card and article intro."
            required
          />

          <ImageUploader
            label="Cover Image (Optional)"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            folder="diary"
            aspectRatio="wide"
          />

          <MarkdownEditor
            label="Full Markdown Essay"
            value={content}
            onChange={setContent}
            rows={12}
            placeholder="Write your long-form reflections in Markdown..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E8ECE9]">
            <Input
              label="Custom SEO Title (Optional)"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Title for search engines and social cards"
            />
            <Input
              label="Custom SEO Description (Optional)"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Short summary for search results"
            />
          </div>

          <div className="sticky -bottom-5 sm:-bottom-6 bg-white pt-3 pb-3 -mx-5 sm:-mx-6 px-5 sm:px-6 border-t border-[#E8ECE9] flex justify-end gap-2 mt-4 z-10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Article
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diary Entry"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

