import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  ExternalLink,
  MapPin,
  ArrowRight,
  Monitor,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Edit2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/admin/components/ImageUploader';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useToast } from '@/contexts/ToastContext';
import { ExploreCard } from '@/lib/types';
import { Link } from 'react-router-dom';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      success('Homepage hero and focus status updated successfully.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A] inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Homepage Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
            Single-Screen Hero & Focus
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Customize the live hero greeting, headline, portrait photo, and floating status card displayed on the single-screen home view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#43866A] bg-[#EBF3EF] border border-[#D1DFD8] px-3.5 py-2 rounded-editorial hover:bg-[#DDF0E6] transition-colors"
          >
            <span>Preview Live Homepage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-[#EBF3EF]/70 border border-[#D1DFD8] rounded-editorial p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#43866A] text-white flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#202520]">
              Active Layout: Single-Screen Editorial Hero
            </p>
            <p className="text-[11px] text-[#585F5A]">
              The public homepage is locked to a non-scrollable viewport featuring the hero, your portrait with live status, and the solitary "View My Work" action.
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8ECE9]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#585F5A]">
            Live Visual Preview
          </span>
          <span className="text-[11px] text-[#777F79] italic">
            Updates in real-time as you type
          </span>
        </div>

        <div className="bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Preview Left: Copy */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EF] border border-[#D1DFD8] text-xs font-semibold text-[#43866A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43866A] animate-pulse" />
                <span>{formData.hero_greeting || 'Hello, I am Ranvir'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520] tracking-tight leading-snug">
                {formData.hero_heading || 'Exploring Technology. Building My Journey.'}
              </h2>

              <p className="text-xs sm:text-sm text-[#777F79] leading-relaxed line-clamp-3">
                {formData.hero_intro || 'A Computer Engineering student fascinated by how secure code and enterprise data architectures shape resilient real-world systems.'}
              </p>

              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-editorial bg-[#202520] text-white text-xs font-medium shadow-sm">
                  <span>View My Work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Preview Right: Photo & Status Card */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[220px]">
                <div className="aspect-[4/5] rounded-editorial overflow-hidden border border-[#E8ECE9] shadow-sm bg-white">
                  <img
                    src={
                      formData.hero_image_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md border border-[#E8ECE9] rounded-editorial p-2.5 shadow-modal max-w-[190px]">
                  <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[#43866A] mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43866A]" />
                    <span>Current Focus</span>
                  </div>
                  <p className="text-[10px] font-medium text-[#202520] leading-tight line-clamp-2">
                    {formData.status_text || 'Exploring SAP Security & Full-Stack Systems'}
                  </p>
                  <div className="mt-1 pt-1 border-t border-[#E8ECE9] flex items-center gap-1 text-[9px] text-[#777F79]">
                    <MapPin className="w-2.5 h-2.5 text-[#43866A]" />
                    <span>{formData.location_label || 'Mumbai, India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleHeroSave} className="space-y-6">
        <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 shadow-subtle space-y-5">
          <h2 className="font-serif text-lg font-semibold text-[#202520] pb-2 border-b border-[#E8ECE9]">
            Hero Content & Status Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hero Greeting / Pill"
              value={formData.hero_greeting}
              onChange={(e) => setFormData({ ...formData, hero_greeting: e.target.value })}
              placeholder="Hello, I am Ranvir"
              helperText="The small green badge displayed above your main heading."
              required
            />
            <Input
              label="Hero Heading (Serif Font)"
              value={formData.hero_heading}
              onChange={(e) => setFormData({ ...formData, hero_heading: e.target.value })}
              placeholder="Exploring Technology. Building My Journey."
              helperText="The bold statement headline introducing your work."
              required
            />
          </div>

          <Textarea
            label="Hero Introduction Paragraph"
            value={formData.hero_intro}
            onChange={(e) => setFormData({ ...formData, hero_intro: e.target.value })}
            rows={3}
            helperText="A concise summary of your focus areas, interests, and engineering passion."
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
                label="Floating Status Text (Current Focus)"
                value={formData.status_text}
                onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                placeholder="Exploring SAP Security & Full-Stack Systems"
                helperText="Displayed in the floating card anchored over your portrait photo."
                required
              />
              <Input
                label="Location Label"
                value={formData.location_label}
                onChange={(e) => setFormData({ ...formData, location_label: e.target.value })}
                placeholder="Mumbai, India"
                helperText="Geographic location shown next to the pin icon."
                required
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Homepage Hero
          </Button>
        </div>

        {/* Collapsible Advanced / Archival Content */}
        <div className="bg-white border border-[#E8ECE9] rounded-editorial overflow-hidden shadow-subtle">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F7F8F7] transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-[#202520]">
                Extended Settings & Archive Cards
              </p>
              <p className="text-[11px] text-[#777F79]">
                Closing quote, explore cards, and legacy section toggles.
              </p>
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-[#777F79]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#777F79]" />
            )}
          </button>

          {showAdvanced && (
            <div className="p-6 border-t border-[#E8ECE9] space-y-6">
              <Textarea
                label="Closing Quote"
                value={formData.closing_quote || ''}
                onChange={(e) => setFormData({ ...formData, closing_quote: e.target.value })}
                rows={2}
                helperText="Reserved for multi-section layouts."
              />

              <div className="pt-4 border-t border-[#E8ECE9]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#585F5A] mb-3">
                  Explore Cards Archive ({exploreCards.length})
                </h3>
                <div className="space-y-2">
                  {exploreCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-3 border border-[#E8ECE9] rounded-editorial bg-[#F7F8F7]/60"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#202520]">{card.title}</p>
                        <p className="text-[11px] text-[#777F79] line-clamp-1">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, 'up')}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="p-1 text-[#777F79] hover:text-[#202520] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, 'down')}
                          disabled={idx === exploreCards.length - 1}
                          aria-label="Move down"
                          className="p-1 text-[#777F79] hover:text-[#202520] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleCardVisibility(card)}
                          aria-label="Toggle visibility"
                          className="p-1 text-[#777F79] hover:text-[#202520]"
                        >
                          {card.visible ? (
                            <Eye className="w-3.5 h-3.5 text-[#43866A]" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-[#9CA39E]" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCard(card)}
                          aria-label="Edit card"
                          className="p-1 text-[#777F79] hover:text-[#202520]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Card Edit Modal */}
      {editingCard && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCard(null)}
          title="Edit Explore Card"
          subtitle="Update card title, description, and icon name."
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingCard(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="explore-card-form"
                variant="primary"
                size="sm"
              >
                Save Card
              </Button>
            </>
          }
        >
          <form id="explore-card-form" onSubmit={handleSaveCardModal} className="space-y-4">
            <Input
              label="Card Title"
              value={editingCard.title}
              onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
              required
            />
            <Textarea
              label="Card Description"
              value={editingCard.description}
              onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
              rows={3}
              required
            />
            <Input
              label="Lucide Icon Name"
              value={editingCard.icon}
              onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
              helperText="e.g. ShieldCheck, Database, BarChart3, Code2"
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
