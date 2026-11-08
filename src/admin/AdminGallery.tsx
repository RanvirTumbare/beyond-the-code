import React, { useState } from 'react';
import {
  UploadCloud,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useGallery } from '@/hooks/useGallery';
import { useToast } from '@/contexts/ToastContext';
import { uploadMediaFile } from '@/lib/storage';
import { GalleryItem, PublishStatus } from '@/lib/types';

export const AdminGallery: React.FC = () => {
  const { items, loading, saveItem, deleteItem } = useGallery(true);
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk Upload State
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // Bulk Upload Handler
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingBulk(true);
    setBulkProgress(0);
    const total = files.length;
    let completed = 0;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      try {
        const res = await uploadMediaFile(file, 'gallery');
        if (res.url) {
          await saveItem({
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
            album: 'General',
            category: 'Technical Events',
            event_name: 'Campus Event',
            event_date: new Date().toISOString().split('T')[0],
            media_url: res.url,
            media_type: 'image',
            sort_order: items.length + i + 1,
            status: 'published',
          });
        }
      } catch (err) {
        console.warn('Failed to upload file:', file.name, err);
      }
      completed++;
      setBulkProgress(Math.round((completed / total) * 100));
    }

    setIsUploadingBulk(false);
    success(`Successfully processed and uploaded ${completed} media assets.`);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    const res = await saveItem(editingItem, editingItem.id);
    setIsSaving(false);

    if (res.success) {
      success('Gallery item updated.');
      setIsModalOpen(false);
      setEditingItem(null);
    } else {
      toastError(res.error || 'Failed to update item.');
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    const newStatus: PublishStatus = item.status === 'published' ? 'draft' : 'published';
    const res = await saveItem({ status: newStatus }, item.id);
    if (res.success) {
      success(`Item marked as ${newStatus}.`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const res = await deleteItem(itemToDelete.id);
    if (res.success) {
      success('Gallery moment removed.');
    } else {
      toastError('Failed to delete item.');
    }
    setItemToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
            Media Archive
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Visual Gallery & Moments
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Upload photographs and videos from hackathons, workshops, and engineering milestones.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#202520] hover:bg-black px-4 py-2 rounded-editorial transition-colors shadow-xs">
          <UploadCloud className="w-4 h-4" />
          <span>Bulk Upload Photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleBulkUpload}
            disabled={isUploadingBulk}
          />
        </label>
      </div>

      {/* Upload Progress Bar */}
      {isUploadingBulk && (
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#202520]">
            <span className="font-semibold flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#43866A]" />
              Processing & Uploading Files...
            </span>
            <span className="font-mono">{bulkProgress}%</span>
          </div>
          <div className="w-full bg-[#E8ECE9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#43866A] h-full transition-all duration-200"
              style={{ width: `${bulkProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group bg-white border rounded-editorial overflow-hidden shadow-subtle flex flex-col justify-between transition-all ${
              item.status === 'published' ? 'border-[#E8ECE9]' : 'border-dashed border-amber-300 opacity-70'
            }`}
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] overflow-hidden bg-black/5 relative">
              <img
                src={item.media_url}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="text-[10px] bg-white/90 backdrop-blur-xs text-[#202520] px-1.5 py-0.5 rounded font-medium shadow-xs">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-3 space-y-2">
              <p className="text-xs font-semibold text-[#202520] line-clamp-1">
                {item.event_name || item.caption}
              </p>
              <p className="text-[11px] text-[#777F79] line-clamp-1">{item.caption}</p>

              <div className="pt-2 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  title={item.status === 'published' ? 'Hide item' : 'Publish item'}
                  className="p-1 rounded text-[#585F5A] hover:bg-[#F7F8F7]"
                >
                  {item.status === 'published' ? (
                    <Eye className="w-3.5 h-3.5 text-[#43866A]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Item Details"
                    className="p-1 text-[#585F5A] hover:text-[#43866A] rounded hover:bg-[#EBF3EF]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    title="Delete Item"
                    className="p-1 text-[#585F5A] hover:text-rose-600 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Gallery Asset"
        subtitle="Update captions, event context, and categorization."
        maxWidth="lg"
      >
        {editingItem && (
          <form onSubmit={handleSaveModal} className="space-y-4">
            <Input
              label="Caption / Description"
              value={editingItem.caption}
              onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Event / Milestone Name"
                value={editingItem.event_name}
                onChange={(e) => setEditingItem({ ...editingItem, event_name: e.target.value })}
                placeholder="e.g. Annual Tech Symposium"
                required
              />
              <Input
                label="Event Date"
                type="date"
                value={editingItem.event_date}
                onChange={(e) => setEditingItem({ ...editingItem, event_date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
                >
                  <option value="Hackathons">Hackathons</option>
                  <option value="Technical Events">Technical Events</option>
                  <option value="College Memories">College Memories</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Project Demos">Project Demos</option>
                  <option value="Team Moments">Team Moments</option>
                  <option value="Awards">Awards</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <Input
                label="Album Name"
                value={editingItem.album}
                onChange={(e) => setEditingItem({ ...editingItem, album: e.target.value })}
                placeholder="e.g. Hackathons, 2024"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-1.5">
                  Media Type
                </label>
                <select
                  value={editingItem.media_type}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      media_type: e.target.value as 'image' | 'video',
                    })
                  }
                  className="w-full bg-white text-sm p-2.5 border border-[#E8ECE9] rounded-editorial focus:ring-2 focus:ring-[#43866A] focus:outline-none"
                >
                  <option value="image">Still Image</option>
                  <option value="video">Embedded Video</option>
                </select>
              </div>

              {editingItem.media_type === 'video' && (
                <Input
                  label="Video Embed URL (YouTube)"
                  value={editingItem.video_embed_url || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, video_embed_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              )}
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
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Details
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Photo"
        message="Are you sure you want to permanently remove this moment from the visual gallery?"
      />
    </div>
  );
};

