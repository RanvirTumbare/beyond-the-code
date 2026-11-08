import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Save,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useToast } from '@/contexts/ToastContext';
import { ExploreCard } from '@/lib/types';

export const AdminHomepage: React.FC = () => {
  const {
    content,
    exploreCards,
    updateHomeContent,
    updateExploreCard,
    reorderExploreCards,
  } = useHomeContent();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  // Card Edit Modal state
  const [editingCard, setEditingCard] = useState<ExploreCard | null>(null);

  // Sync initial content once loaded
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateHomeContent(formData);
    setIsSaving(false);
    if (res.success) {
      success('Homepage hero and section toggles updated successfully.');
    } else {
      toastError(res.error || 'Failed to update homepage content.');
    }
  };

  const handleMoveCard = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= exploreCards.length) return;

    const newCards = [...exploreCards];
    const [moved] = newCards.splice(index, 1);
    newCards.splice(targetIndex, 0, moved);

    const res = await reorderExploreCards(newCards);
    if (res.success) {
      success('Explore cards reordered.');
    } else {
      toastError('Failed to reorder cards.');
    }
  };

  const handleToggleCardVisibility = async (card: ExploreCard) => {
    const res = await updateExploreCard(card.id, { visible: !card.visible });
    if (res.success) {
      success(`Card "${card.title}" visibility toggled.`);
    }
  };

  const handleSaveCardModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    const res = await updateExploreCard(editingCard.id, {
      title: editingCard.title,
      description: editingCard.description,
      icon: editingCard.icon,
    });
    if (res.success) {
      success('Card details saved.');
      setEditingCard(null);
    } else {
      toastError('Failed to update card.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          Page Content Manager
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          Homepage & Hero Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Customize the hero greeting, portrait photo, focus status, and section visibility.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleHeroSave} className="space-y-6">
        {/* Section 1: Hero Content */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Hero Headline & Copy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hero Greeting / Pill"
              value={formData.hero_greeting}
              onChange={(e) => setFormData({ ...formData, hero_greeting: e.target.value })}
              placeholder="Hello, I am Ranvir"
              required
            />
            <Input
              label="Hero Heading (Serif)"
              value={formData.hero_heading}
              onChange={(e) => setFormData({ ...formData, hero_heading: e.target.value })}
              placeholder="Exploring Technology. Building My Journey."
              required
            />
          </div>

          <Textarea
            label="Hero Introduction Paragraph"
            value={formData.hero_intro}
            onChange={(e) => setFormData({ ...formData, hero_intro: e.target.value })}
            rows={3}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <ImageUploader
              label="Hero Portrait Photo"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              aspectRatio="square"
              folder="hero"
            />

            <div className="space-y-4">
              <Input
                label="Floating Status Text"
                value={formData.status_text}
                onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                placeholder="Exploring SAP Security & Full-Stack Systems"
                helperText="Shown in the floating card over your portrait photo."
              />
              <Input
                label="Location Label"
                value={formData.location_label}
                onChange={(e) => setFormData({ ...formData, location_label: e.target.value })}
                placeholder="Mumbai, India"
              />
              <Textarea
                label="Closing Quote"
                value={formData.closing_quote}
                onChange={(e) => setFormData({ ...formData, closing_quote: e.target.value })}
                rows={2}
                helperText="Appears in the closing section at the bottom of the homepage."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Section Visibility Toggles */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Section Visibility Toggles
          </h2>
          <p className="text-xs text-[#777F79]">
            Turn entire homepage sections on or off with a single click.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center justify-between p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer">
              <span className="text-xs font-medium text-[#202520]">
                "What I Explore" Section
              </span>
              <input
                type="checkbox"
                checked={formData.show_explore}
                onChange={(e) => setFormData({ ...formData, show_explore: e.target.checked })}
                className="w-4 h-4 accent-[#43866A]"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer">
              <span className="text-xs font-medium text-[#202520]">
                "Featured Projects" Section
              </span>
              <input
                type="checkbox"
                checked={formData.show_projects}
                onChange={(e) => setFormData({ ...formData, show_projects: e.target.checked })}
                className="w-4 h-4 accent-[#43866A]"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer">
              <span className="text-xs font-medium text-[#202520]">
                "Recent Diary Notes" Section
              </span>
              <input
                type="checkbox"
                checked={formData.show_recent}
                onChange={(e) => setFormData({ ...formData, show_recent: e.target.checked })}
                className="w-4 h-4 accent-[#43866A]"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/50 cursor-pointer">
              <span className="text-xs font-medium text-[#202520]">
                "Certificates Strip" Section
              </span>
              <input
                type="checkbox"
                checked={formData.show_certificates}
                onChange={(e) =>
                  setFormData({ ...formData, show_certificates: e.target.checked })
                }
                className="w-4 h-4 accent-[#43866A]"
              />
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Homepage Settings
          </Button>
        </div>
      </form>

      {/* Section 3: Explore Cards Reordering & Customization */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#202520]">
              "What I Explore" Cards
            </h2>
            <p className="text-xs text-[#777F79]">
              Reorder cards using up/down arrows or toggle visibility.
            </p>
          </div>
          <span className="text-xs font-medium text-[#43866A] bg-[#EBF3EF] px-2.5 py-1 rounded-full">
            {exploreCards.filter((c) => c.visible).length} / {exploreCards.length} Visible
          </span>
        </div>

        <div className="space-y-2">
          {exploreCards.map((card, idx) => (
            <div
              key={card.id}
              className={`flex items-center justify-between p-3.5 border rounded-editorial transition-colors ${
                card.visible
                  ? 'bg-white border-[#E8ECE9]'
                  : 'bg-[#F7F8F7] border-dashed border-[#D5DDD8] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#777F79] w-5">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#202520]">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-[#777F79] line-clamp-1 max-w-md">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveCard(idx, 'up')}
                  className="p-1 text-[#777F79] hover:text-[#202520] disabled:opacity-20"
                  aria-label="Move card up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === exploreCards.length - 1}
                  onClick={() => handleMoveCard(idx, 'down')}
                  className="p-1 text-[#777F79] hover:text-[#202520] disabled:opacity-20"
                  aria-label="Move card down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                {/* Toggle Visibility */}
                <button
                  type="button"
                  onClick={() => handleToggleCardVisibility(card)}
                  title={card.visible ? 'Hide from public view' : 'Show on homepage'}
                  className="p-1.5 rounded hover:bg-[#EFF2F0] text-[#585F5A]"
                >
                  {card.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {/* Edit Modal */}
                <button
                  type="button"
                  onClick={() => setEditingCard(card)}
                  title="Edit details"
                  className="p-1.5 rounded hover:bg-[#EBF3EF] text-[#43866A]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Edit Modal */}
      <Modal
        isOpen={Boolean(editingCard)}
        onClose={() => setEditingCard(null)}
        title="Edit Explore Card"
        subtitle="Update the title, description, and icon."
      >
        {editingCard && (
          <form onSubmit={handleSaveCardModal} className="space-y-4">
            <Input
              label="Card Title"
              value={editingCard.title}
              onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              value={editingCard.description}
              onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
              rows={3}
              required
            />
            <Input
              label="Lucide Icon Name"
              value={editingCard.icon}
              onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
              helperText="Common icons: Shield, Layers, BarChart3, Code2, Sparkles, Database, Terminal."
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8ECE9]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingCard(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Card
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

