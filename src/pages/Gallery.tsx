import React, { useState, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video,
  Play,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { useGallery } from '@/hooks/useGallery';
import { GalleryItem } from '@/lib/types';
import { Helmet } from 'react-helmet-async';

const CATEGORIES = [
  'All',
  'Hackathons',
  'Technical Events',
  'College Memories',
  'Workshops',
  'Project Demos',
  'Team Moments',
  'Awards',
  'Personal',
];

export const Gallery: React.FC = () => {
  const { items, loading } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Extract unique albums
  const albums = useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.album).filter(Boolean)));
    return ['All', ...list];
  }, [items]);

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchAlbum =
        selectedAlbum === 'All' || item.album.toLowerCase() === selectedAlbum.toLowerCase();
      return matchCat && matchAlbum;
    });
  }, [items, selectedCategory, selectedAlbum]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;
      if (e.key === 'Escape') {
        setActiveItem(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
        if (idx !== -1 && idx < filteredItems.length - 1) {
          setActiveItem(filteredItems[idx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
        if (idx > 0) {
          setActiveItem(filteredItems[idx - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, filteredItems]);

  const renderMediaContent = (item: GalleryItem) => {
    if (item.media_type === 'video' && item.video_embed_url) {
      let embedSrc = item.video_embed_url;
      if (embedSrc.includes('youtube.com/watch?v=')) {
        const id = embedSrc.split('v=')[1]?.split('&')[0];
        embedSrc = `https://www.youtube.com/embed/${id}`;
      }
      return (
        <div className="aspect-video w-full max-w-4xl bg-black rounded overflow-hidden">
          <iframe
            src={embedSrc}
            title={item.caption}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <img
        src={item.media_url}
        alt={item.caption}
        className="max-w-full max-h-[75vh] object-contain rounded shadow-modal"
      />
    );
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Visual Gallery & Campus Moments — Ranvir</title>
        <meta
          name="description"
          content="A visual archive of hackathon sleepless nights, lab experiments, symposium keynotes, and campus memories documented by Ranvir."
        />
      </Helmet>

      {/* Header & Controls */}
      <Section size="md" background="white" className="border-b border-[#E8ECE9]">
        <SectionHeading
          label="The Visual Archive"
          title="Moments & Memories"
          subtitle="A candid, authentic visual archive of hackathons, technical events, workshops, and engineering teamwork."
        />

        {/* Filters */}
        <div className="space-y-3 pt-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#202520] text-white shadow-xs'
                    : 'bg-[#F7F8F7] text-[#585F5A] border border-[#E8ECE9] hover:bg-[#EFF2F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Album Selector (if multiple albums exist) */}
          {albums.length > 2 && (
            <div className="flex items-center gap-2 pt-2 text-xs text-[#777F79]">
              <span className="font-semibold uppercase text-[10px] text-[#585F5A]">
                Album:
              </span>
              <div className="flex flex-wrap gap-1">
                {albums.map((album) => (
                  <button
                    key={album}
                    type="button"
                    onClick={() => setSelectedAlbum(album)}
                    className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                      selectedAlbum === album
                        ? 'bg-[#EBF3EF] text-[#43866A] font-medium'
                        : 'text-[#777F79] hover:text-[#202520]'
                    }`}
                  >
                    {album}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Gallery Grid */}
      <Section size="lg" background="secondary">
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No gallery moments found"
            message="No photographs or video entries matched the selected filter."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative bg-white border border-[#E8ECE9] rounded-editorial overflow-hidden shadow-subtle cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 flex flex-col"
              >
                {/* Media Image / Video Poster */}
                <div className="aspect-[4/3] overflow-hidden bg-black/5 relative">
                  <img
                    src={item.media_url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  {item.media_type === 'video' && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" /> Video
                    </div>
                  )}
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white">
                    <p className="text-xs line-clamp-2 leading-snug drop-shadow-sm">
                      {item.caption}
                    </p>
                  </div>
                </div>

                {/* Card Caption Footer */}
                <div className="p-4 border-t border-[#E8ECE9] bg-white space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#777F79]">
                    <span className="font-semibold text-[#43866A] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="font-mono">
                      {new Date(item.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-[#202520] line-clamp-1">
                    {item.event_name || item.caption}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setActiveItem(null)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white/80 py-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#43866A] font-semibold">
                {activeItem.category} • {activeItem.event_name}
              </span>
              <p className="text-[11px] text-white/60 font-mono">
                {new Date(activeItem.event_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Close Lightbox"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Media Centerpiece */}
          <div
            className="flex-1 flex items-center justify-center p-2 max-w-5xl max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {renderMediaContent(activeItem)}
          </div>

          {/* Caption & Navigation Controls */}
          <div
            className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-white/10 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs sm:text-sm text-white/90 max-w-xl text-center sm:text-left leading-relaxed">
              {activeItem.caption}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
                onClick={() => {
                  const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
                  if (idx > 0) setActiveItem(filteredItems[idx - 1]);
                }}
                disabled={filteredItems.findIndex((i) => i.id === activeItem.id) <= 0}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
                onClick={() => {
                  const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
                  if (idx !== -1 && idx < filteredItems.length - 1) {
                    setActiveItem(filteredItems[idx + 1]);
                  }
                }}
                disabled={
                  filteredItems.findIndex((i) => i.id === activeItem.id) >=
                  filteredItems.length - 1
                }
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
